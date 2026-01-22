"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Plus,
  Loader2,
  MapPin,
  DollarSign,
  Star,
  CheckCircle,
} from "lucide-react";

export default function MyServices() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [deleteLoading, setDeleteLoading] = useState(null);

  const serviceCategories = [
    "All",
    "Production Houses",
    "Community Centers",
    "Event Management",
    "Photographers",
    "Cinematographers",
    "Cooks & Caterers",
  ];

  useEffect(() => {
    fetchMyServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchQuery, filterCategory]);

  const fetchMyServices = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("vendorData"));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/services/vendor/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (result.success) {
        setServices(result.data);
        setFilteredServices(result.data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = [...services];

    // Filter by category
    if (filterCategory !== "All") {
      filtered = filtered.filter(
        (service) => service.serviceCategory === filterCategory,
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (service) =>
          service.companyName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          service.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.location?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredServices(filtered);
  };

  const handleView = (serviceId) => {
    router.push(`/production-houses/${serviceId}`);
  };

  const handleEdit = (serviceId) => {
    router.push(`/vendor/edit-service/${serviceId}`);
  };

  const handleDelete = async (serviceId) => {
    if (
      !confirm(
        "Are you sure you want to delete this service? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setDeleteLoading(serviceId);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/services/${serviceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (result.success) {
        // Remove from state
        setServices((prev) => prev.filter((s) => s._id !== serviceId));
        alert("Service deleted successfully!");
      } else {
        alert("Failed to delete service: " + result.message);
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Error deleting service");
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Services</h1>
          <p className="text-gray-600 mt-1">Manage your service listings</p>
        </div>
        <button
          onClick={() => router.push("/vendor/add-service")}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Add New Service
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-gray-600 text-sm">Total Services</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {services.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-gray-600 text-sm">Active</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {services.filter((s) => s.available).length}
          </p>
        </div>
        {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-gray-600 text-sm">Total Views</p>
          <p className="text-2xl font-bold text-cyan-600 mt-1">
            {services.reduce((sum, s) => sum + (s.views || 0), 0)}
          </p>
        </div> */}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none bg-white"
            >
              {serviceCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Services List */}
      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No services found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterCategory !== "All"
                ? "Try adjusting your search or filters"
                : "Get started by adding your first service"}
            </p>
            {services.length === 0 && (
              <button
                onClick={() => router.push("/vendor/add-service")}
                className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white px-6 py-3 rounded-lg transition-all duration-300"
              >
                Add Your First Service
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredServices.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Image */}
                  <div className="lg:w-48 h-48 flex-shrink-0">
                    {service.images?.[0] || service.image?.[0] ? (
                      <img
                        src={service.images?.[0] || service.image?.[0]}
                        alt={service.companyName}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-4xl">🏢</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {service.companyName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {service.tagline}
                        </p>
                        <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-medium rounded-full">
                          {service.serviceCategory}
                        </span>
                      </div>

                      {/* Availability Badge */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          service.available
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {service.available ? "Available" : "Unavailable"}
                      </span>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">
                          {service.location || "Location not set"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">
                          From ৳
                          {service.startingPrice?.toLocaleString() || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Star className="w-4 h-4 flex-shrink-0 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">
                          {service.rating?.toFixed(1) || "0.0"} (
                          {service.reviewCount || 0} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {service.aboutYourCompany && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {service.aboutYourCompany}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleView(service._id)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>

                      {/* <button
                        onClick={() => handleEdit(service._id)}
                        className="flex items-center gap-2 px-4 py-2 text-cyan-600 bg-cyan-50 hover:bg-cyan-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button> */}

                      <button
                        onClick={() => handleDelete(service._id)}
                        disabled={deleteLoading === service._id}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleteLoading === service._id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </>
                        )}
                      </button>

                      <button
                        onClick={() =>
                          router.push(
                            `/vendor/update-availability/${service._id}`,
                          )
                        }
                        className="flex items-center gap-2 px-4 py-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Availability
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
