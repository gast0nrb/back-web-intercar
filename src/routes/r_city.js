const express = require("express");
const router = express.Router();
const {
  getCities,
  createCity,
  deleteCity,
  updateCity,
} = require("../controllers/city");
const {verifyToken, protectAdmin} = require("../middlewares/authentication")


router.route("/city").get(getCities).post(verifyToken,protectAdmin,createCity);

router.route("/city/:id").put(verifyToken, protectAdmin, updateCity).delete(verifyToken, protectAdmin, deleteCity);

module.exports = router;
