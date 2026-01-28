
import React from 'react';
import { Helmet } from 'react-helmet-async';

export const Cookies = () => {
    return (
        <>
            <Helmet>
                <title>Cookie Policy - TravelMate</title>
                <meta name="description" content="Learn about how TravelMate uses cookies to improve your experience." />
            </Helmet>
            <div className="min-h-screen bg-sand-50 dark:bg-charcoal-950 transition-colors pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-16 animate-fade-in-up">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-700 rounded-3xl mb-6 shadow-xl animate-float">
                            <span className="text-5xl">🍪</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-charcoal-900 dark:text-white mb-4 font-display">
                            Cookie Policy
                        </h1>
                        <p className="text-charcoal-500 dark:text-sand-400 text-lg">
                            Understanding the cookies we use and why.
                        </p>
                        <div className="mt-6 inline-block px-4 py-2 bg-sand-100 dark:bg-charcoal-800 rounded-full text-sm font-bold text-charcoal-600 dark:text-sand-300">
                            Last updated: January 2026
                        </div>
                    </div>

                    {/* Intro */}
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-charcoal-900 dark:to-charcoal-800 rounded-[2rem] p-8 mb-8 border border-orange-200 dark:border-charcoal-700 animate-fade-in-up">
                        <p className="text-charcoal-700 dark:text-sand-200 text-lg leading-relaxed">
                            TravelMate uses cookies and similar technologies to provide you with a better, faster, and safer experience. This policy explains what cookies are, how we use them, and your choices regarding cookies.
                        </p>
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-8">
                        {[
                            {
                                icon: "🔍",
                                title: "What Are Cookies?",
                                content: [
                                    "Cookies are small text files that are placed on your device when you visit a website. They help websites remember information about your visit, like your preferences and login status.",
                                    "",
                                    "Cookies can be:",
                                    "• First-party cookies - Set by TravelMate directly",
                                    "• Third-party cookies - Set by external services we use",
                                    "• Session cookies - Deleted when you close your browser",
                                    "• Persistent cookies - Remain until deleted or expired"
                                ]
                            },
                            {
                                icon: "🎯",
                                title: "How We Use Cookies",
                                content: [
                                    "We use cookies for several purposes:",
                                    "",
                                    "1. **Essential Cookies** (Required)",
                                    "• Maintain your login session",
                                    "• Remember your trip planning progress",
                                    "• Secure your account and prevent fraud",
                                    "• Enable core website functionality",
                                    "",
                                    "2. **Preference Cookies** (Optional)",
                                    "• Remember your dark/light mode choice",
                                    "• Save your language and currency preferences",
                                    "• Store your map zoom and location settings",
                                    "",
                                    "3. **Analytics Cookies** (Optional)",
                                    "• Understand how you use TravelMate",
                                    "• Identify popular features and pain points",
                                    "• Measure performance and loading times",
                                    "• Improve our AI recommendations",
                                    "",
                                    "4. **Marketing Cookies** (Optional)",
                                    "• Show you relevant ads on other platforms",
                                    "• Track campaign effectiveness",
                                    "• Personalize content based on your interests"
                                ]
                            },
                            {
                                icon: "📋",
                                title: "Specific Cookies We Use",
                                content: [
                                    "**Session Management:**",
                                    "• sb-access-token - Your authentication token (Supabase)",
                                    "• sb-refresh-token - Keeps you logged in",
                                    "",
                                    "**User Preferences:**",
                                    "• theme - Your dark/light mode choice",
                                    "• currency - Your preferred currency",
                                    "• offline_trips - Locally saved trips",
                                    "",
                                    "**Analytics (Google Analytics):**",
                                    "• _ga - Distinguish unique users",
                                    "• _gid - Distinguish unique users (24h)",
                                    "• _gat - Throttle request rate",
                                    "",
                                    "**Performance:**",
                                    "• map_state - Remember your map position",
                                    "• trip_draft - Auto-save your planning progress"
                                ]
                            },
                            {
                                icon: "🛠️",
                                title: "Third-Party Cookies",
                                content: [
                                    "Some features require third-party services that set their own cookies:",
                                    "",
                                    "• **Google Gemini AI** - Generates your itineraries",
                                    "• **Supabase** - Authentication and database",
                                    "• **Google Analytics** - Usage statistics (if enabled)",
                                    "• **Spotify** - Music widget functionality",
                                    "• **OpenStreetMap/Leaflet** - Interactive maps",
                                    "",
                                    "These services have their own privacy policies and cookie policies. We recommend reviewing them."
                                ]
                            },
                            {
                                icon: "⚙️",
                                title: "Managing Your Cookies",
                                content: [
                                    "You have several options to control cookies:",
                                    "",
                                    "**Browser Settings:**",
                                    "Most browsers allow you to:",
                                    "• Block all cookies",
                                    "• Delete existing cookies",
                                    "• Allow cookies only from specific sites",
                                    "• Get notifications when cookies are set",
                                    "",
                                    "**Our Cookie Settings:**",
                                    "You can manage optional cookies through our settings panel (coming soon).",
                                    "",
                                    "**Do Not Track:**",
                                    "We respect browser 'Do Not Track' signals for analytics cookies.",
                                    "",
                                    "⚠️ **Note:** Blocking essential cookies will prevent you from using core features like login and trip saving."
                                ]
                            },
                            {
                                icon: "📱",
                                title: "Mobile Apps & Local Storage",
                                content: [
                                    "In addition to cookies, we use browser local storage and session storage for:",
                                    "• Offline trip access (PWA)",
                                    "• Faster page loads",
                                    "• Temporary data caching",
                                    "",
                                    "This data stays on your device and is never transmitted without your action."
                                ]
                            },
                            {
                                icon: "🌐",
                                title: "International Data Transfers",
                                content: [
                                    "Some cookies may transfer data internationally:",
                                    "• Google services (USA)",
                                    "• Supabase servers (based on region)",
                                    "",
                                    "These transfers comply with applicable data protection laws including GDPR."
                                ]
                            },
                            {
                                icon: "🔄",
                                title: "Changes to This Policy",
                                content: [
                                    "We may update this Cookie Policy to reflect changes in technology or law. Updates will be posted here with a new 'Last Updated' date.",
                                    "",
                                    "Significant changes will be announced via email or website notice."
                                ]
                            },
                            {
                                icon: "💬",
                                title: "Questions?",
                                content: [
                                    "For cookie-related questions:",
                                    "Email: privacy@travelmate.com",
                                    "Subject: 'Cookie Policy Inquiry'",
                                    "",
                                    "We're happy to explain our cookie practices in more detail."
                                ]
                            }
                        ].map((section, idx) => (
                            <div
                                key={idx}
                                className="bg-white dark:bg-charcoal-900 rounded-[2rem] p-8 md:p-10 border border-sand-200 dark:border-charcoal-700 shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in-up"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-4xl flex-shrink-0 animate-float" style={{ animationDelay: `${idx * 150}ms` }}>
                                        {section.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-4 font-display">
                                            {section.title}
                                        </h2>
                                        <div className="text-charcoal-600 dark:text-sand-300 leading-relaxed space-y-2">
                                            {section.content.map((line, i) => (
                                                <p key={i} className={line === "" ? "h-2" : ""}>
                                                    {line}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer CTA */}
                    <div className="mt-16 text-center bg-gradient-to-r from-orange-500 to-orange-700 rounded-[2rem] p-10 animate-fade-in-up">
                        <h3 className="text-2xl font-bold text-white mb-3">Cookie Preferences</h3>
                        <p className="text-orange-50 mb-6">Manage your cookie settings anytime.</p>
                        <button
                            onClick={() => alert('Cookie settings panel coming soon!')}
                            className="inline-block bg-white text-orange-700 font-bold px-8 py-3 rounded-full hover:bg-sand-50 transition-colors shadow-lg hover:shadow-xl hover:scale-105 transform duration-200"
                        >
                            Manage Cookies
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
