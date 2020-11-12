// const mongoose = require('mongoose');
const Group = require('../models/Group');

exports.getList = (req, res, next) => {
  const where = {
    $or: [{ user: req.userData.userId }],
  };

  Group.find(where)
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

  if (id === '') {
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
      if (group.user.toString() !== req.userData.userId) {
        return res.status(403).json({
          error: {
            message: 'Get group failed',
            description: `User not authorized to view group ${group.name}`,
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

exports.updateOne = (req, res, next) => {
  const id = req.params.groupId;
};

exports.createOne = (req, res, next) => {
  const group = {
    name: req.body.name ? req.body.name : '',
    user: req.userData.userId,
  };

  if (group.name === '') {
    return res.status(400).json({
      error: {
        message: 'Creation failed.',
        description: 'Name is not filled in with the corresponding data.',
      },
    });
  }

  Group.find({ name: group.name })
    .exec()
    .then((response) => {
      if (response.length >= 1) {
        return res.status(409).json({
          error: {
            message: 'Creation failed.',
            description: 'Group already exists.',
          },
        });
      }
      const groupModel = new Group(group);
      groupModel.save((error) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            error: {
              message: 'Creation failed.',
              description: 'Error in saving new group.',
            },
          });
        }
        return res.status(201).json({
          data: {
            message: 'Creation successful.',
            group: {
              id: groupModel._id,
              name: groupModel.name,
              request: {
                type: 'GET',
                url: `${req.headers.host}/groups/${groupModel._id}`,
              },
            },
          },
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: {
          message: 'Creation failed.',
          description: 'Something went wrong during creation.',
          ...err,
        },
      });
    });
};

exports.deleteOne = (req, res, next) => {
  const id = req.params.groupId;
};
