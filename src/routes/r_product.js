const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const { deletePhotoProduct,  getPhoto,createPhoto,
      createProduct, deleteProduct, getProducts,
      getProduct, updateProduct, getOnSale,
      getProductsBySubcategory} = require("../controllers/product")
const { createFeatureProduct, deleteFeatureProduct, updateFeatureProduct } = require("../controllers/feature_product")
const { verifyToken, protectAdmin, protectRoot } = require("../middlewares/authentication")
const Product = require("../models/Product")


//Products router
router.route("/products").get(getProducts).post(verifyToken, protectAdmin, createProduct)

router.route("/products/:sku").get(getProduct).put(verifyToken, protectAdmin, updateProduct).delete(verifyToken, protectRoot, deleteProduct)

router.route("/onsale/products").get(getOnSale)

router.route("/subcategory/:id_subcategory").get(getProductsBySubcategory)

//File routes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads/products"))
    },
    filename: (req, file, cb) => {
        cb(null, `${req.params.id}.${file.mimetype.split("/")[1]}`)
    }
})

const fileFilterProduct = async (req, file, cb) => {
  // Check if the file is an image
  const allowedTypes = ["jpeg", "png", "gif", "jpg"];
  const fileType = file.mimetype.split("/")[1];
  if (!allowedTypes.includes(fileType)) {
    return cb(new GeneralError("Only images are allowed", 500), false)
  }
  const checkProduct = await Product.findByPk(req.params.id);
  if (!checkProduct) {
    return cb(new GeneralError("Product not found", 404), false)
  } else {
    cb(null, true)
  }
}

const upload = multer({ storage, fileFilter: fileFilterProduct })

//Create a photo for a product
router.route("/products/:id/upload").post(upload.single("image"), createPhoto)
router.route("/products/:id/photo").get(getPhoto)
router.route("/products/:id/delete").delete(verifyToken, protectAdmin, deletePhotoProduct)

//feature-product router
//deprecated?
router.route("/feature/:fk_feature/product/:fk_product").put(verifyToken, protectAdmin, updateFeatureProduct).delete(verifyToken, protectAdmin, deleteFeatureProduct)
router.route("/features/product").post(verifyToken, protectAdmin, createFeatureProduct);

module.exports = router;
