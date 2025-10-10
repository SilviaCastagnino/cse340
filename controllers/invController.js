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
    let nav = await utilities.getNav()
    const grid = await utilities.buildManagementView()
    const classificationSelect = await utilities.getClassifications()
    res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
        message: null,
        classificationSelect,
        grid
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


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

/* *********
 *  Build edit-inventory view
 * ********** */
invCont.buildEditInventoryView = async function (req, res, next) {
    let nav = await utilities.getNav()
    const inv_id = parseInt(req.params.inv_id)
    const itemData = await invModel.getInventoryByDetailsId(inv_id)
    const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
    let classification = await utilities.getClassifications()
    res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classification,
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
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body
    const updateResult = await invModel.updateInventory(
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    )

    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model
        req.flash("notice", `The ${itemName} was successfully updated.`)
        res.redirect("/inv/management")
    } else {
        const classificationSelect = await utilities.getClassifications()
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            classificationSelect: classificationSelect,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
    }
}

/* *********
 *  Build delete-inventory view
 * ********** */
invCont.deleteInventoryView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryByDetailsId(inv_id)
    const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
    // let classification = await utilities.getClassifications()
    res.render("./inventory/delete-confirm", {
        title: "Delete " + itemName,
        message: null,
        nav,
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
}

/* *********
 *  Build delete-inventory action
 * ********** */
invCont.confirmDeleteInventory = async function (req, res, next) {
    const inv_id = req.body
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryByDetailsId(inv_id["inv_id"])
    const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
    const updateResult = await invModel.deleteInventoryItem(inv_id["inv_id"])

    if (updateResult) {
        req.flash("notice", `The ${itemName} was successfully deleted.`)
        res.redirect("/inv/management")
    } else {
        const classification = await utilities.getClassifications()
        req.flash("notice", "Sorry, the Delete failed.")
        res.status(501).render("./inventory/delete-confirm", {
            title: "Delete " + itemName,
            message: null,
            nav
        })
    }

}

module.exports = invCont