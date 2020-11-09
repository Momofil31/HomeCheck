const express = require('express');

const router = express.Router();
const checkAuth = require('../middlewares/check-auth');
const ProductsController = require('../controllers/products');

router.get('/', checkAuth, ProductsController.getList);

router.get('/:productId', checkAuth, ProductsController.getOne);

router.put('/:productId', checkAuth, ProductsController.updateOne);

router.post('/', checkAuth, ProductsController.createOne);

router.delete('/:productId', checkAuth, ProductsController.deleteOne);

module.exports = router;
