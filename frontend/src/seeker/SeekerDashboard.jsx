import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBriefcase, FaCheckCircle, FaBars, FaBookOpen, FaSearch, FaMapMarkerAlt, FaClock, FaBuilding } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

import Navbar from '../navbar/Navbar';
import JobDetailsModal from '../JobDetails/JobDetailsModal';
import Sidebar from '../sidebar/Sidebar';
import Footer from '../footer/Footer';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SeekerDashboard() {
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('Job Seeker');
  const [userData, setUserData] = useState(null);

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('All');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  /* -------------------------
     Load user from navigation
  --------------------------*/
  useEffect(() => {
    if (location.state) {
      setUserData(location.state);
      setUserName(location.state.name || 'Job Seeker');
    }
  }, [location.state]);

  /* -------------------------
     FETCH REAL JOBS FROM DB
  --------------------------*/
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/jobs/getjobs');

        const normalizedJobs = data.map((job) => ({
          ...job,
          id: job._id, // normalize Mongo _id for frontend
        }));

        setJobs(normalizedJobs);
        setFilteredJobs(normalizedJobs);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load jobs');
      }
    };

    fetchJobs();
  }, []);

  /* -------------------------
     Filters + Search
  --------------------------*/
  useEffect(() => {
    let list = [...jobs];

    if (filterType !== 'All') {
      list = list.filter((j) => j.type === filterType);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q)
      );
    }

    setFilteredJobs(list);
  }, [jobs, query, filterType]);

  const openJobDetails = (job) => setSelectedJob(job);
  const closeJobDetails = () => setSelectedJob(null);

  /* -------------------------
     Toast helper
  --------------------------*/
  const triggerToast = (message) => {
    toast.info(message, {
      position: 'top-right',
      autoClose: 3000,
      style: { background: '#ff3366', color: '#fff', fontWeight: 500 },
    });
  };

  /* -------------------------
     Apply (still local-only)
     ⚠️ backend next
  --------------------------*/
  const handleApply = async (job) => {
    if (!userData) {
      triggerToast('User not loaded yet.');
      return;
    }

    if (appliedJobIds.includes(job.id)) {
      triggerToast(`You’ve already applied for "${job.title}".`);
      return;
    }

    setAppliedJobIds((prev) => [...prev, job.id]);
    triggerToast(`Successfully applied for "${job.title}"!`);
    setSelectedJob(null);
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans overflow-x-hidden">
      <Sidebar sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main
        className={`flex-1 p-6 lg:p-10 transition-all duration-300 ease-in-out ${
          selectedJob ? 'filter blur-sm pointer-events-none' : ''
        } ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}
      >
        <Navbar />

        {/* Top bar */}
        <div className="flex items-center justify-between gap-4 mb-8 py-4">
          <div className="flex items-center gap-6">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-[#ff3366] hover:bg-white/30"
            >
              <FaBars size={18} />
            </button>

            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">
                Welcome back, <span className="text-[#ff3366]">{userName}</span>
              </h1>
              <p className="text-sm text-gray-500">
                Here are jobs and resources curated for you.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white rounded-md shadow px-3 py-2 gap-2">
              <FaSearch className="text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search jobs, skills, companies"
                className="outline-none text-sm"
              />
            </div>

            <div className="hidden sm:flex gap-3">
              <div className="text-center px-4 py-2 bg-white rounded-md shadow">
                <div className="text-sm text-gray-500">Jobs</div>
                <div className="font-semibold text-lg">{jobs.length}</div>
              </div>
              <div className="text-center px-4 py-2 bg-white rounded-md shadow">
                <div className="text-sm text-gray-500">Applied</div>
                <div className="font-semibold text-lg">{appliedJobIds.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option>All</option>
            <option>Remote</option>
            <option>Part-time</option>
            <option>On-site</option>
          </select>
        </div>

        {/* Jobs */}
        <section className="mb-8">
          <div className="flex justify-between mb-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-[#ff3366]">
              <FaBriefcase /> Available Jobs
            </h2>
            <p className="text-sm text-gray-500">
              Showing {filteredJobs.length} results
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredJobs.length === 0 ? (
              <div className="p-6 bg-white rounded-lg shadow text-gray-500">
                No jobs available.
              </div>
            ) : (
              filteredJobs.map((job) => {
                const alreadyApplied = appliedJobIds.includes(job.id);

                const truncate = (text, n = 400) =>
                  text && text.length > n ? text.slice(0, n) + '…' : text;

                return (
                  <article
                    key={job.id}
                    role="article"
                    aria-labelledby={`job-${job.id}-title`}
                    className="group bg-white rounded-2xl p-6 min-h-[320px] shadow-sm hover:shadow-xl hover:-translate-y-2 transform transition-all duration-300 ring-0 hover:ring-1 hover:ring-rose-50 flex flex-col justify-between"
                  >
                    <div className="flex gap-5 items-start">
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gradient-to-tr from-pink-400 to-rose-500 text-white font-bold flex items-center justify-center text-lg shadow-md">
                        {job.company?.charAt(0)?.toUpperCase() || job.title?.charAt(0)?.toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="pr-4">
                            <h3 id={`job-${job.id}-title`} className="text-xl md:text-2xl font-semibold text-gray-800 leading-tight">{job.title}</h3>

                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                              <span className="flex items-center gap-2"><FaBuilding className="opacity-60" /> <span className="font-medium text-gray-700">{job.company || 'Company'}</span></span>
                              <span className="flex items-center gap-2"><FaMapMarkerAlt className="opacity-60" /> <span>{job.location || job.type || 'Remote'}</span></span>
                            </div>
                          </div>

                          <div className="flex-shrink-0 text-right">
                            <div className="text-sm text-gray-500">{job.type}</div>
                            <div className="mt-2 inline-block bg-gray-50 text-gray-900 px-4 py-2 rounded-full font-semibold shadow-sm">₹{job.payment}</div>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mt-4 leading-relaxed">{truncate(job.description)}</p>

                        <div className="flex flex-wrap gap-2 mt-4">
                          {job.tags?.slice(0, 8).map((t) => (
                            <span
                              key={t}
                              className="text-xs bg-gray-50 text-gray-800 px-3 py-1 rounded-full border border-gray-100 shadow-sm"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span className="flex items-center gap-2"><FaClock className="opacity-60" /> {job.postedAt ? new Date(job.postedAt).toLocaleDateString() : 'Recently posted'}</span>
                        <span className="hidden sm:inline-flex items-center gap-2"><FaMapMarkerAlt className="opacity-60" /> {job.location || job.type || 'Remote'}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openJobDetails(job)}
                          className="border border-gray-200 px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition"
                          aria-label={`View details for ${job.title}`}
                        >
                          Details
                        </button>

                        <button
                          onClick={() => handleApply(job)}
                          disabled={alreadyApplied}
                          aria-pressed={alreadyApplied}
                          aria-label={alreadyApplied ? `${job.title} already applied` : `Apply to ${job.title}`}
                          className={`px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow transition-transform duration-150 ${
                            alreadyApplied
                              ? 'bg-emerald-500 flex items-center gap-2'
                              : 'bg-gradient-to-r from-[#ff3366] to-[#ff6f8a] hover:scale-105'
                          }`}
                        >
                          {alreadyApplied ? (
                            <>
                              <FaCheckCircle /> Applied
                            </>
                          ) : (
                            'Apply'
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>

        <Footer />
      </main>

      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={closeJobDetails}
          onApply={handleApply}
          alreadyApplied={appliedJobIds.includes(selectedJob.id)}
        />
      )}

      <ToastContainer theme="colored" />
    </div>
  );
}
