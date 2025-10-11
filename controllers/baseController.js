const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function (req, res) {
    const nav = await utilities.getNav()
    if (res.locals.loggedin) {
        res.render("index", { title: "Home", loggedIn: res.locals.loggedin, accountName: res.locals.accountData.account_firstname, nav })
    } else {
        res.render("index", { title: "Home", loggedIn: res.locals.loggedin, nav })
    }
}

module.exports = baseController