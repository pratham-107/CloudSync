const Folder = require('../models/Folder');
const Asset = require('../models/Asset');
const s3Service = require('../services/s3Service');

const buildPath = async (parentId, userId) => {
  if (!parentId) return '/root';

  const parent = await Folder.findOne({ _id: parentId, ownerId: userId });
  if (!parent) {
    const error = new Error('Parent folder not found');
    error.statusCode = 404;
    error.code = 'RESOURCE_NOT_FOUND';
    throw error;
  }

  return `${parent.path}`;
};

const createFolder = async (req, res, next) => {
  try {
    const { name, parentId } = req.body;

    const existing = await Folder.findOne({
      ownerId: req.user._id,
      parentId: parentId || null,
      name,
    });
    if (existing) {
      const error = new Error('Folder name already exists in this location');
      error.statusCode = 400;
      error.code = 'VALIDATION_ERROR';
      throw error;
    }

    const parentPath = await buildPath(parentId, req.user._id);
    const path = `${parentPath}/${name}`;

    const folder = await Folder.create({
      ownerId: req.user._id,
      parentId: parentId || null,
      name,
      path,
    });

    res.status(201).json({
      success: true,
      data: {
        folderId: folder._id,
        name: folder.name,
        parentId: folder.parentId,
        path: folder.path,
        createdAt: folder.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getFolders = async (req, res, next) => {
  try {
    const { parentId = null } = req.query;

    const folders = await Folder.find({
      ownerId: req.user._id,
      parentId: parentId || null,
    }).sort({ name: 1 });

    const result = await Promise.all(
      folders.map(async (folder) => {
        const children = await Folder.find({
          ownerId: req.user._id,
          parentId: folder._id,
        }).sort({ name: 1 });

        return {
          folderId: folder._id,
          name: folder.name,
          path: folder.path,
          children: children.map((c) => ({
            folderId: c._id,
            name: c.name,
            path: c.path,
          })),
          createdAt: folder.createdAt,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: { folders: result },
    });
  } catch (err) {
    next(err);
  }
};

const renameFolder = async (req, res, next) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.folderId,
      ownerId: req.user._id,
    });

    if (!folder) {
      const error = new Error('Folder not found');
      error.statusCode = 404;
      error.code = 'RESOURCE_NOT_FOUND';
      throw error;
    }

    const oldPath = folder.path;
    const parentPath = folder.parentId
      ? (await Folder.findById(folder.parentId)).path
      : '/root';
    const newPath = `${parentPath}/${req.body.name}`;

    folder.name = req.body.name;
    folder.path = newPath;
    await folder.save();

    const descendants = await Folder.find({
      ownerId: req.user._id,
      path: { $regex: `^${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}` },
      _id: { $ne: folder._id },
    });

    for (const desc of descendants) {
      desc.path = desc.path.replace(oldPath, newPath);
      await desc.save();
    }

    res.status(200).json({
      success: true,
      data: {
        folderId: folder._id,
        name: folder.name,
        path: folder.path,
        updatedAt: folder.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

const deleteFolder = async (req, res, next) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.folderId,
      ownerId: req.user._id,
    });

    if (!folder) {
      const error = new Error('Folder not found');
      error.statusCode = 404;
      error.code = 'RESOURCE_NOT_FOUND';
      throw error;
    }

    const pathRegex = new RegExp(
      `^${folder.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`
    );

    const subFolders = await Folder.find({
      ownerId: req.user._id,
      path: pathRegex,
    });

    const subFolderIds = subFolders.map((f) => f._id);

    const assets = await Asset.find({
      ownerId: req.user._id,
      folderId: { $in: subFolderIds },
    });

    for (const asset of assets) {
      try {
        await s3Service.deleteFile(asset.s3Key);
        if (asset.thumbnailKey) await s3Service.deleteFile(asset.thumbnailKey);
      } catch (e) {
        console.error(`Failed to delete S3 object ${asset.s3Key}:`, e.message);
      }
    }

    const totalSize = assets.reduce((sum, a) => sum + a.size, 0);

    await Asset.deleteMany({ folderId: { $in: subFolderIds } });
    await Folder.deleteMany({ _id: { $in: subFolderIds } });

    if (totalSize > 0) {
      const User = require('../models/User');
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { storageUsed: -totalSize },
      });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { createFolder, getFolders, renameFolder, deleteFolder };
