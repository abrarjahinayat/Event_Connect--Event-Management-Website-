"use client";
import React, { useState } from 'react';
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
    <section className="relative py-20 bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/20 overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <Container>
        {/* Header */}
        <div className="text-center mb-16 relative z-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-2 rounded-full mb-6 shadow-lg">
            <Mail className="w-5 h-5 text-white" />
            <span className="text-white font-semibold text-sm uppercase tracking-wide">
              Get In Touch
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Us</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Contact Cards - Info Cards Above */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10">
          {/* Email Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-cyan-100 group">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
              <Mail className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Email Us</h3>
            <p className="text-gray-600 text-sm mb-3">Drop us an email anytime</p>
            <a href="mailto:info@eventconnect.com" className="text-cyan-600 font-semibold hover:text-cyan-700 transition-colors">
              info@eventconnect.com
            </a>
          </div>

          {/* Phone Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-blue-100 group">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
              <Phone className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Call Us</h3>
            <p className="text-gray-600 text-sm mb-3">Mon-Fri from 9am to 6pm</p>
            <a href="tel:+8801234567890" className="text-cyan-600 font-semibold hover:text-cyan-700 transition-colors">
              +880 1234-567890
            </a>
          </div>

          {/* Location Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-cyan-100 group">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Visit Us</h3>
            <p className="text-gray-600 text-sm mb-3">Come say hello</p>
            <p className="text-cyan-600 font-semibold">
              Dhaka, Bangladesh
            </p>
          </div>
        </div>

        {/* Main Contact Box */}
        <div className="max-w-6xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left Side - Contact Information & Image */}
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-8 lg:p-12 text-white relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
              
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-4">
                  Let's Connect
                </h3>
                <p className="text-cyan-100 mb-8 text-lg">
                  We're here to help make your events unforgettable. Reach out to us and let's create something amazing together!
                </p>

                {/* Contact Info List */}
                <div className="space-y-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-cyan-100">Email</p>
                      <p className="font-semibold">info@eventconnect.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-cyan-100">Phone</p>
                      <p className="font-semibold">+880 1234-567890</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-cyan-100">Working Hours</p>
                      <p className="font-semibold">Mon - Fri: 9AM - 6PM</p>
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div className="mt-8 relative">
                  <Image 
                    src={contactus} 
                    alt="Contact Us" 
                    className="w-full max-w-md mx-auto drop-shadow-2xl" 
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Send Message Form */}
            <div className="bg-white p-8 lg:p-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Send us a Message
              </h3>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we'll get back to you within 24 hours
              </p>

              {submitted ? (
                /* Success Message */
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h4>
                  <p className="text-gray-600">Thank you for reaching out. We'll respond soon!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Your Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder:text-gray-400 bg-gray-50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Your Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder:text-gray-400 bg-gray-50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Message Textarea */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Your Message *
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help you..."
                        rows="5"
                        required
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder:text-gray-400 resize-none bg-gray-50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full py-4 px-6 rounded-xl text-white font-semibold overflow-hidden transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300 group-hover:from-cyan-600 group-hover:to-blue-700" />
                    
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
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
        <div className="text-center mt-12 relative z-10">
          <p className="text-gray-600">
            Expected response time: <span className="font-semibold text-cyan-600">Within 24 hours</span>
          </p>
        </div>
      </Container>
    </section>
  );
};

export default ContactUs;