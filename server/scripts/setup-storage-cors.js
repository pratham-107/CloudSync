require('dotenv').config();
const { PutBucketCorsCommand } = require('@aws-sdk/client-s3');
const { s3Client } = require('../src/config/aws');

// Origins that may upload/download directly from the browser (comma separated).
// Defaults to '*' (allow any origin) which is fine for a public demo; restrict it
// to your client origin via STORAGE_CORS_ORIGINS for tighter control.
const ORIGINS = (process.env.STORAGE_CORS_ORIGINS || '*')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const RUNNER = async () => {
  await s3Client.send(
    new PutBucketCorsCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedOrigins: ORIGINS,
            AllowedMethods: ['PUT', 'GET', 'HEAD'],
            AllowedHeaders: ['*'],
            MaxAgeSeconds: 3000,
          },
        ],
      },
    })
  );
  console.log(`CORS policy applied for origins: ${ORIGINS.join(', ')}`);
};

RUNNER().catch((err) => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});