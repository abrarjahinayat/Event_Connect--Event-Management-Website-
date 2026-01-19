'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function UpdateAvailabilityPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [serviceName, setServiceName] = useState('');
  const [availability, setAvailability] = useState('Available');

  // Fetch current availability
  useEffect(() => {
    fetchServiceData();
  }, [serviceId]);

  const fetchServiceData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/services/${serviceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setServiceName(result.data.companyName);
        setAvailability(result.data.availability || 'Available');
      } else {
        setError('Failed to fetch service data');
      }
    } catch (err) {
      console.error('Error fetching service:', err);
      setError('Error loading service data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      
      console.log('🔄 Updating availability to:', availability);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          availability: availability
        })
      });

      console.log('📥 Response status:', response.status);
      const result = await response.json();
      console.log('📥 Response data:', result);

      if (result.success) {
        setSuccessMessage('Availability updated successfully!');
        setTimeout(() => {
          router.push('/vendor/services');
        }, 1500);
      } else {
        setError(result.message || 'Failed to update availability');
      }
    } catch (err) {
      console.error('❌ Error:', err);
      setError('Error updating availability. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => router.push('/vendor/services')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Update Availability</h1>
        <p className="text-gray-600 mt-1">{serviceName}</p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-800">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Simple Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Availability Status
            </label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg"
            >
              <option value="Available">✅ Available - Accepting Bookings</option>
              <option value="Busy">⏳ Busy - Limited Availability</option>
              <option value="Unavailable">❌ Unavailable - Not Accepting Bookings</option>
            </select>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Current Status:</strong> 
              <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${
                availability === 'Available' ? 'bg-green-100 text-green-700' :
                availability === 'Busy' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {availability}
              </span>
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Update Availability
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => router.push('/vendor/services')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}