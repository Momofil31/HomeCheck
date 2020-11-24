const express = require('express');

const router = express.Router();
const checkAuth = require('../middlewares/check-auth');
const CategoriesController = require('../controllers/categories');

router.get('/', checkAuth, CategoriesController.getList);

router.get(
  '/:categoryId',
  checkAuth,
  CategoriesController.validationChainParam,
  CategoriesController.validate,
  CategoriesController.getOne,
);

router.put(
  '/:categoryId',
  checkAuth,
  CategoriesController.validationChainParam,
  CategoriesController.validate,
  CategoriesController.updateOne,
);

router.post('/', checkAuth, CategoriesController.createOne);

router.delete(
  '/:categoryId',
  checkAuth,
  CategoriesController.validationChainParam,
  CategoriesController.validate,
  CategoriesController.deleteOne,
);

module.exports = router;
