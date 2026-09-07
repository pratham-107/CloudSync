const {
  PutObjectCommand,
  DeleteObjectCommand,
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

const getCloudFrontUrl = (s3Key) => {
  const cfDomain = process.env.AWS_CLOUDFRONT_DOMAIN;
  if (cfDomain) return `https://${cfDomain}/${s3Key}`;

  const endpoint = process.env.AWS_S3_ENDPOINT;
  if (endpoint) {
    return `${endpoint}/${BUCKET}/${s3Key}`;
  }

  return `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
};

module.exports = { generateUploadUrl, deleteFile, getCloudFrontUrl };