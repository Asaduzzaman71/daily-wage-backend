const express = require('express');
const upload = require('../middleware/file-upload');
const router = express.Router();
const { registrationDataValidation } = require('../validations/userValidation');
const { validateRequestSchema } = require('../middleware/validate-request');
const { register, login, logout, verifyEmail, getAllUsers } = require('../controllers/UserController');
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');
router.post('/register', upload.single('profile_pic') , registrationDataValidation, validateRequestSchema , register);
router.post('/login', login);
router.get('/logout', authenticateUser, logout);
router.post('/verify-email', verifyEmail);
router.get('/users', authenticateUser, getAllUsers);

module.exports = router;