const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const generateTkn = (res, uid, id_role) => {
    const tkn = jwt.sign({ uid, id_role }, JWT_SECRET, { expiresIn: "1d" });

    res.cookie("intercarjwt", tkn, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000
    })
}

module.exports = { generateTkn }