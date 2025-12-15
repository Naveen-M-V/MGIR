# PayPal Integration Template for Service Pages

This template shows how to integrate PayPal payments into any service booking page.

## Step 1: Import the Payment Service

```jsx
import paymentService from '../../services/paymentService';
```

## Step 2: Add State for Loading

```jsx
const [isPaymentLoading, setIsPaymentLoading] = useState(false);
```

## Step 3: Create Payment Handler Function

```jsx
const handlePayPalPayment = async () => {
  try {
    setIsPaymentLoading(true);

    const orderResponse = await paymentService.createOrder({
      amount: totalPrice,                    // Payment amount in EUR
      currency: 'EUR',                       // Currency code
      description: 'Your Service Description',
      serviceType: 'your_service_type',      // See list below
      customerName: customerName,            // Customer name
      customerEmail: customerEmail,          // Customer email (optional)
      customerPhone: customerPhone,          // Customer phone (optional)
      bookingDetails: {
        // Add any booking-specific details here
        date: bookingDate,
        time: bookingTime,
        location: bookingLocation,
        // ... other details
      }
    });

    if (orderResponse.success) {
      // Get the approval URL and redirect
      const approvalUrl = orderResponse.links?.find(link => link.rel === 'approve')?.href;
      if (approvalUrl) {
        window.location.href = approvalUrl;
      }
    } else {
      alert('Failed to create payment order. Please try again.');
    }
  } catch (error) {
    console.error('Payment error:', error);
    alert('Payment failed. Please try again.');
  } finally {
    setIsPaymentLoading(false);
  }
};
```

## Step 4: Add Payment Button

```jsx
<button
  onClick={handlePayPalPayment}
  disabled={!formValid || isPaymentLoading}
  className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
    formValid && !isPaymentLoading
      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:scale-105 hover:shadow-lg'
      : 'bg-white/10 text-white/60 border border-white/20 cursor-not-allowed'
  }`}
>
  {isPaymentLoading ? (
    <>
      <span className="inline-block animate-spin">⏳</span>
      Processing...
    </>
  ) : (
    <>
      <span>🅿️</span>
      Pay with PayPal - €{totalPrice}
    </>
  )}
</button>
```

## Service Types Reference

Use one of these service types in your `serviceType` field:

| Service Type | Description |
|---|---|
| `tour` | Tour bookings |
| `personal_curator` | Personal curator services |
| `personal_companion` | Personal companion services |
| `car_rental` | Car rental services |
| `private_chauffeur` | Private chauffeur services |
| `airport_transfer` | Airport transfer services |
| `beauty_service` | Beauty services |
| `babysitting` | Babysitting services |
| `pet_sitting` | Pet sitting services |

## Complete Example: Tour Service

```jsx
import React, { useState } from 'react';
import paymentService from '../../services/paymentService';

function TourBookingModal({ isOpen, onClose, tourName, tourPrice }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    persons: 1
  });
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayPalPayment = async () => {
    try {
      setIsPaymentLoading(true);

      const totalPrice = tourPrice * parseInt(formData.persons);

      const orderResponse = await paymentService.createOrder({
        amount: totalPrice,
        currency: 'EUR',
        description: `Tour: ${tourName} - ${formData.persons} person(s)`,
        serviceType: 'tour',
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        bookingDetails: {
          tourName: tourName,
          date: formData.date,
          persons: formData.persons,
          pricePerPerson: tourPrice,
          totalPrice: totalPrice
        }
      });

      if (orderResponse.success) {
        const approvalUrl = orderResponse.links?.find(link => link.rel === 'approve')?.href;
        if (approvalUrl) {
          window.location.href = approvalUrl;
        }
      } else {
        alert('Failed to create payment order. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const isFormValid = formData.name && formData.email && formData.date && formData.persons;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-6">{tourName} Booking</h2>

        <form className="space-y-4">
          <div>
            <label className="block text-white mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
              className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+39 123 456 7890"
              className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Number of Persons</label>
            <input
              type="number"
              name="persons"
              value={formData.persons}
              onChange={handleInputChange}
              min="1"
              className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handlePayPalPayment}
              disabled={!isFormValid || isPaymentLoading}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                isFormValid && !isPaymentLoading
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:scale-105'
                  : 'bg-white/10 text-white/60 cursor-not-allowed'
              }`}
            >
              {isPaymentLoading ? 'Processing...' : `Pay €${tourPrice * parseInt(formData.persons)}`}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-lg font-semibold bg-white/10 text-white hover:bg-white/20"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TourBookingModal;
```

## Error Handling

Always wrap payment calls in try-catch and provide user feedback:

```jsx
try {
  setIsPaymentLoading(true);
  const orderResponse = await paymentService.createOrder({...});
  
  if (orderResponse.success) {
    // Redirect to PayPal
  } else {
    // Show error message
    alert(orderResponse.message || 'Payment failed');
  }
} catch (error) {
  console.error('Payment error:', error);
  alert('An error occurred. Please try again.');
} finally {
  setIsPaymentLoading(false);
}
```

## Validation Checklist

Before implementing PayPal in a new service:

- [ ] Import `paymentService`
- [ ] Add loading state
- [ ] Validate form data before payment
- [ ] Calculate correct total price
- [ ] Use correct `serviceType`
- [ ] Include all booking details
- [ ] Add error handling
- [ ] Test with sandbox credentials
- [ ] Verify payment records in MongoDB

## Testing Checklist

1. [ ] Fill booking form completely
2. [ ] Click "Pay with PayPal"
3. [ ] Verify redirect to PayPal sandbox
4. [ ] Complete payment with test account
5. [ ] Verify redirect to success page
6. [ ] Check payment record in database
7. [ ] Verify booking details are saved

## Common Issues & Solutions

### Issue: "Payment failed" message
**Solution**: Check browser console and backend logs for error details

### Issue: Not redirecting to PayPal
**Solution**: Verify `approvalUrl` exists in response and `FRONTEND_URL` is correct in backend `.env`

### Issue: Payment not saving to database
**Solution**: Ensure MongoDB is running and connection string is correct

### Issue: CORS errors
**Solution**: Check backend CORS configuration allows frontend URL

## Need Help?

Refer to:
- `PAYPAL_INTEGRATION_GUIDE.md` - Complete documentation
- `PAYPAL_SETUP.md` - Setup instructions
- Backend logs - Check for API errors
- Browser console - Check for frontend errors
