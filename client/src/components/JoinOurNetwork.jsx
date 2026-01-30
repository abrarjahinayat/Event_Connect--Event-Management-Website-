"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, AlertCircle, Upload, FileText, X } from 'lucide-react';

const Container = ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
};

const JoinOurNetwork = () => {
  const router = useRouter();
  const [language, setLanguage] = useState("en");
  const [formData, setFormData] = useState({
    buisnessName: '',
    service: '',
    email: '',
    phone: '',
    password: '',
    businessRegistrationNumber: '',
    ownerNationalId: ''
  });
  
  const [files, setFiles] = useState({
    tradeLicense: null,
    nidDocument: null
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Translations
  const translations = {
    en: {
      pageTitle: 'Join Our Professional Network',
      pageSubtitle: 'Register your business and reach thousands of potential clients',
      basicInfo: '📋 Basic Information',
      businessName: 'Business Name',
      businessNamePlaceholder: 'Enter your business name',
      serviceCategory: 'Service Category',
      serviceCategoryPlaceholder: 'Choose service category',
      email: 'Email Address',
      emailPlaceholder: 'Enter your email address',
      phone: 'Phone Number',
      phonePlaceholder: 'Enter your phone number',
      password: 'Password',
      passwordPlaceholder: 'Enter your password (min 6 characters)',
      businessVerification: '🔐 Business Verification',
      verificationSubtitle: 'Please provide your business registration details for verification',
      businessRegNumber: 'Business Registration Number',
      businessRegPlaceholder: 'e.g., TRAD/DSCC/123456/2024',
      ownerNID: 'Owner National ID Number',
      ownerNIDPlaceholder: 'e.g., 1234567890123',
      uploadTradeLicense: 'Upload Trade License',
      uploadTradeLicenseSub: '(PDF or Image)',
      uploadNID: 'Upload NID Copy',
      uploadNIDSub: '(PDF or Image)',
      clickToUpload: 'Click to upload',
      dragDrop: 'or drag and drop',
      fileTypes: 'PDF, JPG, PNG (Max 20MB)',
      verificationNote: 'Document Verification',
      verificationText: 'Your documents will be reviewed by our admin team within 24-48 hours. You\'ll receive an email notification once verified.',
      submitButton: 'Register Your Business',
      submitting: 'Submitting for Verification...',
      alreadyAccount: 'Already have an account?',
      loginHere: 'Login here',
      termsText: 'By registering, you agree to our',
      termsService: 'Terms of Service',
      and: 'and',
      privacyPolicy: 'Privacy Policy',
      required: '*',
      serviceCategories: [
        'Production Houses',
        'Community Centers',
        'Event Management',
        'Photographers',
        'Cinematographers',
        'Cooks & Caterers'
      ]
    },
    bn: {
      pageTitle: 'আমাদের পেশাদার নেটওয়ার্কে যোগ দিন',
      pageSubtitle: 'আপনার ব্যবসা নিবন্ধন করুন এবং হাজারো সম্ভাব্য ক্লায়েন্টদের কাছে পৌঁছান',
      basicInfo: '📋 মৌলিক তথ্য',
      businessName: 'ব্যবসার নাম',
      businessNamePlaceholder: 'আপনার ব্যবসার নাম লিখুন',
      serviceCategory: 'সেবার ক্যাটাগরি',
      serviceCategoryPlaceholder: 'সেবার ক্যাটাগরি নির্বাচন করুন',
      email: 'ইমেইল ঠিকানা',
      emailPlaceholder: 'আপনার ইমেইল ঠিকানা লিখুন',
      phone: 'ফোন নম্বর',
      phonePlaceholder: 'আপনার ফোন নম্বর লিখুন',
      password: 'পাসওয়ার্ড',
      passwordPlaceholder: 'আপনার পাসওয়ার্ড লিখুন (নূন্যতম ৬ অক্ষর)',
      businessVerification: '🔐 ব্যবসা যাচাইকরণ',
      verificationSubtitle: 'যাচাইকরণের জন্য আপনার ব্যবসা নিবন্ধনের বিবরণ প্রদান করুন',
      businessRegNumber: 'ব্যবসা নিবন্ধন নম্বর',
      businessRegPlaceholder: 'যেমন: TRAD/DSCC/123456/2024',
      ownerNID: 'মালিকের জাতীয় পরিচয়পত্র নম্বর',
      ownerNIDPlaceholder: 'যেমন: ১২৩৪৫৬৭৮৯০১২৩',
      uploadTradeLicense: 'ট্রেড লাইসেন্স আপলোড করুন',
      uploadTradeLicenseSub: '(PDF বা ছবি)',
      uploadNID: 'NID কপি আপলোড করুন',
      uploadNIDSub: '(PDF বা ছবি)',
      clickToUpload: 'আপলোড করতে ক্লিক করুন',
      dragDrop: 'অথবা ড্র্যাগ এবং ড্রপ করুন',
      fileTypes: 'PDF, JPG, PNG (সর্বোচ্চ 20MB)',
      verificationNote: 'নথি যাচাইকরণ',
      verificationText: 'আপনার নথি ২৪-৪৮ ঘন্টার মধ্যে আমাদের অ্যাডমিন টিম দ্বারা পর্যালোচনা করা হবে। যাচাই হয়ে গেলে আপনি একটি ইমেইল বিজ্ঞপ্তি পাবেন।',
      submitButton: 'আপনার ব্যবসা নিবন্ধন করুন',
      submitting: 'যাচাইকরণের জন্য জমা দেওয়া হচ্ছে...',
      alreadyAccount: 'ইতিমধ্যে একটি অ্যাকাউন্ট আছে?',
      loginHere: 'এখানে লগইন করুন',
      termsText: 'নিবন্ধন করে, আপনি আমাদের সাথে একমত হন',
      termsService: 'সেবার শর্তাবলী',
      and: 'এবং',
      privacyPolicy: 'গোপনীয়তা নীতি',
      required: '*',
      serviceCategories: [
        'প্রোডাকশন হাউস',
        'কমিউনিটি সেন্টার',
        'ইভেন্ট ম্যানেজমেন্ট',
        'ফটোগ্রাফার',
        'সিনেমাটোগ্রাফার',
        'রাঁধুনি ও ক্যাটারার'
      ]
    }
  };

  const serviceCategoriesEn = [
    'Production Houses',
    'Community Centers',
    'Event Management',
    'Photographers',
    'Cinematographers',
    'Cooks & Caterers'
  ];

  const t = translations[language];

  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferredLanguage");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    const interval = setInterval(() => {
      const currentLanguage = localStorage.getItem("preferredLanguage") || "en";
      if (currentLanguage !== language) {
        setLanguage(currentLanguage);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [language]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: language === 'bn' ? 'শুধুমাত্র JPG, PNG, বা PDF ফাইল অনুমোদিত' : 'Only JPG, PNG, or PDF files are allowed'
        }));
        return;
      }

      if (file.size > 20 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: language === 'bn' ? 'ফাইলের আকার ২০MB এর কম হতে হবে' : 'File size must be less than 20MB'
        }));
        return;
      }

      setFiles(prev => ({
        ...prev,
        [fieldName]: file
      }));

      if (errors[fieldName]) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: ''
        }));
      }
    }
  };

  const removeFile = (fieldName) => {
    setFiles(prev => ({
      ...prev,
      [fieldName]: null
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.buisnessName.trim()) {
      newErrors.buisnessName = language === 'bn' ? 'ব্যবসার নাম প্রয়োজন' : 'Business name is required';
    }

    if (!formData.service) {
      newErrors.service = language === 'bn' ? 'একটি সেবা ক্যাটাগরি নির্বাচন করুন' : 'Please select a service category';
    }

    if (!formData.email.trim()) {
      newErrors.email = language === 'bn' ? 'ইমেইল প্রয়োজন' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = language === 'bn' ? 'একটি বৈধ ইমেইল লিখুন' : 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = language === 'bn' ? 'ফোন নম্বর প্রয়োজন' : 'Phone number is required';
    } else if (!/^[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = language === 'bn' ? 'একটি বৈধ ফোন নম্বর লিখুন (১০-১৫ ডিজিট)' : 'Please enter a valid phone number (10-15 digits)';
    }

    if (!formData.password) {
      newErrors.password = language === 'bn' ? 'পাসওয়ার্ড প্রয়োজন' : 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = language === 'bn' ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' : 'Password must be at least 6 characters';
    }

    if (!formData.businessRegistrationNumber.trim()) {
      newErrors.businessRegistrationNumber = language === 'bn' ? 'ব্যবসা নিবন্ধন নম্বর প্রয়োজন' : 'Business registration number is required';
    }

    if (!formData.ownerNationalId.trim()) {
      newErrors.ownerNationalId = language === 'bn' ? 'মালিকের জাতীয় পরিচয়পত্র প্রয়োজন' : 'Owner National ID is required';
    } else if (!/^[0-9]{10,17}$/.test(formData.ownerNationalId.replace(/\s/g, ''))) {
      newErrors.ownerNationalId = language === 'bn' ? 'একটি বৈধ NID লিখুন (১০-১৭ ডিজিট)' : 'Please enter a valid NID (10-17 digits)';
    }

    if (!files.tradeLicense) {
      newErrors.tradeLicense = language === 'bn' ? 'ট্রেড লাইসেন্স নথি প্রয়োজন' : 'Trade License document is required';
    }

    if (!files.nidDocument) {
      newErrors.nidDocument = language === 'bn' ? 'NID নথি প্রয়োজন' : 'NID document is required';
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
      const formDataToSend = new FormData();
      
      formDataToSend.append('buisnessName', formData.buisnessName);
      formDataToSend.append('service', formData.service);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('businessRegistrationNumber', formData.businessRegistrationNumber);
      formDataToSend.append('ownerNationalId', formData.ownerNationalId);
      
      formDataToSend.append('tradeLicense', files.tradeLicense);
      formDataToSend.append('nidDocument', files.nidDocument);

      const apiUrl = `${process.env.NEXT_PUBLIC_API}/auth/signup`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('verifyEmail', formData.email);
        
        alert(language === 'bn' 
          ? '✅ নিবন্ধন সফল! OTP এর জন্য আপনার ইমেইল চেক করুন।\n\n⏳ আপনার নথি অ্যাডমিন যাচাইকরণ মুলতুবি রয়েছে।'
          : '✅ Registration successful! Please check your email for OTP.\n\n⏳ Your documents are pending admin verification.'
        );
        
        router.push('/verify-otp');
      } else {
        alert('❌ ' + data.message);
        setErrors({ submit: data.message });
      }
    } catch (error) {
      console.error('❌ Fetch Error:', error);
      alert(language === 'bn' 
        ? '❌ নিবন্ধন ব্যর্থ হয়েছে। আপনার ইন্টারনেট সংযোগ চেক করুন।'
        : '❌ Registration failed. Please check your internet connection.'
      );
      setErrors({ submit: language === 'bn' ? 'নিবন্ধন ব্যর্থ হয়েছে। আপনার ইন্টারনেট সংযোগ চেক করুন।' : 'Registration failed. Please check your internet connection.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="join-network" className="min-h-screen py-12 md:py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Container>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-cyan-500 to-green-500 rounded-full mb-4">
              <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <h1 className={`text-2xl md:text-3xl font-bold text-gray-900 mb-2 ${
              language === 'bn' ? 'font-hind-siliguri' : 'font-outfit'
            }`}>
              {t.pageTitle}
            </h1>
            <p className={`text-sm md:text-base text-gray-600 ${
              language === 'bn' ? 'font-hind-siliguri' : 'font-outfit'
            }`}>
              {t.pageSubtitle}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6 md:p-8">
            {/* Error Alert */}
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className={`text-sm text-red-600 ${language === 'bn' ? 'font-hind-siliguri' : ''}`}>
                  {errors.submit}
                </p>
              </div>
            )}

            {/* Section 1: Basic Information */}
            <div className="mb-6 md:mb-8">
              <h2 className={`text-base md:text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 ${
                language === 'bn' ? 'font-hind-siliguri' : ''
              }`}>
                {t.basicInfo}
              </h2>

              {/* Business Name */}
              <div className="mb-4 md:mb-6">
                <label htmlFor="buisnessName" className={`block text-sm font-semibold text-gray-900 mb-2 ${
                  language === 'bn' ? 'font-hind-siliguri' : ''
                }`}>
                  {t.businessName} {t.required}
                </label>
                <input
                  type="text"
                  id="buisnessName"
                  name="buisnessName"
                  value={formData.buisnessName}
                  onChange={handleChange}
                  placeholder={t.businessNamePlaceholder}
                  className={`w-full px-4 py-2.5 md:py-3 border ${errors.buisnessName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder:text-gray-400 transition-colors text-sm md:text-base ${
                    language === 'bn' ? 'font-hind-siliguri' : ''
                  }`}
                />
                {errors.buisnessName && (
                  <p className={`mt-1 text-sm text-red-600 ${language === 'bn' ? 'font-hind-siliguri' : ''}`}>
                    {errors.buisnessName}
                  </p>
                )}
              </div>

              {/* Service Category */}
              <div className="mb-4 md:mb-6">
                <label htmlFor="service" className={`block text-sm font-semibold text-gray-900 mb-2 ${
                  language === 'bn' ? 'font-hind-siliguri' : ''
                }`}>
                  {t.serviceCategory} {t.required}
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 md:py-3 border ${errors.service ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent appearance-none bg-white text-gray-700 cursor-pointer transition-colors text-sm md:text-base ${
                    language === 'bn' ? 'font-hind-siliguri' : ''
                  }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center'
                  }}
                >
                  <option value="" disabled>
                    {t.serviceCategoryPlaceholder}
                  </option>
                  {serviceCategoriesEn.map((category, index) => (
                    <option key={index} value={category}>
                      {t.serviceCategories[index]}
                    </option>
                  ))}
                </select>
                {errors.service && (
                  <p className={`mt-1 text-sm text-red-600 ${language === 'bn' ? 'font-hind-siliguri' : ''}`}>
                    {errors.service}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="mb-4 md:mb-6">
                <label htmlFor="email" className={`block text-sm font-semibold text-gray-900 mb-2 ${
                  language === 'bn' ? 'font-hind-siliguri' : ''
                }`}>
                  {t.email} {t.required}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t.emailPlaceholder}
                  className={`w-full px-4 py-2.5 md:py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder:text-gray-400 transition-colors text-sm md:text-base`}
                />
                {errors.email && (
                  <p className={`mt-1 text-sm text-red-600 ${language === 'bn' ? 'font-hind-siliguri' : ''}`}>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="mb-4 md:mb-6">
                <label htmlFor="phone" className={`block text-sm font-semibold text-gray-900 mb-2 ${
                  language === 'bn' ? 'font-hind-siliguri' : ''
                }`}>
                  {t.phone} {t.required}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t.phonePlaceholder}
                  className={`w-full px-4 py-2.5 md:py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder:text-gray-400 transition-colors text-sm md:text-base`}
                />
                {errors.phone && (
                  <p className={`mt-1 text-sm text-red-600 ${language === 'bn' ? 'font-hind-siliguri' : ''}`}>
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="mb-4 md:mb-6">
                <label htmlFor="password" className={`block text-sm font-semibold text-gray-900 mb-2 ${
                  language === 'bn' ? 'font-hind-siliguri' : ''
                }`}>
                  {t.password} {t.required}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t.passwordPlaceholder}
                    className={`w-full px-4 py-2.5 md:py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder:text-gray-400 transition-colors text-sm md:text-base ${
                      language === 'bn' ? 'font-hind-siliguri' : ''
                    }`}
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
                  <p className={`mt-1 text-sm text-red-600 ${language === 'bn' ? 'font-hind-siliguri' : ''}`}>
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            {/* Section 2: Business Verification */}
            <div className="mb-6 md:mb-8 pt-6 border-t border-gray-200">
              <h2 className={`text-base md:text-lg font-semibold text-gray-900 mb-2 ${
                language === 'bn' ? 'font-hind-siliguri' : ''
              }`}>
                {t.businessVerification}
              </h2>
              <p className={`text-xs md:text-sm text-gray-600 mb-4 ${
                language === 'bn' ? 'font-hind-siliguri' : ''
              }`}>
                {t.verificationSubtitle}
              </p>

              {/* Business Registration Number */}
              <div className="mb-4 md:mb-6">
                <label htmlFor="businessRegistrationNumber" className={`block text-sm font-semibold text-gray-900 mb-2 ${
                  language === 'bn' ? 'font-hind-siliguri' : ''
                }`}>
                  {t.businessRegNumber} {t.required}
                </label>
                <input
                  type="text"
                  id="businessRegistrationNumber"
                  name="businessRegistrationNumber"
                  value={formData.businessRegistrationNumber}
                  onChange={handleChange}
                  placeholder={t.businessRegPlaceholder}
                  className={`w-full px-4 py-2.5 md:py-3 border ${errors.businessRegistrationNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder:text-gray-400 transition-colors text-sm md:text-base`}
                />
                {errors.businessRegistrationNumber && (
                  <p className={`mt-1 text-sm text-red-600 ${language === 'bn' ? 'font-hind-siliguri' : ''}`}>
                    {errors.businessRegistrationNumber}
                  </p>
                )}
              </div>

              {/* Owner National ID */}
              <div className="mb-4 md:mb-6">
                <label htmlFor="ownerNationalId" className={`block text-sm font-semibold text-gray-900 mb-2 ${
                  language === 'bn' ? 'font-hind-siliguri' : ''
                }`}>
                  {t.ownerNID} {t.required}
                </label>
                <input
                  type="text"
                  id="ownerNationalId"
                  name="ownerNationalId"
                  value={formData.ownerNationalId}
                  onChange={handleChange}
                  placeholder={t.ownerNIDPlaceholder}
                  className={`w-full px-4 py-2.5 md:py-3 border ${errors.ownerNationalId ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder:text-gray-400 transition-colors text-sm md:text-base`}
                />
                {errors.ownerNationalId && (
                  <p className={`mt-1 text-sm text-red-600 ${language === 'bn' ? 'font-hind-siliguri' : ''}`}>
                    {errors.ownerNationalId}
                  </p>
                )}
              </div>

              {/* Trade License Upload */}
              <div className="mb-4 md:mb-6">
                <label className={`block text-sm font-semibold text-gray-900 mb-2 ${
                  language === 'bn' ? 'font-hind-siliguri' : ''
                }`}>
                  {t.uploadTradeLicense} {t.required} {t.uploadTradeLicenseSub}
                </label>
                
                {!files.tradeLicense ? (
                  <label className="flex flex-col items-center justify-center w-full h-28 md:h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-cyan-400 hover:bg-cyan-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-6 h-6 md:w-8 md:h-8 text-gray-400 mb-2" />
                      <p className={`text-xs md:text-sm text-gray-600 ${
                        language === 'bn' ? 'font-hind-siliguri' : ''
                      }`}>
                        <span className="font-semibold">{t.clickToUpload}</span> {t.dragDrop}
                      </p>
                      <p className={`text-[10px] md:text-xs text-gray-500 mt-1 ${
                        language === 'bn' ? 'font-hind-siliguri' : ''
                      }`}>
                        {t.fileTypes}
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, 'tradeLicense')}
                    />
                  </label>
                ) : (
                  <div className="flex items-center gap-3 p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg">
                    <FileText className="w-6 h-6 md:w-8 md:h-8 text-green-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
                        {files.tradeLicense.name}
                      </p>
                      <p className="text-[10px] md:text-xs text-gray-500">
                        {(files.tradeLicense.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('tradeLicense')}
                      className="p-1 hover:bg-red-100 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                    </button>
                  </div>
                )}
                
                {errors.tradeLicense && (
                  <p className={`mt-1 text-sm text-red-600 ${language === 'bn' ? 'font-hind-siliguri' : ''}`}>
                    {errors.tradeLicense}
                  </p>
                )}
              </div>

              {/* NID Upload */}
              <div className="mb-4 md:mb-6">
                <label className={`block text-sm font-semibold text-gray-900 mb-2 ${
                  language === 'bn' ? 'font-hind-siliguri' : ''
                }`}>
                  {t.uploadNID} {t.required} {t.uploadNIDSub}
                </label>
                
                {!files.nidDocument ? (
                  <label className="flex flex-col items-center justify-center w-full h-28 md:h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-cyan-400 hover:bg-cyan-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-6 h-6 md:w-8 md:h-8 text-gray-400 mb-2" />
                      <p className={`text-xs md:text-sm text-gray-600 ${
                        language === 'bn' ? 'font-hind-siliguri' : ''
                      }`}>
                        <span className="font-semibold">{t.clickToUpload}</span> {t.dragDrop}
                      </p>
                      <p className={`text-[10px] md:text-xs text-gray-500 mt-1 ${
                        language === 'bn' ? 'font-hind-siliguri' : ''
                      }`}>
                        {t.fileTypes}
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, 'nidDocument')}
                    />
                  </label>
                ) : (
                  <div className="flex items-center gap-3 p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg">
                    <FileText className="w-6 h-6 md:w-8 md:h-8 text-green-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
                        {files.nidDocument.name}
                      </p>
                      <p className="text-[10px] md:text-xs text-gray-500">
                        {(files.nidDocument.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('nidDocument')}
                      className="p-1 hover:bg-red-100 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                    </button>
                  </div>
                )}
                
                {errors.nidDocument && (
                  <p className={`mt-1 text-sm text-red-600 ${language === 'bn' ? 'font-hind-siliguri' : ''}`}>
                    {errors.nidDocument}
                  </p>
                )}
              </div>

              {/* Info Box */}
              <div className="p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex gap-3">
                  <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className={`text-xs md:text-sm text-blue-800 ${
                    language === 'bn' ? 'font-hind-siliguri' : ''
                  }`}>
                    <p className="font-semibold mb-1">{t.verificationNote}</p>
                    <p className="text-blue-700">
                      {t.verificationText}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm md:text-base ${
                language === 'bn' ? 'font-hind-siliguri' : ''
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t.submitting}
                </>
              ) : (
                t.submitButton
              )}
            </button>

            {/* Login Link */}
            <p className={`text-center text-xs md:text-sm text-gray-600 mt-4 md:mt-6 ${
              language === 'bn' ? 'font-hind-siliguri' : ''
            }`}>
              {t.alreadyAccount}{' '}
              <a href="/login" className="text-cyan-600 hover:text-cyan-700 font-semibold">
                {t.loginHere}
              </a>
            </p>

            {/* Terms */}
            <p className={`text-center text-[10px] md:text-xs text-gray-500 mt-3 md:mt-4 ${
              language === 'bn' ? 'font-hind-siliguri' : ''
            }`}>
              {t.termsText}{' '}
              <a href="/terms" className="text-cyan-600 hover:text-cyan-700 font-medium">
                {t.termsService}
              </a>
              {' '}{t.and}{' '}
              <a href="/privacy" className="text-cyan-600 hover:text-cyan-700 font-medium">
                {t.privacyPolicy}
              </a>
            </p>
          </form>
        </div>
      </Container>
    </section>
  );
};

export default JoinOurNetwork;