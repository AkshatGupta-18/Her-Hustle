// src/seeker/AvailableJobs.jsx
import React, { useState } from "react";
import "./AvailableJobs.css";
import JobDetailsModal from "../JobDetails/JobDetailsModal";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../navbar/Navbar";
import { FaCheckCircle } from "react-icons/fa";

/* TEMP MOCK DATA — backend/JWT will replace this later */
const MOCK_JOBS = [
  {
    id: "1",
    title: "Content Writer",
    description: "Write blogs and social media content.",
    payment: 8000,
    type: "WFH",
  },
  {
    id: "2",
    title: "Online Tutor",
    description: "Teach basic maths to school students.",
    payment: 12000,
    type: "Offline",
  },
];

export default function AvailableJobs() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobs] = useState(MOCK_JOBS);

  const [minSalary, setMinSalary] = useState("");
  const [workType, setWorkType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleApply = (job) => {
    if (appliedJobIds.includes(job.id)) return;

    setAppliedJobIds((prev) => [...prev, job.id]);
    triggerToast(`Applied for "${job.title}"`);
    setSelectedJob(null);
  };

  const filteredJobs = jobs.filter((job) => {
    const meetsSalary =
      minSalary === "" || job.payment >= Number(minSalary);
    const meetsType =
      workType === "All" || job.type === workType;
    const meetsSearch =
      searchTerm === "" ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase());

    return meetsSalary && meetsType && meetsSearch;
  });

  return (
    <div className="available-jobs-page">
      <Sidebar sidebarOpen={sidebarOpen} />

      <main className={`jobs-main ${sidebarOpen ? "shifted" : ""}`}>
        <Navbar />

        <div className="top-bar">
          <button className="hamburger" onClick={toggleSidebar}>☰</button>
          <div>
            <h1>Available Jobs</h1>
            <p className="subtext">
              Find flexible and empowering work opportunities.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-container">
          <input
            type="text"
            placeholder="Search job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <input
            type="number"
            placeholder="Minimum salary (₹)"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
          />

          <select
            value={workType}
            onChange={(e) => setWorkType(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="WFH">Work From Home</option>
            <option value="Offline">Offline</option>
          </select>
        </div>

        {/* Jobs Grid */}
        <div className="jobs-grid">
          {filteredJobs.length === 0 ? (
            <p className="no-jobs">
              No jobs found matching your criteria.
            </p>
          ) : (
            filteredJobs.map((job) => {
              const applied = appliedJobIds.includes(job.id);

              return (
                <div key={job.id} className="job-card">
                  <h3>{job.title}</h3>
                  <p>{job.description}</p>
                  <p><strong>Payment:</strong> ₹{job.payment}</p>
                  <p><strong>Type:</strong> {job.type}</p>

                  <div className="job-card-buttons">
                    <button
                      className="view-btn"
                      onClick={() => setSelectedJob(job)}
                    >
                      View Details
                    </button>

                    <button
                      className={`apply-btn ${applied ? "applied" : ""}`}
                      onClick={() => handleApply(job)}
                      disabled={applied}
                    >
                      {applied ? (
                        <>
                          <FaCheckCircle style={{ marginRight: 8 }} />
                          Applied
                        </>
                      ) : (
                        "Apply Now"
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {selectedJob && (
          <JobDetailsModal
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            onApply={handleApply}
            isApplied={appliedJobIds.includes(selectedJob.id)}
          />
        )}

        {showToast && <div className="toast">{toastMessage}</div>}
      </main>
    </div>
  );
}
