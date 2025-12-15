// Test script to verify database operations
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testDatabase() {
  try {
    // Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mgir-app', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');

    // Test 1: Create a test user (Signup simulation)
    console.log('\n📝 Testing user creation (Signup)...');
    
    // First, clean up any existing test user
    await User.deleteOne({ email: 'test@example.com' });
    
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User',
      phone: '+1234567890',
      country: 'Italy',
      city: 'Rome',
      agreeTerms: true
    });

    const savedUser = await testUser.save();
    console.log('✅ User created successfully:', {
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      fullName: savedUser.fullName,
      createdAt: savedUser.createdAt
    });

    // Test 2: Find user by email/username (Login simulation)
    console.log('\n🔍 Testing user login (Find by email)...');
    
    const foundUser = await User.findOne({
      $or: [
        { username: 'testuser' },
        { email: 'test@example.com' }
      ]
    }).select('+password');

    if (foundUser) {
      console.log('✅ User found for login:', {
        id: foundUser._id,
        username: foundUser.username,
        email: foundUser.email,
        hasPassword: !!foundUser.password
      });

      // Test password verification
      const isPasswordCorrect = await foundUser.correctPassword('password123', foundUser.password);
      console.log('✅ Password verification:', isPasswordCorrect ? 'PASSED' : 'FAILED');
    } else {
      console.log('❌ User not found');
    }

    // Test 3: List all users
    console.log('\n📋 All users in database:');
    const allUsers = await User.find().select('-password');
    console.log(`Found ${allUsers.length} users:`);
    allUsers.forEach(user => {
      console.log(`- ${user.username} (${user.email}) - Created: ${user.createdAt}`);
    });

    // Test 4: Update user profile
    console.log('\n✏️ Testing profile update...');
    const updatedUser = await User.findByIdAndUpdate(
      savedUser._id,
      { city: 'Milan', phone: '+9876543210' },
      { new: true }
    );
    console.log('✅ Profile updated:', {
      city: updatedUser.city,
      phone: updatedUser.phone
    });

    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await User.deleteOne({ email: 'test@example.com' });
    console.log('✅ Test user deleted');

    console.log('\n🎉 All database tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the test
testDatabase();
