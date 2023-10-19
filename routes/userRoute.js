const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');
const {
    getAllUsers,
    getAllUsersLogs
} = require('../controllers/UserController');

router.get('/', authenticateUser, getAllUsers);
router.get('/activity-logs', authenticateUser, getAllUsersLogs);
module.exports = router