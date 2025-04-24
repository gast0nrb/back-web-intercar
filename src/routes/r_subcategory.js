const express = require("express");
const router = express.Router();
const { getSubcategoriesByCategory, getSubcategories, createSubcategory, updateSubcategory, deleteSubcategory, getSubcategoryById} = require("../controllers/subcategory");
const {verifyToken, protectAdmin} = require("../middlewares/authentication")


router.route("/subcategories").get(getSubcategories).post(verifyToken,protectAdmin,createSubcategory);
router.route("/subcategories/:id").get(getSubcategoryById).put(verifyToken,protectAdmin,updateSubcategory).delete(verifyToken,protectAdmin,deleteSubcategory);

router.route("/category/:id/subcategories").get(getSubcategoriesByCategory)

module.exports = router;