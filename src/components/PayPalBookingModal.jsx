import React, { useState, useEffect } from 'react';
import paymentService from '../services/paymentService';

/**
 * Reusable PayPal Booking Modal Component
 * Can be used across all service pages
 * 
 * Props:
 * - isOpen: boolean - Whether modal is open
 * - onClose: function - Callback when modal closes
 * - serviceName: string - Name of the service
 * - servicePrice: number or string - Price of service (e.g., 350 or "€350")
 * - serviceType: string - Type of service (beauty_service, tour, car_rental, etc.)
 * - bookingDetails: object - Additional booking details to include
 * - onPaymentStart: function - Optional callback when payment starts
 */
export default function PayPalBookingModal({
  isOpen,
  onClose,
  serviceName,
  servicePrice,
  serviceType,
  bookingDetails = {},
  onPaymentStart
}) {
  const [animateIn, setAnimateIn] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setAnimateIn(true);
      setError(null);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Extract numeric price
  const numericPrice = typeof servicePrice === 'string' 
    ? parseFloat(servicePrice.replace('€', '').replace('$', '')) 
    : servicePrice;

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formValid = customerName && customerEmail && customerPhone && isValidEmail(customerEmail);

  const handlePayment = async () => {
    if (!customerName || !customerEmail || !customerPhone) {
      setError('Please fill in all required fields');
      return;
    }

    if (!isValidEmail(customerEmail)) {
      setError('Please enter a valid email address (e.g., user@example.com)');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call onPaymentStart callback if provided
      if (onPaymentStart) {
        onPaymentStart();
      }

      // Create payment order
      const orderResponse = await paymentService.createOrder({
        amount: numericPrice,
        currency: 'EUR',
        description: `${serviceName}`,
        serviceType: serviceType,
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: customerPhone,
        bookingDetails: bookingDetails
      });

      if (orderResponse.success) {
        const approvalUrl = orderResponse.links?.find(link => link.rel === 'approve')?.href;
        if (approvalUrl) {
          window.location.href = approvalUrl;
        } else {
          setError('Failed to get PayPal approval URL');
          setIsLoading(false);
        }
      } else {
        setError(orderResponse.message || 'Failed to create payment order');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'Payment failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 hide-scrollbar">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-blue-400/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-700" />
      </div>

      <div
        className={`relative max-w-xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar transform transition-all duration-500 ease-out ${
          animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Glassmorphism Container */}
        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          {/* Gradient Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-3xl blur-sm" />
          <div className="relative bg-black/30 backdrop-blur-xl rounded-3xl p-8">

            {/* Close Button */}
            <button
              aria-label="Close"
              title="Close"
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300 group z-50"
            >
              <span className="text-white text-lg">×</span>
              <span className="pointer-events-none absolute top-0 left-[-60%] h-full w-8 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:left-[160%]" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent mb-2">
                {serviceName}
              </h2>
              <p className="text-white/70">Price: €{numericPrice.toFixed(2)}</p>
              <div className="w-20 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full mt-4" />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-lg">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* Form */}
            <form className="space-y-4 text-white">
              <div>
                <label className="block mb-1 text-sm font-medium">Your Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Full name"
                  className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50 focus:border-blue-400 focus:ring-blue-500/50 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="your@email.com"
                    className={`w-full border rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50 focus:ring-blue-500/50 outline-none transition-all ${
                      customerEmail && !isValidEmail(customerEmail)
                        ? 'border-red-400 focus:border-red-400'
                        : 'border-white/20 focus:border-blue-400'
                    }`}
                    required
                  />
                  {customerEmail && !isValidEmail(customerEmail) && (
                    <p className="text-red-300 text-xs mt-1">Invalid email format (e.g., user@example.com)</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Phone Number *</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+1234567890"
                  className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50 focus:border-blue-400 focus:ring-blue-500/50 outline-none transition-all"
                  required
                />
              </div>

              {/* Booking Details Display */}
              {Object.keys(bookingDetails).length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3 text-sm">Booking Details</h3>
                  <div className="space-y-2 text-sm text-white/70">
                    {Object.entries(bookingDetails).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="text-white">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Button */}
              <div className="flex flex-col gap-3 mt-6">
                <button
                  type="button"
                  disabled={!formValid || isLoading}
                  className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    formValid && !isLoading
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:scale-105 hover:shadow-lg'
                      : 'bg-white/10 text-white/60 border border-white/20 cursor-not-allowed'
                  }`}
                  onClick={handlePayment}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Processing...
                    </>
                  ) : (
                    <>
                      Pay with PayPal - €{numericPrice.toFixed(2)}
                    </>
                  )}
                </button>

                {formValid && !isLoading && (
                  <div className="text-center">
                    <p className="text-white/50 text-xs">
                      Secure payment powered by PayPal
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
