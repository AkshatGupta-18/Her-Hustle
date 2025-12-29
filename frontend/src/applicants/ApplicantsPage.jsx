import { useState, useEffect } from "react";
import {
  FaBars,
  FaUsers,
  FaClock,
  FaEnvelope,
  FaCheckCircle,
} from "react-icons/fa";
import axios from "axios";
import "./ApplicantsPage.css";
import Navbar from "../navbar/Navbar";
import OrganizerSidebar from "../organizer-sidebar/OrganizerSidebar.jsx";
import Footer from "../footer/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ApplicantsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [error, setError] = useState("");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const organizerId = localStorage.getItem("userId");

        if (!organizerId) {
          setError("Organizer ID missing — please log in again.");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `/api/applicants?organizerId=${organizerId}`
        );

        setApplicants(res.data || []);
      } catch (err) {
        console.error("Error fetching applicants:", err);
        setError("Failed to load applicants. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  const handleViewDetails = (applicant) => setSelectedApplicant(applicant);
  const handleCloseModal = () => setSelectedApplicant(null);

  const handleContactClick = () => {
    toast.info("We’re still working on this feature!", {
      position: "top-right",
      autoClose: 3000,
      style: { background: "#ff3366", color: "#fff", fontWeight: 500 },
    });
  };

  return (
    <div className="organizer-dashboard-wrapper">
      <OrganizerSidebar sidebarOpen={sidebarOpen} />

      <main className="organizer-main">
        <Navbar />

        <div className="top-bar">
          <button className="hamburger" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <h1>
            <FaUsers style={{ color: "#ff3366" }} /> Applicants
          </h1>
        </div>

        <section className="applicants-page-section">
          {loading ? (
            <p className="loading-text">Loading applicants...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : applicants.length === 0 ? (
            <div className="empty-state">
              <FaUsers className="empty-icon" />
              <h3>No Applicants Yet</h3>
              <p>
                Once seekers apply for your jobs, their details will appear here.
              </p>
            </div>
          ) : (
            <div className="applicants-grid">
              {applicants.map((app) => (
                <div key={app._id || app.id} className="applicant-card">
                  <div className="applicant-header">
                    <h3>{app.seekerName}</h3>
                    <span className="status-badge">
                      <FaCheckCircle /> Applied
                    </span>
                  </div>

                  <p>
                    <strong>Email:</strong> {app.seekerEmail}
                  </p>
                  <p>
                    <strong>Applied For:</strong> {app.jobTitle}
                  </p>

                  {app.appliedAt && (
                    <div className="date-row">
                      <FaClock className="clock-icon" />
                      <p>
                        Applied on:{" "}
                        {new Date(app.appliedAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  )}

                  <div className="application-actions">
                    <button
                      className="view-btn"
                      onClick={() => handleViewDetails(app)}
                    >
                      Check Details
                    </button>
                    <button className="contact-btn" onClick={handleContactClick}>
                      <FaEnvelope /> Contact
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <Footer />
      </main>

      {selectedApplicant && (
        <div className="applicant-modal">
          <div className="modal-content">
            <h2>{selectedApplicant.seekerName}</h2>

            <div className="modal-details">
              <p>
                <strong>Email:</strong> {selectedApplicant.seekerEmail}
              </p>

              <p>
                <strong>Contact:</strong>{" "}
                {selectedApplicant.seekerContact || "Not provided"}
              </p>

              <p>
                <strong>Applied For:</strong> {selectedApplicant.jobTitle}
              </p>

              <p>
                <strong>Skills:</strong>{" "}
                {Array.isArray(selectedApplicant.seekerSkills)
                  ? selectedApplicant.seekerSkills.join(", ")
                  : selectedApplicant.seekerSkills || "N/A"}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {selectedApplicant.seekerLocation || "N/A"}
              </p>
            </div>

            <button className="close-btn" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
