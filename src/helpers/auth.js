const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const JWT_INTERCAR = process.env.JWT_INTERCAR;

const comparePass = async (tryPass, userPass) => {
    return await bcrypt.compare(tryPass, userPass);
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
    generateToken
}
