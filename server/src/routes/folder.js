const { Router } = require('express');
const folderController = require('../controllers/folderController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createFolderSchema, renameFolderSchema } = require('../utils/validators');

const router = Router();

router.use(authenticate);

router.get('/', folderController.getFolders);

router.post(
  '/',
  validate(createFolderSchema),
  folderController.createFolder
);

router.patch(
  '/:folderId',
  validate(renameFolderSchema),
  folderController.renameFolder
);

router.delete('/:folderId', folderController.deleteFolder);

module.exports = router;
