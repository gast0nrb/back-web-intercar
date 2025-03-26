const sq = require("../database/conn");
const {DataTypes} = require("sequelize");

const Features = sq.define(
  "FEATURES",
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
  },{
    timestamps: true,
    freezeTableName: true,
  }
)

module.exports = Features;
