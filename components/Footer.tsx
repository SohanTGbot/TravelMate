import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') { // Unique violation
          setStatus('success'); // Treat duplicate as success to avoid leaking info
        } else {
          throw error;
        }
      } else {
        setStatus('success');
      }
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Newsletter error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-stone-900 via-charcoal-900 to-stone-950 text-stone-300 overflow-hidden border-t border-emerald-900/30">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-600 rounded-full blur-[120px]"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">

          {/* Brand Column - Spans 4 columns */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-block group">
              <img
                src="/travelmate-logo.png"
                alt="TravelMate"
                className="h-16 w-auto transform group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <p className="text-stone-400 leading-relaxed text-base pr-4">
              AI-powered travel planning reimagined. Discover the world with personalized itineraries,
              smart budget tracking, and curated local insights.
            </p>

            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              {[
                {
                  name: 'Twitter',
                  url: 'https://x.com/travelmate26?s=11',
                  color: 'hover:bg-black hover:text-white hover:border-black',
                  path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                },
                {
                  name: 'Instagram',
                  url: 'https://www.instagram.com/travelmate317?igsh=b3RoaWVhY2w5MXhz',
                  color: 'hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500 hover:text-white hover:border-transparent',
                  path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                },
                {
                  name: 'Facebook',
                  url: 'https://www.facebook.com/share/1ALo1WHtbq/?mibextid=wwXIfr',
                  color: 'hover:bg-blue-600 hover:text-white hover:border-blue-600',
                  path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                },
                {
                  name: 'LinkedIn',
                  url: '#',
                  color: 'hover:bg-blue-700 hover:text-white hover:border-blue-700',
                  path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-xl bg-stone-800/50 flex items-center justify-center text-stone-400 transition-all duration-300 border border-stone-700/50 ${social.color} hover:shadow-lg hover:-translate-y-1`}
                  aria-label={social.name}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Group - Spans 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-white font-bold text-lg border-b border-emerald-500/30 pb-2 inline-block">Explore</h4>
            <ul className="space-y-4">
              {[
                { name: 'Plan Your Trip', path: '/plan' },
                { name: 'Community', path: '/community' },
                { name: 'Destinations', path: '/' },
                { name: 'Travel Blog', path: '/blog' },
                { name: 'Reviews', path: '/reviews' }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-stone-400 hover:text-emerald-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-700 group-hover:bg-emerald-500 transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links - Spans 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-white font-bold text-lg border-b border-emerald-500/30 pb-2 inline-block">Company</h4>
            <ul className="space-y-4">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
                { name: 'Careers', path: '/careers' },
                { name: 'Admin Panel', path: '/admin' },
                { name: 'Help Center', path: '/faq' }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-stone-400 hover:text-emerald-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-700 group-hover:bg-emerald-500 transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter - Spans 4 columns */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-stone-800 to-stone-900 border border-stone-700/50 shadow-xl">
              <h4 className="text-white font-bold text-lg mb-2">Stay Inspired</h4>
              <p className="text-stone-400 text-sm mb-4">
                Join 50,000+ travelers. Get personalized trip ideas, deal alerts, and travel tips weekly.
              </p>

              {status === 'success' ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center animate-fade-in">
                  <div className="text-emerald-400 font-bold mb-1">You're on the list! 🎉</div>
                  <p className="text-emerald-400/80 text-xs">Keep an eye on your inbox for travel magic.</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full bg-stone-900/80 border border-stone-600 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      required
                      disabled={status === 'loading'}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <span>Subscribe Free</span>
                        <span>✨</span>
                      </>
                    )}
                  </button>
                  {status === 'error' && (
                    <p className="text-red-400 text-xs text-center">Something went wrong. Please try again.</p>
                  )}
                </form>
              )}

              <p className="text-xs text-stone-500 mt-4 text-center">
                No spam ever. Unsubscribe anytime.
              </p>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 text-xs justify-end pr-2 opacity-60">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-stone-400">Systems Operational</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-stone-500 text-sm">
              © {new Date().getFullYear()} <span className="text-stone-300">TravelMate Inc.</span> All rights reserved.
            </div>

            <div className="flex items-center gap-8 text-sm">
              <Link to="/privacy" className="text-stone-500 hover:text-emerald-400 transition-colors">Privacy</Link>
              <Link to="/terms" className="text-stone-500 hover:text-emerald-400 transition-colors">Terms</Link>
              <Link to="/cookies" className="text-stone-500 hover:text-emerald-400 transition-colors">Cookies</Link>
              <Link to="/sitemap" className="text-stone-500 hover:text-emerald-400 transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
