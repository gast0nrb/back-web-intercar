const sq = require("../database/conn");
const { DataTypes } = require("sequelize");
const Category = require("./Category");

const Subcategory = sq.define(
  "SUBCATEGORY",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { timestamps: false, freezeTableName: true }
);

Category.hasMany(Subcategory,{
     foreignKey: "fk_category", allowNull: false
    });

Subcategory.belongsTo(Category, {
  foreignKey: "fk_category",
  allowNull: false,
});


module.exports = Subcategory;


