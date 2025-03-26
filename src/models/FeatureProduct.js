const sq = require("../database/conn");
const { DataTypes } = require("sequelize");
const Product = require("./Product");
const Feature = require("./Features");

const ProductFeature = sq.define(
  "PRODUCT_FEATURE",
  {
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
  foreignKey: "fk_product",
  allowNull: false,
  primaryKey: true,
});

Feature.hasMany(ProductFeature, {
  foreignKey: "fk_feature",
  allowNull: false,
  primaryKey: true,
});

module.exports = ProductFeature;
