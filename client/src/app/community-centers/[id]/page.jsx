// File: src/app/community-centers/[id]/page.jsx

'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  MapPin, Star, CheckCircle, XCircle, Award, Shield, Users, ChevronLeft, 
  ChevronRight, ArrowLeft, Lock, CreditCard, AlertCircle
} from 'lucide-react';
import { communityCentersData } from '../data';

// Image Slider Component
const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-2xl">
      <img 
        src={images[currentIndex]} 
        alt={`Slide ${currentIndex + 1}`}
        className="w-full h-full object-cover"
      />

      <button 
        onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/60'
            }`}
          />
        ))}
      </div>

      <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

// Package Card Component
const PackageCard = ({ pkg }) => {
  return (
    <div className={`relative bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all ${
      pkg.popular ? 'ring-2 ring-cyan-500 scale-105' : ''
    }`}>
      {pkg.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
          Most Popular
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold text-cyan-600">৳{pkg.price.toLocaleString()}</span>
        </div>
        <p className="text-gray-600 mt-1">{pkg.duration}</p>
      </div>

      <ul className="space-y-3 mb-6">
        {pkg.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <button className={`w-full py-3 rounded-lg font-semibold transition-all ${
        pkg.popular 
          ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
      }`}>
        Select Package
      </button>
    </div>
  );
};

// Review Card Component
const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <div className="flex items-start gap-4 mb-4">
        <img 
          src={review.avatar} 
          alt={review.name}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{review.name}</h4>
          <p className="text-sm text-gray-500">{review.date}</p>
        </div>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
            />
          ))}
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
    </div>
  );
};

// Booking Form with Payment Component
const BookingFormWithPayment = ({ center }) => {
  const [step, setStep] = useState(1); // 1: Form, 2: Payment Confirmation
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    package: '',
    guests: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitForm = () => {
    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.date) {
      alert('Please fill in all required fields');
      return;
    }
    setStep(2); // Move to payment step
  };

  const handlePayDeposit = () => {
    // Simulate payment processing
    alert(`Payment of ৳${center.bookingDeposit.toLocaleString()} successful!\n\nVendor Contact Information:\nEmail: ${center.name.toLowerCase().replace(/\s/g, '')}@venue.com\nPhone: +880 1XXX-XXXXXX\n\nYou will receive full contact details via email shortly.`);
    console.log('Payment processed:', { formData, amount: center.bookingDeposit });
  };

  if (step === 2) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-cyan-600 text-white p-3 rounded-full">
              <CreditCard size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Payment Required</h4>
              <p className="text-sm text-gray-600">To unlock vendor contact information</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Booking Deposit:</span>
              <span className="text-2xl font-bold text-cyan-600">৳{center.bookingDeposit.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500">This amount will be deducted from your final payment</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-2">
              <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">After Payment You'll Receive:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Vendor's phone number</li>
                  <li>Vendor's email address</li>
                  <li>Office hours and address</li>
                  <li>Booking confirmation details</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={handlePayDeposit}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-4 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Lock size={20} />
            Pay ৳{center.bookingDeposit.toLocaleString()} & Get Contact Info
          </button>

          <button 
            onClick={() => setStep(1)}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition-all"
          >
            Back to Form
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          🔒 Secure payment processing. Your information is protected.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-2">
          <Lock size={20} className="text-cyan-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-cyan-800">
            <p className="font-semibold">Contact info locked</p>
            <p>Pay ৳{center.bookingDeposit.toLocaleString()} booking deposit to unlock vendor contact details</p>
          </div>
        </div>
      </div>

      <input 
        type="text" 
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Your Name *"
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      />
      <input 
        type="email" 
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email Address *"
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      />
      <input 
        type="tel" 
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone Number (01XXXXXXXXX) *"
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      />
      <input 
        type="date" 
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      />
      <input 
        type="number" 
        name="guests"
        value={formData.guests}
        onChange={handleChange}
        placeholder="Number of Guests"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      />
      <select 
        name="package"
        value={formData.package}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      >
        <option value="">Select Package</option>
        {center.packages.map((pkg, idx) => (
          <option key={idx} value={pkg.name}>{pkg.name} - ৳{pkg.price.toLocaleString()}</option>
        ))}
      </select>
      <textarea 
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Tell us about your event..."
        rows={4}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
      />
      <button 
        onClick={handleSubmitForm}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-4 rounded-lg transition-all shadow-md hover:shadow-lg"
      >
        Continue to Payment
      </button>
    </div>
  );
};

// Main Details Page Component
export default function CommunityCenterDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const centerId = parseInt(params.id);
  
  const center = communityCentersData.find(c => c.id === centerId);

  if (!center) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Community Center Not Found</h1>
          <button
            onClick={() => router.push('/community-centers')}
            className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700"
          >
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => router.push('/community-centers')}
            className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold mb-4"
          >
            <ArrowLeft size={20} />
            Back to Listings
          </button>
          <ImageSlider images={center.images} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Header Section */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{center.name}</h1>
                  <p className="text-gray-600 italic">{center.tagline}</p>
                </div>
                <div className="flex flex-col gap-2">
                  {center.available ? (
                    <span className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                      <CheckCircle size={20} />
                      Available
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold">
                      <XCircle size={20} />
                      Booked
                    </span>
                  )}
                  {center.verified && (
                    <span className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm">
                      <Shield size={16} />
                      Verified
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Star size={20} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">{center.rating}</span>
                  <span>({center.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-purple-600" />
                  <span className="font-semibold">Capacity: {center.capacity} guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={20} className="text-cyan-600" />
                  <span>{center.fullAddress}</span>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{center.about}</p>
              
              <h3 className="font-semibold text-gray-900 mb-3">Facilities & Amenities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {center.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-cyan-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {center.amenities.map((amenity, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Pricing Packages */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Pricing Packages</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {center.packages.map((pkg, index) => (
                  <PackageCard key={index} pkg={pkg} />
                ))}
              </div>
            </div>

            {/* Portfolio Gallery */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {center.portfolio.map((item) => (
                  <div key={item.id} className="relative group overflow-hidden rounded-lg aspect-square">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white font-semibold">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Client Reviews</h2>
              <div className="space-y-4">
                {center.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Book This Venue</h3>
              
              {/* Pricing Info */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-4 mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Starting Price</p>
                  <p className="text-3xl font-bold text-cyan-600 mb-2">৳{center.startingPrice.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Booking deposit: ৳{center.bookingDeposit.toLocaleString()}</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="text-cyan-600" size={20} />
                  <span className="text-sm text-gray-700">Verified Venue</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="text-cyan-600" size={20} />
                  <span className="text-sm text-gray-700">{center.reviewCount}+ Happy Clients</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="text-cyan-600" size={20} />
                  <span className="text-sm text-gray-700">Secure Booking</span>
                </div>
              </div>

              {/* Booking Form */}
              <BookingFormWithPayment center={center} />

             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}