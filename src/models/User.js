const sq =  require("../database/conn")
const {DataTypes} = require("sequelize")

const User = sq.define("USER", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    hashedPassword: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},{freezeTableName: true, timestamps: true})


module.exports = User