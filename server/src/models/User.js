const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    storageUsed: {
      type: Number,
      default: 0,
    },
    storageLimit: {
      type: Number,
      default: 5 * 1024 * 1024 * 1024, // 5GB
    },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

userSchema.methods.getRemainingStorage = function () {
  return this.storageLimit - this.storageUsed;
};

module.exports = mongoose.model('User', userSchema);
