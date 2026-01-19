'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from './Container';
import logo from '../../images/logo.png';
import Image from 'next/image';
import Link from 'next/link';
import { User, LogOut, ChevronDown } from 'lucide-react';

const Header = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('userData');
    const userToken = localStorage.getItem('userToken');
    
    if (userData && userToken) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem('userData');
    localStorage.removeItem('userToken');
    setUser(null);
    setShowDropdown(false);
    
    // Redirect to home
    router.push('/');
    alert('✅ Logged out successfully!');
  };

  return (
    <section className='py-5 bg-white shadow-sm sticky top-0 z-50'>
      <Container>
        <div className='flex items-center justify-between'>
          {/* Logo */}
          <div className='cursor-pointer' onClick={() => router.push('/')}>
            <Image src={logo} alt="logo"  />
          </div>

          {/* Navigation */}
          <div>
            <ul className='flex cursor-pointer items-center font-outfit gap-10 text-xl font-semibold text-[#333333]'>
              <li className='hover:text-[#00C0E8] transition-colors'>
                <Link href="/">Home</Link>
              </li>
              <li className='hover:text-[#00C0E8] transition-colors'>
                <Link href="/services">Services</Link>
              </li>
              <li className='hover:text-[#00C0E8] transition-colors'>
                <Link href="/contact">Contact</Link>
              </li>

              {/* User Authentication */}
              {user ? (
                // Logged In - Show User Menu
                <li className='relative'>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className='flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors'
                  >
                    <div className='w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center'>
                      <User className='w-5 h-5 text-white' />
                    </div>
                    <span className='text-base font-medium'>{user.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className='absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl py-2'>
                      <div className='px-4 py-3 border-b border-gray-200'>
                        <p className='text-sm font-medium text-gray-900'>{user.name}</p>
                        <p className='text-xs text-gray-500 truncate'>{user.email}</p>
                      </div>
                      
                      <Link
                        href="/user/profile"
                        className='flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors'
                        onClick={() => setShowDropdown(false)}
                      >
                        <User className='w-4 h-4' />
                        My Profile
                      </Link>
                      
                      <Link
                        href="/user/bookings"
                        className='flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors'
                        onClick={() => setShowDropdown(false)}
                      >
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                        </svg>
                        My Bookings
                      </Link>

                      <div className='border-t border-gray-200 my-2'></div>
                      
                      <button
                        onClick={handleLogout}
                        className='flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors'
                      >
                        <LogOut className='w-4 h-4' />
                        Logout
                      </button>
                    </div>
                  )}
                </li>
              ) : (
                // Not Logged In - Show Login/Signup
                <>
                  <li className='hover:text-[#00C0E8] transition-colors'>
                    <Link href="/user/login">Login</Link>
                  </li>
                  
                  <button 
                    onClick={() => router.push('/user/signup')}
                    className='cursor-pointer border-2 bg-[#00C0E8] px-6 py-2 rounded-md text-white text-xl font-outfit font-medium hover:bg-white hover:text-[#00C0E8] hover:border-[#00C0E8] transition-all duration-300'
                  >
                    Sign Up
                  </button>
                </>
              )}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Header;