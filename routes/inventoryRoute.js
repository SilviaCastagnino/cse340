// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const managementValidate = require('../utilities/management-validation')
const utilities = require("../utilities/")
const managementController = require("../controllers/managementController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build inventory by details view
router.get("/detail/:detailsId", invController.buildByDetailsId);
// Route to build management view
router.get("/management", invController.buildManagementView);
// Route to add classification view
router.get("/add-classification", invController.buildAddClassificationView);
// Route to add new classification to the DB
router.post(
    "/add-classification",
    managementValidate.addClassificationRules(),
    managementValidate.checkAddClassification,
    utilities.handleErrors(managementController.addController)
);

module.exports = router;
