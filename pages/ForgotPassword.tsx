import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { Button } from '../components/Button';

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            setSent(true);
        } catch (error: any) {
            alert('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-sand-50 dark:bg-charcoal-950 flex items-center justify-center px-4 pt-20">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-charcoal-900 rounded-3xl p-8 shadow-xl border border-sand-200 dark:border-charcoal-700">

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-charcoal-900 dark:text-white mb-2">Forgot Password?</h1>
                        <p className="text-charcoal-600 dark:text-sand-300">
                            {sent ? "Check your email" : "Enter your email to reset your password"}
                        </p>
                    </div>

                    {sent ? (
                        <div className="text-center">
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 rounded-xl p-4 mb-6">
                                <p className="text-green-800 dark:text-green-300 text-sm">
                                    ✅ Password reset link sent! Check your email inbox and spam folder.
                                </p>
                            </div>
                            <Link to="/login">
                                <Button variant="outline" className="w-full">
                                    Back to Login
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-charcoal-700 dark:text-sand-200 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-sand-50 dark:bg-charcoal-800 border border-sand-200 dark:border-charcoal-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
                                Send Reset Link
                            </Button>

                            <div className="text-center pt-4">
                                <Link to="/login" className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300">
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
