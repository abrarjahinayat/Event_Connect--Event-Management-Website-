'use client';

import React, { useState, useEffect } from 'react';
import Container from './common/Container';
import { ChevronLeft, ChevronRight, Sparkles, Users, CheckCircle } from 'lucide-react';

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
    }, 4000);

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
    <section className='relative py-20  overflow-hidden bg-gradient-to-br from-white via-cyan-50/40 to-blue-50/30'>
      {/* Animated Background Blobs */}
      <div className='absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-cyan-200/30 to-blue-200/20 rounded-full blur-3xl -translate-x-1/4 -translate-y-1/4 animate-pulse' />
      <div className='absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-200/20 to-cyan-200/30 rounded-full blur-3xl translate-x-1/4 translate-y-1/4 animate-pulse' style={{ animationDelay: '1s' }} />
      
      <Container>
        <div className='relative z-10 flex items-center justify-between gap-16'>
          {/* Left Side - Text Content */}
          <div className='flex-1 space-y-8'>
            {/* Badge */}
            <div className='inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-2 rounded-full shadow-lg'>
              <Sparkles className='w-4 h-4 text-white' />
              <span className='text-white font-semibold text-sm  tracking-wide'>
                1<sup>st</sup> EVENT PLATFORM IN BANGLADESH
              </span>
            </div>

            {/* Main Heading */}
            <div>
              <h1 className='text-7xl md:text-8xl leading-tight font-sirin-stencil font-medium text-gray-900'>
                Your Complete <br />
                <span className='relative inline-block'>
                  <span className='relative z-10 font-rubik-maps text-7xl md:text-8xl bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 bg-clip-text text-transparent'>
                    Event
                  </span>
                  {/* Underline decoration */}
                  {/* <svg className='absolute -bottom-2 left-0 w-full' viewBox='0 0 200 12' xmlns='http://www.w3.org/2000/svg'>
                    <path d='M0 8 Q50 2, 100 8 T200 8' stroke='#00C0E8' strokeWidth='3' fill='none' opacity='0.3' />
                  </svg> */}
                </span>
                <br />
                Solution Platform
              </h1>
            </div>

            {/* Description */}
            <p className='text-xl md:text-2xl font-outfit text-gray-700 leading-relaxed max-w-xl'>
              Connect with the <span className='font-bold text-cyan-600'>best event professionals</span> in one place. 
              We have everything you need for your <span className=' text-gray-700'>perfect event</span>.
            </p>

            {/* Feature Pills */}
            <div className='flex flex-wrap gap-3'>
              <div className='flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-cyan-100'>
                <CheckCircle className='w-5 h-5 text-green-500' />
                <span className='text-sm font-semibold text-gray-700'>Verified Vendors</span>
              </div>
              <div className='flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-blue-100'>
                <Users className='w-5 h-5 text-blue-500' />
                <span className='text-sm font-semibold text-gray-700'>500+ Events Completed</span>
              </div>
              <div className='flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-cyan-100'>
                <Sparkles className='w-5 h-5 text-yellow-500' />
                <span className='text-sm font-semibold text-gray-700'>Premium Services</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className='flex items-center gap-6 pt-4'>
              <button className='group relative cursor-pointer px-8 py-4 rounded-xl text-white text-lg font-outfit font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl'>
                {/* Gradient Background */}
                <div className='absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300 group-hover:from-cyan-600 group-hover:to-blue-700' />
                
                {/* Shine Effect */}
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700' />
                
                <span className='relative z-10 flex items-center gap-2'>
                  Explore Services
                  {/* <svg className='w-5 h-5 transform group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                  </svg> */}
                </span>
              </button>

              <button className='cursor-pointer border-2 border-cyan-500 px-8 py-4 rounded-xl text-cyan-600 text-lg font-outfit font-semibold hover:bg-cyan-500 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-xl'>
                Join as Vendor
              </button>
            </div>
          </div>

          {/* Right Side - Modern Image Slider */}
          <div className='flex-1 relative'>
            <div className='relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-cyan-500/20'>
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
                        e.target.style.display = 'none';
                        e.target.parentElement.style.background = `linear-gradient(135deg, #00C0E8 0%, #0080A8 100%)`;
                      }}
                    />
                    
                    {/* Enhanced Overlay */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent' />
                    
                    {/* Image Info with Modern Card */}
                    <div className='absolute bottom-0 left-0 right-0 p-8'>
                      <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
                        <h3 className='text-3xl font-bold mb-2 font-outfit text-white'>{image.title}</h3>
                        <p className='text-lg font-outfit text-white/90'>{image.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modern Navigation Arrows */}
              <button
                onClick={prevSlide}
                className='absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-cyan-600 p-4 rounded-full transition-all duration-300 group shadow-xl hover:scale-110'
                aria-label='Previous slide'
              >
                <ChevronLeft size={24} className='group-hover:-translate-x-1 transition-transform' />
              </button>

              <button
                onClick={nextSlide}
                className='absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-cyan-600 p-4 rounded-full transition-all duration-300 group shadow-xl hover:scale-110'
                aria-label='Next slide'
              >
                <ChevronRight size={24} className='group-hover:translate-x-1 transition-transform' />
              </button>

              {/* Modern Dot Indicators */}
              <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 bg-black/30 backdrop-blur-md px-4 py-3 rounded-full'>
                {eventImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentSlide
                        ? 'w-10 h-2.5 bg-gradient-to-r from-cyan-400 to-blue-500'
                        : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Modern Floating Stats Cards */}
            <div className='absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-2xl z-10 border border-cyan-100 hover:scale-105 transition-transform duration-300'>
              <div className='flex items-center gap-4'>
                <div className='bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-xl'>
                  <CheckCircle className='w-8 h-8 text-white' />
                </div>
                <div>
                  <p className='font-bold text-2xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent'>500+</p>
                  <p className='text-gray-600 text-sm font-medium'>Successful Events</p>
                </div>
              </div>
            </div>

            <div className='absolute -top-8 -left-8 bg-white p-6 rounded-2xl shadow-2xl z-10 border border-blue-100 hover:scale-105 transition-transform duration-300'>
              <div className='flex items-center gap-4'>
                <div className='bg-gradient-to-br from-blue-500 to-cyan-600 p-4 rounded-xl'>
                  <Users className='w-8 h-8 text-white' />
                </div>
                <div>
                  <p className='font-bold text-2xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>200+</p>
                  <p className='text-gray-600 text-sm font-medium'>Trusted Vendors</p>
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