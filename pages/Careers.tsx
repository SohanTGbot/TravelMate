
import React from 'react';
import { Helmet } from 'react-helmet-async';

export const Careers = () => {
    return (
        <>
            <Helmet>
                <title>Careers - TravelMate</title>
                <meta name="description" content="Join the TravelMate team and help us revolutionize travel planning with AI. Explore career opportunities." />
            </Helmet>
            <div className="min-h-screen bg-sand-50 dark:bg-charcoal-950 transition-colors pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Hero */}
                    <div className="text-center mb-20 animate-fade-in-up">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full mb-8 shadow-2xl animate-float">
                            <span className="text-5xl">🚀</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-charcoal-900 dark:text-white mb-6 font-display">
                            Join Our Journey
                        </h1>
                        <p className="text-xl text-charcoal-600 dark:text-sand-300 max-w-3xl mx-auto leading-relaxed">
                            Help us build the future of travel planning. We're looking for passionate people who want to make travel accessible to everyone.
                        </p>
                    </div>

                    {/* Why Work Here */}
                    <div className="mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-charcoal-900 dark:text-white text-center mb-12 font-display animate-fade-in-up">
                            Why TravelMate?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: "🌍",
                                    title: "Global Impact",
                                    description: "Your work helps millions of travelers discover the world. Make a real difference in how people explore and experience new places."
                                },
                                {
                                    icon: "🤖",
                                    title: "Cutting-Edge AI",
                                    description: "Work with the latest AI technology from Google Gemini. Push the boundaries of what's possible in travel tech."
                                },
                                {
                                    icon: "🎯",
                                    title: "Mission-Driven",
                                    description: "We're committed to making travel planning free and accessible to everyone. Your work serves a greater purpose."
                                },
                                {
                                    icon: "🚀",
                                    title: "Fast Growth",
                                    description: "Join a rapidly growing startup where your contributions have immediate impact and visibility."
                                },
                                {
                                    icon: "🤝",
                                    title: "Collaborative Culture",
                                    description: "Work with a passionate, diverse team that values your ideas and encourages innovation."
                                },
                                {
                                    icon: "📚",
                                    title: "Learn & Grow",
                                    description: "Continuous learning opportunities, mentorship, and room to develop your skills and career."
                                }
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white dark:bg-charcoal-900 rounded-[2rem] p-8 border border-sand-200 dark:border-charcoal-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in-up"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    <div className="text-5xl mb-4 animate-float" style={{ animationDelay: `${idx * 150}ms` }}>
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-3 font-display">
                                        {item.title}
                                    </h3>
                                    <p className="text-charcoal-600 dark:text-sand-300 text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Perks & Benefits */}
                    <div className="mb-20 bg-gradient-to-r from-purple-500 to-purple-700 rounded-[3rem] p-12 md:p-16 animate-fade-in-up shadow-2xl">
                        <h2 className="text-4xl font-bold text-white text-center mb-12 font-display">
                            Perks & Benefits
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {[
                                { icon: "💰", text: "Competitive salary and equity" },
                                { icon: "🏖️", text: "Flexible vacation policy" },
                                { icon: "🏠", text: "Remote-first culture" },
                                { icon: "⚕️", text: "Health & wellness benefits" },
                                { icon: "💻", text: "Latest tech & tools" },
                                { icon: "🎓", text: "Learning & development budget" },
                                { icon: "✈️", text: "Travel stipend (of course!)" },
                                { icon: "🎉", text: "Team events & retreats" }
                            ].map((perk, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-white"
                                >
                                    <span className="text-3xl">{perk.icon}</span>
                                    <span className="font-medium text-lg">{perk.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Open Positions */}
                    <div className="mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-charcoal-900 dark:text-white text-center mb-12 font-display animate-fade-in-up">
                            Open Positions
                        </h2>

                        {/* Example positions - replace with actual job listings */}
                        <div className="space-y-6 max-w-4xl mx-auto">
                            {[
                                {
                                    title: "Senior Full-Stack Engineer",
                                    department: "Engineering",
                                    location: "Remote",
                                    type: "Full-time",
                                    description: "Build and scale our AI-powered travel platform using React, Node.js, and Google Gemini AI."
                                },
                                {
                                    title: "Product Designer",
                                    department: "Design",
                                    location: "Remote",
                                    type: "Full-time",
                                    description: "Create beautiful, intuitive experiences that delight travelers and make trip planning effortless."
                                },
                                {
                                    title: "AI/ML Engineer",
                                    department: "Engineering",
                                    location: "Remote",
                                    type: "Full-time",
                                    description: "Optimize our AI models and develop new features using Google Gemini and other cutting-edge technologies."
                                }
                            ].map((job, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white dark:bg-charcoal-900 rounded-[2rem] p-8 border border-sand-200 dark:border-charcoal-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-2 font-display">
                                                {job.title}
                                            </h3>
                                            <div className="flex flex-wrap gap-3 text-sm">
                                                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">
                                                    {job.department}
                                                </span>
                                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                                                    {job.location}
                                                </span>
                                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-medium">
                                                    {job.type}
                                                </span>
                                            </div>
                                        </div>
                                        <a
                                            href={`mailto:Sohanmandal2005@gmail.com?subject=Application%20for%20${encodeURIComponent(job.title)}&body=Dear%20TravelMate%20Team%2C%0A%0AI%20am%20interested%20in%20applying%20for%20the%20${encodeURIComponent(job.title)}%20position.%0A%0APlease%20find%20my%20CV%2FResume%20attached.%0A%0ABest%20regards`}
                                            className="inline-block bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold px-6 py-3 rounded-xl hover:from-purple-600 hover:to-purple-800 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                                        >
                                            Send CV via Email →
                                        </a>
                                    </div>
                                    <p className="text-charcoal-600 dark:text-sand-300 leading-relaxed">
                                        {job.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Don't See a Fit */}
                    <div className="text-center bg-gradient-to-r from-forest-500 to-forest-700 rounded-[3rem] p-12 md:p-16 animate-fade-in-up shadow-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">
                            Don't See the Perfect Role?
                        </h2>
                        <p className="text-xl text-forest-50 mb-8 max-w-2xl mx-auto">
                            We're always looking for talented people who share our passion.
                            Send us your resume and tell us how you'd like to contribute!
                        </p>
                        <a
                            href="mailto:Sohanmandal2005@gmail.com?subject=General%20Application%20-%20TravelMate%20Careers&body=Dear%20TravelMate%20Team%2C%0A%0AI%20am%20interested%20in%20joining%20TravelMate.%0A%0APlease%20find%20my%20CV%2FResume%20attached.%0A%0ABest%20regards"
                            className="inline-block bg-white text-forest-700 font-bold px-10 py-4 rounded-full hover:bg-sand-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform duration-200 text-lg"
                        >
                            Send Your CV →
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};
