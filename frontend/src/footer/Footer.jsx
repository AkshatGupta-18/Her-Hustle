import { FaFacebookF, FaInstagram, FaLinkedinIn, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-pink-600 to-pink-500 text-white mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl font-extrabold tracking-wider">Her Hustle</h2>
            <p className="mt-3 text-pink-100 max-w-md">Empowering women to learn, grow, and earn safely.</p>

            <div className="mt-6 flex gap-3">
              <a href="#" aria-label="Facebook" className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-shadow shadow-sm"><FaFacebookF /></a>
              <a href="#" aria-label="Instagram" className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-shadow shadow-sm"><FaInstagram /></a>
              <a href="#" aria-label="LinkedIn" className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-shadow shadow-sm"><FaLinkedinIn /></a>
              <a href="mailto:herhustle@example.com" aria-label="Email" className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-shadow shadow-sm"><FaEnvelope /></a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-pink-100">Quick Links</h3>
              <ul className="mt-3 space-y-2">
                <li><Link to="/" className="text-white/90 hover:text-white transition">Home</Link></li>
                <li><Link to="#learn" className="text-white/90 hover:text-white transition">Learn</Link></li>
                <li><Link to="#earn" className="text-white/90 hover:text-white transition">Earn</Link></li>
                <li><Link to="/register" className="text-white/90 hover:text-white transition">Register/Login</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-pink-100">Get In Touch</h3>
              <p className="mt-3 text-white/90">Have questions? Email us at <a href="mailto:herhustle@example.com" className="underline">herhustle@example.com</a></p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/20 pt-6 text-sm text-white/80 text-center">
          © 2025 Her Hustle. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
