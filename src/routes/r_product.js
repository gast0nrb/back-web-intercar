const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const { getPhoto,createPhoto,getProductsBySubcategory, createProduct, deleteProduct, getProducts, getProduct, updateProduct, getProductsByCategory, getOnSale } = require("../controllers/product")
const { createFeatureProduct, deleteFeatureProduct, updateFeatureProduct } = require("../controllers/feature_product")
const { verifyToken, protectAdmin, protectRoot } = require("../middlewares/authentication")


//Products router
router.route("/products").get(getProducts).post(verifyToken, protectAdmin, createProduct)

router.route("/products/:sku").get(getProduct).put(verifyToken, protectAdmin, updateProduct).delete(verifyToken, protectRoot, deleteProduct)

router.route("/onsale/products").get(getOnSale)

//File routes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads/products"))
    },
    filename: (req, file, cb) => {
        cb(null, `${req.params.id}.${file.mimetype.split("/")[1]}`)
    }
})

const upload = multer({ storage })

//Create a photo for a product
router.route("/products/:id/upload").post(upload.single("image"), createPhoto)
router.route("/products/:id/photo").get(getPhoto)

//filter by subcategory
router.route("/subcategory/:id/products").get(getProductsBySubcategory)

//filter by category
router.route("/category/:id/products").get(getProductsByCategory)

//feature-product router
router.route("/feature/:fk_feature/product/:fk_product").put(verifyToken, protectAdmin, updateFeatureProduct).delete(verifyToken, protectAdmin, deleteFeatureProduct)
router.route("/features/product").post(verifyToken, protectAdmin, createFeatureProduct);

module.exports = router;
