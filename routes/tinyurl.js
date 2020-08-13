var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
var tinyUrlController = require("../controllers/tinyurl");

// POST - create tinyUrl
router.post("/create", [
    check("url").isLength({ min: 10 }).withMessage('minimum 10 chars required')
], tinyUrlController.create);

// GET - get original url
router.get("/:tinyHash", tinyUrlController.getUrl);

module.exports = router;
