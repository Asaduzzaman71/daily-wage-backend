const express = require('express');
const upload = require('../middleware/file-upload');
const router = express.Router();
const { registrationFormValidation } = require('../validations/registrationFormValidation');
const { loginFormValidation } = require('../validations/loginFormValidation');
const { validateRequestSchema } = require('../middleware/validate-request');
const { register, login, logout } = require('../controllers/AuthController');
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');

// router.post('/register', upload.single('profile_pic') , registrationFormValidation, validateRequestSchema , register);
router.post('/register',  registrationFormValidation, validateRequestSchema , register);
router.post('/login', loginFormValidation,  validateRequestSchema, login);
router.post('/logout', authenticateUser, logout);
// router.post('/verify-email', verifyEmail);

module.exports = router;