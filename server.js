//Thirds modules
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors")
const helmet = require("helmet")
const path = require("path")
const fs = require("fs")

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
const r_user = require("./src/routes/r_user")
const r_role = require("./src/routes/r_role")
const r_district = require("./src/routes/r_district");

const app = express();

//Init env variables
dotenv.config();
const PORT = process.env.PORT || 8000;
const ROUTE = process.env.ROUTE

//Test db
testConn();

app.use(express.json())
app.use(helmet())
app.use(cors())

//Creación de directorio para guardar files
const uploadDir = path.join(__dirname, '../secure-uploads/')
if(!fs.existsSync(uploadDir)){
	fs.mkdirSync(uploadDir, { recursive: true, mode: 0o755 });
}


//Rutas
app.use(ROUTE, r_city);
app.use(ROUTE, r_category);
app.use(ROUTE, r_product)
app.use(ROUTE, r_branches)
app.use(ROUTE, r_subcategory)
app.use(ROUTE, r_feature)
app.use(ROUTE, r_user)
app.use(ROUTE, r_role)
app.use(ROUTE, r_district)

//Handle errors
app.use(logError);
app.use(handleError);

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
