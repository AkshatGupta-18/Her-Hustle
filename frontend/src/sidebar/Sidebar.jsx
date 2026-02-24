import { useEffect } from 'react';
import {
  FaBriefcase,
  FaCheckCircle,
  FaHome,
  FaInfoCircle,
  FaSignOutAlt,
  FaBookOpen,
  FaUser
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Sidebar({ sidebarOpen, onClose }) {
  const { user } = useUser();

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sidebarOpen, onClose]);

  const initials = (user.name || user.email || 'U')
    .split(' ')
    .map(s => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 bg-black/40 ${
          sidebarOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => onClose && onClose()}
        aria-hidden={!sidebarOpen}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-64 z-50 transform ${
          sidebarOpen
            ? 'translate-x-0 opacity-100'
            : '-translate-x-full opacity-0'
        } transition-transform duration-300 ease-in-out bg-gradient-to-b from-[#ff3b6b] to-[#ff6f9b] text-white p-6 flex flex-col gap-6`}
        role="dialog"
        aria-modal={sidebarOpen ? 'true' : 'false'}
        aria-hidden={!sidebarOpen}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-white/20 overflow-hidden flex items-center justify-center font-bold text-lg">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          <h2 className="text-lg font-bold tracking-tight">Her Hustle</h2>
        </div>

        <nav className="mt-4 flex flex-col gap-2 flex-1">
          <Link
            to="/seeker-dashboard"
            onClick={() => onClose && onClose()}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10"
          >
            <FaHome /> Dashboard
          </Link>

          <Link
            to="/my-profile"
            onClick={() => onClose && onClose()}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10"
          >
            <FaUser /> My Profile
          </Link>

          <Link
            to="/learn-skills"
            onClick={() => onClose && onClose()}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10"
          >
            <FaBookOpen /> Learn Skills
          </Link>

          <Link
            to="/available-jobs"
            onClick={() => onClose && onClose()}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10"
          >
            <FaBriefcase /> All Available Jobs
          </Link>

          <Link
            to="/applications"
            onClick={() => onClose && onClose()}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10"
          >
            <FaCheckCircle /> My Applications
          </Link>

          <Link
            to="/about"
            onClick={() => onClose && onClose()}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10"
          >
            <FaInfoCircle /> About
          </Link>

          <Link
            to="/"
            onClick={() => onClose && onClose()}
            className="mt-auto flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10"
          >
            <FaSignOutAlt /> Log Out
          </Link>
        </nav>
      </aside>
    </>
  );
}