const express = require('express');
const router = express.Router();
const { 
  getEmployeeProfile, 
  updateEmployeeProfile, 
  getEmployeeSalary, 
  updateEmployeeSalary 
} = require('../controllers/employeeController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Route to get current logged-in employee profile
router.get('/profile', protect, getEmployeeProfile);

// Route to update allowed profile fields of current logged-in employee
router.put('/profile', protect, updateEmployeeProfile);

// Route to fetch current employee salary details (read-only for employee role)
router.get('/salary', protect, getEmployeeSalary);

// Route to update an employee's salary configuration (restricted to HR managers)
router.put('/salary/:employeeId', protect, authorizeRoles('hr'), updateEmployeeSalary);

module.exports = router;
