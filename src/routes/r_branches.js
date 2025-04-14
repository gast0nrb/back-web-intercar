const express = require("express");
const router = express.Router();
const {
  createBranch,
  getBranches,
  updateBranch,
  deleteBranch,
  getBranch,    
} = require("../controllers/branch");

router.route("/branch").get(getBranches).post(createBranch);
router.route("/branch/:id").get(getBranch).put(updateBranch).delete(deleteBranch);

module.exports = router;
