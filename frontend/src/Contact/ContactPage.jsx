import { useState } from 'react';
import { FaBars, FaEnvelope, FaPhone, FaMapMarkerAlt, FaTools } from 'react-icons/fa';
import './ContactPage.css';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import Footer from '../footer/Footer';

export default function ContactPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="seeker-dashboard-wrapper">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} />

      {/* Main Content */}
      <main className="seeker-main">
        <Navbar />
        <div className="top-bar">
          <button className="hamburger" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <h1>Contact Us</h1>
        </div>

        {/* Under Construction Message */}
        <div className="under-construction">
          <FaTools className="tool-icon" />
          <h2>We’re Still Building This Page</h2>
          <p>
            Our contact page is currently under development. Soon, you’ll be able to reach us directly
            for queries, partnerships, and support. Stay tuned — great things are coming!
          </p>
        </div>

        {/* Contact Info Section (Placeholder for future content) */}
        <section className="contact-info">
          <h2><FaEnvelope /> Contact Information</h2>
          <div className="contact-grid">
            <div className="contact-card">
              <FaEnvelope className="contact-icon" />
              <h3>Email</h3>
              <p>support@herhustle.com</p>
            </div>
            <div className="contact-card">
              <FaPhone className="contact-icon" />
              <h3>Phone</h3>
              <p>+91 98765 43210</p>
            </div>
            <div className="contact-card">
              <FaMapMarkerAlt className="contact-icon" />
              <h3>Office</h3>
              <p>Mumbai, India</p>
            </div>
          </div>
        </section>

        <footer className="about-footer">
          <p>© 2025 Her Hustle | Empowering Women, One Hustle at a Time</p>
        </footer>

        <Footer />
      </main>
    </div>
  );
}
