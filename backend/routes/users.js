const express = require('express');
const User = require('../models/User');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// All routes after this middleware are protected
router.use(protect);

// @route   GET /api/users/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/wishlist', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('wishlist');
    
    res.status(200).json({
      success: true,
      data: {
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching wishlist'
    });
  }
});

// @route   POST /api/users/wishlist
// @desc    Add item to wishlist
// @access  Private
router.post('/wishlist', async (req, res) => {
  try {
    const { item } = req.body;

    if (!item) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an item to add to wishlist'
      });
    }

    const user = await User.findById(req.user.id);
    await user.addToWishlist(item);

    res.status(200).json({
      success: true,
      message: 'Item added to wishlist',
      data: {
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding item to wishlist'
    });
  }
});

// @route   DELETE /api/users/wishlist/:item
// @desc    Remove item from wishlist
// @access  Private
router.delete('/wishlist/:item', async (req, res) => {
  try {
    const { item } = req.params;

    const user = await User.findById(req.user.id);
    await user.removeFromWishlist(decodeURIComponent(item));

    res.status(200).json({
      success: true,
      message: 'Item removed from wishlist',
      data: {
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing item from wishlist'
    });
  }
});

// @route   GET /api/users/bookings
// @desc    Get user's booking history
// @access  Private
router.get('/bookings', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('bookings');
    
    res.status(200).json({
      success: true,
      data: {
        bookings: user.bookings
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings'
    });
  }
});

// @route   POST /api/users/bookings
// @desc    Create a new booking
// @access  Private
router.post('/bookings', async (req, res) => {
  try {
    const { serviceType, serviceName } = req.body;

    if (!serviceType || !serviceName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide service type and name'
      });
    }

    const user = await User.findById(req.user.id);
    
    const newBooking = {
      serviceType,
      serviceName,
      bookingDate: new Date(),
      status: 'pending'
    };

    user.bookings.push(newBooking);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking: newBooking
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking'
    });
  }
});

// Admin only routes
router.use(restrictTo('admin'));

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get single user (Admin only)
// @access  Private/Admin
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user'
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user (Admin only)
// @access  Private/Admin
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user'
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user'
    });
  }
});

module.exports = router;
