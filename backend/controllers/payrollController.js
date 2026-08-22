/**
 * Payroll Controller
 *
 * Placeholder — to be implemented in the Payroll APIs milestone.
 *
 * Planned endpoints:
 *   GET  /api/payroll/me              → Employee: view own payroll records (read-only)
 *   GET  /api/payroll                 → Admin/HR: view all employees' payroll
 *   GET  /api/payroll/:employeeId     → Admin/HR: view specific employee's payroll
 *   POST /api/payroll                 → Admin/HR: create a payroll record
 *   PUT  /api/payroll/:id             → Admin/HR: update salary structure
 */

const getMyPayroll = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Not implemented yet. Coming in Payroll APIs milestone.',
  });
};

const getAllPayroll = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Not implemented yet. Coming in Payroll APIs milestone.',
  });
};

const getEmployeePayroll = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Not implemented yet. Coming in Payroll APIs milestone.',
  });
};

const createPayroll = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Not implemented yet. Coming in Payroll APIs milestone.',
  });
};

const updatePayroll = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Not implemented yet. Coming in Payroll APIs milestone.',
  });
};

module.exports = {
  getMyPayroll,
  getAllPayroll,
  getEmployeePayroll,
  createPayroll,
  updatePayroll,
};
