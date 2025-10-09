const utilities = require(".")
const { body, validationResult } = require("express-validator")
const managementModel = require("../models/management-model")

const validate = {}

validate.addClassificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isAlphanumeric()
            .isLength({ min: 1 })
            .custom(async (classification_name) => {
                const classification = await managementModel.checkExistingEmail(classification_name)
                if (classification) {
                    throw new Error("Classification exists. Please enter a different classification")
                }
            })
            .withMessage("Please provide a new classification to add."), // on error this message is sent.
    ]
}

validate.checkAddClassification = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            title: "Add classification view",
            nav,
            classification_name,
        })
        return
    }
    next()
}


validate.addInventoryRules = () => {
    return [
        // make_name is required and must be string
        body("make_name")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Pleas insert the right value"),

        // model_name is required and must be string
        body("model_name")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Pleas insert the right value"),

        // year is required and must be 4 character
        body("year")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ max: 4 })
            .withMessage("Pleas insert the right value"),

        // description is required and must be string
        body("description")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Pleas insert the right value"),

        // img is required and must be string
        body("img")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Pleas insert the right value"),

        // thumbnail is required and must be string
        body("thumbnail")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Pleas insert the right value"),

        // price is required and must be string
        body("price")
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .withMessage("Pleas insert the right value"),

        // miles is required and must be string
        body("miles")
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .withMessage("Pleas insert the right value"),

        // color is required and must be string
        body("color")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Pleas insert the right value"),

        // classification is required and must be string
        body("classification_id")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Pleas insert the right value"),
    ]
}

validate.checkAddInventory = async (req, res, next) => {
    const { make_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const classificationSelect = await utilities.getClassifications()
        res.render("inventory/add-inventory", {
            title: "Add inventory view",
            nav,
            make_name,
            classificationSelect
        })
        return
    }
    next()
}

validate.checkUpdateData = async (req, res, next) => {
    const inv_id = parseInt(req.params.inv_id)
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        const itemData = await invModel.getInventoryByDetailsId(inv_id)
        const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
        let classification = await utilities.getClassifications()
        let nav = await utilities.getNav()
        res.render("inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            classification: classification,
            errors: null,
            inv_id: itemData[0].inv_id,
            inv_make: itemData[0].inv_make,
            inv_model: itemData[0].inv_model,
            inv_year: itemData[0].inv_year,
            inv_description: itemData[0].inv_description,
            inv_image: itemData[0].inv_image,
            inv_thumbnail: itemData[0].inv_thumbnail,
            inv_price: itemData[0].inv_price,
            inv_miles: itemData[0].inv_miles,
            inv_color: itemData[0].inv_color,
            classification_id: itemData[0].classification_id
        })
        return
    }
    next()
}

module.exports = validate