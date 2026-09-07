const { Router } = require('express');
const shareController = require('../controllers/shareController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { shareLimiter } = require('../middleware/rateLimiter');
const { createShareSchema } = require('../utils/validators');

const router = Router();

router.post(
  '/',
  authenticate,
  validate(createShareSchema),
  shareController.createShare
);

router.get('/:token', shareLimiter, shareController.accessShare);

router.delete('/:shareId', authenticate, shareController.revokeShare);

module.exports = router;
