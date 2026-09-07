const User = require('../models/User');

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

const checkAccountLock = async (email) => {
  const user = await User.findOne({ email }).select('+lockedUntil');
  if (!user) return false;

  if (user.lockedUntil && user.lockedUntil > Date.now()) {
    return true;
  }

  if (user.lockedUntil && user.lockedUntil <= Date.now()) {
    user.failedAttempts = 0;
    user.lockedUntil = undefined;
    await user.save();
  }

  return false;
};

const incrementFailedAttempts = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return;

  user.failedAttempts = (user.failedAttempts || 0) + 1;

  if (user.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    user.lockedUntil = Date.now() + LOCK_TIME;
  }

  await user.save();
};

const resetFailedAttempts = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return;

  user.failedAttempts = 0;
  user.lockedUntil = undefined;
  await user.save();
};

module.exports = {
  checkAccountLock,
  incrementFailedAttempts,
  resetFailedAttempts,
};
