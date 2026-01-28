
import React from 'react';
import { Helmet } from 'react-helmet-async';

export const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - TravelMate</title>
        <meta name="description" content="Read TravelMate's terms of service and understand your rights and responsibilities." />
      </Helmet>
      <div className="min-h-screen bg-sand-50 dark:bg-charcoal-950 transition-colors pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-clay-500 to-clay-700 rounded-3xl mb-6 shadow-xl animate-float">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-charcoal-900 dark:text-white mb-4 font-display">
              Terms of Service
            </h1>
            <p className="text-charcoal-500 dark:text-sand-400 text-lg">
              The rules that keep our community safe and thriving.
            </p>
            <div className="mt-6 inline-block px-4 py-2 bg-sand-100 dark:bg-charcoal-800 rounded-full text-sm font-bold text-charcoal-600 dark:text-sand-300">
              Last updated: January 2026
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {[
              {
                icon: "✅",
                title: "Acceptance of Terms",
                content: [
                  "By accessing or using TravelMate ('the Service'), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.",
                  "",
                  "These terms apply to all visitors, users, and others who access or use the Service."
                ]
              },
              {
                icon: "🤖",
                title: "AI-Generated Content",
                content: [
                  "TravelMate uses Google's Gemini AI to generate personalized travel itineraries. Important disclaimers:",
                  "• AI-generated content is for informational purposes only",
                  "• We strive for accuracy but cannot guarantee 100% correctness",
                  "• Always verify critical information (prices, hours, requirements) independently",
                  "• Travel conditions, regulations, and availability change constantly",
                  "• TravelMate is not liable for inaccuracies in AI-generated content",
                  "",
                  "Use the itineraries as a starting point and conduct your own research before booking."
                ]
              },
              {
                icon: "👤",
                title: "User Accounts",
                content: [
                  "To access certain features, you must create an account. You agree to:",
                  "• Provide accurate, current, and complete information",
                  "• Maintain the security of your password",
                  "• Accept responsibility for all activities under your account",
                  "• Notify us immediately of any unauthorized use",
                  "• Not share your account with others",
                  "",
                  "We reserve the right to suspend or terminate accounts that violate these terms."
                ]
              },
              {
                icon: "📱",
                title: "Acceptable Use",
                content: [
                  "You agree NOT to:",
                  "• Use the Service for any illegal purpose",
                  "• Harass, abuse, or harm other users",
                  "• Distribute malware or spam",
                  "• Attempt to hack, reverse engineer, or disrupt the Service",
                  "• Scrape data or use automated tools without permission",
                  "• Impersonate others or provide false information",
                  "• Upload offensive, inappropriate, or copyrighted content",
                  "",
                  "Violations may result in immediate account termination."
                ]
              },
              {
                icon: "🎁",
                title: "Free Service",
                content: [
                  "TravelMate is completely free to use with no charges or subscription fees:",
                  "• Unlimited trip planning and itinerary generation",
                  "• Full access to all AI features powered by Google Gemini",
                  "• Save and share unlimited trips",
                  "• Access to community features and discussions",
                  "• No credit card required",
                  "• No hidden fees or premium tiers",
                  "",
                  "We believe everyone should have access to smart travel planning."
                ]
              },
              {
                icon: "📝",
                title: "User Content & Sharing",
                content: [
                  "When you create or share content on TravelMate:",
                  "• You retain ownership of your content",
                  "• You grant us a license to use, display, and distribute it",
                  "• Public trips are visible to anyone with the link",
                  "• Comments and reviews may be moderated",
                  "• We may remove content that violates our policies",
                  "",
                  "Be respectful and considerate when sharing publicly."
                ]
              },
              {
                icon: "🔒",
                title: "Intellectual Property",
                content: [
                  "The Service and its original content, features, and functionality are owned by TravelMate and are protected by international copyright, trademark, and other intellectual property laws.",
                  "",
                  "You may not copy, modify, distribute, or create derivative works without our explicit permission."
                ]
              },
              {
                icon: "⚠️",
                title: "Disclaimers & Limitations",
                content: [
                  "THE SERVICE IS PROVIDED 'AS IS' WITHOUT WARRANTIES OF ANY KIND.",
                  "",
                  "TravelMate is not liable for:",
                  "• Travel disruptions, cancellations, or issues",
                  "• Third-party services (hotels, airlines, tours)",
                  "• Loss of data or service interruptions",
                  "• Indirect, incidental, or consequential damages",
                  "• Issues arising from following AI-generated itineraries",
                  "",
                  "We provide this service free of charge and to the maximum extent permitted by law, we shall not be liable for any damages."
                ]
              },
              {
                icon: "🌍",
                title: "International Use",
                content: [
                  "TravelMate is based in [Your Country]. By using the Service from other countries, you:",
                  "• Accept that your data may be processed in [Your Country]",
                  "• Agree to comply with local laws regarding online conduct",
                  "• Understand that some features may be restricted in certain regions"
                ]
              },
              {
                icon: "🔄",
                title: "Changes to Terms",
                content: [
                  "We may revise these terms at any time. Material changes will be notified via:",
                  "• Email to registered users",
                  "• Prominent notice on the website",
                  "• In-app notification",
                  "",
                  "Your continued use after changes constitutes acceptance of the new terms."
                ]
              },
              {
                icon: "⚖️",
                title: "Governing Law & Disputes",
                content: [
                  "These Terms are governed by the laws of [Your Jurisdiction], without regard to conflict of law provisions.",
                  "",
                  "Any disputes shall be resolved through binding arbitration, except where prohibited by law. You waive the right to participate in class action lawsuits."
                ]
              },
              {
                icon: "🛑",
                title: "Termination",
                content: [
                  "We may terminate or suspend your account immediately, without prior notice, for:",
                  "• Violation of these Terms",
                  "• Fraudulent or illegal activity",
                  "• Our business reasons",
                  "",
                  "Upon termination, your right to use the Service immediately ceases. We may delete your data after 30 days."
                ]
              },
              {
                icon: "📧",
                title: "Contact & Questions",
                content: [
                  "For questions about these Terms:",
                  "Email: legal@travelmate.com",
                  "Address: TravelMate Inc., [Your Address]",
                  "",
                  "We respond to legal inquiries within 5 business days."
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
          <div className="mt-16 text-center bg-gradient-to-r from-clay-500 to-clay-700 rounded-[2rem] p-10 animate-fade-in-up">
            <h3 className="text-2xl font-bold text-white mb-3">Ready to Start Planning?</h3>
            <p className="text-clay-50 mb-6">Join thousands of travelers using TravelMate.</p>
            <a
              href="/plan"
              className="inline-block bg-white text-clay-700 font-bold px-8 py-3 rounded-full hover:bg-sand-50 transition-colors shadow-lg hover:shadow-xl hover:scale-105 transform duration-200"
            >
              Plan Your Trip
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
