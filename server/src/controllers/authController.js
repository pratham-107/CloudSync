const authService = require('../services/authService');
const {
  checkAccountLock,
  incrementFailedAttempts,
  resetFailedAttempts,
} = require('../services/accountLockService');

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);

    res.status(201).json({
      success: true,
      data: {
        userId: result.userId,
        email: result.email,
        name: result.name,
        storageLimit: result.storageLimit,
        createdAt: result.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const isLocked = await checkAccountLock(req.body.email);
    if (isLocked) {
      return res.status(423).json({
        success: false,
        error: {
          code: 'LOCKED',
          message: 'Account temporarily locked due to too many failed attempts',
          status: 423,
        },
      });
    }

    const result = await authService.login(req.body);
    await resetFailedAttempts(req.body.email);

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    if (err.statusCode === 401) {
      await incrementFailedAttempts(req.body.email);
    }
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const result = await authService.refreshAccessToken(req.body.refreshToken);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'RESOURCE_NOT_FOUND';
      throw error;
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          userId: user._id,
          email: user.email,
          name: user.name,
          storageUsed: user.storageUsed,
          storageLimit: user.storageLimit,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, refresh, getMe };
