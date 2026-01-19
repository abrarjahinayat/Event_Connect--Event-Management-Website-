'use client';

import React, { useState, useEffect } from 'react';
import { 
  Edit, Trash2, Eye, Star, MapPin, DollarSign, 
  CheckCircle, XCircle, Loader2, Plus, Search
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const MyServices = () => {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchMyServices();
  }, []);

  const fetchMyServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/services/vendor/${user._id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
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

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/services/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('✅ Service deleted successfully!');
        fetchMyServices();
      } else {
        alert('❌ ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('❌ Failed to delete service');
    }
  };

  const handleEdit = (id) => {
    router.push(`/vendor/edit-service/${id}`);
  };

  const handleView = (service) => {
    router.push(`/production-houses/${service.slug || service._id}`);
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'available' && (service.available || service.availability === 'Available')) ||
                         (filterStatus === 'booked' && (!service.available && service.availability !== 'Available'));

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-cyan-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Services</h1>
          <p className="text-gray-600 mt-1">Manage all your service listings</p>
        </div>

        <button
          onClick={() => router.push('/vendor/add-service')}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-green-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
        >
          <Plus size={20} />
          Add New Service
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value="all">All Services</option>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Services</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{services.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Plus className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Available</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {services.filter(s => s.available || s.availability === 'Available').length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Average Rating</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">
                {services.length > 0
                  ? (services.reduce((sum, s) => sum + (s.rating || 0), 0) / services.length).toFixed(1)
                  : '0.0'}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Star className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Services List */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredServices.map((service) => (
            <div key={service._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                {/* Image */}
                <div className="md:w-64 h-48 md:h-auto">
                  <img
                    src={service.image?.[0] || service.images?.[0] || '/placeholder.jpg'}
                    alt={service.companyName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{service.companyName}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          {service.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={16} className="fill-yellow-400 text-yellow-400" />
                          {service.rating || 0} ({service.reviewCount || 0} reviews)
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {service.available || service.availability === 'Available' ? (
                      <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        <CheckCircle size={16} />
                        Available
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                        <XCircle size={16} />
                        Booked
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {service.aboutYourCompany}
                  </p>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.specialties?.slice(0, 3).map((specialty, idx) => (
                      <span
                        key={idx}
                        className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <DollarSign size={18} className="text-gray-500" />
                      <span className="text-sm text-gray-600">Starting at</span>
                      <span className="text-lg font-bold text-gray-900">
                        ৳{service.startingPrice?.toLocaleString()}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(service)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye size={20} />
                      </button>
                      <button
                        onClick={() => handleEdit(service._id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(service._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Plus className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Services Found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || filterStatus !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by adding your first service'}
          </p>
          <button
            onClick={() => router.push('/vendor/add-service')}
            className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Add New Service
          </button>
        </div>
      )}
    </div>
  );
};

export default MyServices;