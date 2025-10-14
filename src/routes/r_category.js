const { createCategory, deleteCategory, getCategories, updateCategory} = require("../controllers/category")
const express = require("express")
const router = express.Router()
const { protectAdmin, verifyToken, protectRoot } = require("../middlewares/authentication")

router.route("/category").get(getCategories).post(verifyToken, protectAdmin, createCategory)

router.route("/category/:id").put(verifyToken, protectAdmin , updateCategory).delete(verifyToken, protectRoot, deleteCategory)


module.exports = router;
