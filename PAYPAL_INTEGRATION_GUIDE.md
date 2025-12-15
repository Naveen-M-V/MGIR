# PayPal Integration Guide

## Overview
This document explains the PayPal integration implemented in the MGIR (My Guide In Rome) application. The integration uses PayPal's REST API for processing payments.

## Architecture

### Backend Components

#### 1. **PayPal Service** (`backend/services/paypalService.js`)
- Handles all PayPal API communications
- Methods:
  - `getAccessToken()` - Authenticates with PayPal
  - `createOrder()` - Creates a new PayPal order
  - `captureOrder()` - Captures/completes a payment
  - `getOrderDetails()` - Retrieves order information

#### 2. **Payment Model** (`backend/models/Payment.js`)
- MongoDB schema for storing payment records
- Tracks:
  - Order ID and status
  - Amount and currency
  - Service type (tour, beauty, car rental, etc.)
  - Customer information
  - Booking details
  - PayPal response data

#### 3. **Payment Routes** (`backend/routes/payments.js`)
- `POST /api/payments/create-order` - Create PayPal order
- `POST /api/payments/capture-order` - Capture payment
- `GET /api/payments/order/:orderId` - Get order details
- `GET /api/payments/history` - Get user's payment history
- `GET /api/payments/stats` - Get payment statistics (admin)
- `POST /api/payments/webhook` - Handle PayPal webhooks

### Frontend Components

#### 1. **Payment Service** (`src/services/paymentService.js`)
- API client for backend payment endpoints
- Methods:
  - `createOrder()` - Initiates payment
  - `captureOrder()` - Completes payment
  - `getOrderDetails()` - Retrieves order info
  - `getPaymentHistory()` - Gets user's payments
  - `getPaymentStats()` - Gets admin statistics

#### 2. **PayPal Payment Button** (`src/components/PayPalPaymentButton.jsx`)
- Reusable button component for payments
- Handles payment flow and error handling
- Props:
  - `amount` - Payment amount
  - `currency` - Currency code (default: EUR)
  - `description` - Payment description
  - `serviceType` - Type of service
  - `customerName` - Customer name
  - `customerEmail` - Customer email
  - `bookingDetails` - Additional booking info
  - `onSuccess` - Success callback
  - `onError` - Error callback

#### 3. **Payment Success/Cancel Pages**
- `src/pages/PaymentSuccess.jsx` - Handles successful payments
- `src/pages/PaymentCancel.jsx` - Handles cancelled payments

## Setup Instructions

### 1. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Update Environment Variables
Edit `backend/.env`:
```env
# PayPal Configuration (NVP/SOAP Sandbox)
PAYPAL_MODE=sandbox
PAYPAL_USERNAME=sb-mlm8n47554310_api1.business.example.com
PAYPAL_PASSWORD=ME56DRE7H3JP486
PAYPAL_SIGNATURE=A3pTw6bl6mWGBjibFNMgWPoVeLbMALdC6kAA2i2oZg.Zfpa.ElnWboJe

# Frontend URL for redirects
FRONTEND_URL=http://localhost:5173
```

#### Start Backend Server
```bash
npm start
# or for development with auto-reload
npm run dev
```

### 2. Frontend Setup

#### Install Dependencies
```bash
npm install
```

#### Create `.env.local` (if needed)
```env
VITE_API_URL=http://localhost:5000/api
```

#### Start Frontend Server
```bash
npm run dev
```

## Payment Flow

### 1. User Initiates Payment
- User fills booking form and clicks "Pay with PayPal"
- Frontend calls `paymentService.createOrder()`

### 2. Backend Creates Order
- Backend authenticates with PayPal
- Creates order with payment details
- Stores payment record in MongoDB
- Returns order ID and approval URL

### 3. User Redirects to PayPal
- Frontend redirects user to PayPal approval URL
- User logs in and approves payment

### 4. PayPal Redirects Back
- PayPal redirects to `/payment-success` with token
- Frontend captures the order
- Backend completes the payment
- Payment status updated to "COMPLETED"

### 5. Confirmation
- User sees success page with order details
- Payment record stored in database

## Service Types

The following service types are supported:
- `tour` - Tour bookings
- `personal_curator` - Personal curator services
- `personal_companion` - Personal companion services
- `car_rental` - Car rental services
- `private_chauffeur` - Private chauffeur services
- `airport_transfer` - Airport transfer services
- `beauty_service` - Beauty services
- `babysitting` - Babysitting services
- `pet_sitting` - Pet sitting services

## Integration with Booking Modals

### Example: Beauty Service
```jsx
import paymentService from '../../services/paymentService';

// In your booking modal component
const handlePayment = async () => {
  try {
    const orderResponse = await paymentService.createOrder({
      amount: 150, // Price in EUR
      currency: 'EUR',
      description: 'Beauty Service - Hair Styling',
      serviceType: 'beauty_service',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      bookingDetails: {
        service: 'Hair Styling',
        date: '2024-01-15',
        time: '14:00',
        location: 'Hotel Name'
      }
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

## Database Schema

### Payment Document
```javascript
{
  _id: ObjectId,
  orderId: String,           // PayPal Order ID
  userId: ObjectId,          // User reference (optional)
  status: String,            // CREATED, APPROVED, COMPLETED, FAILED, CANCELLED
  amount: Number,            // Payment amount
  currency: String,          // EUR, USD, etc.
  description: String,       // Payment description
  serviceType: String,       // Type of service
  customerInfo: {
    name: String,
    email: String,
    phone: String,
    firstName: String,
    lastName: String
  },
  bookingDetails: Mixed,     // Service-specific details
  paypalResponse: Mixed,     // Full PayPal response
  transactionId: String,     // PayPal transaction ID
  payerEmail: String,        // PayPal payer email
  payerStatus: String,       // Payer verification status
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date
}
```

## API Endpoints

### Create Order
```
POST /api/payments/create-order
Content-Type: application/json

{
  "amount": 150,
  "currency": "EUR",
  "description": "Beauty Service - Hair Styling",
  "serviceType": "beauty_service",
  "customerInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  },
  "bookingDetails": { ... }
}

Response:
{
  "success": true,
  "orderId": "7C3F5D2A1B9E8C",
  "status": "CREATED",
  "links": [
    {
      "rel": "approve",
      "href": "https://www.sandbox.paypal.com/checkoutnow?token=..."
    }
  ]
}
```

### Capture Order
```
POST /api/payments/capture-order
Content-Type: application/json

{
  "orderId": "7C3F5D2A1B9E8C"
}

Response:
{
  "success": true,
  "message": "Payment captured successfully",
  "orderId": "7C3F5D2A1B9E8C",
  "status": "COMPLETED",
  "transactionId": "..."
}
```

### Get Order Details
```
GET /api/payments/order/7C3F5D2A1B9E8C

Response:
{
  "success": true,
  "paypalOrder": { ... },
  "payment": {
    "_id": "...",
    "status": "COMPLETED",
    "amount": 150,
    "currency": "EUR",
    "description": "Beauty Service - Hair Styling",
    "serviceType": "beauty_service",
    "customerInfo": { ... },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

## Testing

### Sandbox Credentials
- **Username**: sb-mlm8n47554310_api1.business.example.com
- **Password**: ME56DRE7H3JP486
- **Signature**: A3pTw6bl6mWGBjibFNMgWPoVeLbMALdC6kAA2i2oZg.Zfpa.ElnWboJe

### Test Payment Flow
1. Start backend and frontend servers
2. Navigate to a booking page (e.g., Beauty services)
3. Fill in the booking form
4. Click "Pay with PayPal"
5. You'll be redirected to PayPal sandbox
6. Use test account to complete payment
7. You'll be redirected back to success page

### Test Accounts
PayPal provides test accounts for sandbox testing. Log in to your PayPal developer account to create test buyer and seller accounts.

## Webhook Handling

PayPal can send webhook events to notify your backend of payment status changes:

```
POST /api/payments/webhook

Supported events:
- CHECKOUT.ORDER.COMPLETED
- PAYMENT.CAPTURE.COMPLETED
- PAYMENT.CAPTURE.DENIED
- CHECKOUT.ORDER.APPROVED
```

To set up webhooks:
1. Go to PayPal Developer Dashboard
2. Navigate to Webhooks
3. Add endpoint: `https://yourdomain.com/api/payments/webhook`
4. Subscribe to relevant events

## Production Deployment

### 1. Update Environment Variables
```env
PAYPAL_MODE=live
PAYPAL_USERNAME=your_live_username
PAYPAL_PASSWORD=your_live_password
PAYPAL_SIGNATURE=your_live_signature
```

### 2. Update Frontend URL
```env
FRONTEND_URL=https://yourdomain.com
```

### 3. Configure PayPal Webhook
- Update webhook URL to production domain
- Test webhook delivery

### 4. SSL/HTTPS
- Ensure your domain uses HTTPS
- PayPal requires secure connections

## Troubleshooting

### Common Issues

#### 1. "Failed to authenticate with PayPal"
- Check PayPal credentials in `.env`
- Verify API username and password
- Ensure sandbox mode is set correctly

#### 2. "Order creation failed"
- Check required fields are provided
- Verify amount is a valid number
- Check MongoDB connection

#### 3. "Payment capture failed"
- Verify order ID is correct
- Check order status in database
- Review PayPal response for details

#### 4. "Redirect URL not working"
- Verify `FRONTEND_URL` in backend `.env`
- Check redirect URLs are correctly configured
- Ensure frontend is running on correct port

## Security Considerations

1. **API Credentials**: Never commit `.env` files with real credentials
2. **HTTPS**: Always use HTTPS in production
3. **Validation**: Validate all payment amounts on backend
4. **Webhooks**: Verify webhook signatures from PayPal
5. **Rate Limiting**: Implement rate limiting on payment endpoints
6. **Logging**: Log all payment transactions for audit trail

## Future Enhancements

1. **Multiple Payment Methods**: Add credit card, Apple Pay, Google Pay
2. **Refunds**: Implement refund functionality
3. **Subscriptions**: Support recurring payments
4. **Multi-currency**: Support multiple currencies
5. **Invoice Generation**: Auto-generate invoices
6. **Email Notifications**: Send payment confirmations
7. **Admin Dashboard**: Payment analytics and management

## Support

For issues or questions:
1. Check PayPal documentation: https://developer.paypal.com/
2. Review error logs in backend console
3. Check database for payment records
4. Contact PayPal support for API issues

## References

- [PayPal REST API Documentation](https://developer.paypal.com/api/rest/)
- [PayPal Checkout Integration](https://developer.paypal.com/docs/checkout/)
- [PayPal SDK Reference](https://developer.paypal.com/sdk/js/)
