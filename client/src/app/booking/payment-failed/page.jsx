'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle, AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function PaymentFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');
  const error = searchParams.get('error');

  const getErrorMessage = () => {
    if (error === 'booking_not_found') {
      return 'Booking not found. Please check your booking details.';
    }
    if (error === 'server_error') {
      return 'A server error occurred. Please try again later.';
    }
    if (reason === 'payment_failed') {
      return 'Payment processing failed. Your payment could not be completed.';
    }
    if (reason === 'user_cancelled') {
      return 'Payment was cancelled. You can try again when ready.';
    }
    return 'An unexpected error occurred during payment.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-4">
            <XCircle className="w-16 h-16 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-xl text-gray-600">We couldn't process your payment</p>
        </div>

        {/* Error Details Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-red-900 mb-2">What Happened?</h3>
                <p className="text-red-800">{getErrorMessage()}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-900">Common Reasons for Payment Failure:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Insufficient funds in your account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Card details entered incorrectly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Payment gateway timeout or connectivity issues</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Bank declined the transaction</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Payment cancelled by user</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">What You Can Do:</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>✓ Check your account balance and card details</li>
              <li>✓ Contact your bank if the issue persists</li>
              <li>✓ Try using a different payment method</li>
              <li>✓ Retry the payment from your bookings page</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push('/user/bookings')}
            className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-4 rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            <RefreshCw className="w-5 h-5" />
            Go to My Bookings & Retry Payment
          </button>
          
          <button
            onClick={() => router.push('/production-houses')}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 rounded-lg transition-all shadow-md hover:shadow-lg border-2 border-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Browse Services
          </button>
        </div>

        {/* Support Info */}
        <div className="text-center mt-8 bg-white rounded-lg p-6 shadow-md">
          <p className="text-sm text-gray-600 mb-2">Need Assistance?</p>
          <p className="font-semibold text-gray-900 mb-1">Contact Our Support Team</p>
          <div className="space-y-1 text-sm text-gray-700">
            <p>📧 support@event-connect.com</p>
            <p>📞 +880 123-456-7890</p>
            <p className="text-xs text-gray-500 mt-2">Available 9 AM - 9 PM, 7 days a week</p>
          </div>
        </div>

        {/* Important Note */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">Note:</span> Your booking request is still active. 
            No charges have been made to your account. You can retry the payment anytime from 
            your bookings page within the next 48 hours.
          </p>
        </div>
      </div>
    </div>
  );
}