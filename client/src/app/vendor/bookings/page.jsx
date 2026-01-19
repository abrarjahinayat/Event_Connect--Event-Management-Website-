'use client';

import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-600 mt-1">Manage your service bookings</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <Calendar className="mx-auto text-gray-400 mb-4" size={64} />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Bookings Coming Soon</h3>
        <p className="text-gray-600">
          Manage and track all your service bookings in one place
        </p>
      </div>
    </div>
  );
}