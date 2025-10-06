const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ***************************
 *  Build inventory by details view
 * ************************** */
invCont.buildByDetailsId = async function (req, res, next) {
    const details_id = req.params.detailsId
    const data = await invModel.getInventoryByDetailsId(details_id)
    const grid = await utilities.buildDetailsGrid(data)
    let nav = await utilities.getNav()
    res.render("./inventory/details", {
        title: "Vehicle Details",
        nav,
        grid,
    })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
    const grid = await utilities.buildManagementView()
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
        grid,
        message: null,
    })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        message: null,
    })
}

/* *********
 *  Build add-inventory view
 * ********** */
invCont.buildAddInventoryView = async function (req, res, next) {
    let nav = await utilities.getNav()
    let classification = await utilities.getClassifications()
    res.render("./inventory/add-inventory", {
        title: "Add Inventory View",
        message: null,
        nav,
        classification: classification
    })
}

module.exports = invCont