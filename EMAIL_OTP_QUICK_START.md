# Email OTP Verification - Quick Start Guide (5 Minutes)

## What Was Implemented ✅

A complete 2-step email verification system for user signup:
1. **Step 1:** User submits signup form → 4-digit OTP sent to email
2. **Step 2:** User enters OTP → Account created and user logged in

## Files Created

### Backend
- `backend/models/EmailVerification.js` - Stores OTP records
- `backend/services/emailService.js` - Email sending service
- `EMAIL_OTP_VERIFICATION_SETUP.md` - Complete setup guide
- `OTP_FRONTEND_INTEGRATION.md` - Frontend integration guide

### Modified
- `backend/package.json` - Added nodemailer
- `backend/models/User.js` - Added emailVerifiedAt field
- `backend/routes/auth.js` - New OTP endpoints

## Quick Setup (5 Minutes)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Gmail (2 Minutes)
1. Go to https://myaccount.google.com/
2. Click "Security" → "App passwords"
3. Select "Mail" and "Windows Computer"
4. Copy the 16-character password
5. Update `backend/.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-char-app-password
   ```

### 3. Start Backend
```bash
npm start
# or
npm run dev
```

## API Endpoints

### Request OTP
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "fullName": "John Doe",
  "agreeTerms": true
}
```

**Response:**
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

### Verify OTP & Create Account
```bash
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "1234",
  "username": "john_doe",
  "password": "SecurePass123",
  "fullName": "John Doe",
  "agreeTerms": true
}
```

**Response:**
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
      "isEmailVerified": true
    }
  }
}
```

### Resend OTP
```bash
POST /api/auth/resend-otp
Content-Type: application/json

{
  "email": "john@example.com"
}
```

## Frontend Integration

### Simple Example
```javascript
// Step 1: Request OTP
const response = await fetch('http://localhost:5000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(signupData)
});

const data = await response.json();
if (data.success) {
  // Show OTP verification screen
  setShowOTPScreen(true);
  setEmail(data.data.email);
}

// Step 2: Verify OTP
const verifyResponse = await fetch('http://localhost:5000/api/auth/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: email,
    otp: userEnteredOTP,
    ...signupData
  })
});

const verifyData = await verifyResponse.json();
if (verifyData.success) {
  // Account created, user logged in
  localStorage.setItem('token', verifyData.token);
  // Redirect to home
}
```

## Testing

### Test Case 1: Successful Signup
1. Submit signup form
2. Check email for 4-digit OTP
3. Enter OTP in verification screen
4. Account created ✅

### Test Case 2: Invalid OTP
1. Submit signup form
2. Enter wrong OTP
3. See error: "Invalid OTP. 4 attempts remaining"
4. Try again with correct OTP ✅

### Test Case 3: Resend OTP
1. Submit signup form
2. Click "Resend OTP"
3. Get new OTP in email
4. Old OTP becomes invalid ✅

### Test Case 4: Expired OTP
1. Submit signup form
2. Wait 15 minutes
3. Try to verify
4. See error: "OTP has expired" ✅

## Security Features

✅ 4-digit OTP (1000-9999)
✅ 15-minute expiration
✅ Max 5 failed attempts
✅ Rate limiting (5 requests per 15 minutes)
✅ Auto-delete expired records
✅ Email verification required

## Troubleshooting

### OTP not received
- Check spam/junk folder
- Verify email address
- Check Gmail credentials in `.env`
- Check backend logs

### "Too many authentication attempts"
- Rate limiting active (5 per 15 minutes)
- Wait 15 minutes or use different IP

### Gmail authentication fails
- Use App Password (not regular password)
- Enable 2-Step Verification first
- Check credentials in `.env`

## Next Steps

1. ✅ Backend setup complete
2. ⏳ Update AuthModal component for OTP screen
3. ⏳ Test signup flow end-to-end
4. ⏳ Deploy to production

## Documentation

- **Complete Setup:** `EMAIL_OTP_VERIFICATION_SETUP.md`
- **Frontend Integration:** `OTP_FRONTEND_INTEGRATION.md`
- **API Reference:** See endpoints above

## Support

For detailed setup and troubleshooting, see:
- `EMAIL_OTP_VERIFICATION_SETUP.md` - Complete guide
- `OTP_FRONTEND_INTEGRATION.md` - Frontend code examples
- Backend logs: `npm run dev`
