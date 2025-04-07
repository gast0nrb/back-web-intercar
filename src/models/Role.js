const sq = require("../database/conn")
const { DataTypes } = require("sequelize")
const User = require("./User")

const Role = sq.define("ROLE", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, { freezeTableName: true, timestamps: false })

Role.hasMany(User, {
    foreignKey: "fk_role", allowNull: false
})

User.belongsTo(Role, {
    foreignKey: "fk_role", allowNull: false
})

module.exports = Role