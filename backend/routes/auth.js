const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const EmailVerification = require('../models/EmailVerification');
const { protect } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');
const { generateOTP, sendOTPEmail, sendWelcomeEmail } = require('../services/emailService');

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs (increased for testing)
  message: {
    error: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Helper function to generate JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Helper function to create and send token response
const createSendToken = (user, statusCode, res, message = 'Success') => {
  const token = signToken(user._id);
  
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    message,
    token,
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        profileCompletion: user.profileCompletion,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt
      }
    }
  });
};

// @route   POST /api/auth/signup
// @desc    Register a new user - Step 1: Send OTP to email
// @access  Public
router.post('/signup', authLimiter, async (req, res) => {
  try {
    const {
      username,
      email
    } = req.body;

    // Validate required fields for Step 1 (only email and username)
    if (!username || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and username'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? 'User with this email already exists' 
          : 'Username is already taken'
      });
    }

    // Generate 4-digit OTP
    const otp = generateOTP();
    
    // Set OTP expiration to 15 minutes
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Delete any existing verification records for this email
    await EmailVerification.deleteOne({ email });

    // Create verification record
    const verification = await EmailVerification.create({
      email,
      otp,
      expiresAt
    });

    // Send OTP email
    await sendOTPEmail(email, otp);

    // Store signup data temporarily in session/response (user will need to provide this again during verification)
    res.status(200).json({
      success: true,
      message: 'OTP sent to your email. Please verify to complete signup.',
      data: {
        email,
        verificationId: verification._id
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    res.status(500).json({
      success: false,
      message: error.message || 'Error sending verification email. Please try again.'
    });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and create account
// @access  Public
router.post('/verify-otp', authLimiter, async (req, res) => {
  try {
    const {
      email,
      otp,
      username,
      password,
      fullName,
      phone,
      country,
      province,
      address,
      zip,
      city,
      agreeTerms
    } = req.body;

    // Validate required fields
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Find verification record
    const verification = await EmailVerification.findOne({ email });

    if (!verification) {
      return res.status(400).json({
        success: false,
        message: 'No verification record found. Please signup again.'
      });
    }

    // Check if OTP has expired
    if (new Date() > verification.expiresAt) {
      await EmailVerification.deleteOne({ email });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please signup again to get a new code.'
      });
    }

    // Check if max attempts exceeded
    if (verification.attempts >= verification.maxAttempts) {
      await EmailVerification.deleteOne({ email });
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please signup again.'
      });
    }

    // If email is already verified (from previous OTP verification), skip OTP check
    // This allows the second call to complete account details without re-entering OTP
    if (!verification.isVerified) {
      // Verify OTP
      if (verification.otp !== otp.toString()) {
        verification.attempts += 1;
        await verification.save();
        
        return res.status(400).json({
          success: false,
          message: `Invalid OTP. ${verification.maxAttempts - verification.attempts} attempts remaining.`
        });
      }
    }

    // OTP is valid.
    // Support a 2-step signup flow: if the client only wants to validate the OTP
    // (to move to the details form) we should not require all creation fields here.
    // If username/password/fullName/agreeTerms are NOT provided, return success
    // indicating the OTP is valid so the client can collect the rest of the info.
    if (!username || !password || !fullName || !agreeTerms) {
      // Mark this email as verified in the verification record
      verification.isVerified = true;
      await verification.save();
      
      return res.status(200).json({
        success: true,
        message: 'OTP verified. Please complete your profile to create the account.'
      });
    }

    // Check if user already exists (double check)
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? 'User with this email already exists' 
          : 'Username is already taken'
      });
    }

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password,
      fullName,
      phone,
      country,
      province,
      address,
      zip,
      city,
      agreeTerms,
      isEmailVerified: true,
      emailVerifiedAt: new Date()
    });

    // Update last login
    newUser.lastLogin = new Date();
    await newUser.save({ validateBeforeSave: false });

    // Delete verification record
    await EmailVerification.deleteOne({ email });

    // Send welcome email
    await sendWelcomeEmail(email, fullName);

    createSendToken(newUser, 201, res, 'Account created successfully! Welcome to My Guide In Rome.');

  } catch (error) {
    console.error('OTP verification error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0] || 'Validation error'
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} is already taken`
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error creating account. Please try again.'
    });
  }
});

// @route   POST /api/auth/resend-otp
// @desc    Resend OTP to email
// @access  Public
router.post('/resend-otp', authLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find verification record
    const verification = await EmailVerification.findOne({ email });

    if (!verification) {
      return res.status(400).json({
        success: false,
        message: 'No verification record found. Please signup again.'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Update verification record
    verification.otp = otp;
    verification.expiresAt = expiresAt;
    verification.attempts = 0;
    await verification.save();

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.status(200).json({
      success: true,
      message: 'OTP resent to your email.'
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error resending OTP. Please try again.'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { username, password, remindMe } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }

    // Find user by username or email and include password
    const user = await User.findOne({
      $or: [
        { username: username },
        { email: username }
      ]
    }).select('+password');

    // Check if user exists and password is correct
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    createSendToken(user, 200, res, `Welcome back, ${user.fullName}!`);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in. Please try again.'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          country: user.country,
          province: user.province,
          address: user.address,
          zip: user.zip,
          city: user.city,
          role: user.role,
          profileCompletion: user.profileCompletion,
          isEmailVerified: user.isEmailVerified,
          wishlist: user.wishlist,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
});

// @route   PUT /api/auth/update-profile
// @desc    Update user profile
// @access  Private
router.put('/update-profile', protect, async (req, res) => {
  try {
    const {
      fullName,
      phone,
      country,
      province,
      address,
      zip,
      city
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        fullName,
        phone,
        country,
        province,
        address,
        zip,
        city
      },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0]
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.correctPassword(currentPassword, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    createSendToken(user, 200, res, 'Password changed successfully');

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password'
    });
  }
});

module.exports = router;
