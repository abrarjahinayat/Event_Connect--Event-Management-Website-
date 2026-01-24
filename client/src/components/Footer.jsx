import React from 'react';
import Link from 'next/link';
import { 
  Mail, Phone, MapPin, Facebook, Twitter, Youtube, Linkedin, 
  Instagram, ArrowRight, Heart 
} from 'lucide-react';

const Container = ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: '#', color: 'hover:bg-blue-600', label: 'Facebook' },
    { icon: Twitter, href: '#', color: 'hover:bg-sky-500', label: 'Twitter' },
    { icon: Instagram, href: '#', color: 'hover:bg-pink-600', label: 'Instagram' },
    { icon: Youtube, href: '#', color: 'hover:bg-red-600', label: 'Youtube' },
    { icon: Linkedin, href: '#', color: 'hover:bg-blue-700', label: 'LinkedIn' },
  ];

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'About Us', href: '/about' },
    { label: 'Join as Vendor', href: '/join-network' },
    { label: 'Contact', href: '/contact' },
  ];

  const services = [
    { label: 'Production Houses', href: '/production-houses' },
    { label: 'Community Centers', href: '/community-centers' },
    { label: 'Event Management', href: '/event-management' },
    { label: 'Photographers', href: '/photographers' },
    { label: 'Cinematographers', href: '/cinematographers' },
    { label: 'Caterers', href: '/cooks-caterers' },
  ];

  const legal = [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
    { label: 'Vendor Agreement', href: '/vendor-agreement' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-cyan-900 to-gray-900 text-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      
      <Container>
        {/* Main Footer Content */}
        <div className="relative z-10 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12">
            {/* EventConnect Section - Takes 4 columns */}
            <div className="lg:col-span-4">
              <div className="mb-6">
                <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  EventConnect
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  Your complete solution for connecting with event professionals and services. Making event planning seamless and successful with trusted vendors and premium services.
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <a href="mailto:info@eventconnect.com" className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 transition-colors group">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-all">
                    <Mail size={18} />
                  </div>
                  <span className="text-sm">info@eventconnect.com</span>
                </a>
                
                <a href="tel:+8801234567890" className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 transition-colors group">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-all">
                    <Phone size={18} />
                  </div>
                  <span className="text-sm">+880 1234-567890</span>
                </a>
                
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <MapPin size={18} />
                  </div>
                  <span className="text-sm">Dhaka, Bangladesh</span>
                </div>
              </div>

              {/* Social Media Icons */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <Link 
                      key={index}
                      href={social.href} 
                      className={`w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center ${social.color} transition-all hover:scale-110 hover:shadow-lg`}
                      aria-label={social.label}
                    >
                      <Icon size={18} />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick Links Section - Takes 2 columns */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold mb-6 text-white">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href} 
                      className="text-gray-300 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2 group"
                    >
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Section - Takes 3 columns */}
            <div className="lg:col-span-3">
              <h3 className="text-lg font-bold mb-6 text-white">Our Services</h3>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index}>
                    <Link 
                      href={service.href} 
                      className="text-gray-300 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2 group"
                    >
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Section - Takes 3 columns */}
            <div className="lg:col-span-3">
              <h3 className="text-lg font-bold mb-6 text-white">Legal</h3>
              <ul className="space-y-3">
                {legal.map((item, index) => (
                  <li key={index}>
                    <Link 
                      href={item.href} 
                      className="text-gray-300 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2 group"
                    >
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Newsletter Section */}
              <div className="mt-8 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <h4 className="text-sm font-semibold mb-2 text-white">Stay Updated</h4>
                <p className="text-xs text-gray-400 mb-3">Subscribe to our newsletter</p>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all">
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 mb-8"></div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <span>© {currentYear} EventConnect. All rights reserved.</span>
            </div>

            <div className="flex items-center gap-1 text-gray-300 text-sm">
              <span>We</span>
              <Heart size={16} className="text-red-500 fill-red-500 animate-pulse" />
              <span>Our Clients</span>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <Link href="/sitemap" className="text-gray-300 hover:text-cyan-400 transition-colors">
                Sitemap
              </Link>
              <Link href="/accessibility" className="text-gray-300 hover:text-cyan-400 transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="relative z-10 border-t border-white/10 py-6">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Secure Platform</span>
            </div>

            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <span>500+ Vendors</span>
            </div>

            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Verified Services</span>
            </div>

            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;