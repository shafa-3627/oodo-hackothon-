const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

// ─── Helper ──────────────────────────────────────────────────────────────────

/**
 * Generates a signed JWT for the given user id.
 * Expires in 7 days by default.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Builds the safe user payload to return in responses.
 * Password is never included.
 */
const userPayload = (user) => ({
  _id: user._id,
  employeeId: user.employeeId,
  name: user.name,
  email: user.email,
  role: user.role,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt,
});

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
const signup = async (req, res, next) => {
  try {
    const { employeeId, name, email, password, role } = req.body;

    // 1. Validate required fields
    if (!employeeId || !name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: employeeId, name, email, password, role.',
      });
    }

    // 2. Validate role value
    if (!['Employee', 'HR'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be either 'Employee' or 'HR'.",
      });
    }

    // 3. Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          'Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.',
      });
    }

    // 4. Check for duplicate email
    const emailExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // 5. Check for duplicate employeeId
    const idExists = await User.findOne({ employeeId: employeeId.trim() });
    if (idExists) {
      return res.status(409).json({
        success: false,
        message: 'An account with this Employee ID already exists.',
      });
    }

    // 6. Create user (password hashed via pre-save hook in User model)
    const user = await User.create({
      employeeId: employeeId.trim(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
    });

    // 7. Auto-create a blank Employee profile linked to this user
    await Employee.create({ user: user._id });

    // 8. Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: {
        user: userPayload(user),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login an existing user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // 2. Find user — include password for comparison (select: false by default)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // 3. Compare password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // 4. Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        user: userPayload(user),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current authenticated user's profile
 * @route   GET /api/auth/me
 * @access  Private (requires JWT)
 */
const getMe = async (req, res, next) => {
  try {
    // req.user is set by protect middleware
    res.status(200).json({
      success: true,
      message: 'Authenticated user retrieved.',
      data: {
        user: userPayload(req.user),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, getMe };
