const bcrypt = require("bcrypt");
const { GeneralError } = require("../helpers/classError")
const jwt = require("jsonwebtoken")
const JWT_INTERCAR = process.env.JWT_INTERCAR;

const comparePass = async (tryPass, userPass) => {
    return await bcrypt.compare(tryPass, userPass);
}

const verifyToken = (req, res, next) => {
    const header = req.header("Authorization") || "";
    const token = header.split(" ")[1];
    console.log("Aquí esta el token : " +  token + " y aquí esta el secreto : " +  JWT_INTERCAR);
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token not provied"
        })
    }
    try {
        const payload = jwt.verify(token, JWT_INTERCAR);
        req.username = payload.username;
        next()
    } catch (err) {
        return res.status(403).json({ success: false, message: "Token not valid" })
    }
}

const checkRole = (role) => {
    
}

const generateToken = (res, uid, role) => {
    const tkn = jwt.sign({uid, role}, JWT_INTERCAR, {expiresIn : "1d"});
    res.cookie("intercartoken", tkn, {
        httpOnly : true,
        secure : process.env.NODE_ENV !== "development",
        sameSite  :  "strict",
        maxAge : 1 * 24 * 60 * 60 * 1000
    })
}

module.exports = {
    comparePass,
    verifyToken,
    generateToken
}