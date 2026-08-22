const Employee = require('../models/Employee');

// ─── Constants ────────────────────────────────────────────────────────────────

// Fields an Employee is allowed to update on their own profile
const EMPLOYEE_ALLOWED_FIELDS = ['phone', 'address', 'profilePicture'];

// Fields HR is NOT allowed to set via the update endpoint
// (user reference must never be changed; role changes go through auth)
const HR_BLOCKED_FIELDS = ['user', '_id', '__v', 'createdAt', 'updatedAt'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
//
/**
 * Builds a clean employee response object with the populated user
 * data merged in. Password is never included.
 */
const buildEmployeeResponse = (employee) => {
  const emp = employee.toObject();
  if (emp.user && typeof emp.user === 'object') {
    delete emp.user.password;
    delete emp.user.__v;
  }
  return emp;
};

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * @desc    Get the logged-in employee's own profile
 * @route   GET /api/employees/me
 * @access  Private — Employee, HR
 */
const getMyProfile = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id }).populate(
      'user',
      '-password -__v'
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee profile not found. Please contact HR.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully.',
      data: { employee: buildEmployeeResponse(employee) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update the logged-in employee's own profile (limited fields only)
 * @route   PUT /api/employees/me
 * @access  Private — Employee, HR
 *
 * Allowed fields: phone, address, profilePicture
 * Any other fields in the body are silently ignored.
 */
const updateMyProfile = async (req, res, next) => {
  try {
    // Build update object — only allowed fields
    const updates = {};
    EMPLOYEE_ALLOWED_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: `No valid fields provided. You can update: ${EMPLOYEE_ALLOWED_FIELDS.join(', ')}.`,
      });
    }

    const employee = await Employee.findOneAndUpdate(
      { user: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('user', '-password -__v');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee profile not found. Please contact HR.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: { employee: buildEmployeeResponse(employee) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all employee profiles
 * @route   GET /api/employees
 * @access  Private — HR only
 */
const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().populate('user', '-password -__v');

    res.status(200).json({
      success: true,
      message: 'Employees retrieved successfully.',
      count: employees.length,
      data: { employees: employees.map(buildEmployeeResponse) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single employee's profile by Employee document _id
 * @route   GET /api/employees/:id
 * @access  Private — HR only
 */
const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id).populate(
      'user',
      '-password -__v'
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee retrieved successfully.',
      data: { employee: buildEmployeeResponse(employee) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update any employee's profile (full access)
 * @route   PUT /api/employees/:id
 * @access  Private — HR only
 *
 * HR can update all profile fields except: user, _id, __v, timestamps.
 * Salary and payroll data are managed by the separate Payroll module.
 */
const updateEmployeeById = async (req, res, next) => {
  try {
    // Strip fields HR must not overwrite
    const updates = { ...req.body };
    HR_BLOCKED_FIELDS.forEach((field) => delete updates[field]);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided to update.',
      });
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('user', '-password -__v');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully.',
      data: { employee: buildEmployeeResponse(employee) },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getAllEmployees,
  getEmployeeById,
  updateEmployeeById,
};
