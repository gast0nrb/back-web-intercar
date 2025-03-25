const sq = require("../database/conn");
const { DataTypes } = require("sequelize");

const District = sq.define(
  "District",
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
  },
  { timestamps: false, freezeTableName: true }
);

module.exports = District;
