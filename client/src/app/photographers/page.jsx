import React from 'react';
import { MapPin, Star, DollarSign, CheckCircle, XCircle } from 'lucide-react';

// ============================================
// MOCK DATA
// ============================================
const mockProductionHouses = [
  {
    id: 1,
    name: "Skyline Studios",
    image: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=800&h=600&fit=crop",
    location: "Los Angeles, CA",
    startingPrice: 5000,
    available: true,
    rating: 4.8,
    reviewCount: 124,
    specialties: ["Commercial", "Music Videos", "Corporate"]
  },
  {
    id: 2,
    name: "Urban Production Hub",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop",
    location: "New York, NY",
    startingPrice: 7500,
    available: true,
    rating: 4.9,
    reviewCount: 89,
    specialties: ["Documentary", "Film", "TV Series"]
  },
  {
    id: 3,
    name: "Creative Space Productions",
    image: "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=800&h=600&fit=crop",
    location: "Austin, TX",
    startingPrice: 3500,
    available: false,
    rating: 4.6,
    reviewCount: 156,
    specialties: ["Indie Films", "Web Series", "Commercials"]
  },
  {
    id: 4,
    name: "Paramount Creative Studios",
    image: "https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?w=800&h=600&fit=crop",
    location: "Miami, FL",
    startingPrice: 6000,
    available: true,
    rating: 4.7,
    reviewCount: 98,
    specialties: ["Music Videos", "Fashion", "Lifestyle"]
  },
  {
    id: 5,
    name: "Digital Dreams Production",
    image: "https://images.unsplash.com/photo-1594656209149-129a85e9d284?w=800&h=600&fit=crop",
    location: "Seattle, WA",
    startingPrice: 4500,
    available: true,
    rating: 4.5,
    reviewCount: 72,
    specialties: ["Animation", "VFX", "Post-Production"]
  },
  {
    id: 6,
    name: "Sunset Boulevard Studios",
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop",
    location: "Nashville, TN",
    startingPrice: 5500,
    available: true,
    rating: 4.9,
    reviewCount: 203,
    specialties: ["Music Production", "Live Recording", "Concerts"]
  }
];

// ============================================
// PRODUCTION HOUSE CARD COMPONENT
// ============================================
const ProductionHouseCard = ({ house }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image Container with Availability Badge */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={house.image} 
          alt={house.name}
          className="w-full h-full object-cover"
        />
        
        {/* Availability Badge */}
        <div className="absolute top-4 right-4">
          {house.available ? (
            <span className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
              <CheckCircle size={16} />
              Available
            </span>
          ) : (
            <span className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
              <XCircle size={16} />
              Booked
            </span>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
          <Star size={16} className="fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-gray-900">{house.rating}</span>
          <span className="text-gray-500 text-sm">({house.reviewCount})</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        {/* Production House Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {house.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <MapPin size={18} className="text-cyan-600" />
          <span className="text-sm">{house.location}</span>
        </div>

        {/* Specialty Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {house.specialties.slice(0, 3).map((specialty, index) => (
            <span 
              key={index}
              className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-xs font-medium border border-cyan-200"
            >
              {specialty}
            </span>
          ))}
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <DollarSign size={18} className="text-gray-500" />
            <span className="text-sm text-gray-500">Starting at</span>
            <span className="text-lg font-bold text-gray-900">
              ${house.startingPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* View Details Button */}
        <button className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md">
          View Details
        </button>
      </div>
    </div>
  );
};

// ============================================
// MAIN PAGE COMPONENT
// ============================================
const ProductionHousesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-cyan-50">
      {/* Header Section */}
      <div className="bg-cyan-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Production Houses
          </h1>
          <p className="text-cyan-100 text-lg max-w-2xl">
            Discover and book premium production houses for your next project. 
            From commercials to feature films, find the perfect space for your vision.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-cyan-600 mb-1">
                {mockProductionHouses.length}
              </div>
              <div className="text-gray-600 text-sm">Production Houses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-1">
                {mockProductionHouses.filter(h => h.available).length}
              </div>
              <div className="text-gray-600 text-sm">Available Now</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600 mb-1">4.7</div>
              <div className="text-gray-600 text-sm">Average Rating</div>
            </div>
          </div>
        </div>

        {/* Production Houses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockProductionHouses.map((house) => (
            <ProductionHouseCard key={house.id} house={house} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-3 rounded-lg border-2 border-gray-200 transition-all duration-200 shadow-sm hover:shadow-md">
            Load More Production Houses
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductionHousesPage;