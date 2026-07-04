const express = require('express');
const router = express.Router();
const { createEmployee, login } = require('../controllers/authController');

// TODO: This endpoint is temporarily unprotected to allow testing in this milestone.
// MUST be protected by authentication and HR authorization (role checking) middleware in the next milestone.
router.post('/create-employee', createEmployee);

router.post('/login', login);

module.exports = router;
