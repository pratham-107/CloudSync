const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
      default: null,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    path: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

folderSchema.index({ ownerId: 1, path: 1 });

module.exports = mongoose.model('Folder', folderSchema);
