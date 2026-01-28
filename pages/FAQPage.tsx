
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

export const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            category: "General",
            questions: [
                {
                    q: "What is TravelMate?",
                    a: "TravelMate is a free AI-powered travel planning platform that creates personalized trip itineraries in seconds using Google's Gemini AI. Simply tell us your destination, dates, budget, and preferences, and we'll generate a complete day-by-day plan for you."
                },
                {
                    q: "Is TravelMate really free?",
                    a: "Yes! TravelMate is 100% free with no hidden fees, no premium tiers, and no credit card required. We believe everyone should have access to smart travel planning, so all features are completely free forever."
                },
                {
                    q: "Do I need to create an account?",
                    a: "You can try TravelMate without an account! However, creating a free account lets you save trips, access them across devices, share with friends, and participate in community discussions."
                },
                {
                    q: "How does the AI work?",
                    a: "We use Google's Gemini AI, which analyzes millions of data points including travel guides, reviews, weather patterns, and user preferences to create personalized itineraries. The AI learns from your inputs to provide increasingly accurate recommendations."
                }
            ]
        },
        {
            category: "Trip Planning",
            questions: [
                {
                    q: "How long does it take to generate an itinerary?",
                    a: "Most itineraries are generated in under 30 seconds! The AI works incredibly fast, analyzing your preferences and creating a complete day-by-day plan almost instantly."
                },
                {
                    q: "Can I customize my itinerary?",
                    a: "Absolutely! You have full control. Drag-and-drop activities to reorder them, edit times, add or remove stops, modify accommodations, and add personal notes. Your trip, your way."
                },
                {
                    q: "What information do I need to provide?",
                    a: "At minimum, you need a destination and travel dates. For better results, also share your budget, interests (adventure, culture, food, etc.), travel style (luxury, budget, mid-range), and any specific requirements or preferences."
                },
                {
                    q: "Can I plan multi-city trips?",
                    a: "Yes! You can specify multiple destinations, and the AI will create an itinerary that includes travel between cities, optimal timing, and activities in each location."
                },
                {
                    q: "How accurate are the budget estimates?",
                    a: "Our AI provides estimates based on current average prices, but actual costs can vary. We recommend using our estimates as a guideline and verifying prices independently before booking."
                }
            ]
        },
        {
            category: "Account & Data",
            questions: [
                {
                    q: "How do I save my trips?",
                    a: "Create a free account, then click the 'Save Trip' button on any itinerary. Your trips will be stored securely and accessible from any device when you log in."
                },
                {
                    q: "Can I access my trips offline?",
                    a: "Yes! Click the 'Offline' button to download your trip for offline access. You can also export as HTML or add to your calendar (.ics format) for easy offline viewing."
                },
                {
                    q: "Is my data secure?",
                    a: "Absolutely. We use industry-standard encryption and secure authentication via Supabase. We never sell your personal information to third parties. Read our Privacy Policy for full details."
                },
                {
                    q: "Can I delete my account?",
                    a: "Yes, you can delete your account anytime from your Profile settings. This will permanently remove all your data from our servers."
                }
            ]
        },
        {
            category: "Sharing & Community",
            questions: [
                {
                    q: "How do I share my trip with friends?",
                    a: "Click the 'Share' button on your trip, then choose to make it public or generate a private share link. You can share via WhatsApp, email, or copy the link to share anywhere."
                },
                {
                    q: "What's the difference between public and private trips?",
                    a: "Public trips appear in the Community section and can be discovered by anyone. Private trips are only accessible to people with the direct share link. You can toggle this setting anytime."
                },
                {
                    q: "Can others edit my shared trips?",
                    a: "No, shared trips are view-only. Others can comment and discuss, but only you can edit your trip. If someone wants to modify it, they can download a copy and customize it themselves."
                },
                {
                    q: "How do trip comments work?",
                    a: "Once you save a trip, you and others can leave comments and suggestions. This is great for getting feedback from travel companions or experienced travelers who've been to your destination."
                }
            ]
        },
        {
            category: "Technical",
            questions: [
                {
                    q: "What devices does TravelMate work on?",
                    a: "TravelMate works on all modern browsers (Chrome, Firefox, Safari, Edge) on desktop, tablet, and mobile devices. We're also a Progressive Web App (PWA), so you can install it on your phone for an app-like experience."
                },
                {
                    q: "Do I need an internet connection?",
                    a: "You need internet to generate new trips and sync data. However, you can download trips for offline access, so you can view your itinerary anywhere without internet."
                },
                {
                    q: "Why isn't my trip generating?",
                    a: "This could be due to network issues, server load, or API limits. Try refreshing the page and generating again. If the problem persists, contact us at Sohanmandal2005@gmail.com."
                },
                {
                    q: "Can I use TravelMate in my language?",
                    a: "Currently, TravelMate is available in English. We're working on adding more languages in the future. The AI can understand and generate itineraries for destinations worldwide, regardless of local language."
                }
            ]
        },
        {
            category: "Features",
            questions: [
                {
                    q: "What's the Spotify integration?",
                    a: "We embed curated Spotify playlists based on your destination to help you discover local music and set the mood for your trip. It's a fun way to immerse yourself in the culture!"
                },
                {
                    q: "How do interactive maps work?",
                    a: "Each trip includes an interactive map showing your daily route, activity locations, and points of interest. You can zoom, pan, and click on markers to see details about each stop."
                },
                {
                    q: "What are packing tips?",
                    a: "Based on your destination, dates, and planned activities, we provide a smart packing checklist. You can check off items as you pack and customize the list to your needs."
                },
                {
                    q: "Can I export my trip to Google Calendar?",
                    a: "Yes! Click 'Export' to download an .ics file that works with Google Calendar, Apple Calendar, Outlook, and most other calendar apps."
                }
            ]
        }
    ];

    return (
        <>
            <Helmet>
                <title>FAQ - TravelMate</title>
                <meta name="description" content="Frequently asked questions about TravelMate - AI travel planning, features, account management, and more." />
            </Helmet>
            <div className="min-h-screen bg-sand-50 dark:bg-charcoal-950 transition-colors pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="text-center mb-16 animate-fade-in-up">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl mb-6 shadow-xl animate-float">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-charcoal-900 dark:text-white mb-4 font-display">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-charcoal-500 dark:text-sand-400 text-lg">
                            Find answers to common questions about TravelMate
                        </p>
                    </div>

                    {/* FAQ Sections */}
                    <div className="space-y-12">
                        {faqs.map((section, sIdx) => (
                            <div key={sIdx} className="animate-fade-in-up" style={{ animationDelay: `${sIdx * 100}ms` }}>
                                <h2 className="text-3xl font-bold text-charcoal-900 dark:text-white mb-6 font-display flex items-center gap-3">
                                    <span className="w-2 h-8 bg-gradient-to-b from-forest-500 to-forest-700 rounded-full"></span>
                                    {section.category}
                                </h2>
                                <div className="space-y-4">
                                    {section.questions.map((faq, qIdx) => {
                                        const globalIndex = faqs.slice(0, sIdx).reduce((acc, s) => acc + s.questions.length, 0) + qIdx;
                                        const isOpen = openIndex === globalIndex;

                                        return (
                                            <div
                                                key={qIdx}
                                                className="bg-white dark:bg-charcoal-900 rounded-2xl border border-sand-200 dark:border-charcoal-700 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                                            >
                                                <button
                                                    onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                                                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-sand-50 dark:hover:bg-charcoal-800 transition-colors"
                                                >
                                                    <span className="font-bold text-charcoal-900 dark:text-white pr-4">
                                                        {faq.q}
                                                    </span>
                                                    <svg
                                                        className={`w-6 h-6 text-forest-600 dark:text-forest-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                                {isOpen && (
                                                    <div className="px-6 pb-5 text-charcoal-600 dark:text-sand-300 leading-relaxed animate-fade-in-up border-t border-sand-100 dark:border-charcoal-800 pt-4">
                                                        {faq.a}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Still Have Questions CTA */}
                    <div className="mt-16 bg-gradient-to-r from-forest-500 to-forest-700 rounded-[2rem] p-10 text-center animate-fade-in-up">
                        <h3 className="text-2xl font-bold text-white mb-3">Still Have Questions?</h3>
                        <p className="text-forest-50 mb-6">We're here to help! Reach out to our team.</p>
                        <a
                            href="/contact"
                            className="inline-block bg-white text-forest-700 font-bold px-8 py-3 rounded-full hover:bg-sand-50 transition-colors shadow-lg hover:shadow-xl hover:scale-105 transform duration-200"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};
