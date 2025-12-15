# OTP Verification - Frontend Integration Guide

## Overview
This guide shows how to integrate the 2-step OTP verification into your AuthModal component.

## Current Signup Flow (Before)
```
User fills form → Click "Create Account" → Account created immediately
```

## New Signup Flow (After)
```
User fills form → Click "Create Account" 
  ↓
OTP sent to email
  ↓
User enters OTP
  ↓
Account created & User logged in
```

## Implementation Steps

### Step 1: Update AuthModal State
Add state for OTP verification:

```javascript
const [showOTPVerification, setShowOTPVerification] = useState(false);
const [signupEmail, setSignupEmail] = useState('');
const [signupFormData, setSignupFormData] = useState(null);
const [otpLoading, setOtpLoading] = useState(false);
const [otpError, setOtpError] = useState('');
const [otpAttempts, setOtpAttempts] = useState(5);
const [resendTimer, setResendTimer] = useState(0);
```

### Step 2: Update Signup Handler
Modify the signup submission to request OTP first:

```javascript
const handleSignupSubmit = async (e) => {
  e.preventDefault();
  setOtpLoading(true);
  setOtpError('');

  try {
    // Step 1: Request OTP
    const response = await fetch('http://localhost:5000/api/auth/signup', {
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
      // OTP sent successfully
      setSignupEmail(data.data.email);
      setSignupFormData(formData);
      setShowOTPVerification(true);
      setOtpAttempts(5);
      setOtpError('');
      
      // Optional: Show toast notification
      console.log('OTP sent to ' + data.data.email);
    } else {
      setOtpError(data.message || 'Error sending OTP');
    }
  } catch (error) {
    setOtpError('Error sending OTP. Please try again.');
    console.error('Signup error:', error);
  } finally {
    setOtpLoading(false);
  }
};
```

### Step 3: Add OTP Verification Handler
Create a new handler for OTP verification:

```javascript
const handleOTPVerify = async (otp) => {
  setOtpLoading(true);
  setOtpError('');

  try {
    // Step 2: Verify OTP and create account
    const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: signupEmail,
        otp: otp,
        username: signupFormData.username,
        password: signupFormData.password,
        fullName: signupFormData.fullName,
        phone: signupFormData.phone,
        country: signupFormData.country,
        province: signupFormData.province,
        address: signupFormData.address,
        zip: signupFormData.zip,
        city: signupFormData.city,
        agreeTerms: signupFormData.agreeTerms
      })
    });

    const data = await response.json();

    if (data.success) {
      // Account created successfully
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      
      // Close modal and redirect
      setShowOTPVerification(false);
      setIsAuthModalOpen(false);
      setIsSignup(false);
      
      // Optional: Redirect to dashboard or home
      window.location.href = '/';
      
    } else {
      // Extract remaining attempts from error message
      const match = data.message.match(/(\d+) attempts remaining/);
      if (match) {
        setOtpAttempts(parseInt(match[1]));
      }
      setOtpError(data.message || 'Invalid OTP');
    }
  } catch (error) {
    setOtpError('Error verifying OTP. Please try again.');
    console.error('OTP verification error:', error);
  } finally {
    setOtpLoading(false);
  }
};
```

### Step 4: Add Resend OTP Handler
Create handler for resending OTP:

```javascript
const handleResendOTP = async () => {
  setOtpLoading(true);
  setOtpError('');

  try {
    const response = await fetch('http://localhost:5000/api/auth/resend-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: signupEmail })
    });

    const data = await response.json();

    if (data.success) {
      setOtpError('');
      setOtpAttempts(5); // Reset attempts
      setResendTimer(60); // 60 second cooldown
      
      // Start countdown timer
      const interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      console.log('OTP resent to ' + signupEmail);
    } else {
      setOtpError(data.message || 'Error resending OTP');
    }
  } catch (error) {
    setOtpError('Error resending OTP. Please try again.');
    console.error('Resend OTP error:', error);
  } finally {
    setOtpLoading(false);
  }
};
```

### Step 5: Create OTP Verification Component
Create a new component for OTP input:

```javascript
const OTPVerificationScreen = ({ 
  email, 
  onVerify, 
  onResend, 
  error, 
  loading, 
  attempts,
  resendTimer 
}) => {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length === 4) {
      onVerify(otp);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
        <p className="text-gray-600">
          We've sent a 4-digit code to<br />
          <span className="font-semibold">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* OTP Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>
          <input
            type="text"
            maxLength="4"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="0000"
            className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            disabled={loading}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Attempts Remaining */}
        {attempts < 5 && (
          <p className="text-sm text-orange-600 text-center">
            {attempts} attempts remaining
          </p>
        )}

        {/* Verify Button */}
        <button
          type="submit"
          disabled={otp.length !== 4 || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          {loading ? 'Verifying...' : 'Verify Code'}
        </button>
      </form>

      {/* Resend OTP */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Didn't receive the code?{' '}
          <button
            type="button"
            onClick={onResend}
            disabled={resendTimer > 0 || loading}
            className="text-blue-600 hover:text-blue-700 font-semibold disabled:text-gray-400"
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
          </button>
        </p>
      </div>

      {/* Back to Signup */}
      <button
        type="button"
        onClick={() => setShowOTPVerification(false)}
        className="w-full text-gray-600 hover:text-gray-900 font-semibold py-2"
      >
        Back to Signup
      </button>
    </div>
  );
};
```

### Step 6: Update AuthModal Render
Modify the signup section to show OTP screen:

```javascript
{isSignup ? (
  <>
    {showOTPVerification ? (
      <OTPVerificationScreen
        email={signupEmail}
        onVerify={handleOTPVerify}
        onResend={handleResendOTP}
        error={otpError}
        loading={otpLoading}
        attempts={otpAttempts}
        resendTimer={resendTimer}
      />
    ) : (
      // Original signup form
      <SignupForm
        formData={formData}
        onChange={handleInputChange}
        onSubmit={handleSignupSubmit}
        loading={otpLoading}
        error={signupError}
      />
    )}
  </>
) : (
  // Login form
  <LoginForm {...props} />
)}
```

## Testing the Integration

### Test Case 1: Successful Signup with OTP
1. Open signup form
2. Fill in all fields
3. Click "Create Account"
4. Should see "OTP sent to your email" message
5. Check email for 4-digit code
6. Enter code in verification screen
7. Account created and logged in

### Test Case 2: Invalid OTP
1. Follow steps 1-5 above
2. Enter wrong code (e.g., 0000)
3. Should show "Invalid OTP. 4 attempts remaining"
4. Try again with correct code

### Test Case 3: Resend OTP
1. Follow steps 1-4 above
2. Click "Resend OTP"
3. Should receive new code in email
4. Old code should be invalid
5. New code should work

### Test Case 4: Expired OTP
1. Request OTP
2. Wait 15 minutes
3. Try to verify
4. Should show "OTP has expired"
5. Click "Back to Signup" and start over

## Email Configuration

Before testing, make sure to configure Gmail SMTP in `backend/.env`:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

See `EMAIL_OTP_VERIFICATION_SETUP.md` for detailed Gmail setup instructions.

## Common Issues

### Issue: OTP not received
- Check spam/junk folder
- Verify email address in signup form
- Check backend logs for errors
- Verify Gmail credentials in `.env`

### Issue: "Too many authentication attempts"
- Rate limiting is active (5 requests per 15 minutes)
- Wait 15 minutes before trying again

### Issue: OTP verification fails
- Make sure OTP is exactly 4 digits
- Check that OTP hasn't expired (15 minutes)
- Verify all signup fields are filled correctly

## Next Steps

1. Install dependencies: `npm install` (in backend folder)
2. Configure Gmail SMTP in `.env`
3. Start backend: `npm start`
4. Implement OTP verification screen in AuthModal
5. Test signup flow end-to-end
6. Deploy to production

## Support

For issues:
1. Check backend logs: `npm run dev`
2. Verify `.env` configuration
3. Check email spam folder
4. Review `EMAIL_OTP_VERIFICATION_SETUP.md` for detailed setup
