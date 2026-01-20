'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminDashboardLayout from '../layout';
import {
  Users, Briefcase, Calendar, DollarSign, TrendingUp,
  CheckCircle, Clock, XCircle, AlertCircle, ArrowUp, ArrowDown, Loader2
} from 'lucide-react';

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, bgColor }) => {
  const isPositive = trend === 'up';
  
  return (
    <div className={`${bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center shadow-md`}>
          <Icon size={28} className="text-white" />
        </div>
        {trendValue && (
          <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            <span className="text-sm font-semibold">{trendValue}%</span>
          </div>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

// Recent Booking Card
const RecentBookingCard = ({ booking, onApprove }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">{booking.service?.companyName}</h4>
          <p className="text-sm text-gray-600">{booking.user?.name}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(booking.eventDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            booking.bookingStatus === 'pending' 
              ? 'bg-yellow-100 text-yellow-800'
              : booking.bookingStatus === 'approved'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {booking.bookingStatus}
          </span>
          <p className="text-sm font-bold text-gray-900">৳{booking.totalPrice.toLocaleString()}</p>
        </div>
      </div>
      
      {booking.bookingStatus === 'pending' && (
        <button
          onClick={() => onApprove(booking._id)}
          className="w-full mt-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold py-2 rounded-lg transition-all"
        >
          Review Booking
        </button>
      )}
    </div>
  );
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Fetch analytics error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveBooking = (bookingId) => {
    router.push(`/admin/bookings/${bookingId}`);
  };

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-600" />
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Vendors"
            value={analytics?.overview?.totalVendors || 0}
            icon={Briefcase}
            trend="up"
            trendValue="12"
            color="bg-gradient-to-br from-cyan-600 to-blue-600"
            bgColor="bg-white"
          />
          <StatCard
            title="Total Users"
            value={analytics?.overview?.totalUsers || 0}
            icon={Users}
            trend="up"
            trendValue="8"
            color="bg-gradient-to-br from-purple-600 to-pink-600"
            bgColor="bg-white"
          />
          <StatCard
            title="Total Bookings"
            value={analytics?.overview?.totalBookings || 0}
            icon={Calendar}
            trend="up"
            trendValue="15"
            color="bg-gradient-to-br from-green-600 to-emerald-600"
            bgColor="bg-white"
          />
          <StatCard
            title="Revenue (Advance)"
            value={`৳${(analytics?.overview?.totalRevenue || 0).toLocaleString()}`}
            icon={DollarSign}
            trend="up"
            trendValue="23"
            color="bg-gradient-to-br from-orange-600 to-red-600"
            bgColor="bg-white"
          />
        </div>

        {/* Pending Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Bookings */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                <Clock size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Pending Bookings</h3>
                <p className="text-sm text-gray-600">Need approval</p>
              </div>
            </div>
            <p className="text-4xl font-bold text-yellow-700">{analytics?.bookings?.pending || 0}</p>
            <button
              onClick={() => router.push('/admin/bookings?status=pending')}
              className="w-full mt-4 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded-lg transition-all"
            >
              Review Now
            </button>
          </div>

          {/* Pending Vendors */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <AlertCircle size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Pending Vendors</h3>
                <p className="text-sm text-gray-600">Need verification</p>
              </div>
            </div>
            <p className="text-4xl font-bold text-blue-700">{analytics?.vendors?.pending || 0}</p>
            <button
              onClick={() => router.push('/admin/vendors?status=pending')}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
            >
              Verify Now
            </button>
          </div>

          {/* Completed Bookings */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <CheckCircle size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Completed</h3>
                <p className="text-sm text-gray-600">Successful bookings</p>
              </div>
            </div>
            <p className="text-4xl font-bold text-green-700">{analytics?.bookings?.completed || 0}</p>
            <button
              onClick={() => router.push('/admin/bookings?status=completed')}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all"
            >
              View All
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Bookings</h3>
              <button
                onClick={() => router.push('/admin/bookings')}
                className="text-cyan-600 hover:text-cyan-700 text-sm font-semibold"
              >
                View All →
              </button>
            </div>
            <div className="space-y-3">
              {analytics?.recentBookings?.slice(0, 5).map((booking) => (
                <RecentBookingCard
                  key={booking._id}
                  booking={booking}
                  onApprove={handleApproveBooking}
                />
              ))}
            </div>
          </div>

          {/* Service Categories Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Service Categories</h3>
            <div className="space-y-4">
              {analytics?.serviceCategoryStats?.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{stat._id}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 h-2 rounded-full"
                        style={{ width: `${(stat.count / analytics.overview.totalServices) * 100}%` }}
                      />
                    </div>
                    <span className="text-gray-900 font-bold w-8">{stat.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-6 shadow-xl">
          <h3 className="text-white text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/admin/bookings?status=pending')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-4 rounded-xl transition-all border border-white/20"
            >
              Approve Bookings
            </button>
            <button
              onClick={() => router.push('/admin/vendors?status=pending')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-4 rounded-xl transition-all border border-white/20"
            >
              Verify Vendors
            </button>
            <button
              onClick={() => router.push('/admin/users')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-4 rounded-xl transition-all border border-white/20"
            >
              Manage Users
            </button>
            <button
              onClick={() => router.push('/admin/analytics')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-4 rounded-xl transition-all border border-white/20"
            >
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}