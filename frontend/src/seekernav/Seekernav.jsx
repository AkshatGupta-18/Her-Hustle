import React from 'react';
import { FaBars, FaUserCircle, FaBell, FaSearch, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Seekernav({ 
  sidebarOpen, 
  setSidebarOpen, 
  userName = 'User',
  userRole = 'Job Seeker',
  avatarUrl = null,
  showSearch = false,
  notifications = 0
}) {
  const navigate = useNavigate();

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-30">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Menu Toggle & Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="group w-11 h-11 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 flex items-center justify-center text-pink-600 transition-all duration-300 hover:scale-105 hover:shadow-md"
              aria-label="Toggle sidebar"
            >
              <FaBars className="text-lg group-hover:rotate-180 transition-transform duration-300" />
            </button>

            {/* Her Hustle Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                {/* Logo Icon/Badge */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
                  <span className="text-white font-black text-lg">H</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"></div>
              </div>
              
              {/* Brand Text */}
              <div className="hidden sm:block">
                <h1 className="text-xl font-black bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 bg-clip-text text-transparent tracking-tight">
                  Her Hustle
                </h1>
                <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase -mt-1">
                  Empower • Elevate • Excel
                </p>
              </div>
            </div>

            {/* Optional Search Bar */}
            {showSearch && (
              <div className="hidden lg:flex items-center relative ml-4">
                <FaSearch className="absolute left-4 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Quick search..."
                  className="pl-10 pr-4 py-2.5 w-80 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all"
                />
              </div>
            )}
          </div>

          {/* Right Section - User Profile & Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-all duration-300 hover:scale-105">
              <FaBell className="text-lg" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </button>

            {/* Settings */}
            <button className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-all duration-300 hover:scale-105 hover:rotate-90">
              <FaCog className="text-lg" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 bg-gradient-to-br from-gray-50 to-pink-50/30 px-4 py-2.5 rounded-xl border border-gray-100 hover:border-pink-200 transition-all duration-300 cursor-pointer group hover:shadow-md">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={userName}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-white group-hover:ring-pink-200 transition-all"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg transition-all">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                  {userName}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {userRole}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search (shows below main bar on mobile) */}
        {showSearch && (
          <div className="lg:hidden mt-3">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Quick search..."
                className="pl-10 pr-4 py-2.5 w-full bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all"
              />
            </div>
          </div>
        )}
      </div>

      {/* Decorative Bottom Border */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-pink-200 to-transparent"></div>
    </nav>
  );
}