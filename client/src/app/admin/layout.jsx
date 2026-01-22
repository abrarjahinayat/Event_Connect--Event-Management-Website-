'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, Briefcase, Calendar, CheckCircle,
  Star, Settings, LogOut, Menu, X, Shield, Bell, TrendingUp
} from 'lucide-react';

const AdminDashboardLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // ✅ FIX: Check if current page is login page (correct route)
  const isLoginPage = pathname === '/admin-login';

  useEffect(() => {
    // ✅ Skip auth check if it's login page
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    // 🎯 FIX: SAFE localStorage handling
    console.log('🔍 Checking admin authentication...');
    
    const token = localStorage.getItem('adminToken');
    const adminDataStr = localStorage.getItem('adminData');

    console.log('Token exists:', !!token);
    console.log('AdminData exists:', !!adminDataStr);
    console.log('AdminData raw:', adminDataStr);

    // Check token
    if (!token || token === 'undefined') {
      console.error('❌ No valid admin token');
      router.push('/admin-login'); // ✅ FIXED ROUTE
      return;
    }

    // 🎯 CRITICAL FIX: Check adminData before parsing
    if (!adminDataStr || adminDataStr === 'undefined') {
      console.error('❌ No valid admin data');
      router.push('/admin-login'); // ✅ FIXED ROUTE
      return;
    }

    // 🎯 SAFE JSON PARSE with try-catch
    try {
      const parsedAdmin = JSON.parse(adminDataStr);
      console.log('✅ Admin parsed successfully:', parsedAdmin);
      setAdmin(parsedAdmin);
    } catch (error) {
      console.error('❌ Failed to parse admin data:', error);
      console.error('Data that failed:', adminDataStr);
      // Clear corrupt data and redirect
      localStorage.removeItem('adminData');
      localStorage.removeItem('adminToken');
      router.push('/admin-login'); // ✅ FIXED ROUTE
      return;
    }

    setLoading(false);
  }, [router, isLoginPage, pathname]);

  // ✅ If it's login page, just render children without layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading for protected pages
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-cyan-200">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // If no admin and not login page, return null (already redirecting)
  if (!admin) {
    return null;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'bookings', label: 'Bookings', icon: Calendar, path: '/admin/bookings', badge: true },
    { id: 'vendors', label: 'Vendors', icon: Briefcase, path: '/admin/vendors', badge: true },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
    { id: 'services', label: 'Services', icon: Star, path: '/admin/services' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, path: '/admin/analytics' },
    { id: 'verification', label: 'Verification', icon: CheckCircle, path: '/admin/verification' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const handleLogout = () => {
    console.log('🚪 Logging out...');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    router.push('/admin-login'); // ✅ FIXED ROUTE
  };

  const handleNavigation = (item) => {
    setActiveTab(item.id);
    router.push(item.path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-cyan-900 shadow-lg z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-cyan-400" />
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-white/10 text-white"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-gradient-to-b from-gray-900 via-cyan-900 to-gray-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-2xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo/Brand */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Portal</h1>
              <p className="text-cyan-200 text-sm">Event-Connect</p>
            </div>
          </div>
        </div>

        {/* Admin Profile */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-lg shadow-lg">
              {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">{admin?.name || 'Admin'}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
                  {admin?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${
                      isActive
                        ? 'bg-white/10 text-white shadow-lg backdrop-blur-sm'
                        : 'text-cyan-100 hover:bg-white/5'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        5
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/10 transition-all border border-red-500/30"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-72 pt-16 lg:pt-0">
        {/* Top Bar */}
        <div className="bg-white shadow-sm px-6 py-4 hidden lg:flex items-center justify-between border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 capitalize">
              {menuItems.find(item => item.path === pathname)?.label || 'Dashboard'}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Welcome back, {admin?.name || 'Admin'}!
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="p-3 rounded-xl hover:bg-gray-100 relative transition-all">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* Admin Info */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{admin?.name || 'Admin'}</p>
                <p className="text-cyan-600 text-xs font-medium">
                  {admin?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 bg-gray-50 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardLayout;