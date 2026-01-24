'use client';

import React, { useState, useEffect } from 'react';
import VendorReviewsSection from './components/VendorReviewsSection';

export default function VendorReviewsPage() {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get vendor data from localStorage
    const vendorData = localStorage.getItem('vendorData');
    
    if (vendorData && vendorData !== 'undefined' && vendorData !== 'null') {
      try {
        const parsedVendor = JSON.parse(vendorData);
        console.log('📊 Vendor for reviews:', parsedVendor);
        setVendor(parsedVendor);
      } catch (error) {
        console.error('Error parsing vendor data:', error);
      }
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-12 text-center">
        <p className="text-gray-600">Unable to load vendor information</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Customer <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Reviews</span>
        </h1>
        <p className="text-gray-600 text-lg">
          See what your customers are saying about your services
        </p>
      </div>

      {/* Reviews Section Component */}
      <VendorReviewsSection vendorId={vendor._id} />
    </div>
  );
}