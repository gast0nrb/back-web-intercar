const Category = require("../models/Category");
const dryFn = require("../middlewares/dryFn");
const { GeneralError } = require("../helpers/classError");
const Subcategory = require("../models/Subcategory");
const Product = require("../models/Product");
const FeatureProduct = require("../models/FeatureProduct");
const Features = require("../models/Features");
const sq = require("../database/conn.js");

const getProductsByCategory = dryFn(async (req, res, next) => {
  const productsByCategory = await Category.findAll({
    where: {
      id: req.params.id,
    },
    include : [
      {model : Subcategory, include : {model : Product, include : {model: FeatureProduct, include : {model : Features}}}}
    ]
  });
  res.status(200).json({
    success: true,
    data: productsByCategory,
  });
});

const getCategories = dryFn(async (req, res, next) => {
  const category = await Category.findAll({ order: [["id", "ASC"]] });

  res.status(200).json({
    success: true,
    length: category.length,
    data: category,
  });
});

const updateCategory = dryFn(async (req, res, next) => {
  const ct = await Category.findByPk(req.params.id);
  if (!ct) {
    return next(
      new GeneralError("Category not found with id: " + req.params.id, 404)
    );
  }
  const t = sq
    .transaction(async () => {
      const category = await Category.update(req.body, {
        where: { id: req.params.id },
      });

      res.status(200).json({
        success: true,
        data: {
          message: `Category updated successfully with id ${req.params.id}`,
          newvalues: req.body,
        },
      });
      return category; //Return from transaction
    }) //Transaction finish
    .catch((e) => next(e)); //Catch errors from transaction
});

const createCategory = dryFn(async (req, res, next) => {
  const t = sq
    .transaction(async () => {
      const category = await Category.create(req.body);

      res.status(200).json({
        success: true,
        data: {
          message: `Category created successfully`,
          newvalues: req.body,
        },
      });
      return category;
    })
    .catch((e) => next(e));
});

const deleteCategory = dryFn(async (req, res, next) => {
  const ct = await Category.findByPk(req.params.id);
  if (!ct) {
    return next(new NotFound(`Category not found with id ${req.params.id}`));
  }
  const t = sq
    .transaction(async () => {
      const category = await Category.destroy({ where: { id: req.params.id } });
      res.status(200).json({
        success: true,
        data: {
          message: `Category deleted successfully with id ${req.params.id}`,
        },
      });
      return category;
    })
    .catch((e) => next(e));
});

module.exports = {
  createCategory,
  deleteCategory,
  updateCategory,
  getCategories,
  getProductsByCategory,
};
