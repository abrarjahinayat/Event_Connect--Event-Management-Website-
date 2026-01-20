'use client';

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Mail, Phone, MapPin, Calendar, Trash2, Eye, Search,
  CheckCircle, XCircle, Clock, FileText, Star, Shield, Loader2,
  AlertCircle, Download, Image as ImageIcon, X
} from 'lucide-react';

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [verificationAction, setVerificationAction] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [stats, setStats] = useState({
    totalVendors: 0,
    verified: 0,
    pending: 0,
    underReview: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, statusFilter, vendors]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/vendors`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setVendors(data.data);
        setFilteredVendors(data.data);
        setStats(data.stats);
      } else {
        console.error('Failed to fetch vendors');
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...vendors];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(v => v.verificationStatus === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(vendor =>
        vendor.buisnessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.phone?.includes(searchQuery) ||
        vendor.businessRegistrationNumber?.includes(searchQuery)
      );
    }

    setFilteredVendors(filtered);
  };

  const viewVendorDetails = async (vendorId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/vendors/${vendorId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setSelectedVendor(data.data);
        setShowDetails(true);
      }
    } catch (error) {
      console.error('Error fetching vendor details:', error);
    }
  };

  const handleVerifyVendor = async (action) => {
    try {
      if (action === 'reject' && !rejectionReason.trim()) {
        alert('❌ Please provide a rejection reason');
        return;
      }

      const token = localStorage.getItem('adminToken');
      const adminData = JSON.parse(localStorage.getItem('adminData'));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/admin/vendors/${selectedVendor.vendor._id}/verify`,
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
        alert(`✅ Vendor ${action === 'approve' ? 'verified' : 'rejected'} successfully`);
        fetchVendors();
        setShowDetails(false);
        setVerificationAction(null);
        setRejectionReason('');
        setAdminNotes('');
      } else {
        alert('❌ ' + data.message);
      }
    } catch (error) {
      console.error('Error verifying vendor:', error);
      alert('❌ Failed to update vendor status');
    }
  };

  const handleDeleteVendor = async (vendorId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/vendors/${vendorId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Vendor and associated services deleted successfully');
        fetchVendors();
        setDeleteConfirm(null);
      } else {
        alert('❌ ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting vendor:', error);
      alert('❌ Failed to delete vendor');
    }
  };

  const handleDeleteService = async (vendorId, serviceId) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/admin/vendors/${vendorId}/services/${serviceId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('✅ Service deleted successfully');
        viewVendorDetails(vendorId); // Refresh vendor details
      } else {
        alert('❌ ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('❌ Failed to delete service');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Verified: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
      Pending: { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
      'Under Review': { color: 'bg-blue-100 text-blue-700', icon: Clock },
      Rejected: { color: 'bg-red-100 text-red-700', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig.Pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
        <Icon size={16} />
        {status}
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-cyan-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Total</h3>
            <Briefcase className="opacity-80" size={24} />
          </div>
          <p className="text-3xl font-bold">{stats.totalVendors}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Verified</h3>
            <CheckCircle className="opacity-80" size={24} />
          </div>
          <p className="text-3xl font-bold">{stats.verified}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Pending</h3>
            <Clock className="opacity-80" size={24} />
          </div>
          <p className="text-3xl font-bold">{stats.pending}</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Under Review</h3>
            <Clock className="opacity-80" size={24} />
          </div>
          <p className="text-3xl font-bold">{stats.underReview}</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Rejected</h3>
            <XCircle className="opacity-80" size={24} />
          </div>
          <p className="text-3xl font-bold">{stats.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, phone, or registration number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Verified">Verified</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Business</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Services</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Joined</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVendors.length > 0 ? (
                filteredVendors.map((vendor) => (
                  <tr key={vendor._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                          <Briefcase size={20} className="text-cyan-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{vendor.buisnessName}</p>
                          <p className="text-xs text-gray-500">{vendor.service}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={14} />
                          <span className="truncate max-w-[200px]">{vendor.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} />
                          <span>{vendor.phone}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-900">{vendor.serviceCount || 0}</p>
                        <p className="text-xs text-gray-500">{vendor.bookingCount || 0} bookings</p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {getStatusBadge(vendor.verificationStatus)}
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {formatDate(vendor.createdAt)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => viewVendorDetails(vendor._id)}
                          className="p-2 bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200 transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={() => setDeleteConfirm(vendor)}
                          className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          title="Delete Vendor"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-semibold">No vendors found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vendor Details Modal */}
      {showDetails && selectedVendor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-5xl w-full max-h-[95vh] overflow-y-auto my-8">
            <div className="sticky top-0 bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold">{selectedVendor.vendor.buisnessName}</h2>
                <p className="text-cyan-100 text-sm mt-1">Vendor Verification & Details</p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Verification Documents */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="text-purple-600" size={24} />
                  Verification Documents
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Business Registration Number */}
                  <div className="bg-white rounded-lg p-4">
                    <label className="text-sm text-gray-600">Business Registration Number</label>
                    <p className="font-mono text-lg font-bold text-gray-900 mt-1">
                      {selectedVendor.vendor.businessRegistrationNumber}
                    </p>
                  </div>

                  {/* Owner National ID */}
                  <div className="bg-white rounded-lg p-4">
                    <label className="text-sm text-gray-600">Owner National ID</label>
                    <p className="font-mono text-lg font-bold text-gray-900 mt-1">
                      {selectedVendor.vendor.ownerNationalId}
                    </p>
                  </div>

                  {/* Trade License */}
                  {selectedVendor.vendor.verificationDocuments?.tradeLicense && (
                    <div className="bg-white rounded-lg p-4">
                      <label className="text-sm text-gray-600 mb-2 block">Trade License</label>
                      <a
                        href={selectedVendor.vendor.verificationDocuments.tradeLicense}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold"
                      >
                        <FileText size={20} />
                        View Document
                        <Download size={16} />
                      </a>
                      <img
                        src={selectedVendor.vendor.verificationDocuments.tradeLicense}
                        alt="Trade License"
                        className="mt-3 w-full h-48 object-contain border border-gray-200 rounded-lg"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}

                  {/* NID Document */}
                  {selectedVendor.vendor.verificationDocuments?.nidDocument && (
                    <div className="bg-white rounded-lg p-4">
                      <label className="text-sm text-gray-600 mb-2 block">NID Document</label>
                      <a
                        href={selectedVendor.vendor.verificationDocuments.nidDocument}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold"
                      >
                        <FileText size={20} />
                        View Document
                        <Download size={16} />
                      </a>
                      <img
                        src={selectedVendor.vendor.verificationDocuments.nidDocument}
                        alt="NID Document"
                        className="mt-3 w-full h-48 object-contain border border-gray-200 rounded-lg"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>

                {/* Verification Actions */}
                {selectedVendor.vendor.verificationStatus !== 'Verified' && (
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setVerificationAction('approve')}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={20} />
                      Approve Vendor
                    </button>
                    <button
                      onClick={() => setVerificationAction('reject')}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle size={20} />
                      Reject Vendor
                    </button>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="font-semibold text-gray-900">{selectedVendor.vendor.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Phone</label>
                    <p className="font-semibold text-gray-900">{selectedVendor.vendor.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Service Type</label>
                    <p className="font-semibold text-gray-900">{selectedVendor.vendor.service}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Joined</label>
                    <p className="font-semibold text-gray-900">{formatDate(selectedVendor.vendor.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedVendor.stats.totalServices}</p>
                    <p className="text-sm text-gray-600">Services</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">{selectedVendor.stats.totalBookings}</p>
                    <p className="text-sm text-gray-600">Bookings</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600">{selectedVendor.stats.completedBookings}</p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      ৳{Math.round(selectedVendor.stats.revenue.total).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Revenue</p>
                  </div>
                </div>
              </div>

              {/* Services */}
              {selectedVendor.services.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Services</h3>
                  <div className="space-y-3">
                    {selectedVendor.services.map((service) => (
                      <div key={service._id} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{service.companyName}</p>
                          <p className="text-sm text-gray-600">{service.serviceCategory}</p>
                          <p className="text-sm text-gray-500">Starting at ৳{service.startingPrice?.toLocaleString()}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteService(selectedVendor.vendor._id, service._id)}
                          className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Verification Action Modal */}
      {verificationAction && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {verificationAction === 'approve' ? 'Approve Vendor' : 'Reject Vendor'}
            </h3>

            <div className="space-y-4">
              {verificationAction === 'reject' && (
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
                  setVerificationAction(null);
                  setRejectionReason('');
                  setAdminNotes('');
                }}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerifyVendor(verificationAction)}
                className={`flex-1 px-6 py-3 text-white rounded-lg font-semibold transition-colors ${
                  verificationAction === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {verificationAction === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete Vendor</h3>
                <p className="text-sm text-gray-600">This will delete all associated services</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                Are you sure you want to delete <strong>{deleteConfirm.buisnessName}</strong>?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteVendor(deleteConfirm._id)}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}