// src/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post('/api/user/login', form, {
        withCredentials: true, // crucial to receive cookies
      });

      const { name, role } = data.user || {};

      if (role === 'Job Seeker') {
        navigate('/seeker-dashboard', { state: { name } });
      } else if (role === 'Organizer') {
        navigate('/organizer', { state: { name } });
      }
    } catch (err) {
      console.error('Login error:', err);
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-[#fff5f8] p-8 rounded-xl shadow-lg text-left font-sans">
      <h2 className="text-[#ff3366] text-2xl font-semibold text-center mb-6">Login to Her Hustle</h2>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <p className="text-sm text-red-700 bg-red-50 p-2 rounded">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            placeholder="you@email.com"
            className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#ff3366] text-white rounded-md font-bold hover:bg-pink-500 transition disabled:opacity-60"
            aria-busy={loading}
          >
            {loading && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            )}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Don’t have an account? <Link to="/register" className="text-[#ff3366] font-semibold">Register</Link>
      </p>

      <p className="mt-2 text-center text-sm">
        <Link to="/" className="text-[#ff3366]">Back to Dashboard</Link>
      </p>
    </div>
  );
}
