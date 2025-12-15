# Testing 3-Step Signup Flow - Quick Guide

## Prerequisites

✅ Backend running on port 5000
✅ Frontend running on port 5173
✅ MongoDB connected
✅ Gmail SMTP configured
✅ Email credentials in `.env`

## Quick Test Steps

### Test 1: Complete Successful Signup

1. **Open Frontend**
   - Go to http://localhost:5173
   - Click "Sign Up" button

2. **Step 1: Email Verification**
   - Username: `testuser123`
   - Email: `sanjaymaheshwaran0124@gmail.com` (your Gmail)
   - Click "Send OTP"
   - ✅ Should see: "OTP sent to your email!"

3. **Check Email**
   - Go to Gmail inbox
   - Look for email from your Gmail address
   - Subject: "Email Verification - My Guide In Rome"
   - Copy the 4-digit OTP code

4. **Step 1.5: OTP Verification**
   - Paste the 4-digit OTP
   - Click "Verify OTP"
   - ✅ Should see: "Email verified! Now complete your profile."

5. **Step 2: Complete Profile**
   - Password: `TestPass123`
   - Confirm Password: `TestPass123`
   - Full Name: `Test User`
   - Phone: `+1234567890`
   - Country: `USA`
   - Province: `California`
   - Address: `123 Test St`
   - Zip: `90210`
   - City: `Los Angeles`
   - ✅ Check "I accept the Terms and Conditions"
   - Click "Create Account"

6. **Verify Success**
   - ✅ Should see: "Account created successfully!"
   - ✅ Modal should close
   - ✅ User should be logged in
   - ✅ Check Gmail for welcome email

---

### Test 2: Invalid OTP

1. Follow Steps 1-3 from Test 1
2. In Step 1.5, enter wrong OTP (e.g., `0000`)
3. Click "Verify OTP"
4. ✅ Should see: "Invalid OTP. 4 attempts remaining."
5. Try again with correct OTP
6. ✅ Should proceed to Step 2

---

### Test 3: Resend OTP

1. Follow Steps 1-2 from Test 1
2. In Step 1.5, click "Resend OTP"
3. ✅ Should see: "New OTP sent to your email!"
4. ✅ Button should show "Resend in 60s"
5. Check Gmail for new OTP
6. Enter new OTP and verify
7. ✅ Should proceed to Step 2

---

### Test 4: Back Navigation

1. Follow Steps 1-2 from Test 1
2. In Step 1.5, click "Back"
3. ✅ Should return to Step 1
4. Click "Send OTP" again
5. ✅ Should proceed to Step 1.5

---

### Test 5: Duplicate Email

1. Open signup modal
2. Enter username: `newuser`
3. Enter email: `sanjaymaheshwaran0124@gmail.com` (already registered)
4. Click "Send OTP"
5. ✅ Should see: "User with this email already exists"

---

### Test 6: Duplicate Username

1. Open signup modal
2. Enter username: `testuser123` (already registered)
3. Enter email: `newemail@gmail.com`
4. Click "Send OTP"
5. ✅ Should see: "Username is already taken"

---

### Test 7: Password Mismatch

1. Follow Steps 1-4 from Test 1
2. In Step 2, enter:
   - Password: `TestPass123`
   - Confirm Password: `DifferentPass123`
3. Click "Create Account"
4. ✅ Should see: "Passwords do not match"

---

### Test 8: Missing Required Fields

1. Follow Steps 1-4 from Test 1
2. In Step 2, leave "Full Name" or "Phone" empty
3. Click "Create Account"
4. ✅ Should see: "Please fill in all required fields"

---

### Test 9: Terms & Conditions Not Accepted

1. Follow Steps 1-4 from Test 1
2. In Step 2, fill all fields but DON'T check Terms & Conditions
3. Click "Create Account"
4. ✅ Should see error or button should be disabled

---

### Test 10: Rate Limiting

1. Open signup modal
2. Click "Send OTP" 5 times quickly (different emails)
3. On 6th attempt:
4. ✅ Should see: "Too many authentication attempts, please try again later."

---

## Expected Behavior

### Step 1: Email Verification
- ✅ Username field accepts alphanumeric characters
- ✅ Email field validates email format
- ✅ "Send OTP" button disabled if fields empty
- ✅ OTP sent to email within 5 seconds
- ✅ Error messages display clearly

### Step 1.5: OTP Verification
- ✅ OTP input accepts only 4 digits
- ✅ Input field shows large, centered text
- ✅ "Verify OTP" button disabled if OTP not 4 digits
- ✅ Attempt counter shows remaining attempts
- ✅ "Resend OTP" button has 60-second cooldown
- ✅ "Back" button returns to Step 1
- ✅ Error messages show attempts remaining

### Step 2: Complete Profile
- ✅ All fields are required (except optional address fields)
- ✅ Password visibility toggle works
- ✅ Form is scrollable on mobile
- ✅ Terms & Conditions checkbox required
- ✅ "Create Account" button disabled until all fields filled
- ✅ "Back" button returns to Step 1.5
- ✅ Success message shows after account creation
- ✅ Welcome email sent to user

---

## Email Verification

### OTP Email Should Contain:
- ✅ Subject: "Email Verification - My Guide In Rome"
- ✅ 4-digit OTP in large format
- ✅ "This code expires in 15 minutes" message
- ✅ Professional HTML design
- ✅ Company branding

### Welcome Email Should Contain:
- ✅ Subject: "Welcome to My Guide In Rome!"
- ✅ Personalized greeting with user's name
- ✅ "Email verified successfully" message
- ✅ List of available features
- ✅ Support contact information

---

## Troubleshooting

### Issue: OTP not received
**Solution:**
1. Check spam/junk folder
2. Verify email address is correct
3. Check Gmail credentials in `.env`
4. Check backend logs: `npm run dev`

### Issue: "Cannot find module" error
**Solution:**
1. Run `npm install` in backend folder
2. Restart backend: `npm start`

### Issue: "Port 5000 already in use"
**Solution:**
1. Kill process: `taskkill /PID <PID> /F`
2. Restart backend: `npm start`

### Issue: MongoDB connection error
**Solution:**
1. Verify MongoDB is running
2. Check MONGODB_URI in `.env`
3. Verify database name is correct

### Issue: "Too many authentication attempts"
**Solution:**
1. Wait 15 minutes before retrying
2. Or use different IP address

---

## Success Criteria

✅ User can signup with email verification
✅ OTP is sent to email
✅ User can verify OTP
✅ User can complete profile
✅ Account is created after verification
✅ Welcome email is sent
✅ User is logged in after signup
✅ All error scenarios handled gracefully
✅ Mobile responsive design works
✅ Back navigation works correctly

---

## Test Accounts

After testing, you'll have these accounts:
- Username: `testuser123`
- Email: `sanjaymaheshwaran0124@gmail.com`
- Password: `TestPass123`

You can use these to test login functionality.

---

## Backend Logs

To see detailed logs, run backend in dev mode:
```bash
cd backend
npm run dev
```

This will show:
- OTP generation
- Email sending
- Database operations
- Error messages
- Request/response details

---

## Next Steps After Testing

1. ✅ Verify all test cases pass
2. ⏳ Test on mobile devices
3. ⏳ Test with different browsers
4. ⏳ Test with different email providers
5. ⏳ Load testing (multiple signups)
6. ⏳ Deploy to production

---

**Happy Testing! 🚀**
