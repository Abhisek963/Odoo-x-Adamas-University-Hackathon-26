const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');
const { generateEmployeeId } = require('../utils/generateEmployeeId');
const { generateTemporaryPassword } = require('../utils/generateTemporaryPassword');
const getNextEmployeeSerial = require('../utils/getNextEmployeeSerial');

/**
 * Creates a new employee account (unprotected for test milestone)
 * TODO: This endpoint MUST be protected by authentication & HR authorization middleware in the next milestone.
 */
async function createEmployee(req, res, next) {
  try {
    const { firstName, lastName, email, joiningYear, role } = req.body;

    // 1. Validate required fields
    if (!firstName || !lastName || !email || !joiningYear) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, email, and joining year are required fields'
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 2. Check if the email already exists
    const existingEmailUser = await User.findOne({ email: trimmedEmail });
    if (existingEmailUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists'
      });
    }

    // 3. Resolve the next available serial number
    const serialNumber = await getNextEmployeeSerial();

    // 4. Generate the employee ID
    let employeeId;
    try {
      employeeId = generateEmployeeId(firstName, lastName, joiningYear, serialNumber);
    } catch (validationErr) {
      return res.status(400).json({
        success: false,
        message: validationErr.message
      });
    }

    // Double check that the generated employee ID does not already exist
    const existingIdUser = await User.findOne({ employeeId });
    if (existingIdUser) {
      return res.status(409).json({
        success: false,
        message: `Generated Employee ID ${employeeId} already exists in the system`
      });
    }

    // 5. Generate a secure temporary password
    const temporaryPassword = generateTemporaryPassword(12);

    // 6. Create and save the new User document
    // The password will be hashed automatically by the User model's pre-save middleware
    const newUser = new User({
      employeeId,
      email: trimmedEmail,
      password: temporaryPassword,
      role: role || 'employee',
      mustChangePassword: true
    });

    await newUser.save();

    // Create the associated Employee profile document
    const newEmployee = new Employee({
      employeeId,
      firstName,
      lastName,
      personalEmail: trimmedEmail,
      jobTitle: role === 'hr' ? 'HR Manager' : 'Software Engineer',
      department: role === 'hr' ? 'Human Resources' : 'Engineering'
    });
    await newEmployee.save();

    // 7. Return successful response containing the plain temporary password (only returned once)
    // Never return the hashed password
    return res.status(201).json({
      success: true,
      message: 'Employee account created successfully',
      employeeId: newUser.employeeId,
      email: newUser.email,
      role: newUser.role,
      temporaryPassword: temporaryPassword
    });

  } catch (error) {
    // Handle duplicate key errors from Mongoose
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Duplicate key error: Employee ID or email already exists'
      });
    }
    // Forward to global error handler
    next(error);
  }
}

/**
 * Authenticates an employee/HR user and issues a JWT
 */
async function login(req, res, next) {
  try {
    const { login, password } = req.body;

    // 1. Validate inputs
    if (!login || !password) {
      return res.status(400).json({
        success: false,
        message: 'Login identifier (email/employee ID) and password are required'
      });
    }

    const trimmedLogin = login.trim();

    // 2. Find the user by either employeeId or email
    // Since 'password' is excluded by default in the schema (select: false),
    // we explicitly select it using .select('+password') for verification.
    const user = await User.findOne({
      $or: [
        { employeeId: trimmedLogin },
        { email: trimmedLogin.toLowerCase() }
      ]
    }).select('+password');

    // 3. If user is not found, return generic "Invalid credentials" error
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // 4. Compare passwords using the schema instance method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // 5. Generate a JWT containing only userId and role
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.warn('WARNING: JWT_SECRET environment variable is not defined. Using temporary fallback key.');
    }
    
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      jwtSecret || 'temporary_hackathon_jwt_secret_key_12345',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    // 6. Return response containing token, user profile, and change-password state
    // Never expose the password hash
    return res.status(200).json({
      success: true,
      token,
      user: {
        employeeId: user.employeeId,
        email: user.email,
        role: user.role
      },
      mustChangePassword: user.mustChangePassword
    });

  } catch (error) {
    next(error);
  }
}

/**
 * Changes user password on first login
 */
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    // 1. Validate both fields are present
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Both current password and new password are required'
      });
    }

    // 2. Validate password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // 3. Find the user (load password hash explicitly)
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // 4. Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect current password'
      });
    }

    // 5. Prevent new password from being the same as the current password
    const isSame = await user.comparePassword(newPassword);
    if (isSame) {
      return res.status(400).json({
        success: false,
        message: 'New password cannot be the same as the current password'
      });
    }

    // 6. Assign plain-text new password and reset change status flag
    // Saving the user doc triggers the model pre-save hook to hash user.password
    user.password = newPassword;
    user.mustChangePassword = false;

    await user.save();

    // 7. Return success details without returning hash
    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
      mustChangePassword: false
    });

  } catch (error) {
    next(error);
  }
}

module.exports = {
  createEmployee,
  login,
  changePassword
};

