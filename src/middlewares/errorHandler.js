const { GeneralError } = require("../helpers/classError");

const printError = (error) => {
  console.log("----------------");
  console.log(error);
  console.log("----------------");
};

const logError = (err, req, res, next) => {
  printError(err);
  next(err);
};

const handleError = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  //Chequear vía if el error y cambiar el error.message
  //Chequea error.name == ''
  //error = new GeneralError(message, 400) //Para terminar la info

  return res.status(error.statusCode || 500).json({
    success: false,
    error: {
      message: error.message || "SERVER ERROR",
    },
  });
};

module.exports = { handleError, logError };
