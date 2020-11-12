const express = require('express');

const router = express.Router();
const checkAuth = require('../middlewares/check-auth');
const GroupsController = require('../controllers/groups');

router.get('/', checkAuth, GroupsController.getList);

router.get('/:groupId', checkAuth, GroupsController.getOne);

router.put('/:groupId', checkAuth, GroupsController.updateOne);

router.post('/', checkAuth, GroupsController.createOne);

router.delete('/:groupId', checkAuth, GroupsController.deleteOne);

module.exports = router;
