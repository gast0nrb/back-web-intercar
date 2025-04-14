const express = require("express")
const router = express.Router();
const {getDistricts, getBranchByDistrict, createDistrict} = require("../controllers/district.js")

router.route("/district").get(getDistricts).post(createDistrict)
router.route("/district/branch").get(getBranchByDistrict)

module.exports = router;
