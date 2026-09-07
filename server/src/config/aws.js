const { S3Client } = require('@aws-sdk/client-s3');

const isMinIO = !!process.env.AWS_S3_ENDPOINT;

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
  ...(isMinIO
    ? {
        endpoint: process.env.AWS_S3_ENDPOINT,
        forcePathStyle: true,
      }
    : {}),
});

if (isMinIO) {
  s3Client.middlewareStack.add(
    (next) =>
      async (args) => {
        const req = args.request;
        delete req.headers['x-amz-sdk-checksum-algorithm'];
        delete req.headers['x-amz-checksum-crc32'];
        delete req.headers['x-amz-checksum-sha1'];
        delete req.headers['x-amz-checksum-sha256'];
        return next(args);
      },
    { step: 'build', priority: 'low', name: 'stripMinIOChecksums' }
  );
}

module.exports = { s3Client };