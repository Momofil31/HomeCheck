const express = require('express');

const router = express.Router();
const checkAuth = require('../middlewares/check-auth');
const ProductsController = require('../controllers/products');

router.get('/',
  checkAuth,
  ProductsController.validationChainQuery, ProductsController.validate,
  ProductsController.getList);

router.get('/:productId',
  checkAuth,
  ProductsController.validationChainParam, ProductsController.validate,
  ProductsController.getOne);

router.put('/:productId',
  checkAuth,
  ProductsController.validationChainParam, ProductsController.validate,
  ProductsController.validationChainBody, ProductsController.validate,
  ProductsController.updateOne);

router.post('/',
  checkAuth,
  ProductsController.validationChainBody, ProductsController.validate,
  ProductsController.createOne);

router.delete('/:productId',
  checkAuth,
  ProductsController.validationChainParam, ProductsController.validate,
  ProductsController.deleteOne);

router.get('/shared/:token',
  ProductsController.sharedTokenValidationChainParam, ProductsController.validate,
  ProductsController.getList);

router.get('/:productId/shared/:token',
  ProductsController.validationChainParam, ProductsController.validate,
  ProductsController.sharedTokenValidationChainParam, ProductsController.validate,
  ProductsController.getOne);

module.exports = router;
