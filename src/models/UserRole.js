const sq = require("../database/conn")
const {DataTypes} = require("sequelize")
const User = require("./User")
const Role = require("./Role")

const UserRole = sq.define("USER_ROLE", {
    fk_user_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        primaryKey : true,
    },
    fk_role_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        primaryKey : true,
    },
    active : {
        type : DataTypes.BOOLEAN,
        allowNull : false,
        defaultValue : false,
    }
},{freezeTableName : true, timestamps : false})

User.hasMany(UserRole, {
    foreignKey : {
        allowNull : false,
        name : "fk_user_id"
    },
    sourceKey : "id"
})

UserRole.belongsTo(User, {
    foreignKey : {
        allowNull : false,
        name : "fk_user_id"
    },
    targetKey : "id"
})

Role.hasMany(UserRole, {
    foreignKey : {
        allowNull : false,
        name : "fk_role_id"
    },
    sourceKey : "id"
})

UserRole.belongsTo(Role, {
    foreignKey : {
        allowNull : false,
        name : "fk_role_id"
    },
    targetKey : "id"
})


module.exports = UserRole