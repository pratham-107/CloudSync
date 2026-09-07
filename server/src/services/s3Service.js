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

const isPrivateStorage = () => {
  return (
    !process.env.AWS_CLOUDFRONT_DOMAIN &&
    !process.env.AWS_PUBLIC_BASE_URL &&
    !process.env.AWS_S3_ENDPOINT
  );
};

// Returns a publicable URL for an object. When storage is private (e.g.
// Filebase free tier has no public buckets), mints a short-lived presigned
// GET URL so previews/downloads still work without leaking credentials.
const getObjectUrl = async (s3Key) => {
  const cfDomain = process.env.AWS_CLOUDFRONT_DOMAIN;
  if (cfDomain) return `https://${cfDomain}/${s3Key}`;

  const publicBase = process.env.AWS_PUBLIC_BASE_URL;
  if (publicBase) return `${publicBase.replace(/\/$/, '')}/${s3Key}`;

  const endpoint = process.env.AWS_S3_ENDPOINT;
  if (endpoint) return `${endpoint.replace(/\/$/, '')}/${BUCKET}/${s3Key}`;

  if (isPrivateStorage()) {
    const command = new GetObjectCommand({ Bucket: BUCKET, Key: s3Key });
    return getSignedUrl(s3Client, command, { expiresIn: EXPIRES_IN });
  }

  return `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
};

module.exports = { generateUploadUrl, deleteFile, getObjectUrl, isPrivateStorage };