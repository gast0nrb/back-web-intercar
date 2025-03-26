const sq = require("../database/conn");
const { DataTypes } = require("sequelize");
const Subcategory = require("./Subcategory");

const Product = sq.define("PRODUCT", {
    sku : {
        type : DataTypes.STRING,
        primaryKey: true
    },
    title : {
        type : DataTypes.STRING(100),
        allowNull : false
    },
    description : {
        type: DataTypes.STRING(300),
        defaultValue : "Sin descripción"
    },
    cost : {
        type : DataTypes.INTEGER,
        defaultValue: 0
    },
    price : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    discount : {
        type : DataTypes.INTEGER,
        defaultValue: 0
    },
    wholesale_price : {
        type : DataTypes.INTEGER,
        defaultValue : 0 
    },
    whosale_quantity : {
        type : DataTypes.INTEGER,
        defaultValue: 1
    },
    onale : {
        type : DataTypes.BOOLEAN,
        defaultValue : false
    },
    stock_renewal : {
        type : DataTypes.BOOLEAN,
        defaultValue : false
    },
    file : {
        type : DataTypes.STRING, 
        defaultValue : "/defaultImage.png" 
    }
},  {timestamps : true, freezeTableName: true})

Product.belongsTo(Subcategory, {
    foreignKey: "fk_subcategory",
    allowNull: false,
})

Subcategory.hasMany(Product, {
    foreignKey: "fk_subcategory",
    allowNull: false,
})

module.exports = Product