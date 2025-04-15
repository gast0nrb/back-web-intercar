const {createCategory, deleteCategory, getCategories, updateCategory} = require("../controllers/category")
const express = require("express")
const router =  express.Router()

router.route("/category").get(getCategories).post(createCategory)

router.route("/category/:id").put(updateCategory).delete(deleteCategory)


module.exports = router;