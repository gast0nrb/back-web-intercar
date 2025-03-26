//Thirds modules
const express = require("express");
const dotenv = require("dotenv");

//Own modules
const { handleError, logError } = require("./src/middlewares/errorHandler");
const testConn = require("./src/database/connection")

//Routes
const r_city = require("./src/routes/r_city")
const r_category = require("./src/routes/r_category")
const r_product = require("./src/routes/r_product")
const r_branches = require("./src/routes/r_branches")
const r_subcategory = require("./src/routes/r_subcategory")
const r_feature = require("./src/routes/r_feature")
const app = express();

//Init env variables
dotenv.config();
const PORT = process.env.PORT || 8000;
const ROUTE = process.env.ROUTE

//Test db
testConn();

//Rutas
app.use(ROUTE, r_city);
app.use(ROUTE, r_category)
app.use(ROUTE, r_product)
app.use(ROUTE, r_branches)
app.use(ROUTE, r_subcategory)
app.use(ROUTE, r_feature)
//Handle errors
app.use(logError);
app.use(handleError);

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
