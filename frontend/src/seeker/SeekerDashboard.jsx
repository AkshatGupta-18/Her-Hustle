import { useState, useEffect, useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Seekernav from '../seekernav/Seekernav';
import {
  FaBriefcase,
  FaCheckCircle,
  FaBars,
  FaSearch,
  FaMapMarkerAlt,
  FaClock,
  FaBuilding,
  FaRegBookmark,
  FaBookmark,
  FaTimes,
  FaUserCircle,
  FaFire,
} from 'react-icons/fa';
import Sidebar from '../sidebar/Sidebar';
import axios from 'axios';

export default function SeekerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState('Job Seeker');
  const [userData, setUserData] = useState(null);


  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState([]);

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortBy, setSortBy] = useState('Newest');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(9);
  const [userSkills, setUserSkills] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/api/jobs/getjobs', { withCredentials: true });
        const normalized = (Array.isArray(data) ? data : []).map((job) => ({
          ...job,
          id: job._id || job.id,
          skills: job.skills || job.tags || [],
          tags: job.tags || job.skills || [],
        }));
        setJobs(normalized);
        setFilteredJobs(normalized);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
        setJobs([]);
        setFilteredJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:5000/api/applications/my-applied-jobs',
          { withCredentials: true }
        );

        setAppliedJobIds(data); // data = array of job IDs
      } catch (error) {
        console.error('Failed to fetch applied jobs', error);
      }
    };

    fetchAppliedJobs();
  }, []);


  /* -------------------------
     Filters + Search + Sort
  --------------------------*/
  useEffect(() => {
    let list = [...jobs];

    if (filterType !== 'All') {
      list = list.filter((j) => j.type === filterType);
    }

    if (selectedTag) {
      list = list.filter((j) => (j.tags || []).includes(selectedTag));
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (j) =>
          j.title?.toLowerCase().includes(q) ||
          j.description?.toLowerCase().includes(q)
      );
    }

    if (showSavedOnly) {
      list = list.filter((j) => savedJobIds.includes(j.id));
    }

    if (sortBy === 'Highest pay') {
      list.sort((a, b) => (b.payment || 0) - (a.payment || 0));
    } else {
      list.sort(
        (a, b) =>
          new Date(b.postedAt || 0) - new Date(a.postedAt || 0)
      );
    }

    setFilteredJobs(list);
  }, [
    jobs,
    query,
    filterType,
    selectedTag,
    sortBy,
    showSavedOnly,
    savedJobIds,
  ]);

  // Update the fetchUserData useEffect
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get('/api/user/profile', { withCredentials: true });

        setUserName(data.name);
        setUserData(data);
        console.log('skills from API:', data.skills); // 👈


        // ✅ Set saved job IDs from backend
        if (data.savedJobs && Array.isArray(data.savedJobs)) {
          setSavedJobIds(data.savedJobs);
        }
        if (data.skills && Array.isArray(data.skills)) {
          setUserSkills(data.skills);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setUserName('Job Seeker');
      }
    };

    fetchUserData();
  }, []);

  /* -------------------------
     Helpers
  --------------------------*/
  const topTags = useMemo(() => {
    const freq = {};
    jobs.forEach((j) =>
      (j.skills || j.tags || []).forEach((t) => {
        freq[t] = (freq[t] || 0) + 1;
      })
    );
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([t]) => t);
  }, [jobs]);

  const formatTimeAgo = (iso) => {
    if (!iso) return '';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  const toggleSave = async (jobId, jobTitle) => {
    const isSaved = savedJobIds.includes(jobId);

    // Optimistic UI update
    setSavedJobIds((prev) => {
      return isSaved
        ? prev.filter((id) => id !== jobId)
        : [jobId, ...prev];
    });

    try {
      if (isSaved) {
        // Unsave
        await axios.delete(`/api/user/unsave-job/${jobId}`, { withCredentials: true });
        toast.success('Job removed from saved', {
          duration: 2000,
          position: 'top-right',
        });
      } else {
        // Save
        await axios.post(`/api/user/save-job/${jobId}`, {}, { withCredentials: true });
        toast.success('Job saved successfully! 💾', {
          duration: 2000,
          position: 'top-right',
        });
      }
    } catch (error) {
      // Revert optimistic update on error
      setSavedJobIds((prev) => {
        return isSaved
          ? [jobId, ...prev]
          : prev.filter((id) => id !== jobId);
      });

      toast.error(
        error.response?.data?.message || 'Failed to update saved jobs',
        {
          duration: 3000,
          position: 'top-right',
        }
      );
    }
  };

  const handleApply = async (jobId) => {
    // Optimistically update UI
    setAppliedJobIds((prev) => [...prev, jobId]);

    try {
      await axios.post(
        'http://localhost:5000/api/applications/apply',
        { jobId },
        { withCredentials: true }
      );

      toast.success('Applied successfully! 🎉', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: '#fff',
          fontWeight: '500',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#10B981',
        },
      });
    } catch (error) {
      // Revert optimistic update on error
      setAppliedJobIds((prev) => prev.filter(id => id !== jobId));

      toast.error(
        error.response?.data?.message || 'Failed to apply. Please try again.',
        {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: '#fff',
            fontWeight: '500',
          },
        }
      );
    }
  };



  const displayedJobs = filteredJobs.slice(0, visibleCount);

console.log('userSkills:', userSkills);
console.log('selectedJob skills:', selectedJob?.skills);

const computeMatchScore = (jobSkills = [], profileSkills = []) => {
  if (!jobSkills.length || !profileSkills.length) return 0;
  const normalize = (s) => s.toLowerCase().trim();
  const profileSet = new Set(profileSkills.map(normalize));
  const matched = jobSkills.filter((s) => profileSet.has(normalize(s)));
  return Math.round((matched.length / jobSkills.length) * 100);
};

const matchScore = useMemo(() => {
  if (!selectedJob) return 0;
  return computeMatchScore(selectedJob.skills, userSkills);
}, [selectedJob, userSkills]);

  /* -------------------------
     Render
  --------------------------*/
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/30 to-gray-50 flex">
      <Toaster />
      {/* Shared Sidebar component */}
      <Sidebar sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'
          }`}
      >
        {/* Top Navbar */}
        <Seekernav
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userName={userName}
          userRole="Job Seeker"
          showSearch={false}
          notifications={3}
        />

        {/* Content Area */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="mb-8">
              <div className="mb-6">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent mb-2">
                  Welcome back, {userName}
                </h1>
                <p className="text-gray-600">Discover opportunities that match your skills and ambitions</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Available Jobs</p>
                      <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30">
                      <FaBriefcase className="text-2xl text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Applied Jobs</p>
                      <p className="text-3xl font-bold text-gray-900">{appliedJobIds.length}</p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <FaCheckCircle className="text-2xl text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Saved Jobs</p>
                      <p className="text-3xl font-bold text-gray-900">{savedJobIds.length}</p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <FaBookmark className="text-2xl text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search jobs by title or description..."
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                      aria-label="Search jobs"
                    />
                  </div>

                  <div className="flex gap-3">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all text-sm"
                    >
                      <option>All</option>
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>Remote</option>
                    </select>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all text-sm"
                    >
                      <option>Newest</option>
                      <option>Highest pay</option>
                    </select>

                    <label className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={showSavedOnly}
                        onChange={() => setShowSavedOnly((s) => !s)}
                        className="rounded text-pink-600 focus:ring-pink-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Saved Only</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Jobs Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Available Opportunities</h2>
                <span className="text-sm text-gray-500">{filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found</span>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 bg-gray-200 rounded-2xl"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="h-20 bg-gray-200 rounded-xl mb-4"></div>
                      <div className="flex gap-2">
                        <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
                        <div className="h-8 bg-gray-200 rounded-lg w-24"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : displayedJobs.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaBriefcase className="text-3xl text-pink-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedJobs.map((job) => {
                    const applied = appliedJobIds.includes(job.id);
                    const saved = savedJobIds.includes(job.id);

                    return (
                      <div
                        key={job.id}
                        className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:border-pink-200 transition-all duration-300 cursor-pointer hover:-translate-y-1"
                        onClick={() => setSelectedJob(job)}
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-pink-500/30 group-hover:shadow-xl group-hover:shadow-pink-500/40 transition-all">
                            {(job.company || job.title || '').charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 mb-1 truncate group-hover:text-pink-600 transition-colors">
                              {job.title}
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <FaBuilding className="text-xs" />
                              {job.company}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {job.description}
                        </p>

                        <div className="mt-3 mb-4">
                          <h4 className="text-xs font-semibold text-gray-500 mb-2">Skills</h4>
                          <div className="flex flex-wrap gap-2" role="list" aria-label={`Skills for ${job.title}`}>
                            {(job.skills || job.tags || []).slice(0, 5).map((tag) => (
                              <span
                                key={tag}
                                role="listitem"
                                className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100"
                              >
                                {tag}
                              </span>
                            ))}

                            {(job.skills || job.tags || []).length > 5 && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200">
                                +{(job.skills || job.tags || []).length - 5} more
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                          <span className="inline-flex items-center gap-1">
                            <FaMapMarkerAlt />
                            {job.location || job.type}
                          </span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1">
                            <FaClock />
                            {formatTimeAgo(job.postedAt)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <span className="text-lg font-bold text-gray-900">
                            ₹{job.payment}
                          </span> 
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSave(job.id, job.title);
                              }}
                              className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                              aria-label="Save job"
                            >
                              {saved ? <FaBookmark className="text-pink-600" /> : <FaRegBookmark />}
                            </button>
                            <button
                              disabled={applied}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApply(job.id);
                              }}
                              className={`px-4 py-2 rounded-md text-sm font-medium transition
    ${applied
                                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                  : 'bg-pink-600 text-white hover:bg-pink-700'
                                }
  `}
                            >
                              {applied ? 'Applied' : 'Apply Now'}
                            </button>

                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {filteredJobs.length > visibleCount && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setVisibleCount((v) => v + 9)}
                    className="px-6 py-3 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-medium border border-gray-200 hover:border-pink-300 transition-all"
                  >
                    Load More Jobs
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Job Details Modal */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedJob(null)}>
            <div
              className="bg-white w-full max-w-2xl rounded-3xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors sticky top-6 z-10"
                onClick={() => setSelectedJob(null)}
                aria-label="Close"
              >
                <FaTimes />
              </button>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-pink-500/30">
                  {(selectedJob.company || selectedJob.title || '').charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedJob.title}</h2>
                  <p className="text-gray-600 flex items-center gap-2 mb-1">
                    <FaBuilding className="text-sm" />
                    {selectedJob.company}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <FaMapMarkerAlt />
                    {selectedJob.location || selectedJob.type}
                    <span>•</span>
                    <FaClock />
                    {formatTimeAgo(selectedJob.postedAt)}
                  </p>
                </div>
              </div>
              {/* Match Score Banner */}
              {selectedJob?.skills?.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Profile Match</span>
                    <span
                      className={`text-sm font-bold ${matchScore >= 70
                        ? 'text-emerald-600'
                        : matchScore >= 40
                          ? 'text-amber-500'
                          : 'text-rose-500'
                        }`}
                    >
                      {matchScore}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${matchScore >= 70
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                        : matchScore >= 40
                          ? 'bg-gradient-to-r from-amber-400 to-orange-400'
                          : 'bg-gradient-to-r from-rose-400 to-pink-500'
                        }`}
                      style={{ width: `${matchScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">
                    {matchScore >= 70
                      ? 'Great match — you have most of the required skills'
                      : matchScore >= 40
                        ? 'Partial match — consider brushing up on a few skills'
                        : userSkills.length === 0
                          ? 'Add skills to your profile to see your match score'
                          : 'Low match — this role needs skills not yet on your profile'}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                  <p className="text-sm text-gray-600 mb-1">Job Type</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedJob.type}</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
                  <p className="text-sm text-gray-600 mb-1">Salary</p>
                  <p className="text-lg font-semibold text-gray-900">₹{selectedJob.payment}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Job Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
              </div>

              {selectedJob.skills && selectedJob.skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2" role="list" aria-label="Required skills">
                    {selectedJob.skills.map((tag) => (
                      <span
                        key={tag}
                        role="listitem"
                        className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
                  onClick={() => setSelectedJob(null)}
                >
                  Close
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSave(selectedJob.id, selectedJob.title);
                  }}
                  className={`px-6 py-3 rounded-xl font-medium transition-colors ${savedJobIds.includes(selectedJob.id)
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                >
                  {savedJobIds.includes(selectedJob.id) ? (
                    <span className="flex items-center gap-2">
                      <FaBookmark className="text-pink-600" /> Saved
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <FaRegBookmark /> Save Job
                    </span>
                  )}
                </button>
                <button
                  disabled={appliedJobIds.includes(selectedJob.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApply(selectedJob.id);
                  }}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${appliedJobIds.includes(selectedJob.id)
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 cursor-default'
                    : 'bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white shadow-lg shadow-pink-500/30'
                    }`}
                >
                  {appliedJobIds.includes(selectedJob.id) ? (
                    <span className="flex items-center gap-2">
                      <FaCheckCircle /> Applied
                    </span>
                  ) : (
                    'Apply Now'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}