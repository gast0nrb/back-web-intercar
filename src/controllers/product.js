const Product = require("../models/Product");
const dryFn = require("../middlewares/dryFn");
const { NotFound, GeneralError } = require("../helpers/classError");
const Subcategory = require("../models/Subcategory");
const Category = require("../models/Category");
const Features = require("../models/Features");
const FeatureProduct = require("../models/FeatureProduct");
const sq = require("../database/conn")
const paginateQuery = require("../helpers/pagination");
const { Op } = require("sequelize");

const getProduct = dryFn(async (req, res, next) => {
  const product = await Product.findByPk(req.params.sku, {
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
  let whereObj;
  let objQuery = {
    order: [[
      "sku", "ASC"
    ]]
  }
  if (req.query.page) {
    const totalRows = await Product.count();
    const pagination = paginateQuery(totalRows, parseInt(req.query.page))
    objQuery = { ...objQuery, ...pagination }
    console.log(objQuery)
  }
  if(req.query.text) {
    whereObj = {
      where : {
        [Op.or] : {
          sku : { [Op.like] : `%${req.query.text}%`},
          title : { [Op.like] : `%${req.query.text}%`},
          description : { [Op.like] : `%${req.query.text}%`},
        }
      }
    };

  }
  const products = await Product.findAll({  ...whereObj, ...objQuery });

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
      new GeneralError("Product not found with sku: " + req.params.sku, 404)
    );
  }
  const t = sq
    .transaction(async () => {
      const product = await Product.update(req.body, {
        where: { sku: req.params.sku },
      });

      res.status(200).json({
        success: true,
        data: {
          message: `Product updated successfully with sku ${req.params.sku}`,
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
  const pd = await Product.findByPk(req.params.sku);
  if (!pd) {
    return next(new NotFound(`Product not found with sku ${req.params.sku}`));
  }
  const t = sq
    .transaction(async () => {
      const product = await Product.destroy({ where: { sku: req.params.sku } });
      res.status(200).json({
        success: true,
        data: {
          message: `Product deleted successfully with sku ${req.params.sku}`,
        },
      });
      return product;
    })
    .catch((e) => next(e));
});

const getProductsBySubcategory = dryFn(async (req, res, next) => {
  let objQuery = {
    order: [["sku", "ASC"]]
  }
  if (req.query.page) {
    const totalRows = Product.count({ where: { fk_subcategory: req.params.id } })
    if (totalRows == 0) {
      return next(new GeneralError("Doesn't find any product", 404));
    }
    const pagination = paginateQuery(totalRows, parseInt(req.query.page))
    objQuery = { ...objQuery, ...pagination }
  }
  const pd = await Product.findAll({ ...objQuery, where: { fk_subcategory: req.params.id }, include: [{ model: Subcategory, include: { model: Category } }, { model: FeatureProduct, include: { model: Features } }] });
  res.status(200).json({
    success: true,
    data: pd
  })
})

const getProductsByCategory = dryFn(async (req, res, next) => {
  let objQuery = {
    order: [["sku", "ASC"]]
  }

  if (req.query.page) {
    const totalRows = Product.count({
      include: [{
        model: Subcategory, include: [
          { model: Category, where: { id: req.params.id } }
        ]
      }]
    });
    if (totalRows == 0) {
      return next(new GeneralError("Doesn't found any product", 404))
    }
    const pagination = paginateQuery(totalRows, parseInt(req.query.page));
    objQuery = { ...objQuery, ...pagination }
  }

  const products = await Product.findAll({
    ...objQuery, include: [{
      model: Subcategory, where:
        { fk_category: req.params.id }, include: [{ model: Category }]
    }]
  })

  res.status(200).json({
    success: true,
    data: products
  })
})

const getOnSale = dryFn(async (req,res, next) => {
  let objQuery = {
    order: [["sku", "ASC"]]
  };

  if (req.query.page) {
    const totalRows = await Product.count({
      where: { onsale: true },
      include: [{ model: Subcategory, include: [{ model: Category }] }]
    })
    console.log(totalRows)
    if (totalRows == 0) {
      return next(new GeneralError("Doesn't found any product", 404))
    }
    const pagination = paginateQuery(totalRows, parseInt(req.query.page))
    objQuery = { ...objQuery, ...pagination }
  }

  const products = await Product.findAll({ ...objQuery, where: { onsale: true }, include: [{ model: Subcategory, include: [{ model: Category }] }] })

  res.status(200).json({
    success: true, data: products
  })
});

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getProducts,
  getProduct,
  getProductsBySubcategory,
  getProductsByCategory,
  getOnSale
};
