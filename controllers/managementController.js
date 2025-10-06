const utilities = require("../utilities/")
const managementModel = require("../models/management-model")

async function addController(req, res) {
    let nav = await utilities.getNav()
    const {
        classification_name
    } = req.body

    const regResult = await managementModel.addController(classification_name)
    const grid = await utilities.buildManagementView()

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you have added a new controller ${classification_name}.`
    )
        res.status(201).render("inventory/management", {
            title: "Management view",
            nav,
            errors: null,
            message: "Success! Added a new classification",
            grid,
        })
    } else {
        req.flash("notice", "Sorry, failed to add a new controller.")
    }
}

async function addInventory(req, res) {
    let nav = await utilities.getNav()
    const {
        make_name, model_name, year, description, img, thumbnail, price, miles, color, classification
    } = req.body

    const regResult = await managementModel.addInventory(make_name, model_name, year, description, img, thumbnail, price, miles, color, classification)
    const grid = await utilities.buildManagementView()

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you have added a new inventory ${make_name}.`
    )
        res.status(201).render("inventory/management", {
            title: "Management view",
            nav,
            errors: null,
            message: "Success! Added a new inventory",
            grid,
        })
    } else {
        req.flash("notice", "Sorry, failed to add a new inventory.")
    }
}

module.exports = { addController, addInventory }