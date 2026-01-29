import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/Button';
import { Blog, Destination } from '../types';

import { SEO } from '../components/SEO';
import { HowItWorks } from '../components/HowItWorks';

export const Home = () => {
  // ... existing hooks ...
  const navigate = useNavigate();
  const { destinations, reviews, faqs, blogs, services, sendMessage } = useAppContext();

  // ... existing states ...
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [destFilter, setDestFilter] = useState<'All' | 'Beach' | 'Mountain' | 'City' | 'Desert' | 'Culture'>('All');
  const [currentReview, setCurrentReview] = useState(0);

  // ... effects ...
  // Auto-slide testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const handleContactSubmit = (e: React.FormEvent) => {
    // ... same logic ...
    e.preventDefault();
    sendMessage({
      id: Date.now().toString(),
      name: contactName,
      email: contactEmail,
      message: contactMsg,
      date: new Date().toISOString(),
      read: false
    });
    setContactName('');
    setContactEmail('');
    setContactMsg('');
    setContactSuccess(true);
    setTimeout(() => setContactSuccess(false), 5000);
  };

  const filteredDestinations = destFilter === 'All'
    ? destinations
    : destinations.filter(d => d.category === destFilter);

  const featuredBlog = blogs.find(b => b.featured) || blogs[0];
  const otherBlogs = blogs.filter(b => b.id !== featuredBlog?.id);

  const scrollToDestinations = () => {
    document.getElementById('popular-destinations')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Home"
        description="Plan your perfect trip with TravelMate AI. Discover curated destinations, personalized itineraries, and expert travel guides."
      />

      {/* ----------------- IMMERSIVE HERO SECTION ----------------- */}
      <section className="relative h-screen min-h-[600px] md:min-h-[800px] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 select-none">
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Travel Hero"
            className="w-full h-full object-cover animate-scale-in scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/60 via-charcoal-900/30 to-sand-50 dark:to-charcoal-950 transition-colors duration-500"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 flex flex-col items-center text-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-8 shadow-lg">
              <span className="flex items-center justify-center h-2 w-2 rounded-full bg-forest-400 animate-pulse"></span>
              <span className="text-sand-100 text-xs font-bold tracking-widest uppercase font-sans">Gemini AI Engine v2.0</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-white mb-6 font-display tracking-tight leading-none drop-shadow-sm">
              Explore the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-300 via-sand-200 to-clay-300">Uncharted.</span>
            </h1>

            <p className="text-lg md:text-2xl text-sand-100 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Experience the world's most intelligent travel planner.
              <br className="hidden md:block" />
              Hyper-personalized itineraries crafted in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Button
                variant="primary"
                size="lg"
                className="!bg-white !text-forest-900 hover:!bg-sand-100 !px-10 !py-5 !text-lg !rounded-full shadow-2xl shadow-white/10 transition-transform hover:-translate-y-1"
                onClick={() => navigate('/plan')}
              >
                <span className="mr-2">✨</span> Start Planning
              </Button>
              <button
                onClick={scrollToDestinations}
                className="px-8 py-5 rounded-full font-semibold text-white border border-white/20 hover:bg-white/10 backdrop-blur-md transition-all flex items-center gap-2 group"
              >
                Explore Destinations
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Glass Cards Decoration */}
        <div className="absolute bottom-10 w-full px-4 overflow-hidden pointer-events-none hidden md:block">
          <div className="max-w-7xl mx-auto relative h-20">
            <div className="absolute right-0 bottom-10 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-float">
              <div className="w-12 h-12 rounded-xl bg-forest-500/80 flex items-center justify-center text-2xl">🗻</div>
              <div className="text-left">
                <p className="text-white font-bold text-sm">Kyoto, Japan</p>
                <p className="text-forest-200 text-xs">Trending now</p>
              </div>
            </div>
            <div className="absolute left-0 bottom-20 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-float-delayed">
              <div className="w-12 h-12 rounded-xl bg-clay-500/80 flex items-center justify-center text-2xl">🏜️</div>
              <div className="text-left">
                <p className="text-white font-bold text-sm">Petra, Jordan</p>
                <p className="text-clay-200 text-xs">Adventure awaiting</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- HOW IT WORKS ----------------- */}
      <HowItWorks />

      {/* ----------------- FEATURES GRID ----------------- */}
      <section className="py-32 bg-sand-50 dark:bg-charcoal-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-forest-600 dark:text-forest-400 font-bold tracking-widest uppercase text-sm mb-4">Intelligent Design</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-charcoal-900 dark:text-white mb-6 font-display">
              Travel planning, <span className="italic font-serif text-clay-600 dark:text-clay-400">reimagined</span>.
            </h3>
            <p className="text-charcoal-600 dark:text-sand-300 text-lg leading-relaxed">
              We combine granular data points with generative AI to solve the complexity of modern travel logistics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((s, idx) => (
              <div key={s.id} className="group relative bg-white dark:bg-charcoal-900 p-8 rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-forest-900/5 dark:hover:shadow-black/50 transition-all duration-500 border border-sand-200 dark:border-charcoal-800 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity duration-500 transform translate-x-4 -translate-y-4">
                  <div className="text-9xl text-forest-900 dark:text-forest-100">{s.icon}</div>
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-forest-50 dark:bg-forest-900/30 rounded-2xl flex items-center justify-center text-3xl mb-8 text-forest-700 dark:text-forest-300 group-hover:scale-110 transition-transform duration-500">
                    {s.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-4">{s.title}</h3>
                  <p className="text-charcoal-600 dark:text-charcoal-400 mb-6 leading-relaxed text-sm">{s.description}</p>
                  {s.stats && (
                    <div className="inline-flex items-center gap-1 py-1 px-3 bg-sand-100 dark:bg-charcoal-800 rounded-full text-xs font-bold text-clay-700 dark:text-clay-300 uppercase tracking-wide">
                      {s.stats}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- DESTINATIONS CAROUSEL ----------------- */}
      <section id="popular-destinations" className="py-32 bg-white dark:bg-charcoal-900 overflow-hidden relative">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sand-100 dark:bg-charcoal-800/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-charcoal-900 dark:text-white mb-6 font-display">
                Curated Getaways
              </h2>
              <div className="flex flex-wrap gap-2">
                {['All', 'Beach', 'Mountain', 'City', 'Culture'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setDestFilter(cat as any)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${destFilter === cat
                      ? 'bg-forest-900 text-white border-forest-900 shadow-lg shadow-forest-900/20'
                      : 'bg-transparent text-charcoal-600 dark:text-sand-300 border-charcoal-200 dark:border-charcoal-700 hover:border-forest-500 hover:text-forest-600'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <Button variant="outline" className="hidden md:flex">View All Destinations</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((dest, i) => (
              <div key={dest.id} className="group relative h-[480px] rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-forest-900/20 transition-all duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/20 to-transparent opacity-90 transition-opacity duration-300" />

                <div className="absolute top-6 left-6 flex flex-col gap-2 items-start">
                  <span className="glass-card px-4 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                    {dest.category}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex justify-between items-end mb-2">
                    <h3 className="text-3xl font-bold text-white font-display">{dest.name}</h3>
                    <div className="flex items-center gap-1 text-sand-300 text-sm font-bold bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
                      <span>★</span> {dest.rating}
                    </div>
                  </div>
                  <p className="text-sand-100 text-sm line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{dest.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
                    <div>
                      <p className="text-xs text-sand-300 uppercase font-bold">Best Time</p>
                      <p className="text-white font-medium">{dest.bestMonth}</p>
                    </div>
                    <div>
                      <p className="text-xs text-sand-300 uppercase font-bold">Ideal Stay</p>
                      <p className="text-white font-medium">{dest.idealDuration}</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate('/plan')}
                    className="w-full !bg-white !text-forest-900 hover:!bg-sand-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200"
                  >
                    Plan This Trip
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- JOURNAL / BLOG ----------------- */}
      <section className="py-32 bg-sand-50 dark:bg-charcoal-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal-900 dark:text-white font-display">
              The Journal
            </h2>
            <Button variant="ghost" onClick={() => navigate('/blog')}>Read All Stories →</Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Featured Post */}
            {featuredBlog && (
              <div
                className="group relative h-[500px] lg:h-auto rounded-[2.5rem] overflow-hidden cursor-pointer shadow-xl"
                onClick={() => setSelectedBlog(featuredBlog)}
              >
                <img src={featuredBlog.image} alt={featuredBlog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/20 to-transparent" />
                <div className="absolute bottom-0 p-10 w-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 text-xs font-bold tracking-wider text-white uppercase bg-clay-600 rounded-full">
                      {featuredBlog.category}
                    </span>
                    <span className="text-sand-200 text-sm font-medium">{featuredBlog.readTime}</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-sand-200 transition-colors leading-tight font-display">{featuredBlog.title}</h3>
                  <p className="text-sand-100/80 line-clamp-2 mb-6 text-lg">{featuredBlog.excerpt}</p>
                  <div className="flex items-center gap-3 text-white text-sm font-medium">
                    <div className="w-8 h-8 rounded-full bg-forest-500 flex items-center justify-center">{featuredBlog.author.charAt(0)}</div>
                    <span>{featuredBlog.author}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Side List */}
            <div className="flex flex-col gap-6 justify-center">
              {otherBlogs.slice(0, 3).map(b => (
                <div
                  key={b.id}
                  className="group flex gap-6 p-6 bg-white dark:bg-charcoal-900 rounded-[2rem] hover:shadow-xl transition-all cursor-pointer border border-transparent hover:border-sand-200 dark:hover:border-charcoal-700"
                  onClick={() => setSelectedBlog(b)}
                >
                  <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-2xl overflow-hidden">
                    <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-xs text-clay-600 dark:text-clay-400 font-bold uppercase mb-2">
                      <span>{b.category}</span>
                      <span className="text-charcoal-300">•</span>
                      <span>{b.readTime}</span>
                    </div>
                    <h4 className="text-xl font-bold text-charcoal-900 dark:text-white mb-3 leading-snug group-hover:text-forest-700 dark:group-hover:text-forest-400 transition-colors font-display">{b.title}</h4>
                    <p className="text-charcoal-500 dark:text-charcoal-400 text-sm line-clamp-2">{b.excerpt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- TESTIMONIALS (Modern) ----------------- */}
      <section className="py-32 bg-charcoal-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-forest-500/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>

        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <div className="mb-20">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6">
              <div className="flex -space-x-1">
                {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-yellow-400 text-sm">★</span>)}
              </div>
              <span className="text-sand-200 text-xs font-bold uppercase tracking-wide">Trustpilot Rated 4.9/5</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold font-display mb-6">
              Traveler Stories
            </h2>
          </div>

          <div className="relative h-[400px] md:h-[300px] flex items-center justify-center">
            {reviews.map((review, idx) => (
              <div
                key={review.id}
                className={`absolute w-full transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${idx === currentReview
                  ? 'opacity-100 translate-y-0 scale-100 z-10'
                  : 'opacity-0 translate-y-8 scale-95 z-0'
                  }`}
              >
                <blockquote className="text-2xl md:text-4xl font-light leading-normal text-sand-50 mb-10 max-w-4xl mx-auto">
                  "{review.comment}"
                </blockquote>
                <div className="flex flex-col items-center gap-4">
                  <img src={review.avatar} alt={review.user} className="w-16 h-16 rounded-full border-4 border-charcoal-800 object-cover shadow-lg" />
                  <div>
                    <div className="font-bold text-white text-lg">{review.user}</div>
                    <div className="text-forest-300 text-sm font-medium uppercase tracking-wide">{review.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-3 mt-12">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentReview(idx)}
                className={`h-1 rounded-full transition-all duration-300 ${idx === currentReview ? 'w-12 bg-white' : 'w-2 bg-white/20'}`}
                aria-label={`Go to review ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- CONTACT SECTION ----------------- */}
      <section className="py-32 bg-white dark:bg-charcoal-900 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-charcoal-900 dark:text-white mb-4 font-display">Still have questions?</h2>
          <p className="text-charcoal-500 mb-12 text-lg">We are here to help you plan the perfect trip.</p>

          <div className="glass-card p-8 rounded-[2rem] text-left">
            {contactSuccess ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✨</div>
                <h3 className="text-2xl font-bold text-forest-700 dark:text-forest-400">Message Received</h3>
                <p className="text-charcoal-600 dark:text-sand-300">We'll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    required
                    placeholder="Name"
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    className="w-full px-6 py-4 rounded-xl bg-sand-50 dark:bg-charcoal-800 border-none focus:ring-2 focus:ring-forest-500"
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    className="w-full px-6 py-4 rounded-xl bg-sand-50 dark:bg-charcoal-800 border-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we help?"
                  value={contactMsg}
                  onChange={e => setContactMsg(e.target.value)}
                  className="w-full px-6 py-4 rounded-xl bg-sand-50 dark:bg-charcoal-800 border-none focus:ring-2 focus:ring-forest-500 resize-none"
                />
                <Button type="submit" size="lg" className="w-full">Send Message</Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Blog Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-charcoal-900/90 backdrop-blur-md" onClick={() => setSelectedBlog(null)}>
          <div
            className="bg-white dark:bg-charcoal-800 rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative h-[400px]">
              <img src={selectedBlog.image} className="w-full h-full object-cover" alt={selectedBlog.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 to-transparent opacity-80" />
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white rounded-full p-3 hover:bg-white/30 transition-colors focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute bottom-0 left-0 p-10 w-full">
                <div className="flex gap-3 mb-4">
                  <span className="bg-forest-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">{selectedBlog.category}</span>
                  <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">{selectedBlog.readTime}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white font-display mb-2">{selectedBlog.title}</h2>
              </div>
            </div>
            <div className="p-10 md:p-16">
              <div className="prose prose-lg dark:prose-invert max-w-none text-charcoal-600 dark:text-sand-200 leading-loose font-serif">
                <p className="text-2xl font-sans font-light leading-relaxed mb-10 text-charcoal-900 dark:text-white border-l-4 border-forest-500 pl-6 italic">
                  {selectedBlog.excerpt}
                </p>
                {selectedBlog.content.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-6">{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};