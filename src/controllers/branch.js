const Branch = require("../models/Branch");
const sq = require("../database/conn");
const dryFn = require("../middlewares/dryFn");
const { GeneralError } = require("../helpers/classError");
const District = require("../models/District");
const City = require("../models/City");

const getBranches = dryFn(async (req, res, next) => {
  const branches = await Branch.findAll({include: [{model: District, include: [{model: City}]}]});
  res.status(200).json({
    success: true,
    length: branches.length,
    data: branches,
  });
});

const updateBranch = dryFn(async (req, res, next) => {
  const bh = await Branch.findByPk(req.params.id);
  if (!bh) {
    return next(new GeneralError("Branch not found", 404));
  }
  const t = sq
    .transaction(async () => {
      const branch = await Branch.update(req.body, {
        where: { id: req.params.id },
      });

      res.status(200).json({
        success: true,
        data: {
          message: `Branch updated`,
          newvalues: req.body,
        },
      });
      return branch;
    })
    .catch((e) => next(e));
});

const createBranch = dryFn(async (req, res, next) => {
  const t = sq
    .transaction(async () => {
      const branch = await Branch.create(req.body);

      res.status(200).json({
        success: true,
        data: {
          message: `Branch created`,
          newvalues: req.body,
        },
      });
      return branch;
    })
    .catch((e) => next(e));
});

const deleteBranch = dryFn(async (req, res, next) => {
  const bh = await Branch.findByPk(req.params.id);
  if (!bh) {
    return next(new GeneralError("Branch not found", 404));
  }
  const t = sq
    .transaction(async () => {
      await Branch.destroy({ where: { id: req.params.id } });
    })
    .catch((e) => next(e));
});

const getBranch = dryFn(async (req, res, next) => {
  const branch = await Branch.findByPk(req.params.id, {include: [{model: District, include: [{model: City}]}]});
  if (!branch) {
    return next(new GeneralError("Branch not found", 404));
  }
  res.status(200).json({ success: true, data: branch });
});

module.exports = {
  createBranch,
  getBranches,
  updateBranch,
  deleteBranch,
  getBranch,
};
