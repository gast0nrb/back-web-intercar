const Branch = require("../models/Branch");
const sq = require("../database/conn");
const dryFn = require("../middlewares/dryFn");
const { GeneralError } = require("../helpers/classError");
const District = require("../models/District");
const City = require("../models/City");
const paginateQuery = require("../helpers/pagination")
const path = require("path")

const createImageBranch = dryFn(async(req, res, next)=> {
  if(!req.file){
    return next(new GeneralError("No file uploaded", 400));
  }
  const validateBranch = await Branch.findByPk(req.params.id)
  if(!validateBranch){
    //Realizar el remove desde acá si es que el brach no existe
    return next(new GeneralError("Branch not found", 404))
  }
  const t = sq.transaction(async()=> {
    const branch = await Branch.update({url : req.file.filename}, {where : {id : req.params.id}})
    res.status(200).json({success : true, data : {filename : req.file.filename, message : "Image uploaded successfully"}})
  return branch
  }).catch((e)=> next(e))
})

const updateImageBranch = dryFn(async(req, res, next)=> {})

const deleteImageBranch = dryFn(async(req, res, next)=> {})

const getImageBranch = dryFn(async(req, res, next)=> {
  if(!req.params.id){
    return next(new GeneralError("No branch id provided", 400));
  }
  const branch = await Branch.findByPk(req.params.id);
  if(!branch){
    return next(new GeneralError("Branch not found", 404));
  }
  const urlPath = path.join(__dirname, `../uploads/branches/${branch.url}`);
  res.sendFile(urlPath, (err) => {
    if (err) {
      return next(new GeneralError("Error retrieving image", 500));
    }
  });
})

const getBranches = dryFn(async (req, res, next) => {
  let objQuery = {
    order : [["id", "ASC"]]
  }
  if (req.query.page) {
    let totalRows = await Branch.count();
    const pagination = paginateQuery(totalRows, parseInt(req.query.page))
    objQuery = {...objQuery, ...pagination}
  }
  const branches = await Branch.findAll({...objQuery,
    include: [{ model: District, include: [{ model: City }] }],
  });
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
      const branch = await Branch.destroy({ where: { id: req.params.id } });
      res.status(200).json({
        success: true, 
        data : `Branch ${req.params.id} deleted succesfully`
      })
        return branch;
    })
    .catch((e) => next(e));
});

const getBranch = dryFn(async (req, res, next) => {
  const branch = await Branch.findByPk(req.params.id, {
    include: [{ model: District, include: [{ model: City }] }],
  });
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
  createImageBranch ,
  getImageBranch
};
