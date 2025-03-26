const express = require("express");
const router = express.Router();
const {
  createBranch,
  getBranches,
  updateBranch,
  deleteBranch,
  getBranch,    
} = require("../controllers/branch");

router.route("/sucursales").get(getBranches).post(createBranch);
router.route("/sucursales/:id").get(getBranch).put(updateBranch).delete(deleteBranch);

module.exports = router;
