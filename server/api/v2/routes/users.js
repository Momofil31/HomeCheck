const express = require('express');

const router = express.Router();
const UsersController = require('../controllers/users');
const checkAuth = require('../middlewares/check-auth');

router.post('/login', UsersController.login);

router.post('/register', UsersController.register);

router.post('/passwordReset', UsersController.resetPassword);

router.put('/password', checkAuth, UsersController.updatePassword);

module.exports = router;
