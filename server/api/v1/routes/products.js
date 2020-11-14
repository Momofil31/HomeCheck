const express = require('express');

const router = express.Router();
const checkAuth = require('../middlewares/check-auth');
const ProductsController = require('../controllers/products');

router.get('/',
  checkAuth,
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

module.exports = router;
