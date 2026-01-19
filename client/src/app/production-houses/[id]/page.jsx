'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  MapPin, Star, CheckCircle, XCircle, Phone, Mail, Clock, 
  Award, Shield, Users, ChevronLeft, ChevronRight, ArrowLeft,
  Camera, Video, Mic, Lightbulb, Music, Edit, Loader2, Speaker
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
          <span className="text-4xl font-bold text-cyan-600">৳{pkg.price?.toLocaleString()}</span>
        </div>
        <p className="text-gray-600 mt-1">{pkg.duration}</p>
      </div>

      <ul className="space-y-3 mb-6">
        {pkg.features?.map((feature, index) => (
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
        Book Now
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

// Booking Form Component
const BookingForm = ({ serviceId }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    package: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.date) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/services/${serviceId}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Booking request submitted! আমরা 24 ঘন্টার মধ্যে আপনার সাথে যোগাযোগ করব।');
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: '',
          package: '',
          message: ''
        });
      } else {
        alert('❌ ' + data.message);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('❌ Failed to submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input 
        type="text" 
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Your Name"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      />
      <input 
        type="email" 
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email Address"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      />
      <input 
        type="tel" 
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone Number (01XXXXXXXXX)"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      />
      <input 
        type="date" 
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      />
      <select 
        name="package"
        value={formData.package}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      >
        <option value="">Select Package</option>
        <option value="basic">Basic Package</option>
        <option value="professional">Professional Package</option>
        <option value="premium">Premium Package</option>
      </select>
      <textarea 
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Tell us about your project..."
        rows={4}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
      />
      <button 
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-4 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          'Request Booking'
        )}
      </button>
    </div>
  );
};

// Main Details Page Component
export default function ProductionHouseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  
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

  // Icon mapping - Fixed: Sound replaced with Speaker
  const iconMap = {
    Camera: Camera,
    Video: Video,
    Mic: Mic,
    Lightbulb: Lightbulb,
    Music: Music,
    Edit: Edit,
    Sound: Speaker,  // ✅ Fixed: Use Speaker instead of Sound
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Production House Not Found</h1>
          <button
            onClick={() => router.push('/production-houses')}
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
            onClick={() => router.push('/production-houses')}
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
            {/* Header Section */}
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

            {/* Pricing Packages */}
            {house.packages && house.packages.length > 0 && (
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Pricing Packages</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {house.packages.map((pkg, index) => (
                    <PackageCard key={index} pkg={pkg} />
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio Gallery */}
            {house.portfolio && house.portfolio.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Portfolio</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {house.portfolio.map((item) => (
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
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Book This Studio</h3>
              
              {/* Contact Info */}
              {house.contact && (
                <div className="space-y-4 mb-6">
                  {house.contact.phone && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Phone size={20} className="text-cyan-600" />
                      <span>{house.contact.phone}</span>
                    </div>
                  )}
                  {house.contact.email && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Mail size={20} className="text-cyan-600" />
                      <span className="text-sm">{house.contact.email}</span>
                    </div>
                  )}
                  {house.contact.hours && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Clock size={20} className="text-cyan-600" />
                      <span className="text-sm">{house.contact.hours}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Stats */}
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

              {/* Booking Form */}
              <BookingForm serviceId={house._id} />

              <p className="text-xs text-gray-500 text-center mt-4">
                আমরা 24 ঘন্টার মধ্যে সাড়া দেব
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}