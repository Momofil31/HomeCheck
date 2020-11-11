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
          error: {
            message: 'Authentication failed.',
            description: 'Cannot find a user with the requested email.',
          },
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            error: {
              message: 'Authentication failed.',
              description: 'Password is incorrect.',
            },
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
            data: {
              message: 'Authentication successful.',
              token,
              user: {
                id: user[0]._id,
                email: user[0].email,
                firstname: user[0].firstname,
                lastname: user[0].lastname,
              },
            },
          });
        }
        return res.status(401).json({
          error: {
            message: 'Authentication failed',
            description: 'Something went wrong when checking password.',
          },
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: {
          message: err.message || 'Something went wrong.',
          description: '',
          ...err,
        },
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
      error: {
        message: 'Registration failed.',
        description: 'Email or password are not filled in with the corresponding data.',
      },
    });
  }

  if (!emailRegex.test(user.email)) {
    return res.status(400).json({
      error: {
        message: 'Registration failed.',
        description: 'Email is not valid.',
      },
    });
  }

  if (!passwordRegex.test(user.password)) {
    return res.status(400).json({
      error: {
        message: 'Registration failed.',
        description: 'Password not valid',
      },
    });
  }

  User.find({ email: user.email })
    .exec()
    .then((result) => {
      if (result.length >= 1) {
        return res.status(409).json({
          error: {
            message: 'Registration failed.',
            description: 'Email already exists.',
          },
        });
      }

      bcrypt.hash(user.password, 10, (err, hash) => {
        user.password = hash;
        const userModel = new User(user);

        userModel.save((error) => {
          if (error) {
            console.log(error);
            return res.status(500).json({
              error: {
                message: 'Registration failed.',
                description: 'Something went wrong when creating your user.',
              },
            });
          }
          return res.status(201).json({
            data: {
              message: 'Registration successful.',
              user: {
                id: userModel._id,
                email: userModel.email,
                firstname: userModel.firstname,
                lastname: userModel.lastname,
              },
            },
          });
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: {
          message: 'Registration failed.',
          descrition: 'Something went wrong during registration.',
          ...err,
        },
      });
    });
};
