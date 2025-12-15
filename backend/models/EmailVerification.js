const mongoose = require('mongoose');

const emailVerificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    index: true
  },
  otp: {
    type: String,
    required: [true, 'OTP is required']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0
  },
  maxAttempts: {
    type: Number,
    default: 5
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // Auto-delete after expiration
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EmailVerification', emailVerificationSchema);
