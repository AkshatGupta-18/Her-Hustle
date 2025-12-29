import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaBriefcase,
  FaBars,
  FaPlusCircle,
  FaTrash,
  FaUsers,
  FaTimes,
  FaSpinner,
  FaUserCircle,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import OrganizerSidebar from '../organizer-sidebar/OrganizerSidebar.jsx';

export default function OrganizerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('Organizer');
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    setUserName('Organizer');
  }, []);

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/jobs/my', {
          withCredentials: true,
        });
        setJobs(res.data.jobs);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, []);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    setJobs((prev) => prev.filter((job) => job._id !== jobId));
    // TODO: call backend delete endpoint
  };

  const fetchApplicants = async () => {
    const mockApplicants = [
      {
        id: 'a1',
        seekerName: 'Ananya Sharma',
        seekerEmail: 'ananya@example.com',
        seekerContact: '9876543210',
        seekerSkills: ['Content Writing', 'SEO'],
        seekerLocation: 'Delhi',
      },
    ];

    // simulate slight delay for nicer UX
    await new Promise((r) => setTimeout(r, 250));
    setApplicants(mockApplicants);
  };

  const handleViewApplicants = async (e, job) => {
    e.stopPropagation();
    setSelectedJob(job);
    setShowApplicantsModal(true);
    await fetchApplicants();
  };

  const closeModal = () => {
    setSelectedJob(null);
    setApplicants([]);
    setShowApplicantsModal(false);
  };

  const applicantsCount = applicants.length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex">
      <OrganizerSidebar sidebarOpen={sidebarOpen} />

      <main
        className={`flex-1 p-6 transition-all duration-300 min-h-screen ${
          sidebarOpen ? 'lg:ml-56' : ''
        }`}
      >
        <Navbar />

        {/* Header */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle sidebar"
              onClick={toggleSidebar}
              className="p-2 rounded-lg bg-white shadow-sm hover:bg-gray-100 transition"
            >
              <FaBars className="text-gray-700" />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-pink-600">Welcome, {userName}</h1>
              <p className="text-sm text-gray-500">Manage your job postings and connect with talented women.</p>

              <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FaBriefcase className="text-pink-600" />
                  <span className="font-medium">{jobs.length}</span>
                  <span className="text-xs">jobs</span>
                </div>

                <div className="flex items-center gap-2">
                  <FaUsers className="text-pink-600" />
                  <span className="font-medium">{applicantsCount}</span>
                  <span className="text-xs">applicants</span>
                </div>
              </div>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <Link to="/organizer/post-job">
              <button className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-lg shadow-md">
                <FaPlusCircle />
                Post a Job
              </button>
            </Link>

            <div className="hidden md:flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
              <FaUserCircle className="text-2xl text-gray-400" />
              <div className="text-left">
                <div className="text-sm font-semibold">{userName}</div>
                <div className="text-xs text-gray-500">Organizer</div>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FaBriefcase className="text-2xl text-pink-600" />
            <h2 className="text-lg font-semibold">My Job Postings</h2>
          </div>

          {loading ? (
            <div className="flex items-center gap-3 text-gray-500">
              <FaSpinner className="animate-spin text-pink-600" />
              <span>Loading jobs...</span>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <p className="text-gray-700 mb-3">You haven't posted any jobs yet.</p>
              <Link to="/organizer/post-job">
                <button className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-lg">
                  <FaPlusCircle /> Post your first job
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="group bg-white rounded-xl shadow-sm p-4 hover:shadow-lg transition cursor-pointer flex flex-col"
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-1 truncate">{job.title}</h3>
                      <p className="text-sm text-gray-500">{job.company || 'Remote / Flexible'}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-700">{job.type}</span>
                      <span className="text-xs bg-pink-50 text-pink-600 px-2 py-1 rounded-md">₹{job.payment}</span>
                    </div>
                  </div>

                  <p className="mt-3 text-gray-600 text-sm line-clamp-3 overflow-hidden">{job.description}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleViewApplicants(e, job)}
                        className="text-sm px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
                      >
                        View Applicants
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteJob(job._id);
                        }}
                        className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-pink-600 text-white hover:bg-pink-500"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>

                    <div className="text-xs text-gray-400">Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '—'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Job Details Modal */}
        {selectedJob && !showApplicantsModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={closeModal}>
            <div
              className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-lg relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={closeModal}
                aria-label="Close"
              >
                <FaTimes />
              </button>

              <h2 className="text-xl font-semibold text-pink-600 mb-2">{selectedJob.title}</h2>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <div className="font-medium">Type</div>
                  <div>{selectedJob.type}</div>
                </div>
                <div>
                  <div className="font-medium">Payment</div>
                  <div>₹{selectedJob.payment}</div>
                </div>
              </div>

              <p className="mt-4 text-gray-700">{selectedJob.description}</p>

              <div className="mt-6 flex justify-end gap-3">
                <button className="px-4 py-2 rounded-md bg-gray-200" onClick={closeModal}>
                  Close
                </button>
                <button className="px-4 py-2 rounded-md bg-pink-600 text-white" onClick={(e) => handleViewApplicants(e, selectedJob)}>
                  View Applicants
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Applicants Modal */}
        {showApplicantsModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowApplicantsModal(false)}>
            <div
              className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-lg max-h-[80vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setShowApplicantsModal(false)}
                aria-label="Close applicants"
              >
                <FaTimes />
              </button>

              <h2 className="text-xl font-semibold text-pink-600 mb-4">Applicants for {selectedJob?.title}</h2>

              {applicants.length === 0 ? (
                <div className="text-gray-500">No applicants yet.</div>
              ) : (
                <div className="space-y-3">
                  {applicants.map((applicant) => (
                    <div key={applicant.id} className="bg-gray-50 p-4 rounded-md border border-gray-100 flex items-start justify-between">
                      <div>
                        <div className="font-semibold">{applicant.seekerName}</div>
                        <div className="text-sm text-gray-500">{applicant.seekerSkills.join(', ')}</div>
                        <div className="text-sm text-gray-500">{applicant.seekerLocation}</div>
                      </div>

                      <div className="flex flex-col gap-2 items-end">
                        <a href={`mailto:${applicant.seekerEmail}`} className="text-sm px-3 py-2 rounded-md bg-pink-600 text-white">Contact</a>
                        <a href={`tel:${applicant.seekerContact}`} className="text-xs text-gray-500">{applicant.seekerContact}</a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 text-right">
                <button className="px-4 py-2 rounded-md bg-gray-200" onClick={() => setShowApplicantsModal(false)}>
                  Back
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
