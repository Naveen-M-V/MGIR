# 🧪 MGIR Authentication Testing Guide

This guide will help you verify that signup credentials are saved to the database and login retrieves them correctly.

## 🚀 Quick Start Testing

### Step 1: Start MongoDB
Make sure MongoDB is running on your system:
```bash
# If you have MongoDB installed locally
mongod

# Or use MongoDB Compass/Atlas if you prefer cloud database
```

### Step 2: Start Backend Server
```bash
cd backend
npm install
npm run dev
```

**Expected Output:**
```
🚀 MGIR Backend Server running on port 5000
📍 Health check: http://localhost:5000/api/health
MongoDB connected successfully
```

### Step 3: Test Database Connection
```bash
cd backend
node test-db.js
```

**Expected Output:**
```
✅ MongoDB connected successfully
✅ User created successfully
✅ User found for login
✅ Password verification: PASSED
✅ All database tests completed successfully!
```

### Step 4: Start Frontend
```bash
# In your main project directory
npm run dev
```

### Step 5: Test Authentication Flow

## 🔍 Testing Signup → Database → Login Flow

### Test Case 1: User Signup
1. **Open your app** in browser (http://localhost:5173)
2. **Click "Login / Sign Up"** button
3. **Click "Don't have an account? Sign Up"**
4. **Fill out the signup form:**
   ```
   Username: testuser123
   Email: test@myguide.com
   Password: password123
   Full Name: Test User
   Phone: +39 123 456 7890
   Country: Italy
   City: Rome
   ✅ Check "I agree to terms"
   ```
5. **Click "Create Profile"**

**Expected Results:**
- ✅ Success message: "Account created successfully! Welcome to My Guide In Rome."
- ✅ Console log shows: "User saved to database: {user data}"
- ✅ Modal closes automatically
- ✅ User token stored in localStorage

### Test Case 2: Verify Database Storage
Open MongoDB Compass or use MongoDB shell:
```bash
# Connect to your database
mongo mgir-app

# Check if user was saved
db.users.find({email: "test@myguide.com"}).pretty()
```

**Expected Database Document:**
```json
{
  "_id": "ObjectId(...)",
  "username": "testuser123",
  "email": "test@myguide.com",
  "password": "$2a$12$...", // Hashed password
  "fullName": "Test User",
  "phone": "+39 123 456 7890",
  "country": "Italy",
  "city": "Rome",
  "role": "user",
  "isActive": true,
  "agreeTerms": true,
  "wishlist": [],
  "bookings": [],
  "createdAt": "2025-10-15T...",
  "updatedAt": "2025-10-15T..."
}
```

### Test Case 3: User Login
1. **Refresh the page** (to clear any stored tokens)
2. **Click "Login / Sign Up"** button
3. **Fill login form:**
   ```
   Username: testuser123  (or test@myguide.com)
   Password: password123
   ```
4. **Click "Log In"**

**Expected Results:**
- ✅ Success message: "Welcome back, Test User!"
- ✅ Console shows: "Login successful: {user data}"
- ✅ Modal closes automatically
- ✅ New token stored in localStorage

## 🔧 Debugging Common Issues

### Issue 1: "Network Error" or "Connection Refused"
**Cause:** Backend server not running
**Solution:** 
```bash
cd backend
npm run dev
```

### Issue 2: "MongoDB connection error"
**Cause:** MongoDB not running or wrong connection string
**Solutions:**
- Start MongoDB: `mongod`
- Check `.env` file: `MONGODB_URI=mongodb://localhost:27017/mgir-app`
- Install MongoDB if not installed

### Issue 3: "User already exists"
**Cause:** Trying to signup with same email/username
**Solutions:**
- Use different email/username
- Or delete existing user from database:
```bash
mongo mgir-app
db.users.deleteOne({email: "test@myguide.com"})
```

### Issue 4: "Invalid username or password"
**Cause:** Wrong credentials or user doesn't exist
**Solutions:**
- Check if user exists in database
- Verify password is correct
- Try signup first, then login

## 📊 Verification Checklist

### ✅ Signup Verification
- [ ] User data sent to `/api/auth/signup`
- [ ] Password gets hashed (not stored as plain text)
- [ ] User document created in MongoDB
- [ ] JWT token generated and returned
- [ ] Token stored in localStorage
- [ ] Success message displayed

### ✅ Login Verification  
- [ ] Credentials sent to `/api/auth/login`
- [ ] User found by username OR email
- [ ] Password verified against hashed version
- [ ] JWT token generated and returned
- [ ] User data returned (without password)
- [ ] Token stored in localStorage
- [ ] Welcome message displayed

### ✅ Database Verification
- [ ] MongoDB connection successful
- [ ] User collection created
- [ ] User document has all required fields
- [ ] Password is hashed with bcrypt
- [ ] Timestamps (createdAt, updatedAt) are set
- [ ] User can be found by username or email

## 🎯 Advanced Testing

### Test Password Hashing
```javascript
// In browser console after signup
const user = JSON.parse(localStorage.getItem('user'));
console.log('User ID:', user.id);

// Check in MongoDB that password is hashed
// Should see something like: "$2a$12$xyz..." not "password123"
```

### Test Token Authentication
```javascript
// In browser console after login
const token = localStorage.getItem('token');
console.log('JWT Token:', token);

// Test authenticated request
fetch('http://localhost:5000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => console.log('Profile data:', data));
```

### Test Login with Email vs Username
1. **Login with username:** `testuser123`
2. **Login with email:** `test@myguide.com`
3. **Both should work** and return same user

## 🔍 Monitoring & Logs

### Backend Logs to Watch
```bash
# In backend terminal, you should see:
POST /api/auth/signup 201 - User created
POST /api/auth/login 200 - Login successful
```

### Browser Console Logs
```javascript
// After successful signup:
"Signup successful: {success: true, message: '...', data: {...}}"
"User saved to database: {id: '...', username: '...', ...}"

// After successful login:
"Login successful: {success: true, message: '...', data: {...}}"
```

### Network Tab Verification
1. **Open Developer Tools → Network**
2. **Perform signup/login**
3. **Check requests:**
   - `POST /api/auth/signup` → Status 201
   - `POST /api/auth/login` → Status 200

## ✅ Success Confirmation

**You've successfully verified the authentication flow when:**

1. ✅ **Signup creates user in database** with hashed password
2. ✅ **Login finds user by username OR email**  
3. ✅ **Password verification works** against hashed version
4. ✅ **JWT tokens are generated** and stored
5. ✅ **User data is returned** without password
6. ✅ **All network requests return success** status codes

**Your authentication system is now fully functional!** 🎉
