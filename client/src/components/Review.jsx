"use client";
import React, { useState, useEffect } from 'react';

const Container = ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
};

const ReviewCard = ({ category, name, description, count, countLabel, rating, icon }) => {
  return (
    <div className="border-2 border-cyan-400 rounded-xl p-6 bg-white min-w-[280px] h-full flex flex-col">
      {/* Category */}
      <p className="text-sm text-gray-600 mb-3 text-center">
        {category}
      </p>

      {/* Icon */}
      <div className="flex justify-center mb-3">
        <div className="text-5xl">
          {icon}
        </div>
      </div>

      {/* Name */}
      <h3 className="text-2xl font-bold text-center mb-3 text-gray-900">
        {name}
      </h3>

      {/* Description */}
      <p className="text-center text-gray-600 text-sm mb-6 flex-grow">
        {description}
      </p>

      {/* Stats */}
      <div className="flex justify-between items-end pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-cyan-400">
            {count}
          </div>
          <div className="text-xs text-gray-700 font-medium">
            {countLabel}
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-cyan-400">
            {rating}
          </div>
          <div className="text-xs text-gray-700 font-medium">
            Rating
          </div>
        </div>
      </div>
    </div>
  );
};

const Review = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const reviews = [
    {
      category: 'professional photography services',
      name: 'John Doe',
      description: 'Capture your special moments with professional photography services',
      count: '300+',
      countLabel: 'Photographers',
      rating: '4.7★',
      icon: '📷'
    },
    {
      category: 'professional photography services',
      name: 'mike tim',
      description: 'Capture your special moments with professional photography services',
      count: '300+',
      countLabel: 'Photographers',
      rating: '4.7★',
      icon: '📷'
    },
    {
      category: 'professional photography services',
      name: 'sabrina carpe',
      description: 'Capture your special moments with professional photography services',
      count: '300+',
      countLabel: 'Photographers',
      rating: '4.7★',
      icon: '📷'
    },
    {
      category: 'professional photography services',
      name: 'karima jannat',
      description: 'Capture your special moments with professional photography services',
      count: '300+',
      countLabel: 'Photographers',
      rating: '4.7★',
      icon: '📷'
    },
    {
      category: 'professional photography services',
      name: 'Sarah Johnson',
      description: 'Capture your special moments with professional photography services',
      count: '300+',
      countLabel: 'Photographers',
      rating: '4.7★',
      icon: '📷'
    },
    {
      category: 'professional photography services',
      name: 'Alex Smith',
      description: 'Capture your special moments with professional photography services',
      count: '300+',
      countLabel: 'Photographers',
      rating: '4.7★',
      icon: '📷'
    }
  ];

  // Auto-play slider
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(reviews.length - 3, 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlay, reviews.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(reviews.length - 3, 1));
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(reviews.length - 3, 1)) % Math.max(reviews.length - 3, 1));
    setIsAutoPlay(false);
  };

  const maxSlides = Math.max(reviews.length - 3, 1);

  return (
    <section className="py-16 bg-gray-50">
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            What Our Clients Say
          </h2>
          <p className="text-gray-700">
            Real experiences from satisfied customers and vendors
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Slider Wrapper */}
          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / 4 + 1.5)}%)`
              }}
            >
              {reviews.map((review, index) => (
                <div key={index} className="w-[calc(25%-18px)] flex-shrink-0">
                  <ReviewCard {...review} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white border-2 border-cyan-400 rounded-full w-12 h-12 flex items-center justify-center hover:bg-cyan-50 transition-colors shadow-lg z-10"
            aria-label="Previous slide"
          >
            <svg
              className="w-6 h-6 text-cyan-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white border-2 border-cyan-400 rounded-full w-12 h-12 flex items-center justify-center hover:bg-cyan-50 transition-colors shadow-lg z-10"
            aria-label="Next slide"
          >
            <svg
              className="w-6 h-6 text-cyan-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-8">
          {[...Array(maxSlides)].map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? 'bg-cyan-400 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      
      </Container>
    </section>
  );
};

export default Review;