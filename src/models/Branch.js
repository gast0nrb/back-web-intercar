const sq = require("../database/conn");
const { DataTypes } = require("sequelize");
const District = require("./District");

const Branch = sq.define(
  "SUCURSAL",
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
    phone: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    adress: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    url: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  },
  { freezeTableName: true, timestamps: true }
);

District.hasMany(Branch, {
  foreignKey: {
    allowNull: false,
    name: "fk_district",
  },
});

Branch.belongsTo(District, {
  foreignKey: {
    allowNull: false,
    name: "fk_district",
  },
});

module.exports = Branch;
