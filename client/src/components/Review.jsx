'use client';

import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Sparkles, Quote, Loader2 } from 'lucide-react';

const Container = ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
};

// Modern Review Card Component
const ReviewCard = ({ review }) => {
  return (
    <div className="group relative bg-white border-2 border-cyan-100 rounded-2xl p-6 hover:border-cyan-400 hover:shadow-2xl transition-all duration-300 h-full flex flex-col min-w-[320px]">
      {/* Gradient Background on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Quote Icon */}
        <div className="mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Quote className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Service Category */}
        <div className="mb-3">
          <span className="inline-block px-3 py-1 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-full text-xs font-semibold uppercase tracking-wide">
            {review.serviceCategory || 'Event Service'}
          </span>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={20}
              className={star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
            />
          ))}
          <span className="ml-2 text-lg font-bold text-gray-900">{review.rating}/5</span>
        </div>

        {/* Review Text */}
        <p className="text-gray-700 text-sm leading-relaxed mb-6 flex-grow line-clamp-4 group-hover:line-clamp-none transition-all">
          "{review.comment}"
        </p>

        {/* Reviewer Info */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-200 group-hover:border-cyan-200 transition-colors">
          <div className="flex-shrink-0">
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
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900">{review.name}</p>
            <p className="text-xs text-gray-500">
              {review.date || new Date(review.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Service Name Badge */}
        {review.serviceName && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">
              Reviewed: <span className="font-semibold text-cyan-600">{review.serviceName}</span>
            </p>
          </div>
        )}
      </div>

      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-bl-full transform translate-x-4 -translate-y-4 group-hover:scale-150 transition-transform duration-500" />
    </div>
  );
};

const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReviews: 0,
    avgRating: 0,
    fiveStarCount: 0,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      // Fetch reviews from all services
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/services/reviews/all`
      );
      
      const data = await response.json();
      
      if (data.success && data.data) {
        const allReviews = data.data;
        setReviews(allReviews);
        
        // Calculate stats
        const totalReviews = allReviews.length;
        const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;
        const fiveStarCount = allReviews.filter(review => review.rating === 5).length;
        
        setStats({
          totalReviews,
          avgRating,
          fiveStarCount,
        });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-play slider
  useEffect(() => {
    if (!isAutoPlay || reviews.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(reviews.length - 2, 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlay, reviews.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(reviews.length - 2, 1));
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(reviews.length - 2, 1)) % Math.max(reviews.length - 2, 1));
    setIsAutoPlay(false);
  };

  const maxSlides = Math.max(reviews.length - 2, 1);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/20">
        <Container>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-cyan-600" />
          </div>
        </Container>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null; // Don't show section if no reviews
  }

  return (
    <section className="relative py-20 bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/20 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <Container>
        {/* Header */}
        <div className="text-center mb-12 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-2 rounded-full mb-6 shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-white font-semibold text-sm uppercase tracking-wide">
              Customer Reviews
            </span>
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Clients <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real experiences from satisfied customers and vendors
          </p>

          {/* Stats Bar */}
          <div className="mt-8 flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-600">{stats.totalReviews}+</div>
              <div className="text-sm text-gray-600 font-medium">Total Reviews</div>
            </div>
            <div className="w-px h-12 bg-gray-300" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                <span className="text-4xl font-bold text-yellow-500">{stats.avgRating}</span>
              </div>
              <div className="text-sm text-gray-600 font-medium">Average Rating</div>
            </div>
            <div className="w-px h-12 bg-gray-300" />
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">{stats.fiveStarCount}</div>
              <div className="text-sm text-gray-600 font-medium">5-Star Reviews</div>
            </div>
          </div>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Slider Wrapper */}
          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / 3 + 2)}%)`
              }}
            >
              {reviews.map((review, index) => (
                <div 
                  key={index} 
                  className="w-[calc(33.333%-16px)] flex-shrink-0"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>

          {/* Modern Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 text-cyan-600 hover:text-white border-2 border-cyan-400 rounded-full w-14 h-14 flex items-center justify-center shadow-xl z-10 transition-all duration-300 group hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 text-cyan-600 hover:text-white border-2 border-cyan-400 rounded-full w-14 h-14 flex items-center justify-center shadow-xl z-10 transition-all duration-300 group hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Modern Dots Navigation */}
        <div className="flex justify-center gap-3 mt-12">
          {[...Array(maxSlides)].map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                currentIndex === index
                  ? 'w-12 h-3 bg-gradient-to-r from-cyan-500 to-blue-600'
                  : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Reviews;