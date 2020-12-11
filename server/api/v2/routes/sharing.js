const express = require('express');

const router = express.Router();
const checkAuth = require('../middlewares/check-auth');
const SharingController = require('../controllers/sharing');
const ProductsController = require('../controllers/products');

router.get('/token',
  checkAuth,
  SharingController.getOne);

router.post('/token',
  checkAuth,
  SharingController.createOne);

router.delete('/token',
  checkAuth,
  SharingController.deleteOne);

router.get('/:token/products',
  ProductsController.sharingTokenValidationChainParam, ProductsController.validate,
  ProductsController.getList);

router.get('/:token/products/:productId',
  ProductsController.validationChainParam, ProductsController.validate,
  ProductsController.sharingTokenValidationChainParam, ProductsController.validate,
  ProductsController.getOne);

module.exports = router;
