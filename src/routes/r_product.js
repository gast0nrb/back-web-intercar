const express = require("express")
const router = express.Router()
const {createProduct, deleteProduct, getProducts,getProduct, updateProduct} = require("../controllers/product")

router.route("/products").get(getProducts).post(createProduct)

router.route("/products/:id").get(getProduct).put(updateProduct).delete(deleteProduct)

module.exports = router;