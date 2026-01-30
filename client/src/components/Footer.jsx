"use client";
import React, { useState, useEffect } from 'react';
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
  const [language, setLanguage] = useState("en");
  const currentYear = new Date().getFullYear();

  // Translations
  const translations = {
    en: {
      description: 'Your complete solution for connecting with event professionals and services. Making event planning seamless and successful with trusted vendors and premium services.',
      quickLinks: 'Quick Links',
      ourServices: 'Our Services',
      legal: 'Legal',
      stayUpdated: 'Stay Updated',
      subscribe: 'Subscribe to our newsletter',
      yourEmail: 'Your email',
      copyright: 'EventConnect. All rights reserved.',
      weLove: 'We',
      ourClients: 'Our Clients',
      sitemap: 'Sitemap',
      accessibility: 'Accessibility',
      securePlatform: 'Secure Platform',
      vendors: 'Vendors',
      verifiedServices: 'Verified Services',
      support: '24/7 Support',
      links: {
        home: 'Home',
        services: 'Services',
        about: 'About Us',
        joinVendor: 'Join as Vendor',
        contact: 'Contact'
      },
      servicesList: {
        productionHouses: 'Production Houses',
        communityCenters: 'Community Centers',
        eventManagement: 'Event Management',
        photographers: 'Photographers',
        cinematographers: 'Cinematographers',
        caterers: 'Caterers'
      },
      legalList: {
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        cookie: 'Cookie Policy',
        vendorAgreement: 'Vendor Agreement'
      }
    },
    bn: {
      description: 'ইভেন্ট পেশাদার এবং সেবার সাথে সংযোগের জন্য আপনার সম্পূর্ণ সমাধান। বিশ্বস্ত ভেন্ডর এবং প্রিমিয়াম সেবার সাথে ইভেন্ট পরিকল্পনাকে নির্বিঘ্ন এবং সফল করা।',
      quickLinks: 'দ্রুত লিংক',
      ourServices: 'আমাদের সেবা',
      legal: 'আইনি',
      stayUpdated: 'আপডেট থাকুন',
      subscribe: 'আমাদের নিউজলেটার সাবস্ক্রাইব করুন',
      yourEmail: 'আপনার ইমেইল',
      copyright: 'ইভেন্টকানেক্ট। সর্বস্বত্ব সংরক্ষিত।',
      weLove: 'আমরা',
      ourClients: 'আমাদের ক্লায়েন্টদের ভালোবাসি',
      sitemap: 'সাইটম্যাপ',
      accessibility: 'অ্যাক্সেসিবিলিটি',
      securePlatform: 'নিরাপদ প্ল্যাটফর্ম',
      vendors: 'ভেন্ডর',
      verifiedServices: 'যাচাইকৃত সেবা',
      support: '২৪/৭ সহায়তা',
      links: {
        home: 'হোম',
        services: 'সেবা সমূহ',
        about: 'আমাদের সম্পর্কে',
        joinVendor: 'ভেন্ডর হিসেবে যোগ দিন',
        contact: 'যোগাযোগ'
      },
      servicesList: {
        productionHouses: 'প্রোডাকশন হাউস',
        communityCenters: 'কমিউনিটি সেন্টার',
        eventManagement: 'ইভেন্ট ম্যানেজমেন্ট',
        photographers: 'ফটোগ্রাফার',
        cinematographers: 'সিনেমাটোগ্রাফার',
        caterers: 'ক্যাটারার'
      },
      legalList: {
        privacy: 'গোপনীয়তা নীতি',
        terms: 'সেবার শর্তাবলী',
        cookie: 'কুকি নীতি',
        vendorAgreement: 'ভেন্ডর চুক্তি'
      }
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

  const toBengaliNumber = (num) => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).split('').map(digit => {
      return digit >= '0' && digit <= '9' ? bengaliDigits[digit] : digit;
    }).join('');
  };

  const socialLinks = [
    { icon: Facebook, href: '#', color: 'hover:bg-blue-600', label: 'Facebook' },
    { icon: Twitter, href: '#', color: 'hover:bg-sky-500', label: 'Twitter' },
    { icon: Instagram, href: '#', color: 'hover:bg-pink-600', label: 'Instagram' },
    { icon: Youtube, href: '#', color: 'hover:bg-red-600', label: 'Youtube' },
    { icon: Linkedin, href: '#', color: 'hover:bg-blue-700', label: 'LinkedIn' },
  ];

  const quickLinks = [
    { label: t.links.home, href: '/' },
    { label: t.links.services, href: '/services' },
    { label: t.links.about, href: '/about' },
    { label: t.links.joinVendor, href: '/join-network' },
    { label: t.links.contact, href: '/contact' },
  ];

  const services = [
    { label: t.servicesList.productionHouses, href: '/production-houses' },
    { label: t.servicesList.communityCenters, href: '/community-centers' },
    { label: t.servicesList.eventManagement, href: '/event-management' },
    { label: t.servicesList.photographers, href: '/photographers' },
    { label: t.servicesList.cinematographers, href: '/cinematographers' },
    { label: t.servicesList.caterers, href: '/cooks-caterers' },
  ];

  const legal = [
    { label: t.legalList.privacy, href: '/privacy-policy' },
    { label: t.legalList.terms, href: '/terms-of-service' },
    { label: t.legalList.cookie, href: '/cookie-policy' },
    { label: t.legalList.vendorAgreement, href: '/vendor-agreement' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-cyan-900 to-gray-900 text-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-blue-500/10 rounded-full blur-3xl" />
      
      <Container>
        {/* Main Footer Content */}
        <div className="relative z-10 py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12 mb-8 md:mb-12">
            {/* EventConnect Section - Takes 4 columns on large screens */}
            <div className="lg:col-span-4">
              <div className="mb-4 md:mb-6">
                <h3 className={`text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent ${
                  language === 'bn' ? 'font-hind-siliguri' : ''
                }`}>
                  {language === 'bn' ? 'ইভেন্টকানেক্ট' : 'EventConnect'}
                </h3>
                <p className={`text-gray-300 leading-relaxed text-xs md:text-sm ${
                  language === 'bn' ? 'font-hind-siliguri' : ''
                }`}>
                  {t.description}
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                <a href="mailto:info@eventconnect.com" className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 transition-colors group">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-all">
                    <Mail size={16} className="md:w-[18px] md:h-[18px]" />
                  </div>
                  <span className="text-xs md:text-sm">info@eventconnect.com</span>
                </a>
                
                <a href="tel:+8801234567890" className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 transition-colors group">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-all">
                    <Phone size={16} className="md:w-[18px] md:h-[18px]" />
                  </div>
                  <span className="text-xs md:text-sm">
                    {language === 'bn' ? '+৮৮০ ১২৩৪-৫৬৭৮৯০' : '+880 1234-567890'}
                  </span>
                </a>
                
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <MapPin size={16} className="md:w-[18px] md:h-[18px]" />
                  </div>
                  <span className={`text-xs md:text-sm ${
                    language === 'bn' ? 'font-hind-siliguri' : ''
                  }`}>
                    {language === 'bn' ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh'}
                  </span>
                </div>
              </div>

              {/* Social Media Icons */}
              <div className="flex gap-2 md:gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <Link 
                      key={index}
                      href={social.href} 
                      className={`w-8 h-8 md:w-10 md:h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center ${social.color} transition-all hover:scale-110 hover:shadow-lg`}
                      aria-label={social.label}
                    >
                      <Icon size={16} className="md:w-[18px] md:h-[18px]" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick Links Section - Takes 2 columns */}
            <div className="lg:col-span-2">
              <h3 className={`text-base md:text-lg font-bold mb-4 md:mb-6 text-white ${
                language === 'bn' ? 'font-hind-siliguri' : ''
              }`}>
                {t.quickLinks}
              </h3>
              <ul className="space-y-2 md:space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href} 
                      className={`text-gray-300 hover:text-cyan-400 transition-colors text-xs md:text-sm flex items-center gap-2 group ${
                        language === 'bn' ? 'font-hind-siliguri' : ''
                      }`}
                    >
                      <ArrowRight size={12} className="md:w-[14px] md:h-[14px] group-hover:translate-x-1 transition-transform" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Section - Takes 3 columns */}
            <div className="lg:col-span-3">
              <h3 className={`text-base md:text-lg font-bold mb-4 md:mb-6 text-white ${
                language === 'bn' ? 'font-hind-siliguri' : ''
              }`}>
                {t.ourServices}
              </h3>
              <ul className="space-y-2 md:space-y-3">
                {services.map((service, index) => (
                  <li key={index}>
                    <Link 
                      href={service.href} 
                      className={`text-gray-300 hover:text-cyan-400 transition-colors text-xs md:text-sm flex items-center gap-2 group ${
                        language === 'bn' ? 'font-hind-siliguri' : ''
                      }`}
                    >
                      <ArrowRight size={12} className="md:w-[14px] md:h-[14px] group-hover:translate-x-1 transition-transform" />
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Section - Takes 3 columns */}
            <div className="lg:col-span-3">
              <h3 className={`text-base md:text-lg font-bold mb-4 md:mb-6 text-white ${
                language === 'bn' ? 'font-hind-siliguri' : ''
              }`}>
                {t.legal}
              </h3>
              <ul className="space-y-2 md:space-y-3">
                {legal.map((item, index) => (
                  <li key={index}>
                    <Link 
                      href={item.href} 
                      className={`text-gray-300 hover:text-cyan-400 transition-colors text-xs md:text-sm flex items-center gap-2 group ${
                        language === 'bn' ? 'font-hind-siliguri' : ''
                      }`}
                    >
                      <ArrowRight size={12} className="md:w-[14px] md:h-[14px] group-hover:translate-x-1 transition-transform" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Newsletter Section */}
              <div className="mt-6 md:mt-8 p-3 md:p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <h4 className={`text-xs md:text-sm font-semibold mb-2 text-white ${
                  language === 'bn' ? 'font-hind-siliguri' : ''
                }`}>
                  {t.stayUpdated}
                </h4>
                <p className={`text-[10px] md:text-xs text-gray-400 mb-2 md:mb-3 ${
                  language === 'bn' ? 'font-hind-siliguri' : ''
                }`}>
                  {t.subscribe}
                </p>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder={t.yourEmail}
                    className={`flex-1 px-2 md:px-3 py-1.5 md:py-2 bg-white/10 border border-white/20 rounded-lg text-xs md:text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      language === 'bn' ? 'font-hind-siliguri' : ''
                    }`}
                  />
                  <button className="px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all">
                    <ArrowRight size={14} className="md:w-4 md:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 mb-6 md:mb-8"></div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className={`flex items-center gap-2 text-gray-300 text-xs md:text-sm ${
              language === 'bn' ? 'font-hind-siliguri' : ''
            }`}>
              <span>© {language === 'bn' ? toBengaliNumber(currentYear) : currentYear} {t.copyright}</span>
            </div>

            <div className={`flex items-center gap-1 text-gray-300 text-xs md:text-sm ${
              language === 'bn' ? 'font-hind-siliguri' : ''
            }`}>
              <span>{t.weLove}</span>
              <Heart size={14} className="md:w-4 md:h-4 text-red-500 fill-red-500 animate-pulse" />
              <span>{t.ourClients}</span>
            </div>

            <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm">
              <Link href="/sitemap" className={`text-gray-300 hover:text-cyan-400 transition-colors ${
                language === 'bn' ? 'font-hind-siliguri' : ''
              }`}>
                {t.sitemap}
              </Link>
              <Link href="/accessibility" className={`text-gray-300 hover:text-cyan-400 transition-colors ${
                language === 'bn' ? 'font-hind-siliguri' : ''
              }`}>
                {t.accessibility}
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="relative z-10 border-t border-white/10 py-4 md:py-6">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            <div className={`flex items-center gap-2 text-gray-400 text-[10px] md:text-xs ${
              language === 'bn' ? 'font-hind-siliguri' : ''
            }`}>
              <div className="w-6 h-6 md:w-8 md:h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span>{t.securePlatform}</span>
            </div>

            <div className={`flex items-center gap-2 text-gray-400 text-[10px] md:text-xs ${
              language === 'bn' ? 'font-hind-siliguri' : ''
            }`}>
              <div className="w-6 h-6 md:w-8 md:h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <span>{language === 'bn' ? '৫০০+' : '500+'} {t.vendors}</span>
            </div>

            <div className={`flex items-center gap-2 text-gray-400 text-[10px] md:text-xs ${
              language === 'bn' ? 'font-hind-siliguri' : ''
            }`}>
              <div className="w-6 h-6 md:w-8 md:h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span>{t.verifiedServices}</span>
            </div>

            <div className={`flex items-center gap-2 text-gray-400 text-[10px] md:text-xs ${
              language === 'bn' ? 'font-hind-siliguri' : ''
            }`}>
              <div className="w-6 h-6 md:w-8 md:h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <span>{t.support}</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;