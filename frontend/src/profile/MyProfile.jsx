import { useState, useEffect } from 'react';
import Sidebar from '../sidebar/Sidebar';

export default function MyProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    location: '',
    contact: '',
    role: '',
    skills: []
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');

  const availableSkills = [
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Data Analysis',
    'Digital Marketing',
    'Content Writing',
    'Graphic Design',
    'Project Management',
    'Python Programming',
    'Customer Support',
    'Social Media Management',
    'SEO & Marketing'
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      try {
        const res = await fetch('http://localhost:5000/api/user/profile', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await res.json();

        setForm({
          name: data.name || '',
          email: data.email || '',
          role: data.role || '',
          location: data.location || '',
          contact: data.contact || '',
          skills: data.skills || []
        });
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddSkill = () => {
    if (selectedSkill && !form.skills.includes(selectedSkill)) {
      setForm({ ...form, skills: [...form.skills, selectedSkill] });
      setSelectedSkill('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setForm({ ...form, skills: form.skills.filter(s => s !== skill) });
  };

  const handleSaveChanges = async () => {
    setSaving(true);

    try {
      const res = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: form.name,
          location: form.location,
          contact: form.contact,
          skills: form.skills
        })
      });

      if (!res.ok) {
        throw new Error('Failed to save profile');
      }

      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="min-h-screen lg:ml-64 bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6 transition-all">

        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="mb-4 inline-flex items-center gap-2 rounded-xl bg-pink-500 px-4 py-2 text-white font-semibold shadow-md"
        >
          ☰ 
        </button>

        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your personal information and skills</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    disabled
                    className="w-full rounded-xl bg-gray-50 border-2 border-gray-200 px-4 py-3 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
                      placeholder="City, Country"
                    />
                  </div>

                  {/* Contact */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      name="contact"
                      value={form.contact}
                      onChange={handleChange}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={form.role}
                    disabled
                    className="w-full rounded-xl bg-gray-50 border-2 border-gray-200 px-4 py-3 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Role is assigned by the system</p>
                </div>

                {/* Skills Section */}
                <div className="pt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Skills & Expertise
                  </label>

                  <div className="flex gap-3 mb-4">
                    <select
                      value={selectedSkill}
                      onChange={(e) => setSelectedSkill(e.target.value)}
                      className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
                    >
                      <option value="">Select a skill to add</option>
                      {availableSkills
                        .filter(skill => !form.skills.includes(skill))
                        .map((skill, idx) => (
                          <option key={idx} value={skill}>
                            {skill}
                          </option>
                        ))}
                    </select>

                    <button
                      type="button"
                      onClick={handleAddSkill}
                      disabled={!selectedSkill}
                      className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 text-white font-semibold hover:from-pink-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>

                  <div className="min-h-[80px] bg-gradient-to-br from-gray-50 to-pink-50 rounded-2xl p-4 border-2 border-gray-100">
                    {form.skills.length === 0 ? (
                      <p className="text-gray-400 text-center py-4">
                        No skills added yet. Select from the dropdown above.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {form.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-2 bg-white text-pink-600 px-4 py-2 rounded-full text-sm font-medium shadow-sm border-2 border-pink-100 hover:border-pink-300 transition-all"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="ml-1 text-pink-400 hover:text-pink-600 font-bold text-lg leading-none transition-colors"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-6">
                  <button
                    type="button"
                    onClick={handleSaveChanges}
                    disabled={saving}
                    className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 py-4 text-white font-bold text-lg hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {saving ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Saving...
                      </span>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
