const sq = require("./conn")

const testConn = async() => {
    try {
        await sq.authenticate()
        sq.sync({force : false})
        console.log("Db connection created succesfully")
    }catch(err) {
        console.error("Cannot connect with db, error: " + err)
    }
}

module.exports = testConn;
