const sq = require("../database/conn");
const {DataTypes} = require("sequelize")
const District = require("./District");

const City = sq.define(
  "CITY",
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
  {
    timestamps: false,
    freezeTableName: true,
  }
);

City.hasMany(District, {
  foreignKey: "city_id",
  sourceKey: "id",
  primaryKey: true,
  allowNull : false
});

District.belongsTo(City, {
  foreignKey: "city_id",
  targetKey: "id",
  primaryKey: true,
  allowNull: false
});

module.exports = City;
