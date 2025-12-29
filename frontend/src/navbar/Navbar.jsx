import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaSearch, FaUserCircle } from 'react-icons/fa';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const [search, setSearch] = useState('');

  /* -------------------------
     TEMP: Local auth state
     (Replace with JWT /api/me)
  --------------------------*/
  useEffect(() => {
    // Safe fallback user (no Firebase)
    const mockUser = {
      name: 'User',
      email: 'user@example.com',
      role: 'seeker',
    };

    setUserName(mockUser.name);
    setUserEmail(mockUser.email);
    setUserRole(mockUser.role);
  }, []);

  const handleLogout = async () => {
    // Frontend-only logout
    setUserName(null);
    setUserEmail(null);
    setUserRole(null);
    setLoggedOut(true);
  };

  const handleClose = () => {
    setShowUserModal(false);
    setLoggedOut(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/75 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: brand + nav (desktop) */}
          <div className="flex items-center gap-6">
            <Link to="/" className="text-2xl font-extrabold text-pink-600 hover:text-pink-500">Her Hustle</Link>
            <nav className="hidden md:flex items-center space-x-4 text-gray-700">
              <Link to="/" className="py-2 px-3 rounded-md hover:bg-pink-50 transition">Home</Link>
              <Link to="/about" className="py-2 px-3 rounded-md hover:bg-pink-50 transition">About</Link>
              <Link to="/contact" className="py-2 px-3 rounded-md hover:bg-pink-50 transition">Contact</Link>
            </nav>
          </div>

          {/* Center: search (desktop) */}
          <div className="hidden md:flex flex-1 justify-center px-4">
            <div className="w-full max-w-lg">
              <div className="flex items-center bg-white border border-gray-100 rounded-full shadow-sm px-3 py-1">
                <FaSearch className="text-gray-400 mr-2" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search jobs, skills, companies" className="w-full text-sm placeholder-gray-400 outline-none" />
              </div>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-3">
            {userName && location.pathname !== '/' && !loggedOut ? (
              <button
                onClick={() => setShowUserModal(true)}
                className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-full bg-pink-50 text-pink-600 border border-pink-100 hover:bg-pink-100 transition"
                aria-haspopup="dialog"
              >
                <span className="sr-only">Open user menu</span>
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                  {userName?.charAt(0)?.toUpperCase() || <FaUserCircle />}
                </div>
                <span className="hidden lg:inline text-sm">{userName}</span>
              </button>
            ) : (
              <Link to="/login" className="hidden md:inline-flex items-center px-4 py-2 rounded-full bg-pink-600 text-white font-semibold hover:bg-pink-500 transition">Login</Link>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-pink-600 hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-200"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel - slide down */}
      <div className={`md:hidden bg-white border-b border-gray-100 transition-all ${menuOpen ? 'max-h-screen shadow-md' : 'max-h-0 overflow-hidden'}`}>
        <div className="px-4 pb-4">
          <div className="flex flex-col gap-3 pt-3">
            <Link to="/" onClick={() => setMenuOpen(false)} className="py-2 px-3 rounded-md hover:bg-gray-50">Home</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)} className="py-2 px-3 rounded-md hover:bg-gray-50">About</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)} className="py-2 px-3 rounded-md hover:bg-gray-50">Contact</Link>

            {userName && location.pathname !== '/' && !loggedOut ? (
              <button
                onClick={() => { setShowUserModal(true); setMenuOpen(false); }}
                className="mt-2 py-2 px-3 rounded-md bg-pink-50 text-pink-600 border border-pink-100"
              >
                Logged in as {userName}
              </button>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="mt-2 py-2 px-3 rounded-md bg-pink-600 text-white font-semibold text-center">Login</Link>
            )}
          </div>
        </div>
      </div>

      {/* User modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 max-w-md rounded-xl p-6 shadow-xl">
            {!loggedOut ? (
              <>
                <h3 className="text-lg font-semibold text-pink-600 mb-3">User Info</h3>
                <p className="text-sm text-gray-700"><strong>Name:</strong> {userName}</p>
                <p className="text-sm text-gray-700"><strong>Email:</strong> {userEmail}</p>
                <p className="text-sm text-gray-700 mb-4"><strong>Role:</strong> {userRole}</p>
                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 rounded-md bg-gray-100 text-gray-700"
                    onClick={() => setShowUserModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="px-4 py-2 rounded-md bg-pink-600 text-white"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-pink-600 mb-3">Logged Out</h3>
                <p className="text-sm text-gray-700">You have been logged out successfully.</p>
                <div className="flex justify-end mt-4">
                  <button className="px-4 py-2 rounded-md bg-pink-600 text-white" onClick={handleClose}>Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
