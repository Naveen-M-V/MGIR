import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold text-white mb-2">Payment Cancelled</h1>
          <p className="text-white/70 mb-6">
            You have cancelled the payment. Your booking has not been completed.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate(-1)}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              Return to Booking
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
