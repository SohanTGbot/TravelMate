
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
    ArrowUp
} from 'lucide-react';

export const HowItWorksPage = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('basics');
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

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
                    // If top is near viewport top (with some offset for header)
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
            // Offset for fixed header
            const y = element.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
            setActiveSection(id);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-sand-50 dark:bg-charcoal-950 pt-20 transition-colors duration-500 font-sans selection:bg-forest-500/30 selection:text-forest-900">
            <SEO
                title="How It Works - The Ultimate Guide | TravelMate"
                description="A complete developer-level guide to using TravelMate. Learn every feature from AI planning to offline mode."
            />

            {/* --- Progress Bar --- */}
            <div className="fixed top-0 left-0 h-1 bg-forest-600 z-[60] transition-all duration-100 ease-out" style={{ width: `${scrollProgress * 100}%` }}></div>

            {/* --- Hero Section --- */}
            <div className="relative py-24 lg:py-40 overflow-hidden">
                <div className="absolute inset-0 bg-forest-900/5 dark:bg-forest-900/20"></div>

                {/* Animated Background Blobs */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-blue-400/20 to-teal-400/20 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-forest-400/20 to-emerald-400/20 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/50 dark:bg-charcoal-800/50 backdrop-blur-md border border-forest-200 dark:border-forest-800 shadow-sm mb-8 transition-transform hover:scale-105 duration-300">
                        <span className="w-2 h-2 rounded-full bg-forest-500 animate-pulse"></span>
                        <span className="text-forest-700 dark:text-forest-300 text-xs font-bold uppercase tracking-widest">
                            Official Documentation v2.0
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-charcoal-900 dark:text-white font-display mb-8 leading-[1.1] tracking-tight">
                        Master the Art of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-600 via-teal-500 to-emerald-400 animate-gradient bg-300%">Intelligent Travel</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-charcoal-600 dark:text-sand-200 max-w-3xl mx-auto leading-relaxed font-light">
                        Unlock the full potential of TravelMate. From AI-driven planning to offline survival tools, here is everything you need to know.
                    </p>
                </div>
            </div>

            {/* --- Main Content Layout --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
                <div className="flex flex-col lg:flex-row gap-16 relative">

                    {/* --- Sticky Sidebar Navigation --- */}
                    <div className="hidden lg:block w-80 flex-shrink-0">
                        <div className="sticky top-32 space-y-4">
                            <div className="bg-white/80 dark:bg-charcoal-900/80 backdrop-blur-xl p-6 rounded-3xl border border-white/20 dark:border-charcoal-700 shadow-xl shadow-forest-900/5">
                                <p className="px-2 text-xs font-bold text-charcoal-400 uppercase tracking-widest mb-6 border-b border-sand-200 dark:border-charcoal-800 pb-2">Table of Contents</p>

                                <nav className="space-y-1">
                                    {[
                                        { id: 'basics', icon: <Lock className="w-4 h-4" />, label: 'The Basics' },
                                        { id: 'planning', icon: <Sparkles className="w-4 h-4" />, label: 'Planning Engine' },
                                        { id: 'itinerary', icon: <MapPin className="w-4 h-4" />, label: 'Itinerary Tools' },
                                        { id: 'smart-features', icon: <Smartphone className="w-4 h-4" />, label: 'Smart Assistants' },
                                        { id: 'community', icon: <Users className="w-4 h-4" />, label: 'Community' },
                                        { id: 'management', icon: <Settings className="w-4 h-4" />, label: 'Trip Management' },
                                    ].map((item) => (
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
                    <div className="flex-1 space-y-32 pt-4">

                        {/* SECTION 1: THE BASICS */}
                        <section id="basics" className="scroll-mt-32 animate-fade-in-up">
                            <SectionHeader
                                number="01"
                                title="The Basics"
                                description="Foundational features for a seamless experience."
                            />

                            <div className="grid gap-6">
                                <FeatureCard
                                    icon={<Lock className="w-6 h-6 text-blue-500" />}
                                    title="Authentication & Sync"
                                    text="While Guest Mode lets you browse, creating an account unlocks the cloud. Your trips automatically sync across devices—start on your laptop, view on your phone while traveling. We also back up your 'Saved Places' securely."
                                />
                                <FeatureCard
                                    icon={<CloudSun className="w-6 h-6 text-orange-500" />}
                                    title="Adaptive Theming"
                                    text="Toggle the sun/moon icon in the navbar. Our 'Dark Mode' is carefully calibrated (Charcoal-950, not pure black) to reduce eye strain during night planning sessions, while high-contrast Light Mode works perfectly outdoors."
                                />
                                <FeatureCard
                                    icon={<Smartphone className="w-6 h-6 text-purple-500" />}
                                    title="Mobile-First Architecture"
                                    text="The dashboard adapts to any screen. On mobile, the map hides intelligently to save data, sidebar menus become swipeable drawers, and touch targets enlarge for easier tapping on the go."
                                />
                            </div>
                        </section>

                        {/* SECTION 2: PLANNING */}
                        <section id="planning" className="scroll-mt-32">
                            <SectionHeader
                                number="02"
                                title="The Planning Engine"
                                description="Harnessing AI to build bespoke itineraries in seconds."
                            />

                            <div className="space-y-12">
                                <div className="bg-white/50 dark:bg-charcoal-900/50 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-sand-200 dark:border-charcoal-700 shadow-sm">
                                    <h3 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-8 border-l-4 border-forest-500 pl-4">Smart Inputs Explained</h3>

                                    <div className="grid gap-6">
                                        <BulletPoint title="Auto-Validating Search" text="Our search bar verifies destinations against global APIs in real-time, ensuring we only promise cities where we can actually find hotels and reliable data." />
                                        <BulletPoint title="Historical Weather Analysis" text="The date picker doesn't just count days; it checks 10-year historical weather data to warn you if you're booking a beach trip during monsoon season." />
                                        <BulletPoint title="Visual Discovery Quiz" text="The 'Surprise Me' feature isn't random. It presents a visual A/B test (e.g., 'Snowy Cabin' vs 'Urban Loft'). Your choices feed a preference algorithm to match you with a hidden gem destination." />
                                        <BulletPoint title="Dynamic Budgeting" text="Selecting 'Luxury' changes the entire recommendation engine—from 5-star hotels to Michelin-guide restaurants. 'Budget' prioritizes hostels, street food, and free walking tours." />
                                    </div>
                                </div>

                                <MockupWindow title="Processing">
                                    <div className="flex flex-col items-center justify-center p-16 text-center">
                                        <div className="relative mb-6">
                                            <div className="w-20 h-20 rounded-full border-4 border-forest-100 dark:border-forest-900 absolute top-0 left-0"></div>
                                            <div className="w-20 h-20 rounded-full border-4 border-forest-500 border-t-transparent animate-spin z-10 relative"></div>
                                            <Sparkles className="w-8 h-8 text-forest-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                                        </div>
                                        <p className="text-xl font-bold text-charcoal-900 dark:text-white mb-2">Analyzing 50,000+ Data Points...</p>
                                        <div className="flex flex-col gap-2 text-sm text-charcoal-500 dark:text-sand-400 font-mono">
                                            <span className="animate-fade-in-up">✓ Checking flight availability...</span>
                                            <span className="animate-fade-in-up delay-100">✓ Matching hotels to 'Luxury' tier...</span>
                                            <span className="animate-fade-in-up delay-200">✓ optimizing route for minimal travel time...</span>
                                        </div>
                                    </div>
                                </MockupWindow>
                            </div>
                        </section>

                        {/* SECTION 3: ITINERARY */}
                        <section id="itinerary" className="scroll-mt-32">
                            <SectionHeader
                                number="03"
                                title="Itinerary Management"
                                description="A powerful dashboard to visualize and refine your journey."
                            />

                            <div className="grid md:grid-cols-2 gap-8 mb-12">
                                <FeatureCard
                                    icon={<Calendar className="w-6 h-6 text-forest-500" />}
                                    title="Dynamic Timeline"
                                    text="Drag & Drop efficiency. Moved 'Museum Visit' from 10 AM to 4 PM? The timeline automatically re-sorts, and transit times between new neighbors are recalculated instantly."
                                />
                                <FeatureCard
                                    icon={<MapPin className="w-6 h-6 text-red-500" />}
                                    title="Synchronized Map"
                                    text="The map isn't just an image. It's interactive WebGL. Clicking an activity in the list zooms the map to its location. Day-switching instantly updates available markers."
                                />
                                <FeatureCard
                                    icon={<Briefcase className="w-6 h-6 text-amber-500" />}
                                    title="One-Click Booking"
                                    text="We act as your diverse engine. 'Book Flight' deep-links to Skyscanner with pre-filled dates and airports. 'Book Hotel' sends you to Booking.com with the specific property selected."
                                />
                                <FeatureCard
                                    icon={<Download className="w-6 h-6 text-blue-500" />}
                                    title="Offline Export"
                                    text="No internet? No problem. Export your full trip as a lightweight HTML file that works offline in any browser, or grab the .ICS file to flood your Google Calendar with ease."
                                />
                            </div>
                        </section>

                        {/* SECTION 4: SMART FEATURES */}
                        <section id="smart-features" className="scroll-mt-32">
                            <SectionHeader
                                number="04"
                                title="Smart Assistants"
                                description="Hidden utilities that anticipate your needs."
                            />

                            <div className="grid md:grid-cols-2 gap-6">
                                <DetailCard
                                    icon={<Music className="w-6 h-6 text-white" />}
                                    color="bg-green-500"
                                    title="Sonic Atmosphere"
                                    text="TravelMate analyzes your destination's vibe and auto-generates a Spotify playlist in the sidebar. Visiting Tokyo? Expect City Pop. Paris? Lo-fi Accordion Jazz. It sets the mood before you even pack."
                                />
                                <DetailCard
                                    icon={<CloudSun className="w-6 h-6 text-white" />}
                                    color="bg-blue-500"
                                    title="Contextual Intelligence"
                                    text="We show more than temperature. The 'Crowd Level' indicator warns you if you're visiting during peak tourist season, helping you decide whether to pre-book that Louvre ticket."
                                />
                                <DetailCard
                                    icon={<Heart className="w-6 h-6 text-white" />}
                                    color="bg-red-500"
                                    title="Safety First"
                                    text="A dedicated 'Emergency' card instantly provides local numbers for Police, Ambulance, and Embassy help. This card is cached for offline access in critical situations."
                                />
                                <DetailCard
                                    icon={<CheckCircle className="w-6 h-6 text-white" />}
                                    color="bg-purple-500"
                                    title="Smart Packing"
                                    text="The packing checklist isn't generic. It changes based on the weather forecast and activity tags. 'Raincoat' appears only if rain is forecast; 'Hiking Boots' only if you selected Adventure."
                                />
                            </div>
                        </section>

                        {/* SECTION 5: COMMUNITY */}
                        <section id="community" className="scroll-mt-32">
                            <SectionHeader
                                number="05"
                                title="Community Ecosystem"
                                description="Share, inspire, and collaborate with ease."
                            />

                            <div className="bg-gradient-to-br from-charcoal-900 to-indigo-950 rounded-[2.5rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl">
                                {/* Decor */}
                                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-[150px] opacity-40 translate-x-1/3 -translate-y-1/3"></div>
                                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full blur-[150px] opacity-30 -translate-x-1/3 translate-y-1/3"></div>

                                <div className="relative z-10">
                                    <div className="grid md:grid-cols-2 gap-16 items-center">
                                        <div className="space-y-8">
                                            <div>
                                                <h3 className="text-3xl font-bold mb-4 font-display">Privacy by Default</h3>
                                                <p className="text-indigo-100 text-lg leading-relaxed opacity-90">
                                                    Your plans are personal. All new trips start as <strong>Private</strong>. Only when you toggle "Share to Community" does it become visible on the public feed.
                                                </p>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="flex-1 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                                    <div className="text-2xl mb-2">🔒</div>
                                                    <div className="font-bold">Private</div>
                                                    <div className="text-xs opacity-60">Visible only to you</div>
                                                </div>
                                                <div className="flex-1 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-2xl p-4 border border-green-500/30">
                                                    <div className="text-2xl mb-2">🌍</div>
                                                    <div className="font-bold text-green-300">Public</div>
                                                    <div className="text-xs opacity-60 text-green-100">Open for collaboration</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-colors">
                                                <h4 className="font-bold text-xl mb-2">Crowdsourced Wisdom</h4>
                                                <p className="text-indigo-100 opacity-80 text-sm">
                                                    Public trips open a comment section. Ask for advice ("Is this area safe at night?") or get tips from locals ("Skip this trap, go here instead!").
                                                </p>
                                            </div>
                                            <Button variant="primary" className="w-full justify-center py-4 text-base shadow-xl shadow-indigo-500/30" onClick={() => navigate('/community')}>
                                                Explore Community Trips
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
                                title="Mission Control"
                                description="Efficiently manage your travel portfolio."
                            />

                            <div className="bg-sand-50 dark:bg-charcoal-900 rounded-[2rem] p-8 border border-sand-200 dark:border-charcoal-700">
                                <div className="grid md:grid-cols-3 gap-8">
                                    <ManagementCard
                                        emoji="👀"
                                        title="View & Edit"
                                        text="Trips aren't static. Re-open any saved plan to add new notes, change dates, or re-shuffle the itinerary as your plans evolve."
                                    />
                                    <ManagementCard
                                        emoji="🗑️"
                                        title="Clean Up"
                                        text="Finished a trip? Delete it to keep your dashboard focused. Deletion is instantaneous and permanent, removing it from public view too."
                                    />
                                    <ManagementCard
                                        emoji="🔗"
                                        title="Share Link"
                                        text="Every trip generates a unique, obscure URL ID. Send this to friends via WhatsApp or Email—they don't need an account to view it."
                                    />
                                </div>
                            </div>
                        </section>

                        {/* FINAL CTA */}
                        <div className="py-20 text-center">
                            <h2 className="text-3xl md:text-5xl font-bold text-charcoal-900 dark:text-white font-display mb-6">Ready to see it in action?</h2>
                            <Button
                                variant="primary"
                                className="text-lg px-8 py-4 shadow-xl shadow-forest-500/30 hover:shadow-2xl hover:-translate-y-1 transition-all rounded-2xl"
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
        <span className="text-[120px] font-display font-bold text-sand-200/50 dark:text-charcoal-800/50 absolute -top-14 -left-6 z-0 select-none transition-transform group-hover:scale-105 duration-700 ease-out">{number}</span>
        <div className="relative z-10 pl-4">
            <h2 className="text-4xl font-bold text-charcoal-900 dark:text-white mb-3">{title}</h2>
            <p className="text-xl text-charcoal-500 dark:text-sand-300 max-w-2xl font-light">{description}</p>
        </div>
    </div>
);

const FeatureCard = ({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) => (
    <div className="bg-white dark:bg-charcoal-900 p-8 rounded-3xl border border-sand-100 dark:border-charcoal-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="bg-sand-50 dark:bg-charcoal-800 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-3">{title}</h3>
        <p className="text-base text-charcoal-600 dark:text-sand-300 leading-relaxed">{text}</p>
    </div>
);

const DetailCard = ({ icon, title, text, color }: { icon: React.ReactNode, title: string, text: string, color: string }) => (
    <div className="bg-white dark:bg-charcoal-900 p-8 rounded-3xl border border-sand-100 dark:border-charcoal-800 shadow-sm flex gap-6 hover:shadow-lg transition-all">
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
    <div className="text-center group p-6 rounded-2xl hover:bg-white dark:hover:bg-charcoal-800 transition-colors">
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
    <div className="bg-charcoal-950 rounded-xl overflow-hidden shadow-2xl mx-auto max-w-3xl transform group hover:scale-[1.01] transition-transform duration-500 border border-charcoal-800">
        <div className="bg-charcoal-900 px-4 py-3 flex items-center gap-4 border-b border-charcoal-800">
            <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="bg-charcoal-950 rounded-md px-4 py-1.5 text-xs text-charcoal-500 font-mono flex-1 text-center border border-charcoal-800 flex items-center justify-center gap-2">
                <Lock className="w-3 h-3" /> travelmate.app/{title.toLowerCase().replace(/\s/g, '-')}
            </div>
            <div className="w-16"></div>
        </div>
        <div className="bg-sand-50 dark:bg-charcoal-950/50">
            {children}
        </div>
    </div>
);
