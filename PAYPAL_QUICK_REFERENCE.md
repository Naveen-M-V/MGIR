# PayPal Integration - Quick Reference Card

## 🚀 Quick Start

```bash
# 1. Install dependencies
cd backend && npm install && cd ..
npm install

# 2. Start backend (Terminal 1)
cd backend && npm start

# 3. Start frontend (Terminal 2)
npm run dev

# 4. Open browser
http://localhost:5173
```

## 🔐 Sandbox Credentials

```
Username:  sb-mlm8n47554310_api1.business.example.com
Password:  ME56DRE7H3JP486
Signature: A3pTw6bl6mWGBjibFNMgWPoVeLbMALdC6kAA2i2oZg.Zfpa.ElnWboJe
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `backend/services/paypalService.js` | PayPal API client |
| `backend/models/Payment.js` | Payment database model |
| `backend/routes/payments.js` | Payment API endpoints |
| `src/services/paymentService.js` | Frontend payment service |
| `src/pages/PaymentSuccess.jsx` | Success page |
| `src/pages/PaymentCancel.jsx` | Cancel page |

## 🔌 API Endpoints

```
POST   /api/payments/create-order      Create PayPal order
POST   /api/payments/capture-order     Complete payment
GET    /api/payments/order/:orderId    Get order details
GET    /api/payments/history           Payment history (auth required)
GET    /api/payments/stats             Statistics (admin)
POST   /api/payments/webhook           PayPal webhooks
```

## 💻 Integration Code

### Import Service
```jsx
import paymentService from '../../services/paymentService';
```

### Create Order
```jsx
const orderResponse = await paymentService.createOrder({
  amount: 150,
  currency: 'EUR',
  description: 'Service Description',
  serviceType: 'beauty_service',
  customerName: 'John Doe',
  bookingDetails: { /* details */ }
});

if (orderResponse.success) {
  const approvalUrl = orderResponse.links?.find(link => link.rel === 'approve')?.href;
  if (approvalUrl) window.location.href = approvalUrl;
}
```

## 📊 Service Types

```
tour                    Tour bookings
personal_curator        Personal curator
personal_companion      Personal companion
car_rental             Car rental
private_chauffeur      Private chauffeur
airport_transfer       Airport transfer
beauty_service         Beauty services
babysitting            Babysitting
pet_sitting            Pet sitting
```

## 🧪 Testing Checklist

- [ ] Fill booking form
- [ ] Click "Pay with PayPal"
- [ ] Verify redirect to PayPal
- [ ] Complete payment
- [ ] Verify success page
- [ ] Check MongoDB for payment record

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Failed to authenticate" | Check PayPal credentials in `.env` |
| "Not redirecting to PayPal" | Verify `FRONTEND_URL` in `.env` |
| "Payment not saving" | Check MongoDB connection |
| "CORS errors" | Check backend CORS config |
| "Order creation failed" | Check required fields are provided |

## 📚 Documentation

- `PAYPAL_INTEGRATION_GUIDE.md` - Complete guide
- `PAYPAL_SETUP.md` - Setup instructions
- `PAYPAL_INTEGRATION_TEMPLATE.md` - Code templates
- `PAYPAL_IMPLEMENTATION_SUMMARY.md` - Full summary

## 🎯 Payment Flow

```
User Form → Click Pay → Create Order → Redirect PayPal 
→ User Approves → Redirect Back → Capture Order → Success
```

## 💾 Database

### Payment Collection Fields
```
orderId              PayPal Order ID
userId               User reference
status               CREATED, APPROVED, COMPLETED, FAILED
amount               Payment amount
currency             EUR, USD, etc.
description          Payment description
serviceType          Type of service
customerInfo         Name, email, phone
bookingDetails       Service-specific details
transactionId        PayPal transaction ID
createdAt            Creation timestamp
completedAt          Completion timestamp
```

## 🔒 Environment Variables

### Backend (.env)
```env
PAYPAL_MODE=sandbox
PAYPAL_USERNAME=sb-mlm8n47554310_api1.business.example.com
PAYPAL_PASSWORD=ME56DRE7H3JP486
PAYPAL_SIGNATURE=A3pTw6bl6mWGBjibFNMgWPoVeLbMALdC6kAA2i2oZg.Zfpa.ElnWboJe
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env.local - optional)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚢 Production Deployment

```bash
# 1. Get live credentials from PayPal
# 2. Update .env with live credentials
PAYPAL_MODE=live
PAYPAL_USERNAME=your_live_username
PAYPAL_PASSWORD=your_live_password
PAYPAL_SIGNATURE=your_live_signature

# 3. Update FRONTEND_URL
FRONTEND_URL=https://yourdomain.com

# 4. Enable HTTPS/SSL
# 5. Configure PayPal webhooks
# 6. Deploy and test
```

## 📞 Quick Links

- **PayPal Developer**: https://developer.paypal.com/
- **API Docs**: https://developer.paypal.com/api/rest/
- **Sandbox Dashboard**: https://www.sandbox.paypal.com/
- **Live Dashboard**: https://www.paypal.com/

## ⚡ Common Commands

```bash
# Start backend
cd backend && npm start

# Start frontend
npm run dev

# Install dependencies
npm install

# Check backend logs
# Look in terminal running backend

# Check frontend logs
# Open browser console (F12)

# View database
# Use MongoDB Compass or CLI
```

## 🎓 Learning Path

1. Read `PAYPAL_SETUP.md` - Understand setup
2. Read `PAYPAL_INTEGRATION_GUIDE.md` - Learn details
3. Review `PAYPAL_INTEGRATION_TEMPLATE.md` - See examples
4. Test with sandbox credentials
5. Integrate with other services
6. Deploy to production

## ✅ Verification

```bash
# Backend health check
curl http://localhost:5000/api/health

# Create test order
curl -X POST http://localhost:5000/api/payments/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "currency": "EUR",
    "description": "Test",
    "serviceType": "tour"
  }'
```

## 🆘 Getting Help

1. Check browser console (F12) for frontend errors
2. Check terminal for backend errors
3. Review `PAYPAL_INTEGRATION_GUIDE.md`
4. Check PayPal Developer documentation
5. Verify all credentials and URLs

---

**Status**: ✅ Ready to use!

**Last Updated**: 2024
