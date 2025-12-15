# Email OTP Verification System - Setup Guide

## Overview
This guide explains the new email-based OTP (One-Time Password) verification system implemented for user signup. Users must verify their email with a 4-digit OTP before their account is created.

## Features Implemented

### 1. **OTP Generation & Sending**
- Generates a random 4-digit OTP (1000-9999)
- Sends OTP to user's email via Gmail SMTP
- OTP expires after 15 minutes
- Beautiful HTML email template with branding

### 2. **Signup Flow (2-Step Process)**
**Step 1: Request OTP**
- User submits signup form with email
- System checks if email/username already exists
- Generates 4-digit OTP and sends to email
- Returns verification ID to frontend

**Step 2: Verify OTP & Create Account**
- User enters OTP received in email
- System validates OTP (not expired, correct code)
- Tracks failed attempts (max 5 attempts)
- Creates account only after successful verification
- Sends welcome email to confirmed email address

### 3. **Security Features**
- Rate limiting: 5 requests per 15 minutes per IP
- OTP expiration: 15 minutes
- Failed attempt tracking: Max 5 attempts
- Auto-delete expired OTP records
- Email verification flag on user account

## Files Created

### Backend Models
- **`backend/models/EmailVerification.js`** - Stores OTP and verification status
  - Fields: email, otp, isVerified, attempts, maxAttempts, expiresAt

### Backend Services
- **`backend/services/emailService.js`** - Email operations
  - `generateOTP()` - Creates 4-digit OTP
  - `sendOTPEmail(email, otp)` - Sends OTP email
  - `sendWelcomeEmail(email, fullName)` - Sends welcome email after verification

### Backend Routes
- **`backend/routes/auth.js`** - Updated with new endpoints:
  - `POST /api/auth/signup` - Request OTP
  - `POST /api/auth/verify-otp` - Verify OTP and create account
  - `POST /api/auth/resend-otp` - Resend OTP if expired

### Backend Models Updated
- **`backend/models/User.js`** - Added fields:
  - `isEmailVerified` - Boolean flag
  - `emailVerifiedAt` - Timestamp of verification

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

This installs `nodemailer` for email sending.

### 2. Configure Gmail SMTP

#### Option A: Using Gmail App Password (Recommended)
1. Go to https://myaccount.google.com/
2. Click "Security" in left sidebar
3. Enable "2-Step Verification" if not already enabled
4. Go back to Security and find "App passwords"
5. Select "Mail" and "Windows Computer"
6. Copy the generated 16-character password
7. Update `.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-char-app-password
   ```

#### Option B: Using Gmail Account Password
1. Enable "Less secure app access" at https://myaccount.google.com/lesssecureapps
2. Update `.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-password
   ```

### 3. Update Environment Variables
Edit `backend/.env`:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 4. Start Backend Server
```bash
npm start
# or for development with auto-reload
npm run dev
```

## API Endpoints

### 1. Request OTP (Step 1)
**POST** `/api/auth/signup`

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "fullName": "John Doe",
  "phone": "+1234567890",
  "country": "USA",
  "province": "California",
  "address": "123 Main St",
  "zip": "90210",
  "city": "Los Angeles",
  "agreeTerms": true
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "OTP sent to your email. Please verify to complete signup.",
  "data": {
    "email": "john@example.com",
    "verificationId": "507f1f77bcf86cd799439011"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### 2. Verify OTP & Create Account (Step 2)
**POST** `/api/auth/verify-otp`

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "1234",
  "username": "john_doe",
  "password": "SecurePass123",
  "fullName": "John Doe",
  "phone": "+1234567890",
  "country": "USA",
  "province": "California",
  "address": "123 Main St",
  "zip": "90210",
  "city": "Los Angeles",
  "agreeTerms": true
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Account created successfully! Welcome to My Guide In Rome.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "role": "user",
      "profileCompletion": 75,
      "isEmailVerified": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

**Response (Invalid OTP):**
```json
{
  "success": false,
  "message": "Invalid OTP. 4 attempts remaining."
}
```

**Response (Expired OTP):**
```json
{
  "success": false,
  "message": "OTP has expired. Please signup again to get a new code."
}
```

### 3. Resend OTP
**POST** `/api/auth/resend-otp`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "OTP resent to your email."
}
```

## Frontend Integration

### Step 1: Update AuthModal Component
The signup form should now be a 2-step process:

**Step 1: Request OTP**
```javascript
const handleSignupSubmit = async (formData) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      phone: formData.phone,
      country: formData.country,
      province: formData.province,
      address: formData.address,
      zip: formData.zip,
      city: formData.city,
      agreeTerms: formData.agreeTerms
    })
  });
  
  const data = await response.json();
  if (data.success) {
    // Show OTP verification screen
    setShowOTPVerification(true);
    setSignupEmail(data.data.email);
    setSignupFormData(formData); // Store for verification step
  }
};
```

**Step 2: Verify OTP**
```javascript
const handleOTPVerify = async (otp) => {
  const response = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: signupEmail,
      otp: otp,
      ...signupFormData // Include all signup data
    })
  });
  
  const data = await response.json();
  if (data.success) {
    // Login successful, store token
    localStorage.setItem('token', data.token);
    // Close modal and redirect
  }
};
```

## Email Templates

### OTP Email
- **Subject:** Email Verification - My Guide In Rome
- **Content:**
  - Welcome message
  - 4-digit OTP in large, easy-to-read format
  - 15-minute expiration notice
  - Security reminder

### Welcome Email
- **Subject:** Welcome to My Guide In Rome!
- **Content:**
  - Personalized greeting with user's name
  - Confirmation of email verification
  - List of available features
  - Support contact information

## Testing

### Test Case 1: Successful Signup
1. Submit signup form with valid data
2. Check email for OTP
3. Enter OTP in verification screen
4. Account should be created and user logged in

### Test Case 2: Invalid OTP
1. Submit signup form
2. Enter wrong OTP
3. Should show error with remaining attempts
4. After 5 failed attempts, verification record deleted

### Test Case 3: Expired OTP
1. Submit signup form
2. Wait 15 minutes
3. Enter OTP
4. Should show expiration error

### Test Case 4: Resend OTP
1. Submit signup form
2. Click "Resend OTP"
3. Should receive new OTP in email
4. Old OTP should be invalid

## Troubleshooting

### Issue: "Failed to send verification email"
**Solution:**
- Check Gmail credentials in `.env`
- Verify "Less secure app access" is enabled or use App Password
- Check internet connection
- Verify SMTP settings: smtp.gmail.com:587

### Issue: OTP not received
**Solution:**
- Check spam/junk folder
- Verify email address is correct
- Check Gmail SMTP credentials
- Check backend logs for errors

### Issue: "Too many authentication attempts"
**Solution:**
- Rate limiting is active (5 requests per 15 minutes)
- Wait 15 minutes before trying again
- Or use different IP address

### Issue: OTP expired before user could enter it
**Solution:**
- OTP is valid for 15 minutes
- User can click "Resend OTP" to get a new code
- Consider increasing expiration time in code if needed

## Security Considerations

1. **OTP Length:** 4 digits (1000-9999) = 9000 possible combinations
   - For production with high security needs, consider 6 digits
   - Modify `generateOTP()` in emailService.js

2. **Rate Limiting:** 5 requests per 15 minutes per IP
   - Prevents brute force attacks
   - Adjust in auth.js if needed

3. **Failed Attempts:** Max 5 attempts per OTP
   - After 5 failures, user must request new OTP
   - Prevents brute force on single OTP

4. **OTP Expiration:** 15 minutes
   - Balances security with user experience
   - Modify expiresAt calculation if needed

5. **Email Verification:** Required for account creation
   - Ensures valid email addresses
   - Prevents spam registrations

## Future Enhancements

1. **SMS OTP:** Add SMS verification option
2. **Two-Factor Authentication:** Require OTP on login
3. **Email Change Verification:** Verify email when user changes it
4. **Password Reset:** Use OTP for password reset flow
5. **Biometric Verification:** Add fingerprint/face recognition
6. **Magic Links:** Send login link instead of OTP

## Support

For issues or questions:
1. Check backend logs: `npm run dev`
2. Verify `.env` configuration
3. Check MongoDB connection
4. Verify Gmail SMTP credentials
5. Check email spam folder
