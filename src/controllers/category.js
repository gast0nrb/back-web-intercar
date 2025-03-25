const Category = require("../models/Category")
const dryFn = require("../middlewares/dryFn")
const {GeneralError} = require("../helpers/classError")

const getCategories = dryFn(async (req, res, next) => {
  const category = await Category.findAll({ order: [["id", "ASC"]] });

  res.status(200).json({
    success: true,
    length: category.length,
    data: category,
  });
});

const updateCategory =  dryFn(async (req, res, next) => {
  const ct = await Category.findByPk(req.params.id);
  if (!ct) {
    return next(
      new GeneralError("no se encontró categoria con el id: " + req.params.id, 404)
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
          message: `Modificada la categoria con id ${req.params.id}`,
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
          message: `Creada correctamente la categoria`,
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
    return next(
      new NotFound(`no se encontro categoria con el id ${req.params.id}`)
    );
  }
  const t = sq
    .transaction(async () => {
      const category = await Category.destroy({ where: { id: req.params.id } });
      res.status(200).json({
        success: true,
        data: {
          message: `Se elimino la categoria con el id ${req.params.id}`,
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
