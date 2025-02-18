const express = require("express");
const router = express.Router();
const {
  getCities,
  createCity,
  deleteCity,
  updateCity,
} = require("../controllers/city");

router.route("/ciudad").get(getCities).post(createCity);

router.route("/ciudad/:id").put(updateCity).delete(deleteCity);

module.exports = router;
