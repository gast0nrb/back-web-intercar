const City = require("../models/City");
const dryFn = require("../middlewares/dryFn");
const { NotFound, GeneralError } = require("../helpers/classError");


const getCities = dryFn(async (req, res, next) => {
  const cities = await City.findAll({ order: [["id", "ASC"]] });

  res.status(200).json({
    success: true,
    length: cities.length,
    data: cities,
  });
});

const updateCity = dryFn(async (req, res, next) => {
  const ct = await City.findByPk(req.params.id);
  if (!ct) {
    return next(
      new GeneralError("City not found with id: " + req.params.id, 404)
    );
  }
  const t = sq
    .transaction(async () => {
      const city = await City.update(req.body, {
        where: { id: req.params.id },
      });

      res.status(200).json({
        success: true,
        data: {
          message: `City updated successfully with id ${req.params.id}`,
          newvalues: req.body,
        },
      });
      return city; //Return from transaction
    }) //Transaction finish
    .catch((e) => next(e)); //Catch errors from transaction
});

const createCity = dryFn(async (req, res, next) => {
  const t = sq
    .transaction(async () => {
      const city = await City.create(req.body);

      res.status(200).json({
        success: true,
        data: {
          message: `City created successfully`,
          newvalues: req.body,
        },
      });
      return city;
    })
    .catch((e) => next(e));
});

const deleteCity = dryFn(async (req, res, next) => {
  const ct = await City.findByPk(req.params.id);
  if (!ct) {
    return next(
      new NotFound(`City not found with id ${req.params.id}`)
    );
  }
  const t = sq
    .transaction(async () => {
      const city = await City.destroy({ where: { id: req.params.id } });
      res.status(200).json({
        success: true,
        data: {
          message: `City deleted successfully with id ${req.params.id}`,
        },
      });
      return city;
    })
    .catch((e) => next(e));
});

module.exports = {
  getCities,
  createCity,
  deleteCity,
  updateCity,
};
