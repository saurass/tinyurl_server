const TinyUrl = require("../models/tinyurl");
const { check, validationResult } = require("express-validator");
const { ers } = require("./error");

/*
|------------------------------------------------------
|   Create Controller
|------------------------------------------------------
*/
exports.create = (req, res) => {
    return res.json({"succcess" : "true"});
}

/*
|------------------------------------------------------
|   GetURL Controller
|------------------------------------------------------
*/
exports.getUrl = (req, res) => {
    
}