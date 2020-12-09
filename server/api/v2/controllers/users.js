const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mail = require('./mailUtil');

const User = require('../../../models/User');

function generatePassword() {
  const length = 8;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let retVal = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

exports.login = (req, res) => {
  User.find({ email: req.body.email, blocked: false })
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
              expiresIn: '1d',
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

exports.register = (req, res) => {
  const user = {
    email: req.body.email ? req.body.email : '',
    firstname: req.body.firstname ? req.body.firstname : '',
    lastname: req.body.lastname ? req.body.lastname : '',
    password: req.body.password ? req.body.password : '',
  };

  const passwordRegex = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})',
  );
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
          
          //registration succesful we need to send confirmation email
          const link = `${process.env.FRONTEND_URL}/confirm?token=${userModel.token}`;
          mail.confirmationEmail(userModel.email,`${userModel.firstname} ${userModel.lastname}`, link, userModel.token);
          
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

exports.resetPassword = (req, res) => {
  const { email } = req.body;

  User.find({ email })
    .exec()
    .then(async (user) => {
      if (user.length < 1) {
        return res.status(404).json({
          error: {
            message: 'Reset password failed.',
            description: 'Cannot find a user with the requested email.',
          },
        });
      }

      const newPassword = generatePassword();
      // send email with new password
      mail.resetPasswordMail(email, newPassword);

      console.log(newPassword);

      const hashNewPassword = await bcrypt.hash(newPassword, 10);

      User.findByIdAndUpdate(user[0]._id, { password: hashNewPassword })
        .then((result) => {
          res.status(200).json({
            data: {
              message: 'New password sent',
              user: {
                id: user[0]._id,
                email: user[0].email,
                firstname: user[0].firstname,
                lastname: user[0].lastname,
              },
            },
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({
            error: {
              message: 'Reset password failed.',
              descrition: 'Something went wrong during rest password.',
              ...error,
            },
          });
        });
    });
};

exports.updatePassword = async (req, res) => {
  const password = {
    old: req.body.oldPassword ? req.body.oldPassword : '',
    new: req.body.newPassword ? req.body.newPassword : '',
    confirm: req.body.confirmPassword ? req.body.confirmPassword : '',
  };
  const user = req.userData;

  if (password.old === '' || password.new === '' || password.confirm === '') {
    return res.status(400).json({
      error: {
        message: 'Update password failed',
        description: 'Data not correctly provided',
      },
    });
  }

  if (password.new !== password.confirm) {
    return res.status(400).json({
      error: {
        message: 'Update password failed',
        description: "Passwords don't match",
      },
    });
  }

  const hashNewPassword = await bcrypt.hash(password.new, 10);

  console.log(hashNewPassword);

  User.findById(user.userId)
    .exec()
    .then((result) => {
      if (result) {
        const match = bcrypt.compare(password.old, result.password);

        if (match) {
          User.findByIdAndUpdate(user.userId, { password: hashNewPassword })
            .exec()
            // eslint-disable-next-line no-shadow
            .then((result) => {
              res.status(200).json({
                data: {
                  message: 'Update password successful',
                  user: {
                    id: result._id,
                    email: result.email,
                    firstname: result.firstname,
                    lastname: result.lastname,
                  },
                },
              });
            })
            .catch((error) => {
              console.log(error);
              res.status(500).json({
                error: {
                  message: 'Update password failed.',
                  descrition: 'Something went wrong during update password.',
                  ...error,
                },
              });
            });
        }
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: {
          message: 'Update password failed.',
          descrition: 'Something went wrong during update password.',
          ...error,
        },
      });
    });
};
           
exports.confirm = async (req, res) => {
            
  const token = req.params.token ? req.params.token : '';
            
  if (token === '') {
    return res.status(400).json({
      error: {
        message: 'Confirmation failed.',
        description: 'Token missing',
      },
    });
  }

  User.find({ token: token })
    .exec()
    .then((result) => {
      if (result.length <= 0) {
        return res.status(404).json({
          error: {
            message: 'Confirmation failed.',
            description: 'Token not found.',
          },
        });
      }
    
      var user = result[0];
      user.blocked = false;
      user.token = '';
      user.save((error) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            error: {
              message: 'Confirmation failed.',
              description: 'Something went wrong when saving your user.',
            },
          });
        }

        return res.status(201).json({
          data: {
            message: 'Confirmation successful.',
            user: {
              id: user._id,
              email: user.email,
              firstname: user.firstname,
              lastname: user.lastname,
            },
          },
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: {
          message: 'Confirmation failed.',
          descrition: 'Something went wrong during Confirmation.',
          ...err,
        },
      });
    });
    
};
