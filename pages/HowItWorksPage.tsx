
import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import {
    Sparkles,
    MapPin,
    Users,
    Calendar,
    Share2,
    Globe,
    BookOpen,
    Download,
    Search,
    CheckCircle,
    ArrowRight,
    Lock,
    Settings,
    Music,
    CloudSun,
    Briefcase,
    MessageSquare,
    Heart,
    Smartphone,
    ArrowUp,
    Menu,
    X
} from 'lucide-react';

export const HowItWorksPage = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('basics');
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Scroll spy & Progress bar
    useEffect(() => {
        const handleScroll = () => {
            // Update Progress Bar
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = `${totalScroll / windowHeight}`;
            setScrollProgress(Number(scroll));

            // Back to Top Visibility
            setShowBackToTop(totalScroll > 500);

            // Active Section Spy
            const sections = ['basics', 'planning', 'itinerary', 'smart-features', 'community', 'management'];
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // Adjusted offset for mobile/desktop headers
                    if (rect.top >= 0 && rect.top <= 400) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            // Mobile offset vs Desktop offset
            const offset = window.innerWidth < 1024 ? 140 : 100;
            const y = element.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
            setActiveSection(id);
            setIsMobileMenuOpen(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const sections = [
        { id: 'basics', icon: <Lock className="w-4 h-4" />, label: 'The Basics' },
        { id: 'planning', icon: <Sparkles className="w-4 h-4" />, label: 'Planning Engine' },
        { id: 'itinerary', icon: <MapPin className="w-4 h-4" />, label: 'Itinerary Tools' },
        { id: 'smart-features', icon: <Smartphone className="w-4 h-4" />, label: 'Smart Assistants' },
        { id: 'community', icon: <Users className="w-4 h-4" />, label: 'Community' },
        { id: 'management', icon: <Settings className="w-4 h-4" />, label: 'Trip Management' },
    ];

    return (
        <div className="min-h-screen bg-sand-50 dark:bg-charcoal-950 pt-20 transition-colors duration-500 font-sans selection:bg-forest-500/30 selection:text-forest-900">
            <SEO
                title="How It Works - The Ultimate Guide | TravelMate"
                description="A complete developer-level guide to using TravelMate. Learn every feature from AI planning to offline mode."
            />

            {/* --- Progress Bar --- */}
            <div className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-forest-500 to-teal-400 z-[60] transition-all duration-100 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${scrollProgress * 100}%` }}></div>

            {/* --- Mobile Sticky Nav --- */}
            <div className="lg:hidden fixed top-[72px] left-0 right-0 z-40 bg-white/80 dark:bg-charcoal-900/80 backdrop-blur-xl border-b border-sand-200 dark:border-charcoal-700 transition-all duration-300">
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-xs font-bold uppercase text-charcoal-400 tracking-wider flex-shrink-0">On this page:</span>
                        <span className="text-sm font-bold text-forest-600 dark:text-forest-400 truncate">
                            {sections.find(s => s.id === activeSection)?.label || 'Introduction'}
                        </span>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 rounded-lg bg-sand-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-sand-300 hover:bg-forest-100 dark:hover:bg-charcoal-700 transition-colors"
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white dark:bg-charcoal-900 border-b border-sand-200 dark:border-charcoal-700 shadow-xl max-h-[60vh] overflow-y-auto animate-slide-down">
                        <div className="p-2 space-y-1">
                            {sections.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeSection === item.id
                                        ? 'bg-forest-50 dark:bg-forest-900/20 text-forest-700 dark:text-forest-200'
                                        : 'text-charcoal-600 dark:text-sand-300 active:bg-sand-100 dark:active:bg-charcoal-800'
                                        }`}
                                >
                                    {item.icon}
                                    {item.label}
                                    {activeSection === item.id && <CheckCircle className="w-4 h-4 ml-auto text-forest-500" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* --- Hero Section --- */}
            <div className="relative py-24 lg:py-40 overflow-hidden">
                <div className="absolute inset-0 bg-forest-900/5 dark:bg-forest-900/20"></div>

                {/* Animated Background Blobs - Responsive Sizing */}
                <div className="absolute top-0 right-0 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-gradient-to-b from-blue-400/20 to-teal-400/20 rounded-full blur-[80px] lg:blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-gradient-to-t from-forest-400/20 to-emerald-400/20 rounded-full blur-[80px] lg:blur-[120px] animate-pulse-slow delay-1000"></div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/50 dark:bg-charcoal-800/50 backdrop-blur-md border border-forest-200 dark:border-forest-800 shadow-sm mb-6 lg:mb-8 transition-transform hover:scale-105 duration-300">
                        <span className="w-2 h-2 rounded-full bg-forest-500 animate-pulse"></span>
                        <span className="text-forest-700 dark:text-forest-300 text-[10px] lg:text-xs font-bold uppercase tracking-widest">
                            Official Documentation v2.0
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-charcoal-900 dark:text-white font-display mb-6 lg:mb-8 leading-[1.1] tracking-tight">
                        Master the Art of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-600 via-teal-500 to-emerald-400 animate-gradient bg-300%">Intelligent Travel</span>
                    </h1>

                    <p className="text-lg md:text-xl lg:text-2xl text-charcoal-600 dark:text-sand-200 max-w-3xl mx-auto leading-relaxed font-light">
                        Unlock the full potential of TravelMate. From AI-driven planning to offline survival tools, here is everything you need to know.
                    </p>
                </div>
            </div>

            {/* --- Main Content Layout --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 relative">

                    {/* --- Sticky Sidebar Navigation (Desktop) --- */}
                    <div className="hidden lg:block w-80 flex-shrink-0">
                        <div className="sticky top-32 space-y-4">
                            <div className="bg-white/80 dark:bg-charcoal-900/80 backdrop-blur-xl p-6 rounded-3xl border border-white/20 dark:border-charcoal-700 shadow-xl shadow-forest-900/5">
                                <p className="px-2 text-xs font-bold text-charcoal-400 uppercase tracking-widest mb-6 border-b border-sand-200 dark:border-charcoal-800 pb-2">Table of Contents</p>

                                <nav className="space-y-1">
                                    {sections.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => scrollToSection(item.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 group ${activeSection === item.id
                                                ? 'bg-forest-600 text-white shadow-lg shadow-forest-500/20 translate-x-2'
                                                : 'text-charcoal-500 dark:text-sand-400 hover:bg-sand-50 dark:hover:bg-charcoal-800 hover:text-forest-600 dark:hover:text-forest-300'
                                                }`}
                                        >
                                            <span className={`transition-transform duration-300 ${activeSection === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                                                {item.icon}
                                            </span>
                                            {item.label}
                                            {activeSection === item.id && (
                                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-50 animate-pulse"></span>
                                            )}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* CTA Card */}
                            <div className="group relative overflow-hidden rounded-3xl p-1 bg-gradient-to-br from-forest-500 to-teal-500 shadow-2xl shadow-forest-500/20">
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="bg-white dark:bg-charcoal-900 rounded-[1.3rem] p-6 text-center relative z-10 h-full">
                                    <h4 className="font-bold text-lg text-charcoal-900 dark:text-white mb-2">Inspired?</h4>
                                    <p className="text-charcoal-500 dark:text-sand-400 text-sm mb-4">You're ready to build the perfect trip now.</p>
                                    <Button
                                        variant="primary"
                                        className="w-full justify-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                        onClick={() => navigate('/plan')}
                                    >
                                        Start Planning
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Content Area --- */}
                    <div className="flex-1 space-y-20 lg:space-y-32 pt-4">

                        {/* SECTION 1: THE BASICS */}
                        <section id="basics" className="scroll-mt-32 animate-fade-in-up">
                            <SectionHeader
                                number="01"
                                title="Getting Started"
                                description="Step 1: Set up your travel command center."
                            />

                            <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-6">
                                <FeatureCard
                                    icon={<Lock className="w-6 h-6 text-blue-500" />}
                                    title="How to Sync Across Devices"
                                    text="Create an account to unlock cloud sync. Once logged in, any trip you plan on your laptop automatically appears in the mobile app. To save a place, simply tap the 'Heart' icon on any destination card."
                                />
                                <FeatureCard
                                    icon={<CloudSun className="w-6 h-6 text-orange-500" />}
                                    title="How to Enable Dark Mode"
                                    text="Planning late at night? Tap the Sun/Moon icon in the top navigation bar. This system-wide toggle adjusts map contrast and text brightness to reduce eye strain."
                                />
                                <FeatureCard
                                    icon={<Smartphone className="w-6 h-6 text-purple-500" />}
                                    title="Using the Mobile Interface"
                                    text="On your phone, the navigation bar moves to the bottom drawer. Swipe up to access menus. Maps automatically hide to save data—tap 'Show Map' to view your route."
                                />
                            </div>
                        </section>

                        {/* SECTION 2: PLANNING */}
                        <section id="planning" className="scroll-mt-32">
                            <SectionHeader
                                number="02"
                                title="How to Plan a Trip"
                                description="Step 2: Generate your perfect itinerary in 30 seconds."
                            />

                            <div className="space-y-12">
                                <div className="bg-white/50 dark:bg-charcoal-900/50 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-sand-200 dark:border-charcoal-700 shadow-sm relative overflow-hidden">
                                    {/* Background decoration */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-forest-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

                                    <h3 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-8 border-l-4 border-forest-500 pl-4 relative z-10">Using the Smart Inputs</h3>

                                    <div className="grid gap-6 relative z-10">
                                        <BulletPoint title="Finding a Destination" text="Start typing any city in the search bar. If you're unsure, leave it blank and click 'Surprise Me' to take a visual preference quiz." />
                                        <BulletPoint title="Selecting Dates" text="Click the calendar input. The AI will analyze historical weather for your selected dates and show a warning if it detects a rainy season." />
                                        <BulletPoint title="Setting Your Budget" text="Choose a tier: 'Budget' targets hostels and free activities; 'Luxury' targets 5-star hotels and fine dining. This profoundly changes the AI's suggestions." />
                                        <BulletPoint title="Refining Interests" text="Tap tags like 'History', 'Food', or 'Nightlife'. The AI will prioritize activities matching these tags when building your daily schedule." />
                                    </div>
                                </div>

                                <MockupWindow title="AI Generation Process">
                                    <div className="flex flex-col items-center justify-center p-12 lg:p-16 text-center">
                                        <div className="relative mb-6">
                                            <div className="w-20 h-20 rounded-full border-4 border-forest-100 dark:border-forest-900 absolute top-0 left-0"></div>
                                            <div className="w-20 h-20 rounded-full border-4 border-forest-500 border-t-transparent animate-spin z-10 relative"></div>
                                            <Sparkles className="w-8 h-8 text-forest-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                                        </div>
                                        <p className="text-xl font-bold text-charcoal-900 dark:text-white mb-2">Building Your Itinerary...</p>
                                        <div className="flex flex-col gap-2 text-sm text-charcoal-500 dark:text-sand-400 font-mono">
                                            <span className="animate-fade-in-up">1. Analyzing your preferences...</span>
                                            <span className="animate-fade-in-up delay-100">2. Finding optimal routes...</span>
                                            <span className="animate-fade-in-up delay-200">3. checking opening hours...</span>
                                        </div>
                                    </div>
                                </MockupWindow>
                            </div>
                        </section>

                        {/* SECTION 3: ITINERARY */}
                        <section id="itinerary" className="scroll-mt-32">
                            <SectionHeader
                                number="03"
                                title="Customizing Your Trip"
                                description="Step 3: Refine the details to match your style."
                            />

                            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-12">
                                <FeatureCard
                                    icon={<Calendar className="w-6 h-6 text-forest-500" />}
                                    title="How to Reorder Activities"
                                    text="Simply click and hold any activity card, then drag it to a new time slot. The timeline automatically updates transit times between the new locations."
                                />
                                <FeatureCard
                                    icon={<MapPin className="w-6 h-6 text-red-500" />}
                                    title="Using the Interactive Map"
                                    text="Click any pin on the map to see details about that location. Clicking a day in your itinerary filters the map to show only that day's route."
                                />
                                <FeatureCard
                                    icon={<Briefcase className="w-6 h-6 text-amber-500" />}
                                    title="How to Book"
                                    text="Click the 'Book Flight' or 'Book Hotel' buttons. We redirect you to Skyscanner or Booking.com with your specific dates and destination pre-filled."
                                />
                                <FeatureCard
                                    icon={<Download className="w-6 h-6 text-blue-500" />}
                                    title="Saving for Offline Use"
                                    text="Click the 'Download' button in the toolbar. Select 'HTML' to save a file that works on your phone without internet, perfect for flights."
                                />
                            </div>
                        </section>

                        {/* SECTION 4: SMART FEATURES */}
                        <section id="smart-features" className="scroll-mt-32">
                            <SectionHeader
                                number="04"
                                title="Using Smart Assistants"
                                description="Hidden tools to help you travel safer and smarter."
                            />

                            <div className="grid md:grid-cols-2 gap-6">
                                <DetailCard
                                    icon={<Music className="w-6 h-6 text-white" />}
                                    color="bg-green-500"
                                    title="Get the Vibe"
                                    text="Look for the Spotify widget in the sidebar. It auto-plays music popular in your destination city to help you get in the mood while packing."
                                />
                                <DetailCard
                                    icon={<CloudSun className="w-6 h-6 text-white" />}
                                    color="bg-blue-500"
                                    title="Check Crowd Levels"
                                    text="Use the 'Crowd Meter' at the top of your itinerary. If it says 'High', consider booking museum tickets in advance to avoid queues."
                                />
                                <DetailCard
                                    icon={<Heart className="w-6 h-6 text-white" />}
                                    color="bg-red-500"
                                    title="Access Emergency Info"
                                    text="Scroll to the 'Emergency' card to find local numbers for Police and Ambulance. Save this info offline before you leave."
                                />
                                <DetailCard
                                    icon={<CheckCircle className="w-6 h-6 text-white" />}
                                    color="bg-purple-500"
                                    title="Use the Smart Packing List"
                                    text="Check off items in the 'Packing' widget. It adds special items (e.g., 'Raincoat') based on the live weather forecast for your trip dates."
                                />
                            </div>
                        </section>

                        {/* SECTION 5: COMMUNITY */}
                        <section id="community" className="scroll-mt-32">
                            <SectionHeader
                                number="05"
                                title="Sharing & Community"
                                description="Step 4: Collaborate with friends or the world."
                            />

                            <div className="bg-gradient-to-br from-charcoal-900 to-indigo-950 rounded-[2.5rem] p-8 md:p-14 text-white relative overflow-hidden shadow-2xl">
                                {/* Decor */}
                                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-[150px] opacity-40 translate-x-1/3 -translate-y-1/3"></div>
                                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full blur-[150px] opacity-30 -translate-x-1/3 translate-y-1/3"></div>

                                <div className="relative z-10">
                                    <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
                                        <div className="space-y-8">
                                            <div>
                                                <h3 className="text-3xl font-bold mb-4 font-display">How to Share</h3>
                                                <p className="text-indigo-100 text-lg leading-relaxed opacity-90">
                                                    By default, your trip is <strong>Private</strong>. To share it, locate the toggle switch at the top of your specific trip page in the dashboard.
                                                </p>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="flex-1 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                                    <div className="text-2xl mb-2">🔒</div>
                                                    <div className="font-bold">Private Mode</div>
                                                    <div className="text-xs opacity-60">Only you can view</div>
                                                </div>
                                                <div className="flex-1 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-2xl p-4 border border-green-500/30">
                                                    <div className="text-2xl mb-2">🌍</div>
                                                    <div className="font-bold text-green-300">Public Mode</div>
                                                    <div className="text-xs opacity-60">Others can view & clone</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-colors">
                                                <h4 className="font-bold text-xl mb-2">Getting Feedback</h4>
                                                <p className="text-indigo-100 opacity-80 text-sm">
                                                    Once public, other users can leave comments. Use this to ask specific questions like "Is this hotel area noisy?" and get answers from the community.
                                                </p>
                                            </div>
                                            <Button variant="primary" className="w-full justify-center py-4 text-base shadow-xl shadow-indigo-500/30" onClick={() => navigate('/community')}>
                                                Browse Public Trips
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 6: MANAGEMENT */}
                        <section id="management" className="scroll-mt-32">
                            <SectionHeader
                                number="06"
                                title="Managing Your Dashboard"
                                description="Step 5: Control your entire travel portfolio."
                            />

                            <div className="bg-sand-50 dark:bg-charcoal-900 rounded-[2rem] p-8 border border-sand-200 dark:border-charcoal-700">
                                <div className="grid md:grid-cols-3 gap-8">
                                    <ManagementCard
                                        emoji="👀"
                                        title="How to Edit"
                                        text="Need to change dates? Open any saved trip from your Dashboard. The 'Edit Details' button lets you adjust the trip duration or rename it instantly."
                                    />
                                    <ManagementCard
                                        emoji="🗑️"
                                        title="Deleting Trips"
                                        text="To remove a trip, click the trash icon on the trip card. Warning: This is permanent and will also remove it from the public community feed."
                                    />
                                    <ManagementCard
                                        emoji="🔗"
                                        title="Sharing Deep Links"
                                        text="Even for Private trips, you can copy the URL to share with friends. They can view the itinerary but cannot make edits unless they clone it."
                                    />
                                </div>
                            </div>
                        </section>

                        {/* FINAL CTA */}
                        <div className="py-20 text-center">
                            <h2 className="text-3xl md:text-5xl font-bold text-charcoal-900 dark:text-white font-display mb-6">Ready to see it in action?</h2>
                            <Button
                                variant="primary"
                                className="text-lg px-8 py-4 shadow-xl shadow-forest-500/30 hover:shadow-2xl hover:-translate-y-1 transition-all rounded-2xl w-full sm:w-auto"
                                onClick={() => navigate('/plan')}
                            >
                                Build Your First Trip Now
                            </Button>
                        </div>

                    </div>
                </div>
            </div>

            {/* --- Back To Top --- */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 right-8 p-4 bg-forest-600 text-white rounded-full shadow-2xl hover:bg-forest-500 transition-all duration-300 transform z-50 ${showBackToTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                    }`}
                aria-label="Back to top"
            >
                <ArrowUp className="w-6 h-6" />
            </button>
        </div>
    );
};

// --- Sub-components for Clean Code ---

const SectionHeader = ({ number, title, description }: { number: string, title: string, description: string }) => (
    <div className="mb-12 relative group">
        <span className="text-[80px] md:text-[120px] font-display font-bold text-sand-200/50 dark:text-charcoal-800/50 absolute -top-10 md:-top-14 -left-4 md:-left-6 z-0 select-none transition-transform group-hover:scale-105 duration-700 ease-out">{number}</span>
        <div className="relative z-10 pl-2 md:pl-4 pt-4 md:pt-0">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 dark:text-white mb-2 md:mb-3">{title}</h2>
            <p className="text-lg md:text-xl text-charcoal-500 dark:text-sand-300 max-w-2xl font-light">{description}</p>
        </div>
    </div>
);

const FeatureCard = ({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) => (
    <div className="bg-white dark:bg-charcoal-900 p-6 md:p-8 rounded-3xl border border-sand-100 dark:border-charcoal-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
        <div className="bg-sand-50 dark:bg-charcoal-800 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-3">{title}</h3>
        <p className="text-base text-charcoal-600 dark:text-sand-300 leading-relaxed">{text}</p>
    </div>
);

const DetailCard = ({ icon, title, text, color }: { icon: React.ReactNode, title: string, text: string, color: string }) => (
    <div className="bg-white dark:bg-charcoal-900 p-6 md:p-8 rounded-3xl border border-sand-100 dark:border-charcoal-800 shadow-sm flex flex-col sm:flex-row gap-6 hover:shadow-lg transition-all h-full">
        <div className={`${color} w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-gray-200 dark:shadow-none`}>
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-charcoal-900 dark:text-white text-lg mb-2">{title}</h4>
            <p className="text-sm text-charcoal-500 dark:text-sand-300 leading-relaxed font-medium">{text}</p>
        </div>
    </div>
);

const ManagementCard = ({ emoji, title, text }: { emoji: string, title: string, text: string }) => (
    <div className="text-center group p-6 rounded-2xl hover:bg-white dark:hover:bg-charcoal-800 transition-colors h-full">
        <div className="w-16 h-16 bg-white dark:bg-charcoal-800 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-md border border-sand-100 dark:border-charcoal-700 group-hover:scale-110 transition-transform duration-300">
            {emoji}
        </div>
        <h4 className="font-bold text-xl text-charcoal-900 dark:text-white mb-3">{title}</h4>
        <p className="text-sm text-charcoal-500 dark:text-sand-400 leading-relaxed">{text}</p>
    </div>
);

const BulletPoint = ({ title, text }: { title: string, text: string }) => (
    <div className="flex gap-4 items-start group">
        <div className="w-8 h-8 rounded-full bg-forest-100 dark:bg-forest-900/40 text-forest-600 dark:text-forest-400 flex items-center justify-center flex-shrink-0 text-sm font-bold mt-1 group-hover:bg-forest-500 group-hover:text-white transition-colors">✓</div>
        <div>
            <span className="font-bold text-charcoal-900 dark:text-white text-lg block mb-1">{title}</span>
            <span className="text-charcoal-600 dark:text-sand-300 text-base leading-relaxed">{text}</span>
        </div>
    </div>
);

const MockupWindow = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-charcoal-950 rounded-xl overflow-hidden shadow-2xl mx-auto max-w-3xl transform group hover:scale-[1.01] transition-transform duration-500 border border-charcoal-800 w-full">
        <div className="bg-charcoal-900 px-4 py-3 flex items-center gap-4 border-b border-charcoal-800">
            <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="bg-charcoal-950 rounded-md px-4 py-1.5 text-xs text-charcoal-500 font-mono flex-1 text-center border border-charcoal-800 flex items-center justify-center gap-2 truncate">
                <Lock className="w-3 h-3 flex-shrink-0" /> <span className="truncate">travelmate.app/{title.toLowerCase().replace(/\s/g, '-')}</span>
            </div>
            <div className="w-6 md:w-16"></div>
        </div>
        <div className="bg-sand-50 dark:bg-charcoal-950/50">
            {children}
        </div>
    </div>
);
