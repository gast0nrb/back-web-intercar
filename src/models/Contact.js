const sq = require("../database/conn.js")
const {DataTypes} = require("sequelize")

const Contact = sq.define('CONTACT', {
  id : {
    type : DataTypes.INTEGER,
    autoIncrement : true,
    primaryKey : true, 
    unique : true,
    allowNull : false
  },
  mail : {
    type: DataTypes.STRING(200),
    allowNull : false,
    validate : {
      isEmail : true
    }
  },
  name : {
    type : DataTypes.STRING(150),
    allowNull : false
  },
  rut : {
    type : DataTypes.STRING(10),
    allowNull : true,
    defaultValue : '6666666-6',
  },
  comentary : {
    type : DataTypes.STRING(300),
    allowNull : true,
    defaultValue : ''
  },
  active : {
    type : DataTypes.BOOLEAN,
    defaultValue : false
  }
}, {timestamps : true});

module.exports = Contact;

