const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  // Login Credentials
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },

  // Personal Information
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || validator.isMobilePhone(v, 'any');
      },
      message: 'Please provide a valid phone number'
    }
  },

  // Billing Information
  country: {
    type: String,
    trim: true,
    maxlength: [50, 'Country name cannot exceed 50 characters']
  },
  province: {
    type: String,
    trim: true,
    maxlength: [50, 'Province name cannot exceed 50 characters']
  },
  address: {
    type: String,
    trim: true,
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  zip: {
    type: String,
    trim: true,
    maxlength: [20, 'ZIP code cannot exceed 20 characters']
  },
  city: {
    type: String,
    trim: true,
    maxlength: [50, 'City name cannot exceed 50 characters']
  },

  // User Preferences & Status
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerifiedAt: {
    type: Date
  },
  
  // Wishlist for services/tours
  wishlist: [{
    type: String,
    trim: true
  }],

  // Booking History (for future use)
  bookings: [{
    serviceType: String,
    serviceName: String,
    bookingDate: Date,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    }
  }],

  // Terms and Conditions
  agreeTerms: {
    type: Boolean,
    required: [true, 'You must agree to terms and conditions']
  },
  termsAcceptedAt: {
    type: Date,
    default: Date.now
  },

  // Timestamps
  lastLogin: {
    type: Date
  },
  passwordChangedAt: {
    type: Date
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for user's full profile completion percentage
userSchema.virtual('profileCompletion').get(function() {
  const fields = ['fullName', 'phone', 'country', 'city'];
  const completedFields = fields.filter(field => this[field] && this[field].trim() !== '');
  return Math.round((completedFields.length / fields.length) * 100);
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only run if password is modified
  if (!this.isModified('password')) return next();

  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Pre-save middleware to set passwordChangedAt
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  
  this.passwordChangedAt = Date.now() - 1000; // Subtract 1 second to ensure JWT is created after password change
  next();
});

// Instance method to check password
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Instance method to add item to wishlist
userSchema.methods.addToWishlist = function(item) {
  if (!this.wishlist.includes(item)) {
    this.wishlist.push(item);
  }
  return this.save();
};

// Instance method to remove item from wishlist
userSchema.methods.removeFromWishlist = function(item) {
  this.wishlist = this.wishlist.filter(wishItem => wishItem !== item);
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
