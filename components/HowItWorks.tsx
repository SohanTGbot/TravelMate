
import React from 'react';
import { Map, Sparkles, Share2, ArrowRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';

export const HowItWorks = () => {
    const navigate = useNavigate();

    const steps = [
        {
            id: 1,
            icon: <Map className="w-8 h-8 text-forest-600 dark:text-forest-400" />,
            title: "Share Your Vision",
            description: "Tell us where and when. Our smart form captures your style—from hidden cafes to mountain treks.",
            color: "bg-forest-50 dark:bg-forest-900/20",
            border: "border-forest-100 dark:border-forest-900/50",
            features: ["Smart Destination Search", "Budget Slider", "Interest Tags"]
        },
        {
            id: 2,
            icon: <Sparkles className="w-8 h-8 text-clay-600 dark:text-clay-400" />,
            title: "AI Crafts Your Plan",
            description: "Our engine analyzes thousands of options to build a personalized day-by-day itinerary just for you.",
            color: "bg-clay-50 dark:bg-clay-900/20",
            border: "border-clay-100 dark:border-clay-900/50",
            features: ["Route Optimization", "Local Hidden Gems", "Real-time Availability"]
        },
        {
            id: 3,
            icon: <Share2 className="w-8 h-8 text-sand-600 dark:text-sand-400" />,
            title: "Save & Explore",
            description: "Download your roadmap, share it with friends, or sync it to your profile for offline access.",
            color: "bg-sand-50 dark:bg-charcoal-800",
            border: "border-sand-100 dark:border-charcoal-700",
            features: ["PDF Export", "Mobile Sync", "Collaborative Sharing"]
        }
    ];

    return (
        <section className="py-32 bg-white dark:bg-charcoal-900 relative border-b border-sand-100 dark:border-white/5 overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-0 w-96 h-96 bg-forest-500/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
                <div className="absolute top-1/2 right-0 w-96 h-96 bg-clay-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <span className="inline-block py-1 px-3 rounded-full bg-forest-50 dark:bg-forest-900/30 text-forest-600 dark:text-forest-400 font-bold tracking-widest uppercase text-xs mb-4 border border-forest-100 dark:border-forest-900/50">Simple & Seamless</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-charcoal-900 dark:text-white mb-6 font-display">
                        Your Perfect Trip in <span className="text-forest-600 dark:text-forest-400 relative whitespace-nowrap">
                            3 Steps
                            <span className="absolute bottom-0 left-0 w-full h-3 bg-forest-200/50 dark:bg-forest-900/50 -z-10 transform -rotate-2"></span>
                        </span>
                    </h2>
                    <p className="text-charcoal-600 dark:text-sand-300 text-lg leading-relaxed">
                        We combine the power of advanced AI with curated travel expertise to turn your dream vacation into a ready-to-book reality.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-0.5 z-0">
                        <div className="w-full h-full bg-gradient-to-r from-forest-200 via-clay-200 to-sand-200 dark:from-charcoal-700 dark:via-charcoal-600 dark:to-charcoal-700 opacity-50"></div>
                        {/* Animated Dash */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                            <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-forest-400 to-transparent -translate-x-full animate-[shimmer_3s_infinite]"></div>
                        </div>
                    </div>

                    {steps.map((step) => (
                        <div key={step.id} className="relative z-10 group">

                            {/* Card Container */}
                            <div className={`
                                h-full flex flex-col items-center text-center p-8 rounded-[2.5rem] bg-white dark:bg-charcoal-900 
                                border ${step.border} transition-all duration-500 
                                hover:shadow-2xl hover:shadow-forest-900/5 dark:hover:shadow-black/30 hover:-translate-y-2
                            `}>

                                {/* Icon Circle */}
                                <div className={`w-24 h-24 rounded-3xl ${step.color} flex items-center justify-center mb-8 shadow-inner relative group-hover:scale-110 transition-transform duration-500`}>
                                    <div className="absolute -top-2 -right-2 bg-white dark:bg-charcoal-800 rounded-full p-1 shadow-sm border border-sand-100 dark:border-charcoal-700 font-bold text-xs text-charcoal-400 w-8 h-8 flex items-center justify-center">
                                        {step.id}
                                    </div>
                                    <div className="bg-white dark:bg-charcoal-900 p-4 rounded-2xl shadow-sm transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                        {step.icon}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-3 font-display">
                                    {step.title}
                                </h3>

                                <p className="text-charcoal-500 dark:text-charcoal-400 leading-relaxed mb-8 flex-grow">
                                    {step.description}
                                </p>

                                {/* Features List */}
                                <div className="space-y-2 w-full">
                                    {step.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-charcoal-600 dark:text-sand-300 bg-sand-50 dark:bg-charcoal-800/50 py-2 px-3 rounded-lg border border-transparent hover:border-forest-200 dark:hover:border-forest-900/50 transition-colors cursor-default">
                                            <div className="w-1.5 h-1.5 rounded-full bg-forest-400 flex-shrink-0"></div>
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 flex flex-col items-center justify-center gap-6">
                    <Button
                        onClick={() => navigate('/plan')}
                        size="lg"
                        className="!rounded-full px-10 py-5 !text-lg shadow-xl hover:shadow-2xl shadow-forest-900/20 hover:-translate-y-1 transition-all group"
                    >
                        Start Your Journey <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <button
                        onClick={() => navigate('/how-it-works')}
                        className="text-forest-600 dark:text-forest-400 font-bold text-sm hover:text-forest-700 dark:hover:text-forest-300 transition-colors flex items-center gap-1 group"
                    >
                        View Full Guide <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
};
