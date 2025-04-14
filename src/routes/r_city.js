const express = require("express");
const router = express.Router();
const {
  getCities,
  createCity,
  deleteCity,
  updateCity,
} = require("../controllers/city");

router.route("/city").get(getCities).post(createCity);

router.route("/city/:id").put(updateCity).delete(deleteCity);

module.exports = router;
