const router = require("express").Router()
const { getRoles, createRole } = require("../controllers/role")

router.route("/role").get(getRoles).post(createRole)

module.exports = router;