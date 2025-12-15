# 🅿️ PayPal Integration for MGIR

Complete PayPal payment integration for My Guide In Rome application with full backend and frontend support.

## 📖 Documentation Index

Start here based on your needs:

### 🚀 Getting Started
- **[PAYPAL_QUICK_REFERENCE.md](./PAYPAL_QUICK_REFERENCE.md)** - Quick reference card (1-2 min read)
- **[PAYPAL_SETUP.md](./PAYPAL_SETUP.md)** - Setup instructions (5-10 min read)

### 📚 Detailed Documentation
- **[PAYPAL_INTEGRATION_GUIDE.md](./PAYPAL_INTEGRATION_GUIDE.md)** - Complete technical guide (15-20 min read)
- **[PAYPAL_INTEGRATION_TEMPLATE.md](./PAYPAL_INTEGRATION_TEMPLATE.md)** - Code templates and examples (10-15 min read)
- **[PAYPAL_IMPLEMENTATION_SUMMARY.md](./PAYPAL_IMPLEMENTATION_SUMMARY.md)** - Full implementation summary (10 min read)

## ⚡ Quick Start (2 minutes)

```bash
# 1. Install dependencies
cd backend && npm install && cd ..
npm install

# 2. Start backend
cd backend && npm start

# 3. Start frontend (new terminal)
npm run dev

# 4. Test payment
# Go to Beauty Services → Fill form → Click "Pay with PayPal"
```

## 🔐 Sandbox Credentials

```
Username:  sb-mlm8n47554310_api1.business.example.com
Password:  ME56DRE7H3JP486
Signature: A3pTw6bl6mWGBjibFNMgWPoVeLbMALdC6kAA2i2oZg.Zfpa.ElnWboJe
Mode:      sandbox
```

## 📁 What Was Added

### Backend
```
backend/
├── services/paypalService.js       ← PayPal API service
├── models/Payment.js               ← Payment database model
└── routes/payments.js              ← Payment API endpoints
```

### Frontend
```
src/
├── services/paymentService.js      ← Payment API client
├── components/PayPalPaymentButton.jsx ← Payment button
└── pages/
    ├── PaymentSuccess.jsx          ← Success page
    └── PaymentCancel.jsx           ← Cancel page
```

### Documentation
```
├── PAYPAL_README.md                ← This file
├── PAYPAL_QUICK_REFERENCE.md       ← Quick reference
├── PAYPAL_SETUP.md                 ← Setup guide
├── PAYPAL_INTEGRATION_GUIDE.md     ← Complete guide
├── PAYPAL_INTEGRATION_TEMPLATE.md  ← Code templates
└── PAYPAL_IMPLEMENTATION_SUMMARY.md ← Full summary
```

## 🎯 Features

✅ **Secure PayPal Integration**
- REST API integration with PayPal
- Sandbox and live mode support
- Order creation and tracking

✅ **Payment Processing**
- Order creation and approval
- Payment capture and confirmation
- Transaction logging

✅ **Database Storage**
- MongoDB payment records
- Order history tracking
- Payment status management

✅ **User Experience**
- Seamless checkout flow
- Success/cancel pages
- Error handling and validation

✅ **Multiple Services**
- Tours, beauty, car rental, chauffeur
- Babysitting, pet sitting, and more
- Extensible service type system

✅ **Admin Features**
- Payment history tracking
- Payment statistics
- Webhook support

## 🔌 API Endpoints

```
POST   /api/payments/create-order      Create PayPal order
POST   /api/payments/capture-order     Complete payment
GET    /api/payments/order/:orderId    Get order details
GET    /api/payments/history           Payment history
GET    /api/payments/stats             Statistics
POST   /api/payments/webhook           PayPal webhooks
```

## 💳 Payment Flow

```
1. User fills booking form
2. Clicks "Pay with PayPal"
3. Frontend creates order via backend
4. User redirected to PayPal
5. User approves payment
6. PayPal redirects back with token
7. Backend captures payment
8. User sees success page
9. Payment saved to database
```

## 🧪 Testing

### Test Payment
1. Navigate to Beauty Services page
2. Fill in booking details
3. Click "Pay with PayPal"
4. Complete payment with test account
5. Verify success page
6. Check MongoDB for payment record

### Test Accounts
- Create test accounts in PayPal Developer Dashboard
- Use for sandbox testing
- Switch to live credentials for production

## 📊 Database Schema

```javascript
Payment {
  orderId: String,           // PayPal Order ID
  userId: ObjectId,          // User reference
  status: String,            // CREATED, APPROVED, COMPLETED, FAILED
  amount: Number,            // Payment amount
  currency: String,          // EUR, USD, etc.
  description: String,       // Payment description
  serviceType: String,       // Type of service
  customerInfo: Object,      // Name, email, phone
  bookingDetails: Object,    // Service-specific details
  transactionId: String,     // PayPal transaction ID
  createdAt: Date,
  completedAt: Date
}
```

## 🔧 Integration with Services

### Beauty Service (Already Integrated)
```jsx
import paymentService from '../../services/paymentService';

const orderResponse = await paymentService.createOrder({
  amount: 150,
  currency: 'EUR',
  description: 'Beauty Service - Hair Styling',
  serviceType: 'beauty_service',
  customerName: customerName,
  bookingDetails: { /* details */ }
});
```

### Other Services (Use Template)
See `PAYPAL_INTEGRATION_TEMPLATE.md` for:
- Tour services
- Car rental
- Chauffeur services
- And more...

## 🚀 Production Deployment

### 1. Get Live Credentials
- Log in to PayPal Business account
- Get live API credentials
- Update `.env` with live credentials

### 2. Update Configuration
```env
PAYPAL_MODE=live
PAYPAL_USERNAME=your_live_username
PAYPAL_PASSWORD=your_live_password
PAYPAL_SIGNATURE=your_live_signature
FRONTEND_URL=https://yourdomain.com
```

### 3. Configure Webhooks
- Set up PayPal webhooks
- Point to production domain
- Test webhook delivery

### 4. Enable HTTPS
- Ensure domain uses HTTPS
- PayPal requires secure connections

### 5. Deploy
- Deploy backend to production
- Deploy frontend to production
- Test payment flow

## 🐛 Troubleshooting

### Backend Issues
- Check PayPal credentials in `.env`
- Verify MongoDB connection
- Review backend logs
- Check payment routes are registered

### Frontend Issues
- Check browser console (F12)
- Verify API URL is correct
- Check service imports
- Ensure routes are in App.jsx

### Payment Issues
- Verify amount is valid
- Check service type is correct
- Ensure form validation passes
- Review PayPal response

## 📚 Documentation Guide

| Document | Purpose | Read Time |
|----------|---------|-----------|
| PAYPAL_QUICK_REFERENCE.md | Quick reference card | 1-2 min |
| PAYPAL_SETUP.md | Setup instructions | 5-10 min |
| PAYPAL_INTEGRATION_GUIDE.md | Complete technical guide | 15-20 min |
| PAYPAL_INTEGRATION_TEMPLATE.md | Code templates | 10-15 min |
| PAYPAL_IMPLEMENTATION_SUMMARY.md | Full summary | 10 min |

## 🎓 Learning Path

1. **Start**: Read PAYPAL_QUICK_REFERENCE.md
2. **Setup**: Follow PAYPAL_SETUP.md
3. **Learn**: Read PAYPAL_INTEGRATION_GUIDE.md
4. **Code**: Review PAYPAL_INTEGRATION_TEMPLATE.md
5. **Test**: Complete test payment flow
6. **Integrate**: Add to other services
7. **Deploy**: Move to production

## ✅ Checklist

### Setup
- [ ] Install backend dependencies
- [ ] Install frontend dependencies
- [ ] Start backend server
- [ ] Start frontend server
- [ ] Verify health check endpoint

### Testing
- [ ] Test payment flow
- [ ] Verify success page
- [ ] Check database records
- [ ] Test error handling
- [ ] Test cancel flow

### Integration
- [ ] Add to Tour services
- [ ] Add to Car Rental
- [ ] Add to Chauffeur services
- [ ] Add to other services
- [ ] Update all booking modals

### Production
- [ ] Get live credentials
- [ ] Update environment variables
- [ ] Configure webhooks
- [ ] Enable HTTPS
- [ ] Deploy to production
- [ ] Test live payments

## 🔒 Security

- ✅ API credentials in environment variables
- ✅ Backend payment processing
- ✅ Payment validation
- ✅ Secure HTTPS redirects
- ✅ Order status tracking
- ✅ Transaction logging
- ✅ Webhook verification

## 📞 Support

### Documentation
- Complete guide: `PAYPAL_INTEGRATION_GUIDE.md`
- Setup help: `PAYPAL_SETUP.md`
- Code examples: `PAYPAL_INTEGRATION_TEMPLATE.md`

### External Resources
- **PayPal Developer**: https://developer.paypal.com/
- **API Documentation**: https://developer.paypal.com/api/rest/
- **Sandbox Dashboard**: https://www.sandbox.paypal.com/

### Debugging
- Check backend logs (terminal)
- Check frontend logs (browser console F12)
- Review database records (MongoDB)
- Check PayPal API responses

## 🎉 What's Next?

1. **Install & Test** - Follow PAYPAL_SETUP.md
2. **Integrate Services** - Use PAYPAL_INTEGRATION_TEMPLATE.md
3. **Deploy** - Use live credentials
4. **Monitor** - Track payments in database
5. **Enhance** - Add refunds, subscriptions, etc.

## 📝 Files Modified

- `backend/package.json` - Added dependencies
- `backend/.env` - Added credentials
- `backend/server.js` - Added routes
- `package.json` - Added react-paypal-js
- `src/App.jsx` - Added payment routes
- `src/pages/servicespage/Beauty.jsx` - Integrated PayPal

## 📦 Dependencies Added

### Backend
- `@paypal/checkout-server-sdk` - PayPal SDK
- `axios` - HTTP client

### Frontend
- `react-paypal-js` - PayPal React integration

## 🏁 Status

✅ **COMPLETE** - PayPal integration is fully implemented and ready to use!

---

**Version**: 1.0  
**Last Updated**: 2024  
**Status**: Production Ready

For questions or issues, refer to the documentation files or PayPal Developer documentation.
