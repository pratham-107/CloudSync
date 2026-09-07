const { Router } = require('express');
const authRoutes = require('./auth');
const assetRoutes = require('./asset');
const folderRoutes = require('./folder');
const shareRoutes = require('./share');

const router = Router();

router.use('/auth', authRoutes);
router.use('/assets', assetRoutes);
router.use('/folders', folderRoutes);
router.use('/shares', shareRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
