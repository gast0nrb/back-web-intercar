const District = require("../models/District.js");
const sq = require("../database/conn.js");
const dryFn = require("../middlewares/dryFn.js")
const paginateQuery = require("../helpers/pagination.js");
const Branch = require("../models/Branch.js");

const createDistrict = dryFn(async (req, res, next) => {
  const { name, city_id } = req.body;
  const t = sq.transaction(async () => {
    const district = await District.create({ name, city_id });
    res.status(201).json({
      success: true,
      data: district
    })
    return district;
  }).catch((e) => next(e))
});

const getDistricts = dryFn(async (req, res, next) => {
  const districts = await District.findAll();
  console.log("district:" + districts)
  res.status(200).json({
    success: true,
    data: districts
  })
});

const getBranchByDistrict = dryFn(async (req, res, next) => {
  let objQuery = {
    order: [["id", "ASC"]]
  }
  if (req.query.page) {
    const totalRows = await Branch.count({
      where: {
        fk_district: req.params.id
      }
    })
    const pagination = paginateQuery(totalRows, parseInt(req.query.page))
    objQuery = { ...objQuery, ...pagination }
  }
  const branch = await Branch.findAll({...objQuery,
    where: {
      fk_district: req.params.id
    }
  });
  res.status(200).json({
    success: true,
    data: branch
  })
});

module.exports = {
  getDistricts,
  createDistrict,
  getBranchByDistrict
}
