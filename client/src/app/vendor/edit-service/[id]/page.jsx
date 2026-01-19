'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Save, X, Plus, Trash2, Upload, Loader2, AlertCircle, 
  CheckCircle2, Image as ImageIcon, ArrowLeft 
} from 'lucide-react';

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    companyName: '',
    tagline: '',
    aboutYourCompany: '',
    location: '',
    fullAddress: '',
    startingPrice: '',
    serviceCategory: 'Production Houses',
    availability: 'Available',
    available: true
  });

  const [contact, setContact] = useState({
    phone: '',
    email: '',
    hours: '',
    website: ''
  });

  const [specialties, setSpecialties] = useState(['']);
  const [features, setFeatures] = useState(['']);
  const [services, setServices] = useState(['']);
  const [packages, setPackages] = useState([{
    name: '',
    price: '',
    description: '',
    features: ['']
  }]);
  const [portfolio, setPortfolio] = useState([{
    title: '',
    description: '',
    image: ''
  }]);

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const serviceCategories = [
    'Production Houses',
    'Community Centers',
    'Event Management',
    'Photographers',
    'Cinematographers',
    'Cooks & Caterers'
  ];

  const availabilityOptions = ['Available', 'Busy', 'Unavailable'];

  // Fetch service data
  useEffect(() => {
    fetchServiceData();
  }, [serviceId]);

  const fetchServiceData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/services/${serviceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        const service = result.data;
        
        // Set form data
        setFormData({
          companyName: service.companyName || '',
          tagline: service.tagline || '',
          aboutYourCompany: service.aboutYourCompany || '',
          location: service.location || '',
          fullAddress: service.fullAddress || '',
          startingPrice: service.startingPrice || '',
          serviceCategory: service.serviceCategory || 'Production Houses',
          availability: service.availability || 'Available',
          available: service.available ?? true
        });

        // Set contact
        setContact({
          phone: service.contact?.phone || '',
          email: service.contact?.email || '',
          hours: service.contact?.hours || '',
          website: service.contact?.website || ''
        });

        // Set arrays
        setSpecialties(service.specialties?.length ? service.specialties : ['']);
        setFeatures(service.features?.length ? service.features : ['']);
        setServices(service.services?.length ? service.services : ['']);
        
        // Set packages
        if (service.packages?.length) {
          setPackages(service.packages.map(pkg => ({
            name: pkg.name || '',
            price: pkg.price || '',
            description: pkg.description || '',
            features: pkg.features?.length ? pkg.features : ['']
          })));
        }

        // Set portfolio
        if (service.portfolio?.length) {
          setPortfolio(service.portfolio);
        }

        // Set existing images
        const allImages = [...(service.images || []), ...(service.image || [])];
        setExistingImages(allImages);

      } else {
        setError('Failed to fetch service data');
      }
    } catch (err) {
      console.error('Error fetching service:', err);
      setError('Error loading service data');
    } finally {
      setLoading(false);
    }
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContact(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Array handlers
  const handleArrayChange = (index, value, setter, array) => {
    const newArray = [...array];
    newArray[index] = value;
    setter(newArray);
  };

  const addArrayItem = (setter, array) => {
    setter([...array, '']);
  };

  const removeArrayItem = (index, setter, array) => {
    if (array.length > 1) {
      setter(array.filter((_, i) => i !== index));
    }
  };

  // Package handlers
  const handlePackageChange = (packageIndex, field, value) => {
    const newPackages = [...packages];
    newPackages[packageIndex][field] = value;
    setPackages(newPackages);
  };

  const handlePackageFeatureChange = (packageIndex, featureIndex, value) => {
    const newPackages = [...packages];
    newPackages[packageIndex].features[featureIndex] = value;
    setPackages(newPackages);
  };

  const addPackageFeature = (packageIndex) => {
    const newPackages = [...packages];
    newPackages[packageIndex].features.push('');
    setPackages(newPackages);
  };

  const removePackageFeature = (packageIndex, featureIndex) => {
    const newPackages = [...packages];
    if (newPackages[packageIndex].features.length > 1) {
      newPackages[packageIndex].features = newPackages[packageIndex].features.filter((_, i) => i !== featureIndex);
      setPackages(newPackages);
    }
  };

  const addPackage = () => {
    setPackages([...packages, {
      name: '',
      price: '',
      description: '',
      features: ['']
    }]);
  };

  const removePackage = (index) => {
    if (packages.length > 1) {
      setPackages(packages.filter((_, i) => i !== index));
    }
  };

  // Portfolio handlers
  const handlePortfolioChange = (index, field, value) => {
    const newPortfolio = [...portfolio];
    newPortfolio[index][field] = value;
    setPortfolio(newPortfolio);
  };

  const addPortfolioItem = () => {
    setPortfolio([...portfolio, { title: '', description: '', image: '' }]);
  };

  const removePortfolioItem = (index) => {
    if (portfolio.length > 1) {
      setPortfolio(portfolio.filter((_, i) => i !== index));
    }
  };

  // Image handlers
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + existingImages.length + newImages.length > 10) {
      alert('Maximum 10 images allowed');
      return;
    }

    const newImageFiles = [];
    const newPreviews = [];

    files.forEach(file => {
      if (file.size > 20 * 1024 * 1024) {
        alert(`${file.name} is too large. Max 20MB per image.`);
        return;
      }

      newImageFiles.push(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target.result);
        if (newPreviews.length === files.length) {
          setImagePreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setNewImages(prev => [...prev, ...newImageFiles]);
  };

  const removeExistingImage = (imageUrl) => {
    setExistingImages(prev => prev.filter(img => img !== imageUrl));
    setImagesToDelete(prev => [...prev, imageUrl]);
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();

      // Add text fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      console.log('📤 Form Data being sent:');
      console.log('  - Availability:', formData.availability);
      console.log('  - Available:', formData.available);

      // ✅ Add contact as JSON string (this is an object, needs to be stringified)
      formDataToSend.append('contact', JSON.stringify(contact));

      // ✅ Add arrays - Send each item separately for multer to parse as array
      const cleanSpecialties = specialties
        .map(s => typeof s === 'string' ? s : String(s))
        .filter(s => s.trim());
      cleanSpecialties.forEach(item => {
        formDataToSend.append('specialties[]', item);
      });

      const cleanFeatures = features
        .map(f => typeof f === 'string' ? f : String(f))
        .filter(f => f.trim());
      cleanFeatures.forEach(item => {
        formDataToSend.append('features[]', item);
      });

      const cleanServices = services
        .map(s => typeof s === 'string' ? s : String(s))
        .filter(s => s.trim());
      cleanServices.forEach(item => {
        formDataToSend.append('services[]', item);
      });
      
      // ✅ Add packages as JSON string (complex nested structure)
      const cleanPackages = packages.map(pkg => ({
        name: pkg.name || '',
        price: pkg.price || '',
        description: pkg.description || '',
        features: (pkg.features || [])
          .map(f => typeof f === 'string' ? f : String(f))
          .filter(f => f.trim())
      })).filter(pkg => pkg.name && pkg.price);
      formDataToSend.append('packages', JSON.stringify(cleanPackages));

      // ✅ Add portfolio as JSON string (complex nested structure)
      const cleanPortfolio = portfolio.filter(item => 
        (item.title && item.title.trim()) || 
        (item.description && item.description.trim()) || 
        (item.image && item.image.trim())
      );
      formDataToSend.append('portfolio', JSON.stringify(cleanPortfolio));

      // Add existing images as JSON string (array of URLs)
      formDataToSend.append('existingImages', JSON.stringify(existingImages));

      // Add images to delete
      if (imagesToDelete.length > 0) {
        formDataToSend.append('imagesToDelete', JSON.stringify(imagesToDelete));
      }

      // Add new images as files
      newImages.forEach(image => {
        formDataToSend.append('images', image);
      });

      console.log('🔄 Updating service with ID:', serviceId);
      console.log('📤 Sending data:');
      console.log('  - Specialties:', cleanSpecialties);
      console.log('  - Features:', cleanFeatures);
      console.log('  - Services:', cleanServices);
      console.log('  - Packages:', cleanPackages);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      console.log('📥 Response status:', response.status);
      const result = await response.json();
      console.log('📥 Response data:', result);

      if (result.success) {
        setSuccessMessage('Service updated successfully!');
        setTimeout(() => {
          router.push('/vendor/services');
        }, 2000);
      } else {
        setError(result.message || 'Failed to update service');
        console.error('❌ Update failed:', result);
      }
    } catch (err) {
      console.error('❌ Error updating service:', err);
      console.error('❌ Error stack:', err.stack);
      setError('Error updating service. Please try again. Check console for details.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading service data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push('/vendor/services')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Service</h1>
          <p className="text-gray-600 mt-1">Update your service information</p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-800">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Category *
              </label>
              <select
                name="serviceCategory"
                value={formData.serviceCategory}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                {serviceCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleInputChange}
                placeholder="e.g., Premium Event Production Services"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About Your Company
              </label>
              <textarea
                name="aboutYourCompany"
                value={formData.aboutYourCompany}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City/Area *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="e.g., Dhaka, Gulshan"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Starting Price *
              </label>
              <input
                type="number"
                name="startingPrice"
                value={formData.startingPrice}
                onChange={handleInputChange}
                required
                placeholder="e.g., 50000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Address
              </label>
              <input
                type="text"
                name="fullAddress"
                value={formData.fullAddress}
                onChange={handleInputChange}
                placeholder="Complete address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Availability</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                {availabilityOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleInputChange}
                className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Currently accepting bookings
              </label>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={contact.phone}
                onChange={handleContactChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={contact.email}
                onChange={handleContactChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Hours
              </label>
              <input
                type="text"
                name="hours"
                value={contact.hours}
                onChange={handleContactChange}
                placeholder="e.g., Mon-Fri 9AM-6PM"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={contact.website}
                onChange={handleContactChange}
                placeholder="https://"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
          
          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Current Images:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {existingImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Service ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images Preview */}
          {imagePreviews.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">New Images:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`New ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-green-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Button */}
          <div>
            <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-cyan-500 hover:bg-cyan-50 transition-colors">
              <div className="text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload images
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Max 10 images total, 20MB each
                </p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Specialties */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Specialties</h2>
          
          <div className="space-y-3">
            {specialties.map((specialty, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => handleArrayChange(index, e.target.value, setSpecialties, specialties)}
                  placeholder="e.g., Wedding Photography"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, setSpecialties, specialties)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem(setSpecialties, specialties)}
              className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Specialty
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Features</h2>
          
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleArrayChange(index, e.target.value, setFeatures, features)}
                  placeholder="e.g., Professional Equipment"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, setFeatures, features)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem(setFeatures, features)}
              className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Feature
            </button>
          </div>
        </div>

        {/* Services Offered */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Services Offered</h2>
          
          <div className="space-y-3">
            {services.map((service, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={service}
                  onChange={(e) => handleArrayChange(index, e.target.value, setServices, services)}
                  placeholder="e.g., Video Production"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, setServices, services)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem(setServices, services)}
              className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Service
            </button>
          </div>
        </div>

        {/* Packages */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing Packages</h2>
          
          <div className="space-y-6">
            {packages.map((pkg, pkgIndex) => (
              <div key={pkgIndex} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-gray-900">Package {pkgIndex + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removePackage(pkgIndex)}
                    className="text-red-600 hover:bg-red-50 p-1 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    value={pkg.name}
                    onChange={(e) => handlePackageChange(pkgIndex, 'name', e.target.value)}
                    placeholder="Package Name"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  />
                  <input
                    type="number"
                    value={pkg.price}
                    onChange={(e) => handlePackageChange(pkgIndex, 'price', e.target.value)}
                    placeholder="Price"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <textarea
                  value={pkg.description}
                  onChange={(e) => handlePackageChange(pkgIndex, 'description', e.target.value)}
                  placeholder="Package Description"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 mb-4"
                />

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Features:</p>
                  {pkg.features.map((feature, featIndex) => (
                    <div key={featIndex} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handlePackageFeatureChange(pkgIndex, featIndex, e.target.value)}
                        placeholder="Feature"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                      />
                      <button
                        type="button"
                        onClick={() => removePackageFeature(pkgIndex, featIndex)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="w-4 h-4" />
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
            ))}
            
            <button
              type="button"
              onClick={addPackage}
              className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Package
            </button>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Update Service
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => router.push('/vendor/services')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}