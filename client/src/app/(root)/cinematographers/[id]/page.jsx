'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  MapPin, Star, CheckCircle, XCircle, Phone, Mail, Clock, 
  Award, Shield, Users, ChevronLeft, ChevronRight, ArrowLeft,
  Camera, Video, Mic, Lightbulb, Music, Edit, Loader2, Speaker,
  Lock, Info, Calendar, DollarSign, X
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
    <div className="relative h-[500px] w-full overflow-hidden rounded-2xl">
      <img 
        src={images[currentIndex] || '/placeholder.jpg'} 
        alt={`Slide ${currentIndex + 1}`}
        className="w-full h-full object-cover"
      />

      {images.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
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
        </>
      )}
    </div>
  );
};

// 🎯 NEW: Portfolio Gallery Component
const PortfolioGallery = ({ portfolio }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!portfolio || portfolio.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <Camera className="text-purple-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-900">Portfolio / Past Work</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <Camera className="text-white" size={32} />
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="text-gray-400" size={48} />
                </div>
              )}
              {item.category && (
                <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-semibold">
                  {item.category}
                </div>
              )}
            </div>
            <div className="mt-2">
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
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
              <h3 className="text-2xl font-bold">{selectedImage.title}</h3>
              <p className="text-gray-300 mt-2">{selectedImage.description}</p>
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
const PackageCard = ({ pkg, onSelect, isSelected }) => {
  return (
    <div className={`relative bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all ${
      pkg.popular ? 'ring-2 ring-cyan-500 scale-105' : ''
    } ${isSelected ? 'ring-2 ring-green-500' : ''}`}>
      {pkg.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
          Most Popular
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold text-cyan-600">৳{pkg.price?.toLocaleString()}</span>
        </div>
        <p className="text-gray-600 mt-1">{pkg.duration}</p>
        
        <div className="mt-2 bg-green-50 px-3 py-1 rounded-full inline-block">
          <p className="text-sm text-green-700 font-semibold">
            Advance: ৳{Math.round(pkg.price * 0.1).toLocaleString()} (10%)
          </p>
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {pkg.features?.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <button 
        onClick={() => onSelect(pkg)}
        className={`w-full py-3 rounded-lg font-semibold transition-all ${
          isSelected
            ? 'bg-green-600 text-white'
            : pkg.popular 
              ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
        }`}
      >
        {isSelected ? '✓ Selected' : 'Select Package'}
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
          src={review.avatar || '/default-avatar.png'} 
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

// Ask for Booking Form Component
const AskForBookingForm = ({ service, selectedPackage, onSuccess }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    eventDate: '',
    eventAddress: '',
    eventCity: '',
    specialRequests: ''
  });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('❌ Please login to submit booking request');
      window.location.href = '/user/login';
      return;
    }

    if (!selectedPackage) {
      alert('❌ Please select a package first');
      return;
    }

    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone || 
        !formData.eventDate || !formData.eventAddress || !formData.eventCity) {
      alert('❌ Please fill all required fields');
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
          eventAddress: formData.eventAddress,
          eventCity: formData.eventCity,
          selectedPackage: {
            name: selectedPackage.name,
            price: selectedPackage.price,
            features: selectedPackage.features
          },
          specialRequests: formData.specialRequests
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {selectedPackage && (
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-4">
          <p className="font-semibold text-cyan-900 mb-2">Selected Package:</p>
          <p className="text-lg font-bold text-cyan-700">{selectedPackage.name}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-600">Total Price:</span>
            <span className="text-xl font-bold text-gray-900">৳{selectedPackage.price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-green-600">Advance Payment (10%):</span>
            <span className="text-lg font-bold text-green-700">
              ৳{Math.round(selectedPackage.price * 0.1).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      <input 
        type="text" 
        name="customerName"
        value={formData.customerName}
        onChange={handleChange}
        placeholder="Your Full Name *"
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      />
      
      <input 
        type="email" 
        name="customerEmail"
        value={formData.customerEmail}
        onChange={handleChange}
        placeholder="Email Address *"
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      />
      
      <input 
        type="tel" 
        name="customerPhone"
        value={formData.customerPhone}
        onChange={handleChange}
        placeholder="Phone Number (01XXXXXXXXX) *"
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
        <input 
          type="date" 
          name="eventDate"
          value={formData.eventDate}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        />
      </div>

      <input 
        type="text" 
        name="eventAddress"
        value={formData.eventAddress}
        onChange={handleChange}
        placeholder="Event Address/Venue *"
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      />

      <input 
        type="text" 
        name="eventCity"
        value={formData.eventCity}
        onChange={handleChange}
        placeholder="City *"
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      />
      
      <textarea 
        name="specialRequests"
        value={formData.specialRequests}
        onChange={handleChange}
        placeholder="Special Requests or Additional Information (Optional)"
        rows={4}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
      />

      <button 
        type="submit"
        disabled={loading || !selectedPackage}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-4 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting Request...
          </>
        ) : (
          <>
            <Calendar className="w-5 h-5" />
            Ask for Booking
          </>
        )}
      </button>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Booking Process:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Submit your booking request</li>
              <li>Admin will review within 1 hours</li>
              <li>You'll receive a payment link if approved</li>
              <li>Pay 10% advance to confirm booking</li>
              <li>Vendor contact details will be shared after payment</li>
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
  
  const identifier = params.id;

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-cyan-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!house) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <button
            onClick={() => router.push('/cinematographers')}
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
            onClick={() => router.push('/cinematographers')}
            className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold mb-4"
          >
            <ArrowLeft size={20} />
            Back to Listings
          </button>
          <ImageSlider images={house.images?.length > 0 ? house.images : house.image || ['/placeholder.jpg']} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Header Info */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{house.companyName}</h1>
                  {house.tagline && (
                    <p className="text-gray-600 italic">{house.tagline}</p>
                  )}
                </div>
                {house.available || house.availability === 'Available' ? (
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
              </div>

              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Star size={20} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">{house.rating || 0}</span>
                  <span>({house.reviewCount || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={20} className="text-cyan-600" />
                  <span>{house.fullAddress || house.location}</span>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{house.aboutYourCompany}</p>
              
              {house.features && house.features.length > 0 && (
                <>
                  <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {house.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle size={18} className="text-cyan-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Services Section */}
            {house.services && house.services.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Services Offered</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {house.services.map((service, index) => {
                    const Icon = iconMap[service.icon] || Camera;
                    return (
                      <div key={index} className="flex gap-4">
                        <div className="bg-cyan-100 p-3 rounded-lg h-fit">
                          <Icon size={24} className="text-cyan-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{service.title}</h3>
                          <p className="text-gray-600 text-sm">{service.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 🎯 Portfolio Gallery */}
            <PortfolioGallery portfolio={house.portfolio} />

            {/* Pricing Packages */}
            {house.packages && house.packages.length > 0 && (
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Pricing Packages</h2>
                <p className="text-center text-gray-600 mb-6">Select a package to proceed with booking</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {house.packages.map((pkg, index) => (
                    <PackageCard 
                      key={index} 
                      pkg={pkg} 
                      onSelect={handlePackageSelect}
                      isSelected={selectedPackage?.name === pkg.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            {house.reviews && house.reviews.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Client Reviews</h2>
                <div className="space-y-4">
                  {house.reviews.map((review) => (
                    <ReviewCard key={review.id || review._id} review={review} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Sidebar */}
          <div className="lg:col-span-1">
            <div id="booking-section" className="bg-white rounded-xl p-6 shadow-lg sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {showBookingForm && selectedPackage ? 'Complete Booking Request' : 'Book This Service'}
              </h3>
              
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
                <div className="text-center">
                  <Lock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="font-semibold text-gray-700 mb-2">Vendor Contact Hidden</p>
                  <p className="text-sm text-gray-600">
                    Contact details will be shared after:
                  </p>
                  <ul className="text-xs text-gray-500 mt-2 space-y-1">
                    <li>✓ Admin approval</li>
                    <li>✓ Payment confirmation</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="text-cyan-600" size={20} />
                  <span className="text-sm text-gray-700">10+ Years Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="text-cyan-600" size={20} />
                  <span className="text-sm text-gray-700">
                    {house.totalBookings || 500}+ Happy Clients
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="text-cyan-600" size={20} />
                  <span className="text-sm text-gray-700">Fully Insured</span>
                </div>
              </div>

              {showBookingForm && selectedPackage ? (
                <AskForBookingForm 
                  service={house} 
                  selectedPackage={selectedPackage}
                  onSuccess={handleBookingSuccess}
                />
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Select a package above to get started</p>
                  <p className="text-sm text-gray-500">
                    Only 10% advance payment required to confirm booking
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