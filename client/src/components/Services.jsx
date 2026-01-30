'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, TrendingUp, Star, Users, ArrowRight } from 'lucide-react';

const Container = ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
};

const ServiceCard = ({ 
  icon, 
  title, 
  description, 
  count, 
  countLabel, 
  avgRating, 
  totalReviews,
  href,
  isLoading,
  language 
}) => {
  return (
    <Link href={href}>
      <div className="group relative border-2 border-cyan-400/30 rounded-2xl p-4 sm:p-6 bg-white hover:border-cyan-500 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer h-full overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="text-5xl sm:text-7xl transform group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          </div>
          
          {/* Title */}
          <h3 className={`text-lg sm:text-2xl font-bold text-center mb-2 sm:mb-3 text-gray-900 group-hover:text-cyan-600 transition-colors ${
            language === 'bn' ? 'font-hind-siliguri' : 'font-outfit'
          }`}>
            {title}
          </h3>
          
          {/* Description */}
          <p className={`text-center text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 min-h-[40px] sm:min-h-[48px] ${
            language === 'bn' ? 'font-hind-siliguri' : ''
          }`}>
            {description}
          </p>
          
          {/* Stats */}
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-cyan-500" />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-end pt-3 sm:pt-4 border-t border-gray-200 group-hover:border-cyan-300 transition-colors">
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />
                    <span className="text-xl sm:text-3xl font-bold text-cyan-500 group-hover:text-cyan-600 transition-colors">
                      {count}
                    </span>
                  </div>
                  <div className={`text-[10px] sm:text-xs text-gray-600 font-medium mt-1 ${
                    language === 'bn' ? 'font-hind-siliguri' : ''
                  }`}>
                    {countLabel}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-xl sm:text-3xl font-bold text-yellow-500">
                      {avgRating}
                    </span>
                  </div>
                  <div className={`text-[10px] sm:text-xs text-gray-600 font-medium mt-1 ${
                    language === 'bn' ? 'font-hind-siliguri' : ''
                  }`}>
                    {totalReviews} {language === 'bn' ? 'রিভিউ' : 'Reviews'}
                  </div>
                </div>
              </div>

              {/* Hover Arrow */}
              <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 text-cyan-600 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className={`text-xs sm:text-sm font-semibold ${
                  language === 'bn' ? 'font-hind-siliguri' : ''
                }`}>
                  {language === 'bn' ? 'সেবা দেখুন' : 'Explore Services'}
                </span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </>
          )}
        </div>

        {/* Decorative Corner Element */}
        <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-bl-full transform translate-x-4 -translate-y-4 group-hover:scale-150 transition-transform duration-500" />
      </div>
    </Link>
  );
};

const Services = () => {
  const [servicesData, setServicesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("en");

  // Translations
  const translations = {
    en: {
      badge: 'TRENDING SERVICES',
      heading1: 'Our Professional',
      heading2: 'Services',
      description: 'Connect with trusted event professionals for every aspect of your event',
      totalProviders: 'Total Providers',
      averageRating: 'Average Rating',
      reviews: 'Reviews',
      providers: 'Providers',
      serviceCategories: {
        'Production Houses': {
          title: 'Production Houses',
          description: 'Full event production services including sound, lighting, and stage management'
        },
        'Community Centers': {
          title: 'Community Centers',
          description: 'Perfect event venues with all necessary facilities and amenities'
        },
        'Event Management': {
          title: 'Event Management',
          description: 'Professional event planners and coordinators for seamless execution'
        },
        'Photographers': {
          title: 'Photographers',
          description: 'Capture your special moments with professional photography services'
        },
        'Cinematographers': {
          title: 'Cinematographers',
          description: 'Professional video services to create lasting memories of your event'
        },
        'Cooks & Caterers': {
          title: 'Cooks & Caterers',
          description: 'Delicious catering options from professional chefs and catering services'
        }
      }
    },
    bn: {
      badge: 'জনপ্রিয় সেবা',
      heading1: 'আমাদের পেশাদার',
      heading2: 'সেবা সমূহ',
      description: 'আপনার ইভেন্টের প্রতিটি দিকের জন্য বিশ্বস্ত ইভেন্ট পেশাদারদের সাথে সংযুক্ত হন',
      totalProviders: 'মোট প্রদানকারী',
      averageRating: 'গড় রেটিং',
      reviews: 'রিভিউ',
      providers: 'প্রদানকারী',
      serviceCategories: {
        'Production Houses': {
          title: 'প্রোডাকশন হাউস',
          description: 'সাউন্ড, লাইটিং এবং স্টেজ ম্যানেজমেন্ট সহ সম্পূর্ণ ইভেন্ট প্রোডাকশন সেবা'
        },
        'Community Centers': {
          title: 'কমিউনিটি সেন্টার',
          description: 'সমস্ত প্রয়োজনীয় সুবিধা এবং সুবিধাসহ নিখুঁত ইভেন্ট ভেন্যু'
        },
        'Event Management': {
          title: 'ইভেন্ট ম্যানেজমেন্ট',
          description: 'নির্বিঘ্ন সম্পাদনের জন্য পেশাদার ইভেন্ট পরিকল্পনাকারী এবং সমন্বয়কারী'
        },
        'Photographers': {
          title: 'ফটোগ্রাফার',
          description: 'পেশাদার ফটোগ্রাফি সেবার মাধ্যমে আপনার বিশেষ মুহূর্তগুলি ক্যাপচার করুন'
        },
        'Cinematographers': {
          title: 'সিনেমাটোগ্রাফার',
          description: 'আপনার ইভেন্টের স্থায়ী স্মৃতি তৈরি করতে পেশাদার ভিডিও সেবা'
        },
        'Cooks & Caterers': {
          title: 'রাঁধুনি ও ক্যাটারার',
          description: 'পেশাদার শেফ এবং ক্যাটারিং সেবা থেকে সুস্বাদু খাবারের বিকল্প'
        }
      }
    }
  };

  const t = translations[language];

  // Service categories configuration
  const serviceCategories = [
    {
      id: 'Production Houses',
      icon: '🎬',
      href: '/production-houses'
    },
    {
      id: 'Community Centers',
      icon: '🏛️',
      href: '/community-centers'
    },
    {
      id: 'Event Management',
      icon: '📋',
      href: '/event-management'
    },
    {
      id: 'Photographers',
      icon: '📸',
      href: '/photographers'
    },
    {
      id: 'Cinematographers',
      icon: '🎥',
      href: '/cinematographers'
    },
    {
      id: 'Cooks & Caterers',
      icon: '👨‍🍳',
      href: '/cooks-caterers'
    }
  ];

  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferredLanguage");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    // Poll for language changes
    const interval = setInterval(() => {
      const currentLanguage = localStorage.getItem("preferredLanguage") || "en";
      if (currentLanguage !== language) {
        setLanguage(currentLanguage);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [language]);

  useEffect(() => {
    fetchServicesStats();
  }, []);

  const fetchServicesStats = async () => {
    try {
      setLoading(true);
      const statsPromises = serviceCategories.map(async (category) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API}/services/allservices?serviceCategory=${encodeURIComponent(category.id)}`
          );
          
          const data = await response.json();
          
          if (data.success && data.data) {
            const services = data.data;
            const count = services.length;
            
            const totalRating = services.reduce((sum, service) => sum + (service.rating || 0), 0);
            const avgRating = count > 0 ? (totalRating / count).toFixed(1) : '0.0';
            
            const totalReviews = services.reduce((sum, service) => sum + (service.reviewCount || 0), 0);
            
            return {
              category: category.id,
              count,
              avgRating,
              totalReviews
            };
          }
          
          return {
            category: category.id,
            count: 0,
            avgRating: '0.0',
            totalReviews: 0
          };
        } catch (error) {
          console.error(`Error fetching ${category.id}:`, error);
          return {
            category: category.id,
            count: 0,
            avgRating: '0.0',
            totalReviews: 0
          };
        }
      });

      const results = await Promise.all(statsPromises);
      
      const statsMap = results.reduce((acc, stat) => {
        acc[stat.category] = stat;
        return acc;
      }, {});
      
      setServicesData(statsMap);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services stats:', error);
      setLoading(false);
    }
  };

  // Convert numbers to Bengali
  const toBengaliNumber = (num) => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).split('').map(digit => {
      return digit >= '0' && digit <= '9' ? bengaliDigits[digit] : digit;
    }).join('');
  };

  const formatNumber = (num) => {
    return language === 'bn' ? toBengaliNumber(num) : num;
  };

  return (
    <section id="services" className="py-12 md:py-20 scroll-mt-24 bg-gradient-to-b from-white via-cyan-50/30 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-cyan-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-blue-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <Container>
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 relative z-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 px-4 md:px-6 py-2 rounded-full mb-4 md:mb-6">
            <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-white" />
            <span className={`text-white font-semibold text-xs md:text-sm uppercase tracking-wide ${
              language === 'bn' ? 'font-hind-siliguri' : ''
            }`}>
              {t.badge}
            </span>
          </div>
          
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 ${
            language === 'bn' ? 'font-hind-siliguri' : 'font-outfit'
          }`}>
            {t.heading1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">{t.heading2}</span>
          </h2>
          
          <p className={`text-base md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto px-4 ${
            language === 'bn' ? 'font-hind-siliguri' : 'font-outfit'
          }`}>
            {t.description}
          </p>
          
          {/* Stats Bar */}
          {!loading && (
            <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-4 md:gap-8 px-4">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-cyan-600">
                  {formatNumber(Object.values(servicesData).reduce((sum, stat) => sum + stat.count, 0))}+
                </div>
                <div className={`text-xs md:text-sm text-gray-600 font-medium ${
                  language === 'bn' ? 'font-hind-siliguri' : ''
                }`}>
                  {t.totalProviders}
                </div>
              </div>
              <div className="w-px h-10 md:h-12 bg-gray-300" />
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-yellow-500">
                  {formatNumber((Object.values(servicesData).reduce((sum, stat) => sum + parseFloat(stat.avgRating), 0) / serviceCategories.length).toFixed(1))}★
                </div>
                <div className={`text-xs md:text-sm text-gray-600 font-medium ${
                  language === 'bn' ? 'font-hind-siliguri' : ''
                }`}>
                  {t.averageRating}
                </div>
              </div>
              <div className="w-px h-10 md:h-12 bg-gray-300" />
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-600">
                  {formatNumber(Object.values(servicesData).reduce((sum, stat) => sum + stat.totalReviews, 0))}+
                </div>
                <div className={`text-xs md:text-sm text-gray-600 font-medium ${
                  language === 'bn' ? 'font-hind-siliguri' : ''
                }`}>
                  {t.reviews}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Services Grid - 2 columns on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-12 relative z-10">
          {serviceCategories.map((service, index) => {
            const stats = servicesData[service.id] || { count: 0, avgRating: '0.0', totalReviews: 0 };
            const categoryData = t.serviceCategories[service.id];
            
            return (
              <div
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ServiceCard
                  icon={service.icon}
                  title={categoryData.title}
                  description={categoryData.description}
                  count={formatNumber(stats.count)}
                  countLabel={t.providers}
                  avgRating={formatNumber(stats.avgRating)}
                  totalReviews={formatNumber(stats.totalReviews)}
                  href={service.href}
                  isLoading={loading}
                  language={language}
                />
              </div>
            );
          })}
        </div>
      </Container>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default Services;