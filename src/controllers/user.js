const User = require("../models/User")
const Role = require("../models/Role")
const dryFn = require("../middlewares/dryFn")
const { GeneralError } = require("../helpers/classError")
const sq = require("../database/conn")
const { comparePass } = require("../helpers/auth")
const { generateTkn } = require("../helpers/generateTkn")

const logIn = dryFn(async (req, res, next) => {
    const u1 = await User.findOne({ where: { email: req.body.email }, include: { model: Role } });

    if (!u1 || !(await comparePass(req.body.password, u1.hashedPassword))) {
        return next(new GeneralError("Invalid email or password", 401))
    }

    generateTkn(res, u1.id, u1.id_role);

    res.status(200).json({
        success: true,
        message: "Logged in successfully",
    })
})

const getUsers = dryFn(async (req, res, next) => {
    const users = await User.findAll({
        include: [
            {
                model: Role,
                attributes: ["name", "description"]
            }
        ]
    });
    res.status(200).json({
        success: true,
        length: users.length,
        data: users
    })
})

const updateUser = dryFn(async (req, res, next) => {
    const u = await User.findByPk(req.params.id)
    if (!u) {
        return next(new GeneralError("User not found", 404))
    }

    const t = sq.transaction(async (t) => {
        const user = await User.update(req.body, { where: { id: req.params.id } })
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        })
        return user
    })
        .catch((err) => {
            next(err, 500)
        })
})

const deleteUser = dryFn(async (req, res, next) => {
    const u = await User.findByPk(req.params.id)
    if (!u) {
        return next(new GeneralError("User not found", 404))
    }

    const t = sq.transaction(async (t) => {
        const user = await User.destroy({ where: { id: req.params.id } })
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: user
        })
        return user
    })
        .catch((err) => {
            next(err, 500)
        })
})

const createUser = dryFn(async (req, res, next) => {
    const sq = sq.transaction(async (t) => {
        const user = await User.create(req.body)
        res.status(200).json({
            success: true,
            message: "User created successfully",
            data: user
        })
        return user
    })
        .catch((err) => {
            next(err, 500)
        })
})

module.exports = {
    getUsers,
    updateUser,
    deleteUser,
    createUser
}


