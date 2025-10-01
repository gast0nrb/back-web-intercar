const Contact = require("../models/Contact")
const dryFn = require("../middlewares/dryFn")
const { GeneralError } = require("../helpers/classError")
const sq = require("../database/conn")

const getContacts = dryFn(async (req, res, next) => {
    let whereObj = {};
    let paramField;

    if (req.params.rut || req.params.mail || req.params.name) {
        paramField = Object.keys(req.params);
        if (paramField.length >= 1) {
            return next(new GeneralError("Solo se acepta un parametro para filtrar", 400));
        } else {
            paramField = Object.keys(req.params)[0]
        }
        whereObj = {
            where: {
                paramField
            }
        }
    }

    const getContacts = await Contact.findAll({ whereObj })
    if (!getContacts) {
        return next(`No se encontraron valores con el ${paramField} : ${req.params[`${paramField}`]}`)
    }
    res.status(200).json({
        success: true,
        length: getContacts.length,
        data: getContacts
    })
});

const createContact = dryFn(async (req, res, next) => {
    const t = sq.transaction(async () => {
        const contact = await Contact.create(req.body);

        res.status(200).json({
            success: true,
            data: {
                message: 'Contact created succesfully',
                newValues: req.body
            }
        });
        return contact
    }).catch((e) => next(e));
});

const updateContact = dryFn(async (req, res, next) => {
    const existContact = await Contact.findByPk(req.params.id);
    if (!existContact) {
        return next(new GeneralError(`No se encontró contacto con id: ${req.params.id}`, 404))
    }
    const t = sq.transaction(async () => {
        const contactUpdate = await Contact.update(req.body, { where: { id: req.params.id } })

        res.status(200).json({
            success: true,
            data: {
                message: `Contact updated succesfully with id ${req.params.id}`,
                newValues: req.body
            }
        })
        return contactUpdate;
    }).catch((e) => next(e))
});

const deleteContact = dryFn(async (req, res, next) => {
    const existContact = await Contact.findByPk(req.params.id);
    if (!existContact) {
        return next(new GeneralError(`No se encontró contacto con id: ${req.params.id}`, 404))
    }
    const t = sq.transaction(async () => {
        const contactDelete = await Contact.destroy({
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({
            success: true,
            data: {
                message: `Delete contact with the id : ${req.params.id}`,
                deleted: contactDelete

            }
        })
        return contactDelete;
    }).catch((e) => next(e))
});


module.exports = {
    getContacts,
    createContact,
    updateContact,
    deleteContact
};