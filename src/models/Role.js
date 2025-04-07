const sq = require("../database/conn")
const {DataTypes} = require("sequelize")

const Role = sq.define("ROLE", {
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true,
    },
    name : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    description : {
        type : DataTypes.STRING,
        allowNull : false,
    }
},{freezeTableName : true, timestamps : false})

module.exports = Role