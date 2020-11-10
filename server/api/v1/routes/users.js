const express = require('express');

const router = express.Router();
const checkAuth = require('../middlewares/check-auth');
const UsersController = require('../controllers/users');

router.post('/login', UsersController.login);

router.post('/register', UsersController.register);

module.exports = router;
