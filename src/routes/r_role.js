const router = require("express").Router()
const { getRoles, createRole } = require("../controllers/role")
const {verifyToken, protectRoot} = require("../middlewares/authentication")


router.route("/role").get(verifyToken, protectRoot, getRoles).post(verifyToken, protectRoot, createRole)

module.exports = router;