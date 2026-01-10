"use client";
import React, { useState } from 'react';

const Container = ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
};

const JoinOurNetwork = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    serviceCategory: '',
    email: '',
    phone: '',
    description: ''
  });

  const serviceCategories = [
    'Production Houses',
    'Community Centers',
    'Event Management',
    'Photographers',
    'Cinematographers',
    'Cooks & Caterers'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-outfit font-bold text-gray-900 mb-2">
              Join Our Professional Network
            </h1>
            <p className="text-gray-700 font-outfit">
              Register your business and reach thousands of potential clients
            </p>
          </div>

          {/* Form */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-8">
            {/* Business Name */}
            <div className="mb-6">
              <label htmlFor="businessName" className="block text-sm font-semibold text-gray-900 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Enter your business name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder:text-gray-400"
              />
            </div>

            {/* Service Category */}
            <div className="mb-6">
              <label htmlFor="serviceCategory" className="block text-sm font-semibold text-gray-900 mb-2">
                Service Category *
              </label>
              <select
                id="serviceCategory"
                name="serviceCategory"
                value={formData.serviceCategory}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent appearance-none bg-white text-gray-700 cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center'
                }}
              >
                <option value="" disabled>
                  choose service category
                </option>
                {serviceCategories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Email Address */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder:text-gray-400"
              />
            </div>

            {/* Phone Number */}
            <div className="mb-6">
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder:text-gray-400"
              />
            </div>

            {/* Business Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
                Business Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter your business description"
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder:text-gray-400 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300"
            >
              Register Your Business
            </button>

            {/* Terms */}
            <p className="text-center text-sm text-gray-700 mt-4">
              By registering, you agree to our{' '}
              <a href="/terms" className="text-cyan-500 hover:text-cyan-600 font-medium">
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default JoinOurNetwork;