'use client';

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Calendar, Star, DollarSign, TrendingUp, 
  Users, CheckCircle, Clock, Eye, Shield, Award, AlertCircle, XCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const DashboardOverview = () => {
  const router = useRouter();
  const [vendorInfo, setVendorInfo] = useState(null);
  const [stats, setStats] = useState({
    totalServices: 0,
    activeBookings: 0,
    totalEarnings: 0,
    avgRating: 0,
    totalReviews: 0,
    pendingBookings: 0
  });
  const [recentServices, setRecentServices] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('vendorData') || localStorage.getItem('user');
      const user = JSON.parse(userData);

      console.log('👤 Vendor user data:', user);

      // Store vendor info for verification status and admin rating
      setVendorInfo(user);

      // Fetch vendor's services
      const servicesResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API}/services/vendor/${user._id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const servicesData = await servicesResponse.json();

      if (servicesData.success) {
        const services = servicesData.data;
        
        // Calculate stats
        const totalEarnings = services.reduce((sum, service) => 
          sum + (service.totalBookings || 0) * (service.startingPrice || 0), 0
        );
        
        const totalReviews = services.reduce((sum, service) => 
          sum + (service.reviewCount || 0), 0
        );
        
        const avgRating = services.length > 0
          ? services.reduce((sum, service) => sum + (service.rating || 0), 0) / services.length
          : 0;

        setStats({
          totalServices: services.length,
          activeBookings: services.filter((s) => s.available).length,
          totalEarnings,
          avgRating: avgRating.toFixed(1),
          totalReviews,
          pendingBookings: 0 // Will be updated when you implement bookings
        });

        setRecentServices(services.slice(0, 5));
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  // Helper function to get admin rating
  const getAdminRating = () => {
    if (!vendorInfo?.adminRating) return 0;
    if (typeof vendorInfo.adminRating === 'object') {
      return vendorInfo.adminRating.rating || 0;
    }
    return vendorInfo.adminRating || 0;
  };

  // Get verification status badge
  const getVerificationBadge = () => {
    const status = vendorInfo?.verificationStatus || 'Pending';
    
    const statusConfig = {
      'Verified': {
        color: 'bg-green-100 border-green-300 text-green-800',
        icon: CheckCircle,
        message: 'Your account is verified!'
      },
      'Pending': {
        color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
        icon: Clock,
        message: 'Verification pending - Admin review in progress'
      },
      'Under Review': {
        color: 'bg-blue-100 border-blue-300 text-blue-800',
        icon: Clock,
        message: 'Documents under review by admin team'
      },
      'Rejected': {
        color: 'bg-red-100 border-red-300 text-red-800',
        icon: XCircle,
        message: vendorInfo?.rejectionReason || 'Verification rejected'
      }
    };

    return statusConfig[status] || statusConfig['Pending'];
  };

  const adminRating = getAdminRating();
  const verificationBadge = getVerificationBadge();
  const VerificationIcon = verificationBadge.icon;

  const statCards = [
    {
      title: 'Total Services',
      value: stats.totalServices,
      icon: Briefcase,
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Bookings',
      value: stats.activeBookings,
      icon: Calendar,
      color: 'bg-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Earnings',
      value: `৳${stats.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Average Rating',
      value: stats.avgRating,
      icon: Star,
      color: 'bg-purple-500',
      textColor: 'text-purple-500',
      bgColor: 'bg-purple-50',
      suffix: '/ 5.0'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 🆕 NEW: Verification & Admin Rating Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Verification Status Card */}
        <div className={`rounded-xl shadow-lg p-6 border-2 ${verificationBadge.color}`}>
          <div className="flex items-start gap-4">
            <div className="bg-white/50 p-3 rounded-lg">
              <VerificationIcon size={32} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">Verification Status</h3>
              <p className="text-sm mb-3">{verificationBadge.message}</p>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-white/50 rounded-full text-sm font-bold">
                  {vendorInfo?.verificationStatus || 'Pending'}
                </span>
                {vendorInfo?.isVerified && (
                  <Shield size={20} className="text-green-700" />
                )}
              </div>
            </div>
          </div>
          
          {vendorInfo?.verificationStatus === 'Rejected' && vendorInfo?.rejectionReason && (
            <div className="mt-4 pt-4 border-t border-red-200">
              <p className="text-sm font-semibold mb-1">Rejection Reason:</p>
              <p className="text-sm">{vendorInfo.rejectionReason}</p>
            </div>
          )}
        </div>

        {/* Admin Rating Card */}
        {/* <div className={`rounded-xl shadow-lg p-6 border-2 ${
          adminRating > 0 
            ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300'
            : 'bg-gray-50 border-gray-300'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`${adminRating > 0 ? 'bg-gradient-to-br from-yellow-500 to-orange-500' : 'bg-gray-400'} p-3 rounded-lg`}>
              <Award size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1 text-gray-900">Admin Rating</h3>
              {adminRating > 0 ? (
                <>
                  <p className="text-sm text-gray-700 mb-3">
                    Our admins have rated your services
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={24}
                          className={star <= adminRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{adminRating}/5</span>
                  </div>
                  {vendorInfo?.adminRatingComment && (
                    <div className="mt-3 p-3 bg-white/50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Comment:</strong> {vendorInfo.adminRatingComment}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-3">
                    Not yet rated by admin
                  </p>
                  <div className="flex items-center gap-2 text-gray-500">
                    <AlertCircle size={20} />
                    <span className="text-sm">Keep providing excellent service to earn a rating</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div> */}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={stat.textColor} size={24} />
                </div>
                <TrendingUp className="text-green-500" size={20} />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">
                {stat.value}
                {stat.suffix && <span className="text-sm text-gray-500 ml-1">{stat.suffix}</span>}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => router.push('/vendor/add-service')}
          className="bg-gradient-to-r from-cyan-600 to-green-600 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Briefcase size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-lg">Add New Service</h3>
              <p className="text-cyan-100 text-sm">Create a new service listing</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => router.push('/vendor/bookings')}
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border-2 border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Calendar className="text-green-600" size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900">View Bookings</h3>
              <p className="text-gray-600 text-sm">{stats.pendingBookings} pending requests</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => router.push('/vendor/reviews')}
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border-2 border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Star className="text-yellow-600" size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900">Manage Reviews</h3>
              <p className="text-gray-600 text-sm">{stats.totalReviews} total reviews</p>
            </div>
          </div>
        </button>
      </div>

      {/* Recent Services */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Services</h2>
          <button
            onClick={() => router.push('/vendor/services')}
            className="text-cyan-600 hover:text-cyan-700 font-semibold text-sm"
          >
            View All →
          </button>
        </div>

        {recentServices.length > 0 ? (
          <div className="space-y-4">
            {recentServices.map((service) => (
              <div
                key={service._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => router.push(`/production-houses/${service.slug || service._id}`)}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={service.image?.[0] || service.images?.[0] || '/placeholder.jpg'}
                    alt={service.companyName}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{service.companyName}</h3>
                    <p className="text-sm text-gray-600">{service.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="font-semibold text-gray-900">৳{service.startingPrice?.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Star className="fill-yellow-400 text-yellow-400" size={16} />
                    <span className="font-semibold">{service.rating || 0}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {service.available || service.availability === 'Available' ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle size={16} />
                        Available
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 text-sm">
                        <Clock size={16} />
                        Booked
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/production-houses/${service.slug || service._id}`);
                    }}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                  >
                    <Eye size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Services Yet</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first service</p>
            <button
              onClick={() => router.push('/vendor/add-service')}
              className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Add New Service
            </button>
          </div>
        )}
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Overview</h2>
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-12 text-center">
          <TrendingUp className="mx-auto text-cyan-600 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Coming Soon</h3>
          <p className="text-gray-600">Track your bookings, earnings, and performance metrics</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;