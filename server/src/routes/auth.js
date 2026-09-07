const { Router } = require('express');
const authController = require('../controllers/authController');
const { validate } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const { authenticate } = require('../middleware/auth');
const {
  registerSchema,
  loginSchema,
  refreshSchema,
} = require('../utils/validators');

const router = Router();

router.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  authController.register
);

router.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  authController.login
);

router.post(
  '/refresh',
  validate(refreshSchema),
  authController.refresh
);

router.get(
  '/me',
  authenticate,
  authController.getMe
);

module.exports = router;
