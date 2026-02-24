import { useState } from 'react';
import {
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUser,
  FaBriefcase,
  FaGraduationCap,
  FaStar,
  FaCalendar,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaDownload,
} from 'react-icons/fa';

export default function ApplicantProfile({ applicant, jobTitle, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!applicant) return null;

  // Safe property access with fallbacks
  const name = applicant?.seekerName || applicant?.name || 'Unknown Applicant';
  const email = applicant?.seekerEmail || applicant?.email || '';
  const contact = applicant?.seekerContact || applicant?.contact || applicant?.phone || '';
  const location = applicant?.seekerLocation || applicant?.location || 'Not specified';
  const skills = Array.isArray(applicant?.seekerSkills) ? applicant.seekerSkills : 
                Array.isArray(applicant?.skills) ? applicant.skills : [];
  const bio = applicant?.bio || applicant?.about || '';
  const experience = applicant?.experience || [];
  const education = applicant?.education || [];
  const portfolio = applicant?.portfolio || applicant?.website || '';
  const linkedin = applicant?.linkedin || '';
  const github = applicant?.github || '';
  const resume = applicant?.resume || '';
  const appliedAt = applicant?.appliedAt || applicant?.createdAt;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaUser },
    { id: 'experience', label: 'Experience', icon: FaBriefcase },
    { id: 'education', label: 'Education', icon: FaGraduationCap },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden relative animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-r from-pink-500 to-rose-500 p-8 pb-20">
          <button
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors z-10"
            onClick={onClose}
            aria-label="Close profile"
          >
            <FaTimes className="text-lg" />
          </button>

          {/* Profile Picture and Basic Info */}
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center text-pink-600 font-bold text-4xl shadow-xl">
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-white">
              <h1 className="text-3xl font-bold mb-2">{name}</h1>
              <div className="flex flex-wrap gap-4 text-sm opacity-90">
                {email && (
                  <div className="flex items-center gap-2">
                    <FaEnvelope />
                    <span>{email}</span>
                  </div>
                )}
                {contact && (
                  <div className="flex items-center gap-2">
                    <FaPhone />
                    <span>{contact}</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt />
                    <span>{location}</span>
                  </div>
                )}
              </div>
              {appliedAt && (
                <div className="mt-3 text-xs opacity-75 flex items-center gap-2">
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
        <div className="px-8 -mt-12 relative z-10">
          <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-wrap gap-3">
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white rounded-xl font-medium shadow-lg shadow-pink-500/30 transition-all"
              >
                <FaEnvelope />
                Email
              </a>
            )}
            {contact && (
              <a
                href={`tel:${contact}`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
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
                className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-xl font-medium transition-colors"
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
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-medium transition-colors"
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
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
              >
                <FaGlobe />
                Portfolio
              </a>
            )}
            {resume && (
              <a
                href={resume}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
              >
                <FaDownload />
                Resume
              </a>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 mt-6 border-b border-gray-200">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 font-medium rounded-t-xl transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-pink-600 border-b-2 border-pink-600'
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
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-400px)]">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Applied For */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FaBriefcase className="text-pink-600" />
                  Applied For
                </h3>
                <p className="text-lg font-bold text-gray-900">{jobTitle}</p>
              </div>

              {/* Bio/About */}
              {bio && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">About</h3>
                  <p className="text-gray-700 leading-relaxed">{bio}</p>
                </div>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-sm font-medium border border-blue-100"
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
                    className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                        <FaBriefcase />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900">{exp.title || exp.position}</h4>
                        <p className="text-pink-600 font-medium">{exp.company}</p>
                        <p className="text-sm text-gray-600 mt-1">
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
                <div className="text-center py-12">
                  <FaBriefcase className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No experience added yet</p>
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
                    className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                        <FaGraduationCap />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900">{edu.degree || edu.qualification}</h4>
                        <p className="text-blue-600 font-medium">{edu.school || edu.institution}</p>
                        <p className="text-sm text-gray-600 mt-1">
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
                <div className="text-center py-12">
                  <FaGraduationCap className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No education added yet</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <button
            className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-colors"
            onClick={onClose}
          >
            Close
          </button>
          <div className="flex gap-3">
            <button className="px-6 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-medium transition-colors">
              Reject
            </button>
            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-medium shadow-lg shadow-pink-500/30 transition-all">
              Shortlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}