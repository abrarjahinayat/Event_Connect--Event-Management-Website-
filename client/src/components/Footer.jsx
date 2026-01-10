import React from 'react';
import Link from 'next/link';

const Container = ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-700 text-white py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Eventconnect Section */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Eventconnect</h3>
            <p className="text-gray-300 leading-relaxed">
              Your complete solution for connecting with event professionals and services. Making event planning seamless and successful.
            </p>
            {/* Social Media Icons */}
            <div className="flex gap-4 mt-6">
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-sm font-bold">f</span>
                </div>
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                  <span className="text-sm font-bold">👻</span>
                </div>
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                  <span className="text-sm font-bold">▶</span>
                </div>
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-sm font-bold">in</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition-colors underline">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/vendors" className="text-gray-300 hover:text-white transition-colors underline">
                  Vendors
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-300 hover:text-white transition-colors underline">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Section */}
          <div>
            <h3 className="text-xl font-bold mb-6">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/services/production-houses" className="text-gray-300 hover:text-white transition-colors underline">
                  Production Houses
                </Link>
              </li>
              <li>
                <Link href="/services/community-centers" className="text-gray-300 hover:text-white transition-colors underline">
                  Community Centers
                </Link>
              </li>
              <li>
                <Link href="/services/event-management" className="text-gray-300 hover:text-white transition-colors underline">
                  Event Management
                </Link>
              </li>
              <li>
                <Link href="/services/photographers" className="text-gray-300 hover:text-white transition-colors underline">
                  Photographers
                </Link>
              </li>
              <li>
                <Link href="/services/cinematographers" className="text-gray-300 hover:text-white transition-colors underline">
                  Cinematographers
                </Link>
              </li>
              <li>
                <Link href="/services/caterers" className="text-gray-300 hover:text-white transition-colors underline">
                  Caterers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-xl font-bold mb-6">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-300 hover:text-white transition-colors underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-gray-300 hover:text-white transition-colors underline">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/vendor-agreement" className="text-gray-300 hover:text-white transition-colors underline">
                  Vendor Agreement
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-600 pt-8 text-center">
          <p className="text-gray-300">
            © {currentYear} EventConnect. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;