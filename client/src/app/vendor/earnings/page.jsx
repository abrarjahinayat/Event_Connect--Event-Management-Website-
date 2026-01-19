'use client';

import { DollarSign } from 'lucide-react';

export default function EarningsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
        <p className="text-gray-600 mt-1">Track your revenue and payouts</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <DollarSign className="mx-auto text-gray-400 mb-4" size={64} />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Earnings Coming Soon</h3>
        <p className="text-gray-600">
          Track your earnings and financial performance
        </p>
      </div>
    </div>
  );
}