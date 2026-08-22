const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect
 * Verifies the JWT token from the Authorization header.
 * Attaches the authenticated user to req.user.
 * Usage: add `protect` to any route that requires login.
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (exclude password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. User no longer exists.',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Invalid or expired token.',
    });
  }
};

/**
 * authorizeRoles
 * Restricts access to specific roles.
 * Must be used AFTER protect middleware.
 *
 * Usage:
 *   router.get('/admin-only', protect, authorizeRoles('HR'), handler)
 *   router.get('/both',       protect, authorizeRoles('HR', 'Employee'), handler)
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not authorized for this action.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
