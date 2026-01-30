'use client';

import React, { useState, useEffect } from 'react';
import Container from './common/Container';
import { ChevronLeft, ChevronRight, Sparkles, Users, CheckCircle } from 'lucide-react';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [language, setLanguage] = useState("en");

  // Event images for slider
  const eventImages = [
    {
      url: '/events/wedding.jpg',
      title: { en: 'Beautiful Weddings', bn: 'সুন্দর বিবাহ অনুষ্ঠান' },
      description: { en: 'Make your special day unforgettable', bn: 'আপনার বিশেষ দিনটি অবিস্মরণীয় করুন' }
    },
    {
      url: '/events/corporate.jpg',
      title: { en: 'Corporate Events', bn: 'কর্পোরেট ইভেন্ট' },
      description: { en: 'Professional event management', bn: 'পেশাদার ইভেন্ট ম্যানেজমেন্ট' }
    },
    {
      url: '/events/birthday.jpg',
      title: { en: 'Birthday Parties', bn: 'জন্মদিনের পার্টি' },
      description: { en: 'Celebrate life\'s moments', bn: 'জীবনের মুহূর্তগুলি উদযাপন করুন' }
    },
    {
      url: '/events/concert.jpg',
      title: { en: 'Concerts & Shows', bn: 'কনসার্ট এবং শো' },
      description: { en: 'Spectacular entertainment experiences', bn: 'দর্শনীয় বিনোদনের অভিজ্ঞতা' }
    },
    {
      url: '/events/conference.jpg',
      title: { en: 'Conferences', bn: 'সম্মেলন' },
      description: { en: 'Seamless business gatherings', bn: 'নির্বিঘ্ন ব্যবসায়িক সমাবেশ' }
    }
  ];

  // Translations
  const translations = {
    en: {
      badge: '1st EVENT PLATFORM IN BANGLADESH',
      heading1: 'Your Complete',
      heading2: 'Event',
      heading3: 'Solution Platform',
      description: 'Connect with the ',
      descriptionBold: 'best event professionals',
      description2: ' in one place. We have everything you need for your ',
      description2Bold: 'perfect event',
      feature1: 'Verified Vendors',
      feature2: '500+ Events Completed',
      feature3: 'Premium Services',
      exploreServices: 'Explore Services',
      joinAsVendor: 'Join as Vendor',
      successfulEvents: 'Successful Events',
      trustedVendors: 'Trusted Vendors'
    },
    bn: {
      badge: 'বাংলাদেশের ১ম ইভেন্ট প্ল্যাটফর্ম',
      heading1: 'আপনার সম্পূর্ণ',
      heading2: 'ইভেন্ট সমাধান',
      heading3: ' প্ল্যাটফর্ম',
      description: 'একই জায়গায় ',
      descriptionBold: 'সেরা ইভেন্ট পেশাদারদের',
      description2: ' সাথে সংযুক্ত হন। আপনার ',
      description2Bold: 'নিখুঁত ইভেন্টের',
      description3: ' জন্য আমাদের কাছে সবকিছু আছে।',
      feature1: 'যাচাইকৃত ভেন্ডর',
      feature2: '৫০০+ ইভেন্ট সম্পন্ন',
      feature3: 'প্রিমিয়াম সেবা',
      exploreServices: 'সেবা দেখুন',
      joinAsVendor: 'ভেন্ডর হিসেবে যোগ দিন',
      successfulEvents: 'সফল ইভেন্ট',
      trustedVendors: 'বিশ্বস্ত ভেন্ডর'
    }
  };

  const t = translations[language];

  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferredLanguage");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    // Listen for language changes
    const handleStorageChange = () => {
      const newLanguage = localStorage.getItem("preferredLanguage");
      if (newLanguage) {
        setLanguage(newLanguage);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Poll for language changes (since localStorage events don't fire in same tab)
    const interval = setInterval(() => {
      const currentLanguage = localStorage.getItem("preferredLanguage") || "en";
      if (currentLanguage !== language) {
        setLanguage(currentLanguage);
      }
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [language]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

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
    <section className='relative mt-10 lg:mt-20 py-12 md:py-20 overflow-hidden bg-gradient-to-br from-white via-cyan-50/40 to-blue-50/30'>
      {/* Animated Background Blobs */}
      <div className='absolute top-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] lg:bg-gradient-to-br from-cyan-200/30 to-blue-200/20 rounded-full blur-3xl -translate-x-1/4 -translate-y-1/4 animate-pulse' />
      <div className='absolute bottom-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] lg:bg-gradient-to-br from-blue-200/20 to-cyan-200/30 rounded-full blur-3xl translate-x-1/4 translate-y-1/4 animate-pulse' style={{ animationDelay: '1s' }} />
      
      <Container>
        <div className='relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16'>
          {/* Left Side - Text Content */}
          <div className='flex-1 space-y-6 md:space-y-8 w-full text-left'>
            {/* Badge */}
            <div className='inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 px-4 md:px-5 py-2 rounded-full shadow-lg'>
              <Sparkles className='w-3 h-3 md:w-4 md:h-4 text-white' />
              <span className={`text-white font-semibold text-sm md:text-sm tracking-wide ${
                language === 'bn' ? 'font-hind-siliguri ' : ''
              }`}>
                {t.badge}
              </span>
            </div>

            {/* Main Heading */}
            <div>
              <h1 className={`text-4xl  md:text-6xl lg:text-7xl xl:text-8xl leading-tight font-sirin-stencil font-medium text-gray-900 ${
                language === 'bn' ? 'font-hind-siliguri font-semibold' : ''
              }`}>
                {t.heading1} <br />
                <span className='relative inline-block'>
                  <span className={`relative z-10 text-4xl md:text-6xl lg:text-7xl xl:text-8xl bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 bg-clip-text text-transparent ${
                    language === 'bn' ? 'font-hind-siliguri font-bold' : 'font-rubik-maps'
                  }`}>
                    {t.heading2}
                  </span>
                </span>
                <br />
                {t.heading3}
              </h1>
            </div>

            {/* Description */}
            <p className={`text-lg md:text-xl lg:text-2xl font-outfit text-gray-700 leading-relaxed max-w-full lg:max-w-xl ${
              language === 'bn' ? 'font-hind-siliguri' : ''
            }`}>
              {t.description}
              <span className='font-bold text-cyan-600'>{t.descriptionBold}</span>
              {t.description2}
              <span className='text-gray-700 font-semibold'>{t.description2Bold}</span>
              {language === 'bn' && t.description3}
              {language === 'en' && '.'}
            </p>

            {/* Feature Pills */}
            <div className='flex flex-wrap justify-center lg:justify-start gap-3'>
              <div className='flex items-center gap-2 bg-white px-3 md:px-4 py-2 rounded-full shadow-md border border-cyan-100'>
                <CheckCircle className='w-4 md:w-5 h-4 md:h-5 text-green-500' />
                <span className={`text-xs md:text-sm font-semibold text-gray-700 ${
                  language === 'bn' ? 'font-hind-siliguri' : ''
                }`}>{t.feature1}</span>
              </div>
              <div className='flex items-center gap-2 bg-white px-3 md:px-4 py-2 rounded-full shadow-md border border-blue-100'>
                <Users className='w-4 md:w-5 h-4 md:h-5 text-blue-500' />
                <span className={`text-xs md:text-sm font-semibold text-gray-700 ${
                  language === 'bn' ? 'font-hind-siliguri' : ''
                }`}>{t.feature2}</span>
              </div>
              <div className='flex items-center gap-2 bg-white px-3 md:px-4 py-2 rounded-full shadow-md border border-cyan-100'>
                <Sparkles className='w-4 md:w-5 h-4 md:h-5 text-yellow-500' />
                <span className={`text-xs md:text-sm font-semibold text-gray-700 ${
                  language === 'bn' ? 'font-hind-siliguri' : ''
                }`}>{t.feature3}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className='flex flex-row items-center justify-center lg:justify-start gap-4 md:gap-6 pt-4 w-full'>
              <button
                onClick={() => scrollToSection('services')}
                className={`group relative cursor-pointer w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl text-white text-base md:text-lg font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  language === 'bn' ? 'font-hind-siliguri' : 'font-outfit'
                }`}
              >
                <div className='absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300 group-hover:from-cyan-600 group-hover:to-blue-700' />
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700' />
                <span className='relative z-10 flex items-center justify-center gap-2'>
                  {t.exploreServices}
                </span>
              </button>

              <button
                onClick={() => scrollToSection('join-network')}
                className={`cursor-pointer w-full sm:w-auto border-2 border-cyan-500 px-6 md:px-8 py-3 md:py-4 rounded-xl text-cyan-600 text-base md:text-lg font-semibold hover:bg-cyan-500 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  language === 'bn' ? 'font-hind-siliguri' : 'font-outfit'
                }`}
              >
                {t.joinAsVendor}
              </button>
            </div>
          </div>

          {/* Right Side - Modern Image Slider */}
          <div className='flex-1 relative w-full mt-8 lg:mt-0'>
            <div className='relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-cyan-500/20'>
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
                      alt={image.title[language]}
                      className='w-full h-full object-cover'
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.style.background = `linear-gradient(135deg, #00C0E8 0%, #0080A8 100%)`;
                      }}
                    />
                    
                    {/* Enhanced Overlay */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent' />
                    
                    {/* Image Info with Modern Card */}
                    <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8'>
                      <div className='bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20'>
                        <h3 className={`text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-white ${
                          language === 'bn' ? 'font-hind-siliguri' : 'font-outfit'
                        }`}>
                          {image.title[language]}
                        </h3>
                        <p className={`text-base md:text-lg text-white/90 ${
                          language === 'bn' ? 'font-hind-siliguri' : 'font-outfit'
                        }`}>
                          {image.description[language]}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modern Navigation Arrows */}
              <button
                onClick={prevSlide}
                className='absolute left-3 md:left-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-cyan-600 p-2 md:p-4 rounded-full transition-all duration-300 group shadow-xl hover:scale-110'
                aria-label='Previous slide'
              >
                <ChevronLeft size={20} className='md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform' />
              </button>

              <button
                onClick={nextSlide}
                className='absolute right-3 md:right-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-cyan-600 p-2 md:p-4 rounded-full transition-all duration-300 group shadow-xl hover:scale-110'
                aria-label='Next slide'
              >
                <ChevronRight size={20} className='md:w-6 md:h-6 group-hover:translate-x-1 transition-transform' />
              </button>

              {/* Modern Dot Indicators */}
              <div className='absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 bg-black/30 backdrop-blur-md px-3 md:px-4 py-2 md:py-3 rounded-full'>
                {eventImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentSlide
                        ? 'w-8 md:w-10 h-2 md:h-2.5 bg-gradient-to-r from-cyan-400 to-blue-500'
                        : 'w-2 md:w-2.5 h-2 md:h-2.5 bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Modern Floating Stats Cards */}
            <div className='hidden md:block absolute -bottom-4 lg:-bottom-8 -right-4 lg:-right-8 bg-white p-4 lg:p-6 rounded-2xl shadow-2xl z-10 border border-cyan-100 hover:scale-105 transition-transform duration-300'>
              <div className='flex items-center gap-3 lg:gap-4'>
                <div className='bg-gradient-to-br from-cyan-500 to-blue-600 p-3 lg:p-4 rounded-xl'>
                  <CheckCircle className='w-6 lg:w-8 h-6 lg:h-8 text-white' />
                </div>
                <div>
                  <p className='font-bold text-xl lg:text-2xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent'>
                    {language === 'bn' ? '৫০০+' : '500+'}
                  </p>
                  <p className={`text-gray-600 text-xs lg:text-sm font-medium ${
                    language === 'bn' ? 'font-hind-siliguri' : ''
                  }`}>
                    {t.successfulEvents}
                  </p>
                </div>
              </div>
            </div>

            <div className='hidden md:block absolute -top-4 lg:-top-8 -left-4 lg:-left-8 bg-white p-4 lg:p-6 rounded-2xl shadow-2xl z-10 border border-blue-100 hover:scale-105 transition-transform duration-300'>
              <div className='flex items-center gap-3 lg:gap-4'>
                <div className='bg-gradient-to-br from-blue-500 to-cyan-600 p-3 lg:p-4 rounded-xl'>
                  <Users className='w-6 lg:w-8 h-6 lg:h-8 text-white' />
                </div>
                <div>
                  <p className='font-bold text-xl lg:text-2xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
                    {language === 'bn' ? '২০০+' : '200+'}
                  </p>
                  <p className={`text-gray-600 text-xs lg:text-sm font-medium ${
                    language === 'bn' ? 'font-hind-siliguri' : ''
                  }`}>
                    {t.trustedVendors}
                  </p>
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