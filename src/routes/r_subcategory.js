const express = require("express");
const router = express.Router();
const { getSubcategoriesByCategory, getSubcategories, createSubcategory, updateSubcategory, deleteSubcategory, getSubcategoryById} = require("../controllers/subcategory");

router.route("/subcategories").get(getSubcategories).post(createSubcategory);
router.route("/subcategories/:id").get(getSubcategoryById).put(updateSubcategory).delete(deleteSubcategory);

router.route("/category/:id/subcategories").get(getSubcategoriesByCategory)

module.exports = router;