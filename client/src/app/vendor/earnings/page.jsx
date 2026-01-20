'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, Calendar, CheckCircle,
  Download, Filter, BarChart3, PieChart, ArrowUp,
  ArrowDown, Wallet, CreditCard, Clock
} from 'lucide-react';

export default function VendorEarningsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState(null);
  const [dateRange, setDateRange] = useState('all'); // all, this_month, last_month, this_year

  const [earnings, setEarnings] = useState({
    totalRevenue: 0,
    advanceReceived: 0,
    remainingPending: 0,
    completedBookings: 0,
    averageBookingValue: 0,
    monthlyGrowth: 0,
    topPackage: '',
    upcomingRevenue: 0
  });

  const [monthlyData, setMonthlyData] = useState([]);
  const [packageBreakdown, setPackageBreakdown] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      window.location.href = '/login';
      return;
    }
    
    const parsedVendor = JSON.parse(userData);
    setVendor(parsedVendor);
    fetchEarningsData(parsedVendor._id || parsedVendor.id);
  }, []);

  useEffect(() => {
    if (bookings.length > 0) {
      calculateEarnings();
    }
  }, [bookings, dateRange]);

  const fetchEarningsData = async (vendorId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/booking/vendor/${vendorId}`
      );

      const data = await response.json();

      if (data.success) {
        setBookings(data.data);
      } else {
        console.error('Failed to fetch earnings data');
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateEarnings = () => {
    let filteredBookings = [...bookings];

    // Apply date filter
    if (dateRange !== 'all') {
      const now = new Date();
      filteredBookings = filteredBookings.filter(booking => {
        const bookingDate = new Date(booking.createdAt);
        
        switch(dateRange) {
          case 'this_month':
            return bookingDate.getMonth() === now.getMonth() && 
                   bookingDate.getFullYear() === now.getFullYear();
          case 'last_month':
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
            return bookingDate.getMonth() === lastMonth.getMonth() &&
                   bookingDate.getFullYear() === lastMonth.getFullYear();
          case 'this_year':
            return bookingDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    // Calculate total revenue (from paid bookings)
    const paidBookings = filteredBookings.filter(b => 
      b.payment?.advancePaid || b.payment?.remainingPaid
    );

    const totalRevenue = paidBookings.reduce((sum, booking) => {
      let amount = 0;
      if (booking.payment?.advancePaid) amount += booking.advancePayment || 0;
      if (booking.payment?.remainingPaid) amount += booking.remainingPayment || 0;
      return sum + amount;
    }, 0);

    // Advance received
    const advanceReceived = filteredBookings
      .filter(b => b.payment?.advancePaid)
      .reduce((sum, b) => sum + (b.advancePayment || 0), 0);

    // Remaining pending (from confirmed bookings)
    const remainingPending = filteredBookings
      .filter(b => b.payment?.advancePaid && !b.payment?.remainingPaid)
      .reduce((sum, b) => sum + (b.remainingPayment || 0), 0);

    // Completed bookings
    const completedBookings = filteredBookings.filter(b => 
      b.bookingStatus === 'completed'
    ).length;

    // Average booking value
    const averageBookingValue = paidBookings.length > 0 
      ? totalRevenue / paidBookings.length 
      : 0;

    // Upcoming revenue (approved but not paid)
    const upcomingRevenue = filteredBookings
      .filter(b => b.bookingStatus === 'approved' || b.bookingStatus === 'payment_pending')
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    // Package breakdown
    const packageStats = {};
    filteredBookings.forEach(booking => {
      const pkgName = booking.selectedPackage?.name || 'Unknown';
      if (!packageStats[pkgName]) {
        packageStats[pkgName] = { count: 0, revenue: 0 };
      }
      packageStats[pkgName].count++;
      if (booking.payment?.advancePaid) {
        packageStats[pkgName].revenue += booking.advancePayment || 0;
      }
      if (booking.payment?.remainingPaid) {
        packageStats[pkgName].revenue += booking.remainingPayment || 0;
      }
    });

    const packageBreakdownData = Object.entries(packageStats)
      .map(([name, data]) => ({
        name,
        count: data.count,
        revenue: data.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue);

    const topPackage = packageBreakdownData[0]?.name || 'N/A';

    // Monthly data (last 6 months)
    const monthlyStats = {};
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyStats[monthKey] = 0;
    }

    bookings.forEach(booking => {
      if (booking.payment?.advancePaid || booking.payment?.remainingPaid) {
        const bookingDate = new Date(booking.createdAt);
        const monthKey = bookingDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        if (monthlyStats.hasOwnProperty(monthKey)) {
          let amount = 0;
          if (booking.payment?.advancePaid) amount += booking.advancePayment || 0;
          if (booking.payment?.remainingPaid) amount += booking.remainingPayment || 0;
          monthlyStats[monthKey] += amount;
        }
      }
    });

    const monthlyDataArray = Object.entries(monthlyStats).map(([month, revenue]) => ({
      month,
      revenue
    }));

    // Calculate monthly growth
    const currentMonth = monthlyDataArray[monthlyDataArray.length - 1]?.revenue || 0;
    const lastMonth = monthlyDataArray[monthlyDataArray.length - 2]?.revenue || 0;
    const monthlyGrowth = lastMonth > 0 
      ? ((currentMonth - lastMonth) / lastMonth) * 100 
      : 0;

    setEarnings({
      totalRevenue,
      advanceReceived,
      remainingPending,
      completedBookings,
      averageBookingValue,
      monthlyGrowth,
      topPackage,
      upcomingRevenue
    });

    setMonthlyData(monthlyDataArray);
    setPackageBreakdown(packageBreakdownData);
  };

  const formatCurrency = (amount) => {
    return `৳${Math.round(amount).toLocaleString()}`;
  };

  const downloadReport = () => {
    // Create CSV content
    let csv = 'Vendor Earnings Report\n\n';
    csv += `Date Range: ${dateRange}\n`;
    csv += `Generated: ${new Date().toLocaleDateString()}\n\n`;
    
    csv += 'Summary\n';
    csv += `Total Revenue,${earnings.totalRevenue}\n`;
    csv += `Advance Received,${earnings.advanceReceived}\n`;
    csv += `Remaining Pending,${earnings.remainingPending}\n`;
    csv += `Completed Bookings,${earnings.completedBookings}\n`;
    csv += `Average Booking Value,${earnings.averageBookingValue}\n\n`;

    csv += 'Monthly Breakdown\n';
    csv += 'Month,Revenue\n';
    monthlyData.forEach(item => {
      csv += `${item.month},${item.revenue}\n`;
    });

    csv += '\nPackage Performance\n';
    csv += 'Package,Bookings,Revenue\n';
    packageBreakdown.forEach(pkg => {
      csv += `${pkg.name},${pkg.count},${pkg.revenue}\n`;
    });

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `earnings-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading earnings data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Earnings Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your revenue and financial performance</p>
        </div>

        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="this_year">This Year</option>
          </select>

          <button
            onClick={downloadReport}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-semibold"
          >
            <Download size={20} />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign size={24} />
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              earnings.monthlyGrowth >= 0 ? 'text-green-200' : 'text-red-200'
            }`}>
              {earnings.monthlyGrowth >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              {Math.abs(earnings.monthlyGrowth).toFixed(1)}%
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold">{formatCurrency(earnings.totalRevenue)}</p>
        </div>

        {/* Advance Received */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Wallet size={24} />
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">Advance Received</p>
          <p className="text-3xl font-bold">{formatCurrency(earnings.advanceReceived)}</p>
          <p className="text-xs opacity-75 mt-2">10% of total bookings</p>
        </div>

        {/* Remaining Pending */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Clock size={24} />
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">Remaining Pending</p>
          <p className="text-3xl font-bold">{formatCurrency(earnings.remainingPending)}</p>
          <p className="text-xs opacity-75 mt-2">To be collected after events</p>
        </div>

        {/* Upcoming Revenue */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">Upcoming Revenue</p>
          <p className="text-3xl font-bold">{formatCurrency(earnings.upcomingRevenue)}</p>
          <p className="text-xs opacity-75 mt-2">Approved bookings (not paid)</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-cyan-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{earnings.completedBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Booking Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(earnings.averageBookingValue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <PieChart className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Top Package</p>
              <p className="text-lg font-bold text-gray-900">{earnings.topPackage}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp className="text-cyan-600" size={24} />
          Monthly Revenue Trend
        </h2>

        <div className="space-y-4">
          {monthlyData.map((item, index) => {
            const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
            const widthPercentage = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;

            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.month}</span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(item.revenue)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${widthPercentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Package Performance */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <PieChart className="text-cyan-600" size={24} />
          Package Performance
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Package Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Bookings</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Revenue</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Avg. Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {packageBreakdown.map((pkg, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{pkg.name}</td>
                  <td className="px-6 py-4 text-gray-700">{pkg.count}</td>
                  <td className="px-6 py-4 font-semibold text-green-600">
                    {formatCurrency(pkg.revenue)}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {formatCurrency(pkg.count > 0 ? pkg.revenue / pkg.count : 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-cyan-200">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="text-cyan-600" size={20} />
            Payment Status Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Advance Payments</span>
              <span className="font-bold text-teal-600">
                {formatCurrency(earnings.advanceReceived)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Pending Final Payments</span>
              <span className="font-bold text-orange-600">
                {formatCurrency(earnings.remainingPending)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-cyan-300">
              <span className="text-gray-900 font-semibold">Total Earned</span>
              <span className="font-bold text-green-600 text-xl">
                {formatCurrency(earnings.totalRevenue)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="text-purple-600" size={20} />
            Revenue Insights
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total Bookings</span>
              <span className="font-bold text-purple-600">
                {bookings.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Conversion Rate</span>
              <span className="font-bold text-purple-600">
                {bookings.length > 0 
                  ? Math.round((earnings.completedBookings / bookings.length) * 100) 
                  : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-purple-300">
              <span className="text-gray-900 font-semibold">Monthly Growth</span>
              <span className={`font-bold text-xl ${
                earnings.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {earnings.monthlyGrowth >= 0 ? '+' : ''}{earnings.monthlyGrowth.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}