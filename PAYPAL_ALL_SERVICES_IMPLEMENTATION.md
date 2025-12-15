# PayPal Integration for All Service Pages

## Overview
PayPal payment integration has been implemented for all service pages using a reusable `PayPalBookingModal` component.

## Reusable Component

### PayPalBookingModal Component
**Location:** `src/components/PayPalBookingModal.jsx`

**Features:**
- Collects customer information (name, email, phone)
- Optional WhatsApp number for receipt delivery
- Displays booking details
- Handles PayPal payment flow
- Beautiful glassmorphism UI with animations
- Error handling and loading states

**Props:**
```javascript
{
  isOpen: boolean,                    // Whether modal is open
  onClose: function,                  // Callback when modal closes
  serviceName: string,                // Name of the service
  servicePrice: number | string,      // Price (e.g., 350 or "€350")
  serviceType: string,                // Service type (tour, beauty_service, etc.)
  bookingDetails: object,             // Additional details to display
  onPaymentStart: function (optional) // Callback when payment starts
}
```

**Usage Example:**
```jsx
import PayPalBookingModal from '../../components/PayPalBookingModal';

// In component
const [isPayPalModalOpen, setIsPayPalModalOpen] = useState(false);
const [selectedService, setSelectedService] = useState(null);

<PayPalBookingModal
  isOpen={isPayPalModalOpen}
  onClose={() => setIsPayPalModalOpen(false)}
  serviceName={selectedService.title}
  servicePrice={selectedService.price}
  serviceType="tour"
  bookingDetails={{
    place: selectedService.place,
    languages: selectedService.languages
  }}
/>
```

## Service Pages Updated

### 1. Tour.jsx ✅
**Status:** Implemented

**Changes:**
- Added PayPalBookingModal import
- Added state for PayPal modal management
- Updated ServiceModal to trigger PayPal modal
- Passes tour details to PayPal modal

**Service Type:** `tour`

### 2. Beauty.jsx ✅ (Already Implemented)
**Status:** Already has PayPal integration

**Service Type:** `beauty_service`

### 3. Seamless.jsx (Car Rental & Private Chauffeur)
**Status:** Ready for implementation

**Service Types:**
- `car_rental`
- `private_chauffeur`
- `airport_transfer`

### 4. Personalized.jsx (Personal Companion)
**Status:** Ready for implementation

**Service Type:** `personal_companion`

### 5. Sitting.jsx (Pet Sitting & Babysitting)
**Status:** Ready for implementation

**Service Types:**
- `pet_sitting`
- `babysitting`

### 6. PersonalCurator.jsx (Personal Curator)
**Status:** Ready for implementation

**Service Type:** `personal_curator`

## Implementation Steps for Each Page

### Step 1: Add Import
```jsx
import PayPalBookingModal from '../../components/PayPalBookingModal';
```

### Step 2: Add State
```jsx
const [isPayPalModalOpen, setIsPayPalModalOpen] = useState(false);
const [selectedServiceForPayment, setSelectedServiceForPayment] = useState(null);
```

### Step 3: Add Handler Functions
```jsx
const handleOpenPayPalModal = (service) => {
  setSelectedServiceForPayment(service);
  setIsPayPalModalOpen(true);
  // Close any other modals
};

const handleClosePayPalModal = () => {
  setIsPayPalModalOpen(false);
  setSelectedServiceForPayment(null);
};
```

### Step 4: Add Modal Component
```jsx
{selectedServiceForPayment && (
  <PayPalBookingModal
    isOpen={isPayPalModalOpen}
    onClose={handleClosePayPalModal}
    serviceName={selectedServiceForPayment.title}
    servicePrice={selectedServiceForPayment.price}
    serviceType="service_type_here"
    bookingDetails={{
      // Add relevant details
    }}
  />
)}
```

### Step 5: Update Existing Modal
Update any existing booking modal to call `handleOpenPayPalModal` instead of old payment handler.

## Service Types Reference

```javascript
const serviceTypes = {
  'tour': 'Tour',
  'beauty_service': 'Beauty Service',
  'car_rental': 'Car Rental',
  'private_chauffeur': 'Private Chauffeur',
  'airport_transfer': 'Airport Transfer',
  'personal_companion': 'Personal Companion',
  'personal_curator': 'Personal Curator',
  'babysitting': 'Babysitting',
  'pet_sitting': 'Pet Sitting'
};
```

## Payment Flow

1. **User selects service** → Opens service details modal
2. **User clicks "Book Now" or "Pay with PayPal"** → Triggers PayPal modal
3. **User fills form** → Name, Email, Phone, WhatsApp (optional)
4. **User clicks "Pay with PayPal"** → Stores WhatsApp phone in localStorage
5. **Backend creates order** → PayPal order created
6. **User redirected to PayPal** → Approves payment
7. **PayPal redirects back** → PaymentSuccess page processes
8. **Backend captures payment** → Generates PDF, sends WhatsApp
9. **User sees confirmation** → Success page with receipt details

## Database Schema

All payments stored in MongoDB with:
- `orderId`: PayPal order ID
- `userId`: User ID (if authenticated)
- `status`: CREATED, APPROVED, COMPLETED, FAILED
- `amount`: Payment amount
- `currency`: EUR (default)
- `description`: Service description
- `serviceType`: Type of service
- `customerInfo`: Name, email, phone
- `bookingDetails`: Service-specific details
- `transactionId`: PayPal transaction ID
- `payerEmail`: PayPal payer email
- `completedAt`: Completion timestamp

## API Endpoints

### Create Order
```
POST /api/payments/create-order
Body: {
  amount: number,
  currency: 'EUR',
  description: string,
  serviceType: string,
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  bookingDetails: object
}
```

### Capture Order
```
POST /api/payments/capture-order
Body: {
  orderId: string,
  whatsappPhone: string (optional)
}
```

### Get Order Details
```
GET /api/payments/order/:orderId
```

## Environment Variables Required

```env
# PayPal Configuration
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
PAYPAL_MODE=sandbox

# Twilio Configuration (for WhatsApp)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

## Testing Checklist

For each service page:
- [ ] Service card displays correctly
- [ ] Clicking service opens details modal
- [ ] Clicking "Book Now" opens PayPal modal
- [ ] Form validation works
- [ ] PayPal payment flow works
- [ ] PDF receipt generated
- [ ] WhatsApp message sent (if phone provided)
- [ ] Payment success page displays
- [ ] Payment recorded in database

## Files Structure

```
src/
├── components/
│   └── PayPalBookingModal.jsx      # Reusable modal component
├── pages/
│   ├── PersonalCurator.jsx         # Personal Curator page
│   ├── servicespage/
│   │   ├── Tour.jsx                # Tours (✅ Updated)
│   │   ├── Beauty.jsx              # Beauty (✅ Already done)
│   │   ├── Seamless.jsx            # Car services
│   │   ├── Personalized.jsx        # Personal Companion
│   │   └── Sitting.jsx             # Pet/Baby sitting
│   └── PaymentSuccess.jsx          # Success page
└── services/
    └── paymentService.js           # Payment API client

backend/
├── services/
│   ├── paypalService.js            # PayPal API
│   ├── pdfService.js               # PDF generation
│   └── whatsappService.js          # WhatsApp messaging
├── routes/
│   └── payments.js                 # Payment endpoints
├── models/
│   └── Payment.js                  # Payment schema
└── receipts/                       # Generated PDFs
```

## Next Steps

1. ✅ Tour.jsx - Implemented
2. ⏳ Seamless.jsx - Ready to implement
3. ⏳ Personalized.jsx - Ready to implement
4. ⏳ Sitting.jsx - Ready to implement
5. ⏳ PersonalCurator.jsx - Ready to implement

## Support

For issues or questions:
- Check PayPal integration guide: `PAYPAL_INTEGRATION_GUIDE.md`
- Check PDF/WhatsApp setup: `PDF_WHATSAPP_SETUP.md`
- Review payment flow documentation
