"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const Container = ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
};

const JoinOurNetwork = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    buisnessName: '',
    service: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

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
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.buisnessName.trim()) {
      newErrors.buisnessName = 'Business name is required';
    }

    if (!formData.service) {
      newErrors.service = 'Please select a service category';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number (10-15 digits)';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Build the API URL
      const apiUrl = `${process.env.NEXT_PUBLIC_API}/auth/signup`;
      
      // Debug logs
      console.log('🔧 Environment Variable:', process.env.NEXT_PUBLIC_API);
      console.log('🌐 Full API URL:', apiUrl);
      console.log('📤 Sending Data:', {
        buisnessName: formData.buisnessName,
        service: formData.service,
        email: formData.email,
        phone: formData.phone,
        password: '******' // Don't log actual password
      });

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buisnessName: formData.buisnessName,
          service: formData.service,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        })
      });

      console.log('📥 Response Status:', response.status);
      console.log('📥 Response OK:', response.ok);

      const data = await response.json();
      console.log('📥 Response Data:', data);
      
      if (data.success) {
        // Store email for OTP verification
        localStorage.setItem('verifyEmail', formData.email);
        
        // Show success message
        alert('✅ Registration successful! Please check your email for OTP.');
        
        // Redirect to OTP verification page
        router.push('/verify-otp');
      } else {
        // Show error message
        console.error('❌ Registration failed:', data.message);
        alert('❌ ' + data.message);
        setErrors({ submit: data.message });
      }
    } catch (error) {
      console.error('❌ Fetch Error:', error);
      console.error('❌ Error Details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      alert('❌ Registration failed. Please check console for details.');
      setErrors({ submit: 'Registration failed. Please check your internet connection.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Container>
        <div className="max-w-md mx-auto">
          {/* Debug Info (Remove in production) */}
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-mono text-blue-900">
              🔧 API Base: {process.env.NEXT_PUBLIC_API || 'NOT SET'}
            </p>
            <p className="text-xs font-mono text-blue-900">
              🌐 Full URL: {process.env.NEXT_PUBLIC_API}/auth/signup
            </p>
            <p className="text-xs text-blue-700 mt-2">
              (Remove this debug box in production)
            </p>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-green-500 rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-outfit font-bold text-gray-900 mb-2">
              Join Our Professional Network
            </h1>
            <p className="text-gray-600 font-outfit">
              Register your business and reach thousands of potential clients
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8">
            {/* Error Alert */}
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Business Name */}
            <div className="mb-6">
              <label htmlFor="buisnessName" className="block text-sm font-semibold text-gray-900 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                id="buisnessName"
                name="buisnessName"
                value={formData.buisnessName}
                onChange={handleChange}
                placeholder="Enter your business name"
                className={`w-full px-4 py-3 border ${errors.buisnessName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder:text-gray-400 transition-colors`}
              />
              {errors.buisnessName && (
                <p className="mt-1 text-sm text-red-600">{errors.buisnessName}</p>
              )}
            </div>

            {/* Service Category */}
            <div className="mb-6">
              <label htmlFor="service" className="block text-sm font-semibold text-gray-900 mb-2">
                Service Category *
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.service ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent appearance-none bg-white text-gray-700 cursor-pointer transition-colors`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center'
                }}
              >
                <option value="" disabled>
                  Choose service category
                </option>
                {serviceCategories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.service && (
                <p className="mt-1 text-sm text-red-600">{errors.service}</p>
              )}
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
                className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder:text-gray-400 transition-colors`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
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
                className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder:text-gray-400 transition-colors`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password (min 6 characters)"
                  className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder:text-gray-400 transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Registering...
                </>
              ) : (
                'Register Your Business'
              )}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{' '}
              <a href="/login" className="text-cyan-600 hover:text-cyan-700 font-semibold">
                Login here
              </a>
            </p>

            {/* Terms */}
            <p className="text-center text-xs text-gray-500 mt-4">
              By registering, you agree to our{' '}
              <a href="/terms" className="text-cyan-600 hover:text-cyan-700 font-medium">
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="/privacy" className="text-cyan-600 hover:text-cyan-700 font-medium">
                Privacy Policy
              </a>
            </p>
          </form>
        </div>
      </Container>
    </section>
  );
};

export default JoinOurNetwork;