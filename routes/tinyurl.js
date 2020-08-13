var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
var tinyUrlController = require("../controllers/tinyurl");
var authController = require("../controllers/auth");

router.use(authController.isSignedIn, (err, req, res, next) => {next()}, authController.getUserById);

// POST - create tinyUrl
router.post("/create", [
    check("url").isLength({ min: 10 }).withMessage('minimum 10 chars required')
], authController.isAuthenticated, tinyUrlController.create);

// GET - get original url
router.get("/:tinyHash", tinyUrlController.getUrl);

module.exports = router;
