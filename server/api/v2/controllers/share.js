const Share = require('../../../models/Share');

function getShareFromEntity(share, req) {
  const toRtn = {};
  toRtn.id = share._id;

  toRtn.request = {};
  toRtn.request.type = 'GET';
  toRtn.request.url = `${req.headers.host}/v2/products/shared/${share._id}`;

  return toRtn;
}

exports.getOne = (req, res) => {
  Share.find({ user: req.userData.userId })
    .populate('User')
    .exec()
    .then((share) => {
      if (!share || share.length === 0) {
        return res.status(404).json({
          error: {
            message: 'Token not found',
          },
        });
      }

      return res.status(200).json({
        data: {
          message: 'Get token successful',
          share: getShareFromEntity(share[0], req),
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: {
          message: 'Get share token failed due to a server error. Try again later',
          ...err,
        },
      });
    });
};

exports.createOne = (req, res) => {
  Share.find({ user: req.userData.userId })
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
      const shareModel = new Share({ user: req.userData.userId });
      shareModel.save((error) => {
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
            share: getShareFromEntity(shareModel, req),
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
  Share.findOneAndDelete({ user: req.userData.userId })
    .exec()
    .then((response) => {
      if (response) {
        return res.status(200).json({
          data: {
            message: 'Get token successful',
            share: getShareFromEntity(response, req),
          },
        });
      }

      return res.status(404).json({
        error: {
          message: 'Share token not found',
        },
      });
    });
};
