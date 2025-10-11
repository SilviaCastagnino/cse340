const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
}


/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password
  } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

// After the login process
async function buildAccount(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/index", {
    title: "Account",
    nav,
    message: null,
    name: res.locals.accountData.account_firstname,
    type: res.locals.accountData.account_type
  })
}

/* **************
 *  Logout process
 * ************ */
async function accountLogout(req, res) {
  res.clearCookie("jwt")
  res.redirect("/")
}

/* **************
 *  Deliver edit account view
 * ************ */
async function accountEdit(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/edit-account", {
    title: "Edit Account",
    nav,
    message: null,
    firstname: res.locals.accountData.account_firstname,
    lastname: res.locals.accountData.account_lastname,
    email: res.locals.accountData.account_email
  })
}

/* **************
 *  Edit process
 * ************ */
async function editAccount(req, res, next) {
  const { acc_firstname, acc_lastname, acc_email } = req.body
  const editResult = await accountModel.updateAccount(res.locals.accountData.account_id, acc_firstname, acc_lastname, acc_email)
  let nav = await utilities.getNav()
  if (editResult) {
    req.flash(
      "notice",
     " Account modified succesfully"
    )
    res.status(201).render("account/index", {
      title: "Account",
      nav,
      message: "Account modified succesfully",
      name: acc_firstname,
      type: res.locals.accountData.account_type
    })
  } else {
    req.flash("notice", "Sorry, something went wrong.")
    res.status(501).render("account/index", {
      title: "Account",
      nav,
      message: "Somenthing went wrong",
      name: res.locals.accountData.account_firstname,
      type: res.locals.accountData.account_type
    })
  }
}

/* **************
 *  Change password process
 * ************ */
async function changePassword(req, res) {
  const { account_password } = req.body
  const account_id = res.locals.accountData.account_id
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/index", {
      title: "Account",
      nav,
      message: "Somenthing went wrong",
      name: res.locals.accountData.account_firstname,
      type: res.locals.accountData.account_type
    })
  }
  const changePasswordResult = await accountModel.updatePassword(account_id, hashedPassword)
  if (changePasswordResult) {
    req.flash("notice", "Password updated successfully")
    res.status(201).redirect("/account/")
  } else {
    req.flash("notice", "Password update failed")
    res.status(501).redirect("/account/")
  }
}

/* **************
 *  Deliver users list view
 * ************ */
async function userList(req, res, next) {
  let nav = await utilities.getNav()
  let data = await accountModel.getUserList()
  const grid = utilities.getUserList(data)
  res.render("account/user-list", {
    title: "Account List",
    nav,
    message: null,
    grid
  })
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccount, accountLogout, accountEdit, editAccount, changePassword, userList }