const Product = require("../models/Product");
const dryFn = require("../middlewares/dryFn");
const { NotFound, GeneralError } = require("../helpers/classError");
const Subcategory = require("../models/Subcategory");
const Category = require("../models/Category");
const Features = require("../models/Features");
const FeatureProduct = require("../models/FeatureProduct");

const getProduct = dryFn(async (req, res, next) => {
  const product = await Product.findByPk(req.params.id, {
    include: [
      {
        model: Subcategory,
        include: {
          model: Category,
        },
      },
      {
        model: FeatureProduct,
        include: {
          model: Features,
        },
      },
    ],
  });
  if (!product) {
    return next(new GeneralError("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    length: product.length,
    data: product,
  });
});

const getProducts = dryFn(async (req, res, next) => {
  const products = await Product.findAll({ order: [["sku", "ASC"]] });

  res.status(200).json({
    success: true,
    length: products.length,
    data: products,
  });
});

const updateProduct = dryFn(async (req, res, next) => {
  const pd = await Product.findByPk(req.params.sku);
  if (!pd) {
    return next(
      new GeneralError("Product not found with sku: " + req.params.id, 404)
    );
  }
  const t = sq
    .transaction(async () => {
      const product = await Product.update(req.body, {
        where: { sku: req.params.id },
      });

      res.status(200).json({
        success: true,
        data: {
          message: `Product updated successfully with sku ${req.params.id}`,
          newvalues: req.body,
        },
      });
      return product; //Return from transaction
    }) //Transaction finish
    .catch((e) => next(e)); //Catch errors from transaction
});

const createProduct = dryFn(async (req, res, next) => {
  const t = sq
    .transaction(async () => {
      const product = await Product.create(req.body);

      res.status(200).json({
        success: true,
        data: {
          message: `Product created successfully`,
          newvalues: req.body,
        },
      });
      return product;
    })
    .catch((e) => next(e));
});

const deleteProduct = dryFn(async (req, res, next) => {
  const pd = await Product.findByPk(req.params.id);
  if (!pd) {
    return next(new NotFound(`Product not found with sku ${req.params.id}`));
  }
  const t = sq
    .transaction(async () => {
      const product = await Product.destroy({ where: { sku: req.params.id } });
      res.status(200).json({
        success: true,
        data: {
          message: `Product deleted successfully with sku ${req.params.id}`,
        },
      });
      return product;
    })
    .catch((e) => next(e));
});

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getProducts,
  getProduct,
};
