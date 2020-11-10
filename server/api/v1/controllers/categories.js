const mongoose = require('mongoose');
const Category = require('../models/Category');

exports.getList = (req, res, next) => {};

exports.getOne = (req, res, next) => {
  const id = req.params.categoryId;
};

exports.updateOne = (req, res, next) => {
  const id = req.params.categoryId;
};

exports.createOne = (req, res, next) => {
  const category = {
    name: req.body.name ? req.body.name : '',
    icon: req.body.icon ? req.body.icon : '',
  };

  if (category.name === '' || category.icon === '') {
    return res.status(400).json({
      message: 'Empty data',
    });
  }

  // TODO: Check if category icon is valid

  Category.find({ name: category.name })
    .exec()
    .then((response) => {
      if (response.length >= 1) {
        return res.status(409).json({
          message: 'Category already exists',
        });
      }
      const categoryModel = new Category(category);
      categoryModel.save((error) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            error: 'Error in saving new category',
          });
        }
        return res.status(201).json({
          message: 'Category created successfully',
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.deleteOne = (req, res, next) => {
  const categoryId = req.params.categoryId ? req.params.categoryId : '';

  if (categoryId === '') {
    return res.status(400).json({
      message: 'No category provided',
    });
  }

  Category.findByIdAndDelete(categoryId)
    .exec()
    .then((result) => {
      res.status(200).json({
        message: `Category ${result.name} deleted`,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Category deletion failed',
      });
    });
};
