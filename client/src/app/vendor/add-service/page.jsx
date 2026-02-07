'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Upload, X, Plus, Trash2, Camera, Image as ImageIcon,
  Loader2, CheckCircle, AlertCircle, User
} from 'lucide-react';

export default function AddServicePage() {
  const router = useRouter();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [portfolioPreviews, setPortfolioPreviews] = useState([]);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null); // 🎯 TASK 1

  const [formData, setFormData] = useState({
    companyName: '',
    tagline: '',
    aboutYourCompany: '',
    location: '',
    fullAddress: '',
    startingPrice: '',
    specialties: [''],
    features: [''], // Required
    services: [{ icon: '', title: '', description: '' }], // Required
    packages: [
      {
        name: '',
        price: '',
        duration: '',
        description: '',
        features: [''],
        popular: false
      }
    ], // Required
    portfolio: [
      {
        title: '',
        description: '',
        category: '',
        image: null
      }
    ],
    contact: {
      phone: '',
      email: '',
      hours: '9 AM - 6 PM, Mon-Sat',
      website: ''
    }, // Required
    availability: 'Available',
    images: [],
    profilePicture: null // 🎯 TASK 1
  });

  useEffect(() => {
    const userData = localStorage.getItem('vendorData');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsedVendor = JSON.parse(userData);
    setVendor(parsedVendor);

    // Pre-fill contact info
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        email: parsedVendor.email,
        phone: parsedVendor.phone || ''
      }
    }));
  }, [router]);

  // 🎯 TASK 1: Check if vendor is individual service provider
  const isIndividualProvider = () => {
    if (!vendor) return false;
    const individualCategories = ['Photographers', 'Cinematographers', 'Cooks & Caterers'];
    return individualCategories.includes(vendor.service);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: value
      }
    }));
  };

  // 🎯 TASK 1: Handle profile picture upload
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profilePicture: file
      }));
      const preview = URL.createObjectURL(file);
      setProfilePicturePreview(preview);
    }
  };

  const removeProfilePicture = () => {
    setFormData(prev => ({
      ...prev,
      profilePicture: null
    }));
    setProfilePicturePreview(null);
  };

  // Handle main service images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Handle array fields (specialties, features)
  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateArrayField = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  // Handle services
  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { icon: '', title: '', description: '' }]
    }));
  };

  const removeService = (index) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const updateService = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  // Handle packages
  const addPackage = () => {
    setFormData(prev => ({
      ...prev,
      packages: [
        ...prev.packages,
        {
          name: '',
          price: '',
          duration: '',
          description: '',
          features: [''],
          popular: false
        }
      ]
    }));
  };

  const removePackage = (index) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.filter((_, i) => i !== index)
    }));
  };

  const updatePackage = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.map((pkg, i) => 
        i === index ? { ...pkg, [field]: value } : pkg
      )
    }));
  };

  const addPackageFeature = (packageIndex) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.map((pkg, i) => 
        i === packageIndex 
          ? { ...pkg, features: [...pkg.features, ''] }
          : pkg
      )
    }));
  };

  const removePackageFeature = (packageIndex, featureIndex) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.map((pkg, i) => 
        i === packageIndex 
          ? { ...pkg, features: pkg.features.filter((_, fi) => fi !== featureIndex) }
          : pkg
      )
    }));
  };

  const updatePackageFeature = (packageIndex, featureIndex, value) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.map((pkg, i) => 
        i === packageIndex 
          ? { 
              ...pkg, 
              features: pkg.features.map((feature, fi) => 
                fi === featureIndex ? value : feature
              ) 
            }
          : pkg
      )
    }));
  };

  // Portfolio Items
  const addPortfolioItem = () => {
    setFormData(prev => ({
      ...prev,
      portfolio: [
        ...prev.portfolio,
        {
          title: '',
          description: '',
          category: '',
          image: null
        }
      ]
    }));
    setPortfolioPreviews(prev => [...prev, null]);
  };

  const removePortfolioItem = (index) => {
    setFormData(prev => ({
      ...prev,
      portfolio: prev.portfolio.filter((_, i) => i !== index)
    }));
    setPortfolioPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const updatePortfolioItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      portfolio: prev.portfolio.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // 🎯 TASK 2: Handle portfolio image change with preview
  const handlePortfolioImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      // Update form data
      setFormData(prev => ({
        ...prev,
        portfolio: prev.portfolio.map((item, i) => 
          i === index ? { ...item, image: file } : item
        )
      }));

      // 🎯 TASK 2: Create and update preview
      const preview = URL.createObjectURL(file);
      setPortfolioPreviews(prev => 
        prev.map((p, i) => i === index ? preview : p)
      );
    }
  };

  // 🎯 TASK 2: Remove portfolio image
  const removePortfolioImage = (index) => {
    setFormData(prev => ({
      ...prev,
      portfolio: prev.portfolio.map((item, i) => 
        i === index ? { ...item, image: null } : item
      )
    }));
    setPortfolioPreviews(prev => 
      prev.map((p, i) => i === index ? null : p)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vendor) {
      alert('❌ Please login as vendor');
      return;
    }

    // 🎯 TASK 3: Enhanced validation
    if (!formData.companyName || !formData.aboutYourCompany || !formData.location || 
        !formData.startingPrice) {
      alert('❌ Please fill all required fields');
      return;
    }

    // 🎯 TASK 1: Validate profile picture for individual providers
    if (isIndividualProvider() && !formData.profilePicture) {
      alert(`❌ Profile picture is required for ${vendor.service}`);
      return;
    }

    if (formData.images.length === 0) {
      alert('❌ Please upload at least one service image');
      return;
    }

    // 🎯 TASK 3: Validate required fields
    const validFeatures = formData.features.filter(f => f.trim());
    if (validFeatures.length === 0) {
      alert('❌ Please add at least one key feature');
      return;
    }

    const validServices = formData.services.filter(s => s.title && s.title.trim());
    if (validServices.length === 0) {
      alert('❌ Please add at least one service offered');
      return;
    }

    const validPackages = formData.packages.filter(p => p.name && p.name.trim());
    if (validPackages.length === 0) {
      alert('❌ Please add at least one pricing package');
      return;
    }

    if (!formData.contact.phone || !formData.contact.email) {
      alert('❌ Contact phone and email are required');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();

      // Basic fields
      submitData.append('companyName', formData.companyName);
      submitData.append('tagline', formData.tagline);
      submitData.append('aboutYourCompany', formData.aboutYourCompany);
      submitData.append('location', formData.location);
      submitData.append('fullAddress', formData.fullAddress || formData.location);
      submitData.append('startingPrice', formData.startingPrice);
      submitData.append('availability', formData.availability);
      submitData.append('vendorId', vendor._id || vendor.id);

      // 🎯 TASK 1: Service category comes from vendor registration (no need to send)

      // Array fields
      submitData.append('specialties', JSON.stringify(formData.specialties.filter(s => s.trim())));
      submitData.append('features', JSON.stringify(validFeatures));
      submitData.append('services', JSON.stringify(validServices));
      submitData.append('packages', JSON.stringify(validPackages));
      submitData.append('contact', JSON.stringify(formData.contact));

      // 🎯 TASK 1: Upload profile picture for individual providers
      if (formData.profilePicture) {
        submitData.append('profilePicture', formData.profilePicture);
      }

      // Main service images
      formData.images.forEach((image) => {
        submitData.append('image', image);
      });

      // Portfolio items (without images first)
      const portfolioData = formData.portfolio
        .filter(p => p.title && p.description)
        .map((item, index) => ({
          id: index + 1,
          title: item.title,
          description: item.description,
          category: item.category || 'General',
          image: '' // Will be updated after upload
        }));

      // Upload portfolio images separately and get URLs
      const portfolioWithImages = await Promise.all(
        formData.portfolio.map(async (item, index) => {
          if (!item.image || !item.title) return null;

          const imageFormData = new FormData();
          imageFormData.append('portfolioImage', item.image);

          try {
            const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/services/upload-portfolio-image`, {
              method: 'POST',
              body: imageFormData
            });

            const uploadData = await uploadResponse.json();
            
            return {
              id: index + 1,
              title: item.title,
              description: item.description,
              category: item.category || 'General',
              image: uploadData.imageUrl || ''
            };
          } catch (error) {
            console.error('Portfolio image upload failed:', error);
            return {
              id: index + 1,
              title: item.title,
              description: item.description,
              category: item.category || 'General',
              image: ''
            };
          }
        })
      );

      const validPortfolio = portfolioWithImages.filter(p => p !== null);
      submitData.append('portfolio', JSON.stringify(validPortfolio));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/services/addservices`, {
        method: 'POST',
        body: submitData
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Service added successfully!');
        router.push('/vendor/services');
      } else {
        alert('❌ ' + data.message);
      }
    } catch (error) {
      console.error('Add service error:', error);
      alert('❌ Failed to add service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const iconOptions = [
    'Camera', 'Video', 'Mic', 'Lightbulb', 'Music', 'Edit', 'Sound', 'Light', 'Speaker'
  ];

  const portfolioCategories = [
    'Wedding',
    'Corporate Event',
    'Birthday Party',
    'Concert',
    'Conference',
    'Product Launch',
    'Fashion Show',
    'Music Video',
    'Documentary',
    'Commercial',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-12 pt-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Add New Service</h1>
          
          {/* 🎯 TASK 1: Show service category from vendor registration */}
          {vendor && (
            <div className="mb-4 p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Service Category:</span> 
                <span className="ml-2 text-cyan-700 font-bold">{vendor.service}</span>
                <span className="ml-2 text-xs text-gray-500">(Auto-selected from your registration)</span>
              </p>
            </div>
          )}
          
          <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">Fill in the details to list your service</p>

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            
            {/* 🎯 TASK 1: Profile Picture Upload (for individual providers) */}
            {isIndividualProvider() && (
              <div className="space-y-4 bg-purple-50 p-4 md:p-6 rounded-xl border-2 border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <User className="text-purple-600" size={24} />
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                    Profile Picture * <span className="text-sm font-normal text-gray-600">(Required for {vendor?.service})</span>
                  </h2>
                </div>

                {profilePicturePreview ? (
                  <div className="relative w-48 h-48 mx-auto">
                    <img
                      src={profilePicturePreview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={removeProfilePicture}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-purple-300 rounded-lg p-6">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                      id="profile-picture"
                    />
                    <label
                      htmlFor="profile-picture"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <User className="w-16 h-16 text-purple-400 mb-2" />
                      <p className="text-sm text-gray-600 font-semibold">Click to upload your profile picture</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG (Recommended: Square image)</p>
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 border-b pb-2">
                Basic Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isIndividualProvider() ? 'Your Professional Name *' : 'Company/Business Name *'}
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm md:text-base"
                  placeholder={isIndividualProvider() ? "e.g., John Doe Photography" : "e.g., Premium Production House"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tagline (Optional)
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm md:text-base"
                  placeholder="e.g., Capturing Moments, Creating Memories"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  About Your {isIndividualProvider() ? 'Professional Service' : 'Company'} * (min 50 characters)
                </label>
                <textarea
                  name="aboutYourCompany"
                  value={formData.aboutYourCompany}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none text-sm md:text-base"
                  placeholder="Describe your service, experience, and what makes you unique..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.aboutYourCompany.length} characters
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Starting Price (৳) *
                  </label>
                  <input
                    type="number"
                    name="startingPrice"
                    value={formData.startingPrice}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm md:text-base"
                    placeholder="e.g., 50000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Availability Status
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm md:text-base"
                  >
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location/City *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm md:text-base"
                    placeholder="e.g., Dhaka"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Address (Optional)
                  </label>
                  <input
                    type="text"
                    name="fullAddress"
                    value={formData.fullAddress}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm md:text-base"
                    placeholder="Full address"
                  />
                </div>
              </div>
            </div>

            {/* Service Images */}
            <div className="space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 border-b pb-2">
                Service Images *
              </h2>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-6">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="service-images"
                />
                <label
                  htmlFor="service-images"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload images</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10 images</p>
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 md:h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 md:top-2 md:right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Specialties */}
            <div className="space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 border-b pb-2">
                Specialties *
              </h2>

              {formData.specialties.map((specialty, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => updateArrayField('specialties', index, e.target.value)}
                    className="flex-1 px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm md:text-base"
                    placeholder="e.g., Wedding Photography"
                  />
                  {formData.specialties.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('specialties', index)}
                      className="px-3 md:px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      <Trash2 size={18} className="md:w-5 md:h-5" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => addArrayField('specialties')}
                className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold text-sm md:text-base"
              >
                <Plus size={18} className="md:w-5 md:h-5" />
                Add Specialty
              </button>
            </div>

            {/* 🎯 TASK 3: Key Features - NOW REQUIRED */}
            <div className="space-y-4 bg-yellow-50 p-4 md:p-6 rounded-xl border-2 border-yellow-200">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 border-b pb-2">
                Key Features * <span className="text-sm font-normal text-red-600">(Required - Add at least one)</span>
              </h2>

              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateArrayField('features', index, e.target.value)}
                    className="flex-1 px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm md:text-base"
                    placeholder="e.g., 4K Video Recording"
                    required={index === 0}
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('features', index)}
                      className="px-3 md:px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      <Trash2 size={18} className="md:w-5 md:h-5" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => addArrayField('features')}
                className="flex items-center gap-2 text-yellow-700 hover:text-yellow-800 font-semibold text-sm md:text-base"
              >
                <Plus size={18} className="md:w-5 md:h-5" />
                Add Feature
              </button>
            </div>

            {/* 🎯 TASK 3: Services Offered - NOW REQUIRED */}
            <div className="space-y-4 bg-green-50 p-4 md:p-6 rounded-xl border-2 border-green-200">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 border-b pb-2">
                Services Offered * <span className="text-sm font-normal text-red-600">(Required - Add at least one)</span>
              </h2>

              {formData.services.map((service, index) => (
                <div key={index} className="bg-white p-3 md:p-4 rounded-lg space-y-3 shadow-sm">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700 text-sm md:text-base">Service {index + 1}</h3>
                    {formData.services.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={18} className="md:w-5 md:h-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select
                      value={service.icon}
                      onChange={(e) => updateService(index, 'icon', e.target.value)}
                      className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm md:text-base"
                    >
                      <option value="">Select Icon</option>
                      {iconOptions.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => updateService(index, 'title', e.target.value)}
                      className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm md:text-base"
                      placeholder="Service Title *"
                      required={index === 0}
                    />
                  </div>

                  <textarea
                    value={service.description}
                    onChange={(e) => updateService(index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm md:text-base"
                    placeholder="Service Description"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={addService}
                className="flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold text-sm md:text-base"
              >
                <Plus size={18} className="md:w-5 md:h-5" />
                Add Service
              </button>
            </div>

            {/* 🎯 TASK 3: Pricing Packages - NOW REQUIRED */}
            <div className="space-y-4 bg-blue-50 p-4 md:p-6 rounded-xl border-2 border-blue-200">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 border-b pb-2">
                Pricing Packages * <span className="text-sm font-normal text-red-600">(Required - Add at least one)</span>
              </h2>

              {formData.packages.map((pkg, pkgIndex) => (
                <div key={pkgIndex} className="bg-white p-4 md:p-6 rounded-lg space-y-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700 text-sm md:text-base">Package {pkgIndex + 1}</h3>
                    {formData.packages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePackage(pkgIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={18} className="md:w-5 md:h-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={pkg.name}
                      onChange={(e) => updatePackage(pkgIndex, 'name', e.target.value)}
                      className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                      placeholder="Package Name (e.g., Basic) *"
                      required={pkgIndex === 0}
                    />

                    <input
                      type="number"
                      value={pkg.price}
                      onChange={(e) => updatePackage(pkgIndex, 'price', e.target.value)}
                      className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                      placeholder="Price (৳)"
                    />

                    <input
                      type="text"
                      value={pkg.duration}
                      onChange={(e) => updatePackage(pkgIndex, 'duration', e.target.value)}
                      className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                      placeholder="Duration (e.g., 6 hours)"
                    />

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={pkg.popular}
                        onChange={(e) => updatePackage(pkgIndex, 'popular', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label className="text-sm text-gray-700">Mark as Popular</label>
                    </div>
                  </div>

                  <textarea
                    value={pkg.description}
                    onChange={(e) => updatePackage(pkgIndex, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm md:text-base"
                    placeholder="Package Description"
                  />

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Package Features
                    </label>

                    {pkg.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updatePackageFeature(pkgIndex, featureIndex, e.target.value)}
                          className="flex-1 px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                          placeholder="Feature"
                        />
                        {pkg.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePackageFeature(pkgIndex, featureIndex)}
                            className="px-2 md:px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                          >
                            <X size={14} className="md:w-4 md:h-4" />
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addPackageFeature(pkgIndex)}
                      className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      + Add Feature
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addPackage}
                className="flex items-center gap-2 text-blue-700 hover:text-blue-800 font-semibold text-sm md:text-base"
              >
                <Plus size={18} className="md:w-5 md:h-5" />
                Add Package
              </button>
            </div>

            {/* PORTFOLIO SECTION WITH IMAGE PREVIEWS */}
            <div className="space-y-4 bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-6 rounded-xl border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-2 md:mb-4">
                <Camera className="text-purple-600" size={20} className="md:w-6 md:h-6" />
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  Portfolio / Past Work (Showcase Your Experience)
                </h2>
              </div>
              
              <p className="text-xs md:text-sm text-gray-600 mb-4">
                Upload images of your previous projects to build trust with potential clients
              </p>

              {formData.portfolio.map((item, index) => (
                <div key={index} className="bg-white p-4 md:p-6 rounded-lg shadow-md space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700 text-sm md:text-base">Project {index + 1}</h3>
                    {formData.portfolio.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePortfolioItem(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={18} className="md:w-5 md:h-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updatePortfolioItem(index, 'title', e.target.value)}
                      className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm md:text-base"
                      placeholder="Project Title (e.g., John & Jane Wedding)"
                    />

                    <select
                      value={item.category}
                      onChange={(e) => updatePortfolioItem(index, 'category', e.target.value)}
                      className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm md:text-base"
                    >
                      <option value="">Select Category</option>
                      {portfolioCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    value={item.description}
                    onChange={(e) => updatePortfolioItem(index, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm md:text-base"
                    placeholder="Brief description of this project..."
                  />

                  {/* 🎯 TASK 2: Portfolio Image Upload WITH PREVIEW */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Project Image
                    </label>

                    {portfolioPreviews[index] ? (
                      <div className="relative">
                        <img
                          src={portfolioPreviews[index]}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-40 md:h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removePortfolioImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg"
                        >
                          <X size={18} className="md:w-5 md:h-5" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-3 py-1 rounded-full text-xs md:text-sm">
                          {item.image?.name || 'Image uploaded'}
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePortfolioImageChange(index, e)}
                          className="hidden"
                          id={`portfolio-image-${index}`}
                        />
                        <label
                          htmlFor={`portfolio-image-${index}`}
                          className="flex flex-col items-center justify-center cursor-pointer"
                        >
                          <ImageIcon className="w-8 h-8 md:w-10 md:h-10 text-gray-400 mb-2" />
                          <p className="text-xs md:text-sm text-gray-600 font-semibold">Click to upload project image</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG (Max 5MB)</p>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addPortfolioItem}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold text-sm md:text-base"
              >
                <Plus size={18} className="md:w-5 md:h-5" />
                Add Portfolio Item
              </button>
            </div>

            {/* 🎯 TASK 3: Contact Information - NOW REQUIRED */}
            <div className="space-y-4 bg-orange-50 p-4 md:p-6 rounded-xl border-2 border-orange-200">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 border-b pb-2">
                Contact Information * <span className="text-sm font-normal text-red-600">(Required)</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <input
                  type="tel"
                  name="phone"
                  value={formData.contact.phone}
                  onChange={handleContactChange}
                  className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                  placeholder="Phone Number *"
                  required
                />

                <input
                  type="email"
                  name="email"
                  value={formData.contact.email}
                  onChange={handleContactChange}
                  className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                  placeholder="Email *"
                  required
                />

                <input
                  type="text"
                  name="hours"
                  value={formData.contact.hours}
                  onChange={handleContactChange}
                  className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                  placeholder="Business Hours"
                />

                <input
                  type="url"
                  name="website"
                  value={formData.contact.website}
                  onChange={handleContactChange}
                  className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                  placeholder="Website (Optional)"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 md:py-4 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                    Adding Service...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                    Add Service
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push('/vendor/services')}
                className="px-6 md:px-8 py-3 md:py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all text-sm md:text-base"
              >
                Cancel
              </button>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                <div className="text-sm">
                  <p className="font-semibold text-blue-900 mb-1">Important Information:</p>
                  <ul className="text-blue-800 space-y-1 text-xs md:text-sm">
                    <li>• All fields marked with * are required</li>
                    <li>• At least one key feature, service, and pricing package must be provided</li>
                    <li>• Contact information (phone & email) is mandatory</li>
                    {isIndividualProvider() && (
                      <li>• Profile picture is required for {vendor?.service}</li>
                    )}
                    <li>• Portfolio images help attract more clients</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}