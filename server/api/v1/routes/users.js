const express = require('express');

const router = express.Router();
const checkAuth = require('../middlewares/check-auth');
const UsersController = require('../controllers/users');

router.get('/login', UsersController.login);

router.get('/logout', checkAuth, UsersController.logout);

router.put('/register', UsersController.register);

module.exports = router;
