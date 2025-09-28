const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');
const { validateRequestSchema } = require('../middleware/validate-request');
const { userUpdateFormValidation } = require('../validations/userUpdateFormValidation');
const {
    getAllUsers,
    getAllUsersLogs,
    getAllUserActivityReport,
    update
} = require('../controllers/UserController');

router.get('/', authenticateUser, authorizePermissions(['admin']), getAllUsers);
router.get('/activity-logs', authenticateUser,  getAllUsersLogs);
router.get('/activity-reports', authenticateUser, authorizePermissions(['admin']), getAllUserActivityReport);
router.put('/:id', userUpdateFormValidation, validateRequestSchema, authenticateUser, authorizePermissions(['admin']), update);

module.exports = router