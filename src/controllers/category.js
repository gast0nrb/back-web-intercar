const Category = require("../models/Category");
const dryFn = require("../middlewares/dryFn");
const { GeneralError } = require("../helpers/classError");
const sq = require("../database/conn.js");
const paginateQuery =  require("../helpers/pagination.js")

const getCategories = dryFn(async (req, res, next) => {
  let objQuery = {
    order : [["id", "ASC"]]
  }
  if (req.query.page) {
    let totalRows = await Category.count();
    const pagination = paginateQuery(totalRows, parseInt(req.query.page))
    objQuery = {...objQuery, ...pagination}
  }
  const category = await Category.findAll(objQuery);
  if(category.length == 0){
      return next(new GeneralError('Categories not found', 404));
  }
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
  getCategories
};
