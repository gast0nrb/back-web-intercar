const Product = require("../models/Product");
const path = require("path");
const dryFn = require("../middlewares/dryFn");
const { NotFound, GeneralError } = require("../helpers/classError");
const Subcategory = require("../models/Subcategory");
const Category = require("../models/Category");
const Features = require("../models/Features");
const FeatureProduct = require("../models/FeatureProduct");
const sq = require("../database/conn")
const paginateQuery = require("../helpers/pagination");
const { Op } = require("sequelize");
const fs = require("fs");


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
  if (req.query.text) {
    whereObj = {
      where: {
        [Op.or]: {
          sku: { [Op.like]: `%${req.query.text}%` },
          title: { [Op.like]: `%${req.query.text}%` },
          description: { [Op.like]: `%${req.query.text}%` },
        }
      }
    };

  }
  const products = await Product.findAll({ ...whereObj, ...objQuery , include: [{model : Subcategory}]});

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
    length: pd.length,
    data: pd
  })
})

/*Si pasa en el req.query.subcategory un id de subcategoria actual envia los productos x subcategoria
Esto en busca de utilizar solamente un url en front-end */
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
  };

  const products = await Product.findAll({
    ...objQuery, include: [{
      model: Subcategory, where:
        { fk_category: req.params.id }, include: [{ model: Category }]
    }]
  })

  res.status(200).json({
    success: true,
    length: products.length,
    data: products
  })
})

const getOnSale = dryFn(async (req, res, next) => {
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


const getPhoto = dryFn(async (req, res, next) => {
  if (!req.params.id) {
    return next(new GeneralError("No product id provided", 400));
  }
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    return next(new GeneralError("Product not found", 404));
  }
  const urlPath = path.join(__dirname, `../uploads/products/${product.file}`);
  res.sendFile(urlPath, (err) => {
    if (err) {
      return next(new GeneralError("Error retrieving image", 500));
    }
  });
});

//Create photo for a product
const createPhoto = dryFn(async (req, res, next) => {
  if (!req.file) {
    return next(new GeneralError("No file uploaded", 400));
  }
  const validateProduct = await Product.findByPk(req.params.id)
  if (!validateProduct) {
    return next(new GeneralError("Product not found", 404));
  }
  const t = sq.transaction(async () => {
    const product = await Product.update({ file: `${req.file.filename}`}, {
      where: { sku: req.params.id }
    });
    res.status(200).json({
      success: true,
      data: {
        filename: req.file.filename,
        message: "Image uploaded successfully"
      }
    });
    //Return from transaction
    return product;
  }).catch((e) => {
    next(e);
  })
})

const deletePhotoProduct = dryFn(async (req, res, next) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    return next(new GeneralError("Product not found", 404));
  }
  const filePath = path.join(__dirname, `../uploads/products/${product.file}`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  sq.transaction(async () => {
    const product = await Product.update({ file: "defaultImage.png" }, { where: { sku: req.params.id } });
    res.status(200).json({ success: true, data: "Image deleted successfully" });
    return product;
  }).catch((e) => {
    next(e);
  });
});

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getProducts,
  getProduct,
  getProductsBySubcategory,
  getProductsByCategory,
  getOnSale,
  createPhoto,
  getPhoto,
  deletePhotoProduct
};
