const express = require('express');

const router = express.Router();
const checkAuth = require('../middlewares/check-auth');
const GroupsController = require('../controllers/groups');

router.get('/', checkAuth, GroupsController.getList);

router.get('/:groupId', checkAuth, GroupsController.validationChainParam, GroupsController.validate, GroupsController.getOne);

module.exports = router;
