import { useState } from 'react';
import { FaBars, FaBullseye, FaHeart, FaUsers, FaShieldAlt, FaBriefcase } from 'react-icons/fa';
import './AboutPage.css';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import Footer from '../footer/Footer';

export default function AboutPage({ userName = 'Job Seeker' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="seeker-dashboard-wrapper">
      <Sidebar sidebarOpen={sidebarOpen} />

      <main className="seeker-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Navbar />
          <div className="top-bar">
          <button className="hamburger" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <h1>About</h1>
        </div>

        {/* About Section */}
        <section className="about-section">
          <h2><FaHeart /> Who We Are</h2>
          <p>
            <strong>Her Hustle</strong> is a women-focused freelance platform dedicated to connecting 
            skilled women with genuine work opportunities — online and offline — while ensuring 
            safety, trust, and respect at every step. We aim to create a secure ecosystem where women 
            can work independently, learn, and grow without fear.
          </p>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <h2><FaBullseye /> Our Mission</h2>
          <p>
            Our mission is to empower women through financial independence by helping them find 
            verified freelance jobs and skill-building opportunities. We’re here to close the gap 
            between women and safe, meaningful work. Every project and every job on Her Hustle is 
            designed to uplift women — emotionally, socially, and economically.
          </p>
        </section>

        {/* Seeker Role Section */}
        <section className="role-section">
          <h2><FaUsers /> The Seeker’s Role</h2>
          <div className="role-grid">
            <div className="role-card">
              <h3>Discover Work</h3>
              <p>
                Find trusted freelance jobs verified by our platform to ensure your security 
                and fair treatment. You focus on your craft — we ensure your safety.
              </p>
            </div>
            <div className="role-card">
              <h3>Build Skills</h3>
              <p>
                Learn through curated content and workshops to help you enhance your professional 
                value and open more opportunities.
              </p>
            </div>
            <div className="role-card">
              <h3>Grow Together</h3>
              <p>
                Join a thriving network of women freelancers supporting each other, 
                sharing experiences, and building a strong, safe community.
              </p>
            </div>
          </div>
        </section>

        {/* Organizer Role Section */}
        <section className="role-section organizer-role">
          <h2><FaBriefcase /> The Organizer’s Role</h2>
          <div className="role-grid">
            <div className="role-card">
              <h3>Post Opportunities</h3>
              <p>
                Organizations and clients can easily post freelance opportunities for women across 
                different domains — ensuring equal access and visibility.
              </p>
            </div>
            <div className="role-card">
              <h3>Connect with Talent</h3>
              <p>
                Find skilled, verified women professionals ready to contribute with quality and 
                dedication. Build your team with confidence.
              </p>
            </div>
            <div className="role-card">
              <h3>Empower Responsibly</h3>
              <p>
                As an organizer, you play a crucial role in creating a culture of respect, safety, 
                and empowerment for women in every project you post or manage.
              </p>
            </div>
          </div>
        </section>

        {/* Safety Commitment */}
        <section className="safety-section">
          <h2><FaShieldAlt /> Our Commitment to Safety</h2>
          <p>
            Every organization and job listing on Her Hustle undergoes strict authenticity 
            checks. We are deeply committed to maintaining transparency, protecting your 
            personal data, and ensuring you feel secure while working or applying.
          </p>
        </section>

        {/* Vision Section */}
        <section className="vision-section">
          <h2>Our Vision</h2>
          <p>
            To become the most trusted women-led professional community that reshapes the future 
            of freelance work — where safety, equality, and growth go hand in hand.
          </p>
        </section>

        <footer className="about-footer">
          <p>© 2025 Her Hustle | Empowering Women, One Hustle at a Time</p>
        </footer>
        <Footer />
        </div>
      </main>
    </div>
  );
}
