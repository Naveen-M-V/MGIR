# Quick Start: PDF & WhatsApp Setup

## 5-Minute Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Get Twilio Credentials
1. Sign up at https://www.twilio.com/ (free account)
2. Go to Console Dashboard
3. Copy **Account SID** and **Auth Token**
4. Enable WhatsApp messaging
5. Get your Twilio phone number

### 3. Update .env
Edit `backend/.env`:
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

### 4. Restart Backend
```bash
npm run dev
```

### 5. Test
1. Go to beauty service page
2. Fill form with WhatsApp number (e.g., +919876543210)
3. Complete payment
4. Check WhatsApp for receipt

## What Happens

✅ User fills booking form
✅ Enters WhatsApp number (optional)
✅ Completes PayPal payment
✅ Backend generates PDF receipt
✅ WhatsApp message sent with receipt details
✅ User sees success page

## Files Changed

| File | Change |
|------|--------|
| `backend/package.json` | Added pdfkit, twilio |
| `backend/.env` | Added Twilio credentials |
| `backend/routes/payments.js` | PDF + WhatsApp on capture |
| `src/pages/servicespage/Beauty.jsx` | Added WhatsApp field |
| `src/pages/PaymentSuccess.jsx` | Sends WhatsApp phone to backend |

## New Services

- `backend/services/pdfService.js` - PDF generation
- `backend/services/whatsappService.js` - WhatsApp messaging

## Receipts Location

Generated PDFs stored in: `backend/receipts/`

Format: `receipt_{orderId}_{timestamp}.pdf`

## Troubleshooting

**WhatsApp not working?**
- Check Twilio credentials in .env
- Verify phone format: +1234567890
- Check backend console logs

**PDF not generating?**
- Ensure `backend/receipts/` directory exists
- Check file permissions
- Review backend logs

**Payment succeeds but no WhatsApp?**
- WhatsApp is optional - payment still completes
- Check backend logs for errors
- Errors don't block payment (graceful)

## Next Steps

- Test with real payments
- Add email receipts (optional)
- Add receipt download feature
- Deploy to production with live credentials
