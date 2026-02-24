import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import OrganizerSidebar from '../organizer-sidebar/OrganizerSidebar';
import { toast, ToastContainer } from 'react-toastify';

const SKILLS_OPTIONS = [
  'Analytics',
  'API Integration',
  'Attention to Detail',
  'Authentication',
  'Canva',
  'Communication',
  'Content Planning',
  'Content Writing',
  'Creativity',
  'CSS',
  'Customer Handling',
  'Data Management',
  'Data Structures',
  'Digital Marketing',
  'Django',
  'Documentation',
  'Express',
  'Figma',
  'Flask',
  'Git',
  'Google Ads',
  'Grammar',
  'Graphic Design',
  'HTML',
  'Illustrator',
  'JavaScript',
  'MongoDB',
  'MS Excel',
  'Node.js',
  'Photoshop',
  'Problem Solving',
  'Project Management',
  'Prototyping',
  'Python',
  'React',
  'Research',
  'REST APIs',
  'SEO',
  'SEO Basics',
  'Server-side Development',
  'Social Media Marketing',
  'SQL',
  'Tailwind CSS',
  'Teamwork',
  'Time Management',
  'Typing',
  'UI Design',
  'UX Research',
];


export default function OrganizerPostJob() {
  const navigate = useNavigate();

  // -------------------------
  // Form state
  // -------------------------
  const [form, setForm] = useState({
    title: '',
    description: '',
    details: '',
    type: 'Remote',
    payment: '',
    skills: [],
  });

  const [selectedSkill, setSelectedSkill] = useState('');
  const [loading, setLoading] = useState(false);

  // -------------------------
  // Handle input changes
  // -------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // -------------------------
  // Skills handlers
  // -------------------------
  const addSkill = () => {
    if (!selectedSkill) return;

    if (form.skills.includes(selectedSkill)) {
      toast.info('Skill already added');
      return;
    }

    setForm({
      ...form,
      skills: [...form.skills, selectedSkill],
    });

    setSelectedSkill('');
  };

  const removeSkill = (skill) => {
    setForm({
      ...form,
      skills: form.skills.filter((s) => s !== skill),
    });
  };

  // -------------------------
  // Submit job
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(
        'http://localhost:5000/api/jobs',
        {
          title: form.title,
          description: form.description,
          details: form.details,
          type: form.type,
          payment: Number(form.payment),
          skills: form.skills,
        },
        { withCredentials: true }
      );

      toast.success('Job posted successfully!');
      navigate('/organizer');
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error(
        error.response?.data?.message ||
          'Failed to post job. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <OrganizerSidebar sidebarOpen={true} />

      <main className="ml-60 p-8">
        <div className="max-w-3xl mx-auto my-12 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-semibold text-pink-600 text-center mb-1">
            Post a New Job
          </h2>
          <p className="text-sm text-gray-500 text-center mb-8">
            Create a detailed job post to attract the right candidates.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Job Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="eg. Frontend Developer"
                className="mt-2 w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-100"
              />
            </div>

            {/* Job Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Job Details
              </label>
              <textarea
                name="details"
                value={form.details}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Explain responsibilities, expectations, and scope..."
                className="mt-2 w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-100 resize-y"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Short Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={3}
                placeholder="A concise summary of the role..."
                className="mt-2 w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-100 resize-y"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Required Skills
              </label>

              <div className="flex gap-2 mt-2">
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-100"
                >
                  <option value="">Select a skill</option>
                  {SKILLS_OPTIONS.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 transition"
                >
                  Add
                </button>
              </div>

              {/* Selected skills */}
              {form.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.skills.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-2 bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-pink-500 hover:text-pink-700 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
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
                  className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-100"
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
                  value={form.payment}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="eg. 15000"
                  className="mt-2 w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-100"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Approximate monthly or fixed amount.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/organizer')}
                disabled={loading}
                className="px-4 py-2 rounded-md border bg-white hover:bg-gray-50 text-gray-700"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-md bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow hover:from-pink-700 disabled:opacity-60"
              >
                {loading ? 'Posting...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>

        <ToastContainer />
      </main>
    </div>
  );
}
