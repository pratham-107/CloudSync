require('dotenv').config();
const {
  HeadBucketCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
} = require('@aws-sdk/client-s3');
const { s3Client } = require('../src/config/aws');

const BUCKET = process.env.AWS_S3_BUCKET;

const run = async () => {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET }));
    console.log(`Bucket "${BUCKET}" already exists`);
  } catch {
    await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET }));
    console.log(`Bucket "${BUCKET}" created`);
  }

  const policy = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: { AWS: ['*'] },
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${BUCKET}/*`],
      },
    ],
  };

  await s3Client.send(
    new PutBucketPolicyCommand({
      Bucket: BUCKET,
      Policy: JSON.stringify(policy),
    })
  );
  console.log('Public-read policy applied');

  // NOTE: MinIO serves browser preflight (OPTIONS) itself and does not
  // implement PutBucketCors, so no CORS configuration is applied here.
};

run().catch((err) => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});