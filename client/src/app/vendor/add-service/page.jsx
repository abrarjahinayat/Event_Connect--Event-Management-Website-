'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Plus, Loader2, CheckCircle } from 'lucide-react';

const AddServicePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    companyName: '',
    tagline: '',
    aboutYourCompany: '',
    location: '',
    fullAddress: '',
    startingPrice: '',
    availability: 'Available',
    serviceCategory: 'Production Houses',
    phone: '',
    email: '',
    hours: '9 AM - 9 PM, 7 Days a Week',
    website: '',
  });
  const [specialties, setSpecialties] = useState(['']);
  const [features, setFeatures] = useState(['']);
  const [services, setServices] = useState([
    { icon: 'Camera', title: '', description: '' }
  ]);
  const [packages, setPackages] = useState([
    { name: 'Basic', price: '', duration: '', features: [''], popular: false }
  ]);

  const serviceCategories = [
    'Production Houses',
    'Community Centers',
    'Event Management',
    'Photographers',
    'Cinematographers',
    'Cooks & Caterers'
  ];

  const iconOptions = ['Camera', 'Video', 'Mic', 'Lightbulb', 'Music', 'Edit', 'Sound', 'Light'];

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle image uploads
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 10) {
      alert('Maximum 10 images allowed');
      return;
    }

    setImages([...images, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  // Handle array fields
  const addSpecialty = () => setSpecialties([...specialties, '']);
  const removeSpecialty = (index) => setSpecialties(specialties.filter((_, i) => i !== index));
  const updateSpecialty = (index, value) => {
    const newSpecialties = [...specialties];
    newSpecialties[index] = value;
    setSpecialties(newSpecialties);
  };

  const addFeature = () => setFeatures([...features, '']);
  const removeFeature = (index) => setFeatures(features.filter((_, i) => i !== index));
  const updateFeature = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  // Handle services
  const addService = () => {
    setServices([...services, { icon: 'Camera', title: '', description: '' }]);
  };
  const removeService = (index) => setServices(services.filter((_, i) => i !== index));
  const updateService = (index, field, value) => {
    const newServices = [...services];
    newServices[index][field] = value;
    setServices(newServices);
  };

  // Handle packages
  const addPackage = () => {
    setPackages([...packages, { name: '', price: '', duration: '', features: [''], popular: false }]);
  };
  const removePackage = (index) => setPackages(packages.filter((_, i) => i !== index));
  const updatePackage = (index, field, value) => {
    const newPackages = [...packages];
    newPackages[index][field] = value;
    setPackages(newPackages);
  };
  const addPackageFeature = (packageIndex) => {
    const newPackages = [...packages];
    newPackages[packageIndex].features.push('');
    setPackages(newPackages);
  };
  const updatePackageFeature = (packageIndex, featureIndex, value) => {
    const newPackages = [...packages];
    newPackages[packageIndex].features[featureIndex] = value;
    setPackages(newPackages);
  };
  const removePackageFeature = (packageIndex, featureIndex) => {
    const newPackages = [...packages];
    newPackages[packageIndex].features = newPackages[packageIndex].features.filter((_, i) => i !== featureIndex);
    setPackages(newPackages);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get token and vendorId from localStorage
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      if (!token || !user) {
        alert('Please login first');
        router.push('/login');
        return;
      }

      // Create FormData
      const submitData = new FormData();

      // Add basic fields
      submitData.append('companyName', formData.companyName);
      submitData.append('tagline', formData.tagline);
      submitData.append('aboutYourCompany', formData.aboutYourCompany);
      submitData.append('location', formData.location);
      submitData.append('fullAddress', formData.fullAddress);
      submitData.append('startingPrice', formData.startingPrice);
      submitData.append('availability', formData.availability);
      submitData.append('serviceCategory', formData.serviceCategory);
      submitData.append('vendorId', user._id);

      // Add arrays and objects as JSON strings
      submitData.append('specialties', JSON.stringify(specialties.filter(s => s.trim())));
      submitData.append('features', JSON.stringify(features.filter(f => f.trim())));
      submitData.append('services', JSON.stringify(services.filter(s => s.title && s.description)));
      submitData.append('packages', JSON.stringify(packages.map(p => ({
        ...p,
        price: parseInt(p.price),
        features: p.features.filter(f => f.trim())
      }))));
      submitData.append('contact', JSON.stringify({
        phone: formData.phone,
        email: formData.email,
        hours: formData.hours,
        website: formData.website
      }));

      // Add images
      images.forEach(image => {
        submitData.append('image', image);
      });

      // Send request
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/services/addservices`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Service added successfully!');
        router.push('/vendor/dashboard');
      } else {
        alert('❌ ' + data.message);
      }
    } catch (error) {
      console.error('Error adding service:', error);
      alert('❌ Failed to add service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Add Your Service</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter your company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="e.g., Where creativity meets technology"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    About Your Company * (min 50 characters)
                  </label>
                  <textarea
                    name="aboutYourCompany"
                    value={formData.aboutYourCompany}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="Describe your company, experience, and what makes you unique..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.aboutYourCompany.length} / 50 characters
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Service Category *
                    </label>
                    <select
                      name="serviceCategory"
                      value={formData.serviceCategory}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    >
                      {serviceCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Availability *
                    </label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="Available">Available</option>
                      <option value="Booked">Booked</option>
                      <option value="Unavailable">Unavailable</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="e.g., Gulshan, Dhaka"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Address
                  </label>
                  <input
                    type="text"
                    name="fullAddress"
                    value={formData.fullAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="House 45, Road 11, Block E, Gulshan-1, Dhaka 1212"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Pricing</h2>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Starting Price (BDT) *
                </label>
                <input
                  type="number"
                  name="startingPrice"
                  value={formData.startingPrice}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  placeholder="25000"
                />
              </div>
            </div>

            {/* Images */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Images * (Max 10)</h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload images</span>
                  <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB each</span>
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Specialties */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Specialties *</h2>
              
              <div className="space-y-2">
                {specialties.map((specialty, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={specialty}
                      onChange={(e) => updateSpecialty(index, e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                      placeholder="e.g., Commercial Shoots"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecialty(index)}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSpecialty}
                  className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold"
                >
                  <Plus size={20} />
                  Add Specialty
                </button>
              </div>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Features</h2>
              
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                      placeholder="e.g., 4K Camera Equipment"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold"
                >
                  <Plus size={20} />
                  Add Feature
                </button>
              </div>
            </div>

            {/* Services */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Services Offered</h2>
              
              <div className="space-y-4">
                {services.map((service, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Service {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <select
                        value={service.icon}
                        onChange={(e) => updateService(index, 'icon', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                      >
                        {iconOptions.map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                      
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) => updateService(index, 'title', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                        placeholder="Service title"
                      />
                      
                      <textarea
                        value={service.description}
                        onChange={(e) => updateService(index, 'description', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                        placeholder="Service description"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addService}
                  className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold"
                >
                  <Plus size={20} />
                  Add Service
                </button>
              </div>
            </div>

            {/* Packages */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Pricing Packages</h2>
              
              <div className="space-y-4">
                {packages.map((pkg, pkgIndex) => (
                  <div key={pkgIndex} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Package {pkgIndex + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removePackage(pkgIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={pkg.name}
                          onChange={(e) => updatePackage(pkgIndex, 'name', e.target.value)}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                          placeholder="Package name"
                        />
                        <input
                          type="number"
                          value={pkg.price}
                          onChange={(e) => updatePackage(pkgIndex, 'price', e.target.value)}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                          placeholder="Price"
                        />
                        <input
                          type="text"
                          value={pkg.duration}
                          onChange={(e) => updatePackage(pkgIndex, 'duration', e.target.value)}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                          placeholder="Duration"
                        />
                      </div>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={pkg.popular}
                          onChange={(e) => updatePackage(pkgIndex, 'popular', e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Mark as popular</span>
                      </label>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Package Features:</label>
                        {pkg.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => updatePackageFeature(pkgIndex, featureIndex, e.target.value)}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                              placeholder="Feature"
                            />
                            <button
                              type="button"
                              onClick={() => removePackageFeature(pkgIndex, featureIndex)}
                              className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addPackageFeature(pkgIndex)}
                          className="text-sm text-cyan-600 hover:text-cyan-700"
                        >
                          + Add Feature
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPackage}
                  className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold"
                >
                  <Plus size={20} />
                  Add Package
                </button>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="+880 1711-123456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="contact@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Hours
                  </label>
                  <input
                    type="text"
                    name="hours"
                    value={formData.hours}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="9 AM - 9 PM, 7 Days a Week"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="www.yourwebsite.com"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-green-600 hover:from-cyan-700 hover:to-green-700 text-white font-semibold py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Adding Service...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Add Service
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddServicePage;