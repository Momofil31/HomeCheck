const express = require('express');

const router = express.Router();
const checkAuth = require('../middlewares/check-auth');
const GroupsController = require('../controllers/groups');

router.get('/', checkAuth, GroupsController.getList);

router.get('/:groupId', checkAuth, GroupsController.getOne);

module.exports = router;
