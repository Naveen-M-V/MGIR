# PayPal REST API Credentials Setup

## Problem
The payment system was failing because it was using NVP/SOAP credentials with the REST API, which requires OAuth2 Client ID and Client Secret.

## Solution: Get PayPal REST API Credentials

### Step 1: Go to PayPal Developer Dashboard
1. Visit https://developer.paypal.com/
2. Log in with your PayPal account (or create one if you don't have it)

### Step 2: Create an Application
1. Click on **"Apps & Credentials"** in the left menu
2. Make sure you're on the **"Sandbox"** tab (for testing)
3. Click **"Create App"** button
4. Enter an app name (e.g., "MGIR Payment App")
5. Click **"Create App"**

### Step 3: Get Your Credentials
1. After creating the app, you'll see your app listed
2. Click on your app name to view details
3. You'll see:
   - **Client ID** - Copy this
   - **Secret** - Click "Show" and copy this

### Step 4: Update .env File
Open `backend/.env` and replace:
```
PAYPAL_CLIENT_ID=your_client_id_here
PAYPAL_CLIENT_SECRET=your_client_secret_here
```

With your actual credentials from Step 3.

### Step 5: Test Payment
1. Restart the backend server: `npm start` (in backend folder)
2. Try making a payment again
3. Use PayPal sandbox test account to complete the payment

## Sandbox Test Accounts
PayPal provides sandbox test accounts. You can find them in:
1. Developer Dashboard → Accounts
2. Look for accounts with "Sandbox" label
3. Use these to test payments

## Important Notes
- **Never commit credentials to git** - Keep them in `.env` file only
- **Sandbox mode** is for testing - use different credentials for production
- **Client Secret** should be kept private - never share it
- If you accidentally expose credentials, regenerate them in PayPal dashboard

## Troubleshooting
If you still get "Payment failed" error:
1. Check that PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET are correctly set
2. Verify they're for the Sandbox environment
3. Check backend console logs for detailed error messages
4. Ensure FRONTEND_URL is correctly set to http://localhost:5173

## Production Deployment
When deploying to production:
1. Get Live credentials (not Sandbox)
2. Change PAYPAL_MODE to "live"
3. Update PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET with live credentials
4. Update FRONTEND_URL to your production domain
