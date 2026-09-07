const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
      default: null,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    s3Key: {
      type: String,
      required: true,
    },
    s3Url: {
      type: String,
    },
    thumbnailKey: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

assetSchema.index({ ownerId: 1, folderId: 1, createdAt: -1 });
assetSchema.index({ name: 'text', tags: 'text' });

module.exports = mongoose.model('Asset', assetSchema);
