const sq = require("../database/conn")
const {DataTypes} = require("sequelize")

const Category = sq.define("CATEGORY",{
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement: true
    },
    name : {
        type : DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {timestamps: false, freezeTableName: true})

module.exports = Category;