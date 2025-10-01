const { Sequelize } = require("sequelize");
const dotenv = require("dotenv").config();

const sq = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS,{
  host : process.env.HOST,
  dialect : 'mysql'
})

module.exports = sq;
