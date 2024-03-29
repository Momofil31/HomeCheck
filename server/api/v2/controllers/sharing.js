const Sharing = require('../../../models/Sharing');

function getSharingFromEntity(sharing, req) {
  const toRtn = {};
  toRtn.token = sharing._id;

  toRtn.request = {};
  toRtn.request.type = 'GET';
  toRtn.request.url = `${req.headers.host}/v2/sharing-links/token`;

  return toRtn;
}

exports.getOne = (req, res) => {
  Sharing.find({ user: req.userData.userId })
    .populate('User')
    .exec()
    .then((sharing) => {
      if (!sharing || sharing.length === 0) {
        return res.status(404).json({
          error: {
            message: 'Token not found',
          },
        });
      }

      return res.status(200).json({
        data: {
          message: 'Get token successful',
          sharingLinks: getSharingFromEntity(sharing[0], req),
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: {
          message: 'Get sharing token failed due to a server error. Try again later',
          ...err,
        },
      });
    });
};

exports.createOne = (req, res) => {
  Sharing.find({ user: req.userData.userId })
    .exec()
    .then((response) => {
      if (response.length >= 1) {
        return res.status(409).json({
          error: {
            message: 'Creation failed.',
            description: 'Token already exists',
          },
        });
      }
      const sharingModel = new Sharing({ user: req.userData.userId });
      sharingModel.save((error) => {
        if (error) {
          return res.status(500).json({
            error: {
              message: 'Creation failed.',
              description: 'Error in saving new token',
            },
          });
        }
        return res.status(201).json({
          data: {
            message: 'Get token successful',
            sharingLinks: getSharingFromEntity(sharingModel, req),
          },
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: {
          message: 'Creation failed',
          description: 'Something went wrong during creation',
          ...err,
        },
      });
    });
};

exports.deleteOne = (req, res) => {
  Sharing.findOneAndDelete({ user: req.userData.userId })
    .exec()
    .then((response) => {
      if (response) {
        return res.status(200).json({
          data: {
            message: 'Delete token successful',
            sharingLinks: getSharingFromEntity(response, req),
          },
        });
      }

      return res.status(404).json({
        error: {
          message: 'Sharing token not found',
        },
      });
    });
};
