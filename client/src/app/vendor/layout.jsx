'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Briefcase, Plus, Calendar, Star, 
  DollarSign, Settings, LogOut, Menu, X, User, Bell
} from 'lucide-react';

const VendorDashboardLayout = ({ children }) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    console.log('🔍 Checking vendor authentication...');
    
    try {
      const token = localStorage.getItem('vendorToken');
      const userData = localStorage.getItem('vendorData');

      console.log('🔑 Token:', token);
      console.log('👤 User data raw:', userData);

      // ✅ FIX 1: Check if token exists
      if (!token) {
        console.log('❌ No token found - redirecting to login');
        router.push('/login');
        return;
      }

      // ✅ FIX 2: Check if userData exists AND is not "undefined" string
      if (!userData || userData === 'undefined' || userData === 'null') {
        console.log('❌ No user data found - redirecting to login');
        localStorage.removeItem('vendorToken');
        localStorage.removeItem('vendorData');
        router.push('/login');
        return;
      }

      // ✅ FIX 3: Safe JSON parse with try-catch
      let parsedUser;
      try {
        parsedUser = JSON.parse(userData);
        console.log('✅ Parsed user:', parsedUser);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        console.log('❌ Invalid user data - clearing and redirecting');
        localStorage.removeItem('vendorToken');
        localStorage.removeItem('vendorData');
        router.push('/login');
        return;
      }

      // ✅ FIX 4: Validate parsed user has required fields
      if (!parsedUser || !parsedUser.buisnessName || !parsedUser.email) {
        console.log('❌ Invalid user data structure - redirecting');
        localStorage.removeItem('vendorToken');
        localStorage.removeItem('vendorData');
        router.push('/login');
        return;
      }

      console.log('✅ Vendor authenticated:', parsedUser.buisnessName);
      setUser(parsedUser);
      setLoading(false);
    } catch (error) {
      console.error('❌ Auth check error:', error);
      localStorage.removeItem('vendorToken');
      localStorage.removeItem('vendorData');
      router.push('/login');
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/vendor/dashboard' },
    { id: 'services', label: 'My Services', icon: Briefcase, path: '/vendor/services' },
    { id: 'add-service', label: 'Add New Service', icon: Plus, path: '/vendor/add-service' },
    { id: 'bookings', label: 'Bookings', icon: Calendar, path: '/vendor/bookings' },
    { id: 'reviews', label: 'Reviews', icon: Star, path: '/vendor/reviews' },
    { id: 'earnings', label: 'Earnings', icon: DollarSign, path: '/vendor/earnings' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/vendor/settings' },
  ];

  const handleLogout = () => {
    console.log('🚪 Logging out...');
    localStorage.removeItem('vendorToken');
    localStorage.removeItem('vendorData');
    console.log('✅ Vendor logged out');
    router.push('/login');
  };

  const handleNavigation = (item) => {
    setActiveTab(item.id);
    router.push(item.path);
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vendor dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-40 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Vendor Dashboard</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-gradient-to-b from-cyan-600 to-cyan-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-cyan-500">
          <h1 className="text-2xl font-bold">Event-Connect</h1>
          <p className="text-cyan-200 text-sm mt-1">Vendor Portal</p>
        </div>

        <div className="p-6 border-b border-cyan-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <User size={24} />
            </div>
            <div>
              <h3 className="font-semibold">{user.buisnessName}</h3>
              <p className="text-cyan-200 text-sm">{user.email}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-white text-cyan-600 shadow-lg'
                        : 'text-cyan-100 hover:bg-white/10'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-cyan-500">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-cyan-100 hover:bg-white/10 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="bg-white shadow-sm px-6 py-4 hidden lg:flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 capitalize">
              {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Welcome back, {user.buisnessName}!
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-600 to-green-600 flex items-center justify-center text-white font-semibold">
                {user.buisnessName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{user.buisnessName}</p>
                <p className="text-gray-600 text-xs">{user.service}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default VendorDashboardLayout;