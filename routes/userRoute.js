const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');
const {
    getAllUsers,
    getAllUsersLogs,
    getAllUserActivityReport
} = require('../controllers/UserController');

router.get('/', authenticateUser, authorizePermissions(['admin']), getAllUsers);
router.get('/activity-logs', authenticateUser,  getAllUsersLogs);
router.get('/activity-reports', authenticateUser, authorizePermissions(['admin']), getAllUserActivityReport);

module.exports = router