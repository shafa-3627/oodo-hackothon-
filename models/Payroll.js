const mongoose = require('mongoose');

/**
 * Payroll Model
 *
 * Placeholder for Member 2 - Payroll APIs milestone.
 * This model will store salary structure and payroll records
 * for each employee per pay period.
 *
 * Fields to be implemented in the Payroll APIs milestone:
 *   - basicSalary
 *   - allowances (HRA, transport, etc.)
 *   - deductions (tax, provident fund, etc.)
 *   - netSalary
 *   - payPeriod (month/year)
 *   - paymentDate
 *   - paymentStatus (Paid / Pending)
 */

const payrollSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    basicSalary: {
      type: Number,
      default: 0,
    },
    allowances: {
      type: Number,
      default: 0,
    },
    deductions: {
      type: Number,
      default: 0,
    },
    netSalary: {
      type: Number,
      default: 0,
    },
    payPeriod: {
      month: { type: Number }, // 1–12
      year: { type: Number },
    },
    paymentDate: {
      type: Date,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Payroll = mongoose.model('Payroll', payrollSchema);

module.exports = Payroll;
