# Email OTP Verification - Complete Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                            │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    AuthModal Component                       │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │  Signup Form (Step 1)                               │   │  │
│  │  │  - Username, Email, Password, Full Name, etc.       │   │  │
│  │  │  - Click "Create Account"                           │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  │                          ↓                                   │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │  OTP Verification Screen (Step 2)                   │   │  │
│  │  │  - Enter 4-digit OTP from email                     │   │  │
│  │  │  - "Resend OTP" button (60s cooldown)              │   │  │
│  │  │  - Attempt counter (5 max)                          │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  │                          ↓                                   │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │  Success - User Logged In                           │   │  │
│  │  │  - Token stored in localStorage                     │   │  │
│  │  │  - Redirect to home page                            │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  ↕
                        HTTP REST API Calls
                                  ↕
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                        │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                  Auth Routes (auth.js)                       │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │  POST /api/auth/signup (Step 1)                     │   │  │
│  │  │  - Validate email/username not taken                │   │  │
│  │  │  - Generate 4-digit OTP                             │   │  │
│  │  │  - Save to EmailVerification collection             │   │  │
│  │  │  - Send OTP email via Gmail SMTP                    │   │  │
│  │  │  - Return verification ID                           │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  │                          ↓                                   │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │  POST /api/auth/verify-otp (Step 2)                │   │  │
│  │  │  - Find EmailVerification record                    │   │  │
│  │  │  - Check OTP not expired (15 min)                   │   │  │
│  │  │  - Check attempts not exceeded (5 max)              │   │  │
│  │  │  - Verify OTP matches                               │   │  │
│  │  │  - Create User account                              │   │  │
│  │  │  - Set isEmailVerified = true                       │   │  │
│  │  │  - Delete EmailVerification record                  │   │  │
│  │  │  - Send welcome email                               │   │  │
│  │  │  - Generate JWT token                               │   │  │
│  │  │  - Return token to frontend                         │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  │                          ↓                                   │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │  POST /api/auth/resend-otp                          │   │  │
│  │  │  - Find EmailVerification record                    │   │  │
│  │  │  - Generate new OTP                                 │   │  │
│  │  │  - Reset attempt counter                            │   │  │
│  │  │  - Send new OTP email                               │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Email Service (emailService.js)                 │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │  generateOTP() → "1234"                             │   │  │
│  │  │  sendOTPEmail(email, otp) → Gmail SMTP              │   │  │
│  │  │  sendWelcomeEmail(email, name) → Gmail SMTP         │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                   MongoDB Database                           │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │  EmailVerification Collection                        │   │  │
│  │  │  {                                                   │   │  │
│  │  │    email: "john@example.com",                        │   │  │
│  │  │    otp: "1234",                                      │   │  │
│  │  │    isVerified: false,                                │   │  │
│  │  │    attempts: 0,                                      │   │  │
│  │  │    maxAttempts: 5,                                   │   │  │
│  │  │    expiresAt: 2024-01-15T10:45:00Z                  │   │  │
│  │  │  }                                                   │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │  User Collection                                     │   │  │
│  │  │  {                                                   │   │  │
│  │  │    username: "john_doe",                             │   │  │
│  │  │    email: "john@example.com",                        │   │  │
│  │  │    password: "hashed_password",                      │   │  │
│  │  │    fullName: "John Doe",                             │   │  │
│  │  │    isEmailVerified: true,                            │   │  │
│  │  │    emailVerifiedAt: 2024-01-15T10:30:00Z            │   │  │
│  │  │  }                                                   │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Gmail SMTP Server                               │  │
│  │  (smtp.gmail.com:587)                                        │  │
│  │  - Sends OTP email with HTML template                        │  │
│  │  - Sends welcome email after verification                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  ↕
                            User's Email
```

## Detailed Signup Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SIGNUP FLOW TIMELINE                         │
└─────────────────────────────────────────────────────────────────────┘

TIME 0:00
┌─────────────────────────────────────────────────────────────────────┐
│ User fills signup form and clicks "Create Account"                  │
│ Frontend sends: POST /api/auth/signup                               │
│ Body: {username, email, password, fullName, agreeTerms, ...}       │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
TIME 0:05
┌─────────────────────────────────────────────────────────────────────┐
│ Backend validates:                                                   │
│ ✓ All required fields present                                       │
│ ✓ Email not already registered                                      │
│ ✓ Username not already taken                                        │
│ ✓ Rate limit not exceeded                                           │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
TIME 0:10
┌─────────────────────────────────────────────────────────────────────┐
│ Backend generates OTP:                                               │
│ ✓ Generate random 4-digit OTP (1000-9999)                           │
│ ✓ Set expiration to 15 minutes from now                             │
│ ✓ Save to EmailVerification collection                              │
│ ✓ Send OTP email via Gmail SMTP                                     │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
TIME 0:15
┌─────────────────────────────────────────────────────────────────────┐
│ Frontend receives response:                                          │
│ {                                                                    │
│   success: true,                                                     │
│   message: "OTP sent to your email",                                │
│   data: { email: "john@example.com", verificationId: "..." }       │
│ }                                                                    │
│                                                                      │
│ Frontend shows OTP verification screen                              │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
TIME 0:20
┌─────────────────────────────────────────────────────────────────────┐
│ User receives email with 4-digit OTP                                │
│ Email template shows:                                               │
│ ┌─────────────────────────────────────────────────────────────┐   │
│ │ My Guide In Rome                                            │   │
│ │                                                             │   │
│ │ Email Verification                                          │   │
│ │                                                             │   │
│ │ Your Verification Code:                                     │   │
│ │ ┌─────────────────────────────────────────────────────┐   │   │
│ │ │              1 2 3 4                                │   │   │
│ │ └─────────────────────────────────────────────────────┘   │   │
│ │                                                             │   │
│ │ This code expires in 15 minutes                             │   │
│ └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
TIME 1:00
┌─────────────────────────────────────────────────────────────────────┐
│ User enters OTP in verification screen                              │
│ Frontend sends: POST /api/auth/verify-otp                           │
│ Body: {                                                              │
│   email: "john@example.com",                                        │
│   otp: "1234",                                                      │
│   username: "john_doe",                                             │
│   password: "SecurePass123",                                        │
│   fullName: "John Doe",                                             │
│   agreeTerms: true,                                                 │
│   ...                                                               │
│ }                                                                    │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
TIME 1:05
┌─────────────────────────────────────────────────────────────────────┐
│ Backend validates OTP:                                               │
│ ✓ Find EmailVerification record                                     │
│ ✓ Check OTP not expired (< 15 minutes)                              │
│ ✓ Check attempts not exceeded (< 5)                                 │
│ ✓ Check OTP matches                                                 │
│                                                                      │
│ If OTP invalid:                                                      │
│ ✗ Increment attempts counter                                        │
│ ✗ Return error: "Invalid OTP. 4 attempts remaining"                │
│ ✗ Stop processing                                                   │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
TIME 1:10
┌─────────────────────────────────────────────────────────────────────┐
│ OTP is valid! Create user account:                                  │
│ ✓ Hash password with bcrypt                                         │
│ ✓ Create User document in MongoDB                                   │
│ ✓ Set isEmailVerified = true                                        │
│ ✓ Set emailVerifiedAt = now                                         │
│ ✓ Delete EmailVerification record                                   │
│ ✓ Send welcome email                                                │
│ ✓ Generate JWT token                                                │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
TIME 1:15
┌─────────────────────────────────────────────────────────────────────┐
│ Frontend receives success response:                                  │
│ {                                                                    │
│   success: true,                                                     │
│   message: "Account created successfully!",                         │
│   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",               │
│   data: {                                                            │
│     user: {                                                          │
│       id: "507f1f77bcf86cd799439011",                              │
│       username: "john_doe",                                         │
│       email: "john@example.com",                                    │
│       isEmailVerified: true                                         │
│     }                                                                │
│   }                                                                  │
│ }                                                                    │
│                                                                      │
│ Frontend:                                                            │
│ ✓ Stores token in localStorage                                      │
│ ✓ Closes auth modal                                                 │
│ ✓ Redirects to home page                                            │
│ ✓ User is logged in!                                                │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
TIME 1:20
┌─────────────────────────────────────────────────────────────────────┐
│ User receives welcome email:                                        │
│ ┌─────────────────────────────────────────────────────────────┐   │
│ │ My Guide In Rome                                            │   │
│ │                                                             │   │
│ │ Welcome, John Doe!                                          │   │
│ │                                                             │   │
│ │ Your email has been successfully verified.                 │   │
│ │ Your account is now active and ready to use.               │   │
│ │                                                             │   │
│ │ You can now:                                                │   │
│ │ • Explore our premium services                              │   │
│ │ • Book tours and experiences                                │   │
│ │ • Save your favorite items to wishlist                      │   │
│ │ • Manage your bookings                                      │   │
│ └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ERROR SCENARIOS                                  │
└─────────────────────────────────────────────────────────────────────┘

SCENARIO 1: Email Already Registered
┌─────────────────────────────────────────────────────────────────────┐
│ User submits signup with existing email                             │
│ Backend checks: Email exists in User collection                     │
│ Response: {                                                          │
│   success: false,                                                    │
│   message: "User with this email already exists"                    │
│ }                                                                    │
│ Frontend: Shows error, user can try different email or login        │
└─────────────────────────────────────────────────────────────────────┘

SCENARIO 2: Invalid OTP
┌─────────────────────────────────────────────────────────────────────┐
│ User enters wrong OTP (e.g., "0000" instead of "1234")             │
│ Backend checks: OTP doesn't match                                   │
│ Backend increments attempts counter (1/5)                           │
│ Response: {                                                          │
│   success: false,                                                    │
│   message: "Invalid OTP. 4 attempts remaining."                     │
│ }                                                                    │
│ Frontend: Shows error with remaining attempts                       │
│ User can try again or click "Resend OTP"                            │
└─────────────────────────────────────────────────────────────────────┘

SCENARIO 3: Too Many Failed Attempts
┌─────────────────────────────────────────────────────────────────────┐
│ User fails OTP verification 5 times                                 │
│ Backend checks: attempts >= maxAttempts                             │
│ Backend deletes EmailVerification record                            │
│ Response: {                                                          │
│   success: false,                                                    │
│   message: "Too many failed attempts. Please signup again."         │
│ }                                                                    │
│ Frontend: Shows error, user must start signup over                  │
└─────────────────────────────────────────────────────────────────────┘

SCENARIO 4: OTP Expired
┌─────────────────────────────────────────────────────────────────────┐
│ User waits > 15 minutes before entering OTP                         │
│ Backend checks: current time > expiresAt                            │
│ Backend deletes EmailVerification record                            │
│ Response: {                                                          │
│   success: false,                                                    │
│   message: "OTP has expired. Please signup again to get a new code."│
│ }                                                                    │
│ Frontend: Shows error, user must start signup over                  │
└─────────────────────────────────────────────────────────────────────┘

SCENARIO 5: Rate Limiting
┌─────────────────────────────────────────────────────────────────────┐
│ User makes > 5 requests in 15 minutes                               │
│ Backend rate limiter blocks request                                 │
│ Response: {                                                          │
│   success: false,                                                    │
│   message: "Too many authentication attempts, please try again..."  │
│ }                                                                    │
│ Frontend: Shows error, user must wait 15 minutes                    │
└─────────────────────────────────────────────────────────────────────┘

SCENARIO 6: Email Send Failure
┌─────────────────────────────────────────────────────────────────────┐
│ Gmail SMTP fails to send OTP email                                  │
│ Backend catches error in sendOTPEmail()                             │
│ Response: {                                                          │
│   success: false,                                                    │
│   message: "Error sending verification email. Please try again."    │
│ }                                                                    │
│ Frontend: Shows error, user can retry                               │
│ Check: Gmail credentials in .env, SMTP settings                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Models

### EmailVerification Schema
```javascript
{
  _id: ObjectId,
  email: String,           // "john@example.com"
  otp: String,            // "1234"
  isVerified: Boolean,    // false
  attempts: Number,       // 0-5
  maxAttempts: Number,    // 5
  expiresAt: Date,        // 2024-01-15T10:45:00Z
  createdAt: Date         // 2024-01-15T10:30:00Z
}
```

### User Schema (Updated)
```javascript
{
  _id: ObjectId,
  username: String,           // "john_doe"
  email: String,              // "john@example.com"
  password: String,           // hashed
  fullName: String,           // "John Doe"
  phone: String,              // "+1234567890"
  country: String,            // "USA"
  province: String,           // "California"
  address: String,            // "123 Main St"
  zip: String,                // "90210"
  city: String,               // "Los Angeles"
  isEmailVerified: Boolean,   // true (after OTP verification)
  emailVerifiedAt: Date,      // 2024-01-15T10:30:00Z
  agreeTerms: Boolean,        // true
  createdAt: Date,            // 2024-01-15T10:30:00Z
  updatedAt: Date             // 2024-01-15T10:30:00Z
}
```

## Security Timeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SECURITY TIMELINE                                │
└─────────────────────────────────────────────────────────────────────┘

T+0 min:    OTP generated and sent
T+1 min:    User receives email
T+5 min:    User enters OTP (valid)
T+15 min:   OTP expires (if not used)
T+15 min:   EmailVerification record auto-deleted
T+∞:        User account remains with isEmailVerified=true

Failed Attempts Timeline:
T+0 min:    OTP sent
T+1 min:    User enters wrong OTP (Attempt 1/5)
T+2 min:    User enters wrong OTP (Attempt 2/5)
T+3 min:    User enters wrong OTP (Attempt 3/5)
T+4 min:    User enters wrong OTP (Attempt 4/5)
T+5 min:    User enters wrong OTP (Attempt 5/5)
T+5 min:    EmailVerification record deleted
T+5 min:    User must start signup over
```

## Rate Limiting

```
┌─────────────────────────────────────────────────────────────────────┐
│                    RATE LIMITING (Per IP)                           │
└─────────────────────────────────────────────────────────────────────┘

Window: 15 minutes
Limit: 5 requests per window

Request 1: ✓ Allowed
Request 2: ✓ Allowed
Request 3: ✓ Allowed
Request 4: ✓ Allowed
Request 5: ✓ Allowed
Request 6: ✗ BLOCKED - "Too many authentication attempts"

After 15 minutes:
Request 6: ✓ Allowed (window reset)
```
