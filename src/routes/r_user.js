const router = require("express").Router()
const {getUsers, updateUser,logIn, deleteUser, createUser} = require("../controllers/user")

router.route("/users").get(getUsers).post(createUser)
router.route("/users/:id").put(updateUser).delete(deleteUser)

router.route("/login").post(logIn);
module.exports = router