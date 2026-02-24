import {
  FaHome,
  FaCheckCircle,
  FaPlusCircle,
  FaBriefcase,
  FaUserTie,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
export default function OrganizerSidebar({ sidebarOpen = false }) {
  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white shadow-2xl z-40 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}
    >
      <div className="h-full flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-600 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
              <span className="text-white font-bold text-xl">HH</span>
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg tracking-tight">Her Hustle</h2>
              <p className="text-xs text-gray-500">Organizer Panel</p>
            </div>
          </div>
        </div>

        {/* Post Job Button */}
        <div className="px-4 pt-6">
          <Link to="/organizer/post-job">
            <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white px-4 py-3 rounded-xl shadow-lg shadow-pink-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/40 hover:-translate-y-0.5 font-semibold">
              <FaPlusCircle className="text-lg" />
              <span>Post Job</span>
            </button>
          </Link>
        </div>

        <div className="border-t border-gray-100 mt-6 mx-4"></div>

        {/* Navigation */}
        <nav className="flex-1 p-4 mt-2">
          <ul className="space-y-2">
            <li>
              <a
                href="/organizer/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 text-pink-600 font-medium border border-pink-100 shadow-sm"
              >
                <FaHome className="text-lg" />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="/organizer/jobs"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors font-medium"
              >
                <FaBriefcase className="text-lg" />
                <span>My Job Listings</span>
              </a>
            </li>
            <li>
              <Link to="/organizer/applications">  {/* ✅ new */}
                <span className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors font-medium">
                  <FaCheckCircle className="text-lg" />
                  <span>Applications</span>
                </span>
              </Link>
            </li>
            <li>
              <a
                href="/organizer/profile"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors font-medium"
              >
                <FaUserTie className="text-lg" />
                <span>Company Profile</span>
              </a>
            </li>
            <li>
              <a
                href="/organizer/analytics"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors font-medium"
              >
                <FaChartBar className="text-lg" />
                <span>Analytics</span>
              </a>
            </li>
            <li>
              <a
                href="/organizer/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors font-medium"
              >
                <FaCog className="text-lg" />
                <span>Settings</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors w-full font-medium">
            <FaSignOutAlt className="text-lg" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}