'use client';

import React, { useState, useEffect } from 'react';
import Container from './common/Container';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Event images for slider - Replace these with your actual image URLs
  const eventImages = [
    {
      url: '/events/wedding.jpg',
      title: 'Beautiful Weddings',
      description: 'Make your special day unforgettable'
    },
    {
      url: '/events/corporate.jpg',
      title: 'Corporate Events',
      description: 'Professional event management'
    },
    {
      url: '/events/birthday.jpg',
      title: 'Birthday Parties',
      description: 'Celebrate life\'s moments'
    },
    {
      url: '/events/concert.jpg',
      title: 'Concerts & Shows',
      description: 'Spectacular entertainment experiences'
    },
    {
      url: '/events/conference.jpg',
      title: 'Conferences',
      description: 'Seamless business gatherings'
    }
  ];

  // Auto-play slider
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % eventImages.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, eventImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % eventImages.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + eventImages.length) % eventImages.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className='py-10 mt-20'>
      <Container>
        <div className='flex items-center justify-between gap-12'>
          {/* Left Side - Text Content */}
          <div className='flex-1'>
            <h1 className='text-8xl w-[700px] font-sirin-stencil font-medium'>
              Your Complete <br />
              <span className='font-rubik-maps text-8xl text-[#00C0E8] leading-16 tracking-[0.25]'>
                Event
              </span> 
              <br />
              Solution Platform
            </h1>
            <p className='text-2xl font-semibold font-outfit w-[600px] mt-10'>
              Connect with the best event professionals in one place we have everything you need for your perfect event
            </p>

            <div className='mt-10'>
              <button className='cursor-pointer border-2 bg-[#00C0E8] px-6 py-3 rounded-md text-white text-xl font-outfit font-medium hover:bg-white hover:text-[#00C0E8] hover:border-[#00C0E8] transition-all duration-300'>
                Explore Services 
              </button>

              <button className='ml-10 cursor-pointer border-2 border-[#00C0E8] px-6 py-3 rounded-md text-[#00C0E8] text-xl font-outfit font-medium hover:bg-[#00C0E8] hover:text-white hover:border-[#00C0E8] transition-all duration-300'>
                Join as Vendor
              </button>
            </div>
          </div>

          {/* Right Side - Modern Image Slider */}
          <div className='flex-1 relative'>
            <div className='relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl'>
              {/* Slider Images */}
              <div className='relative w-full h-full'>
                {eventImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      index === currentSlide
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-105'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.title}
                      className='w-full h-full object-cover'
                      onError={(e) => {
                        // Fallback gradient if image doesn't exist
                        e.target.style.display = 'none';
                        e.target.parentElement.style.background = `linear-gradient(135deg, #00C0E8 0%, #0080A8 100%)`;
                      }}
                    />
                    
                    {/* Overlay Gradient */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />
                    
                    {/* Image Info */}
                    <div className='absolute bottom-0 left-0 right-0 p-8 text-white'>
                      <h3 className='text-3xl font-bold mb-2 font-outfit'>{image.title}</h3>
                      <p className='text-lg font-outfit opacity-90'>{image.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className='absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 group'
                aria-label='Previous slide'
              >
                <ChevronLeft size={28} className='group-hover:-translate-x-1 transition-transform' />
              </button>

              <button
                onClick={nextSlide}
                className='absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 group'
                aria-label='Next slide'
              >
                <ChevronRight size={28} className='group-hover:translate-x-1 transition-transform' />
              </button>

              {/* Dot Indicators */}
              <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2'>
                {eventImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentSlide
                        ? 'w-8 h-2 bg-[#00C0E8]'
                        : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Decorative Elements */}
              <div className='absolute -top-4 -right-4 w-24 h-24 bg-[#00C0E8] rounded-full blur-3xl opacity-20 animate-pulse' />
              <div className='absolute -bottom-4 -left-4 w-32 h-32 bg-[#00C0E8] rounded-full blur-3xl opacity-20 animate-pulse' style={{ animationDelay: '1s' }} />
            </div>

            {/* Floating Card Effect */}
            <div className='absolute -bottom-12 -right-6 bg-white p-6 rounded-xl shadow-xl z-10'>
              <div className='flex items-center gap-4'>
                <div className='bg-[#00C0E8] p-3 rounded-lg'>
                  <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                  </svg>
                </div>
                <div>
                  <p className='font-bold text-xl text-gray-800'>500+</p>
                  <p className='text-gray-600 text-sm'>Successful Events</p>
                </div>
              </div>
            </div>

            {/* Another Floating Card */}
            <div className='absolute -top-6 -left-6 bg-white p-6 rounded-xl shadow-xl z-10'>
              <div className='flex items-center gap-4'>
                <div className='bg-[#00C0E8] p-3 rounded-lg'>
                  <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' />
                  </svg>
                </div>
                <div>
                  <p className='font-bold text-xl text-gray-800'>200+</p>
                  <p className='text-gray-600 text-sm'>Trusted Vendors</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Banner;