
import React from 'react';
import { Helmet } from 'react-helmet-async';

export const Services = () => {
    return (
        <>
            <Helmet>
                <title>Services - TravelMate</title>
                <meta name="description" content="Discover all the features TravelMate offers - AI trip planning, offline access, community sharing, and more. All completely free!" />
            </Helmet>
            <div className="min-h-screen bg-sand-50 dark:bg-charcoal-950 transition-colors pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Hero */}
                    <div className="text-center mb-20 animate-fade-in-up">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full mb-8 shadow-2xl animate-float">
                            <span className="text-5xl">⚡</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-charcoal-900 dark:text-white mb-6 font-display">
                            Everything You Need
                        </h1>
                        <p className="text-xl text-charcoal-600 dark:text-sand-300 max-w-3xl mx-auto leading-relaxed">
                            Powerful features to plan, customize, and share your perfect trip.
                            <span className="font-bold text-forest-600 dark:text-forest-400"> All 100% free.</span>
                        </p>
                    </div>

                    {/* Main Services */}
                    <div className="space-y-16 mb-20">
                        {[
                            {
                                icon: "🤖",
                                title: "AI-Powered Trip Planning",
                                description: "Our Google Gemini AI creates personalized itineraries in seconds",
                                gradient: "from-purple-500 to-purple-700",
                                features: [
                                    "Instant itinerary generation (under 30 seconds)",
                                    "Personalized recommendations based on your preferences",
                                    "Day-by-day schedules with activities, meals, and accommodations",
                                    "Budget estimates and cost-saving tips",
                                    "Weather forecasts and crowd level predictions",
                                    "Local etiquette and cultural insights"
                                ]
                            },
                            {
                                icon: "✏️",
                                title: "Full Customization Control",
                                description: "Your trip, your way. Edit every detail to perfection",
                                gradient: "from-orange-500 to-orange-700",
                                features: [
                                    "Drag-and-drop activity reordering",
                                    "Add, edit, or remove any activity",
                                    "Adjust timings and durations",
                                    "Modify accommodation and transport options",
                                    "Add personal notes and reminders",
                                    "Save multiple versions of your trip"
                                ]
                            },
                            {
                                icon: "📱",
                                title: "Offline Access",
                                description: "Take your trips anywhere, even without internet",
                                gradient: "from-green-500 to-green-700",
                                features: [
                                    "Download trips for offline viewing",
                                    "Access maps and directions without data",
                                    "Export as HTML for easy reading",
                                    "Export to calendar (.ics format)",
                                    "Print-friendly itinerary format",
                                    "Works on all devices"
                                ]
                            },
                            {
                                icon: "🌐",
                                title: "Share & Collaborate",
                                description: "Plan together and inspire others with your adventures",
                                gradient: "from-blue-500 to-blue-700",
                                features: [
                                    "Generate shareable trip links",
                                    "Public or private trip visibility",
                                    "Community comments and discussions",
                                    "Share via WhatsApp, email, or social media",
                                    "Collaborate with travel companions",
                                    "Get feedback from experienced travelers"
                                ]
                            },
                            {
                                icon: "🗺️",
                                title: "Interactive Maps",
                                description: "Visualize your journey with beautiful, dynamic maps",
                                gradient: "from-teal-500 to-teal-700",
                                features: [
                                    "Day-by-day route visualization",
                                    "Activity location markers",
                                    "Distance and travel time estimates",
                                    "Zoom and pan controls",
                                    "Satellite and street view options",
                                    "Nearby points of interest"
                                ]
                            },
                            {
                                icon: "💡",
                                title: "Smart Recommendations",
                                description: "Expert insights to enhance every aspect of your trip",
                                gradient: "from-yellow-500 to-yellow-700",
                                features: [
                                    "Must-try local dishes and restaurants",
                                    "Cultural do's and don'ts",
                                    "Packing checklist based on destination",
                                    "Emergency contact information",
                                    "Money-saving travel hacks",
                                    "Hidden gems and local favorites"
                                ]
                            },
                            {
                                icon: "👥",
                                title: "Community Features",
                                description: "Connect with fellow travelers and share experiences",
                                gradient: "from-pink-500 to-pink-700",
                                features: [
                                    "Browse public trip itineraries",
                                    "Comment and discuss trip plans",
                                    "Follow other travelers",
                                    "Share travel tips and reviews",
                                    "Discover trending destinations",
                                    "Get inspired by community trips"
                                ]
                            },
                            {
                                icon: "🎵",
                                title: "Spotify Integration",
                                description: "Set the mood with curated playlists for your destination",
                                gradient: "from-indigo-500 to-indigo-700",
                                features: [
                                    "Location-based music recommendations",
                                    "Embedded Spotify playlists",
                                    "Discover local artists and genres",
                                    "Create the perfect travel soundtrack",
                                    "Share playlists with travel companions",
                                    "Offline playlist downloads (Spotify Premium)"
                                ]
                            }
                        ].map((service, idx) => (
                            <div
                                key={idx}
                                className="bg-white dark:bg-charcoal-900 rounded-[3rem] overflow-hidden border border-sand-200 dark:border-charcoal-700 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in-up"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className={`bg-gradient-to-r ${service.gradient} p-8 md:p-12`}>
                                    <div className="flex items-center gap-6">
                                        <div className="text-6xl animate-float" style={{ animationDelay: `${idx * 150}ms` }}>
                                            {service.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 font-display">
                                                {service.title}
                                            </h2>
                                            <p className="text-xl text-white/90">
                                                {service.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 md:p-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {service.features.map((feature, fIdx) => (
                                            <div key={fIdx} className="flex items-start gap-3">
                                                <span className="text-forest-500 dark:text-forest-400 text-xl flex-shrink-0 mt-1">✓</span>
                                                <span className="text-charcoal-700 dark:text-sand-200">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Free Forever Banner */}
                    <div className="bg-gradient-to-r from-forest-500 to-forest-700 rounded-[3rem] p-12 md:p-16 text-center mb-16 animate-fade-in-up shadow-2xl">
                        <div className="text-6xl mb-6 animate-float">🎁</div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">
                            All Features, Zero Cost
                        </h2>
                        <p className="text-xl text-forest-50 max-w-3xl mx-auto mb-8">
                            We believe smart travel planning should be accessible to everyone.
                            That's why TravelMate is <span className="font-bold text-white">completely free</span> with no hidden fees,
                            no premium tiers, and no credit card required.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-forest-50">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">✓</span>
                                <span>Unlimited trips</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">✓</span>
                                <span>All AI features</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">✓</span>
                                <span>No ads</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">✓</span>
                                <span>Forever free</span>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center animate-fade-in-up">
                        <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 dark:text-white mb-6 font-display">
                            Ready to Experience It Yourself?
                        </h2>
                        <p className="text-lg text-charcoal-600 dark:text-sand-300 mb-8 max-w-2xl mx-auto">
                            Start planning your dream trip in seconds. No signup required to try!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/plan"
                                className="inline-block bg-gradient-to-r from-forest-500 to-forest-700 text-white font-bold px-10 py-4 rounded-full hover:from-forest-600 hover:to-forest-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform duration-200 text-lg"
                            >
                                Start Planning Free →
                            </a>
                            <a
                                href="/about"
                                className="inline-block bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white font-bold px-10 py-4 rounded-full hover:bg-sand-100 dark:hover:bg-charcoal-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform duration-200 text-lg border-2 border-sand-200 dark:border-charcoal-700"
                            >
                                Learn More
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
