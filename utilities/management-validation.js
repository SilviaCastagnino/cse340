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

module.exports = validate