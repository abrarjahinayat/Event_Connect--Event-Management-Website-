'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  MapPin, Star, CheckCircle, XCircle, Phone, Mail, Clock, 
  Award, Shield, Users, ChevronLeft, ChevronRight, ArrowLeft,
  Camera, Video, Mic, Lightbulb, Music, Edit, Loader2, Speaker,
  Lock, Info, Calendar, DollarSign, X, CreditCard, Wallet
} from 'lucide-react';

// Image Slider Component
const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative h-[300px] md:h-[500px] w-full overflow-hidden rounded-2xl">
      <img 
        src={images[currentIndex] || '/placeholder.jpg'} 
        alt={`Slide ${currentIndex + 1}`}
        className="w-full h-full object-cover"
      />

      {images.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all"
          >
            <ChevronLeft size={20} className="md:w-6 md:h-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all"
          >
            <ChevronRight size={20} className="md:w-6 md:h-6" />
          </button>

          <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 md:gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 md:h-2 rounded-full transition-all ${
                  index === currentIndex ? 'w-6 md:w-8 bg-white' : 'w-1.5 md:w-2 bg-white/60'
                }`}
              />
            ))}
          </div>

          <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-black/70 text-white px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
};

// 🎯 Portfolio Gallery Component
const PortfolioGallery = ({ portfolio }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [language, setLanguage] = useState('en');

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

  const translations = {
    en: {
      title: 'Portfolio / Past Work',
    },
    bn: {
      title: 'পোর্টফোলিও / পূর্ববর্তী কাজ',
    }
  };

  const t = translations[language];

  if (!portfolio || portfolio.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Camera className="text-purple-600" size={20} />
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{t.title}</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {portfolio.map((item, index) => (
          <div 
            key={index} 
            className="group cursor-pointer"
            onClick={() => setSelectedImage(item)}
          >
            <div className="relative overflow-hidden rounded-lg aspect-video bg-gray-100">
              {item.image ? (
                <>
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="text-white" size={24} />
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="text-gray-400" size={32} />
                </div>
              )}
              {item.category && (
                <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-semibold">
                  {item.category}
                </div>
              )}
            </div>
            <div className="mt-2">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">{item.title}</h3>
              <p className="text-xs md:text-sm text-gray-600 line-clamp-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70"
          >
            <X size={24} />
          </button>
          <div className="max-w-4xl w-full">
            {selectedImage.image && (
              <img 
                src={selectedImage.image} 
                alt={selectedImage.title}
                className="w-full rounded-lg"
              />
            )}
            <div className="mt-4 text-white">
              <h3 className="text-xl md:text-2xl font-bold">{selectedImage.title}</h3>
              <p className="text-gray-300 mt-2 text-sm md:text-base">{selectedImage.description}</p>
              {selectedImage.category && (
                <span className="inline-block mt-2 bg-purple-600 px-3 py-1 rounded-full text-sm">
                  {selectedImage.category}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Package Card Component
const PackageCard = ({ pkg, onSelect, isSelected, language }) => {
  const translations = {
    en: {
      popular: 'Most Popular',
      advance: 'Advance',
      full: 'Full Payment',
      selected: '✓ Selected',
      selectPackage: 'Select Package'
    },
    bn: {
      popular: 'সবচেয়ে জনপ্রিয়',
      advance: 'অগ্রিম',
      full: 'সম্পূর্ণ পেমেন্ট',
      selected: '✓ নির্বাচিত',
      selectPackage: 'প্যাকেজ নির্বাচন করুন'
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
    const formatted = price.toLocaleString();
    return language === 'bn' ? toBengaliNumber(formatted) : formatted;
  };

  return (
    <div className={`relative bg-white rounded-xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-all ${
      pkg.popular ? 'ring-2 ring-cyan-500 scale-105' : ''
    } ${isSelected ? 'ring-2 ring-green-500' : ''}`}>
      {pkg.popular && (
        <div className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 bg-cyan-500 text-white px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-semibold">
          {t.popular}
        </div>
      )}
      
      <div className="text-center mb-4 md:mb-6">
        <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-2xl md:text-4xl font-bold text-cyan-600">৳{formatPrice(pkg.price)}</span>
        </div>
        <p className="text-sm md:text-base text-gray-600 mt-1">{pkg.duration}</p>
        
        <div className="mt-2 bg-green-50 px-2 md:px-3 py-1 rounded-full inline-block">
          <p className="text-xs md:text-sm text-green-700 font-semibold">
            {t.advance}: ৳{formatPrice(Math.round(pkg.price * 0.05))} ({language === 'bn' ? toBengaliNumber('5') : '5'}%)
          </p>
        </div>
      </div>

      <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6">
        {pkg.features?.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-sm md:text-base text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <button 
        onClick={() => onSelect(pkg)}
        className={`w-full py-2 md:py-3 rounded-lg font-semibold transition-all text-sm md:text-base ${
          isSelected
            ? 'bg-green-600 text-white'
            : pkg.popular 
              ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
        }`}
      >
        {isSelected ? t.selected : t.selectPackage}
      </button>
    </div>
  );
};

// Review Card Component
const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
      <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
        <img 
          src={review.avatar || '/default-avatar.png'} 
          alt={review.name}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full"
        />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm md:text-base">{review.name}</h4>
          <p className="text-xs md:text-sm text-gray-500">{review.date}</p>
        </div>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={14} 
              className={`md:w-4 md:h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
      </div>
      <p className="text-sm md:text-base text-gray-700 leading-relaxed">{review.comment}</p>
    </div>
  );
};

// 🎯 UPDATED: Ask for Booking Form Component with Event Time and Payment Options
const AskForBookingForm = ({ service, selectedPackage, onSuccess }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    eventDate: '',
    eventTime: '', // 🎯 NEW FIELD
    eventAddress: '',
    eventCity: '',
    specialRequests: '',
    paymentType: 'advance' // 🎯 NEW FIELD: 'advance' (5%) or 'full' (100%)
  });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('en');

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

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      setFormData(prev => ({
        ...prev,
        customerName: parsedUser.name || '',
        customerEmail: parsedUser.email || '',
        customerPhone: parsedUser.phone || ''
      }));
    }
  }, []);

  const translations = {
    en: {
      selectedPackage: 'Selected Package',
      totalPrice: 'Total Price',
      advancePayment: 'Advance Payment (5%)',
      fullPayment: 'Full Payment (100%)',
      paymentOption: 'Payment Option',
      advanceOption: 'Pay 5% Advance',
      fullOption: 'Pay Full Amount',
      advanceDesc: 'Pay ৳{amount} now, remaining ৳{remaining} after event confirmation',
      fullDesc: 'Pay full ৳{amount} now (No remaining payment)',
      name: 'Your Full Name',
      email: 'Email Address',
      phone: 'Phone Number (01XXXXXXXXX)',
      eventDate: 'Event Date',
      eventTime: 'Event Time',
      eventAddress: 'Event Address/Venue',
      city: 'City',
      specialRequests: 'Special Requests or Additional Information (Optional)',
      askBooking: 'Ask for Booking',
      submitting: 'Submitting Request...',
      bookingProcess: 'Booking Process',
      step1: 'Submit your booking request',
      step2: 'Admin will review within 1 hour',
      step3: 'You\'ll receive a payment link if approved',
      step4: 'Pay chosen amount to confirm booking',
      step5: 'Vendor contact details will be shared after payment',
      loginRequired: '❌ Please login to submit booking request',
      selectPackage: '❌ Please select a package first',
      fillFields: '❌ Please fill all required fields',
      required: '*'
    },
    bn: {
      selectedPackage: 'নির্বাচিত প্যাকেজ',
      totalPrice: 'মোট মূল্য',
      advancePayment: 'অগ্রিম পেমেন্ট (৫%)',
      fullPayment: 'সম্পূর্ণ পেমেন্ট (১০০%)',
      paymentOption: 'পেমেন্ট অপশন',
      advanceOption: '৫% অগ্রিম পে করুন',
      fullOption: 'সম্পূর্ণ টাকা পে করুন',
      advanceDesc: 'এখন ৳{amount} পে করুন, বাকি ৳{remaining} ইভেন্ট নিশ্চিতকরণের পরে',
      fullDesc: 'এখন সম্পূর্ণ ৳{amount} পে করুন (কোন বাকি পেমেন্ট নেই)',
      name: 'আপনার পূর্ণ নাম',
      email: 'ইমেইল ঠিকানা',
      phone: 'ফোন নম্বর (০১XXXXXXXXX)',
      eventDate: 'ইভেন্টের তারিখ',
      eventTime: 'ইভেন্টের সময়',
      eventAddress: 'ইভেন্ট ঠিকানা/ভেন্যু',
      city: 'শহর',
      specialRequests: 'বিশেষ অনুরোধ বা অতিরিক্ত তথ্য (ঐচ্ছিক)',
      askBooking: 'বুকিং এর জন্য জিজ্ঞাসা করুন',
      submitting: 'অনুরোধ জমা দেওয়া হচ্ছে...',
      bookingProcess: 'বুকিং প্রক্রিয়া',
      step1: 'আপনার বুকিং অনুরোধ জমা দিন',
      step2: 'অ্যাডমিন ১ ঘণ্টার মধ্যে পর্যালোচনা করবে',
      step3: 'অনুমোদিত হলে পেমেন্ট লিঙ্ক পাবেন',
      step4: 'বুকিং নিশ্চিত করতে নির্বাচিত পরিমাণ পে করুন',
      step5: 'পেমেন্টের পরে বিক্রেতার যোগাযোগের বিবরণ শেয়ার করা হবে',
      loginRequired: '❌ বুকিং অনুরোধ জমা দিতে লগইন করুন',
      selectPackage: '❌ প্রথমে একটি প্যাকেজ নির্বাচন করুন',
      fillFields: '❌ সমস্ত প্রয়োজনীয় ক্ষেত্র পূরণ করুন',
      required: '*'
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
    const formatted = price.toLocaleString();
    return language === 'bn' ? toBengaliNumber(formatted) : formatted;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert(t.loginRequired);
      window.location.href = '/user/login';
      return;
    }

    if (!selectedPackage) {
      alert(t.selectPackage);
      return;
    }

    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone || 
        !formData.eventDate || !formData.eventTime || !formData.eventAddress || !formData.eventCity) {
      alert(t.fillFields);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/booking/ask-for-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: service._id,
          userId: user._id || user.id,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          eventDate: formData.eventDate,
          eventTime: formData.eventTime, // 🎯 NEW FIELD
          eventAddress: formData.eventAddress,
          eventCity: formData.eventCity,
          selectedPackage: {
            name: selectedPackage.name,
            price: selectedPackage.price,
            features: selectedPackage.features
          },
          specialRequests: formData.specialRequests,
          paymentType: formData.paymentType // 🎯 NEW FIELD
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ ' + data.message);
        
        if (onSuccess) {
          onSuccess(data.data);
        }
        
        setFormData({
          ...formData,
          eventDate: '',
          eventTime: '',
          eventAddress: '',
          eventCity: '',
          specialRequests: ''
        });
      } else {
        alert('❌ ' + data.message);
      }
    } catch (error) {
      console.error('Booking request error:', error);
      alert('❌ Failed to submit booking request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate payment amounts
  const advanceAmount = selectedPackage ? Math.round(selectedPackage.price * 0.05) : 0;
  const remainingAmount = selectedPackage ? selectedPackage.price - advanceAmount : 0;
  const fullAmount = selectedPackage ? selectedPackage.price : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
      {selectedPackage && (
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
          <p className="font-semibold text-cyan-900 mb-2 text-sm md:text-base">{t.selectedPackage}:</p>
          <p className="text-base md:text-lg font-bold text-cyan-700">{selectedPackage.name}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs md:text-sm text-gray-600">{t.totalPrice}:</span>
            <span className="text-lg md:text-xl font-bold text-gray-900">৳{formatPrice(selectedPackage.price)}</span>
          </div>
          
          {/* 🎯 NEW: Payment Type Selection */}
          <div className="mt-4 space-y-2">
            <p className="font-semibold text-gray-900 text-sm md:text-base">{t.paymentOption}:</p>
            
            {/* Advance Payment Option */}
            <label className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
              formData.paymentType === 'advance' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-green-300'
            }`}>
              <input 
                type="radio" 
                name="paymentType" 
                value="advance"
                checked={formData.paymentType === 'advance'}
                onChange={handleChange}
                className="mt-1 w-4 h-4 md:w-5 md:h-5"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="text-green-600" size={18} />
                  <span className="font-semibold text-gray-900 text-sm md:text-base">{t.advanceOption}</span>
                </div>
                <p className="text-xs md:text-sm text-gray-600">
                  {t.advanceDesc
                    .replace('{amount}', formatPrice(advanceAmount))
                    .replace('{remaining}', formatPrice(remainingAmount))}
                </p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs md:text-sm text-green-700">
                    {language === 'bn' ? 'এখন পে করুন' : 'Pay Now'}:
                  </span>
                  <span className="text-base md:text-lg font-bold text-green-700">
                    ৳{formatPrice(advanceAmount)}
                  </span>
                </div>
              </div>
            </label>

            {/* Full Payment Option */}
            <label className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
              formData.paymentType === 'full' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}>
              <input 
                type="radio" 
                name="paymentType" 
                value="full"
                checked={formData.paymentType === 'full'}
                onChange={handleChange}
                className="mt-1 w-4 h-4 md:w-5 md:h-5"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="text-blue-600" size={18} />
                  <span className="font-semibold text-gray-900 text-sm md:text-base">{t.fullOption}</span>
                  <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {language === 'bn' ? 'প্রস্তাবিত' : 'Recommended'}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-gray-600">
                  {t.fullDesc.replace('{amount}', formatPrice(fullAmount))}
                </p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs md:text-sm text-blue-700">
                    {language === 'bn' ? 'এখন পে করুন' : 'Pay Now'}:
                  </span>
                  <span className="text-base md:text-lg font-bold text-blue-700">
                    ৳{formatPrice(fullAmount)}
                  </span>
                </div>
              </div>
            </label>
          </div>
        </div>
      )}

      <input 
        type="text" 
        name="customerName"
        value={formData.customerName}
        onChange={handleChange}
        placeholder={`${t.name} ${t.required}`}
        required
        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm md:text-base"
      />
      
      <input 
        type="email" 
        name="customerEmail"
        value={formData.customerEmail}
        onChange={handleChange}
        placeholder={`${t.email} ${t.required}`}
        required
        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm md:text-base"
      />
      
      <input 
        type="tel" 
        name="customerPhone"
        value={formData.customerPhone}
        onChange={handleChange}
        placeholder={`${t.phone} ${t.required}`}
        required
        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm md:text-base"
      />
      
      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">{t.eventDate} {t.required}</label>
        <input 
          type="date" 
          name="eventDate"
          value={formData.eventDate}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          required
          className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm md:text-base"
        />
      </div>

      {/* 🎯 NEW: Event Time Field */}
      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">{t.eventTime} {t.required}</label>
        <input 
          type="time" 
          name="eventTime"
          value={formData.eventTime}
          onChange={handleChange}
          required
          className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm md:text-base"
        />
      </div>

      <input 
        type="text" 
        name="eventAddress"
        value={formData.eventAddress}
        onChange={handleChange}
        placeholder={`${t.eventAddress} ${t.required}`}
        required
        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm md:text-base"
      />

      <input 
        type="text" 
        name="eventCity"
        value={formData.eventCity}
        onChange={handleChange}
        placeholder={`${t.city} ${t.required}`}
        required
        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm md:text-base"
      />
      
      <textarea 
        name="specialRequests"
        value={formData.specialRequests}
        onChange={handleChange}
        placeholder={t.specialRequests}
        rows={4}
        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none text-sm md:text-base"
      />

      <button 
        type="submit"
        disabled={loading || !selectedPackage}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 md:py-4 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
            {t.submitting}
          </>
        ) : (
          <>
            <Calendar className="w-4 h-4 md:w-5 md:h-5" />
            {t.askBooking}
          </>
        )}
      </button>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs md:text-sm text-blue-800">
            <p className="font-semibold mb-1">{t.bookingProcess}:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>{t.step1}</li>
              <li>{t.step2}</li>
              <li>{t.step3}</li>
              <li>{t.step4}</li>
              <li>{t.step5}</li>
            </ol>
          </div>
        </div>
      </div>
    </form>
  );
};

// Main Details Page Component
export default function ProductionHouseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [language, setLanguage] = useState('en');
  
  const identifier = params.id;

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

  useEffect(() => {
    if (language === 'bn') {
      document.body.classList.add('font-hind-siliguri');
      document.body.classList.remove('font-outfit');
    } else {
      document.body.classList.add('font-outfit');
      document.body.classList.remove('font-hind-siliguri');
    }
  }, [language]);

  useEffect(() => {
    fetchServiceDetails();
  }, [identifier]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/services/${identifier}`
      );
      
      const data = await response.json();
      
      if (data.success) {
        console.log('📦 Service data:', data.data);
        console.log('📸 Portfolio:', data.data.portfolio);
        setHouse(data.data);
      } else {
        console.error('Failed to fetch service:', data.message);
      }
    } catch (error) {
      console.error('Error fetching service details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setShowBookingForm(true);
    
    setTimeout(() => {
      document.getElementById('booking-section')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleBookingSuccess = (bookingData) => {
    setTimeout(() => {
      router.push('/user/booking');
    }, 2000);
  };

  const iconMap = {
    Camera: Camera,
    Video: Video,
    Mic: Mic,
    Lightbulb: Lightbulb,
    Music: Music,
    Edit: Edit,
    Sound: Speaker,
    Light: Lightbulb,
    Speaker: Speaker
  };

  const translations = {
    en: {
      backToListings: 'Back to Listings',
      available: 'Available',
      booked: 'Booked',
      reviews: 'reviews',
      about: 'About',
      keyFeatures: 'Key Features',
      servicesOffered: 'Services Offered',
      pricingPackages: 'Pricing Packages',
      selectPackage: 'Select a package to proceed with booking',
      clientReviews: 'Client Reviews',
      bookService: 'Book This Service',
      completeBooking: 'Complete Booking Request',
      contactHidden: 'Vendor Contact Hidden',
      contactSharedAfter: 'Contact details will be shared after:',
      adminApproval: '✓ Admin approval',
      paymentConfirmation: '✓ Payment confirmation',
      yearsExperience: 'Years Experience',
      happyClients: 'Happy Clients',
      fullyInsured: 'Fully Insured',
      selectPackageFirst: 'Select a package above to get started',
      advanceRequired: 'Only 5% advance payment required to confirm booking',
      serviceNotFound: 'Service Not Found',
      loadingDetails: 'Loading details...'
    },
    bn: {
      backToListings: 'তালিকায় ফিরে যান',
      available: 'উপলব্ধ',
      booked: 'বুক করা হয়েছে',
      reviews: 'রিভিউ',
      about: 'সম্পর্কে',
      keyFeatures: 'মূল বৈশিষ্ট্য',
      servicesOffered: 'প্রদত্ত সেবা',
      pricingPackages: 'মূল্য প্যাকেজ',
      selectPackage: 'বুকিং এগিয়ে নিতে একটি প্যাকেজ নির্বাচন করুন',
      clientReviews: 'ক্লায়েন্ট রিভিউ',
      bookService: 'এই সেবা বুক করুন',
      completeBooking: 'বুকিং অনুরোধ সম্পূর্ণ করুন',
      contactHidden: 'বিক্রেতার যোগাযোগ লুকানো',
      contactSharedAfter: 'যোগাযোগের বিবরণ পরে শেয়ার করা হবে:',
      adminApproval: '✓ অ্যাডমিন অনুমোদন',
      paymentConfirmation: '✓ পেমেন্ট নিশ্চিতকরণ',
      yearsExperience: '+ বছরের অভিজ্ঞতা',
      happyClients: '+ খুশি ক্লায়েন্ট',
      fullyInsured: 'সম্পূর্ণ বীমাকৃত',
      selectPackageFirst: 'শুরু করতে উপরে একটি প্যাকেজ নির্বাচন করুন',
      advanceRequired: 'বুকিং নিশ্চিত করতে শুধুমাত্র ৫% অগ্রিম পেমেন্ট প্রয়োজন',
      serviceNotFound: 'সেবা পাওয়া যায়নি',
      loadingDetails: 'বিস্তারিত লোড হচ্ছে...'
    }
  };

  const t = translations[language];

  const toBengaliNumber = (num) => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).split('').map(digit => {
      return digit >= '0' && digit <= '9' ? bengaliDigits[digit] : digit;
    }).join('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 md:w-16 md:h-16 animate-spin text-cyan-600 mx-auto mb-4" />
          <p className="text-gray-600 text-sm md:text-base">{t.loadingDetails}</p>
        </div>
      </div>
    );
  }

  if (!house) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{t.serviceNotFound}</h1>
          <button
            onClick={() => router.push('/photographers')}
            className="bg-cyan-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-cyan-700 text-sm md:text-base"
          >
            {t.backToListings}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
          <button
            onClick={() => router.push('/photographers')}
            className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold mb-3 md:mb-4 text-sm md:text-base"
          >
            <ArrowLeft size={18} />
            {t.backToListings}
          </button>
          <ImageSlider images={house.images?.length > 0 ? house.images : house.image || ['/placeholder.jpg']} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          <div className="lg:col-span-2 space-y-4 md:space-y-8">
            {/* Header Info */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
              {/* 🎯 NEW: Show profile picture for individual providers */}
              {house.profilePicture && (
                <div className="flex justify-end mb-4 md:mb-6">
                  <div className="relative">
                    <img
                      src={house.profilePicture}
                      alt={house.companyName}
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-cyan-500 shadow-lg"
                    />
                    {house.isVerified && (
                      <div className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full">
                        <CheckCircle size={20} />
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex items-start justify-between mb-3 md:mb-4 flex-wrap gap-3">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">{house.companyName}</h1>
                  {house.tagline && (
                    <p className="text-sm md:text-base text-gray-600 italic">{house.tagline}</p>
                  )}
                </div>
                {house.available || house.availability === 'Available' ? (
                  <span className="flex items-center gap-2 bg-green-100 text-green-700 px-3 md:px-4 py-1.5 md:py-2 rounded-full font-semibold text-sm md:text-base">
                    <CheckCircle size={18} />
                    {t.available}
                  </span>
                ) : (
                  <span className="flex items-center gap-2 bg-red-100 text-red-700 px-3 md:px-4 py-1.5 md:py-2 rounded-full font-semibold text-sm md:text-base">
                    <XCircle size={18} />
                    {t.booked}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-gray-600 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <Star size={18} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">
                    {language === 'bn' ? toBengaliNumber(house.rating || 0) : (house.rating || 0)}
                  </span>
                  <span>
                    ({language === 'bn' ? toBengaliNumber(house.reviewCount || 0) : (house.reviewCount || 0)} {t.reviews})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-cyan-600" />
                  <span className="text-sm md:text-base">{house.fullAddress || house.location}</span>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">{t.about}</h2>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4 md:mb-6">{house.aboutYourCompany}</p>
              
              {house.features && house.features.length > 0 && (
                <>
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm md:text-base">{t.keyFeatures}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                    {house.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-cyan-600 flex-shrink-0" />
                        <span className="text-sm md:text-base text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Services Section */}
            {house.services && house.services.length > 0 && (
              <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">{t.servicesOffered}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {house.services.map((service, index) => {
                    const Icon = iconMap[service.icon] || Camera;
                    return (
                      <div key={index} className="flex gap-3 md:gap-4">
                        <div className="bg-cyan-100 p-2 md:p-3 rounded-lg h-fit">
                          <Icon size={20} className="md:w-6 md:h-6 text-cyan-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">{service.title}</h3>
                          <p className="text-gray-600 text-xs md:text-sm">{service.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Portfolio Gallery */}
            <PortfolioGallery portfolio={house.portfolio} />

            {/* Pricing Packages */}
            {house.packages && house.packages.length > 0 && (
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 md:p-6 shadow-md">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">{t.pricingPackages}</h2>
                <p className="text-center text-gray-600 mb-4 md:mb-6 text-sm md:text-base">{t.selectPackage}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {house.packages.map((pkg, index) => (
                    <PackageCard 
                      key={index} 
                      pkg={pkg} 
                      onSelect={handlePackageSelect}
                      isSelected={selectedPackage?.name === pkg.name}
                      language={language}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            {house.reviews && house.reviews.length > 0 && (
              <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">{t.clientReviews}</h2>
                <div className="space-y-3 md:space-y-4">
                  {house.reviews.map((review) => (
                    <ReviewCard key={review.id || review._id} review={review} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Sidebar */}
          <div className="lg:col-span-1">
            <div id="booking-section" className="bg-white rounded-xl p-4 md:p-6 shadow-lg lg:sticky lg:top-8">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">
                {showBookingForm && selectedPackage ? t.completeBooking : t.bookService}
              </h3>
              
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
                <div className="text-center">
                  <Lock className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-2 md:mb-3" />
                  <p className="font-semibold text-gray-700 mb-1 md:mb-2 text-sm md:text-base">{t.contactHidden}</p>
                  <p className="text-xs md:text-sm text-gray-600">
                    {t.contactSharedAfter}
                  </p>
                  <ul className="text-xs text-gray-500 mt-2 space-y-1">
                    <li>{t.adminApproval}</li>
                    <li>{t.paymentConfirmation}</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 md:p-4 mb-4 md:mb-6 space-y-2 md:space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="text-cyan-600" size={18} />
                  <span className="text-xs md:text-sm text-gray-700">
                    {language === 'bn' ? toBengaliNumber('10') : '10'}{t.yearsExperience}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="text-cyan-600" size={18} />
                  <span className="text-xs md:text-sm text-gray-700">
                    {language === 'bn' ? toBengaliNumber(house.totalBookings || 500) : (house.totalBookings || 500)}{t.happyClients}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="text-cyan-600" size={18} />
                  <span className="text-xs md:text-sm text-gray-700">{t.fullyInsured}</span>
                </div>
              </div>

              {showBookingForm && selectedPackage ? (
                <AskForBookingForm 
                  service={house} 
                  selectedPackage={selectedPackage}
                  onSuccess={handleBookingSuccess}
                />
              ) : (
                <div className="text-center py-6 md:py-8">
                  <DollarSign className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-3 md:mb-4" />
                  <p className="text-gray-600 mb-2 text-sm md:text-base">{t.selectPackageFirst}</p>
                  <p className="text-xs md:text-sm text-gray-500">
                    {t.advanceRequired}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}