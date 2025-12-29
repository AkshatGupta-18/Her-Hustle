// src/components/Sidebar.jsx
import { useState, useEffect } from 'react';
import { FaBriefcase, FaCheckCircle, FaHome, FaInfoCircle, FaSignOutAlt, FaBookOpen, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Sidebar({ sidebarOpen, onClose }) {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRole(docSnap.data().role || 'seeker'); // default to seeker if undefined
        }
      } catch (err) {
        console.error('Error fetching user role:', err);
      }
    };

    fetchUserRole();
  }, []);

  // Determine dashboard route based on role
  const dashboardRoute = role === 'organizer' ? '/organizer-dashboard' : '/seeker-dashboard';

  // Close on Escape when open (accessibility)
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sidebarOpen, onClose]);

  return (
    <>
      {/* Backdrop for small screens */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 bg-black/40 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => onClose && onClose()} aria-hidden={!sidebarOpen} />

      <aside id="sidebar" className={`fixed top-0 left-0 h-full w-64 z-50 transform ${sidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'} transition-transform duration-300 ease-in-out bg-gradient-to-b from-[#ff3b6b] to-[#ff6f9b] text-white p-6 flex flex-col gap-6`} role="dialog" aria-modal={sidebarOpen ? 'true' : 'false'} aria-hidden={!sidebarOpen}>
        <h2 className="text-center text-xl font-bold tracking-tight">Her Hustle</h2>

        <nav className="mt-4 flex flex-col gap-2">
          <Link to={dashboardRoute} onClick={() => onClose && onClose()} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20">
            <FaHome /> <span className="ml-1">Dashboard</span>
          </Link>

          <Link to="/my-profile" onClick={() => onClose && onClose()} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20">
            <FaUser /> <span className="ml-1">My Profile</span>
          </Link>

          <Link to="/learn-skills" onClick={() => onClose && onClose()} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20">
            <FaBookOpen /> <span className="ml-1">Learn Skills</span>
          </Link>

          <Link to="/available-jobs" onClick={() => onClose && onClose()} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20">
            <FaBriefcase /> <span className="ml-1">All Available Jobs</span>
          </Link>

          <Link to="/applications" onClick={() => onClose && onClose()} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20">
            <FaCheckCircle /> <span className="ml-1">My Applications</span>
          </Link>

          <Link to="/about" onClick={() => onClose && onClose()} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20">
            <FaInfoCircle /> <span className="ml-1">About</span>
          </Link>

          <Link to="/" onClick={() => onClose && onClose()} className="mt-auto flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20">
            <FaSignOutAlt /> <span className="ml-1">Log Out</span>
          </Link>
        </nav>
      </aside>
    </>
  );
}
