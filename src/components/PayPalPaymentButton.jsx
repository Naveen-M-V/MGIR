import React, { useEffect, useState } from 'react';
import paymentService from '../services/paymentService';

const PayPalPaymentButton = ({
  amount,
  currency = 'EUR',
  description,
  serviceType,
  customerName,
  customerEmail,
  customerPhone,
  bookingDetails,
  onSuccess,
  onError,
  disabled = false,
  buttonText = 'Pay with PayPal'
}) => {
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Load PayPal script dynamically
  useEffect(() => {
    const loadPayPalScript = () => {
      if (window.paypal) return;

      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=EUR';
      script.async = true;
      script.onload = () => {
        console.log('PayPal SDK loaded');
      };
      document.body.appendChild(script);
    };

    loadPayPalScript();
  }, []);

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Create order on backend
      const orderResponse = await paymentService.createOrder({
        amount,
        currency,
        description,
        serviceType,
        customerName,
        customerEmail,
        customerPhone,
        bookingDetails
      });

      if (orderResponse.success) {
        setOrderId(orderResponse.orderId);

        // Redirect to PayPal approval URL
        const approvalUrl = orderResponse.links?.find(link => link.rel === 'approve')?.href;
        if (approvalUrl) {
          window.location.href = approvalUrl;
        }
      } else {
        throw new Error(orderResponse.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Payment error:', error);
      if (onError) {
        onError(error.message || 'Payment failed');
      }
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || loading}
      className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
        disabled || loading
          ? 'bg-white/10 text-white/60 border border-white/20 cursor-not-allowed'
          : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:scale-105 hover:shadow-lg'
      }`}
    >
      {loading ? (
        <>
          <span className="inline-block animate-spin">⏳</span>
          Processing...
        </>
      ) : (
        <>
          <span>🅿️</span>
          {buttonText} - €{amount}
        </>
      )}
    </button>
  );
};

export default PayPalPaymentButton;
