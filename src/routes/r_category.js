const {createCategory, deleteCategory, getCategories, updateCategory, getProductsByCategory} = require("../controllers/category")
const express = require("express")
const router =  express.Router()

router.route("/category").get(getCategories).post(createCategory)

router.route("/category/:id").put(updateCategory).delete(deleteCategory)

router.route("/category/:id/products").get(getProductsByCategory)

module.exports = router;