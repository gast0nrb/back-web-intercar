const sq = require("../database/conn");
const Subcategory = require("../models/Subcategory");
const Category = require("../models/Category");
const dryFn = require("../middlewares/dryFn");
const { GeneralError } = require("../helpers/classError");

const getSubcategories = dryFn(async (req, res, next) => {
  const subcategories = await Subcategory.findAll({ include: [Category] });
  res
    .status(200)
    .json({ success: true, length: subcategories.length, data: subcategories });
});

const createSubcategory = dryFn(async (req, res, next) => {
    const t = sq.transaction(async () => {
        const subcategory = await Subcategory.create(req.body);
        res.status(200).json({success: true, data: subcategory});
    })
    .catch((e) => next(e));
});

const updateSubcategory = dryFn(async (req, res, next) => {
    const subcategory = await Subcategory.findByPk(req.params.id);
    if (!subcategory) {
        return next(new GeneralError("Subcategory not found", 404));
    }
    const t = sq.transaction(async () => {
        await Subcategory.update(req.body, {where: {id: req.params.id}});
        res.status(200).json({success: true, data: subcategory});
        return subcategory;
    }).catch((e) => next(e));
})

const deleteSubcategory = dryFn(async (req, res, next) => {
    const subcategory = await Subcategory.findByPk(req.params.id);
    if (!subcategory) {
        return next(new GeneralError("Subcategory not found", 404));
    }
    const t = sq.transaction(async () => {
        await Subcategory.destroy({where: {id: req.params.id}});
        res.status(200).json({success: true, data: `Subcategory ${subcategory.id} deleted`});
        return subcategory;
    }).catch((e) => next(e));
})

const getSubcategoryById = dryFn(async (req, res, next) => {
    const subcategory = await Subcategory.findByPk(req.params.id, {include: [Category]});
    if (!subcategory) {
        return next(new GeneralError("Subcategory not found", 404));
    }
    res.status(200).json({success: true, data: subcategory});
})

module.exports = {getSubcategories, createSubcategory, updateSubcategory, deleteSubcategory, getSubcategoryById};
