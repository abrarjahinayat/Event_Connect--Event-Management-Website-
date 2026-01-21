'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, User, Phone, Mail, MapPin, DollarSign,
  CheckCircle, XCircle, Clock, AlertCircle, FileText,
  Filter, Search, Download, Eye
} from 'lucide-react';

export default function VendorBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateRange: 'all'
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    payment_completed: 0,
    confirmed: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
    rejected: 0
  });

 useEffect(() => {
  // 🎯 FIX: Check both possible localStorage keys
  let userData = localStorage.getItem('vendorData');
  
  if (!userData) {
    // Fallback to 'user' key
    userData = localStorage.getItem('user');
  }

  console.log('🔍 Checking localStorage...');
  console.log('vendorData exists:', !!localStorage.getItem('vendorData'));
  console.log('user exists:', !!localStorage.getItem('user'));

  if (!userData) {
    console.error('❌ No vendor data found in localStorage');
    window.location.href = '/login';
    return;
  }
  
  try {
    const parsedVendor = JSON.parse(userData);
    console.log('👤 Parsed vendor:', parsedVendor);
    
    const vendorId = parsedVendor._id || parsedVendor.id;
    console.log('🆔 Using vendor ID:', vendorId);

    if (!vendorId) {
      console.error('❌ No vendor ID found');
      alert('Vendor ID not found. Please login again.');
      window.location.href = '/login';
      return;
    }

    setVendor(parsedVendor);
    fetchBookings(vendorId);
  } catch (error) {
    console.error('❌ Error parsing vendor data:', error);
    alert('Session expired. Please login again.');
    window.location.href = '/login';
  }
}, []);

  useEffect(() => {
    applyFilters();
  }, [filters, bookings]);

  const fetchBookings = async (vendorId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/booking/vendor/${vendorId}`
      );

      const data = await response.json();

      if (data.success) {
        setBookings(data.data);
        setFilteredBookings(data.data);
        calculateStats(data.data);
      } else {
        console.error('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (bookingsData) => {
    const stats = {
      total: bookingsData.length,
      pending: 0,
      approved: 0,
      payment_completed: 0,
      confirmed: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
      rejected: 0
    };

    bookingsData.forEach(booking => {
      stats[booking.bookingStatus] = (stats[booking.bookingStatus] || 0) + 1;
    });

    setStats(stats);
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(b => b.bookingStatus === filters.status);
    }

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(b => 
        b.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
        b.customerEmail.toLowerCase().includes(filters.search.toLowerCase()) ||
        b.customerPhone.includes(filters.search)
      );
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      filtered = filtered.filter(b => {
        const bookingDate = new Date(b.eventDate);
        const diffDays = Math.floor((bookingDate - now) / (1000 * 60 * 60 * 24));

        switch(filters.dateRange) {
          case 'upcoming':
            return diffDays >= 0;
          case 'past':
            return diffDays < 0;
          case 'this_week':
            return diffDays >= 0 && diffDays <= 7;
          case 'this_month':
            return diffDays >= 0 && diffDays <= 30;
          default:
            return true;
        }
      });
    }

    setFilteredBookings(filtered);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-700', icon: Clock, label: 'Pending Review' },
      admin_reviewing: { color: 'bg-blue-100 text-blue-700', icon: Clock, label: 'Under Review' },
      approved: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Approved' },
      payment_pending: { color: 'bg-orange-100 text-orange-700', icon: DollarSign, label: 'Payment Pending' },
      payment_completed: { color: 'bg-teal-100 text-teal-700', icon: CheckCircle, label: 'Payment Done' },
      confirmed: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Confirmed' },
      vendor_contacted: { color: 'bg-cyan-100 text-cyan-700', icon: Phone, label: 'Contact Shared' },
      in_progress: { color: 'bg-purple-100 text-purple-700', icon: Clock, label: 'In Progress' },
      completed: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Cancelled' },
      rejected: { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
        <Icon size={16} />
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (booking) => {
    if (!booking.payment) {
      return <span className="text-gray-500 text-sm">No payment yet</span>;
    }

    const { paymentStatus, advancePaid, remainingPaid } = booking.payment;

    if (remainingPaid) {
      return <span className="text-green-600 font-semibold text-sm">✓ Fully Paid</span>;
    } else if (advancePaid) {
      return <span className="text-teal-600 font-semibold text-sm">✓ Advance Paid (10%)</span>;
    } else {
      return <span className="text-orange-600 font-semibold text-sm">⏳ Unpaid</span>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `৳${amount?.toLocaleString()}`;
  };

  const viewBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Total Bookings</h3>
            <Calendar className="opacity-80" size={24} />
          </div>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Pending</h3>
            <Clock className="opacity-80" size={24} />
          </div>
          <p className="text-3xl font-bold">{stats.pending + (stats.admin_reviewing || 0)}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Confirmed</h3>
            <CheckCircle className="opacity-80" size={24} />
          </div>
          <p className="text-3xl font-bold">
            {stats.payment_completed + stats.confirmed + (stats.vendor_contacted || 0) + stats.in_progress}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Completed</h3>
            <CheckCircle className="opacity-80" size={24} />
          </div>
          <p className="text-3xl font-bold">{stats.completed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="payment_completed">Payment Completed</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Date Range Filter */}
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value="all">All Dates</option>
            <option value="upcoming">Upcoming Events</option>
            <option value="past">Past Events</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Client</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Event Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Package</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Payment</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                          <User size={20} className="text-cyan-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{booking.customerName}</p>
                          <p className="text-sm text-gray-600">{booking.customerEmail}</p>
                          <p className="text-sm text-gray-500">{booking.customerPhone}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar size={16} className="text-cyan-600" />
                        <span className="font-medium">{formatDate(booking.eventDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <MapPin size={14} />
                        <span>{booking.eventCity}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{booking.selectedPackage?.name}</p>
                      <p className="text-sm text-gray-600">{formatCurrency(booking.selectedPackage?.price)}</p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="font-bold text-gray-900">{formatCurrency(booking.totalPrice)}</p>
                        <p className="text-xs text-green-600">
                          Advance: {formatCurrency(booking.advancePayment)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Remaining: {formatCurrency(booking.remainingPayment)}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {getPaymentStatusBadge(booking)}
                    </td>

                    <td className="px-6 py-4">
                      {getStatusBadge(booking.bookingStatus)}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => viewBookingDetails(booking)}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200 transition-colors font-semibold text-sm"
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-semibold">No bookings found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {filters.search || filters.status !== 'all' || filters.dateRange !== 'all'
                        ? 'Try adjusting your filters'
                        : 'You haven\'t received any bookings yet'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {showDetails && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Booking Details</h2>
                <p className="text-cyan-100 text-sm mt-1">Booking ID: {selectedBooking._id}</p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">Current Status:</span>
                  {getStatusBadge(selectedBooking.bookingStatus)}
                </div>
              </div>

              {/* Client Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="text-cyan-600" size={20} />
                  Client Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Name</label>
                    <p className="font-semibold text-gray-900">{selectedBooking.customerName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="font-semibold text-gray-900">{selectedBooking.customerEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Phone</label>
                    <p className="font-semibold text-gray-900">{selectedBooking.customerPhone}</p>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="text-cyan-600" size={20} />
                  Event Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Event Date</label>
                    <p className="font-semibold text-gray-900">{formatDate(selectedBooking.eventDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">City</label>
                    <p className="font-semibold text-gray-900">{selectedBooking.eventCity}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-600">Venue Address</label>
                    <p className="font-semibold text-gray-900">{selectedBooking.eventAddress}</p>
                  </div>
                </div>
              </div>

              {/* Package Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="text-cyan-600" size={20} />
                  Package Details
                </h3>
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                  <p className="font-bold text-cyan-900 text-lg mb-2">
                    {selectedBooking.selectedPackage?.name}
                  </p>
                  <p className="text-2xl font-bold text-cyan-700 mb-3">
                    {formatCurrency(selectedBooking.selectedPackage?.price)}
                  </p>
                  {selectedBooking.selectedPackage?.features && (
                    <ul className="space-y-1">
                      {selectedBooking.selectedPackage.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle size={16} className="text-cyan-600 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <DollarSign className="text-cyan-600" size={20} />
                  Payment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm text-gray-600">Total Amount</label>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(selectedBooking.totalPrice)}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <label className="text-sm text-green-600">Advance (10%)</label>
                    <p className="text-xl font-bold text-green-700">
                      {formatCurrency(selectedBooking.advancePayment)}
                    </p>
                    {selectedBooking.payment?.advancePaid && (
                      <p className="text-xs text-green-600 mt-1">✓ Paid</p>
                    )}
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <label className="text-sm text-orange-600">Remaining (90%)</label>
                    <p className="text-xl font-bold text-orange-700">
                      {formatCurrency(selectedBooking.remainingPayment)}
                    </p>
                    {selectedBooking.payment?.remainingPaid ? (
                      <p className="text-xs text-green-600 mt-1">✓ Paid</p>
                    ) : (
                      <p className="text-xs text-orange-600 mt-1">⏳ Pending</p>
                    )}
                  </div>
                </div>

                {selectedBooking.payment?.transactionId && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-3">
                    <label className="text-sm text-gray-600">Transaction ID</label>
                    <p className="font-mono text-sm text-gray-900">
                      {selectedBooking.payment.transactionId}
                    </p>
                  </div>
                )}
              </div>

              {/* Special Requests */}
              {selectedBooking.specialRequests && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Special Requests</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedBooking.specialRequests}</p>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Booking Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={16} className="text-cyan-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Booking Requested</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(selectedBooking.requestedAt || selectedBooking.createdAt)}
                      </p>
                    </div>
                  </div>

                  {selectedBooking.adminApproval?.approved && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={16} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Admin Approved</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(selectedBooking.adminApproval.approvedAt)}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedBooking.payment?.advancePaid && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <DollarSign size={16} className="text-teal-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Advance Payment Received</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(selectedBooking.payment.advancePaidAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex gap-3 border-t border-gray-200">
              <button
                onClick={() => setShowDetails(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}