const {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid');
const { s3Client } = require('../config/aws');

const BUCKET = process.env.AWS_S3_BUCKET;
const EXPIRES_IN = 900; // 15 minutes
const MAX_PRESIGN_EXPIRES = 7 * 24 * 60 * 60; // 7 days (SigV4 presign cap)

const generateUploadUrl = async (userId, filename, mimeType) => {
  const ext = filename.split('.').pop();
  const s3Key = `${userId}/${uuidv4()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: s3Key,
    ContentType: mimeType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: EXPIRES_IN,
  });

  return { uploadUrl, s3Key, expiresIn: EXPIRES_IN };
};

const deleteFile = async (s3Key) => {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: s3Key,
  });
  await s3Client.send(command);
};

// Returns a publicable URL for an object. When no public CDN/base is
// configured (AWS, MinIO, Filebase), mints a presigned GET URL so
// previews/downloads work on private buckets without leaking credentials.
const getObjectUrl = async (s3Key, { expiresIn = EXPIRES_IN } = {}) => {
  const cfDomain = process.env.AWS_CLOUDFRONT_DOMAIN;
  if (cfDomain) return `https://${cfDomain}/${s3Key}`;

  const publicBase = process.env.AWS_PUBLIC_BASE_URL;
  if (publicBase) return `${publicBase.replace(/\/$/, '')}/${s3Key}`;

  const command = new GetObjectCommand({ Bucket: BUCKET, Key: s3Key });
  return getSignedUrl(s3Client, command, {
    expiresIn: Math.min(expiresIn, MAX_PRESIGN_EXPIRES),
  });
};

module.exports = { generateUploadUrl, deleteFile, getObjectUrl };