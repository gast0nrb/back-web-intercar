const router = require("express").Router()
const {getUsers, updateUser,logIn, deleteUser, createUser} = require("../controllers/user")
const {verifyToken, protectRoot, protectAdmin} = require("../middlewares/authentication")

router.route("/users").get(verifyToken,protectAdmin, getUsers)
   .post(
     verifyToken,protectRoot,
      createUser)
router.route("/users/:id").put(verifyToken,protectRoot,updateUser).delete(verifyToken, protectRoot,deleteUser)

router.route("/login").post(logIn);
module.exports = router
