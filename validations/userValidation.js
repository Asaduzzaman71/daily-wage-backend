const { body ,check} = require('express-validator');
const registrationDataValidation = [
    body('firstName').isLength({ min: 1, }).withMessage('Enter a name within 1 chars long'),
    body('lastName').isLength({ min: 1, }).withMessage('Enter a name within 1 chars long'),
    body('email').isEmail().withMessage('must be a valid email'),
    // check('password')
    // .isLength({ min: 5 })
    // .withMessage('must be at least 5 chars long')
    // .matches(/\d/)
    // .withMessage('must contain a number'),
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
        // Indicates the success of this synchronous custom validator
        return true;
    }),
]
   
module.exports = {
    registrationDataValidation,
};
