// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to build path to my account
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Route to build register path
router.get("/register", utilities.handleErrors(accountController.buildRegister));
// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)
// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLogData,
    utilities.handleErrors(accountController.accountLogin)
)
// Default route
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccount))
// Logout route
router.get("/logout", utilities.handleErrors(accountController.accountLogout))
// Route to edit the account information view
router.get("/edit-account", utilities.handleErrors(accountController.accountEdit))
// Route to edit the account information
router.post("/edit-account", utilities.handleErrors(accountController.editAccount))
// Route to change password
router.post(
    "/edit-password",
    regValidate.changePasswordRules(),
    regValidate.checkChangePasswordData,
    utilities.handleErrors(accountController.changePassword)
)
// Route to users list
router.get("/user-list", utilities.checkPermissionUserList, utilities.handleErrors(accountController.userList))

module.exports = router;
