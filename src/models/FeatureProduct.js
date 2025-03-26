const sq = require("../database/conn");
const { DataTypes } = require("sequelize");
const Product = require("./Product");
const Feature = require("./Features");

const ProductFeature = sq.define(
  "PRODUCT_FEATURE",
  {
    fk_product: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    fk_feature: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

Product.hasMany(ProductFeature, {
  foreignKey: {
    allowNull : false, 
    name : "fk_product"
  },
  sourceKey : "sku"
});

ProductFeature.belongsTo(
  Product, {
    foreignKey : {
      allowNull : false,
      name : "fk_product"
    },
    targetKey : "sku"
  } 
)

Feature.hasMany(ProductFeature, {
  foreignKey : {
    allowNull : false,
    name : "fk_feature"
  },
  sourceKey : "id"
})

ProductFeature.belongsTo(
  Feature, {
    foreignKey : {
      allowNull : false,
      name : "fk_feature"
    },
    targetKey : "id"
  }
)
module.exports = ProductFeature;
