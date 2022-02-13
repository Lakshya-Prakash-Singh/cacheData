const { check, validationResult } = require('express-validator'); 
const globals = require("../globals.json");

module.exports = {
    keyAndValueValidator: [
        check('key', 'Please provide key for processing.') 
            .notEmpty(), 
        check('value', 'Please provide value for processing.') 
            .notEmpty()
    ]
}