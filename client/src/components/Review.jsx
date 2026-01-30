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
const ReviewCard = ({ review, language }) => {
  return (
    <div className="group relative bg-white border-2 border-cyan-100 rounded-2xl p-4 sm:p-6 hover:border-cyan-400 hover:shadow-2xl transition-all duration-300 h-full flex flex-col min-w-[280px] sm:min-w-[320px]">
      {/* Gradient Background on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Quote Icon */}
        <div className="mb-3 sm:mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>

        {/* Service Category */}
        <div className="mb-2 sm:mb-3">
          <span className={`inline-block px-2 sm:px-3 py-1 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wide ${
            language === 'bn' ? 'font-hind-siliguri' : ''
          }`}>
            {review.serviceCategory || (language === 'bn' ? 'ইভেন্ট সেবা' : 'Event Service')}
          </span>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-3 sm:mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={16}
              className={`sm:w-5 sm:h-5 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
          <span className="ml-1 sm:ml-2 text-base sm:text-lg font-bold text-gray-900">
            {language === 'bn' ? toBengaliNumber(review.rating) : review.rating}/
            {language === 'bn' ? '৫' : '5'}
          </span>
        </div>

        {/* Review Text */}
        <p className={`text-gray-700 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 flex-grow line-clamp-4 group-hover:line-clamp-none transition-all ${
          language === 'bn' ? 'font-hind-siliguri' : ''
        }`}>
          "{review.comment}"
        </p>

        {/* Reviewer Info */}
        <div className="flex items-center gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-200 group-hover:border-cyan-200 transition-colors">
          <div className="flex-shrink-0">
            {review.avatar ? (
              <img
                src={review.avatar}
                alt={review.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-cyan-200"
              />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg">
                {review.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className={`font-bold text-sm sm:text-base text-gray-900 ${
              language === 'bn' ? 'font-hind-siliguri' : ''
            }`}>
              {review.name}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500">
              {review.date || new Date(review.createdAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Service Name Badge */}
        {review.serviceName && (
          <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
            <p className={`text-[10px] sm:text-xs text-gray-600 ${
              language === 'bn' ? 'font-hind-siliguri' : ''
            }`}>
              {language === 'bn' ? 'রিভিউকৃত' : 'Reviewed'}: <span className="font-semibold text-cyan-600">{review.serviceName}</span>
            </p>
          </div>
        )}
      </div>

      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-bl-full transform translate-x-4 -translate-y-4 group-hover:scale-150 transition-transform duration-500" />
    </div>
  );
};

// Convert numbers to Bengali
const toBengaliNumber = (num) => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).split('').map(digit => {
    return digit >= '0' && digit <= '9' ? bengaliDigits[digit] : digit;
  }).join('');
};

const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("en");
  const [stats, setStats] = useState({
    totalReviews: 0,
    avgRating: 0,
    fiveStarCount: 0,
  });

  // Translations
  const translations = {
    en: {
      badge: 'CUSTOMER REVIEWS',
      heading1: 'What Our Clients',
      heading2: 'Say',
      description: 'Real experiences from satisfied customers and vendors',
      totalReviews: 'Total Reviews',
      averageRating: 'Average Rating',
      fiveStarReviews: '5-Star Reviews'
    },
    bn: {
      badge: 'গ্রাহক রিভিউ',
      heading1: 'আমাদের ক্লায়েন্টরা',
      heading2: 'কী বলেন',
      description: 'সন্তুষ্ট গ্রাহক এবং ভেন্ডরদের প্রকৃত অভিজ্ঞতা',
      totalReviews: 'মোট রিভিউ',
      averageRating: 'গড় রেটিং',
      fiveStarReviews: '৫-স্টার রিভিউ'
    }
  };

  const t = translations[language];

  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferredLanguage");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    const interval = setInterval(() => {
      const currentLanguage = localStorage.getItem("preferredLanguage") || "en";
      if (currentLanguage !== language) {
        setLanguage(currentLanguage);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [language]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/services/reviews/all`
      );
      
      const data = await response.json();
      
      if (data.success && data.data) {
        const allReviews = data.data;
        setReviews(allReviews);
        
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

  const formatNumber = (num) => {
    return language === 'bn' ? toBengaliNumber(num) : num;
  };

  if (loading) {
    return (
      <section id="reviews" className="py-12 md:py-20 bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/20">
        <Container>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-10 h-10 md:w-12 md:h-12 animate-spin text-cyan-600" />
          </div>
        </Container>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section id="reviews" className="relative py-12 md:py-20 bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/20 overflow-hidden scroll-mt-24">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-cyan-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-blue-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <Container>
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 px-4 md:px-6 py-2 rounded-full mb-4 md:mb-6 shadow-lg">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
            <span className={`text-white font-semibold text-xs md:text-sm uppercase tracking-wide ${
              language === 'bn' ? 'font-hind-siliguri' : ''
            }`}>
              {t.badge}
            </span>
          </div>

          {/* Title */}
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 ${
            language === 'bn' ? 'font-hind-siliguri' : ''
          }`}>
            {t.heading1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">{t.heading2}</span>
          </h2>
          <p className={`text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-4 ${
            language === 'bn' ? 'font-hind-siliguri' : ''
          }`}>
            {t.description}
          </p>

          {/* Stats Bar */}
          <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-4 md:gap-8 px-4">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-cyan-600">
                {formatNumber(stats.totalReviews)}+
              </div>
              <div className={`text-xs md:text-sm text-gray-600 font-medium ${
                language === 'bn' ? 'font-hind-siliguri' : ''
              }`}>
                {t.totalReviews}
              </div>
            </div>
            <div className="w-px h-10 md:h-12 bg-gray-300" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-6 h-6 md:w-8 md:h-8 fill-yellow-400 text-yellow-400" />
                <span className="text-3xl md:text-4xl font-bold text-yellow-500">
                  {formatNumber(stats.avgRating)}
                </span>
              </div>
              <div className={`text-xs md:text-sm text-gray-600 font-medium ${
                language === 'bn' ? 'font-hind-siliguri' : ''
              }`}>
                {t.averageRating}
              </div>
            </div>
            <div className="w-px h-10 md:h-12 bg-gray-300" />
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600">
                {formatNumber(stats.fiveStarCount)}
              </div>
              <div className={`text-xs md:text-sm text-gray-600 font-medium ${
                language === 'bn' ? 'font-hind-siliguri' : ''
              }`}>
                {t.fiveStarReviews}
              </div>
            </div>
          </div>
        </div>

        {/* Slider Container */}
        <div className="relative px-8 md:px-12">
          {/* Slider Wrapper - Mobile: 1 card, Tablet: 2 cards, Desktop: 3 cards */}
          <div className="overflow-hidden">
            <div
              className="flex gap-4 md:gap-6 transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / 3 + 2)}%)`
              }}
            >
              {reviews.map((review, index) => (
                <div 
                  key={index} 
                  className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-shrink-0"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ReviewCard review={review} language={language} />
                </div>
              ))}
            </div>
          </div>

          {/* Modern Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 text-cyan-600 hover:text-white border-2 border-cyan-400 rounded-full w-10 h-10 md:w-14 md:h-14 flex items-center justify-center shadow-xl z-10 transition-all duration-300 group hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} className="md:w-7 md:h-7 group-hover:-translate-x-1 transition-transform" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 text-cyan-600 hover:text-white border-2 border-cyan-400 rounded-full w-10 h-10 md:w-14 md:h-14 flex items-center justify-center shadow-xl z-10 transition-all duration-300 group hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight size={20} className="md:w-7 md:h-7 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Modern Dots Navigation */}
        <div className="flex justify-center gap-2 md:gap-3 mt-8 md:mt-12">
          {[...Array(maxSlides)].map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                currentIndex === index
                  ? 'w-8 md:w-12 h-2 md:h-3 bg-gradient-to-r from-cyan-500 to-blue-600'
                  : 'w-2 md:w-3 h-2 md:h-3 bg-gray-300 hover:bg-gray-400'
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