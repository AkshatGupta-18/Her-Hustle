import { useState } from 'react';
import {
  FaBars,
  FaCheckCircle,
  FaBriefcase,
  FaClock,
  FaMoneyBillWave
} from 'react-icons/fa';

import './MyApplications.css';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import JobDetailsModal from '../JobDetails/JobDetailsModal';
import Footer from '../footer/Footer';

/* TEMP MOCK DATA — backend will replace this later */
const MOCK_APPLICATIONS = [
  {
    id: '1',
    jobTitle: 'Content Writer',
    jobType: 'WFH',
    jobPayment: 8000,
    jobDescription: 'Write blogs and social media posts.',
    jobOrganizerName: 'Her Hustle Team',
    appliedAt: new Date(),
  },
  {
    id: '2',
    jobTitle: 'Online Tutor',
    jobType: 'Offline',
    jobPayment: 12000,
    jobDescription: 'Teach basic maths to students.',
    jobOrganizerName: 'SkillHub',
    appliedAt: new Date(),
  }
];

export default function MyApplications() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [applications] = useState(MOCK_APPLICATIONS);
  const [selectedJob, setSelectedJob] = useState(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleViewDetails = (app) => {
    setSelectedJob({
      title: app.jobTitle,
      type: app.jobType,
      payment: app.jobPayment,
      description: app.jobDescription || 'No description available.',
      details: '',
    });
  };

  return (
    <div className="seeker-dashboard-wrapper">
      <Sidebar sidebarOpen={sidebarOpen} />

      <main className="seeker-main">
        <Navbar />

        <div className="top-bar">
          <button className="hamburger" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <h1>
            <FaCheckCircle style={{ color: '#ff3366' }} /> My Applications
          </h1>
        </div>

        <section className="applications-page-section">
          {applications.length === 0 ? (
            <div className="empty-state">
              <FaBriefcase className="empty-icon" />
              <h3>No Applications Yet</h3>
              <p>
                When you apply for jobs, they’ll appear here.
                Keep hustling!
              </p>
            </div>
          ) : (
            <div className="applications-grid">
              {applications.map((app) => (
                <div key={app.id} className="application-card">
                  <div className="application-header">
                    <h3>{app.jobTitle}</h3>
                    <span className="status-badge">
                      <FaCheckCircle /> Applied
                    </span>
                  </div>

                  <p>
                    <strong>Organizer:</strong> {app.jobOrganizerName}
                  </p>

                  <p>
                    <FaMoneyBillWave /> ₹{app.jobPayment} • {app.jobType}
                  </p>

                  <div className="date-row">
                    <FaClock className="clock-icon" />
                    <p>
                      Applied on:{' '}
                      {app.appliedAt.toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>

                  <div className="application-actions">
                    <button
                      className="view-btn"
                      onClick={() => handleViewDetails(app)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Footer />
        </section>

        {selectedJob && (
          <JobDetailsModal
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            isApplied={true}
          />
        )}
      </main>
    </div>
  );
}
