import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import paymentService from '../services/paymentService';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('processing');
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        const orderId = searchParams.get('token');
        
        if (!orderId) {
          setError('No order ID found');
          setStatus('error');
          setLoading(false);
          return;
        }

        // Capture the order
        const captureResponse = await paymentService.captureOrder(orderId);

        if (captureResponse.success) {
          // Get order details
          const details = await paymentService.getOrderDetails(orderId);
          setOrderDetails(details);
          setStatus('success');
        } else {
          setError(captureResponse.message || 'Payment capture failed');
          setStatus('error');
        }
      } catch (err) {
        console.error('Error processing payment:', err);
        setError(err.message || 'An error occurred while processing your payment');
        setStatus('error');
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
          <p className="text-white text-lg">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-white/70 mb-6">
              Your payment has been processed successfully.
            </p>

            {orderDetails?.payment && (
              <div className="bg-white/5 rounded-xl p-4 mb-6 text-left">
                <h3 className="text-white font-semibold mb-3">Order Details</h3>
                <div className="space-y-2 text-sm text-white/70">
                  <p>
                    <span className="text-white">Order ID:</span> {orderDetails.payment._id}
                  </p>
                  <p>
                    <span className="text-white">Amount:</span> €{orderDetails.payment.amount}
                  </p>
                  <p>
                    <span className="text-white">Service:</span> {orderDetails.payment.serviceType}
                  </p>
                  <p>
                    <span className="text-white">Status:</span> {orderDetails.payment.status}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:scale-105 transition-transform"
              >
                Back to Home
              </button>
              <button
                onClick={() => navigate('/bookings')}
                className="w-full py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20"
              >
                View My Bookings
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-white mb-2">Payment Failed</h1>
          <p className="text-white/70 mb-6">
            {error || 'An error occurred while processing your payment. Please try again.'}
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate(-1)}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
