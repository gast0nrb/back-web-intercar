const Role = require("../models/Role")
const dryFn = require("../middlewares/dryFn")
const sq = require("../database/conn")

const getRoles = dryFn(async (req, res, next) => {
    const roles = await Role.findAll()
    res.status(200).json({
        success : true,
        length : roles.length,
        data : roles
    })
})

const createRole = dryFn(async (req, res, next) => {
    const t = sq.transaction(async () => {
        const role = await Role.create(req.body)
        res.status(200).json({
            success : true,
            data : role
        })
        return role;
    })
    .catch((e) => next(e))
})

module.exports = {
    getRoles,
    createRole
}
