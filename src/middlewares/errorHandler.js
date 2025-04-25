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
  //Errores comunes que se han identificado
  const COMMON_ERRORS = ['SequelizeUniqueConstraintError', 'SequelizeForeignKeyConstraintError'];
  
  if(COMMON_ERRORS.includes(err.name)){
    switch(err.name) {
      case 'SequelizeUniqueConstraintError':
        error.message = err.errors.map((e, i)=> ` ${e.message} ${i==0? '' : '| '}`)[0]
        error.code = 'VL_UNI'
          break;
      case 'SequelizeForeignKeyConstraintError':
        error.message = `Foreign key referenced doesn't exist: (${err.value})`
        error.code = 'NOT_FK'
          break;
      default:
        error.code = 'SVR_ERR'
        error.message = 'SERVER ERROR'
    }
    error.statusCode = 400;
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    error: {
      message: error.message,
      code : error.code
    },
  });
};

module.exports = { handleError, logError };
