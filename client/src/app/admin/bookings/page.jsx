'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminDashboardLayout from '../layout';
import {
  Calendar, MapPin, DollarSign, User, Briefcase, Clock,
  CheckCircle, XCircle, Eye, Filter, Search, Loader2, Phone, Mail
} from 'lucide-react';

// Status Badge Component
const StatusBadge = ({ status }) => {
  const config = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
    approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
    payment_completed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Paid' },
    confirmed: { bg: 'bg-cyan-100', text: 'text-cyan-800', label: 'Confirmed' },
    completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
  };

  const c = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
};

// Booking Card Component
const BookingCard = ({ booking, onViewDetails, onQuickApprove }) => {
  const isPending = booking.bookingStatus === 'pending';

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {booking.service?.companyName}
          </h3>
          <p className="text-sm text-gray-600">{booking.service?.serviceCategory}</p>
        </div>
        <StatusBadge status={booking.bookingStatus} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Customer</p>
            <p className="text-sm font-semibold text-gray-900">{booking.customerName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Event Date</p>
            <p className="text-sm font-semibold text-gray-900">
              {new Date(booking.eventDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Location</p>
            <p className="text-sm font-semibold text-gray-900">{booking.eventCity}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Total Price</p>
            <p className="text-sm font-semibold text-gray-900">৳{booking.totalPrice.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onViewDetails(booking)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>

        {isPending && (
          <button
            onClick={() => onQuickApprove(booking)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            Approve
          </button>
        )}
      </div>
    </div>
  );
};

// Booking Details Modal
const BookingDetailsModal = ({ booking, onClose, onApprove, onReject }) => {
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    await onApprove(booking._id, adminNotes);
    setLoading(false);
  };

  const handleReject = async () => {
    if (!rejectionReason) {
      alert('Please provide a rejection reason');
      return;
    }
    setLoading(true);
    await onReject(booking._id, rejectionReason, adminNotes);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Status</p>
            <StatusBadge status={booking.bookingStatus} />
          </div>

          {/* Customer & Service Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Customer Details</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-sm"><span className="font-semibold">Name:</span> {booking.customerName}</p>
                <p className="text-sm"><span className="font-semibold">Email:</span> {booking.customerEmail}</p>
                <p className="text-sm"><span className="font-semibold">Phone:</span> {booking.customerPhone}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Service Details</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-sm"><span className="font-semibold">Company:</span> {booking.service?.companyName}</p>
                <p className="text-sm"><span className="font-semibold">Category:</span> {booking.service?.serviceCategory}</p>
                <p className="text-sm"><span className="font-semibold">Location:</span> {booking.service?.location}</p>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Event Information</h3>
            <div className="bg-cyan-50 rounded-lg p-4 space-y-2">
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

          {/* Package & Pricing */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Package & Pricing</h3>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <p className="font-bold text-lg text-gray-900 mb-2">{booking.selectedPackage?.name}</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Package Price:</span>
                  <span className="font-bold">৳{booking.packagePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Advance (10%):</span>
                  <span className="font-bold">৳{booking.advancePayment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Remaining:</span>
                  <span className="font-bold">৳{booking.remainingPayment.toLocaleString()}</span>
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

          {/* Admin Actions (if pending) */}
          {booking.bookingStatus === 'pending' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Admin Notes (Optional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                  placeholder="Add notes for your records..."
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rejection Reason (Required for rejection)
                  </label>
                  <input
                    type="text"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="e.g., Service not available on this date"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg transition-all disabled:opacity-50"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve Booking
                </button>
                <button
                  onClick={handleReject}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-lg transition-all disabled:opacity-50"
                >
                  <XCircle className="w-5 h-5" />
                  Reject Booking
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AdminBookingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get('status') || 'all';

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(statusFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');

      const url = filter === 'all'
        ? `${process.env.NEXT_PUBLIC_API}/admin/bookings`
        : `${process.env.NEXT_PUBLIC_API}/admin/bookings?bookingStatus=${filter}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setBookings(data.data);
      }
    } catch (error) {
      console.error('Fetch bookings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveBooking = async (bookingId, adminNotes) => {
    try {
      const token = localStorage.getItem('adminToken');
      const adminData = JSON.parse(localStorage.getItem('adminData'));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/admin/bookings/${bookingId}/approve`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            approved: true,
            adminNotes,
            adminId: adminData._id
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('✅ Booking approved successfully!');
        setSelectedBooking(null);
        fetchBookings();
      } else {
        alert('❌ ' + data.message);
      }
    } catch (error) {
      console.error('Approve error:', error);
      alert('❌ Failed to approve booking');
    }
  };

  const handleRejectBooking = async (bookingId, rejectionReason, adminNotes) => {
    try {
      const token = localStorage.getItem('adminToken');
      const adminData = JSON.parse(localStorage.getItem('adminData'));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/admin/bookings/${bookingId}/approve`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            approved: false,
            rejectionReason,
            adminNotes,
            adminId: adminData._id
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('Booking rejected');
        setSelectedBooking(null);
        fetchBookings();
      } else {
        alert('❌ ' + data.message);
      }
    } catch (error) {
      console.error('Reject error:', error);
      alert('❌ Failed to reject booking');
    }
  };

  const filteredBookings = bookings.filter(booking =>
    booking.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.service?.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by customer or service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-semibold"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="payment_completed">Paid</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl p-6 text-white">
          <p className="text-cyan-100 mb-1">Showing {filteredBookings.length} bookings</p>
          <p className="text-2xl font-bold">Bookings Management</p>
        </div>

        {/* Bookings Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-12 h-12 animate-spin text-cyan-600" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Bookings Found</h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onViewDetails={setSelectedBooking}
                onQuickApprove={setSelectedBooking}
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
          onApprove={handleApproveBooking}
          onReject={handleRejectBooking}
        />
      )}
    </AdminDashboardLayout>
  );
}