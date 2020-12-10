const express = require('express');

const router = express.Router();
const checkAuth = require('../middlewares/check-auth');
const ShareController = require('../controllers/share');

router.get('/token', checkAuth, ShareController.getOne);

router.post('/token', checkAuth, ShareController.createOne);

router.delete('/token', checkAuth, ShareController.deleteOne);

module.exports = router;
