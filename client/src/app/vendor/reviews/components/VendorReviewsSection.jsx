'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, User, Calendar, TrendingUp, Award, Loader2 } from 'lucide-react';

const VendorReviewsSection = ({ vendorId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReviews: 0,
    avgRating: 0,
    fiveStarCount: 0,
    fourStarCount: 0,
    threeStarCount: 0,
    twoStarCount: 0,
    oneStarCount: 0,
  });

  useEffect(() => {
    if (vendorId) {
      fetchVendorReviews();
    }
  }, [vendorId]);

  const fetchVendorReviews = async () => {
    try {
      setLoading(true);

      // Fetch all services for this vendor
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/services/vendor/${vendorId}`
      );

      const data = await response.json();

      if (data.success && data.data) {
        const services = data.data;

        // Collect all reviews from all services
        let allReviews = [];
        services.forEach((service) => {
          if (service.reviews && service.reviews.length > 0) {
            service.reviews.forEach((review) => {
              allReviews.push({
                ...review,
                serviceName: service.companyName,
                serviceCategory: service.serviceCategory,
                serviceId: service._id,
              });
            });
          }
        });

        // Sort by date (newest first)
        allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setReviews(allReviews);

        // Calculate stats
        const totalReviews = allReviews.length;
        const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;

        const fiveStarCount = allReviews.filter((r) => r.rating === 5).length;
        const fourStarCount = allReviews.filter((r) => r.rating === 4).length;
        const threeStarCount = allReviews.filter((r) => r.rating === 3).length;
        const twoStarCount = allReviews.filter((r) => r.rating === 2).length;
        const oneStarCount = allReviews.filter((r) => r.rating === 1).length;

        setStats({
          totalReviews,
          avgRating,
          fiveStarCount,
          fourStarCount,
          threeStarCount,
          twoStarCount,
          oneStarCount,
        });
      }
    } catch (error) {
      console.error('Error fetching vendor reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRatingPercentage = (count) => {
    if (stats.totalReviews === 0) return 0;
    return ((count / stats.totalReviews) * 100).toFixed(0);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Reviews */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-cyan-100 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalReviews}</p>
          <p className="text-sm text-gray-600">Total Reviews</p>
        </div>

        {/* Average Rating */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-yellow-100 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white fill-white" />
            </div>
            <Award className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <p className="text-3xl font-bold text-gray-900">{stats.avgRating}</p>
            <p className="text-lg text-gray-500">/5.0</p>
          </div>
          <p className="text-sm text-gray-600">Average Rating</p>
        </div>

        {/* 5-Star Reviews */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.fiveStarCount}</p>
          <p className="text-sm text-gray-600">5-Star Reviews</p>
        </div>

        {/* Response Rate */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {stats.totalReviews > 0 ? getRatingPercentage(stats.fiveStarCount + stats.fourStarCount) : 0}%
          </p>
          <p className="text-sm text-gray-600">Positive Reviews</p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Rating Distribution</h3>
        <div className="space-y-4">
          {[
            { stars: 5, count: stats.fiveStarCount, color: 'bg-green-500' },
            { stars: 4, count: stats.fourStarCount, color: 'bg-lime-500' },
            { stars: 3, count: stats.threeStarCount, color: 'bg-yellow-500' },
            { stars: 2, count: stats.twoStarCount, color: 'bg-orange-500' },
            { stars: 1, count: stats.oneStarCount, color: 'bg-red-500' },
          ].map((item) => (
            <div key={item.stars} className="flex items-center gap-4">
              <div className="flex items-center gap-1 w-20">
                <span className="text-sm font-semibold text-gray-700">{item.stars}</span>
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
              </div>
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} transition-all duration-500`}
                  style={{ width: `${getRatingPercentage(item.count)}%` }}
                />
              </div>
              <div className="w-16 text-right">
                <span className="text-sm font-semibold text-gray-700">
                  {item.count} ({getRatingPercentage(item.count)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Customer Reviews ({stats.totalReviews})
        </h3>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No reviews yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Reviews from customers will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    {review.avatar ? (
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-cyan-200"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* User Info */}
                    <div>
                      <p className="font-bold text-gray-900">{review.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={14} />
                        {review.date ||
                          new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-2 rounded-lg border border-yellow-200">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        className={
                          star <= review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }
                      />
                    ))}
                    <span className="ml-2 text-lg font-bold text-gray-900">
                      {review.rating}/5
                    </span>
                  </div>
                </div>

                {/* Service Badge */}
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-full text-xs font-semibold uppercase tracking-wide">
                    {review.serviceCategory} - {review.serviceName}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorReviewsSection;