const shareService = require('../services/shareService');

const createShare = async (req, res, next) => {
  try {
    const result = await shareService.createShare({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const accessShare = async (req, res, next) => {
  try {
    const result = await shareService.accessShare(
      req.params.token,
      req.query.password
    );

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const revokeShare = async (req, res, next) => {
  try {
    await shareService.revokeShare(req.params.shareId, req.user._id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { createShare, accessShare, revokeShare };
