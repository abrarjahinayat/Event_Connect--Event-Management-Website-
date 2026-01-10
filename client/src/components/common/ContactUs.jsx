"use client";
import React, { useState } from 'react';
import contactus from '../../images/contactus.png';
import Image from 'next/image';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Message sent:', formData);
    // Add your form submission logic here
    alert('Message sent successfully!');
    // Reset form
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <section className="py-16 bg-white">
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Contact Us
          </h2>
          <p className="text-gray-700">
            Get in touch with us for any questions or support
          </p>
        </div>

        {/* Contact Box */}
        <div className="max-w-4xl mx-auto border-2 border-cyan-400 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Left Side - Contact Information */}
            <div className="bg-white p-8 flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Contact Information
              </h3>
              
              {/* Image Placeholder */}
              <div className="flex-grow flex items-center justify-center">
               <Image src={contactus} alt="Contact Us" className="max-w-full h-auto" />
              </div>
            </div>

            {/* Right Side - Send Message Form */}
            <div className="bg-gray-50 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h3>

              {/* Name Input */}
              <div className="mb-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder:text-gray-400 bg-white"
                />
              </div>

              {/* Email Input */}
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder:text-gray-400 bg-white"
                />
              </div>

              {/* Message Textarea */}
              <div className="mb-6">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder:text-gray-400 resize-none bg-white"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="bg-cyan-400 hover:bg-cyan-500 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
              >
                Send message
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ContactUs;