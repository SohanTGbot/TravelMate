import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { Button } from '../components/Button';

export const ResetPassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        try {
            setLoading(true);
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            alert('✅ Password reset successful!');
            navigate('/login');
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-charcoal-900 dark:text-white mb-2">Reset Password</h1>
                        <p className="text-charcoal-600 dark:text-sand-300">
                            Enter your new password
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-charcoal-700 dark:text-sand-200 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-sand-50 dark:bg-charcoal-800 border border-sand-200 dark:border-charcoal-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                                placeholder="Enter new password"
                                required
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-charcoal-700 dark:text-sand-200 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-sand-50 dark:bg-charcoal-800 border border-sand-200 dark:border-charcoal-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                                placeholder="Confirm new password"
                                required
                                minLength={6}
                            />
                        </div>

                        <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
                            Reset Password
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};
