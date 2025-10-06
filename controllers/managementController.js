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

module.exports = { addController }