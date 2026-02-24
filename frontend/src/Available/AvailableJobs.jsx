import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import Seekernav from "../seekernav/Seekernav";
import {
  FaCheckCircle,
  FaSearch,
  FaFilter,
  FaTimes,
  FaBriefcase,
  FaMapMarkerAlt,
  FaClock,
  FaMoneyBillWave,
  FaBuilding,
  FaRegBookmark,
  FaBookmark,
  FaBars,
  FaUserCircle,
} from "react-icons/fa";
import Sidebar from "../sidebar/Sidebar";

const JobDetailsModal = ({ job, onClose, onApply, isApplied, onToggleSave, isSaved }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
    <div
      className="bg-white w-full max-w-2xl rounded-3xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300 max-h-[85vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors sticky top-6 z-10"
        onClick={onClose}
        aria-label="Close"
      >
        <FaTimes />
      </button>

      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-pink-500/30">
          {(job.company || job.title || '').charAt(0)}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h2>
          <p className="text-gray-600 flex items-center gap-2 mb-1">
            <FaBuilding className="text-sm" />
            {job.company}
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <FaMapMarkerAlt />
            {job.location || job.type}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
          <p className="text-sm text-gray-600 mb-1">Job Type</p>
          <p className="text-lg font-semibold text-gray-900">{job.type}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
          <p className="text-sm text-gray-600 mb-1">Salary</p>
          <p className="text-lg font-semibold text-gray-900">₹{job.payment}</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Job Description</h3>
        <p className="text-gray-700 leading-relaxed">{job.description}</p>
      </div>

      {job.skills && job.skills.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
          onClick={onClose}
        >
          Close
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(job.id);
          }}
          className="px-6 py-3 rounded-xl font-medium transition-colors bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          {isSaved ? (
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
          disabled={isApplied}
          onClick={(e) => {
            e.stopPropagation();
            onApply(job.id);
          }}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${isApplied
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 cursor-default'
            : 'bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white shadow-lg shadow-pink-500/30'
            }`}
        >
          {isApplied ? (
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
);

export default function AvailableJobs() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState('Job Seeker');
  const [userData, setUserData] = useState(null);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [workType, setWorkType] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const [loading, setLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get('/api/user/profile', { withCredentials: true });

        setUserName(data.name);
        setUserData(data);

        // Set saved job IDs from backend
        if (data.savedJobs && Array.isArray(data.savedJobs)) {
          setSavedJobIds(data.savedJobs);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setUserName('Job Seeker');
      }
    };

    fetchUserData();
  }, []);

  // Fetch jobs
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

  // Fetch applied jobs
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const { data } = await axios.get(
          '/api/applications/my-applied-jobs',
          { withCredentials: true }
        );
        setAppliedJobIds(data);
      } catch (error) {
        console.error('Failed to fetch applied jobs', error);
      }
    };

    fetchAppliedJobs();
  }, []);

  // Apply filters
  useEffect(() => {
    let list = [...jobs];

    if (minSalary !== '') {
      list = list.filter((job) => job.payment >= Number(minSalary));
    }

    if (workType !== 'All') {
      list = list.filter((job) => job.type === workType);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (job) =>
          job.title?.toLowerCase().includes(q) ||
          job.description?.toLowerCase().includes(q)
      );
    }

    // ✅ ADD THIS
    if (showSavedOnly) {
      list = list.filter((j) => savedJobIds.includes(j.id));
    }

    setFilteredJobs(list);
  }, [jobs, minSalary, workType, searchTerm, showSavedOnly, savedJobIds]); // ✅ ADD showSavedOnly and savedJobIds to dependencies

  const resetFilters = () => {
    setMinSalary('');
    setWorkType('All');
    setSearchTerm('');
    setShowSavedOnly(false); // ✅ ADD THIS
    setFilteredJobs(jobs);
  };

  const toggleSave = async (jobId) => {
    const isSaved = savedJobIds.includes(jobId);

    // Optimistic UI update
    setSavedJobIds((prev) => {
      return isSaved
        ? prev.filter((id) => id !== jobId)
        : [jobId, ...prev];
    });

    try {
      if (isSaved) {
        await axios.delete(`/api/user/unsave-job/${jobId}`, { withCredentials: true });
        toast.success('Job removed from saved', {
          duration: 2000,
          position: 'top-right',
        });
      } else {
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
        '/api/applications/apply',
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

      setSelectedJob(null);
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

  const activeFiltersCount = [minSalary, workType !== 'All', searchTerm, showSavedOnly].filter(Boolean).length;
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/30 to-gray-50 flex">
      <Toaster />
      <Sidebar sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Navbar */}
        <Seekernav
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                  userName={userName}
                  userRole="Job Seeker"
                  showSearch={false}
                  notifications={3}
                />

        <div className="p-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="mb-8">
              <div className="mb-6">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent mb-2">
                  Available Jobs
                </h1>
                <p className="text-gray-600">Discover flexible and empowering work opportunities tailored for you</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Jobs</p>
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
                      <p className="text-sm text-gray-600 mb-1">Matching</p>
                      <p className="text-3xl font-bold text-gray-900">{filteredJobs.length}</p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                      <FaSearch className="text-2xl text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Applied</p>
                      <p className="text-3xl font-bold text-gray-900">{appliedJobIds.length}</p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <FaCheckCircle className="text-2xl text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Saved</p>
                      <p className="text-3xl font-bold text-gray-900">{savedJobIds.length}</p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <FaBookmark className="text-2xl text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
                <div className="relative mb-4">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by job title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                    aria-label="Search jobs"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
                  >
                    <FaFilter />
                    <span>Filters</span>
                    {activeFiltersCount > 0 && (
                      <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>

                  {/* ✅ SAVED ONLY CHECKBOX */}
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={showSavedOnly}
                      onChange={() => setShowSavedOnly((s) => !s)}
                      className="rounded text-pink-600 focus:ring-pink-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Saved Only</span>
                  </label>
                </div>


                {showFilters && (
                  <div className="mt-4 pt-4 border-t border-gray-200 grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Minimum Salary (₹)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 15000"
                        value={minSalary}
                        onChange={(e) => setMinSalary(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Work Type
                      </label>
                      <select
                        value={workType}
                        onChange={(e) => setWorkType(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                      >
                        <option value="All">All Types</option>
                        <option value="Remote">Remote</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 flex justify-end">
                      <button
                        onClick={resetFilters}
                        className="px-6 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-all"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Jobs Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Job Listings</h2>
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
              ) : filteredJobs.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaBriefcase className="text-3xl text-pink-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                  <button
                    onClick={resetFilters}
                    className="px-8 py-3 rounded-xl bg-pink-600 text-white hover:bg-pink-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobs.map((job) => {
                    const applied = appliedJobIds.includes(job.id);
                    const saved = savedJobIds.includes(job.id);

                    return (
                      <div
                        key={job.id}
                        className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:border-pink-200 transition-all duration-300 cursor-pointer hover:-translate-y-1"
                        onClick={() => setSelectedJob(job)}
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-pink-500/30 group-hover:shadow-xl group-hover:shadow-pink-500/40 transition-all">
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

                        <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <FaMoneyBillWave className="text-emerald-500" />
                            <span className="font-semibold">₹{Number(job.payment).toLocaleString()}</span>
                            <span className="text-gray-400">/ month</span>
                          </div>
                          {job.location && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FaMapMarkerAlt className="text-blue-500" />
                              <span>{job.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaClock className="text-pink-500" />
                            <span>{job.type}</span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSave(job.id);
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
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${applied
                              ? 'bg-emerald-500 text-white cursor-default flex items-center justify-center gap-2'
                              : 'bg-gradient-to-r from-pink-600 to-rose-500 text-white hover:from-pink-500 hover:to-rose-400'
                              }`}
                          >
                            {applied ? (
                              <>
                                <FaCheckCircle />
                                Applied
                              </>
                            ) : (
                              'Apply Now'
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Job Details Modal */}
        {selectedJob && (
          <JobDetailsModal
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            onApply={handleApply}
            isApplied={appliedJobIds.includes(selectedJob.id)}
            onToggleSave={toggleSave}
            isSaved={savedJobIds.includes(selectedJob.id)}
          />
        )}
      </main>
    </div>
  );
}