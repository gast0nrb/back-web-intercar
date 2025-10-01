const express = require("express")
const router = express.Router()
const {getContacts, createContact, deleteContact, updateContact} = require("../controllers/contact")

router.route("/contact").get(getContacts).post(createContact)

router.route("/contact/:id").put(updateContact).delete(deleteContact)



module.exports =  router;