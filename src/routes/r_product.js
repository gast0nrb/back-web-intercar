const express = require("express")
const router = express.Router()
const { getProductsBySubcategory, createProduct, deleteProduct, getProducts, getProduct, updateProduct, getProductsByCategory } = require("../controllers/product")
const { createFeatureProduct, deleteFeatureProduct, updateFeatureProduct } = require("../controllers/feature_product")
const {verifyToken, protectAdmin, protectRoot} = require("../middlewares/authentication")


router.route("/products").get(getProducts).post(verifyToken,protectAdmin,createProduct)

router.route("/products/:sku").get(getProduct).put(verifyToken,protectAdmin,updateProduct).delete(verifyToken, protectRoot,deleteProduct)

//filter by subcategory
router.route("/subcategory/:id/products").get(getProductsBySubcategory)

//filter by category
router.route("/category/:id/products").get(getProductsByCategory)

//feature-product router
router.route("/feature/:fk_feature/product/:fk_product").put(verifyToken,protectAdmin,updateFeatureProduct).delete(verifyToken,protectAdmin,deleteFeatureProduct)
router.route("/features/product").post(verifyToken,protectAdmin,createFeatureProduct);

module.exports = router;
