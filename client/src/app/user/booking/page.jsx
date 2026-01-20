'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Phone,
  Mail,
  AlertCircle,
  CreditCard,
  Eye,
  X,
} from 'lucide-react';

// Booking Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Review' },
    admin_reviewing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Under Review' },
    approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved - Pay Now' },
    payment_pending: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Payment Pending' },
    payment_completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Payment Completed' },
    confirmed: { bg: 'bg-cyan-100', text: 'text-cyan-800', label: 'Confirmed' },
    vendor_contacted: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Vendor Contacted' },
    in_progress: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Progress' },
    completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

// Booking Card Component
const BookingCard = ({ booking, onViewDetails, onPay, onCancel }) => {
  const canPay = booking.bookingStatus === 'approved' && !booking.payment.advancePaid;
  const canCancel = ['pending', 'approved', 'admin_reviewing'].includes(booking.bookingStatus);
  const canViewContact = booking.vendorContactShared && booking.payment.advancePaid;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {booking.service?.companyName || 'Service Name'}
            </h3>
            <p className="text-sm text-gray-600">{booking.service?.serviceCategory || 'Event Service'}</p>
          </div>
          <div className="flex-shrink-0">
            <StatusBadge status={booking.bookingStatus} />
          </div>
        </div>

        {/* Service Image */}
        {booking.service?.image && booking.service.image[0] && (
          <img
            src={booking.service.image[0]}
            alt={booking.service.companyName}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-start gap-2">
            <Calendar className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Event Date</p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(booking.eventDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="text-sm font-semibold text-gray-900">{booking.eventCity}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <DollarSign className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Package</p>
              <p className="text-sm font-semibold text-gray-900">{booking.selectedPackage?.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Requested</p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(booking.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Total Price:</span>
            <span className="text-lg font-bold text-gray-900">৳{booking.totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Advance Payment (10%):</span>
            <span className={`text-lg font-bold ${booking.payment.advancePaid ? 'text-green-600' : 'text-orange-600'}`}>
              ৳{booking.advancePayment.toLocaleString()}
              {booking.payment.advancePaid && ' ✓'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Remaining:</span>
            <span className="text-sm font-semibold text-gray-700">৳{booking.remainingPayment.toLocaleString()}</span>
          </div>
        </div>

        {/* Vendor Contact (Only if paid) */}
        {canViewContact && booking.vendor && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-green-800 mb-2">Vendor Contact Details:</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-green-700">
                <Phone className="w-4 h-4" />
                <span>{booking.vendor.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-700">
                <Mail className="w-4 h-4" />
                <span>{booking.vendor.email}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(booking)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>

          {canPay && (
            <button
              onClick={() => onPay(booking)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-all"
            >
              <CreditCard className="w-4 h-4" />
              Pay Now
            </button>
          )}

          {canCancel && (
            <button
              onClick={() => onCancel(booking)}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-semibold transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Booking Details Modal Component
const BookingDetailsModal = ({ booking, onClose }) => {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Current Status</p>
            <StatusBadge status={booking.bookingStatus} />
          </div>

          {/* Service Details */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Service Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm"><span className="font-semibold">Company:</span> {booking.service?.companyName}</p>
              <p className="text-sm"><span className="font-semibold">Category:</span> {booking.service?.serviceCategory}</p>
              <p className="text-sm"><span className="font-semibold">Location:</span> {booking.service?.location}</p>
            </div>
          </div>

          {/* Customer Details */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm"><span className="font-semibold">Name:</span> {booking.customerName}</p>
              <p className="text-sm"><span className="font-semibold">Email:</span> {booking.customerEmail}</p>
              <p className="text-sm"><span className="font-semibold">Phone:</span> {booking.customerPhone}</p>
            </div>
          </div>

          {/* Event Details */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Event Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm">
                <span className="font-semibold">Date:</span>{' '}
                {new Date(booking.eventDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="text-sm"><span className="font-semibold">Address:</span> {booking.eventAddress}</p>
              <p className="text-sm"><span className="font-semibold">City:</span> {booking.eventCity}</p>
            </div>
          </div>

          {/* Package Details */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Package Details</h3>
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
              <p className="font-bold text-lg text-cyan-900 mb-2">{booking.selectedPackage?.name}</p>
              <ul className="space-y-1 mb-3">
                {booking.selectedPackage?.features?.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="border-t border-cyan-200 pt-3 space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Package Price:</span>
                  <span className="font-bold text-gray-900">৳{booking.packagePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Advance (10%):</span>
                  <span className="font-bold text-orange-600">৳{booking.advancePayment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Remaining:</span>
                  <span className="font-bold text-gray-700">৳{booking.remainingPayment.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {booking.specialRequests && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Special Requests</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">{booking.specialRequests}</p>
              </div>
            </div>
          )}

          {/* Payment Status */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Payment Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Advance Payment:</span>
                <span className={`font-semibold ${booking.payment.advancePaid ? 'text-green-600' : 'text-orange-600'}`}>
                  {booking.payment.advancePaid ? '✓ Paid' : '✗ Pending'}
                </span>
              </div>
              {booking.payment.transactionId && (
                <p className="text-xs text-gray-500">
                  Transaction ID: {booking.payment.transactionId}
                </p>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Timeline</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-cyan-600 rounded-full"></div>
                <span className="text-gray-600">Requested on:</span>
                <span className="font-semibold">{new Date(booking.createdAt).toLocaleString()}</span>
              </div>
              {booking.payment.advancePaidAt && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-600">Payment completed:</span>
                  <span className="font-semibold">{new Date(booking.payment.advancePaidAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Main User Bookings Page
export default function UserBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('userData');
    const userToken = localStorage.getItem('userToken');

    if (!userData || !userToken) {
      alert('❌ Please login to view your bookings');
      router.push('/user/login');
      return;
    }

    setUser(JSON.parse(userData));
  }, []);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const url = filter === 'all'
        ? `${process.env.NEXT_PUBLIC_API}/booking/my-bookings/${user._id || user.id}`
        : `${process.env.NEXT_PUBLIC_API}/booking/my-bookings/${user._id || user.id}?status=${filter}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setBookings(data.data);
      } else {
        console.error('Failed to fetch bookings:', data.message);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async (booking) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/booking/initiate-payment/${booking._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.success && data.paymentUrl) {
        // Redirect to payment gateway
        window.location.href = data.paymentUrl;
      } else {
        alert('❌ Failed to initiate payment: ' + data.message);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('❌ Failed to initiate payment. Please try again.');
    }
  };

  const handleCancelBooking = async (booking) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    const reason = prompt('Please provide a reason for cancellation (optional):');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/booking/cancel/${booking._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cancellationReason: reason || 'No reason provided',
            cancelledBy: 'user',
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('✅ Booking cancelled successfully');
        fetchBookings(); // Refresh list
      } else {
        alert('❌ Failed to cancel booking: ' + data.message);
      }
    } catch (error) {
      console.error('Cancel error:', error);
      alert('❌ Failed to cancel booking. Please try again.');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage and track all your event bookings</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All Bookings' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'payment_completed', label: 'Paid' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === item.value
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-cyan-600" />
          </div>
        ) : bookings.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all'
                ? "You haven't made any bookings yet"
                : `No bookings with status: ${filter}`}
            </p>
            <button
              onClick={() => router.push('/production-houses')}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-all"
            >
              Browse Services
            </button>
          </div>
        ) : (
          /* Bookings Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onViewDetails={setSelectedBooking}
                onPay={handlePayNow}
                onCancel={handleCancelBooking}
              />
            ))}
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}