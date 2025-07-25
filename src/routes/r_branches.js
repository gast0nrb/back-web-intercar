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
  createImageBranch 
} = require("../controllers/branch");
const {protectAdmin, verifyToken} = require("../middlewares/authentication")

//File routes for branches
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/branches"))
  },
  filename: (req, file, cb)=> {
    cb(null, `${req.params.id}.${file.mimetype.split("/")[1]}`)
  }
})

const uploadBranches = multer({ storage })

//Routes to get image from branch
router.route("/branch/:id/upload").post(uploadBranches.single("image"), createImageBranch)

router.route("/branch").get(getBranches).post(verifyToken,protectAdmin,createBranch);
router.route("/branch/:id").get(getBranch).put(verifyToken,protectAdmin,updateBranch).delete(verifyToken,protectAdmin,deleteBranch);

module.exports = router;
