const District = require("../models/District.js");
const {GeneralError} = require("../helpers/classError.js")
const sq = require("../database/conn.js");
const dryFn = require("../middlewares/dryFn.js")

const createDistrict =  dryFn(async(req, res, next )=> {
  const {name, city_id} = req.body;
  const t = sq.transaction(async()=> {
    const district = await District.create({name, city_id});
    res.status(201).json({
      success : true, 
      data : district
    })
    return district;
  }).catch((e)=> next(e))
});

const getDistricts = dryFn(async(req, res, next)=> {
  const districts = await District.findAll();
  console.log("district:"+ districts)
  res.status(200).json({
    success : true, 
    data : districts
  })
});

const getBranchByDistrict = dryFn(async(req, res, next)=> {
  const branch = await Branch.findByPk(req.params.id);
  if(!branch) {
    return next(new GeneralError("Branch not found with id:" + req.params.id , 404)) 
  }
  res.status(200).json({
    success : true,
    data : branch
  })
});

module.exports = {
  getDistricts,
  createDistrict,
  getBranchByDistrict
}
