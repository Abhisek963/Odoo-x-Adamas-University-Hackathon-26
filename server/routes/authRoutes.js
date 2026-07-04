const express = require('express');
const router = express.Router();
const { createEmployee, login, changePassword } = require('../controllers/authController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Route to create a new employee - protected by JWT and HR role check
router.post('/create-employee', protect, authorizeRoles('hr'), createEmployee);

// Route to login
router.post('/login', login);

// Route to change password - protected by JWT
router.put('/change-password', protect, changePassword);

module.exports = router;
