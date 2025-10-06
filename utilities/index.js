const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
                + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + 'details"><img src="' + vehicle.inv_thumbnail
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
                + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
                + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* **************************************
* Build the details view HTML
* ************************************ */
Util.buildDetailsGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = `
    <div class="veichles-details">
      <section>
      <img src="${data[0].inv_image}" alt="${data[0].inv_make}">
      </section>
      <section>
        <h3><b>Description</b>:</h3>
        <p>${data[0].inv_description}</p>
        <h3><b>Miles</b>:</h3>
        <p>${data[0].inv_miles}</p>
        <h3><b>Color</b>:</h3>
        <p>${data[0].inv_color}</p>
        <h3><b>Price</b>:</h3>
        <p>${data[0].inv_price}$</p>
      </section>
    </div>
    `
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid;
}

Util.buildManagementView = async function () {
    let grid = `
    <div class="management-view">
        <a href="./add-classification">Add New Classification</a>
        <a href="./add-inventory">Add New Inventory</a>
    </div>
    `
    return grid;
}

Util.getClassifications = async function () {
    let classificationList = await invModel.getClassifications();
    let classifications = `
  <label for="classification">Choose a classification:</label>
  <select id="classification" name="classification">
  `
    classificationList.rows.forEach(classification => {
        classifications += `<option value="${classification["classification_id"]}" > ${classification["classification_name"]}</option>`
  })
    classifications += `</select>`
  return classifications;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util