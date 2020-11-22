const {
  param, body, query, validationResult,
} = require('express-validator');
const Product = require('../models/Product');

function getProductFromEntity(product, req) {
  const toRtn = {};
  toRtn.id = product._id;
  toRtn.name = product.name;
  toRtn.quantity = product.quantity;
  toRtn.expiryDate = product.expiryDate;

  if (product.category != null) {
    toRtn.category = {};
    toRtn.category.id = product.category._id;
    toRtn.category.name = product.category.name;
    toRtn.category.icon = product.category.icon;
  }

  if (product.group != null) {
    toRtn.group = {};
    toRtn.group.id = product.group._id;
    toRtn.group.name = product.group.name;
  }

  toRtn.request = {};
  toRtn.request.type = 'GET';
  toRtn.request.url = `${req.headers.host}/products/${product._id}`;

  return toRtn;
}

function getProductFromBody(request) {
  const product = {};
  product.name = request.body.name;
  product.quantity = request.body.quantity;
  product.expiryDate = request.body.expiryDate;
  product.category = request.body.category;
  product.group = request.body.group;
  product.user = request.userData.userId;

  return product;
}

exports.getList = (req, res) => {
  const { category, group } = req.query;

  const where = {
    user: req.userData.userId,
  };

  if (category) {
    where.category = category;
  }

  if (group) {
    where.group = group;
  }

  Product.find(where)
    .populate('category')
    .populate('group')
    .exec()
    .then((products) => {
      res.status(200).json({
        data: {
          message: 'Get products successful.',
          products: products.map((product) => getProductFromEntity(product, req)),
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: {
          message: 'Get products failed due to a server error. Try again later',
          ...err,
        },
      });
    });
};

exports.getOne = (req, res) => {
  const id = req.params.productId;

  Product.findById(id)
    .populate('category')
    .populate('group')
    .exec()
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          error: {
            message: 'Product not found',
          },
        });
      }
      if (product.user.toString() !== req.userData.userId) {
        return res.status(403).json({
          error: {
            message: 'User not authorized to view this product',
          },
        });
      }

      return res.status(200).json({
        data: {
          message: 'Get product successful',
          product: getProductFromEntity(product, req),
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: {
          message: 'Get product failed due to a server error. Try again later',
          ...err,
        },
      });
    });
};

exports.updateOne = (req, res) => {
  const id = req.params.productId;

  const product = getProductFromBody(req);

  Product.findByIdAndUpdate(id, product)
    .exec()
    .then((response) => {
      if (response) {
        return res.status(200).json({
          data: {
            message: 'Update product successful',
            product: response,
          },
        });
      }

      console.log(response);
      return res.status(404).json({
        error: {
          message: 'Product not found',
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: {
          message: 'Creation failed due to a server error. Try again later',
          ...err,
        },
      });
    });
};

exports.createOne = (req, res) => {
  const product = getProductFromBody(req);

  Product.find({ name: product.name })
    .populate('category')
    .populate('group')
    .exec()
    .then((response) => {
      if (response.length >= 1) {
        return res.status(409).json({
          error: {
            message: 'Product already exists.',
          },
        });
      }
      const productModel = new Product(product);
      productModel.save((error) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            error: {
              message: 'Creation failed due to a server error. Try again later',
            },
          });
        }
        return res.status(201).json({
          data: {
            message: 'Creation successful.',
            product: getProductFromEntity(product, req),
          },
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: {
          message: 'Creation failed due to a server error. Try again later',
          ...err,
        },
      });
    });
};

exports.deleteOne = (req, res) => {
  const { productId } = req.params;
  const { userId } = req.userData;
    
  Product.findOneAndDelete({ _id: productId, user: userId })
    .exec()
    .then((response) => {
      if (response) {
        return res.status(200).json({
          data: {
            message: 'Delete product successful',
            product: getProductFromEntity(response, req),
          },
        });
      }
    
      return res.status(404).json({
        error: {
          message: 'Product not found',
        },
      });
    });
};

exports.validate = (req, res, next) => {
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
  param('productId')
    .isMongoId()
    .withMessage('Invalid id'),
];

exports.validationChainQuery = [
  query('group')
    .optional()
    .isMongoId()
    .withMessage('Invalid group id'),
  query('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid category id'),
];

exports.validationChainBody = [
  body('name')
    .isString()
    .trim().notEmpty()
    .withMessage('Field can not be empty'),

  body('quantity')
    .notEmpty()
    .withMessage('Field can not be empty').bail()
    .isNumeric()
    .withMessage('Not a number'),

  body('expiryDate')
    .notEmpty()
    .withMessage('Field can not be empty').bail()
    .isDate()
    .withMessage('Not a valid date'),

  body('category')
    .notEmpty()
    .withMessage('Field can not be empty').bail()
    .isMongoId()
    .withMessage('Invalid category id'),

  body('group')
    .notEmpty()
    .withMessage('Field can not be empty').bail()
    .isMongoId()
    .withMessage('Invalid group id'),
];
