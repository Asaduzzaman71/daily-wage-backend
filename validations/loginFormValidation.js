const { body } = require('express-validator');

const loginFormValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required'),
    
    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
];

module.exports = {
    loginFormValidation,
};