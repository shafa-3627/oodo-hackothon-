const express = require('express');
const router = express.Router();

const { signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/auth/signup
// @desc    Register a new user (Employee or HR)
// @access  Public
router.post('/signup', signup);

// @route   POST /api/auth/login
// @desc    Login with email and password, returns JWT
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Get the current authenticated user's profile
// @access  Private
router.get('/me', protect, getMe);

module.exports = router;
