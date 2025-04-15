const express = require("express")
const router = express.Router()
const { getProductsBySubcategory, createProduct, deleteProduct, getProducts, getProduct, updateProduct } = require("../controllers/product")
const { createFeatureProduct, deleteFeatureProduct, updateFeatureProduct } = require("../controllers/feature_product")

router.route("/products").get(getProducts).post(createProduct)

router.route("/products/:sku").get(getProduct).put(updateProduct).delete(deleteProduct)

//filter by subcategory
router.route("/subcategory/:id/products").get(getProductsBySubcategory)

//feature-product router
router.route("/feature/:fk_feature/product/:fk_product").put(updateFeatureProduct).delete(deleteFeatureProduct)
router.route("/features/product").post(createFeatureProduct);

module.exports = router;