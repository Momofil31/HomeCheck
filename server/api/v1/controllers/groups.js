const { param, validationResult } = require('express-validator');
const Group = require('../models/Group');

exports.getList = (req, res) => {
  Group.find({})
    .exec()
    .then((groups) => {
      res.status(200).json({
        data: {
          message: 'Get groups successful.',
          groups: groups.map((group) => ({
            id: group._id,
            name: group.name,
            request: {
              type: 'GET',
              url: `${req.headers.host}/groups/${group._id}`,
            },
          })),
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: {
          message: 'Get groups failed.',
          description: 'Something went wrong when retrieving groups.',
          ...err,
        },
      });
    });
};

exports.getOne = (req, res) => {
  const id = req.params.groupId;

  Group.findById(id)
    .exec()
    .then((group) => {
      if (!group) {
        return res.status(404).json({
          error: {
            message: 'Group not found',
          },
        });
      }

      return res.status(200).json({
        data: {
          message: 'Group found',
          group: {
            id: group._id,
            name: group.name,
            request: {
              type: 'GET',
              url: `${req.headers.host}/groups`,
            },
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: {
          message: 'Get group failed due to a server error. Try again later',
        },
      });
    });
};

exports.validate = (req, res, next) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: {
        message: 'Validation failed',
        errors: errors.array(),
      },
    });
  }
  next();
};

exports.validationChainParam = [
  param('groupId')
    .isString()
    .withMessage('Id not a string')
    .isMongoId()
    .withMessage('Invalid id'),
];
