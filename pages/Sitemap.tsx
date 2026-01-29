import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const SitemapSection = ({ title, links }: { title: string, links: { name: string, path: string }[] }) => (
    <div className="bg-white dark:bg-stone-800 rounded-2xl p-6 shadow-sm border border-stone-200 dark:border-stone-700">
        <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
            {title}
        </h3>
        <ul className="space-y-3">
            {links.map((link) => (
                <li key={link.path}>
                    <Link
                        to={link.path}
                        className="group flex items-center gap-2 text-stone-600 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-600 group-hover:bg-emerald-500 transition-colors"></span>
                        {link.name}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);

export const Sitemap = () => {
    const sections = [
        {
            title: "Main",
            links: [
                { name: "Home", path: "/" },
                { name: "Plan Your Trip", path: "/plan" },
                { name: "My Trips", path: "/my-trips" },
                { name: "Community", path: "/community" },
            ]
        },
        {
            title: "Discover",
            links: [
                { name: "Destinations", path: "/destinations" },
                { name: "Services", path: "/services" },
                { name: "Travel Blog", path: "/blog" },
                { name: "Reviews", path: "/reviews" },
            ]
        },
        {
            title: "Company",
            links: [
                { name: "About Us", path: "/about" },
                { name: "Our Careers", path: "/careers" },
                { name: "Contact Us", path: "/contact" },
                { name: "Admin Portal", path: "/admin" },
            ]
        },
        {
            title: "Support",
            links: [
                { name: "Help Center / FAQ", path: "/faq" },
                { name: "Forgot Password", path: "/forgot-password" },
            ]
        },
        {
            title: "Legal",
            links: [
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Terms of Service", path: "/terms" },
                { name: "Cookie Policy", path: "/cookies" },
            ]
        },
        {
            title: "Account",
            links: [
                { name: "Login", path: "/login" },
                { name: "Register", path: "/register" },
                { name: "Profile", path: "/profile" },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <Helmet>
                <title>Sitemap | TravelMate</title>
                <meta name="description" content="Overview of all pages available on TravelMate AI." />
            </Helmet>

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl rounded-2xl md:text-5xl font-bold font-display text-stone-900 dark:text-white mb-4">
                        Sitemap
                    </h1>
                    <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
                        Explore every corner of TravelMate. Find your way to our tools, guides, and policies.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sections.map((section) => (
                        <SitemapSection key={section.title} title={section.title} links={section.links} />
                    ))}
                </div>
            </div>
        </div>
    );
};
