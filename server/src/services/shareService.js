const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const Share = require('../models/Share');
const Asset = require('../models/Asset');
const s3Service = require('./s3Service');

const generateToken = () => {
  return uuidv4().replace(/-/g, '').substring(0, 16);
};

const createShare = async ({ assetId, userId, expiresAt, password, maxAccess }) => {
  const asset = await Asset.findOne({ _id: assetId, ownerId: userId });
  if (!asset) {
    const error = new Error('Asset not found');
    error.statusCode = 404;
    error.code = 'RESOURCE_NOT_FOUND';
    throw error;
  }

  const shareData = {
    assetId,
    token: generateToken(),
    expiresAt: expiresAt || null,
    maxAccess: maxAccess || null,
  };

  if (password) {
    shareData.passwordHash = await bcrypt.hash(password, 10);
  }

  const share = await Share.create(shareData);

  return {
    shareId: share._id,
    token: share.token,
    shareUrl: `${process.env.APP_URL || 'http://localhost:3000'}/s/${share.token}`,
    expiresAt: share.expiresAt,
    maxAccess: share.maxAccess,
    createdAt: share.createdAt,
  };
};

const accessShare = async (token, password) => {
  const share = await Share.findOne({ token }).select('+passwordHash');
  if (!share) {
    const error = new Error('Share link not found');
    error.statusCode = 404;
    error.code = 'RESOURCE_NOT_FOUND';
    throw error;
  }

  if (share.expiresAt && share.expiresAt < new Date()) {
    const error = new Error('Share link has expired');
    error.statusCode = 410;
    error.code = 'SHARE_EXPIRED';
    throw error;
  }

  if (share.maxAccess && share.accessCount >= share.maxAccess) {
    const error = new Error('Max access limit reached');
    error.statusCode = 429;
    error.code = 'RATE_LIMITED';
    throw error;
  }

  if (share.passwordHash) {
    if (!password) {
      const error = new Error('Password required');
      error.statusCode = 401;
      error.code = 'UNAUTHORIZED';
      throw error;
    }
    const valid = await bcrypt.compare(password, share.passwordHash);
    if (!valid) {
      const error = new Error('Invalid password');
      error.statusCode = 401;
      error.code = 'UNAUTHORIZED';
      throw error;
    }
  }

  share.accessCount += 1;
  await share.save();

  const asset = await Asset.findById(share.assetId);
  if (!asset) {
    const error = new Error('Asset no longer exists');
    error.statusCode = 410;
    error.code = 'SHARE_EXPIRED';
    throw error;
  }

  const expiresIn = share.expiresAt
    ? Math.max(0, Math.floor((share.expiresAt - new Date()) / 1000))
    : null;

  const baseUrl = await s3Service.getObjectUrl(asset.s3Key, {
    expiresIn: expiresIn || 7 * 24 * 60 * 60,
  });

  return {
    asset: {
      name: asset.name,
      mimeType: asset.mimeType,
      size: asset.size,
      s3Url: baseUrl,
    },
    downloadUrl: baseUrl,
    expiresIn,
  };
};

const revokeShare = async (shareId, userId) => {
  const share = await Share.findById(shareId);
  if (!share) {
    const error = new Error('Share not found');
    error.statusCode = 404;
    error.code = 'RESOURCE_NOT_FOUND';
    throw error;
  }

  const asset = await Asset.findOne({ _id: share.assetId, ownerId: userId });
  if (!asset) {
    const error = new Error('Share not found');
    error.statusCode = 404;
    error.code = 'RESOURCE_NOT_FOUND';
    throw error;
  }

  await Share.findByIdAndDelete(shareId);
};

module.exports = { createShare, accessShare, revokeShare };
