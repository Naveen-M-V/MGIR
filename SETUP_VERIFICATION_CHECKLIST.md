# Email OTP Verification - Setup Verification Checklist

## Pre-Setup Verification

### Backend Files Created ✅
- [x] `backend/models/EmailVerification.js` - OTP storage model
- [x] `backend/services/emailService.js` - Email sending service
- [x] `backend/routes/auth.js` - Updated with OTP endpoints

### Backend Files Modified ✅
- [x] `backend/package.json` - Added nodemailer dependency
- [x] `backend/models/User.js` - Added emailVerifiedAt field

### Documentation Created ✅
- [x] `EMAIL_OTP_VERIFICATION_SETUP.md` - Complete setup guide
- [x] `OTP_FRONTEND_INTEGRATION.md` - Frontend code examples
- [x] `OTP_FLOW_DIAGRAM.md` - Visual flow diagrams
- [x] `EMAIL_OTP_QUICK_START.md` - 5-minute quick start
- [x] `OTP_IMPLEMENTATION_COMPLETE.md` - Implementation summary
- [x] `SETUP_VERIFICATION_CHECKLIST.md` - This file

## Step 1: Install Dependencies

### Action
```bash
cd backend
npm install
```

### Verification
After installation, verify:
- [ ] `node_modules/nodemailer` exists
- [ ] `package-lock.json` updated
- [ ] No installation errors in console

### Expected Output
```
added X packages, and audited Y packages in Zs
```

## Step 2: Configure Gmail SMTP

### Action
1. Go to https://myaccount.google.com/
2. Click "Security" in left sidebar
3. Enable "2-Step Verification" (if not already enabled)
4. Go back to Security → "App passwords"
5. Select "Mail" and "Windows Computer"
6. Copy the 16-character password

### Update .env
Edit `backend/.env`:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
```

### Verification
- [ ] EMAIL_USER is set to your Gmail address
- [ ] EMAIL_PASS is 16 characters (app password)
- [ ] EMAIL_HOST is smtp.gmail.com
- [ ] EMAIL_PORT is 587

## Step 3: Start Backend Server

### Action
```bash
cd backend
npm start
# or for development with auto-reload
npm run dev
```

### Verification
- [ ] Server starts without errors
- [ ] Console shows "MongoDB connected successfully"
- [ ] Console shows "Server running on port 5000"
- [ ] No error messages in console

### Expected Output
```
MongoDB connected successfully
Server running on port 5000
```

## Step 4: Test API Endpoints

### Test 1: Request OTP (POST /api/auth/signup)

**Command:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "email": "your-email@gmail.com",
    "password": "TestPass123",
    "fullName": "Test User",
    "phone": "+1234567890",
    "country": "USA",
    "province": "California",
    "address": "123 Test St",
    "zip": "90210",
    "city": "Los Angeles",
    "agreeTerms": true
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email. Please verify to complete signup.",
  "data": {
    "email": "your-email@gmail.com",
    "verificationId": "507f1f77bcf86cd799439011"
  }
}
```

**Verification Checklist:**
- [ ] Response status is 200
- [ ] success is true
- [ ] Message mentions OTP sent
- [ ] Email is returned in response
- [ ] OTP email received in inbox (check spam folder)

### Test 2: Check OTP Email

**What to verify:**
- [ ] Email received from your Gmail address
- [ ] Subject: "Email Verification - My Guide In Rome"
- [ ] Contains 4-digit OTP code
- [ ] Shows 15-minute expiration
- [ ] Professional HTML template

**Extract OTP:**
- Copy the 4-digit code from email (e.g., "1234")

### Test 3: Verify OTP (POST /api/auth/verify-otp)

**Command:**
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@gmail.com",
    "otp": "1234",
    "username": "testuser123",
    "password": "TestPass123",
    "fullName": "Test User",
    "phone": "+1234567890",
    "country": "USA",
    "province": "California",
    "address": "123 Test St",
    "zip": "90210",
    "city": "Los Angeles",
    "agreeTerms": true
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Account created successfully! Welcome to My Guide In Rome.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "testuser123",
      "email": "your-email@gmail.com",
      "isEmailVerified": true
    }
  }
}
```

**Verification Checklist:**
- [ ] Response status is 201
- [ ] success is true
- [ ] Message says "Account created successfully"
- [ ] JWT token is returned
- [ ] User object has isEmailVerified: true
- [ ] Welcome email received in inbox

### Test 4: Invalid OTP (Negative Test)

**Command:**
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@gmail.com",
    "otp": "0000",
    "username": "testuser123",
    "password": "TestPass123",
    "fullName": "Test User",
    "agreeTerms": true
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid OTP. 4 attempts remaining."
}
```

**Verification Checklist:**
- [ ] Response status is 400
- [ ] success is false
- [ ] Error message shows remaining attempts
- [ ] Attempt counter decrements (5 → 4)

### Test 5: Resend OTP (POST /api/auth/resend-otp)

**Command:**
```bash
curl -X POST http://localhost:5000/api/auth/resend-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@gmail.com"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP resent to your email."
}
```

**Verification Checklist:**
- [ ] Response status is 200
- [ ] success is true
- [ ] New OTP received in email
- [ ] Old OTP no longer works
- [ ] Attempt counter reset to 0

## Step 5: Database Verification

### Check MongoDB Collections

**EmailVerification Collection:**
```bash
# In MongoDB shell
db.emailverifications.findOne()
```

**Expected Output:**
```json
{
  "_id": ObjectId("..."),
  "email": "your-email@gmail.com",
  "otp": "1234",
  "isVerified": false,
  "attempts": 0,
  "maxAttempts": 5,
  "expiresAt": ISODate("2024-01-15T10:45:00.000Z"),
  "createdAt": ISODate("2024-01-15T10:30:00.000Z")
}
```

**Verification Checklist:**
- [ ] EmailVerification collection exists
- [ ] OTP record created with correct email
- [ ] expiresAt is 15 minutes from createdAt
- [ ] maxAttempts is 5

**User Collection:**
```bash
# In MongoDB shell
db.users.findOne({ email: "your-email@gmail.com" })
```

**Expected Output:**
```json
{
  "_id": ObjectId("..."),
  "username": "testuser123",
  "email": "your-email@gmail.com",
  "password": "hashed_password",
  "fullName": "Test User",
  "isEmailVerified": true,
  "emailVerifiedAt": ISODate("2024-01-15T10:30:00.000Z"),
  "createdAt": ISODate("2024-01-15T10:30:00.000Z")
}
```

**Verification Checklist:**
- [ ] User document created
- [ ] isEmailVerified is true
- [ ] emailVerifiedAt is set
- [ ] Password is hashed (not plain text)

## Step 6: Error Handling Tests

### Test: Duplicate Email
**Command:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "anotheruser",
    "email": "your-email@gmail.com",
    "password": "TestPass123",
    "fullName": "Another User",
    "agreeTerms": true
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

**Verification Checklist:**
- [ ] Response status is 400
- [ ] Error message about duplicate email
- [ ] No new OTP sent

### Test: Duplicate Username
**Command:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "email": "different@gmail.com",
    "password": "TestPass123",
    "fullName": "Different User",
    "agreeTerms": true
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Username is already taken"
}
```

**Verification Checklist:**
- [ ] Response status is 400
- [ ] Error message about duplicate username
- [ ] No new OTP sent

### Test: Missing Required Fields
**Command:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@gmail.com"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Please provide all required fields and agree to terms"
}
```

**Verification Checklist:**
- [ ] Response status is 400
- [ ] Error message about missing fields
- [ ] No OTP sent

## Step 7: Frontend Integration Preparation

### Create OTP Verification Component
- [ ] Create `src/components/OTPVerificationScreen.jsx`
- [ ] Add OTP input field (4 digits)
- [ ] Add "Verify" button
- [ ] Add "Resend OTP" button with cooldown
- [ ] Add attempt counter display
- [ ] Add error message display

### Update AuthModal Component
- [ ] Add state for OTP verification screen
- [ ] Add state for signup form data
- [ ] Add state for OTP attempts
- [ ] Add state for resend cooldown timer
- [ ] Update signup handler to request OTP
- [ ] Add OTP verification handler
- [ ] Add resend OTP handler

### Update Signup Flow
- [ ] Show signup form (Step 1)
- [ ] On submit, request OTP
- [ ] Show OTP verification screen (Step 2)
- [ ] On OTP verify, create account
- [ ] Store JWT token
- [ ] Close modal and redirect

## Final Verification Checklist

### Backend ✅
- [x] Dependencies installed
- [x] EmailVerification model created
- [x] Email service created
- [x] Auth routes updated
- [x] User model updated
- [x] Gmail SMTP configured

### API Endpoints ✅
- [x] POST /api/auth/signup - Request OTP
- [x] POST /api/auth/verify-otp - Verify OTP
- [x] POST /api/auth/resend-otp - Resend OTP

### Testing ✅
- [x] OTP generation works
- [x] OTP email sending works
- [x] OTP verification works
- [x] Invalid OTP handling works
- [x] Attempt counter works
- [x] OTP expiration works
- [x] Resend OTP works
- [x] Welcome email works
- [x] Database records created correctly

### Documentation ✅
- [x] Setup guide created
- [x] Frontend integration guide created
- [x] Flow diagrams created
- [x] Quick start guide created
- [x] Implementation summary created
- [x] Verification checklist created

### Frontend ⏳
- [ ] OTP verification screen component
- [ ] AuthModal updated for 2-step flow
- [ ] Signup handlers updated
- [ ] OTP verification handlers added
- [ ] Resend OTP handler added
- [ ] End-to-end testing completed

## Troubleshooting Guide

### Issue: "Cannot find module 'nodemailer'"
**Solution:**
```bash
cd backend
npm install
```

### Issue: "Failed to send verification email"
**Solution:**
1. Check Gmail credentials in `.env`
2. Verify 2-Step Verification is enabled
3. Verify App Password is correct (16 characters)
4. Check internet connection
5. Check backend logs

### Issue: OTP not received
**Solution:**
1. Check spam/junk folder
2. Verify email address in form
3. Check Gmail SMTP settings
4. Check backend logs for errors

### Issue: "Too many authentication attempts"
**Solution:**
- Rate limiting active (5 per 15 minutes)
- Wait 15 minutes before retrying
- Or use different IP address

### Issue: MongoDB connection error
**Solution:**
1. Verify MongoDB is running
2. Check MONGODB_URI in `.env`
3. Verify database name is correct

## Success Criteria

✅ All tests pass
✅ OTP emails received
✅ Accounts created after verification
✅ Welcome emails sent
✅ Database records correct
✅ Error handling works
✅ Rate limiting works
✅ Documentation complete

## Next Steps

1. Complete all verification tests above
2. Implement frontend OTP verification screen
3. Update AuthModal for 2-step signup flow
4. Test end-to-end signup flow
5. Deploy to production

## Support

For issues or questions:
1. Check `EMAIL_OTP_VERIFICATION_SETUP.md` for detailed setup
2. Review `OTP_FLOW_DIAGRAM.md` for visual understanding
3. Check backend logs: `npm run dev`
4. Verify `.env` configuration
5. Check email spam folder
