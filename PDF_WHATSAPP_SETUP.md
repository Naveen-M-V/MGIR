# PDF Receipt & WhatsApp Integration Setup

## Overview
This guide explains how to set up PDF receipt generation and WhatsApp message delivery for payment confirmations.

## Features Implemented

### 1. PDF Receipt Generation
- Professional PDF receipts with payment details
- Automatic generation after successful payment
- Stored in `backend/receipts/` directory
- Includes:
  - Receipt number and date/time
  - Customer information
  - Service details and booking information
  - Payment summary and transaction ID

### 2. WhatsApp Integration
- Send payment receipts via WhatsApp
- Uses Twilio WhatsApp API
- Optional: Customer can provide WhatsApp number during booking
- Formatted message with payment details

## Setup Instructions

### Step 1: Install Dependencies

Run in the backend folder:
```bash
npm install
```

This will install:
- `pdfkit` - PDF generation
- `twilio` - WhatsApp messaging

### Step 2: Get Twilio Credentials

1. Go to https://www.twilio.com/
2. Sign up for a free account (or log in)
3. Go to Console Dashboard
4. Find your **Account SID** and **Auth Token**
5. Go to **Messaging** → **Try it Out** → **Send an SMS**
6. Get a Twilio phone number (or use existing one)

### Step 3: Enable WhatsApp on Twilio

1. In Twilio Console, go to **Messaging** → **Try it Out**
2. Click on **WhatsApp**
3. Follow the setup wizard to enable WhatsApp
4. Get your Twilio WhatsApp phone number (format: +1234567890)

### Step 4: Update .env File

Edit `backend/.env` and add:

```
# Twilio Configuration (for WhatsApp)
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

Replace with your actual Twilio credentials.

### Step 5: Test the Integration

1. Restart backend: `npm run dev` (in backend folder)
2. Make a test payment on the beauty service page
3. Fill in the form including WhatsApp number (format: +1234567890)
4. Complete the payment
5. Check your WhatsApp for the receipt message

## How It Works

### Payment Flow with PDF & WhatsApp

1. **User fills booking form** including:
   - Name, email, phone
   - Service date, time, location
   - **WhatsApp number (optional)**

2. **User clicks "Pay with PayPal"**
   - WhatsApp number stored in localStorage
   - Redirected to PayPal

3. **After payment approval**
   - PaymentSuccess page captures the order
   - Retrieves WhatsApp number from localStorage
   - Sends to backend with capture request

4. **Backend processes payment**
   - Captures PayPal order
   - Generates PDF receipt
   - Sends WhatsApp message (if phone provided)
   - Updates payment status to COMPLETED

5. **User receives**
   - Success page confirmation
   - WhatsApp message with receipt details

## File Structure

```
backend/
├── services/
│   ├── pdfService.js          # PDF generation
│   ├── whatsappService.js     # WhatsApp messaging
│   └── paypalService.js       # PayPal integration
├── routes/
│   └── payments.js            # Updated with PDF/WhatsApp
├── receipts/                  # Generated PDF files stored here
└── .env                       # Configuration

src/
├── services/
│   └── paymentService.js      # Updated to send WhatsApp phone
├── pages/
│   ├── PaymentSuccess.jsx     # Updated to retrieve WhatsApp phone
│   └── servicespage/
│       └── Beauty.jsx         # Updated with WhatsApp field
```

## API Endpoints

### POST /api/payments/capture-order
Now accepts optional `whatsappPhone` parameter:

```javascript
{
  "orderId": "PAYPAL_ORDER_ID",
  "whatsappPhone": "+1234567890"  // Optional
}
```

## Environment Variables

```
# Twilio Configuration (for WhatsApp)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

## Troubleshooting

### WhatsApp message not received
1. Check Twilio credentials are correct
2. Verify phone number format: +1234567890
3. Check backend logs for error messages
4. Ensure Twilio account has WhatsApp enabled

### PDF not generating
1. Check `backend/receipts/` directory exists
2. Verify file permissions
3. Check backend logs for errors
4. Ensure pdfkit is installed: `npm list pdfkit`

### Payment succeeds but no receipt
1. WhatsApp is optional - payment still succeeds
2. Check backend console for PDF/WhatsApp errors
3. Errors don't fail the payment (graceful degradation)

## Production Deployment

### Before deploying:
1. Update Twilio credentials with production values
2. Ensure FRONTEND_URL is set to production domain
3. Test with real WhatsApp numbers
4. Set up file storage for receipts (cloud storage recommended)

### Recommended for production:
- Store PDFs in cloud storage (AWS S3, Google Cloud Storage)
- Use environment-specific Twilio numbers
- Add receipt email as backup delivery method
- Implement receipt download from user dashboard

## Optional Enhancements

### 1. Email Receipts
Add email delivery alongside WhatsApp:
```javascript
// In whatsappService.js
const sendEmailReceipt = async (email, paymentData, pdfPath) => {
  // Implementation using nodemailer
};
```

### 2. Receipt Download
Add endpoint to download receipts:
```javascript
router.get('/receipt/:orderId', async (req, res) => {
  // Stream PDF file to user
});
```

### 3. Receipt History
Show all receipts in user dashboard:
```javascript
router.get('/receipts', protect, async (req, res) => {
  // Get all receipts for user
});
```

## Support

For issues:
- Check Twilio documentation: https://www.twilio.com/docs/whatsapp
- Check PDFKit documentation: http://pdfkit.org/
- Review backend logs: `npm run dev`
