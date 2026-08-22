const express = require('express');
const router = express.Router();

const {
  getMyPayroll,
  getAllPayroll,
  getEmployeePayroll,
  createPayroll,
  updatePayroll,
} = require('../controllers/payrollController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * Payroll Routes — Placeholders
 * All routes require authentication (protect).
 * Employees have read-only access to their own payroll.
 * HR/Admin have full access.
 *
 * To be fully implemented in the Payroll APIs milestone.
 */

// @route   GET /api/payroll/me
// @access  Private — Employee (own payroll, read-only)
router.get('/me', protect, authorizeRoles('Employee', 'HR'), getMyPayroll);

// @route   GET /api/payroll
// @access  Private — HR only
router.get('/', protect, authorizeRoles('HR'), getAllPayroll);

// @route   GET /api/payroll/:employeeId
// @access  Private — HR only
router.get('/:employeeId', protect, authorizeRoles('HR'), getEmployeePayroll);

// @route   POST /api/payroll
// @access  Private — HR only
router.post('/', protect, authorizeRoles('HR'), createPayroll);

// @route   PUT /api/payroll/:id
// @access  Private — HR only
router.put('/:id', protect, authorizeRoles('HR'), updatePayroll);

module.exports = router;
