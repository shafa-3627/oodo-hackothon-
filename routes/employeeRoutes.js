const express = require('express');
const router = express.Router();

const {
  getMyProfile,
  updateMyProfile,
  getAllEmployees,
  getEmployeeById,
  updateEmployeeById,
} = require('../controllers/employeeController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * IMPORTANT: /me routes MUST be defined before /:id routes.
 * Express matches routes top-to-bottom; if /:id came first,
 * the string "me" would be treated as a MongoDB ObjectId and throw a CastError.
 */

// @route   GET /api/employees/me
// @desc    Get logged-in user's own employee profile
// @access  Private — Employee, HR
router.get('/me', protect, authorizeRoles('Employee', 'HR'), getMyProfile);

// @route   PUT /api/employees/me
// @desc    Update own profile (phone, address, profilePicture only)
// @access  Private — Employee, HR
router.put('/me', protect, authorizeRoles('Employee', 'HR'), updateMyProfile);

// @route   GET /api/employees
// @desc    Get all employee profiles
// @access  Private — HR only
router.get('/', protect, authorizeRoles('HR'), getAllEmployees);

// @route   GET /api/employees/:id
// @desc    Get a specific employee's profile by Employee _id
// @access  Private — HR only
router.get('/:id', protect, authorizeRoles('HR'), getEmployeeById);

// @route   PUT /api/employees/:id
// @desc    Update any employee's full profile
// @access  Private — HR only
router.put('/:id', protect, authorizeRoles('HR'), updateEmployeeById);

module.exports = router;
