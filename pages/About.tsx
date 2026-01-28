
import React from 'react';
import { Helmet } from 'react-helmet-async';

export const About = () => {
    return (
        <>
            <Helmet>
                <title>About Us - TravelMate</title>
                <meta name="description" content="Learn about TravelMate's mission to make travel planning accessible to everyone with AI-powered itineraries." />
            </Helmet>
            <div className="min-h-screen bg-sand-50 dark:bg-charcoal-950 transition-colors pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Hero */}
                    <div className="text-center mb-20 animate-fade-in-up">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-forest-500 to-forest-700 rounded-full mb-8 shadow-2xl animate-float">
                            <span className="text-5xl">🌍</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-charcoal-900 dark:text-white mb-6 font-display">
                            Your AI Travel Companion
                        </h1>
                        <p className="text-xl text-charcoal-600 dark:text-sand-300 max-w-3xl mx-auto leading-relaxed">
                            TravelMate uses cutting-edge AI to create personalized travel itineraries in seconds.
                            Free, smart, and designed for modern travelers.
                        </p>
                    </div>

                    {/* Mission Statement */}
                    <div className="bg-gradient-to-r from-forest-500 to-forest-700 rounded-[3rem] p-12 md:p-16 text-center mb-20 animate-fade-in-up shadow-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-display">Our Mission</h2>
                        <p className="text-xl text-forest-50 max-w-4xl mx-auto leading-relaxed">
                            We believe travel planning should be <span className="font-bold text-white">exciting, not exhausting</span>.
                            TravelMate democratizes access to expert-level trip planning, making it free and accessible to everyone, everywhere.
                        </p>
                    </div>

                    {/* How It Works */}
                    <div className="mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-charcoal-900 dark:text-white text-center mb-12 font-display animate-fade-in-up">
                            How It Works
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    step: "1",
                                    icon: "✍️",
                                    title: "Tell Us Your Dreams",
                                    description: "Share your destination, dates, budget, and interests. The more details, the better!",
                                    color: "from-blue-500 to-blue-700"
                                },
                                {
                                    step: "2",
                                    icon: "🤖",
                                    title: "AI Works Its Magic",
                                    description: "Our Google Gemini AI analyzes millions of data points to craft your perfect itinerary in seconds.",
                                    color: "from-purple-500 to-purple-700"
                                },
                                {
                                    step: "3",
                                    icon: "🎉",
                                    title: "Explore & Customize",
                                    description: "Review your personalized plan, drag-and-drop activities, save offline, and share with friends!",
                                    color: "from-forest-500 to-forest-700"
                                }
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="relative bg-white dark:bg-charcoal-900 rounded-[2rem] p-8 border border-sand-200 dark:border-charcoal-700 shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in-up"
                                    style={{ animationDelay: `${idx * 150}ms` }}
                                >
                                    <div className={`absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                                        {item.step}
                                    </div>
                                    <div className="text-5xl mb-4 mt-4 animate-float" style={{ animationDelay: `${idx * 200}ms` }}>
                                        {item.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-3 font-display">
                                        {item.title}
                                    </h3>
                                    <p className="text-charcoal-600 dark:text-sand-300 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Why Choose TravelMate */}
                    <div className="mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-charcoal-900 dark:text-white text-center mb-12 font-display animate-fade-in-up">
                            Why Choose TravelMate?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: "🎁",
                                    title: "100% Free Forever",
                                    description: "No hidden fees, no premium tiers. Full access to all features, always."
                                },
                                {
                                    icon: "⚡",
                                    title: "Lightning Fast",
                                    description: "Get a complete itinerary in under 30 seconds. No more hours of research."
                                },
                                {
                                    icon: "🎯",
                                    title: "Hyper-Personalized",
                                    description: "AI learns your preferences and creates trips tailored just for you."
                                },
                                {
                                    icon: "📱",
                                    title: "Works Offline",
                                    description: "Download your trips and access them anywhere, even without internet."
                                },
                                {
                                    icon: "🔄",
                                    title: "Fully Customizable",
                                    description: "Drag-and-drop activities, edit times, add your own stops. Total control."
                                },
                                {
                                    icon: "🌐",
                                    title: "Share & Collaborate",
                                    description: "Share trips with friends, get feedback, and plan together in real-time."
                                },
                                {
                                    icon: "🗺️",
                                    title: "Interactive Maps",
                                    description: "Visualize your journey with beautiful, interactive maps for each day."
                                },
                                {
                                    icon: "💡",
                                    title: "Smart Recommendations",
                                    description: "Get insider tips on food, culture, packing, and budget-saving hacks."
                                },
                                {
                                    icon: "🔒",
                                    title: "Privacy First",
                                    description: "Your data is yours. We never sell your information to third parties."
                                }
                            ].map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white dark:bg-charcoal-900 rounded-[2rem] p-6 border border-sand-200 dark:border-charcoal-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up"
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    <div className="text-4xl mb-3 animate-float" style={{ animationDelay: `${idx * 100}ms` }}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-charcoal-900 dark:text-white mb-2 font-display">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-charcoal-600 dark:text-sand-300">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Values */}
                    <div className="mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-charcoal-900 dark:text-white text-center mb-12 font-display animate-fade-in-up">
                            Our Values
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                {
                                    icon: "🌟",
                                    title: "Accessibility for All",
                                    description: "Travel planning shouldn't be a luxury. We're committed to keeping TravelMate free and accessible to everyone, regardless of background or budget.",
                                    gradient: "from-yellow-500 to-orange-600"
                                },
                                {
                                    icon: "🚀",
                                    title: "Innovation First",
                                    description: "We leverage the latest AI technology to push the boundaries of what's possible in travel planning. Expect constant improvements and new features.",
                                    gradient: "from-purple-500 to-pink-600"
                                },
                                {
                                    icon: "💚",
                                    title: "Sustainable Travel",
                                    description: "We encourage responsible tourism and provide eco-friendly options in our recommendations. Travel the world, protect the planet.",
                                    gradient: "from-green-500 to-teal-600"
                                },
                                {
                                    icon: "🤝",
                                    title: "Community Driven",
                                    description: "Your feedback shapes our roadmap. We're building TravelMate together with our community of passionate travelers.",
                                    gradient: "from-blue-500 to-indigo-600"
                                }
                            ].map((value, idx) => (
                                <div
                                    key={idx}
                                    className={`bg-gradient-to-br ${value.gradient} rounded-[2rem] p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in-up`}
                                    style={{ animationDelay: `${idx * 150}ms` }}
                                >
                                    <div className="text-5xl mb-4 animate-float" style={{ animationDelay: `${idx * 200}ms` }}>
                                        {value.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 font-display">
                                        {value.title}
                                    </h3>
                                    <p className="text-white/90 leading-relaxed">
                                        {value.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center bg-gradient-to-r from-forest-500 to-forest-700 rounded-[3rem] p-12 md:p-16 animate-fade-in-up shadow-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">
                            Ready to Start Your Adventure?
                        </h2>
                        <p className="text-xl text-forest-50 mb-8 max-w-2xl mx-auto">
                            Join thousands of travelers who've discovered smarter trip planning with TravelMate.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/plan"
                                className="inline-block bg-white text-forest-700 font-bold px-10 py-4 rounded-full hover:bg-sand-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform duration-200 text-lg"
                            >
                                Plan Your Trip →
                            </a>
                            <a
                                href="/community"
                                className="inline-block bg-forest-600 text-white font-bold px-10 py-4 rounded-full hover:bg-forest-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform duration-200 text-lg border-2 border-white/20"
                            >
                                Explore Community
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
