const { body, check } = require('express-validator');
const { User } = require('../models'); // Assuming your User model is here
const { getUserByEmail} = require('../services/userService')
const userUpdateFormValidation = [
    // Validate the name field. It's optional, so we can use optional().
    body('name').optional().isLength({ min: 1 }).withMessage('Name must be at least 1 character long.'),
    
    // Validate the email field, but with a crucial check for updates.
    check('email').optional().isEmail().withMessage('Invalid email format.').custom(async (email, { req }) => {
        // Find the user by the ID from the request parameters
        const userToUpdate = await User.findByPk(req.params.id);

        if (!userToUpdate) {
            throw new Error('User not found.');
        }

        // Check if the new email already exists in the database
        const emailAlreadyExist = await getUserByEmail(email);
        
        // If a user with this email exists, and their ID is different from the user being updated,
        // then this is a conflict, and we should throw an error.
        if (emailAlreadyExist && emailAlreadyExist.id !== userToUpdate.id) {
            throw new Error('Email is already in use by another user.');
        }


    }),
     // Validate the phone field. It's optional and checks for a valid mobile phone format.
    body('phone').optional().isMobilePhone('any').withMessage('Invalid phone number format.'),

];

module.exports = {
    userUpdateFormValidation,
};
