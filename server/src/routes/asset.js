const { Router } = require('express');
const assetController = require('../controllers/assetController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { uploadLimiter } = require('../middleware/rateLimiter');
const {
  uploadUrlSchema,
  confirmUploadSchema,
  updateAssetSchema,
} = require('../utils/validators');

const router = Router();

router.use(authenticate);

router.get('/', assetController.getAssets);

router.post(
  '/upload-url',
  uploadLimiter,
  validate(uploadUrlSchema),
  assetController.getUploadUrl
);

router.post(
  '/',
  validate(confirmUploadSchema),
  assetController.confirmUpload
);

router.get('/:assetId', assetController.getAsset);

router.patch(
  '/:assetId',
  validate(updateAssetSchema),
  assetController.updateAsset
);

router.delete('/:assetId', assetController.deleteAsset);

module.exports = router;
