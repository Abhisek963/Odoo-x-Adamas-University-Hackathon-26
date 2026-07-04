const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes using JWT authentication
 */
async function protect(req, res, next) {
  let token;

  // 1. Read authorization header and verify the Bearer token format
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify token
      const jwtSecret = process.env.JWT_SECRET || 'temporary_hackathon_jwt_secret_key_12345';
      const decoded = jwt.verify(token, jwtSecret);

      // 3. Find the current user in MongoDB and exclude the password field
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists in the system'
        });
      }

      // 4. Attach user to request object
      req.user = user;
      return next();

    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token is invalid or expired'
      });
    }
  }

  // 5. If no token was found
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }
}

/**
 * Middleware to authorize access based on user roles
 * @param {...string} allowedRoles - Roles allowed to access the route (e.g. 'hr', 'employee')
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    // 1. Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user authentication context missing'
      });
    }

    // 2. Validate role matches allowed list
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: your role is not authorized to access this resource'
      });
    }

    return next();
  };
}

module.exports = {
  protect,
  authorizeRoles
};
