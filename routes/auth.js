var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
var authController = require("../controllers/auth");

// POST - signup
router.post("/signup", [
    check("name").isLength({ min: 3 }).withMessage('minimum 3 chars required'),
    check("username").notEmpty().withMessage('username is required')
        .custom(value => !/\s/.test(value)).withMessage('No spaces are allowed in the username'),
    check("password").isLength({ min: 6 }).withMessage('minimum 6 chars required'),
], authController.signup);

// POST - signin
router.post("/signin", [
    check("username").notEmpty().withMessage('username is required'),
    check("password").notEmpty().withMessage('password is required'),
], authController.signin);

// GET - signout
router.get("/signout", authController.signout);

module.exports = router;
