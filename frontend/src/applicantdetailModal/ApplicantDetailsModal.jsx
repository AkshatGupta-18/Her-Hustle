import { useState } from 'react';
import { FaTimes, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser, FaBriefcase, FaGraduationCap, FaCalendar, FaLinkedin, FaGithub, FaGlobe, FaDownload, FaFileAlt } from 'react-icons/fa';

export default function ApplicantDetailsModal({ applicant, jobTitle, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!applicant) return null;

  // Safe property access with fallbacks
  const name = applicant?.name || applicant?.seekerName || 'Unknown Applicant';
  const email = applicant?.email || applicant?.seekerEmail || '';
  const contact = applicant?.contact || applicant?.seekerContact || applicant?.phone || '';
  const location = applicant?.location || applicant?.seekerLocation || 'Not specified';
  const skills = Array.isArray(applicant?.skills) ? applicant.skills : 
                Array.isArray(applicant?.seekerSkills) ? applicant.seekerSkills : [];
  const bio = applicant?.bio || applicant?.about || '';
  const experience = applicant?.experience || [];
  const education = applicant?.education || [];
  const portfolio = applicant?.portfolio || applicant?.website || '';
  const linkedin = applicant?.linkedin || '';
  const github = applicant?.github || '';
  const resumeUrl = applicant?.resumeUrl || applicant?.resume || '';
  const appliedAt = applicant?.appliedAt || applicant?.createdAt;
  const avatarUrl = applicant?.avatarUrl || '';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaUser },
    { id: 'experience', label: 'Experience', icon: FaBriefcase },
    { id: 'education', label: 'Education', icon: FaGraduationCap },
  ];

  const initials = name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl my-8 relative animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 p-8 pb-24 rounded-t-3xl">
          <button
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110"
            onClick={onClose}
            aria-label="Close profile"
          >
            <FaTimes className="text-lg" />
          </button>

          {/* Profile Picture and Basic Info */}
          <div className="flex items-start gap-6">
            <div className="w-28 h-28 rounded-2xl bg-white shadow-xl overflow-hidden flex-shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-pink-600 font-bold text-4xl">
                  {initials}
                </div>
              )}
            </div>
            <div className="flex-1 text-white">
              <h1 className="text-4xl font-bold mb-3">{name}</h1>
              <div className="flex flex-wrap gap-4 text-sm opacity-90">
                {email && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <FaEnvelope />
                    <span>{email}</span>
                  </div>
                )}
                {contact && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <FaPhone />
                    <span>{contact}</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <FaMapMarkerAlt />
                    <span>{location}</span>
                  </div>
                )}
              </div>
              {appliedAt && (
                <div className="mt-4 text-xs opacity-80 flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg inline-flex">
                  <FaCalendar />
                  Applied on {new Date(appliedAt).toLocaleDateString('en-IN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="px-8 -mt-16 relative z-10 mb-6">
          <div className="bg-white rounded-2xl shadow-xl p-5 flex flex-wrap gap-3">
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white rounded-xl font-semibold shadow-lg shadow-pink-500/30 transition-all hover:scale-105"
              >
                <FaEnvelope />
                Email
              </a>
            )}
            {contact && (
              <a
                href={`tel:${contact}`}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md transition-all hover:scale-105"
              >
                <FaPhone />
                Call
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-xl font-semibold shadow-md transition-all hover:scale-105"
              >
                <FaLinkedin />
                LinkedIn
              </a>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-semibold shadow-md transition-all hover:scale-105"
              >
                <FaGithub />
                GitHub
              </a>
            )}
            {portfolio && (
              <a
                href={portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold shadow-md transition-all hover:scale-105"
              >
                <FaGlobe />
                Portfolio
              </a>
            )}
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-md transition-all hover:scale-105"
              >
                <FaDownload />
                Resume
              </a>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 border-b border-gray-200">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-t-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-b from-pink-50 to-white text-pink-600 border-b-2 border-pink-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="text-sm" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 overflow-y-auto max-h-[50vh]">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Applied For */}
              <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 rounded-2xl p-6 border-2 border-pink-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaBriefcase className="text-pink-600" />
                  Applied For
                </h3>
                <p className="text-xl font-bold text-gray-900">{jobTitle || 'Position'}</p>
              </div>

              {/* Bio/About */}
              {bio && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FaUser className="text-gray-600" />
                    About
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{bio}</p>
                </div>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaFileAlt className="text-gray-600" />
                    Skills & Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-sm font-semibold border border-blue-200 hover:border-blue-300 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              {experience.length > 0 ? (
                experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md">
                        <FaBriefcase className="text-xl" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900">{exp.title || exp.position}</h4>
                        <p className="text-pink-600 font-semibold text-lg">{exp.company}</p>
                        <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                          <FaCalendar className="text-gray-400" />
                          {exp.startDate} - {exp.endDate || 'Present'}
                          {exp.location && ` • ${exp.location}`}
                        </p>
                        {exp.description && (
                          <p className="text-gray-700 mt-3 leading-relaxed">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-2xl">
                  <FaBriefcase className="text-5xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">No experience added yet</p>
                </div>
              )}
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div className="space-y-4">
              {education.length > 0 ? (
                education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md">
                        <FaGraduationCap className="text-xl" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900">{edu.degree || edu.qualification}</h4>
                        <p className="text-blue-600 font-semibold text-lg">{edu.school || edu.institution}</p>
                        <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                          <FaCalendar className="text-gray-400" />
                          {edu.startYear || edu.year} - {edu.endYear || 'Present'}
                          {edu.grade && ` • ${edu.grade}`}
                        </p>
                        {edu.description && (
                          <p className="text-gray-700 mt-3 leading-relaxed">{edu.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-2xl">
                  <FaGraduationCap className="text-5xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">No education added yet</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-pink-50 flex justify-between items-center rounded-b-3xl">
          <button
            className="px-6 py-3 rounded-xl bg-white hover:bg-gray-100 text-gray-700 font-semibold border-2 border-gray-200 transition-all hover:scale-105"
            onClick={onClose}
          >
            Close
          </button>
          <div className="flex gap-3">
            <button className="px-6 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold border-2 border-red-200 transition-all hover:scale-105">
              Reject
            </button>
            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-semibold shadow-lg shadow-pink-500/30 transition-all hover:scale-105">
              Shortlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}