//Thirds modules
const express = require("express");
const dotenv = require("dotenv");

//Own modules
const { handleError, logError } = require("./src/middlewares/errorHandler");
const testConn = require("./src/database/connection")

//Routes
const r_city = require("./src/routes/r_city")

const app = express();

//Init env variables
dotenv.config();
const PORT = process.env.PORT || 8000;
const ROUTE = process.env.ROUTE

//Test db
testConn();

//Rutas
app.use(ROUTE, r_city);

//Handle errors
app.use(logError);
app.use(handleError);

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
