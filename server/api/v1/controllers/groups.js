// const mongoose = require('mongoose');
const Group = require('../models/Group');

exports.getList = (req, res, next) => {
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

exports.getOne = (req, res, next) => {
  const id = req.params.groupId ? req.params.groupId : '';
  // TODO move this object id check in a function for all controllers
  const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');

  if (!checkForHexRegExp.test(id)) {
    return res.status(400).json({
      error: {
        message: 'Get group failed',
        description: 'No group provided',
      },
    });
  }

  Group.findById(id)
    .exec()
    .then((group) => {
      if (!group) {
        return res.status(404).json({
          error: {
            message: 'Get group failed',
            description: 'Group not found',
          },
        });
      }

      return res.status(200).json({
        data: {
          message: 'Get group successful',
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
      res.status(500).json({
        error: {
          message: 'Get group failed',
          description: 'Something went wrong when getting group',
          ...err,
        },
      });
    });
};
