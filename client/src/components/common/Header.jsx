'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from './Container';
import logo from '../../images/logo.png';
import Image from 'next/image';
import Link from 'next/link';
import { User, LogOut, ChevronDown, Sparkles, Bell } from 'lucide-react';

const Header = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('userData');
    const userToken = localStorage.getItem('userToken');
    
    if (userData && userToken) {
      setUser(JSON.parse(userData));
    }

    // Add scroll listener for header effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userToken');
    setUser(null);
    setShowDropdown(false);
    router.push('/');
    alert('✅ Logged out successfully!');
  };

  return (
    <section className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'py-3 bg-white/95 backdrop-blur-lg shadow-lg border-b border-cyan-100' 
        : 'py-5 bg-white shadow-sm'
    }`}>
       <div className='absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-cyan-200/30 to-blue-200/20 rounded-full blur-3xl -translate-x-1/4 -translate-y-1/4 animate-pulse' />
      <div className='absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-200/20 to-cyan-200/30 rounded-full blur-3xl translate-x-1/4 translate-y-1/4 animate-pulse' style={{ animationDelay: '1s' }} />
      <Container>
        <div className='flex items-center justify-between'>
          {/* Logo with Enhanced Styling */}
          <div 
            className='cursor-pointer flex items-center gap-3 group' 
            onClick={() => router.push('/')}
          >
            <div className='relative'>
              <Image src={logo} alt="logo" className='transition-transform duration-300 group-hover:scale-105' />
              {/* Glow effect on hover */}
              <div className='absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
            </div>
          </div>

          {/* Navigation */}
          <div>
            <ul className='flex cursor-pointer items-center font-outfit gap-10 text-lg font-semibold text-gray-700'>
              {/* Navigation Links with Modern Hover Effect */}
              <li className='relative group'>
                <Link href="/" className='flex items-center gap-1'>
                  Home
                  <div className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300' />
                </Link>
              </li>
              
              <li className='relative group'>
                <Link href="/services" className='flex items-center gap-1'>
                  Services
                  <div className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300' />
                </Link>
              </li>
              
              <li className='relative group'>
                <Link href="/contact" className='flex items-center gap-1'>
                  Contact
                  <div className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300' />
                </Link>
              </li>

              {/* User Authentication */}
              {user ? (
                // Logged In - Modern User Menu
                <li className='relative'>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className='flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 border border-cyan-200/50 transition-all duration-300 hover:shadow-lg'
                  >
                    {/* Avatar with gradient ring */}
                    <div className='relative'>
                      <div className='w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center ring-2 ring-white shadow-md'>
                        <User className='w-5 h-5 text-white' />
                      </div>
                      {/* Online indicator */}
                      <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white' />
                    </div>
                    
                    <div className='text-left'>
                      <p className='text-sm font-bold text-gray-800 leading-tight'>{user.name}</p>
                     
                    </div>
                    
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Enhanced Dropdown Menu */}
                  {showDropdown && (
                    <div className='absolute right-0 mt-3 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden animate-dropdown'>
                      {/* User Info Header */}
                      <div className='bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-2 ring-white/50'>
                            <User className='w-6 h-6 text-white' />
                          </div>
                          <div>
                            <p className='text-base font-bold text-white'>{user.name}</p>
                            <p className='text-xs text-cyan-100 truncate max-w-[180px]'>{user.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className='py-2'>
                        <Link
                          href="/user/profile"
                          className='flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-200 group'
                          onClick={() => setShowDropdown(false)}
                        >
                          <div className='w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all'>
                            <User className='w-4 h-4 text-gray-600' />
                          </div>
                          <div>
                            <p className='font-semibold'>My Profile</p>
                            <p className='text-xs text-gray-500'>View and edit profile</p>
                          </div>
                        </Link>
                        
                        <Link
                          href="/user/booking"
                          className='flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-200 group'
                          onClick={() => setShowDropdown(false)}
                        >
                          <div className='w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all'>
                            <svg className='w-4 h-4 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                            </svg>
                          </div>
                          <div>
                            <p className='font-semibold'>My Bookings</p>
                            <p className='text-xs text-gray-500'>Manage your events</p>
                          </div>
                        </Link>

                        <Link
                          href="/user/notifications"
                          className='flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-200 group'
                          onClick={() => setShowDropdown(false)}
                        >
                          <div className='w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all relative'>
                            <Bell className='w-4 h-4 text-gray-600' />
                            <span className='absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full' />
                          </div>
                          <div>
                            <p className='font-semibold'>Notifications</p>
                            <p className='text-xs text-gray-500'>3 new updates</p>
                          </div>
                        </Link>
                      </div>

                      {/* Divider */}
                      <div className='border-t border-gray-100 my-2' />
                      
                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className='flex items-center gap-3 w-full px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 group'
                      >
                        <div className='w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-all'>
                          <LogOut className='w-4 h-4' />
                        </div>
                        <div className='text-left'>
                          <p className='font-semibold'>Logout</p>
                          <p className='text-xs text-red-500'>Sign out from account</p>
                        </div>
                      </button>
                    </div>
                  )}
                </li>
              ) : (
                // Not Logged In - Modern Login/Signup
                <>
                  <li className='relative group'>
                    <Link 
                      href="/user/login"
                      className='flex items-center gap-2 px-5 py-2.5 rounded-xl text-gray-700 hover:text-cyan-600 font-semibold transition-all duration-300'
                    >
                      Login
                      <div className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300' />
                    </Link>
                  </li>
                  
                  <button 
                    onClick={() => router.push('/user/signup')}
                    className='relative group cursor-pointer px-6 py-2.5 rounded-xl text-white text-base font-outfit font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl'
                  >
                    {/* Gradient Background */}
                    <div className='absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300 group-hover:from-cyan-600 group-hover:to-blue-700' />
                    
                    {/* Shine Effect */}
                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700' />
                    
                    <span className='relative z-10 flex items-center gap-2'>
                      <Sparkles className='w-4 h-4' />
                      Sign Up
                    </span>
                  </button>
                </>
              )}
            </ul>
          </div>
        </div>
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
        
        .animate-dropdown {
          animation: dropdown 0.2s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Header;