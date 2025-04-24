const express = require("express");
const router = express.Router();
const {createFeature, updateFeature, deleteFeature, getFeatures, getProductsByFeature} = require("../controllers/features");
const {verifyToken, protectAdmin, protectUser, protectRoot } = require("../middlewares/authentication")


router.route("/features").post(verifyToken, protectAdmin, createFeature).get(verifyToken, protectUser , getFeatures);
router.route("/features/:id").put(verifyToken, protectAdmin,updateFeature).delete(verifyToken, protectRoot , deleteFeature);

router.route("/features/:id/products").get(getProductsByFeature);

module.exports = router;