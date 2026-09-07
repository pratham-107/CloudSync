const Asset = require('../models/Asset');
const User = require('../models/User');
const Folder = require('../models/Folder');
const s3Service = require('../services/s3Service');

const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
  'video/mp4', 'video/webm', 'video/quicktime',
  'application/pdf',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip', 'application/x-rar-compressed',
  'text/plain', 'text/csv',
  'audio/mpeg', 'audio/wav', 'audio/ogg',
];

const getAssets = async (req, res, next) => {
  try {
    const {
      folderId = null,
      page = 1,
      limit = 50,
      sort = 'createdAt',
      order = 'desc',
      search,
    } = req.query;

    const query = { ownerId: req.user._id };

    if (folderId) {
      query.folderId = folderId;
    } else {
      query.folderId = null;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;

    const [assets, total] = await Promise.all([
      Asset.find(query).sort(sortObj).skip(skip).limit(limitNum),
      Asset.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        assets: await Promise.all(
          assets.map(async (a) => ({
            assetId: a._id,
            name: a.name,
            originalName: a.originalName,
            mimeType: a.mimeType,
            size: a.size,
            s3Url: await s3Service.getObjectUrl(a.s3Key),
            thumbnailUrl: a.thumbnailKey
              ? await s3Service.getObjectUrl(a.thumbnailKey)
              : null,
            tags: a.tags,
            isStarred: a.isStarred,
            folderId: a.folderId,
            createdAt: a.createdAt,
            updatedAt: a.updatedAt,
          }))
        ),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

const getUploadUrl = async (req, res, next) => {
  try {
    const { filename, mimeType, size, folderId } = req.body;

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      const error = new Error('File type not allowed');
      error.statusCode = 400;
      error.code = 'INVALID_FILE_TYPE';
      throw error;
    }

    const user = await User.findById(req.user._id);
    if (user.storageUsed + size > user.storageLimit) {
      const error = new Error('Storage quota exceeded');
      error.statusCode = 400;
      error.code = 'STORAGE_QUOTA_EXCEEDED';
      throw error;
    }

    if (folderId) {
      const folder = await Folder.findOne({ _id: folderId, ownerId: req.user._id });
      if (!folder) {
        const error = new Error('Folder not found');
        error.statusCode = 404;
        error.code = 'RESOURCE_NOT_FOUND';
        throw error;
      }
    }

    const { uploadUrl, s3Key, expiresIn } = await s3Service.generateUploadUrl(
      req.user._id,
      filename,
      mimeType
    );

    const asset = await Asset.create({
      ownerId: req.user._id,
      folderId: folderId || null,
      name: filename,
      originalName: filename,
      mimeType,
      size,
      s3Key,
    });

    res.status(200).json({
      success: true,
      data: {
        uploadUrl,
        s3Key,
        assetId: asset._id,
        expiresIn,
      },
    });
  } catch (err) {
    next(err);
  }
};

const confirmUpload = async (req, res, next) => {
  try {
    const { assetId, s3Key, name, originalName, mimeType, size, folderId, tags } =
      req.body;

    const asset = await Asset.findOne({ _id: assetId, ownerId: req.user._id });
    if (!asset) {
      const error = new Error('Asset not found');
      error.statusCode = 404;
      error.code = 'RESOURCE_NOT_FOUND';
      throw error;
    }

    if (asset.s3Key !== s3Key) {
      const error = new Error('S3 key mismatch');
      error.statusCode = 400;
      error.code = 'VALIDATION_ERROR';
      throw error;
    }

    asset.name = name;
    asset.originalName = originalName;
    asset.mimeType = mimeType;
    asset.size = size;
    asset.folderId = folderId || null;
    asset.tags = tags || [];
    asset.s3Url = await s3Service.getObjectUrl(s3Key);
    await asset.save();

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { storageUsed: size },
    });

    res.status(201).json({
      success: true,
      data: {
        assetId: asset._id,
        name: asset.name,
        s3Url: asset.s3Url,
        size: asset.size,
        createdAt: asset.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findOne({
      _id: req.params.assetId,
      ownerId: req.user._id,
    });

    if (!asset) {
      const error = new Error('Asset not found');
      error.statusCode = 404;
      error.code = 'RESOURCE_NOT_FOUND';
      throw error;
    }

    let folderPath = null;
    if (asset.folderId) {
      const folder = await Folder.findById(asset.folderId);
      if (folder) folderPath = folder.path;
    }

    res.status(200).json({
      success: true,
      data: {
        assetId: asset._id,
        name: asset.name,
        originalName: asset.originalName,
        mimeType: asset.mimeType,
        size: asset.size,
        s3Url: await s3Service.getObjectUrl(asset.s3Key),
        thumbnailUrl: asset.thumbnailKey
          ? await s3Service.getObjectUrl(asset.thumbnailKey)
          : null,
        tags: asset.tags,
        isStarred: asset.isStarred,
        folderId: asset.folderId,
        folderPath,
        createdAt: asset.createdAt,
        updatedAt: asset.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findOneAndUpdate(
      { _id: req.params.assetId, ownerId: req.user._id },
      { $set: req.body },
      { new: true }
    );

    if (!asset) {
      const error = new Error('Asset not found');
      error.statusCode = 404;
      error.code = 'RESOURCE_NOT_FOUND';
      throw error;
    }

    res.status(200).json({
      success: true,
      data: {
        assetId: asset._id,
        name: asset.name,
        tags: asset.tags,
        isStarred: asset.isStarred,
        updatedAt: asset.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

const deleteAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findOne({
      _id: req.params.assetId,
      ownerId: req.user._id,
    });

    if (!asset) {
      const error = new Error('Asset not found');
      error.statusCode = 404;
      error.code = 'RESOURCE_NOT_FOUND';
      throw error;
    }

    await s3Service.deleteFile(asset.s3Key);
    if (asset.thumbnailKey) {
      await s3Service.deleteFile(asset.thumbnailKey);
    }

    await Asset.findByIdAndDelete(asset._id);

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { storageUsed: -asset.size },
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAssets,
  getUploadUrl,
  confirmUpload,
  getAsset,
  updateAsset,
  deleteAsset,
};
