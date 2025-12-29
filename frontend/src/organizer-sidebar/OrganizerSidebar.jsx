import { useState, useEffect } from 'react';
import { FaCheckCircle, FaHome, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Sidebar({ sidebarOpen = false }) {
  const [role, setRole] = useState('seeker'); // safe default

  /* -------------------------
     TEMP: role fallback
     (Replace with API/JWT later)
  --------------------------*/
  useEffect(() => {
    // Role will later come from backend (/api/me)
    setRole('seeker');
  }, []);

  const dashboardRoute =
    role === 'organizer' ? '/organizer-dashboard' : '/seeker-dashboard';

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-56 max-w-[18rem] bg-gradient-to-br from-pink-600 to-pink-500 text-white p-8 flex flex-col gap-6 shadow-xl transition-transform duration-300 z-50 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      aria-hidden={!sidebarOpen}
    >
      <div className="flex items-center justify-center">
        <h2 className="text-2xl font-bold tracking-tight">Her Hustle</h2>
      </div>

      <nav className="flex flex-col gap-2 mt-4">
        <Link
          to={dashboardRoute}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition"
        >
          <FaHome className="w-5 h-5" />
          <span className="font-medium">Dashboard</span>
        </Link>

        <Link
          to="/organizer/applicants"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition"
        >
          <FaCheckCircle className="w-5 h-5" />
          <span className="font-medium">All Applications</span>
        </Link>

        <Link
          to="/"
          className="mt-auto flex items-center gap-3 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
        >
          <FaSignOutAlt className="w-5 h-5" />
          <span className="font-medium">Log Out</span>
        </Link>
      </nav>
    </aside>
  );
}
