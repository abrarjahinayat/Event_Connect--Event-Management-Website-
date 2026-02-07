'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MapPin, Star, CheckCircle, XCircle, DollarSign, Search, 
  Filter, X, Loader2, Shield, Award, TrendingUp, Sparkles
} from 'lucide-react';

// Photographer Card Component with Admin Rating
const ProductionHouseCard = ({ house, onViewDetails, language }) => {
  const adminRating = typeof house.vendorId?.adminRating === 'object' 
    ? (house.vendorId?.adminRating?.rating || 0)
    : (house.vendorId?.adminRating || house.adminRating || 0);

  const isVerified = house.vendorId?.isVerified || house.isVerified || false;

  const translations = {
    en: {
      available: 'Available',
      booked: 'Booked',
      verified: 'Verified',
      admin: 'Admin',
      startingAt: 'Starting at',
      viewDetails: 'View Details'
    },
    bn: {
      available: 'উপলব্ধ',
      booked: 'বুক করা',
      verified: 'যাচাইকৃত',
      admin: 'অ্যাডমিন',
      startingAt: 'শুরু',
      viewDetails: 'বিস্তারিত দেখুন'
    }
  };

  const t = translations[language];

  const toBengaliNumber = (num) => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).split('').map(digit => {
      return digit >= '0' && digit <= '9' ? bengaliDigits[digit] : digit;
    }).join('');
  };

  const formatPrice = (price) => {
    const formatted = price?.toLocaleString() || '0';
    return language === 'bn' ? toBengaliNumber(formatted) : formatted;
  };

  const formatRating = (rating) => {
    const formatted = rating.toString();
    return language === 'bn' ? toBengaliNumber(formatted) : formatted;
  };

  return (
    <div className={`group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 ${
      language === 'bn' ? 'font-hind-siliguri' : 'font-outfit'
    }`}>
      <div className="relative h-48 md:h-56 overflow-hidden bg-gray-100">
        <img 
          src={house.image?.[0] || house.images?.[0] || '/placeholder.jpg'} 
          alt={house.companyName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Simple Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Availability Badge - Top Right */}
        <div className="absolute top-2 md:top-3 right-2 md:right-3">
          {house.available || house.availability === 'Available' ? (
            <span className="flex items-center gap-1 bg-green-600 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold shadow-lg">
              <CheckCircle size={14} className="md:w-4 md:h-4" />
              {t.available}
            </span>
          ) : (
            <span className="flex items-center gap-1 bg-red-600 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold shadow-lg">
              <XCircle size={14} className="md:w-4 md:h-4" />
              {t.booked}
            </span>
          )}
        </div>

        {/* Verified Badge - Top Left */}
        {isVerified && (
          <div className="absolute top-2 md:top-3 left-2 md:left-3">
            <span className="flex items-center gap-1 bg-blue-600 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold shadow-lg">
              <Shield size={14} className="md:w-4 md:h-4" />
              {t.verified}
            </span>
          </div>
        )}

        {/* Admin Rating Badge */}
        {adminRating > 0 && (
          <div className={`absolute ${isVerified ? 'top-10 md:top-14' : 'top-2 md:top-3'} left-2 md:left-3`}>
            <span className="flex items-center gap-1 bg-orange-500 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold shadow-lg">
              <Award size={14} className="md:w-4 md:h-4" />
              {t.admin}: {formatRating(adminRating)}/5
            </span>
          </div>
        )}

        {/* User Rating Badge - Bottom Left */}
        <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3 bg-white px-2 md:px-3 py-1 rounded-full flex items-center gap-1 md:gap-1.5 shadow-lg">
          <Star size={14} className="md:w-4 md:h-4 fill-yellow-500 text-yellow-500" />
          <span className="font-bold text-gray-900 text-xs md:text-sm">{formatRating(house.rating || 0)}</span>
          <span className="text-gray-600 text-[10px] md:text-xs">({formatRating(house.reviewCount || 0)})</span>
        </div>
      </div>

      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between mb-2 gap-2">
          <h3 className="text-base md:text-lg font-bold text-gray-900 line-clamp-1 flex-1">
            {house.companyName}
          </h3>
          <div className="flex items-center gap-1 md:gap-1.5 flex-shrink-0">
            {isVerified && (
              <Shield size={16} className="md:w-5 md:h-5 text-blue-600" title={t.verified} />
            )}
            {adminRating > 0 && (
              <div className="flex items-center gap-0.5" title={`${t.admin}: ${adminRating}/5`}>
                <Award size={14} className="md:w-[18px] md:h-[18px] text-orange-500" />
                <span className="text-xs md:text-sm font-bold text-orange-600">{formatRating(adminRating)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2 text-gray-600 mb-3">
          <MapPin size={14} className="md:w-[16px] md:h-[16px] text-gray-500 flex-shrink-0" />
          <span className="text-xs md:text-sm truncate">{house.location}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
          {house.specialties?.slice(0, 3).map((specialty, index) => (
            <span 
              key={index}
              className="bg-gray-100 text-gray-700 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium"
            >
              {specialty}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1 md:gap-1.5">
            <DollarSign size={14} className="md:w-4 md:h-4 text-gray-500" />
            <span className="text-[10px] md:text-xs text-gray-500">{t.startingAt}</span>
            <span className="text-sm md:text-lg font-bold text-gray-900">
              ৳{formatPrice(house.startingPrice)}
            </span>
          </div>
        </div>

        <button 
          onClick={() => onViewDetails(house.slug || house._id)}
          className="w-full mt-3 md:mt-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 md:py-2.5 rounded-lg transition-colors duration-200 text-sm md:text-base"
        >
          {t.viewDetails}
        </button>
      </div>
    </div>
  );
};

export default function ProductionHousesPage() {
  const router = useRouter();
  const [language, setLanguage] = useState('en');
  
  // State
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('adminRating');
  const [filters, setFilters] = useState({
    availability: 'all',
    priceRange: [0, 500000],
    location: 'all',
    specialty: 'all',
    minRating: 0,
    verified: 'all',
    minAdminRating: 0
  });

  // Translations
  const translations = {
    en: {
      title: 'All Premium Event Management Services',
      subtitle: 'Professional Event Management Services',
      description: 'Find top-rated, admin-verified Event Management Services for your next project',
      search: 'Search by name, location, or specialty...',
      sortBy: 'Sort By',
      filters: 'Filters',
      resetAll: 'Reset All',
      availability: 'Availability',
      allStudios: 'All Studios',
      availableOnly: 'Available Only',
      bookedOnly: 'Booked Only',
      verificationStatus: 'Verification',
      allVendors: 'All Vendors',
      verifiedOnly: 'Verified Only',
      unverifiedOnly: 'Unverified Only',
      minAdminRating: 'Min Admin Rating',
      anyRating: 'Any Rating',
      starsPlus: '+ Stars',
      starsOnly: 'Stars Only',
      location: 'Location',
      allLocations: 'All Locations',
      specialty: 'Specialty',
      allSpecialties: 'All Specialties',
      minUserRating: 'Min User Rating',
      priceRange: 'Price Range',
      matchingResults: 'Results',
      availableNow: 'Available',
      verifiedVendors: 'Verified',
      avgAdminRating: 'Avg Rating',
      noResults: 'No Results Found',
      noResultsText: 'Try adjusting your filters or search query',
      clearFilters: 'Clear Filters',
      loading: 'Loading studios...',
      sortAdminRating: '🏆 Admin Rating',
      sortUserRating: '⭐ User Rating',
      sortPriceLow: '💰 Price: Low-High',
      sortPriceHigh: '💰 Price: High-Low',
      sortNewest: '🆕 Newest First'
    },
    bn: {
      title: 'প্রিমিয়াম প্রোডাকশন স্টুডিও',
      subtitle: 'পেশাদার ভিডিও প্রোডাকশন সেবা',
      description: 'আপনার পরবর্তী প্রজেক্টের জন্য শীর্ষ-রেটেড, যাচাইকৃত প্রোডাকশন হাউস খুঁজুন',
      search: 'নাম, অবস্থান বা বিশেষত্ব দিয়ে অনুসন্ধান করুন...',
      sortBy: 'সাজান',
      filters: 'ফিল্টার',
      resetAll: 'সব রিসেট',
      availability: 'উপলব্ধতা',
      allStudios: 'সব স্টুডিও',
      availableOnly: 'শুধু উপলব্ধ',
      bookedOnly: 'শুধু বুকড',
      verificationStatus: 'যাচাইকরণ',
      allVendors: 'সব বিক্রেতা',
      verifiedOnly: 'শুধু যাচাইকৃত',
      unverifiedOnly: 'অযাচাইকৃত',
      minAdminRating: 'সর্বনিম্ন রেটিং',
      anyRating: 'যেকোনো',
      starsPlus: '+ তারা',
      starsOnly: 'তারা শুধু',
      location: 'অবস্থান',
      allLocations: 'সব অবস্থান',
      specialty: 'বিশেষত্ব',
      allSpecialties: 'সব বিশেষত্ব',
      minUserRating: 'সর্বনিম্ন রেটিং',
      priceRange: 'মূল্য সীমা',
      matchingResults: 'ফলাফল',
      availableNow: 'উপলব্ধ',
      verifiedVendors: 'যাচাইকৃত',
      avgAdminRating: 'গড় রেটিং',
      noResults: 'কোনো ফলাফল নেই',
      noResultsText: 'আপনার ফিল্টার বা অনুসন্ধান পরিবর্তন করুন',
      clearFilters: 'ফিল্টার মুছুন',
      loading: 'লোড হচ্ছে...',
      sortAdminRating: '🏆 অ্যাডমিন রেটিং',
      sortUserRating: '⭐ ইউজার রেটিং',
      sortPriceLow: '💰 মূল্য: কম-বেশি',
      sortPriceHigh: '💰 মূল্য: বেশি-কম',
      sortNewest: '🆕 নতুন প্রথম'
    }
  };

  const t = translations[language];

  // Language detection
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    setLanguage(savedLanguage);

    const interval = setInterval(() => {
      const currentLanguage = localStorage.getItem('preferredLanguage') || 'en';
      if (currentLanguage !== language) {
        setLanguage(currentLanguage);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [language]);

  // Apply font based on language
  useEffect(() => {
    if (language === 'bn') {
      document.body.classList.add('font-hind-siliguri');
      document.body.classList.remove('font-outfit');
    } else {
      document.body.classList.add('font-outfit');
      document.body.classList.remove('font-hind-siliguri');
    }
  }, [language]);

  const toBengaliNumber = (num) => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).split('').map(digit => {
      return digit >= '0' && digit <= '9' ? bengaliDigits[digit] : digit;
    }).join('');
  };

  const formatNumber = (num) => {
    const formatted = num.toString();
    return language === 'bn' ? toBengaliNumber(formatted) : formatted;
  };

  const formatPrice = (price) => {
    const formatted = price.toLocaleString();
    return language === 'bn' ? toBengaliNumber(formatted) : formatted;
  };

  // Fetch services from API
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams({
        serviceCategory: 'Event Management',
        ...(filters.availability !== 'all' && { availability: filters.availability }),
        ...(filters.location !== 'all' && { location: filters.location }),
        ...(filters.minRating > 0 && { minRating: filters.minRating }),
        ...(searchQuery && { search: searchQuery }),
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/services/allservices?${queryParams}`
      );
      
      const data = await response.json();
      
      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refetch when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchServices();
    }, 500);

    return () => clearTimeout(timer);
  }, [filters, searchQuery]);

  // Get unique locations and specialties
  const locations = ['all', ...new Set(services.map(h => h.location).filter(Boolean))];
  const allSpecialties = ['all', ...new Set(services.flatMap(h => h.specialties || []))];

  const getAdminRating = (house) => {
    if (typeof house.vendorId?.adminRating === 'object') {
      return house.vendorId?.adminRating?.rating || 0;
    }
    return house.vendorId?.adminRating || house.adminRating || 0;
  };

  const getIsVerified = (house) => {
    return house.vendorId?.isVerified || house.isVerified || false;
  };

  // Filter and sort logic
  const filteredHouses = useMemo(() => {
    let filtered = services.filter(house => {
      const matchesSpecialty = filters.specialty === 'all' || 
                              house.specialties?.includes(filters.specialty);
      
      const isVerified = getIsVerified(house);
      const matchesVerified = filters.verified === 'all' || 
                             (filters.verified === 'verified' && isVerified) ||
                             (filters.verified === 'unverified' && !isVerified);
      
      const adminRating = getAdminRating(house);
      const matchesAdminRating = filters.minAdminRating === 0 || adminRating >= filters.minAdminRating;
      
      return matchesSpecialty && matchesVerified && matchesAdminRating;
    });

    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'adminRating':
          return getAdminRating(b) - getAdminRating(a);
        case 'userRating':
          return (b.rating || 0) - (a.rating || 0);
        case 'priceLow':
          return (a.startingPrice || 0) - (b.startingPrice || 0);
        case 'priceHigh':
          return (b.startingPrice || 0) - (a.startingPrice || 0);
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    return filtered;
  }, [services, filters.specialty, filters.verified, filters.minAdminRating, sortBy]);

  const handleViewDetails = (identifier) => {
    router.push(`/event-management/${identifier}`);
  };

  const resetFilters = () => {
    setFilters({
      availability: 'all',
      priceRange: [0, 500000],
      location: 'all',
      specialty: 'all',
      minRating: 0,
      verified: 'all',
      minAdminRating: 0
    });
    setSearchQuery('');
    setSortBy('adminRating');
  };

  const activeFiltersCount = () => {
    let count = 0;
    if (filters.availability !== 'all') count++;
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 500000) count++;
    if (filters.location !== 'all') count++;
    if (filters.specialty !== 'all') count++;
    if (filters.minRating > 0) count++;
    if (filters.verified !== 'all') count++;
    if (filters.minAdminRating > 0) count++;
    return count;
  };

  if (loading && services.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gray-50 ${
        language === 'bn' ? 'font-hind-siliguri' : 'font-outfit'
      }`}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 md:w-16 md:h-16 animate-spin text-gray-900 mx-auto mb-4" />
          <p className="text-gray-600 text-sm md:text-base">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${
      language === 'bn' ? 'font-hind-siliguri' : 'font-outfit'
    }`}>
      {/* Clean Hero Header */}
      <div className="bg-gray-900 text-white pt-24 md:pt-32 pb-12 md:pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 md:px-5 py-2 rounded-full mb-4 md:mb-5">
              <Sparkles size={16} className="md:w-5 md:h-5" />
              <span className="text-xs md:text-sm font-medium">{t.subtitle}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
              {t.title}
            </h1>
            <p className="text-gray-300 text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
              {t.description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Search, Sort, and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-5 mb-6 md:mb-8">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 md:pl-12 pr-10 md:pr-12 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all text-sm md:text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 md:px-5 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 font-medium text-gray-700 bg-white cursor-pointer text-sm md:text-base"
            >
              <option value="adminRating">{t.sortAdminRating}</option>
              <option value="userRating">{t.sortUserRating}</option>
              <option value="priceLow">{t.sortPriceLow}</option>
              <option value="priceHigh">{t.sortPriceHigh}</option>
              <option value="newest">{t.sortNewest}</option>
            </select>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 md:py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors relative text-sm md:text-base"
            >
              <Filter size={18} />
              <span className="hidden sm:inline">{t.filters}</span>
              {activeFiltersCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
                  {formatNumber(activeFiltersCount())}
                </span>
              )}
            </button>

            {/* Reset Filters Button */}
            {(activeFiltersCount() > 0 || searchQuery || sortBy !== 'adminRating') && (
              <button
                onClick={resetFilters}
                className="px-4 md:px-5 py-2.5 md:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm md:text-base"
              >
                {t.resetAll}
              </button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 md:mt-5 pt-4 md:pt-5 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Availability Filter */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  {t.availability}
                </label>
                <select
                  value={filters.availability}
                  onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm md:text-base"
                >
                  <option value="all">{t.allStudios}</option>
                  <option value="available">{t.availableOnly}</option>
                  <option value="booked">{t.bookedOnly}</option>
                </select>
              </div>

              {/* Verified Filter */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  {t.verificationStatus}
                </label>
                <select
                  value={filters.verified}
                  onChange={(e) => setFilters({ ...filters, verified: e.target.value })}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm md:text-base"
                >
                  <option value="all">{t.allVendors}</option>
                  <option value="verified">{t.verifiedOnly}</option>
                  <option value="unverified">{t.unverifiedOnly}</option>
                </select>
              </div>

              {/* Admin Rating Filter */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  {t.minAdminRating}
                </label>
                <select
                  value={filters.minAdminRating}
                  onChange={(e) => setFilters({ ...filters, minAdminRating: parseFloat(e.target.value) })}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm md:text-base"
                >
                  <option value="0">{t.anyRating}</option>
                  <option value="3">{formatNumber(3)}{t.starsPlus}</option>
                  <option value="4">{formatNumber(4)}{t.starsPlus}</option>
                  <option value="5">{formatNumber(5)} {t.starsOnly}</option>
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  {t.location}
                </label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm md:text-base"
                >
                  {locations.map(loc => (
                    <option key={loc} value={loc}>
                      {loc === 'all' ? t.allLocations : loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Specialty Filter */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  {t.specialty}
                </label>
                <select
                  value={filters.specialty}
                  onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm md:text-base"
                >
                  {allSpecialties.map(spec => (
                    <option key={spec} value={spec}>
                      {spec === 'all' ? t.allSpecialties : spec}
                    </option>
                  ))}
                </select>
              </div>

              {/* User Rating Filter */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  {t.minUserRating}
                </label>
                <select
                  value={filters.minRating}
                  onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm md:text-base"
                >
                  <option value="0">{t.anyRating}</option>
                  <option value="4.0">{formatNumber(4.0)}{t.starsPlus}</option>
                  <option value="4.5">{formatNumber(4.5)}{t.starsPlus}</option>
                  <option value="4.8">{formatNumber(4.8)}{t.starsPlus}</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  {t.priceRange}: ৳{formatPrice(filters.priceRange[0])} - ৳{formatPrice(filters.priceRange[1])}
                </label>
                <div className="flex gap-3 md:gap-4 items-center">
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    step="10000"
                    value={filters.priceRange[0]}
                    onChange={(e) => setFilters({ 
                      ...filters, 
                      priceRange: [parseInt(e.target.value), filters.priceRange[1]] 
                    })}
                    className="flex-1 accent-gray-900"
                  />
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    step="10000"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({ 
                      ...filters, 
                      priceRange: [filters.priceRange[0], parseInt(e.target.value)] 
                    })}
                    className="flex-1 accent-gray-900"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-5 mb-6 md:mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {formatNumber(filteredHouses.length)}
              </div>
              <div className="text-gray-600 text-xs md:text-sm font-medium">
                {t.matchingResults}
              </div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1">
                {formatNumber(filteredHouses.filter(h => h.available || h.availability === 'Available').length)}
              </div>
              <div className="text-gray-600 text-xs md:text-sm font-medium">{t.availableNow}</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
                {formatNumber(filteredHouses.filter(h => getIsVerified(h)).length)}
              </div>
              <div className="text-gray-600 text-xs md:text-sm font-medium">{t.verifiedVendors}</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-orange-600 mb-1">
                {filteredHouses.length > 0 
                  ? formatNumber((filteredHouses.reduce((sum, h) => sum + getAdminRating(h), 0) / filteredHouses.length).toFixed(1))
                  : formatNumber('0.0')}
              </div>
              <div className="text-gray-600 text-xs md:text-sm font-medium">{t.avgAdminRating}</div>
            </div>
          </div>
        </div>

        {/* Event Management Services Grid */}
        {filteredHouses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredHouses.map((house) => (
              <ProductionHouseCard 
                key={house._id} 
                house={house}
                onViewDetails={handleViewDetails}
                language={language}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 md:p-12 text-center">
            <div className="text-gray-300 mb-4">
              <Search size={48} className="md:w-16 md:h-16 mx-auto" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{t.noResults}</h3>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              {t.noResultsText}
            </p>
            <button
              onClick={resetFilters}
              className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 md:px-8 py-3 rounded-lg transition-colors text-sm md:text-base"
            >
              {t.clearFilters}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}