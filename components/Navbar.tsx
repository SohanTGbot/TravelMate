import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './Button';

export const Navbar = () => {
  const { theme, toggleTheme } = useAppContext();
  const { user, signOut: logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Journal', path: '/blog' },
    { name: 'Services', path: '/services' },
    { name: 'FAQ', path: '/faq' },
  ];

  // Add My Trips for logged-in users
  if (user) {
    navLinks.push({ name: 'My Trips', path: '/my-trips' });
  }



  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${scrolled
          ? 'py-3 bg-white/70 dark:bg-charcoal-950/70 backdrop-blur-xl border-b border-white/20 dark:border-white/5 shadow-sm'
          : 'py-6 bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
              <img
                src="/travelmate-logo.png"
                alt="TravelMate"
                className="h-12 w-auto transform group-hover:scale-105 transition-all duration-300"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden xl:flex items-center space-x-1 bg-white/40 dark:bg-charcoal-800/40 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/20 dark:border-white/5 shadow-sm">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 relative overflow-hidden ${isActive
                      ? 'text-forest-900 dark:text-forest-100 bg-white dark:bg-charcoal-700 shadow-sm'
                      : 'text-charcoal-600 dark:text-sand-300 hover:text-forest-800 dark:hover:text-forest-200 hover:bg-white/50 dark:hover:bg-charcoal-700/50'
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>


            {/* Actions */}
            <div className="hidden xl:flex items-center gap-4">

              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all duration-300 ${scrolled
                  ? 'hover:bg-charcoal-100 dark:hover:bg-charcoal-800 text-charcoal-600 dark:text-sand-300'
                  : 'bg-white/20 hover:bg-white/40 text-charcoal-800 dark:text-sand-200 backdrop-blur-sm'
                  }`}
                aria-label="Toggle Theme"
              >
                {theme === 'light' ?
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                  :
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                }
              </button>

              {user ? (
                <div className="flex items-center gap-3 pl-4 border-l border-charcoal-200 dark:border-charcoal-700">
                  <Link to="/profile" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-forest-500 to-clay-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-charcoal-900 transition-transform group-hover:scale-110">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={logout} className="!text-xs">Log out</Button>
                </div>
              ) : (
                <div className="flex items-center gap-3 pl-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Log In</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" size="sm" className="shadow-lg shadow-forest-500/20">Get Started</Button>
                  </Link>
                </div>
              )}

              <Link to="/plan">
                <Button variant="primary" size="sm" className={`ml-2 transition-all duration-300 ${scrolled ? '' : 'shadow-xl shadow-forest-900/30'}`}>
                  Plan Trip
                </Button>
              </Link>

              {/* Admin Button */}
              <Link to="/admin">
                <Button variant="outline" size="sm" className="ml-2 border-charcoal-200 dark:border-white/20 text-charcoal-600 dark:text-charcoal-300 hover:bg-charcoal-100 dark:hover:bg-white/10">
                  Admin Panel
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="xl:hidden flex items-center gap-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-xl bg-white/50 dark:bg-charcoal-800/50 backdrop-blur-md text-charcoal-800 dark:text-sand-100"
                aria-label={isMenuOpen ? "Close main menu" : "Open main menu"}
              >
                {isMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-charcoal-900/50 backdrop-blur-sm transition-opacity duration-300 xl:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 z-[70] w-4/5 max-w-sm h-full bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-out transform xl:hidden border-l border-white/20 dark:border-white/5 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="p-6 flex justify-between items-center border-b border-sand-200 dark:border-charcoal-800">
            <span className="text-xl font-display font-bold text-charcoal-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-8 bg-forest-500 rounded-full"></span>
              Menu
            </span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2.5 rounded-full hover:bg-sand-100 dark:hover:bg-charcoal-800 text-charcoal-500 dark:text-sand-400 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 flex-grow flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center justify-between px-5 py-3.5 rounded-2xl text-lg font-medium transition-all group ${location.pathname === link.path
                  ? 'bg-forest-50 dark:bg-forest-900/20 text-forest-700 dark:text-forest-200 shadow-sm border border-forest-100 dark:border-forest-900/30'
                  : 'text-charcoal-600 dark:text-sand-300 hover:bg-sand-50 dark:hover:bg-charcoal-800 hover:pl-6'
                  }`}
              >
                {link.name}
                {location.pathname === link.path && <span className="w-1.5 h-1.5 rounded-full bg-forest-500"></span>}
              </Link>
            ))}

            <div className="my-6 border-t border-dashed border-sand-300 dark:border-charcoal-700 mx-2"></div>

            {/* Plan Trip CTA for Mobile */}
            <Link
              to="/plan"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-forest-600 to-forest-500 shadow-lg shadow-forest-500/20 hover:scale-[1.02] transition-all"
            >
              <span>✨</span>
              Plan a Trip
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-charcoal-600 dark:text-sand-200 border border-sand-200 dark:border-charcoal-700 hover:bg-sand-50 dark:hover:bg-charcoal-800 transition-all"
              >
                🛡️ Admin Panel
              </Link>
            )}

            <div className="mt-auto pt-6">
              {!user ? (
                <div className="space-y-3 bg-sand-50 dark:bg-charcoal-800/50 p-4 rounded-2xl border border-sand-100 dark:border-charcoal-700">
                  <div className="text-center mb-2 text-sm text-charcoal-500 dark:text-charcoal-400">Join the community</div>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block">
                    <Button variant="outline" className="w-full justify-center bg-white dark:bg-charcoal-800">Log In</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block">
                    <Button variant="primary" className="w-full justify-center shadow-md">Sign Up Free</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 bg-sand-50 dark:bg-charcoal-800/50 p-5 rounded-3xl border border-sand-100 dark:border-charcoal-700">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-forest-500 to-teal-400 text-white flex items-center justify-center text-lg font-bold shadow-md">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name || 'User'} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        (user.name?.charAt(0) || 'U')
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-charcoal-900 dark:text-white truncate text-lg">{user.name || 'Traveler'}</div>
                      <div className="text-xs text-charcoal-500 dark:text-charcoal-400 truncate opacity-80">{user.email}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-center text-xs h-10 border-sand-200 dark:border-charcoal-600 bg-white dark:bg-charcoal-800">Profile</Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-center text-xs h-10 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600"
                      onClick={() => { logout(); setIsMenuOpen(false); }}
                    >
                      Log Out
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center px-2 py-4 mt-2">
              <span className="text-xs font-bold text-charcoal-400 uppercase tracking-widest">Theme</span>
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-8 w-14 items-center rounded-full bg-sand-200 dark:bg-charcoal-700 transition-colors focus:outline-none"
              >
                <span className={`${theme === 'light' ? 'translate-x-1' : 'translate-x-7'} inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform duration-200 flex items-center justify-center text-[10px]`}>
                  {theme === 'light' ? '☀️' : '🌙'}
                </span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};