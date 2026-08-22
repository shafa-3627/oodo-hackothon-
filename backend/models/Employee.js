const mongoose = require('mongoose');

/**
 * Employee Model
 *
 * Holds extended profile data for each registered user.
 * Linked 1-to-1 with a User document via the `user` reference.
 *
 * Field editing rules (enforced in controller):
 *   - Employee role : can update phone, address, profilePicture only
 *   - HR role       : can update all fields
 *
 * Salary and payroll data are managed by the separate Payroll module.
 * Attendance and Leave fields are managed by teammate (Member 3)
 * and should be added as separate models referencing Employee._id.
 */

const employeeSchema = new mongoose.Schema(
  {
    // ── Link to auth User ──────────────────────────────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    // ── Fields editable by Employee (self) ─────────────────────────
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    address: {
      type: String,
      default: '',
      trim: true,
    },
    profilePicture: {
      type: String, // URL or relative file path
      default: '',
    },

    // ── Fields editable by HR only ─────────────────────────────────
    department: {
      type: String,
      default: '',
      trim: true,
    },
    designation: {
      type: String,
      default: '',
      trim: true,
    },
    dateOfJoining: {
      type: Date,
    },
    documents: [
      {
        name: { type: String, trim: true },
        url: { type: String },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      // Remove __v from all JSON responses
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
