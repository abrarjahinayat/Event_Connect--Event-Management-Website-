// File: src/app/production-houses/page.jsx

'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Star, CheckCircle, XCircle, DollarSign, Search, Filter, X } from 'lucide-react';
import { productionHousesData } from './data';

// Production House Card Component
const ProductionHouseCard = ({ house, onViewDetails }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={house.image} 
          alt={house.name}
          className="w-full h-full object-cover"
        />
        
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

        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
          <Star size={16} className="fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-gray-900">{house.rating}</span>
          <span className="text-gray-500 text-sm">({house.reviewCount})</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {house.name}
        </h3>

        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <MapPin size={18} className="text-cyan-600" />
          <span className="text-sm">{house.location}</span>
        </div>

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

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <DollarSign size={18} className="text-gray-500" />
            <span className="text-sm text-gray-500">Starting at</span>
            <span className="text-lg font-bold text-gray-900">
              ৳{house.startingPrice.toLocaleString()}
            </span>
          </div>
        </div>

        <button 
          onClick={() => onViewDetails(house.id)}
          className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default function ProductionHousesPage() {
  const router = useRouter();
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    availability: 'all', // 'all', 'available', 'booked'
    priceRange: [0, 500000],
    location: 'all',
    specialty: 'all',
    minRating: 0
  });

  // Get unique locations and specialties
  const locations = ['all', ...new Set(productionHousesData.map(h => h.location))];
  const allSpecialties = ['all', ...new Set(productionHousesData.flatMap(h => h.specialties))];

  // Filter logic
  const filteredHouses = useMemo(() => {
    return productionHousesData.filter(house => {
      // Search filter
      const matchesSearch = house.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           house.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           house.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Availability filter
      const matchesAvailability = filters.availability === 'all' || 
                                 (filters.availability === 'available' && house.available) ||
                                 (filters.availability === 'booked' && !house.available);
      
      // Price range filter
      const matchesPrice = house.startingPrice >= filters.priceRange[0] && 
                          house.startingPrice <= filters.priceRange[1];
      
      // Location filter
      const matchesLocation = filters.location === 'all' || house.location === filters.location;
      
      // Specialty filter
      const matchesSpecialty = filters.specialty === 'all' || 
                              house.specialties.includes(filters.specialty);
      
      // Rating filter
      const matchesRating = house.rating >= filters.minRating;

      return matchesSearch && matchesAvailability && matchesPrice && 
             matchesLocation && matchesSpecialty && matchesRating;
    });
  }, [searchQuery, filters]);

  const handleViewDetails = (id) => {
    router.push(`/production-houses/${id}`);
  };

  const resetFilters = () => {
    setFilters({
      availability: 'all',
      priceRange: [0, 500000],
      location: 'all',
      specialty: 'all',
      minRating: 0
    });
    setSearchQuery('');
  };

  const activeFiltersCount = () => {
    let count = 0;
    if (filters.availability !== 'all') count++;
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 500000) count++;
    if (filters.location !== 'all') count++;
    if (filters.specialty !== 'all') count++;
    if (filters.minRating > 0) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-cyan-50">
      {/* Header */}
      <div className="bg-cyan-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Production Houses in Bangladesh
          </h1>
          <p className="text-cyan-100 text-lg max-w-2xl">
            Discover and book premium production houses in Dhaka for your next project.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, location, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition-colors relative"
            >
              <Filter size={20} />
              Filters
              {activeFiltersCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-cyan-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {activeFiltersCount()}
                </span>
              )}
            </button>

            {/* Reset Filters Button */}
            {(activeFiltersCount() > 0 || searchQuery) && (
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-semibold transition-colors"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Availability Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  value={filters.availability}
                  onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="all">All Studios</option>
                  <option value="available">Available Only</option>
                  <option value="booked">Booked Only</option>
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  {locations.map(loc => (
                    <option key={loc} value={loc}>
                      {loc === 'all' ? 'All Locations' : loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Specialty Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Specialty
                </label>
                <select
                  value={filters.specialty}
                  onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  {allSpecialties.map(spec => (
                    <option key={spec} value={spec}>
                      {spec === 'all' ? 'All Specialties' : spec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price Range: ৳{filters.priceRange[0].toLocaleString()} - ৳{filters.priceRange[1].toLocaleString()}
                </label>
                <div className="flex gap-4 items-center">
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
                    className="flex-1"
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
                    className="flex-1"
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>৳0</span>
                  <span>৳500,000</span>
                </div>
              </div>

              {/* Minimum Rating Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={filters.minRating}
                  onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="0">Any Rating</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.8">4.8+ Stars</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-cyan-600 mb-1">
                {filteredHouses.length}
              </div>
              <div className="text-gray-600 text-sm">
                {filteredHouses.length === productionHousesData.length 
                  ? 'Total Production Houses' 
                  : 'Matching Results'}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-1">
                {filteredHouses.filter(h => h.available).length}
              </div>
              <div className="text-gray-600 text-sm">Available Now</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600 mb-1">
                {filteredHouses.length > 0 
                  ? (filteredHouses.reduce((sum, h) => sum + h.rating, 0) / filteredHouses.length).toFixed(1)
                  : '0.0'}
              </div>
              <div className="text-gray-600 text-sm">Average Rating</div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        {(searchQuery || activeFiltersCount() > 0) && (
          <div className="mb-6 flex items-center justify-between bg-cyan-50 border border-cyan-200 rounded-lg p-4">
            <p className="text-cyan-800">
              <span className="font-semibold">{filteredHouses.length}</span> production house{filteredHouses.length !== 1 ? 's' : ''} found
              {searchQuery && <span> matching "<span className="font-semibold">{searchQuery}</span>"</span>}
            </p>
          </div>
        )}

        {/* Production Houses Grid */}
        {filteredHouses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHouses.map((house) => (
              <ProductionHouseCard 
                key={house.id} 
                house={house}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Search size={64} className="mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any production houses matching your criteria.
            </p>
            <button
              onClick={resetFilters}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}