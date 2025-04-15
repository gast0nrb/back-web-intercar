const sq = require("../database/conn")
const { GeneralError } = require("../helpers/classError")
const FeatureProduct = require("../models/FeatureProduct");
const dryFn = require("../middlewares/dryFn")

const createFeatureProduct = dryFn(async (req, res, next) => {
    const t = sq.transaction(async () => {
        const { fk_product, fk_feature, value } = req.body
        const featureproduct = await FeatureProduct.create({ fk_product, fk_feature, value });
        res.status(201).json({
            success: true,
            data: featureproduct
        })
        return featureproduct
    }).catch((e) => next(e))
})

const updateFeatureProduct = dryFn(async (req, res, next) => {
    const { fk_feature, fk_product } = req.params;
    const featureproduct = await FeatureProduct.findAll({
        where: {
            fk_feature: fk_feature,
            fk_product: fk_product
        }
    });
    if (!featureproduct) {
        return next(new GeneralError("Feature-product doesn't find with id feature: " + fk_feature + "And sku:" + fk_product))
    }
    const t = sq.transaction(async () => {
        const { value } = req.body;
        const ftpd = await FeatureProduct.update({ value: value }, { where: { fk_feature: fk_feature, fk_product: fk_product } })
        res.status(200).json({
            success: true,
            data: `updated property value to : ${value}`
        })
        return ftpd;
    }).catch((e) => next(e))
})

const deleteFeatureProduct = dryFn(async (req, res, next) => {
    const { fk_feature, fk_product } = req.params;
    const featureproduct = await FeatureProduct.findAll({
        where: {
            fk_feature: fk_feature,
            fk_product: fk_product
        }
    });
    if (!featureproduct) {
        return next(new GeneralError("Feature-product doesn't find with id feature: " + fk_feature + "And sku:" + fk_product))
    }
    const t = sq.transaction(async () => {
        const { value } = req.body;
        const ftpd = await FeatureProduct.destroy({
            where: {
                fk_feature: fk_feature,
                fk_product: fk_product
            }, value
        })
        res.status(200).json({
            success: true,
            data: `Deleted succesfully feature-product with feature id: ${fk_feature} and sku: ${fk_product}`
        })
        return ftpd;
    }).catch((e) => next(e))
})



module.exports = {
    createFeatureProduct,
    updateFeatureProduct,
    deleteFeatureProduct
}