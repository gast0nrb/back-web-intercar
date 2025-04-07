const bcrypt = require("bcrypt");

const comparePass = async(tryPass, userPass) => {
    return await bcrypt.compare(tryPass, userPass);
}

module.exports = {
    comparePass
}