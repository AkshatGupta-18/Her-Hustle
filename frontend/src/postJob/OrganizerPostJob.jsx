import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

export default function OrganizerPostJob() {
  const navigate = useNavigate();

  // -------------------------
  // Form state (matches Job schema exactly)
  // -------------------------
  const [form, setForm] = useState({
    title: '',
    description: '',
    details: '',
    type: 'Remote',
    payment: '',
  });

  const [loading, setLoading] = useState(false);

  // -------------------------
  // Handle input changes
  // -------------------------
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // -------------------------
  // Submit job to backend
  // POST /api/jobs
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Send POST request to backend
      await axios.post(
        'http://localhost:5000/api/jobs',
        {
          title: form.title,
          description: form.description,
          details: form.details,
          type: form.type,
          payment: Number(form.payment), // ensure number
        },
        {
          withCredentials: true, // REQUIRED for cookie-based auth
        }
      );

      alert('Job posted successfully!');
      navigate('/organizer');
    } catch (error) {
      console.error('Error posting job:', error);

      alert(
        error.response?.data?.message ||
          'Failed to post job. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8 p-8 bg-white rounded-2xl shadow-md font-sans">
      <h2 className="text-2xl font-semibold text-pink-600 text-center mb-4">
        Post a New Job
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="eg. Content Writer"
            value={form.title}
            onChange={handleChange}
            required
            className="mt-2 w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
          />
        </div>

        {/* Job Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Details
          </label>
          <textarea
            name="details"
            placeholder="Briefly describe the job..."
            value={form.details}
            onChange={handleChange}
            required
            rows={4}
            className="mt-2 w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 transition resize-y"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            placeholder="A short description..."
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            className="mt-2 w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 transition resize-y"
          />
        </div>

        {/* Job Type + Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Job Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
            >
              <option>Remote</option>
              <option>Offline</option>
              <option>Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment (₹)
            </label>
            <input
              type="number"
              name="payment"
              placeholder="eg. 5000"
              value={form.payment}
              onChange={handleChange}
              required
              min="0"
              className="mt-2 w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={() => navigate('/organizer')}
            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
            disabled={loading}
          >
            Back
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-md bg-pink-600 hover:bg-pink-500 text-white shadow-md transition disabled:opacity-60"
          >
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </div>
      </form>
    </div>
  );
}
