'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, User, Phone, Mail, MapPin, DollarSign,
  CheckCircle, XCircle, Clock, AlertCircle, FileText,
  Filter, Search, Eye, Briefcase
} from 'lucide-react';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [actionModal, setActionModal] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    payment_completed: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, statusFilter, bookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setBookings(data.data);
        setFilteredBookings(data.data);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.bookingStatus === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(b =>
        b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customerPhone.includes(searchQuery)
      );
    }

    setFilteredBookings(filtered);
  };

  const handleApproveReject = async (action) => {
    if (action === 'reject' && !rejectionReason.trim()) {
      alert('❌ Please provide rejection reason');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const adminData = JSON.parse(localStorage.getItem('adminData'));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/admin/bookings/${selectedBooking._id}/approve`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            action,
            rejectionReason: action === 'reject' ? rejectionReason : undefined,
            adminNotes,
            adminId: adminData._id
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        alert(`✅ Booking ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
        fetchBookings();
        setShowDetails(false);
        setActionModal(null);
        setRejectionReason('');
        setAdminNotes('');
      } else {
        alert('❌ ' + data.message);
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('❌ Failed to update booking');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-700', icon: Clock, label: 'Pending' },
      approved: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Approved' },
      payment_completed: { color: 'bg-teal-100 text-teal-700', icon: CheckCircle, label: 'Payment Done' },
      confirmed: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Confirmed' },
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `৳${amount?.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <p className="text-sm text-blue-600 mb-1">Total Bookings</p>
          <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <p className="text-sm text-yellow-600 mb-1">Pending</p>
          <p className="text-3xl font-bold text-yellow-700">{stats.pending}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <p className="text-sm text-green-600 mb-1">Approved</p>
          <p className="text-3xl font-bold text-green-700">{stats.approved}</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
          <p className="text-sm text-purple-600 mb-1">Completed</p>
          <p className="text-3xl font-bold text-purple-700">{stats.completed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by customer name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="payment_completed">Payment Completed</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Vendor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Service</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Event Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
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

                    {/* 🎯 VENDOR CONTACT INFORMATION */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <Briefcase size={20} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{booking.vendor?.buisnessName}</p>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone size={12} />
                            <span>{booking.vendor?.phone}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500 truncate max-w-[180px]">
                            <Mail size={12} />
                            <span>{booking.vendor?.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{booking.service?.companyName}</p>
                      <p className="text-sm text-gray-600">{booking.selectedPackage?.name}</p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar size={16} className="text-cyan-600" />
                        <span className="font-medium">{formatDate(booking.eventDate)}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{formatCurrency(booking.totalPrice)}</p>
                      <p className="text-xs text-green-600">Advance: {formatCurrency(booking.advancePayment)}</p>
                    </td>

                    <td className="px-6 py-4">
                      {getStatusBadge(booking.bookingStatus)}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowDetails(true);
                        }}
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
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Booking Details</h2>
                <p className="text-cyan-100 text-sm mt-1">ID: {selectedBooking._id}</p>
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
              <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                <span className="text-gray-700 font-medium">Current Status:</span>
                {getStatusBadge(selectedBooking.bookingStatus)}
              </div>

              {/* 🎯 VENDOR CONTACT INFO - Prominent Display */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="text-purple-600" size={24} />
                  Vendor Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded-lg p-4">
                  <div>
                    <label className="text-sm text-gray-600">Business Name</label>
                    <p className="font-semibold text-gray-900 text-lg">{selectedBooking.vendor?.buisnessName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Service Type</label>
                    <p className="font-semibold text-gray-900">{selectedBooking.vendor?.service}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Phone Number</label>
                    <a 
                      href={`tel:${selectedBooking.vendor?.phone}`}
                      className="font-bold text-cyan-600 hover:text-cyan-700 text-lg flex items-center gap-2"
                    >
                      <Phone size={18} />
                      {selectedBooking.vendor?.phone}
                    </a>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email Address</label>
                    <a 
                      href={`mailto:${selectedBooking.vendor?.email}`}
                      className="font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-2"
                    >
                      <Mail size={18} />
                      {selectedBooking.vendor?.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="text-cyan-600" size={20} />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
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

              {/* Package & Payment */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <DollarSign className="text-cyan-600" size={20} />
                  Package & Payment
                </h3>
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-4">
                  <p className="font-bold text-cyan-900 text-lg mb-2">{selectedBooking.selectedPackage?.name}</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Total</label>
                      <p className="text-xl font-bold text-gray-900">{formatCurrency(selectedBooking.totalPrice)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Advance (10%)</label>
                      <p className="text-xl font-bold text-green-700">{formatCurrency(selectedBooking.advancePayment)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Remaining (90%)</label>
                      <p className="text-xl font-bold text-orange-700">{formatCurrency(selectedBooking.remainingPayment)}</p>
                    </div>
                  </div>
                </div>
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

              {/* Action Buttons */}
              {selectedBooking.bookingStatus === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setActionModal('approve')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20} />
                    Approve Booking
                  </button>
                  <button
                    onClick={() => setActionModal('reject')}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle size={20} />
                    Reject Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {actionModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {actionModal === 'approve' ? 'Approve Booking' : 'Reject Booking'}
            </h3>

            <div className="space-y-4">
              {actionModal === 'reject' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason *
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                    placeholder="Provide reason for rejection..."
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes (Optional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                  placeholder="Internal notes..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setActionModal(null);
                  setRejectionReason('');
                  setAdminNotes('');
                }}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApproveReject(actionModal)}
                className={`flex-1 px-6 py-3 text-white rounded-lg font-semibold transition-colors ${
                  actionModal === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionModal === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}