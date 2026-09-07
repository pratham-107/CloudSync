const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const SALT_ROUNDS = 12;

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION || '7d' }
  );

  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '30d' }
  );

  return { accessToken, refreshToken };
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

const comparePassword = async (candidate, hash) => {
  return bcrypt.compare(candidate, hash);
};

const register = async ({ email, password, name }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    error.code = 'CONFLICT';
    throw error;
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({ email, passwordHash, name });

  const tokens = generateTokens(user._id);

  return {
    userId: user._id,
    email: user.email,
    name: user.name,
    storageLimit: user.storageLimit,
    createdAt: user.createdAt,
    ...tokens,
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    error.code = 'UNAUTHORIZED';
    throw error;
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    error.code = 'UNAUTHORIZED';
    throw error;
  }

  const tokens = generateTokens(user._id);

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    tokenType: 'Bearer',
    expiresIn: 604800,
    user: {
      userId: user._id,
      email: user.email,
      name: user.name,
      storageUsed: user.storageUsed,
      storageLimit: user.storageLimit,
    },
  };
};

const refreshAccessToken = async (refreshToken) => {
  const decoded = verifyToken(refreshToken);
  if (decoded.type !== 'refresh') {
    const error = new Error('Invalid refresh token');
    error.statusCode = 401;
    error.code = 'UNAUTHORIZED';
    throw error;
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 401;
    error.code = 'UNAUTHORIZED';
    throw error;
  }

  const { accessToken } = generateTokens(user._id);
  return { accessToken, expiresIn: 604800 };
};

module.exports = { register, login, refreshAccessToken, verifyToken, hashPassword };
