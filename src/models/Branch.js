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
      type: DataTypes.STRING,
    },
    adress: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    embeedwaze: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    wazeredirection : {
      allowNull: false,
      type : DataTypes.STRING,
    },
    mapsredirection : {
      allowNull: false,
      type : DataTypes.STRING
    },
  },
  { freezeTableName: true, timestamps: false }
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
