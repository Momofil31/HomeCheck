const { param, validationResult } = require('express-validator');
const Category = require('../../../models/Category');

exports.getList = (req, res) => {
  const where = {
    $or: [{ user: process.env.ADMIN_USER_ID }, { user: req.userData.userId }],
  };

  Category.find(where)
    .exec()
    .then((categories) => {
      res.status(200).json({
        data: {
          message: 'Get categories successful.',
          categories: categories.map((category) => ({
            id: category._id,
            name: category.name,
            icon: category.icon,
            default: category.default,
            request: {
              type: 'GET',
              url: `${req.headers.host}/categories/${category._id}`,
            },
          })),
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: {
          message: 'Get categories failed.',
          description: 'Something went wrong when retrieving categories.',
          ...err,
        },
      });
    });
};

exports.getOne = (req, res) => {
  const id = req.params.categoryId ? req.params.categoryId : '';

  if (id === '') {
    return res.status(400).json({
      error: {
        message: 'Get category failed',
        description: 'No category provided',
      },
    });
  }

  Category.findById(id)
    .exec()
    .then((category) => {
      if (!category) {
        return res.status(404).json({
          error: {
            message: 'Get category failed',
            description: 'Category not found',
          },
        });
      }
      if (
        category.user.toString() !== req.userData.userId
        && category.user.toString() !== process.env.ADMIN_USER_ID
      ) {
        return res.status(403).json({
          error: {
            message: 'Get category failed',
            description: `User not authorized to view category ${category.name}`,
          },
        });
      }

      return res.status(200).json({
        data: {
          message: 'Get category successfull',
          category: {
            id: category._id,
            name: category.name,
            icon: category.icon,
            default: category.default,
            request: {
              type: 'GET',
              url: `${req.headers.host}/categories`,
            },
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: {
          message: 'Get category failed',
          description: 'Something went wrong when getting category',
          ...err,
        },
      });
    });
};

exports.updateOne = (req, res) => {
  const newCategory = {
    _id: req.body.id ? req.body.id : '',
    name: req.body.name ? req.body.name : '',
    icon: req.body.icon ? req.body.icon : '',
  };

  if (newCategory._id === '') {
    return res.status(400).json({
      error: {
        message: 'Update category failed',
        description: 'No category provided',
      },
    });
  }
  if (newCategory.name === '' || newCategory.icon === '') {
    return res.status(400).json({
      error: {
        message: 'Update failed.',
        description: 'Name or icon are not filled in with the corresponding data.',
      },
    });
  }

  Category.findById(newCategory._id)
    .exec()
    .then((category) => {
      if (!category) {
        return res.status(404).json({
          error: {
            message: 'Update failed',
            description: 'Category not found',
          },
        });
      }
      if (category.user.toString() !== req.userData.userId) {
        return res.status(403).json({
          error: {
            message: 'Update failed.',
            description: `User not authorized to update category ${category.name}.`,
          },
        });
      }
      Category.findByIdAndUpdate(newCategory._id, newCategory)
        .exec()
        .then((result) => {
          res.status(200).json({
            data: {
              message: 'Update successful.',
              category: {
                id: result.id,
                name: result.name,
                icon: result.icon,
                default: result.default,
              },
            },
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: {
              message: 'Update failed.',
              descrition: 'Something went wrong during update.',
              ...err,
            },
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: {
          message: 'Update failed.',
          descrition: 'Something went wrong during update.',
          ...err,
        },
      });
    });
};

exports.createOne = (req, res) => {
  const category = {
    name: req.body.name ? req.body.name : '',
    icon: req.body.icon ? req.body.icon : '',
    user: req.userData.userId,
    default: req.userData.userId === process.env.ADMIN_USER_ID,
  };

  if (category.name === '' || category.icon === '') {
    return res.status(400).json({
      error: {
        message: 'Creation failed.',
        description: 'Name or icon are not filled in with the corresponding data.',
      },
    });
  }

  // TODO: Check if category icon is valid

  Category.find({ name: category.name })
    .exec()
    .then((response) => {
      if (response.length >= 1) {
        return res.status(409).json({
          error: {
            message: 'Creation failed.',
            description: 'Category already exists.',
          },
        });
      }
      const categoryModel = new Category(category);
      categoryModel.save((error) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            error: {
              message: 'Creation failed.',
              description: 'Error in saving new category.',
            },
          });
        }
        return res.status(201).json({
          data: {
            message: 'Creation successful.',
            category: {
              id: categoryModel._id,
              name: categoryModel.name,
              icon: categoryModel.icon,
              default: categoryModel.default,
              request: {
                type: 'GET',
                url: `${req.headers.host}/categories/${categoryModel._id}`,
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

exports.deleteOne = (req, res) => {
  const categoryId = req.params.categoryId ? req.params.categoryId : '';

  if (categoryId === '') {
    return res.status(400).json({
      error: {
        message: 'Deletion failed.',
        description: 'No category provided.',
      },
    });
  }

  Category.findById(categoryId)
    .exec()
    .then((category) => {
      if (!category) {
        return res.status(404).json({
          error: {
            message: 'Deletion failed',
            description: 'Category not found',
          },
        });
      }
      if (category.user.toString() !== req.userData.userId) {
        return res.status(403).json({
          error: {
            message: 'Deletion failed.',
            description: `User not authorized to delete category ${category.name}.`,
          },
        });
      }
      Category.findByIdAndDelete(categoryId)
        .exec()
        .then((result) => {
          res.status(200).json({
            data: {
              message: 'Deletion successful.',
              category: {
                id: category.id,
                name: category.name,
                icon: category.icon,
                default: category.default,
              },
            },
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: {
              message: 'Deletion failed.',
              descrition: 'Something went wrong during deletion.',
              ...err,
            },
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: {
          message: 'Deletion failed.',
          descrition: 'Something went wrong during deletion.',
          ...err,
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
  param('categoryId')
    .isString()
    .withMessage('Id not a string')
    .isMongoId()
    .withMessage('Invalid id'),
];
