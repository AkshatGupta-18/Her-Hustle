import { useState } from 'react';

import {
  FaPlusCircle,
  FaBars,
  FaUserCircle,
  FaBell,
  FaChevronDown,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa';

export default function OrganizerNavbar({ 
  userName = 'Organizer',
  onToggleSidebar,
  onPostJob,
  sidebarOpen = true 
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notifications - replace with real data
  const notifications = [
    { id: 1, text: 'New application received', time: '5m ago', unread: true },
    { id: 2, text: 'Job post approved', time: '1h ago', unread: true },
    { id: 3, text: 'Profile viewed by 3 seekers', time: '2h ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-30">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleSidebar}
              className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Toggle sidebar"
            >
              <FaBars className="text-lg" />
            </button>

            {/* Optional: Logo or brand name for mobile */}
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
                Her Hustle
              </h1>
            </div>
          </div>

          {/* Right Section - Actions & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Post Job Button */}
            <button 
              onClick={onPostJob}
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white px-4 sm:px-5 py-2.5 rounded-xl shadow-lg shadow-pink-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/40 hover:-translate-y-0.5 font-medium text-sm"
            >
              <FaPlusCircle />
              <span className="hidden md:inline">Post Job</span>
            </button>

            {/* Mobile Post Job Button (Icon Only) */}
            <button 
              onClick={onPostJob}
              className="sm:hidden w-10 h-10 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 transition-all duration-300"
              aria-label="Post job"
            >
              <FaPlusCircle />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label="Notifications"
              >
                <FaBell className="text-lg" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-600 to-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="text-xs text-pink-600 font-medium">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0 ${
                              notif.unread ? 'bg-pink-50/30' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                notif.unread ? 'bg-pink-600' : 'bg-gray-300'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 mb-1">{notif.text}</p>
                                <p className="text-xs text-gray-500">{notif.time}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <FaBell className="text-3xl text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">No notifications</p>
                        </div>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-gray-100">
                        <button className="w-full text-center text-sm text-pink-600 hover:text-pink-700 font-medium transition-colors">
                          View all notifications
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 sm:gap-3 bg-gray-50 hover:bg-gray-100 px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-100 transition-all duration-200 hover:border-gray-200"
              >
                <FaUserCircle className="text-2xl sm:text-2xl text-gray-400" />
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-semibold text-gray-900 leading-tight">
                    {userName}
                  </div>
                  <div className="text-xs text-gray-500">Organizer</div>
                </div>
                <FaChevronDown className={`hidden sm:block text-xs text-gray-400 transition-transform duration-200 ${
                  showProfileMenu ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-pink-500/30">
                          {userName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-900 truncate">
                            {userName}
                          </div>
                          <div className="text-xs text-gray-500">Organizer Account</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                        <FaUserCircle className="text-gray-400" />
                        <span>View Profile</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                        <FaCog className="text-gray-400" />
                        <span>Settings</span>
                      </button>
                    </div>

                    <div className="p-2 border-t border-gray-100">
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                        <FaSignOutAlt className="text-red-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}