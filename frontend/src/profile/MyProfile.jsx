import { useState, useEffect, useRef } from 'react';
import Sidebar from '../sidebar/Sidebar';
import { useUser } from '../context/UserContext';

export default function MyProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    location: '',
    contact: '',
    role: '',
    skills: [],
    avatarUrl: ''

  });
  const [initialForm, setInitialForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeName, setResumeName] = useState('');
  const [resumeUploading, setResumeUploading] = useState(false);
  const { updateUser } = useUser();

  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const availableSkills = [
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

  // Responsive sidebar: show on large screens by default
  useEffect(() => {
    const setDefaultSidebar = () => setSidebarOpen(window.innerWidth >= 1024);
    setDefaultSidebar();
    const onResize = () => setDefaultSidebar();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

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

        const normalized = {
          name: data.name || '',
          email: data.email || '',
          role: data.role || '',
          location: data.location || '',
          contact: data.contact || '',
          skills: data.skills || [],
          avatarUrl: data.avatarUrl || '',
          resumeUrl: data.resumeUrl || ''
        };


        setForm(normalized);
        setInitialForm(normalized);
        if (data.avatarUrl) setAvatarPreview(data.avatarUrl);
        if (data.resumeUrl) {
          setResumeName(data.resumeName || data.resumeUrl.split('/').pop());
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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
      let resumeUrlToSend = form.resumeUrl || '';

      // ✅ CHECK: If user removed existing resume (had one before, now cleared, and no new file)
      if (initialForm?.resumeUrl && !form.resumeUrl && !resumeFile) {
        console.log('🗑️ Deleting resume from server...');

        try {
          const deleteRes = await fetch('http://localhost:5000/api/user/delete-resume', {
            method: 'DELETE',
            credentials: 'include',
          });

          const deleteData = await deleteRes.json();

          if (!deleteRes.ok) {
            throw new Error(deleteData.message || 'Failed to delete resume');
          }

          console.log('✅ Resume deleted from server');
          resumeUrlToSend = '';
        } catch (deleteErr) {
          console.error('❌ Delete error:', deleteErr);
          alert(`Failed to delete resume: ${deleteErr.message}`);
          setSaving(false);
          return; // Stop execution if delete fails
        }
      }

      // If a new resume file was selected, upload it first and use returned URL
      if (resumeFile) {
        setResumeUploading(true);
        const resumeForm = new FormData();
        resumeForm.append('resume', resumeFile);

        const uploadRes = await fetch('http://localhost:5000/api/user/upload-resume', {
          method: 'POST',
          credentials: 'include',
          body: resumeForm
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadData.message || 'Resume upload failed');
        }

        if (uploadData.resumeUrl) {
          resumeUrlToSend = uploadData.resumeUrl;
          setForm(prev => ({ ...prev, resumeUrl: uploadData.resumeUrl }));
          updateUser({ resumeUrl: uploadData.resumeUrl });
          setResumeName(uploadData.resumeName || resumeFile.name);
          setResumeFile(null);
        } else {
          throw new Error('No resume URL in response');
        }
        setResumeUploading(false);
      }

      // Now update profile fields (includes resumeUrl if present)
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
          skills: form.skills,
          avatarUrl: form.avatarUrl,
          resumeUrl: resumeUrlToSend
        })
      });

      if (!res.ok) {
        throw new Error('Failed to save profile');
      }

      setInitialForm({ ...form, resumeUrl: resumeUrlToSend });
      updateUser({ ...form, resumeUrl: resumeUrlToSend });

      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Save error:', err);
      alert(`Failed to update profile: ${err.message}`);
      setResumeUploading(false);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    e.target.value = null;

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size must be less than 2MB');
      return;
    }

    console.log('📤 Uploading file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Create instant preview
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch(
        'http://localhost:5000/api/user/upload-avatar',
        {
          method: 'POST',
          credentials: 'include',
          body: formData,
        }
      );

      console.log('📥 Response status:', res.status);

      const data = await res.json();
      console.log('📦 Response data:', data);

      if (!res.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      // Clean up the temporary preview URL
      URL.revokeObjectURL(previewUrl);

      // Set the Cloudinary URL
      if (data.avatarUrl) {
        setAvatarPreview(data.avatarUrl);
        setForm(prev => ({
          ...prev,
          avatarUrl: data.avatarUrl
        }));
        updateUser({ avatarUrl: data.avatarUrl });

      } else {
        throw new Error('No avatar URL in response');
      }

    } catch (err) {
      console.error('❌ Avatar upload error:', err);
      console.error('Error details:', err.message);
      alert(`Failed to upload avatar: ${err.message}`);
      // Revert to previous avatar on error
      setAvatarPreview(form.avatarUrl || null);
    }
  };

  // Resume selection (local only until user clicks Save)
  const handleResumeSelect = (e) => {
    const file = e.target.files[0];
    e.target.value = null;

    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please select a PDF or Word document (.pdf, .doc, .docx)');
      return;
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('Resume size must be less than 5MB');
      return;
    }

    setResumeFile(file);
    setResumeName(file.name);
  };

  const removeSelectedResume = () => {
    setResumeFile(null);
    setResumeName('');
  };

  const removeExistingResume = () => {
    // Clear resumeUrl from form, treat as unsaved until saved
    setForm(prev => ({ ...prev, resumeUrl: '' }));
    setResumeName('');
  };


  const unsavedChanges = (() => {
    if (!initialForm) return false;

    const basicDifferent = JSON.stringify({
      name: form.name,
      location: form.location,
      contact: form.contact,
      skills: form.skills,
      avatarUrl: form.avatarUrl,
      resumeUrl: form.resumeUrl || ''
    }) !== JSON.stringify({
      name: initialForm.name,
      location: initialForm.location,
      contact: initialForm.contact,
      skills: initialForm.skills,
      avatarUrl: initialForm.avatarUrl,
      resumeUrl: initialForm.resumeUrl || ''
    });

    // If a new resume file is selected but not uploaded yet, treat as unsaved
    return basicDifferent || Boolean(resumeFile);
  })();


  const initials = (form.name || form.email || 'U').split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />



      <main className="min-h-screen lg:ml-64 bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6 transition-all">

        {/* Mobile Menu Button */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="lg:hidden inline-flex items-center gap-2 rounded-xl bg-pink-500 px-4 py-2 text-white font-semibold shadow-md"
            aria-label="Open sidebar"
          >
            ☰
          </button>

          {/* Unsaved changes indicator */}
          {unsavedChanges && (
            <div className="hidden sm:inline-flex items-center gap-2 text-sm text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full font-semibold">
              ⚠️ Unsaved changes
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-800 mb-1">My Profile</h1>
              <p className="text-gray-600">Keep your profile up to date for better matches</p>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={handleSaveChanges}
                disabled={!unsavedChanges || saving}
                className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 font-semibold hover:from-pink-600 hover:to-purple-600 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Layout: left profile card, right form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Profile Summary */}
            <aside className="col-span-1 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-md overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>

                <button
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="absolute -bottom-2 right-0 bg-white rounded-full p-2 shadow-md text-sm text-gray-600 hover:bg-gray-50"
                  aria-label="Upload avatar"
                >
                  ✎
                </button>

                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </div>

              <div className="text-center">
                <h2 className="text-lg font-bold text-gray-800">{form.name || 'Your Name'}</h2>
                <p className="text-sm text-gray-500 mt-1">{form.role || 'Seeker'}</p>
              </div>

              <div className="w-full mt-3 text-sm text-gray-600">
                <p className="truncate"><strong>Email:</strong> {form.email || '—'}</p>
                <p className="mt-1"><strong>Location:</strong> {form.location || '—'}</p>
              </div>

              <div className="w-full mt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {form.skills.length === 0 ? (
                    <p className="text-sm text-gray-400">No skills added</p>
                  ) : (
                    form.skills.map((s, i) => (
                      <span key={i} className="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                        {s}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="w-full mt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Resume</h3>
                <div>
                  {form.resumeUrl ? (
                    <a href={form.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-pink-600 font-semibold hover:underline">
                      📄 View Resume
                    </a>
                  ) : (
                    <p className="text-sm text-gray-400">No resume uploaded</p>
                  )}
                </div>
              </div>

              <div className="mt-auto w-full">
                <p className="text-xs text-gray-400">Tip: Keep your skills updated for better job matches.</p>
              </div>
            </aside>

            {/* Right: Form */}
            <section className="col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8">
              {loading ? (
                <div className="flex items-center justify-center py-24">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      disabled
                      className="w-full rounded-xl bg-gray-50 border-2 border-gray-200 px-4 py-3 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
                        placeholder="City, Country"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
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

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                    <input
                      type="text"
                      value={form.role}
                      disabled
                      className="w-full rounded-xl bg-gray-50 border-2 border-gray-200 px-4 py-3 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Role assigned by the system</p>
                  </div>

                  {/* Resume Upload Section */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Resume</label>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-4 bg-gradient-to-br from-gray-50 to-pink-50 rounded-2xl p-4 border-2 border-gray-100 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center text-pink-600 shadow-sm">
                          📄
                        </div>

                        <div className="flex-1">
                          {resumeName || form.resumeUrl ? (
                            <div className="flex items-center justify-between">
                              <div className="truncate">
                                <p className="text-sm font-medium text-gray-800">{resumeName || (form.resumeUrl && form.resumeUrl.split('/').pop())}</p>
                                {form.resumeUrl && !resumeFile && (
                                  <a href={form.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-pink-500 hover:underline">View</a>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                {resumeFile ? (
                                  <button type="button" onClick={removeSelectedResume} className="text-xs text-gray-500 hover:text-gray-700">Remove</button>
                                ) : (
                                  <button type="button" onClick={removeExistingResume} className="text-xs text-gray-500 hover:text-gray-700">Remove</button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-400">No resume uploaded yet. Upload PDF or Word document.</p>
                          )}
                        </div>

                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => resumeInputRef.current && resumeInputRef.current.click()}
                          className="rounded-xl bg-white border-2 border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Choose file
                        </button>

                        <input ref={resumeInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleResumeSelect} className="hidden" />

                        <p className="text-xs text-gray-400">Accepted: PDF, DOC, DOCX — max 5MB</p>

                      </div>
                    </div>

                    {resumeUploading && (
                      <div className="text-xs text-pink-600 font-medium">Uploading resume...</div>
                    )}
                  </div>

                  {/* Skills Section */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Skills & Expertise</label>

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
                            <option key={idx} value={skill}>{skill}</option>
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
                        <p className="text-gray-400 text-center py-4">No skills added yet. Select from the dropdown above.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {form.skills.map((skill, idx) => (
                            <span key={idx} className="inline-flex items-center gap-2 bg-white text-pink-600 px-4 py-2 rounded-full text-sm font-medium shadow-sm border-2 border-pink-100 hover:border-pink-300 transition-all">
                              {skill}
                              <button type="button" onClick={() => handleRemoveSkill(skill)} className="ml-2 text-pink-400 hover:text-pink-600 font-bold text-lg leading-none transition-colors">×</button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 sm:hidden">
                    {/* Mobile save button */}
                    <button
                      type="submit"
                      disabled={!unsavedChanges || saving}
                      className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 py-4 text-white font-bold text-lg hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
