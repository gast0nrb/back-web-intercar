const express = require("express");
const router = express.Router();
const multer = require("multer")
const path = require("path")
const {
  createBranch,
  getBranches,
  updateBranch,
  deleteBranch,
  getBranch,
  createImageBranch,
  getImageBranch,
  deleteImageBranch
} = require("../controllers/branch");
const { protectAdmin, verifyToken } = require("../middlewares/authentication")
const Branch = require("../models/Branch");
const { GeneralError } = require("../helpers/classError");


const fileFilterBranch = async (req, file, cb) => {
  // Check if the file is an image
  const allowedTypes = ["jpeg", "png", "gif", "jpg"];
  const fileType = file.mimetype.split("/")[1];
  if (!allowedTypes.includes(fileType)) {
    return cb(new GeneralError("Only images are allowed", 500), false)
  }
  const checkBranch = await Branch.findByPk(req.params.id);
  if (!checkBranch) {
    return cb(new GeneralError("Branch not found", 404), false)
  } else {
    cb(null, true)
  }
}


//File routes for branches
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/branches"))
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.id}.${file.mimetype.split("/")[1]}`)
  },
})


const uploadBranches = multer({ storage, fileFilter: fileFilterBranch })

//Routes to get image from branch
router.route("/branch/:id/photo").get(getImageBranch);
router.route("/branch/:id/upload").post(uploadBranches.single("image"), createImageBranch);
router.route("/branch/:id/delete").delete(deleteImageBranch);

router.route("/branch").get(getBranches).post(verifyToken, protectAdmin, createBranch);
router.route("/branch/:id").get(getBranch).put(verifyToken, protectAdmin, updateBranch).delete(verifyToken, protectAdmin, deleteBranch);

module.exports = router;
