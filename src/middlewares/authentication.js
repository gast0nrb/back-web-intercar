const { GeneralError } = require("../helpers/classError");
const jwt = require("jsonwebtoken")
const JWT_INTERCAR = process.env.JWT_INTERCAR;

const verifyToken = (req, res, next) => {
    const {token} = req.headers;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token not provied"
        })
    }
    try {
        const payload = jwt.verify(token, JWT_INTERCAR);
        req.username = payload.uid;
        req.role = payload.role;
        next()
    } catch (err) {
        return res.status(403).json({ success: false, message: "Token not valid" })
    }
}

const protectUser = (req, res, next) => {
    if (req.role > 3) {
        return next(new GeneralError("Not authorized", 401))
    }
    next();
}

const protectRoot = (req, res, next) => {
    if(req.role != 1) {
        return next(new GeneralError("Not authorized", 401))
    }
    next()
}

const protectAdmin = (req, res, next) => {
    if(req.role > 2) {
        return next(new GeneralError("Not authorized", 401))
    }
    next()
}

const protectClient = (req, res, next) => {
    if(req.role > 4) {
        return next(new GeneralError("Not authorized", 401))
    }
    next()
}


module.exports = {
    protectAdmin, protectClient, protectRoot, protectUser, verifyToken
}