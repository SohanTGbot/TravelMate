
import React from 'react';
import { Helmet } from 'react-helmet-async';

export const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - TravelMate</title>
        <meta name="description" content="Learn how TravelMate protects your privacy and handles your personal information." />
      </Helmet>
      <div className="min-h-screen bg-sand-50 dark:bg-charcoal-950 transition-colors pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-forest-500 to-forest-700 rounded-3xl mb-6 shadow-xl animate-float">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-charcoal-900 dark:text-white mb-4 font-display">
              Privacy Policy
            </h1>
            <p className="text-charcoal-500 dark:text-sand-400 text-lg">
              Your trust is our priority. Here's how we protect your data.
            </p>
            <div className="mt-6 inline-block px-4 py-2 bg-sand-100 dark:bg-charcoal-800 rounded-full text-sm font-bold text-charcoal-600 dark:text-sand-300">
              Last updated: January 2026
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {[
              {
                icon: "📊",
                title: "Information We Collect",
                content: [
                  "We collect information you provide directly to us when you:",
                  "• Create an account (name, email, password)",
                  "• Generate travel itineraries (destinations, preferences, budget)",
                  "• Interact with our AI assistant (chat history, feedback)",
                  "• Save or share trips",
                  "• Contact our support team",
                  "",
                  "We automatically collect certain information about your device and how you use TravelMate, including IP address, browser type, pages visited, and interaction patterns."
                ]
              },
              {
                icon: "⚙️",
                title: "How We Use Your Information",
                content: [
                  "Your data helps us deliver exceptional service:",
                  "• Generate personalized travel itineraries using Google Gemini AI",
                  "• Improve our AI models and recommendations",
                  "• Provide customer support and respond to inquiries",
                  "• Send important updates about your trips and our services",
                  "• Prevent fraud and enhance security",
                  "• Analyze usage patterns to improve user experience"
                ]
              },
              {
                icon: "🔐",
                title: "Data Security",
                content: [
                  "We implement industry-standard security measures:",
                  "• End-to-end encryption for sensitive data",
                  "• Secure authentication via Supabase",
                  "• Regular security audits and updates",
                  "• Access controls and monitoring",
                  "• Secure data centers with physical protection",
                  "",
                  "While we strive to protect your information, no method of transmission over the internet is 100% secure. We encourage you to use strong passwords and enable two-factor authentication."
                ]
              },
              {
                icon: "🤝",
                title: "Sharing Your Information",
                content: [
                  "We do not sell your personal information. We may share data with:",
                  "• Google AI Services (Gemini) - to generate your itineraries",
                  "• Supabase - our infrastructure and database provider",
                  "• Analytics providers - to understand usage patterns (anonymized)",
                  "• Legal authorities - when required by law or to protect rights",
                  "",
                  "When you mark a trip as 'Public' or share a trip link, that specific trip's information becomes accessible to others."
                ]
              },
              {
                icon: "🍪",
                title: "Cookies & Tracking",
                content: [
                  "We use cookies and similar technologies to:",
                  "• Remember your preferences and settings",
                  "• Analyze traffic and usage patterns",
                  "• Provide personalized content",
                  "• Maintain your login session",
                  "",
                  "You can control cookies through your browser settings. Disabling cookies may limit some functionality."
                ]
              },
              {
                icon: "✨",
                title: "Your Rights",
                content: [
                  "You have the right to:",
                  "• Access your personal data",
                  "• Correct inaccurate information",
                  "• Delete your account and data",
                  "• Export your trip data",
                  "• Opt-out of marketing communications",
                  "• Withdraw consent for data processing",
                  "",
                  "To exercise these rights, contact us at privacy@travelmate.com"
                ]
              },
              {
                icon: "👶",
                title: "Children's Privacy",
                content: [
                  "TravelMate is not intended for children under 13 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately."
                ]
              },
              {
                icon: "📝",
                title: "Changes to This Policy",
                content: [
                  "We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice on our website. Your continued use of TravelMate after changes constitutes acceptance of the updated policy."
                ]
              },
              {
                icon: "💌",
                title: "Contact Us",
                content: [
                  "Questions or concerns about your privacy?",
                  "Email: privacy@travelmate.com",
                  "Address: TravelMate Inc., [Your Address]",
                  "",
                  "We typically respond within 48 hours."
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
          <div className="mt-16 text-center bg-gradient-to-r from-forest-500 to-forest-700 rounded-[2rem] p-10 animate-fade-in-up">
            <h3 className="text-2xl font-bold text-white mb-3">Still Have Questions?</h3>
            <p className="text-forest-50 mb-6">We're here to help. Reach out anytime.</p>
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
