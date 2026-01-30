"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Container from "./Container";
import logo from "../../images/logo.png";
import Image from "next/image";
import Link from "next/link";
import { User, LogOut, ChevronDown, Sparkles, Bell, Inbox, Menu, X, Globe } from "lucide-react";

const Header = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Translations
  const translations = {
    en: {
      home: "Home",
      services: "Services",
      reviews: "Reviews",
      contact: "Contact",
      login: "Login",
      signUp: "Sign Up",
      joinAsVendor: "Join as Vendor",
      myProfile: "My Profile",
      viewEditProfile: "View and edit profile",
      myBookings: "My Bookings",
      manageEvents: "Manage your events",
      messageUs: "Message Us",
      sendMessage: "Send us a message",
      notifications: "Notifications",
      newUpdates: "3 new updates",
      logout: "Logout",
      signOutAccount: "Sign out from account"
    },
    bn: {
      home: "হোম",
      services: "সেবা সমূহ",
      reviews: "রিভিউ",
      contact: "যোগাযোগ",
      login: "লগইন",
      signUp: "সাইন আপ",
      joinAsVendor: "ভেন্ডর হিসেবে যোগ দিন",
      myProfile: "আমার প্রোফাইল",
      viewEditProfile: "প্রোফাইল দেখুন এবং সম্পাদনা করুন",
      myBookings: "আমার বুকিং",
      manageEvents: "আপনার ইভেন্ট পরিচালনা করুন",
      messageUs: "আমাদের মেসেজ করুন",
      sendMessage: "আমাদের একটি মেসেজ পাঠান",
      notifications: "নোটিফিকেশন",
      newUpdates: "৩টি নতুন আপডেট",
      logout: "লগআউট",
      signOutAccount: "অ্যাকাউন্ট থেকে সাইন আউট করুন"
    }
  };

  const t = translations[language];

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    const userToken = localStorage.getItem("userToken");
    const savedLanguage = localStorage.getItem("preferredLanguage");

    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    if (userData && userToken) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing userData:", error);
      }
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (showDropdown || isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown, isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "bn" : "en";
    setLanguage(newLanguage);
    localStorage.setItem("preferredLanguage", newLanguage);
    
    document.documentElement.lang = newLanguage === "en" ? "en" : "bn";
    
    if (newLanguage === "bn") {
      document.body.classList.add("font-hind-siliguri");
      document.body.classList.remove("font-outfit");
    } else {
      document.body.classList.add("font-outfit");
      document.body.classList.remove("font-hind-siliguri");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("userToken");
    setUser(null);
    setShowDropdown(false);
    setIsMobileMenuOpen(false);
    router.push("/");
    alert("✅ Logged out successfully!");
  };

  const scrollToSection = (sectionId) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled
          ? "py-2 md:py-3 bg-white/95 backdrop-blur-lg shadow-lg border-b border-cyan-100"
          : "py-3 md:py-5 bg-white shadow-sm"
      }`}
    >
      <Container>
        <div className="flex items-center justify-between relative z-10">
          {/* Logo */}
          <div
            className="cursor-pointer flex items-center gap-3 group"
            onClick={() => {
              router.push("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="relative">
              <Image
                src={logo}
                alt="logo"
                className="transition-transform w-[180px] md:w-[200px] lg:w-[250px] duration-300 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block relative z-50">
            <ul className="flex cursor-pointer items-center font-outfit gap-4 xl:gap-8 text-base xl:text-lg font-semibold text-gray-700">
              {/* Home */}
              <li className="relative group">
                <button
                  onClick={() => {
                    router.push("/");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`flex items-center gap-1 hover:text-cyan-600 transition-colors ${
                    language === "bn" ? "font-hind-siliguri" : ""
                  }`}
                >
                  {t.home}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300" />
                </button>
              </li>

              {/* Services */}
              <li className="relative group">
                <button
                  onClick={() => scrollToSection("services")}
                  className={`flex items-center gap-1 hover:text-cyan-600 transition-colors ${
                    language === "bn" ? "font-hind-siliguri" : ""
                  }`}
                >
                  {t.services}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300" />
                </button>
              </li>

              {/* Reviews */}
              <li className="relative group">
                <button
                  onClick={() => scrollToSection("reviews")}
                  className={`flex items-center gap-1 hover:text-cyan-600 transition-colors ${
                    language === "bn" ? "font-hind-siliguri" : ""
                  }`}
                >
                  {t.reviews}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300" />
                </button>
              </li>

              {/* Contact */}
              <li className="relative group">
                <button
                  onClick={() => scrollToSection("contact")}
                  className={`flex items-center gap-1 hover:text-cyan-600 transition-colors ${
                    language === "bn" ? "font-hind-siliguri" : ""
                  }`}
                >
                  {t.contact}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300" />
                </button>
              </li>

              {/* User Authentication */}
              {user ? (
                <li className="relative z-[100]" ref={dropdownRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDropdown(!showDropdown);
                    }}
                    className="flex items-center gap-2 xl:gap-3 px-3 xl:px-4 py-2 xl:py-2.5 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 border border-cyan-200/50 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 xl:w-9 xl:h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center ring-2 ring-white shadow-md">
                        <User className="w-4 h-4 xl:w-5 xl:h-5 text-white" />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 xl:w-3 xl:h-3 bg-green-500 rounded-full border-2 border-white" />
                    </div>

                    <div className="text-left max-w-[100px] xl:max-w-[120px]">
                      <p className={`text-xs xl:text-sm font-bold text-gray-800 leading-tight truncate ${
                        language === "bn" ? "font-hind-siliguri" : ""
                      }`}>
                        {user.name}
                      </p>
                    </div>

                    <ChevronDown
                      className={`w-3 h-3 xl:w-4 xl:h-4 text-gray-600 transition-transform duration-300 ${showDropdown ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div
                      className="absolute right-0 mt-3 w-72 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-dropdown"
                      style={{ zIndex: 9999 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-2 ring-white/50">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className={`text-base font-bold text-white ${
                              language === "bn" ? "font-hind-siliguri" : ""
                            }`}>
                              {user.name}
                            </p>
                            <p className="text-xs text-cyan-100 truncate max-w-[180px]">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="py-2 bg-white">
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            router.push("/user/profile");
                          }}
                          className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-200 group w-full text-left"
                        >
                          <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className={`font-semibold ${language === "bn" ? "font-hind-siliguri" : ""}`}>
                              {t.myProfile}
                            </p>
                            <p className={`text-xs text-gray-500 ${language === "bn" ? "font-hind-siliguri" : ""}`}>
                              {t.viewEditProfile}
                            </p>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            router.push("/user/booking");
                          }}
                          className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-200 group w-full text-left"
                        >
                          <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <div>
                            <p className={`font-semibold ${language === "bn" ? "font-hind-siliguri" : ""}`}>
                              {t.myBookings}
                            </p>
                            <p className={`text-xs text-gray-500 ${language === "bn" ? "font-hind-siliguri" : ""}`}>
                              {t.manageEvents}
                            </p>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            router.push("/user/massages");
                          }}
                          className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-200 group w-full text-left"
                        >
                          <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all relative">
                            <Inbox className="w-4 h-4 text-gray-600" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                          </div>
                          <div>
                            <p className={`font-semibold ${language === "bn" ? "font-hind-siliguri" : ""}`}>
                              {t.messageUs}
                            </p>
                            <p className={`text-xs text-gray-500 ${language === "bn" ? "font-hind-siliguri" : ""}`}>
                              {t.sendMessage}
                            </p>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            router.push("/user/notifications");
                          }}
                          className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-200 group w-full text-left"
                        >
                          <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all relative">
                            <Bell className="w-4 h-4 text-gray-600" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                          </div>
                          <div>
                            <p className={`font-semibold ${language === "bn" ? "font-hind-siliguri" : ""}`}>
                              {t.notifications}
                            </p>
                            <p className={`text-xs text-gray-500 ${language === "bn" ? "font-hind-siliguri" : ""}`}>
                              {t.newUpdates}
                            </p>
                          </div>
                        </button>
                      </div>

                      <div className="border-t border-gray-100 my-2" />

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 group"
                      >
                        <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-all">
                          <LogOut className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <p className={`font-semibold ${language === "bn" ? "font-hind-siliguri" : ""}`}>
                            {t.logout}
                          </p>
                          <p className={`text-xs text-red-500 ${language === "bn" ? "font-hind-siliguri" : ""}`}>
                            {t.signOutAccount}
                          </p>
                        </div>
                      </button>
                    </div>
                  )}
                </li>
              ) : (
                <>
                  <li className="relative group">
                    <Link
                      href="/user/login"
                      className={`flex items-center gap-2 px-3 xl:px-5 py-2 xl:py-2.5 rounded-xl text-gray-700 hover:text-cyan-600 font-semibold transition-all duration-300 ${
                        language === "bn" ? "font-hind-siliguri" : ""
                      }`}
                    >
                      {t.login}
                      <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300" />
                    </Link>
                  </li>

                  <li className="relative group">
                    <Link
                      href="/user/signup"
                      className={`flex items-center gap-2 px-3 xl:px-5 py-2 xl:py-2.5 rounded-xl text-gray-700 hover:text-cyan-600 font-semibold transition-all duration-300 ${
                        language === "bn" ? "font-hind-siliguri" : ""
                      }`}
                    >
                      {t.signUp}
                      <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300" />
                    </Link>
                  </li>
                </>
              )}

              {/* Language Toggle */}
              <li>
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-1.5 xl:gap-2 px-2.5 xl:px-4 py-1.5 xl:py-2 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-200/50 transition-all duration-300 hover:shadow-md"
                  title={language === "en" ? "Switch to Bengali" : "Switch to English"}
                >
                  <Globe className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-purple-600" />
                  <span className="text-xs xl:text-sm font-semibold text-purple-600">
                    {language === "en" ? "বাং" : "EN"}
                  </span>
                </button>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2 md:gap-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50"
              title={language === "en" ? "Switch to Bengali" : "Switch to English"}
            >
              <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-600" />
              <span className="text-xs font-semibold text-purple-600">
                {language === "en" ? "বাং" : "EN"}
              </span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-button p-2 rounded-lg bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 transition-all duration-300"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 md:w-6 md:h-6 text-cyan-600" />
              ) : (
                <Menu className="w-5 h-5 md:w-6 md:h-6 text-cyan-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] lg:hidden animate-fadeIn" />

            <div
              ref={mobileMenuRef}
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-[9999] lg:hidden animate-slideInRight overflow-y-auto"
            >
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className={`text-white font-bold text-xl ${language === "bn" ? "font-hind-siliguri" : ""}`}>
                    {language === "en" ? "Menu" : "মেনু"}
                  </h2>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {user && (
                <div className="px-6 py-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className={`font-bold text-gray-800 ${language === "bn" ? "font-hind-siliguri" : ""}`}>
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-600 truncate max-w-[200px]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <nav className="px-4 py-6 space-y-2">
                <button
                  onClick={() => {
                    router.push("/");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-200 ${
                    language === "bn" ? "font-hind-siliguri" : ""
                  }`}
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <span className="font-semibold">{t.home}</span>
                </button>

                <button
                  onClick={() => scrollToSection("services")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-200 ${
                    language === "bn" ? "font-hind-siliguri" : ""
                  }`}
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-semibold">{t.services}</span>
                </button>

                <button
                  onClick={() => scrollToSection("reviews")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-200 ${
                    language === "bn" ? "font-hind-siliguri" : ""
                  }`}
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <span className="font-semibold">{t.reviews}</span>
                </button>

                <button
                  onClick={() => scrollToSection("contact")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-200 ${
                    language === "bn" ? "font-hind-siliguri" : ""
                  }`}
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-semibold">{t.contact}</span>
                </button>

                {user && (
                  <>
                    <div className="border-t border-gray-200 my-4" />

                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push("/user/profile");
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-200 ${
                        language === "bn" ? "font-hind-siliguri" : ""
                      }`}
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-semibold">{t.myProfile}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push("/user/booking");
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-200 ${
                        language === "bn" ? "font-hind-siliguri" : ""
                      }`}
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <span className="font-semibold">{t.myBookings}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push("/user/massages");
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-200 ${
                        language === "bn" ? "font-hind-siliguri" : ""
                      }`}
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center relative">
                        <Inbox className="w-4 h-4" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                      </div>
                      <span className="font-semibold">{t.messageUs}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push("/user/notifications");
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-200 ${
                        language === "bn" ? "font-hind-siliguri" : ""
                      }`}
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center relative">
                        <Bell className="w-4 h-4" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                      </div>
                      <span className="font-semibold">{t.notifications}</span>
                    </button>
                  </>
                )}

                {!user && (
                  <>
                    <div className="border-t border-gray-200 my-4" />

                    <Link
                      href="/user/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-cyan-500 text-cyan-600 font-semibold hover:bg-cyan-50 transition-all duration-200 ${
                        language === "bn" ? "font-hind-siliguri" : ""
                      }`}
                    >
                      {t.login}
                    </Link>

                    <Link
                      href="/user/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 ${
                        language === "bn" ? "font-hind-siliguri" : ""
                      }`}
                    >
                      {t.signUp}
                    </Link>

                    <button
                      onClick={() => {
                        scrollToSection("join-network");
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 ${
                        language === "bn" ? "font-hind-siliguri" : ""
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      {t.joinAsVendor}
                    </button>
                  </>
                )}

                {user && (
                  <>
                    <div className="border-t border-gray-200 my-4" />

                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 ${
                        language === "bn" ? "font-hind-siliguri" : ""
                      }`}
                    >
                      <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <span className="font-semibold">{t.logout}</span>
                    </button>
                  </>
                )}
              </nav>
            </div>
          </>
        )}
      </Container>

      <style jsx>{`
        @keyframes dropdown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-dropdown {
          animation: dropdown 0.2s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;