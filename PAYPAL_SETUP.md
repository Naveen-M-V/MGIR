# PayPal Integration - Quick Setup

## What Was Added

### Backend Files
1. **`backend/services/paypalService.js`** - PayPal API service
2. **`backend/models/Payment.js`** - Payment database model
3. **`backend/routes/payments.js`** - Payment API endpoints
4. **`backend/.env`** - Updated with PayPal credentials

### Frontend Files
1. **`src/services/paymentService.js`** - Payment API client
2. **`src/components/PayPalPaymentButton.jsx`** - Reusable payment button
3. **`src/pages/PaymentSuccess.jsx`** - Success page after payment
4. **`src/pages/PaymentCancel.jsx`** - Cancel page if user cancels
5. **`src/App.jsx`** - Updated with payment routes

### Documentation
1. **`PAYPAL_INTEGRATION_GUIDE.md`** - Complete integration guide
2. **`PAYPAL_SETUP.md`** - This file

## Installation Steps

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd ..
npm install
```

### Step 3: Start Backend Server
```bash
cd backend
npm start
# or for development
npm run dev
```

The backend will run on `http://localhost:5000`

### Step 4: Start Frontend Server (in a new terminal)
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## PayPal Credentials (Already Configured)

Your PayPal sandbox credentials are already in `backend/.env`:
- **Username**: sb-mlm8n47554310_api1.business.example.com
- **Password**: ME56DRE7H3JP486
- **Signature**: A3pTw6bl6mWGBjibFNMgWPoVeLbMALdC6kAA2i2oZg.Zfpa.ElnWboJe

These are sandbox credentials for testing. For production, you'll need to:
1. Get live credentials from PayPal
2. Update the credentials in `backend/.env`
3. Change `PAYPAL_MODE` from `sandbox` to `live`

## Testing the Integration

### 1. Navigate to a Booking Page
- Go to Beauty Services or any service with booking
- Fill in the booking form
- Click "Pay with PayPal"

### 2. Complete Payment
- You'll be redirected to PayPal sandbox
- Use a test account to complete payment
- You'll be redirected back to success page

### 3. Check Database
- Payment records are stored in MongoDB
- Check `Payment` collection for transaction details

## How It Works

### Payment Flow
1. **User Initiates**: Clicks "Pay with PayPal" button
2. **Create Order**: Backend creates PayPal order
3. **Redirect**: User redirected to PayPal
4. **Approve**: User approves payment on PayPal
5. **Capture**: Backend captures the payment
6. **Confirm**: User sees success page

### Data Storage
- All payments stored in MongoDB
- Payment status tracked (CREATED, APPROVED, COMPLETED, FAILED)
- Booking details preserved with payment record

## Integration with Existing Services

The integration is already partially implemented in:
- **Beauty Services** (`src/pages/servicespage/Beauty.jsx`)

To add to other services, update their payment buttons:

```jsx
// Import the service
import paymentService from '../../services/paymentService';

// In your payment button onClick:
const handlePayment = async () => {
  try {
    const orderResponse = await paymentService.createOrder({
      amount: 150,
      currency: 'EUR',
      description: 'Your Service Description',
      serviceType: 'your_service_type',
      customerName: customerName,
      bookingDetails: { /* booking info */ }
    });

    if (orderResponse.success) {
      const approvalUrl = orderResponse.links?.find(link => link.rel === 'approve')?.href;
      if (approvalUrl) {
        window.location.href = approvalUrl;
      }
    }
  } catch (error) {
    console.error('Payment error:', error);
    alert('Payment failed. Please try again.');
  }
};
```

## Environment Variables

### Backend (.env)
```env
# PayPal
PAYPAL_MODE=sandbox
PAYPAL_USERNAME=sb-mlm8n47554310_api1.business.example.com
PAYPAL_PASSWORD=ME56DRE7H3JP486
PAYPAL_SIGNATURE=A3pTw6bl6mWGBjibFNMgWPoVeLbMALdC6kAA2i2oZg.Zfpa.ElnWboJe

# Frontend
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env.local - optional)
```env
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

All payment endpoints are available at:
- `POST /api/payments/create-order` - Create payment
- `POST /api/payments/capture-order` - Complete payment
- `GET /api/payments/order/:orderId` - Get order details
- `GET /api/payments/history` - Get user's payments (requires auth)
- `GET /api/payments/stats` - Get statistics (admin)
- `POST /api/payments/webhook` - PayPal webhooks

## Troubleshooting

### Backend not connecting to PayPal
- Check internet connection
- Verify credentials in `.env`
- Check MongoDB is running
- Review backend console for errors

### Frontend not redirecting to PayPal
- Check browser console for errors
- Verify `FRONTEND_URL` in backend `.env`
- Check payment service is imported correctly

### Payment not saving to database
- Verify MongoDB is running
- Check database connection string
- Review backend logs for errors

## Next Steps

1. **Test the integration** with sandbox credentials
2. **Integrate with other services** (Tour, Car Rental, etc.)
3. **Set up webhooks** for production
4. **Get live credentials** from PayPal
5. **Deploy to production** with live credentials

## Support Resources

- **PayPal Developer**: https://developer.paypal.com/
- **Integration Guide**: See `PAYPAL_INTEGRATION_GUIDE.md`
- **Backend Logs**: Check terminal running backend server
- **Frontend Logs**: Check browser console (F12)

## Security Notes

⚠️ **Important**: 
- Never commit `.env` files with real credentials
- Always use HTTPS in production
- Validate payment amounts on backend
- Keep PayPal credentials secure
- Use environment variables for sensitive data

---

**Status**: ✅ PayPal integration is ready to use!

Start both servers and test the payment flow.
