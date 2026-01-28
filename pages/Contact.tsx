
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../services/supabase';

export const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const { error } = await supabase
                .from('contact_messages')
                .insert([{
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message
                }]);

            if (error) throw error;

            setSubmitStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error('Error submitting contact form:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <>
            <Helmet>
                <title>Contact Us - TravelMate</title>
                <meta name="description" content="Get in touch with TravelMate. We're here to help with your travel planning needs." />
            </Helmet>
            <div className="min-h-screen bg-sand-50 dark:bg-charcoal-950 transition-colors pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="text-center mb-16 animate-fade-in-up">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-forest-500 to-forest-700 rounded-3xl mb-6 shadow-xl animate-float">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-charcoal-900 dark:text-white mb-4 font-display">
                            Get in Touch
                        </h1>
                        <p className="text-charcoal-500 dark:text-sand-400 text-lg max-w-2xl mx-auto">
                            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">

                        {/* Contact Info Cards */}
                        <div className="space-y-6">
                            {/* Address */}
                            <div className="bg-white dark:bg-charcoal-900 rounded-[2rem] p-8 border border-sand-200 dark:border-charcoal-700 shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-3xl mb-4 animate-float">
                                    📍
                                </div>
                                <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-2 font-display">Visit Us</h3>
                                <p className="text-charcoal-600 dark:text-sand-300 leading-relaxed">
                                    110, SN Banerjee Road<br />
                                    Esplanade, Taltala<br />
                                    Kolkata, West Bengal 700013<br />
                                    India
                                </p>
                            </div>

                            {/* Email */}
                            <div className="bg-white dark:bg-charcoal-900 rounded-[2rem] p-8 border border-sand-200 dark:border-charcoal-700 shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                                <div className="w-14 h-14 bg-gradient-to-br from-forest-500 to-forest-700 rounded-2xl flex items-center justify-center text-3xl mb-4 animate-float" style={{ animationDelay: '150ms' }}>
                                    ✉️
                                </div>
                                <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-2 font-display">Email Us</h3>
                                <a
                                    href="mailto:Sohanmandal2005@gmail.com"
                                    className="text-forest-600 dark:text-forest-400 hover:underline break-all"
                                >
                                    Sohanmandal2005@gmail.com
                                </a>
                                <p className="text-charcoal-500 dark:text-sand-400 text-sm mt-2">
                                    We'll respond within 24 hours
                                </p>
                            </div>

                            {/* Phone */}
                            <div className="bg-white dark:bg-charcoal-900 rounded-[2rem] p-8 border border-sand-200 dark:border-charcoal-700 shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                                <div className="w-14 h-14 bg-gradient-to-br from-clay-500 to-clay-700 rounded-2xl flex items-center justify-center text-3xl mb-4 animate-float" style={{ animationDelay: '250ms' }}>
                                    📞
                                </div>
                                <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-2 font-display">Call Us</h3>
                                <a
                                    href="tel:+918100412401"
                                    className="text-clay-600 dark:text-clay-400 hover:underline text-lg font-bold"
                                >
                                    +91 8100412401
                                </a>
                                <p className="text-charcoal-500 dark:text-sand-400 text-sm mt-2">
                                    Mon-Fri, 9AM-6PM IST
                                </p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2 bg-white dark:bg-charcoal-900 rounded-[2rem] p-8 md:p-10 border border-sand-200 dark:border-charcoal-700 shadow-xl animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                            <h2 className="text-3xl font-bold text-charcoal-900 dark:text-white mb-6 font-display">Send us a Message</h2>

                            {submitStatus === 'success' && (
                                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-800 dark:text-green-200 animate-fade-in-up">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">✅</span>
                                        <div>
                                            <p className="font-bold">Message sent successfully!</p>
                                            <p className="text-sm">We'll get back to you soon.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {submitStatus === 'error' && (
                                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-200 animate-fade-in-up">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">❌</span>
                                        <div>
                                            <p className="font-bold">Failed to send message</p>
                                            <p className="text-sm">Please try again or email us directly.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-bold text-charcoal-700 dark:text-sand-200 mb-2">
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-sand-200 dark:border-charcoal-700 bg-sand-50 dark:bg-charcoal-800 text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest-500 transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-bold text-charcoal-700 dark:text-sand-200 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-sand-200 dark:border-charcoal-700 bg-sand-50 dark:bg-charcoal-800 text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest-500 transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-bold text-charcoal-700 dark:text-sand-200 mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-sand-200 dark:border-charcoal-700 bg-sand-50 dark:bg-charcoal-800 text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest-500 transition-all"
                                        placeholder="How can we help?"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-bold text-charcoal-700 dark:text-sand-200 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={6}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-sand-200 dark:border-charcoal-700 bg-sand-50 dark:bg-charcoal-800 text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest-500 transition-all resize-none"
                                        placeholder="Tell us more about your inquiry..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-forest-500 to-forest-700 text-white font-bold py-4 px-8 rounded-xl hover:from-forest-600 hover:to-forest-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <span>Send Message</span>
                                            <span>→</span>
                                        </span>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* FAQ Quick Links */}
                    <div className="bg-gradient-to-r from-forest-500 to-forest-700 rounded-[2rem] p-10 text-center animate-fade-in-up">
                        <h3 className="text-2xl font-bold text-white mb-3">Looking for Quick Answers?</h3>
                        <p className="text-forest-50 mb-6">Check out our FAQ section for common questions.</p>
                        <a
                            href="/faq"
                            className="inline-block bg-white text-forest-700 font-bold px-8 py-3 rounded-full hover:bg-sand-50 transition-colors shadow-lg hover:shadow-xl hover:scale-105 transform duration-200"
                        >
                            Visit FAQ
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};
