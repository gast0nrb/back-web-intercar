const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { GeneralError } = require("../helpers/classError");
const JWT_SECRET = process.env.JWT_SECRET;
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
    let token;
    token = req.cookies.intercarjwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await User.findByPk(decoded.id);
            if (!user) {
                return next(new GeneralError("User not found", 401));
            }
            if (user.role < expectedRole) {
                return next(new GeneralError("Unauthorized", 403));
            }
            req.user = user;
            next();
        } catch (err) {
            next(err);
        }
    } else {
        return next(new GeneralError("Not authorized, no token", 401));
    }
})

module.exports = {
    protect
}