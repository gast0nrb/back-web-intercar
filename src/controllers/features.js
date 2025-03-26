const Features = require("../models/Features");
const sq = require("../database/conn");
const dryFn = require("../middlewares/dryFn");
const { GeneralError } = require("../helpers/classError");

const createFeature = dryFn(async (req, res, next) => {
  const t = sq
    .transaction(async () => {
      const feature = await Features.create(req.body);

      res.status(200).json({
        success: true,
        data: {
          message: `Feature created successfully`,
          newvalues: req.body,
        },
      });
      return feature;
    })
    .catch((e) => next(e));
});

const updateFeature = dryFn(async (req, res, next) => {
  const ft = await Features.findByPk(req.params.id);
  if (!ft) {
    return next(new GeneralError("Feature not found", 404));
  }
  const t = sq
    .transaction(async () => {
      const feature = await ft.update(req.body);
      res.status(200).json({
        success: true,
        data: { message: `Feature updated successfully`, newvalues: req.body },
      });
      return feature;
    })
    .catch((e) => next(e));
});

const deleteFeature = dryFn(async (req, res, next) => {
  const ft = await Features.findByPk(req.params.id);
  if (!ft) {
    return next(new GeneralError("Feature not found", 404));
  }
  const t = sq
    .transaction(async () => {
      await ft.destroy({ where: { id: req.params.id } });
      res.status(200).json({
        success: true,
        data: { message: `Feature deleted successfully` },
      });
      return ft;
    })
    .catch((e) => next(e));
});

const getFeatures = dryFn(async (req, res, next) => {
  const features = await Features.findAll();
  res.status(200).json({ success: true, data: features });
});

module.exports = { createFeature, updateFeature, deleteFeature, getFeatures };
