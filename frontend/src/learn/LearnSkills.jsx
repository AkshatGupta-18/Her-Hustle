import { useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import './LearnSkills.css';
import { FaSearch } from 'react-icons/fa';

const videosData = [
  { id: 1, title: 'Introduction to Freelancing', url: 'https://www.youtube.com/embed/XCHP-qtdLps', topic: 'Freelancing' },
  { id: 2, title: 'Digital Marketing Basics', url: 'https://www.youtube.com/embed/RNh8VHc8qkk', topic: 'Digital Marketing' },
  { id: 3, title: 'Graphic Design for Beginners', url: 'https://www.youtube.com/embed/YqQx75OPRa0', topic: 'Graphic Design' },
  { id: 4, title: 'Python Programming Basics', url: 'https://www.youtube.com/embed/_uQrJ0TkZlc', topic: 'Programming' },
  { id: 5, title: 'Time Management Tips', url: 'https://www.youtube.com/embed/tIMU2cK2dQk', topic: 'Productivity' },
  { id: 6, title: 'HTML & CSS Crash Course', url: 'https://www.youtube.com/embed/qz0aGYrrlhU', topic: 'Web Development' },
  { id: 7, title: 'JavaScript for Beginners', url: 'https://www.youtube.com/embed/W6NZfCO5SIk', topic: 'Programming' },
  { id: 8, title: 'UI/UX Design Fundamentals', url: 'https://www.youtube.com/embed/3tqK19cHqQk', topic: 'Design' },
  { id: 9, title: 'Social Media Marketing 101', url: 'https://www.youtube.com/embed/3qF4YpYxhRQ', topic: 'Digital Marketing' },
  { id: 10, title: 'Excel Tips & Tricks', url: 'https://www.youtube.com/embed/rwbho0CgEAE', topic: 'Productivity' },
  { id: 11, title: 'React JS Crash Course', url: 'https://www.youtube.com/embed/w7ejDZ8SWv8', topic: 'Programming' },
  { id: 12, title: 'Photoshop Basics', url: 'https://www.youtube.com/embed/IaQ6e1fO7vY', topic: 'Graphic Design' },
  { id: 13, title: 'Freelancing on Upwork', url: 'https://www.youtube.com/embed/XaQg3_2iH9s', topic: 'Freelancing' },
  { id: 14, title: 'Effective Communication Skills', url: 'https://www.youtube.com/embed/2b4wzv3rG2o', topic: 'Soft Skills' },
  { id: 15, title: 'Advanced Excel Formulas', url: 'https://www.youtube.com/embed/dQyJFV7cZyM', topic: 'Productivity' },
  { id: 16, title: 'How to Use Zoom App', url: 'https://www.youtube.com/embed/Hh7X3bc5gck', topic: 'Online Tools' },
  { id: 17, title: 'Intermediate Python Projects', url: 'https://www.youtube.com/embed/kqtD5dpn9C8', topic: 'Programming' },
  { id: 18, title: 'Advanced Digital Marketing Strategies', url: 'https://www.youtube.com/embed/DJm4xWqumJ4', topic: 'Digital Marketing' },
  { id: 19, title: 'Teaching Basics: How to Tutor Online', url: 'https://www.youtube.com/embed/2gTshcx5KDM', topic: 'Education' },
  { id: 20, title: 'Advanced Graphic Design Techniques', url: 'https://www.youtube.com/embed/1VIdksz0t7s', topic: 'Graphic Design' }
];

export default function LearnSkills() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const categories = ['All', ...new Set(videosData.map(video => video.topic))];

  const filteredVideos = videosData.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || video.topic === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="learn-page-wrapper">
      <Sidebar sidebarOpen={sidebarOpen} />
      <main className={`learn-main ${sidebarOpen ? 'shifted' : ''}`}>
        <div className="top-bar">
          <button className="hamburger" onClick={toggleSidebar}>☰</button>
          <h1>Learn Skills</h1>
        </div>

        {/* Search & Filter Section */}
        <div className="filter-section">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="dropdown-wrapper">
            <select
              className="category-dropdown"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Video List */}
        {filteredVideos.length === 0 ? (
          <p className="no-results">No results found.</p>
        ) : (
          <div className="video-grid">
            {filteredVideos.map(video => (
              <div key={video.id} className="video-card">
                <iframe src={video.url} title={video.title} allowFullScreen></iframe>
                <h3>{video.title}</h3>
                <p className="video-topic">{video.topic}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
