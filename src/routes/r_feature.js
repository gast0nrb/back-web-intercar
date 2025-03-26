const express = require("express");
const router = express.Router();
const {createFeature, updateFeature, deleteFeature, getFeatures} = require("../controllers/features");

router.route("/features").post(createFeature).get(getFeatures);
router.route("/features/:id").put(updateFeature).delete(deleteFeature);

module.exports = router;