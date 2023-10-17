const { body ,check} = require('express-validator');
const User = require('../models/User')
const isEmailUnique = async (email) => {
    const user = await User.findOne({ email });
    return !user; // Return true if email is unique, false otherwise
  };
const registrationFormValidation = [
    body('name').isLength({ min: 1, }).withMessage('Enter name within 1 chars long'),
    check('email').isEmail().withMessage('Invalid email format').custom(async (email) => {
        if (!(await isEmailUnique(email))) {
          throw new Error('Email is already in use');
        }
    }),
    body('password').isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1
    }).withMessage("Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, one speciAl character and one number"),
    body('passwordConfirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
]
   
module.exports = {
  registrationFormValidation,
};
