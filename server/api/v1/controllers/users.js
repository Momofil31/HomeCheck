const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

exports.login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Authentication failed',
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Authentication failed',
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: '1h',
            },
          );
          return res.status(200).json({
            message: 'Authentication successful',
            token,
          });
        }
        return res.status(401).json({
          message: 'Authentication failed',
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.register = (req, res, next) => {
  const user = {
    email: req.body.email ? req.body.email : '',
    firstname: req.body.firstname ? req.body.firstname : '',
    lastname: req.body.lastname ? req.body.lastname : '',
    password: req.body.password ? req.body.password : '',
  };

  const passwordRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})');
  const emailRegex = new RegExp('^[\\w-.]+@([\\w-]+.)+[\\w-]{2,4}$');

  if (user.email === '' || user.firstname === '' || user.lastname === '' || user.password === '') {
    return res.status(400).json({
      message: 'Empty data',
    });
  }

  if (!emailRegex.test(user.email)) {
    return res.status(400).json({
      message: 'Email is not valid',
    });
  }

  if (!passwordRegex.test(user.password)) {
    return res.status(400).json({
      message: 'Password not valid',
    });
  }

  User.find({ email: user.email })
    .exec()
    .then((response) => {
      if (response.length >= 1) {
        return res.status(409).json({
          message: 'Email already exists',
        });
      }

      bcrypt.hash(user.password, 10, (err, hash) => {
        user.password = hash;
        const userModel = new User(user);

        userModel.save((error) => {
          if (error) {
            console.log(error);
            return res.status(500).json({
              error: 'Error with registration',
            });
          }

          return res.status(201).json({
            message: 'User registered successfully',
          });
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
