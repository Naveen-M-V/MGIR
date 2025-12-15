# PayPal Integration - Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER BROWSER                                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    React Frontend (Vite)                         │  │
│  │  ┌────────────────────────────────────────────────────────────┐ │  │
│  │  │  Beauty Service Page / Other Service Pages                │ │  │
│  │  │  ├─ Booking Form                                          │ │  │
│  │  │  ├─ Payment Button (PayPal)                               │ │  │
│  │  │  └─ Form Validation                                       │ │  │
│  │  └────────────────────────────────────────────────────────────┘ │  │
│  │                           ↓                                       │  │
│  │  ┌────────────────────────────────────────────────────────────┐ │  │
│  │  │  Payment Service (src/services/paymentService.js)         │ │  │
│  │  │  ├─ createOrder()                                         │ │  │
│  │  │  ├─ captureOrder()                                        │ │  │
│  │  │  └─ getOrderDetails()                                     │ │  │
│  │  └────────────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                           ↓ HTTP                                        │
│                    /api/payments/*                                      │
└─────────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                        EXPRESS BACKEND                                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Payment Routes (backend/routes/payments.js)                    │  │
│  │  ├─ POST /create-order                                          │  │
│  │  ├─ POST /capture-order                                         │  │
│  │  ├─ GET /order/:orderId                                         │  │
│  │  ├─ GET /history                                                │  │
│  │  ├─ GET /stats                                                  │  │
│  │  └─ POST /webhook                                               │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                           ↓                                             │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  PayPal Service (backend/services/paypalService.js)            │  │
│  │  ├─ getAccessToken()                                            │  │
│  │  ├─ createOrder()                                               │  │
│  │  ├─ captureOrder()                                              │  │
│  │  └─ getOrderDetails()                                           │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                           ↓                                             │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Payment Model (backend/models/Payment.js)                      │  │
│  │  ├─ Save payment records                                        │  │
│  │  ├─ Update payment status                                       │  │
│  │  └─ Query payment history                                       │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
         ↓ HTTPS                              ↓ MongoDB
    PayPal API                           Database
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PAYMENT FLOW                                    │
└─────────────────────────────────────────────────────────────────────────┘

1. USER INITIATES PAYMENT
   ┌──────────────────┐
   │ Booking Form     │
   │ Fill Details     │
   │ Click Pay Button │
   └────────┬─────────┘
            │
            ↓
2. FRONTEND CREATES ORDER
   ┌──────────────────────────────┐
   │ paymentService.createOrder() │
   │ POST /api/payments/create-order
   └────────┬─────────────────────┘
            │
            ↓
3. BACKEND PROCESSES ORDER
   ┌────────────────────────────────────┐
   │ Validate payment data              │
   │ Authenticate with PayPal           │
   │ Create PayPal order                │
   │ Store payment record in MongoDB    │
   └────────┬───────────────────────────┘
            │
            ↓
4. RETURN APPROVAL URL
   ┌──────────────────────────────────┐
   │ Return order ID and approval URL │
   └────────┬─────────────────────────┘
            │
            ↓
5. REDIRECT TO PAYPAL
   ┌──────────────────────────────┐
   │ window.location.href =       │
   │ PayPal approval URL          │
   └────────┬─────────────────────┘
            │
            ↓
6. USER APPROVES PAYMENT
   ┌──────────────────────────────┐
   │ User logs into PayPal        │
   │ Reviews payment details      │
   │ Approves payment             │
   └────────┬─────────────────────┘
            │
            ↓
7. PAYPAL REDIRECTS BACK
   ┌──────────────────────────────┐
   │ Redirect to /payment-success │
   │ Include order token          │
   └────────┬─────────────────────┘
            │
            ↓
8. FRONTEND CAPTURES ORDER
   ┌──────────────────────────────┐
   │ paymentService.captureOrder()│
   │ POST /api/payments/capture-order
   └────────┬─────────────────────┘
            │
            ↓
9. BACKEND COMPLETES PAYMENT
   ┌────────────────────────────────────┐
   │ Capture payment with PayPal        │
   │ Update payment status to COMPLETED │
   │ Store transaction ID               │
   │ Update MongoDB record              │
   └────────┬───────────────────────────┘
            │
            ↓
10. SHOW SUCCESS PAGE
    ┌──────────────────────────────┐
    │ Display success message      │
    │ Show order details           │
    │ Provide booking confirmation │
    └──────────────────────────────┘
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND COMPONENTS                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  App.jsx                                                                │
│  ├─ Routes                                                              │
│  │  ├─ /beauty → Beauty.jsx                                            │
│  │  ├─ /tour → Tour.jsx                                                │
│  │  ├─ /payment-success → PaymentSuccess.jsx                           │
│  │  └─ /payment-cancel → PaymentCancel.jsx                             │
│  │                                                                     │
│  Services                                                               │
│  └─ paymentService.js                                                  │
│     ├─ createOrder()                                                   │
│     ├─ captureOrder()                                                  │
│     ├─ getOrderDetails()                                               │
│     ├─ getPaymentHistory()                                             │
│     └─ getPaymentStats()                                               │
│                                                                         │
│  Components                                                             │
│  └─ PayPalPaymentButton.jsx                                            │
│     ├─ Props: amount, currency, description, etc.                     │
│     ├─ State: loading, orderId                                         │
│     └─ Methods: handlePayment()                                        │
│                                                                         │
│  Pages                                                                  │
│  ├─ PaymentSuccess.jsx                                                 │
│  │  ├─ Get order token from URL                                        │
│  │  ├─ Capture order                                                   │
│  │  ├─ Display success message                                         │
│  │  └─ Show order details                                              │
│  │                                                                     │
│  └─ PaymentCancel.jsx                                                  │
│     ├─ Display cancel message                                          │
│     └─ Provide return options                                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        BACKEND COMPONENTS                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  server.js                                                              │
│  ├─ Express app setup                                                  │
│  ├─ CORS configuration                                                 │
│  ├─ MongoDB connection                                                 │
│  ├─ Route registration                                                 │
│  │  ├─ /api/auth                                                       │
│  │  ├─ /api/users                                                      │
│  │  └─ /api/payments ← NEW                                             │
│  └─ Error handling                                                      │
│                                                                         │
│  Routes (payments.js)                                                   │
│  ├─ POST /create-order                                                 │
│  ├─ POST /capture-order                                                │
│  ├─ GET /order/:orderId                                                │
│  ├─ GET /history                                                       │
│  ├─ GET /stats                                                         │
│  └─ POST /webhook                                                      │
│                                                                         │
│  Services (paypalService.js)                                            │
│  ├─ getAccessToken()                                                   │
│  │  └─ Authenticate with PayPal API                                    │
│  ├─ createOrder()                                                      │
│  │  └─ Create PayPal order                                             │
│  ├─ captureOrder()                                                     │
│  │  └─ Capture payment                                                 │
│  └─ getOrderDetails()                                                  │
│     └─ Retrieve order info                                             │
│                                                                         │
│  Models (Payment.js)                                                    │
│  └─ Payment Schema                                                      │
│     ├─ orderId                                                          │
│     ├─ userId                                                           │
│     ├─ status                                                           │
│     ├─ amount                                                           │
│     ├─ currency                                                         │
│     ├─ description                                                      │
│     ├─ serviceType                                                      │
│     ├─ customerInfo                                                     │
│     ├─ bookingDetails                                                   │
│     ├─ paypalResponse                                                   │
│     ├─ transactionId                                                    │
│     └─ timestamps                                                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL SERVICES                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  PayPal API                                                             │
│  ├─ https://api.sandbox.paypal.com (Sandbox)                           │
│  ├─ https://api.paypal.com (Live)                                      │
│  │                                                                     │
│  ├─ Endpoints                                                           │
│  │  ├─ POST /v1/oauth2/token                                           │
│  │  ├─ POST /v2/checkout/orders                                        │
│  │  ├─ POST /v2/checkout/orders/{id}/capture                           │
│  │  └─ GET /v2/checkout/orders/{id}                                    │
│  │                                                                     │
│  └─ Webhooks                                                            │
│     ├─ CHECKOUT.ORDER.COMPLETED                                        │
│     ├─ PAYMENT.CAPTURE.COMPLETED                                       │
│     ├─ PAYMENT.CAPTURE.DENIED                                          │
│     └─ CHECKOUT.ORDER.APPROVED                                         │
│                                                                         │
│  MongoDB                                                                │
│  ├─ Database: mgir-app                                                 │
│  └─ Collection: payments                                               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
DEVELOPMENT
┌──────────────────────────────────────────────────────────────────┐
│  Local Machine                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Frontend: http://localhost:5173                            │ │
│  │ Backend: http://localhost:5000                             │ │
│  │ MongoDB: mongodb://localhost:27017                         │ │
│  │ PayPal: Sandbox Mode                                       │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘

PRODUCTION
┌──────────────────────────────────────────────────────────────────┐
│  Production Server                                               │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Frontend: https://yourdomain.com                           │ │
│  │ Backend: https://yourdomain.com/api                        │ │
│  │ MongoDB: Production Instance                              │ │
│  │ PayPal: Live Mode                                          │ │
│  │ SSL: HTTPS Enabled                                         │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SECURITY LAYERS                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. FRONTEND SECURITY                                                   │
│     ├─ No API keys exposed                                              │
│     ├─ Form validation                                                  │
│     ├─ HTTPS only                                                       │
│     └─ Secure redirects                                                 │
│                                                                         │
│  2. BACKEND SECURITY                                                    │
│     ├─ Environment variables for credentials                            │
│     ├─ Payment validation                                               │
│     ├─ Order verification                                               │
│     ├─ CORS configuration                                               │
│     ├─ Error handling                                                   │
│     └─ Logging                                                          │
│                                                                         │
│  3. PAYPAL SECURITY                                                     │
│     ├─ API authentication                                               │
│     ├─ Secure API endpoints                                             │
│     ├─ Webhook verification                                             │
│     └─ Transaction encryption                                           │
│                                                                         │
│  4. DATABASE SECURITY                                                   │
│     ├─ MongoDB authentication                                           │
│     ├─ Encrypted connections                                            │
│     ├─ Access control                                                   │
│     └─ Backup encryption                                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Integration Points

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SERVICE INTEGRATION POINTS                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Beauty Service (INTEGRATED)                                            │
│  └─ src/pages/servicespage/Beauty.jsx                                   │
│     ├─ Import paymentService                                            │
│     ├─ Create payment handler                                           │
│     └─ Add payment button                                               │
│                                                                         │
│  Tour Service (TEMPLATE AVAILABLE)                                      │
│  └─ src/pages/servicespage/Tour.jsx                                     │
│     ├─ Use PAYPAL_INTEGRATION_TEMPLATE.md                               │
│     └─ Follow same pattern as Beauty                                    │
│                                                                         │
│  Car Rental Service (TEMPLATE AVAILABLE)                                │
│  └─ src/pages/servicespage/Seamless.jsx                                 │
│     ├─ Use PAYPAL_INTEGRATION_TEMPLATE.md                               │
│     └─ Follow same pattern as Beauty                                    │
│                                                                         │
│  Chauffeur Service (TEMPLATE AVAILABLE)                                 │
│  └─ src/pages/servicespage/Seamless.jsx                                 │
│     ├─ Use PAYPAL_INTEGRATION_TEMPLATE.md                               │
│     └─ Follow same pattern as Beauty                                    │
│                                                                         │
│  Sitting Service (TEMPLATE AVAILABLE)                                   │
│  └─ src/pages/servicespage/Sitting.jsx                                  │
│     ├─ Use PAYPAL_INTEGRATION_TEMPLATE.md                               │
│     └─ Follow same pattern as Beauty                                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## File Structure

```
project-root/
├── backend/
│   ├── services/
│   │   └── paypalService.js          ← PayPal API Service
│   ├── models/
│   │   └── Payment.js                ← Payment Model
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── payments.js               ← Payment Routes (NEW)
│   ├── package.json                  ← Updated with PayPal deps
│   ├── .env                          ← PayPal credentials
│   └── server.js                     ← Updated with payment routes
│
├── src/
│   ├── services/
│   │   └── paymentService.js         ← Payment API Client (NEW)
│   ├── components/
│   │   └── PayPalPaymentButton.jsx   ← Payment Button (NEW)
│   ├── pages/
│   │   ├── PaymentSuccess.jsx        ← Success Page (NEW)
│   │   ├── PaymentCancel.jsx         ← Cancel Page (NEW)
│   │   └── servicespage/
│   │       ├── Beauty.jsx            ← Updated with PayPal
│   │       ├── Tour.jsx
│   │       ├── Seamless.jsx
│   │       └── Sitting.jsx
│   ├── App.jsx                       ← Updated with payment routes
│   └── package.json                  ← Updated with react-paypal-js
│
├── PAYPAL_README.md                  ← Main Documentation
├── PAYPAL_QUICK_REFERENCE.md         ← Quick Reference
├── PAYPAL_SETUP.md                   ← Setup Guide
├── PAYPAL_INTEGRATION_GUIDE.md       ← Complete Guide
├── PAYPAL_INTEGRATION_TEMPLATE.md    ← Code Templates
├── PAYPAL_IMPLEMENTATION_SUMMARY.md  ← Full Summary
├── PAYPAL_DEPLOYMENT_CHECKLIST.md    ← Deployment Checklist
├── PAYPAL_ARCHITECTURE.md            ← This File
└── PAYPAL_FINAL_SUMMARY.txt          ← Final Summary
```

---

**Architecture Version**: 1.0  
**Last Updated**: 2024  
**Status**: Complete
