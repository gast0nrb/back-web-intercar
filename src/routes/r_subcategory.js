const express = require("express");
const router = express.Router();
const {getSubcategories, createSubcategory, updateSubcategory, deleteSubcategory, getSubcategoryById} = require("../controllers/subcategory");

router.route("/subcategories").get(getSubcategories).post(createSubcategory);
router.route("/subcategories/:id").get(getSubcategoryById).put(updateSubcategory).delete(deleteSubcategory);

module.exports = router;