'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Phone, Mail, Clock, Calendar, MapPin, DollarSign, Loader2 } from 'lucide-react';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const tran_id = searchParams.get('tran_id');
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    if (bookingId && tran_id) {
      verifyPayment();
    }
  }, [bookingId, tran_id]);

  const verifyPayment = async () => {
    try {
      setVerifying(true);
      
      // Call backend to verify and update booking
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/booking/verify-payment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId,
            transactionId: tran_id
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        setBooking(data.data);
      } else {
        console.error('Payment verification failed:', data.message);
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
    } finally {
      setVerifying(false);
      setLoading(false);
    }
  };

  if (loading || verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-600 mx-auto mb-4" />
          <p className="text-gray-600">Verifying your payment...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait, do not close this page</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Verification Failed</h1>
          <p className="text-gray-600 mb-6">We couldn't verify your payment. Please contact support.</p>
          <button
            onClick={() => router.push('/user/booking')}
            className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700"
          >
            Go to My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4 animate-bounce">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-xl text-gray-600">Your booking has been confirmed</p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmation</h2>
            
            <div className="space-y-4">
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                <p className="text-sm text-cyan-700 mb-1">Service Provider</p>
                <p className="text-xl font-bold text-cyan-900">{booking.service?.companyName}</p>
                <p className="text-sm text-gray-600">{booking.service?.serviceCategory}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-cyan-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Event Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(booking.eventDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-cyan-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold text-gray-900">{booking.eventCity}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Selected Package</p>
                <p className="text-lg font-bold text-gray-900 mb-3">{booking.selectedPackage?.name}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Package Price:</span>
                    <span className="font-semibold">৳{booking.packagePrice?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Advance Paid (10%):</span>
                    <span className="font-bold">৳{booking.advancePayment?.toLocaleString()} ✓</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-gray-200 pt-2">
                    <span className="text-gray-600">Remaining Amount:</span>
                    <span className="font-bold text-orange-600">৳{booking.remainingPayment?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vendor Contact Info */}
          {booking?.vendor && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Vendor Contact Details (Now Available)
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-700" />
                  <div>
                    <p className="text-sm text-green-700">Phone</p>
                    <p className="font-semibold text-green-900">{booking.vendor.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-green-700" />
                  <div>
                    <p className="text-sm text-green-700">Email</p>
                    <p className="font-semibold text-green-900">{booking.vendor.email}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-white rounded p-3">
                <p className="text-sm text-green-800">
                  ✓ You can now contact the vendor directly to discuss event details and confirm arrangements.
                </p>
              </div>
            </div>
          )}

          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Transaction Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono font-semibold">{tran_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className="text-green-600 font-semibold">✓ Completed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Date:</span>
                <span className="font-semibold">
                  {new Date().toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-blue-900 mb-3">What's Next?</h3>
            <ol className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                <span>Contact the vendor using the details above to finalize event arrangements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                <span>Check your email for booking confirmation and receipt</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">3.</span>
                <span>Pay the remaining 90% before the event date</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">4.</span>
                <span>Enjoy your event! 🎉</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/user/booking')}
            className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-4 rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            View My Bookings
          </button>
          <button
            onClick={() => router.push('/production-houses')}
            className="flex-1 bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 rounded-lg transition-all shadow-md hover:shadow-lg border-2 border-gray-200"
          >
            Browse More Services
          </button>
        </div>

        {/* Support Info */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>Need help? Contact our support team</p>
          <p className="font-semibold text-gray-900">support@event-connect.com | +880 123-456-7890</p>
        </div>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function PaymentSuccessLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-cyan-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading payment confirmation...</p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessLoading />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}