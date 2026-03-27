// src/Dashboard.jsx
import {
  FaChevronDown,
  FaChevronUp,
  FaFemale,
  FaHome,
  FaChalkboard,
  FaBriefcase as FaBriefcaseStep,
  FaMoneyBillWave,
} from 'react-icons/fa';
import { GiTeacher, GiMoneyStack } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import HeroImage from '../assets/images/home-page.png';
import Card1 from '../assets/images/card1.png';
import Card2 from '../assets/images/card2.png';
import Card3 from '../assets/images/card3.png';

// FAQ data
const faqData = [
  {
    question: "Is it safe to apply for jobs here?",
    answer:
      "Yes! All jobs listed on Her Hustle are curated and verified to ensure a safe experience for women.",
  },
  {
    question: "Do I need prior experience?",
    answer:
      "No prior experience is required. You can start learning from our courses and then apply for suitable jobs.",
  },
  {
    question: "Can I work remotely?",
    answer:
      "Yes! We have a wide range of online and offline job opportunities tailored to your preferences.",
  },
  {
    question: "Is there a fee to join?",
    answer:
      "Joining Her Hustle and accessing basic courses is completely free. Some premium courses may have a cost.",
  },
];

// FAQ Item
function FAQItem({ question, answer, id }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border rounded-lg overflow-hidden transition ${open ? 'shadow-md' : 'shadow-sm'}`}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <span className={`w-1.5 h-6 rounded ${open ? 'bg-pink-500' : 'bg-gray-200'}`}></span>
          <span className="text-gray-800 font-medium">{question}</span>
        </div>
        <span className={`text-gray-500 transform transition-transform duration-200 ${open ? 'rotate-180 text-pink-500' : ''}`}>
          {open ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </button>

      <div className={`px-6 pb-4 overflow-hidden transition-all duration-300 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-gray-600 text-sm">{answer}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">Her Hustle</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl">
                Learn the skills, find safe opportunities, and earn with confidence — all in a supportive community designed for women.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3">
                <Link to="/register">
                  <button className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-gradient-to-r from-pink-600 to-indigo-600 text-white font-semibold shadow-lg hover:opacity-95 transition">
                    Get Started
                  </button>
                </Link>
                <Link to="/available">
                  <button className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-gray-200 bg-white text-gray-700 font-medium shadow-sm hover:shadow-md transition">
                    Explore Jobs
                  </button>
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md">
                <div className="flex flex-col bg-white/60 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                  <span className="text-2xl font-extrabold text-gray-900">1.2k+</span>
                  <span className="text-sm text-gray-500">Learners</span>
                </div>
                <div className="flex flex-col bg-white/60 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                  <span className="text-2xl font-extrabold text-gray-900">500+</span>
                  <span className="text-sm text-gray-500">Jobs</span>
                </div>
                <div className="flex flex-col bg-white/60 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                  <span className="text-2xl font-extrabold text-gray-900">300+</span>
                  <span className="text-sm text-gray-500">Community</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-0.5 bg-gradient-to-tr from-pink-300 to-indigo-200 rounded-2xl blur-md opacity-60 transform -translate-y-2"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                  <img src={HeroImage} alt="Women collaborating" className="w-full h-64 sm:h-80 object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-16">
        {/* Feature cards */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Why choose Her Hustle</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <article className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transform transition duration-300 hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-pink-500 to-indigo-500 flex items-center justify-center text-white text-2xl shadow-md">
                    <FaFemale className="w-6 h-6" aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Safe & Inclusive</h4>
                  <p className="text-sm text-gray-500 mt-1">A platform that prioritizes safety and empowerment.</p>
                  <div className="mt-4 text-sm font-medium text-pink-600 opacity-0 group-hover:opacity-100 transition">Learn more →</div>
                </div>
              </div>
            </article>

            <article className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transform transition duration-300 hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl shadow-md">
                    <GiMoneyStack className="w-6 h-6" aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Earn Securely</h4>
                  <p className="text-sm text-gray-500 mt-1">Monetize your skills with vetted opportunities and fair pay.</p>
                  <div className="mt-4 text-sm font-medium text-green-600 opacity-0 group-hover:opacity-100 transition">See payouts →</div>
                </div>
              </div>
            </article>

            <article className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transform transition duration-300 hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-700 flex items-center justify-center text-white text-2xl shadow-md">
                    <FaChalkboard className="w-6 h-6" aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Practical Learning</h4>
                  <p className="text-sm text-gray-500 mt-1">Short, hands-on courses and mentor feedback to build real skills.</p>
                  <div className="mt-4 text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition">Browse courses →</div>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Featured Courses</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[{
              title: 'Frontend Foundations',
              desc: 'HTML, CSS, Tailwind & React basics',
              level: 'Beginner'
            },{
              title: 'Freelance Basics',
              desc: 'Finding clients & building your brand',
              level: 'All Levels'
            },{
              title: 'Data Skills',
              desc: 'Spreadsheets, analysis & visualization',
              level: 'Intermediate'
            }].map((c, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{c.title}</h3>
                    <p className="text-sm text-gray-500">{c.desc}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{c.level}</span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button className="px-3 py-2 rounded-md bg-pink-600 text-white text-sm">Enroll</button>
                  <Link to="/register" className="text-sm text-gray-600 hover:underline">Sign up</Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Jobs */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Top Jobs</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[{
              title: 'Remote Content Writer',
              location: 'Remote',
              pay: '$15/hr'
            },{
              title: 'Social Media Manager',
              location: 'Remote or Hybrid',
              pay: '$18/hr'
            }].map((j, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{j.title}</h4>
                  <p className="text-sm text-gray-500">{j.location} • <span className="font-medium text-gray-700">{j.pay}</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <Link to="/available" className="px-3 py-2 rounded-md bg-white border border-gray-200 text-gray-700 text-sm hover:shadow">View</Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-center mb-6">How Her Hustle Works</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { img: Card1, title: 'Learn Skills', text: 'Take short, practical courses.' },
              { img: Card2, title: 'Find Jobs', text: 'Apply to vetted job listings.' },
              { img: Card3, title: 'Earn Safely', text: 'Receive fair compensation.' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-5 p-8 rounded-lg hover:shadow-2xl transition bg-white">
                <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md bg-white flex items-center justify-center">
                  <img src={s.img} alt={s.title} className="w-full h-full object-cover object-center" />
                </div>
                <h3 className="mt-3 text-lg font-semibold text-center">{s.title}</h3>
                <p className="text-sm text-gray-500 text-center max-w-[22rem]">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-5 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqData.map((item, i) => (
              <FAQItem key={i} id={i} {...item} />
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">What learners say</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[{
              name: 'Amina',
              quote: 'The courses helped me get my first freelancing clients!'
            },{
              name: 'Nadia',
              quote: 'Supportive mentors and practical projects.'
            },{
              name: 'Sara',
              quote: 'Great community — I feel more confident applying to jobs.'
            }].map((t, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm">
                <p className="text-sm text-gray-700">“{t.quote}”</p>
                <div className="mt-4 text-sm font-medium text-gray-900">{t.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="bg-pink-50 rounded-xl p-6 mb-8">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-lg font-semibold">Stay updated</h3>
            <p className="text-sm text-gray-600">Sign up to get job alerts and new course launches.</p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <input aria-label="Email" type="email" placeholder="Your email" className="px-4 py-2 rounded-md border border-gray-200 w-full sm:w-auto" />
              <button className="px-4 py-2 rounded-md bg-pink-600 text-white font-semibold">Subscribe</button>
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Trusted by</h2>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="h-10 w-28 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">Partner A</div>
            <div className="h-10 w-28 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">Partner B</div>
            <div className="h-10 w-28 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">Partner C</div>
            <div className="h-10 w-28 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">Partner D</div>
          </div>
        </section>

        {/* Community */}
        <section className="bg-white rounded-xl p-6 shadow-sm text-center">
          <div className="flex items-center gap-4 justify-center mb-4">
            <FaHome className="text-4xl text-pink-500" />
            <h2 className="text-xl font-semibold">Safe & Supportive Community</h2>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto">Join a community of like-minded women — share, learn, and grow together.</p>
        </section>
      </main>

      <Footer />

    </div>
  );
}