import { useState } from 'react';
import OrganizerSidebar from '../organizer-sidebar/OrganizerSidebar';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEye,
  FaDownload,
  FaFilter,
  FaSearch,
  FaBars,
} from 'react-icons/fa';

export default function Applications() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy data for applications
  const applications = [
    {
      id: 1,
      candidate: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        avatar: 'SJ',
      },
      job: {
        title: 'Senior Product Designer',
        department: 'Design',
        type: 'Full-time',
      },
      appliedDate: '2024-02-01',
      status: 'pending',
      experience: '5 years',
      resume: 'sarah_johnson_resume.pdf',
      coverLetter: 'Passionate about creating user-centered designs...',
    },
    {
      id: 2,
      candidate: {
        name: 'Emily Chen',
        email: 'emily.chen@email.com',
        phone: '+1 (555) 234-5678',
        location: 'San Francisco, CA',
        avatar: 'EC',
      },
      job: {
        title: 'Marketing Manager',
        department: 'Marketing',
        type: 'Full-time',
      },
      appliedDate: '2024-02-02',
      status: 'approved',
      experience: '7 years',
      resume: 'emily_chen_resume.pdf',
      coverLetter: 'Experienced marketing professional with proven track record...',
    },
    {
      id: 3,
      candidate: {
        name: 'Jessica Martinez',
        email: 'jessica.m@email.com',
        phone: '+1 (555) 345-6789',
        location: 'Austin, TX',
        avatar: 'JM',
      },
      job: {
        title: 'Frontend Developer',
        department: 'Engineering',
        type: 'Remote',
      },
      appliedDate: '2024-02-03',
      status: 'rejected',
      experience: '3 years',
      resume: 'jessica_martinez_resume.pdf',
      coverLetter: 'Full-stack developer specializing in React and modern web...',
    },
    {
      id: 4,
      candidate: {
        name: 'Amanda Williams',
        email: 'amanda.w@email.com',
        phone: '+1 (555) 456-7890',
        location: 'Seattle, WA',
        avatar: 'AW',
      },
      job: {
        title: 'Data Analyst',
        department: 'Analytics',
        type: 'Full-time',
      },
      appliedDate: '2024-02-04',
      status: 'pending',
      experience: '4 years',
      resume: 'amanda_williams_resume.pdf',
      coverLetter: 'Data-driven professional with expertise in SQL, Python...',
    },
    {
      id: 5,
      candidate: {
        name: 'Rachel Kim',
        email: 'rachel.kim@email.com',
        phone: '+1 (555) 567-8901',
        location: 'Boston, MA',
        avatar: 'RK',
      },
      job: {
        title: 'Content Writer',
        department: 'Content',
        type: 'Part-time',
      },
      appliedDate: '2024-02-05',
      status: 'approved',
      experience: '2 years',
      resume: 'rachel_kim_resume.pdf',
      coverLetter: 'Creative writer with a passion for storytelling...',
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
            <FaCheckCircle />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
            <FaTimesCircle />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">
            <FaClock />
            Pending
          </span>
        );
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    const matchesSearch =
      app.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  return (
    <>
      <OrganizerSidebar sidebarOpen={sidebarOpen} />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/30 to-rose-50/30 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-white/50 transition-colors"
              >
                <FaBars className="text-2xl text-gray-700" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Applications</h1>
                <p className="text-gray-600">Manage and review job applications</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Total Applications</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
                    <FaFileAlt className="text-pink-600 text-xl" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Pending Review</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                    <FaClock className="text-yellow-600 text-xl" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Approved</p>
                    <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <FaCheckCircle className="text-green-600 text-xl" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Rejected</p>
                    <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                    <FaTimesCircle className="text-red-600 text-xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by candidate name or job title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <FaFilter className="text-gray-400" />
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all bg-white font-medium"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
              {filteredApplications.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <FaFileAlt className="text-gray-400 text-3xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                filteredApplications.map((application) => (
                  <div
                    key={application.id}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-pink-200"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Candidate Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-pink-500/30 flex-shrink-0">
                            {application.candidate.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                  {application.candidate.name}
                                </h3>
                                <p className="text-sm text-gray-600 font-medium">
                                  Applied for: {application.job.title}
                                </p>
                              </div>
                              {getStatusBadge(application.status)}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FaEnvelope className="text-pink-500" />
                                <span>{application.candidate.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FaPhone className="text-pink-500" />
                                <span>{application.candidate.phone}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FaMapMarkerAlt className="text-pink-500" />
                                <span>{application.candidate.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FaCalendarAlt className="text-pink-500" />
                                <span>Applied: {application.appliedDate}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Job Details */}
                        <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 mb-4 border border-pink-100">
                          <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                              <FaBriefcase className="text-pink-600" />
                              <span className="text-sm font-semibold text-gray-900">
                                {application.job.title}
                              </span>
                            </div>
                            <span className="px-3 py-1 bg-white rounded-lg text-xs font-medium text-gray-700 border border-pink-200">
                              {application.job.department}
                            </span>
                            <span className="px-3 py-1 bg-white rounded-lg text-xs font-medium text-gray-700 border border-pink-200">
                              {application.job.type}
                            </span>
                            <span className="px-3 py-1 bg-white rounded-lg text-xs font-medium text-gray-700 border border-pink-200">
                              {application.experience} experience
                            </span>
                          </div>
                        </div>

                        {/* Cover Letter Preview */}
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-gray-900 mb-2">Cover Letter:</p>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {application.coverLetter}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="lg:w-48 flex lg:flex-col gap-2">
                        <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white rounded-xl shadow-lg shadow-pink-500/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 font-semibold text-sm">
                          <FaEye />
                          View Details
                        </button>
                        <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-xl border border-gray-200 transition-all font-semibold text-sm">
                          <FaDownload />
                          Download CV
                        </button>
                        {application.status === 'pending' && (
                          <>
                            <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl transition-all font-semibold text-sm">
                              <FaCheckCircle />
                              Approve
                            </button>
                            <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-all font-semibold text-sm">
                              <FaTimesCircle />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}