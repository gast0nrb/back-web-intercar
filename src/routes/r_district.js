const express = require("express")
const router = express.Router();
const {getDistricts, getBranchByDistrict, createDistrict} = require("../controllers/district.js")
const {verifyToken, protectAdmin} = require("../middlewares/authentication")


router.route("/district").get(getDistricts).post(verifyToken,protectAdmin,createDistrict)
router.route("/district/branch").get(getBranchByDistrict)

module.exports = router;
