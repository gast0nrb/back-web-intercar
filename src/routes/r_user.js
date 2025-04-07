const router = require("express").Router()
const {getUsers, updateUser, deleteUser, createUser} = require("../controllers/user")

router.route("/users").get(getUsers).post(createUser)
router.route("/users/:id").put(updateUser).delete(deleteUser)

module.exports = router