const express = require("express");
const router = express.Router();
const {
  createBranch,
  getBranches,
  updateBranch,
  deleteBranch,
  getBranch,    
} = require("../controllers/branch");
const {protectAdmin, verifyToken} = require("../middlewares/authentication")

router.route("/branch").get(getBranches).post(verifyToken,protectAdmin,createBranch);
router.route("/branch/:id").get(getBranch).put(verifyToken,protectAdmin,updateBranch).delete(verifyToken,protectAdmin,deleteBranch);

module.exports = router;
