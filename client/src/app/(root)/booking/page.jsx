"use client";
import { Suspense } from "react";
import React from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const tran_id = searchParams.get("tran_id");
  const bookingId = searchParams.get("bookingId");

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Success Test
          </h1>
          <p className="text-gray-600">
            If you can see this, the page is rendering!
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 space-y-3">
          <div>
            <p className="text-sm text-gray-600">Transaction ID:</p>
            <p className="font-mono font-bold text-gray-900">
              {tran_id || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Booking ID:</p>
            <p className="font-mono font-bold text-gray-900">
              {bookingId || "Not provided"}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <a
            href="/user/booking"
            className="block w-full text-center bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700"
          >
            Go to My Bookings
          </a>
        </div>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Loading...</p>
    </div>
  );
}
