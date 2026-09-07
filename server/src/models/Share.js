const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
  assetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  passwordHash: {
    type: String,
    select: false,
  },
  expiresAt: {
    type: Date,
    default: null,
    index: { expires: 0 }, // TTL index: auto-delete when expired
  },
  accessCount: {
    type: Number,
    default: 0,
  },
  maxAccess: {
    type: Number,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Share', shareSchema);
