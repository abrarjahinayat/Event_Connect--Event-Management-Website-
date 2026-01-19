'use client';

import { Star } from 'lucide-react';

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-600 mt-1">View and manage customer reviews</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <Star className="mx-auto text-gray-400 mb-4" size={64} />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Reviews Coming Soon</h3>
        <p className="text-gray-600">
          View and respond to customer reviews
        </p>
      </div>
    </div>
  );
}