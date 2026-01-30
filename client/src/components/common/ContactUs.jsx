"use client";
import React, { useState, useEffect } from 'react';
import contactus from '../../images/contactus.png';
import Image from 'next/image';
import { Mail, User, MessageSquare, Send, Phone, MapPin, Clock, CheckCircle } from 'lucide-react';

const Container = ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
};

const ContactUs = () => {
  const [language, setLanguage] = useState("en");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Translations
  const translations = {
    en: {
      badge: 'GET IN TOUCH',
      heading1: 'Contact',
      heading2: 'Us',
      description: "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
      emailUs: 'Email Us',
      emailSub: 'Drop us an email anytime',
      callUs: 'Call Us',
      callSub: 'Mon-Fri from 9am to 6pm',
      visitUs: 'Visit Us',
      visitSub: 'Come say hello',
      location: 'Dhaka, Bangladesh',
      letsConnect: "Let's Connect",
      connectDescription: "We're here to help make your events unforgettable. Reach out to us and let's create something amazing together!",
      emailLabel: 'Email',
      phoneLabel: 'Phone',
      workingHours: 'Working Hours',
      workingTime: 'Mon - Fri: 9AM - 6PM',
      sendMessage: 'Send us a Message',
      formDescription: "Fill out the form below and we'll get back to you within 24 hours",
      yourName: 'Your Name',
      namePlaceholder: 'John Doe',
      yourEmail: 'Your Email',
      emailPlaceholder: 'john@example.com',
      yourMessage: 'Your Message',
      messagePlaceholder: 'Tell us how we can help you...',
      sendButton: 'Send Message',
      sending: 'Sending...',
      messageSent: 'Message Sent!',
      thankYou: 'Thank you for reaching out. We\'ll respond soon!',
      responseTime: 'Expected response time:',
      within24Hours: 'Within 24 hours',
      required: '*'
    },
    bn: {
      badge: 'যোগাযোগ করুন',
      heading1: 'যোগাযোগ',
      heading2: 'করুন',
      description: 'প্রশ্ন আছে? আমরা আপনার কাছ থেকে শুনতে চাই। আমাদের একটি বার্তা পাঠান এবং আমরা যত তাড়াতাড়ি সম্ভব সাড়া দেব।',
      emailUs: 'আমাদের ইমেইল করুন',
      emailSub: 'যেকোনো সময় আমাদের ইমেইল পাঠান',
      callUs: 'আমাদের কল করুন',
      callSub: 'সোম-শুক্র সকাল ৯টা থেকে সন্ধ্যা ৬টা',
      visitUs: 'আমাদের দেখতে আসুন',
      visitSub: 'এসে হ্যালো বলুন',
      location: 'ঢাকা, বাংলাদেশ',
      letsConnect: 'আসুন সংযুক্ত হই',
      connectDescription: 'আমরা আপনার ইভেন্টগুলি অবিস্মরণীয় করতে সাহায্য করতে এখানে আছি। আমাদের কাছে পৌঁছান এবং একসাথে অসাধারণ কিছু তৈরি করি!',
      emailLabel: 'ইমেইল',
      phoneLabel: 'ফোন',
      workingHours: 'কাজের সময়',
      workingTime: 'সোম - শুক্র: সকাল ৯টা - সন্ধ্যা ৬টা',
      sendMessage: 'আমাদের একটি বার্তা পাঠান',
      formDescription: 'নিচের ফর্মটি পূরণ করুন এবং আমরা ২৪ ঘন্টার মধ্যে আপনার কাছে ফিরে আসব',
      yourName: 'আপনার নাম',
      namePlaceholder: 'আপনার নাম লিখুন',
      yourEmail: 'আপনার ইমেইল',
      emailPlaceholder: 'আপনার ইমেইল লিখুন',
      yourMessage: 'আপনার বার্তা',
      messagePlaceholder: 'আমরা কীভাবে আপনাকে সাহায্য করতে পারি তা বলুন...',
      sendButton: 'বার্তা পাঠান',
      sending: 'পাঠানো হচ্ছে...',
      messageSent: 'বার্তা পাঠানো হয়েছে!',
      thankYou: 'যোগাযোগের জন্য ধন্যবাদ। আমরা শীঘ্রই সাড়া দেব!',
      responseTime: 'প্রত্যাশিত সাড়া সময়:',
      within24Hours: '২৪ ঘন্টার মধ্যে',
      required: '*'
    }
  };

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Message sent:', formData);
      setLoading(false);
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          message: ''
        });
        setSubmitted(false);
      }, 3000);
    }, 1000);
  };

  return (
    <section id="contact" className="relative py-12 md:py-20 bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/20 overflow-hidden scroll-mt-24">
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-cyan-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-blue-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <Container>
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 relative z-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 px-4 md:px-6 py-2 rounded-full mb-4 md:mb-6 shadow-lg">
            <Mail className="w-4 h-4 md:w-5 md:h-5 text-white" />
            <span className={`text-white font-semibold text-xs md:text-sm uppercase tracking-wide ${
              language === 'bn' ? 'font-hind-siliguri' : ''
            }`}>
              {t.badge}
            </span>
          </div>
          
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 ${
            language === 'bn' ? 'font-hind-siliguri' : ''
          }`}>
            {t.heading1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">{t.heading2}</span>
          </h2>
          <p className={`text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-4 ${
            language === 'bn' ? 'font-hind-siliguri' : ''
          }`}>
            {t.description}
          </p>
        </div>

        {/* Contact Cards - Info Cards Above */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12 relative z-10">
          {/* Email Card */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all border border-cyan-100 group">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform shadow-md">
              <Mail className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <h3 className={`font-bold text-gray-900 text-base md:text-lg mb-2 ${
              language === 'bn' ? 'font-hind-siliguri' : ''
            }`}>
              {t.emailUs}
            </h3>
            <p className={`text-gray-600 text-xs md:text-sm mb-2 md:mb-3 ${
              language === 'bn' ? 'font-hind-siliguri' : ''
            }`}>
              {t.emailSub}
            </p>
            <a href="mailto:info@eventconnect.com" className="text-cyan-600 font-semibold hover:text-cyan-700 transition-colors text-sm md:text-base">
              info@eventconnect.com
            </a>
          </div>

          {/* Phone Card */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all border border-blue-100 group">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform shadow-md">
              <Phone className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <h3 className={`font-bold text-gray-900 text-base md:text-lg mb-2 ${
              language === 'bn' ? 'font-hind-siliguri' : ''
            }`}>
              {t.callUs}
            </h3>
            <p className={`text-gray-600 text-xs md:text-sm mb-2 md:mb-3 ${
              language === 'bn' ? 'font-hind-siliguri' : ''
            }`}>
              {t.callSub}
            </p>
            <a href="tel:+8801234567890" className="text-cyan-600 font-semibold hover:text-cyan-700 transition-colors text-sm md:text-base">
              +880 1234-567890
            </a>
          </div>

          {/* Location Card */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all border border-cyan-100 group sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform shadow-md">
              <MapPin className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <h3 className={`font-bold text-gray-900 text-base md:text-lg mb-2 ${
              language === 'bn' ? 'font-hind-siliguri' : ''
            }`}>
              {t.visitUs}
            </h3>
            <p className={`text-gray-600 text-xs md:text-sm mb-2 md:mb-3 ${
              language === 'bn' ? 'font-hind-siliguri' : ''
            }`}>
              {t.visitSub}
            </p>
            <p className={`text-cyan-600 font-semibold text-sm md:text-base ${
              language === 'bn' ? 'font-hind-siliguri' : ''
            }`}>
              {t.location}
            </p>
          </div>
        </div>

        {/* Main Contact Box */}
        <div className="max-w-6xl mx-auto bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-gray-100 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left Side - Contact Information & Image */}
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-6 md:p-8 lg:p-12 text-white relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 md:w-48 h-32 md:h-48 bg-white/10 rounded-full blur-2xl" />
              
              <div className="relative z-10">
                <h3 className={`text-2xl md:text-3xl font-bold mb-3 md:mb-4 ${
                  language === 'bn' ? 'font-hind-siliguri' : ''
                }`}>
                  {t.letsConnect}
                </h3>
                <p className={`text-cyan-100 mb-6 md:mb-8 text-sm md:text-lg ${
                  language === 'bn' ? 'font-hind-siliguri' : ''
                }`}>
                  {t.connectDescription}
                </p>

                {/* Contact Info List */}
                <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <p className={`text-xs md:text-sm text-cyan-100 ${
                        language === 'bn' ? 'font-hind-siliguri' : ''
                      }`}>
                        {t.emailLabel}
                      </p>
                      <p className="font-semibold text-sm md:text-base">info@eventconnect.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <p className={`text-xs md:text-sm text-cyan-100 ${
                        language === 'bn' ? 'font-hind-siliguri' : ''
                      }`}>
                        {t.phoneLabel}
                      </p>
                      <p className="font-semibold text-sm md:text-base">+880 1234-567890</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <p className={`text-xs md:text-sm text-cyan-100 ${
                        language === 'bn' ? 'font-hind-siliguri' : ''
                      }`}>
                        {t.workingHours}
                      </p>
                      <p className={`font-semibold text-sm md:text-base ${
                        language === 'bn' ? 'font-hind-siliguri' : ''
                      }`}>
                        {t.workingTime}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div className="mt-6 md:mt-8 relative hidden sm:block">
                  <Image 
                    src={contactus} 
                    alt="Contact Us" 
                    className="w-full max-w-xs md:max-w-md mx-auto drop-shadow-2xl" 
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Send Message Form */}
            <div className="bg-white p-6 md:p-8 lg:p-12">
              <h3 className={`text-2xl md:text-3xl font-bold text-gray-900 mb-2 ${
                language === 'bn' ? 'font-hind-siliguri' : ''
              }`}>
                {t.sendMessage}
              </h3>
              <p className={`text-gray-600 mb-6 md:mb-8 text-sm md:text-base ${
                language === 'bn' ? 'font-hind-siliguri' : ''
              }`}>
                {t.formDescription}
              </p>

              {submitted ? (
                /* Success Message */
                <div className="text-center py-8 md:py-12">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 animate-bounce">
                    <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <h4 className={`text-xl md:text-2xl font-bold text-gray-900 mb-2 ${
                    language === 'bn' ? 'font-hind-siliguri' : ''
                  }`}>
                    {t.messageSent}
                  </h4>
                  <p className={`text-gray-600 text-sm md:text-base ${
                    language === 'bn' ? 'font-hind-siliguri' : ''
                  }`}>
                    {t.thankYou}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  {/* Name Input */}
                  <div>
                    <label className={`block text-sm font-semibold text-gray-900 mb-2 ${
                      language === 'bn' ? 'font-hind-siliguri' : ''
                    }`}>
                      {t.yourName} *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t.namePlaceholder}
                        required
                        className={`w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder:text-gray-400 bg-gray-50 transition-all text-sm md:text-base ${
                          language === 'bn' ? 'font-hind-siliguri' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className={`block text-sm font-semibold text-gray-900 mb-2 ${
                      language === 'bn' ? 'font-hind-siliguri' : ''
                    }`}>
                      {t.yourEmail} *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t.emailPlaceholder}
                        required
                        className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder:text-gray-400 bg-gray-50 transition-all text-sm md:text-base"
                      />
                    </div>
                  </div>

                  {/* Message Textarea */}
                  <div>
                    <label className={`block text-sm font-semibold text-gray-900 mb-2 ${
                      language === 'bn' ? 'font-hind-siliguri' : ''
                    }`}>
                      {t.yourMessage} *
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 md:left-4 top-4 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={t.messagePlaceholder}
                        rows="4"
                        required
                        className={`w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder:text-gray-400 resize-none bg-gray-50 transition-all text-sm md:text-base ${
                          language === 'bn' ? 'font-hind-siliguri' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`group relative w-full py-3 md:py-4 px-6 rounded-xl text-white font-semibold overflow-hidden transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm md:text-base ${
                      language === 'bn' ? 'font-hind-siliguri' : ''
                    }`}
                  >
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300 group-hover:from-cyan-600 group-hover:to-blue-700" />
                    
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {t.sending}
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 md:w-5 md:h-5" />
                          {t.sendButton}
                        </>
                      )}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-8 md:mt-12 relative z-10">
          <p className={`text-gray-600 text-sm md:text-base ${
            language === 'bn' ? 'font-hind-siliguri' : ''
          }`}>
            {t.responseTime} <span className="font-semibold text-cyan-600">{t.within24Hours}</span>
          </p>
        </div>
      </Container>
    </section>
  );
};

export default ContactUs;