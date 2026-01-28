import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';

interface Review {
    id: string;
    user_id: string;
    rating: number;
    comment: string;
    approved: boolean;
    created_at: string;
    profiles?: {
        full_name: string;
        email: string;
    };
}

export const ReviewsPage = () => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*, profiles:user_id(full_name, email)')
                .eq('approved', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReviews(data || []);
        } catch (error) {
            console.error('Error loading reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to submit a review');
            return;
        }

        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('reviews')
                .insert([{
                    user_id: user.id,
                    rating,
                    comment,
                    approved: false
                }]);

            if (error) throw error;

            alert('Review submitted! It will be visible after admin approval.');
            setComment('');
            setRating(5);
            setShowForm(false);
        } catch (error: any) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-charcoal-950 pt-32 pb-20">
            <div className="max-w-5xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Customer Reviews
                    </h1>
                    <p className="text-xl text-charcoal-400">
                        See what our travelers are saying
                    </p>
                </div>

                {/* Submit Review Button */}
                {user && !showForm && (
                    <div className="text-center mb-12">
                        <Button onClick={() => setShowForm(true)}>
                            ✍️ Write a Review
                        </Button>
                    </div>
                )}

                {/* Review Form */}
                {showForm && (
                    <div className="bg-charcoal-900 border border-white/10 rounded-xl p-8 mb-12">
                        <h2 className="text-2xl font-bold mb-6">Share Your Experience</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-3">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="text-4xl transition-all"
                                        >
                                            {star <= rating ? '⭐' : '☆'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Your Review</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={6}
                                    className="w-full bg-charcoal-950 p-4 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500"
                                    placeholder="Tell us about your experience..."
                                    required
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? 'Submitting...' : 'Submit Review'}
                                </Button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-6 py-3 rounded-xl bg-charcoal-800 hover:bg-charcoal-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Reviews List */}
                {loading ? (
                    <div className="text-center text-charcoal-400">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                    <div className="text-center text-charcoal-400 py-12">
                        <p className="text-lg">No reviews yet. Be the first to share your experience!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-charcoal-900 border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg">
                                            {review.profiles?.full_name || 'Anonymous'}
                                        </h3>
                                        <div className="text-yellow-400 text-xl">
                                            {'⭐'.repeat(review.rating)}
                                        </div>
                                    </div>
                                    <div className="text-sm text-charcoal-500">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <p className="text-charcoal-300 leading-relaxed">
                                    {review.comment}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Login CTA */}
                {!user && (
                    <div className="mt-12 text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-8">
                        <h3 className="text-2xl font-bold mb-3">Want to share your experience?</h3>
                        <p className="text-charcoal-400 mb-6">
                            Login to write a review
                        </p>
                        <a
                            href="/login"
                            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
                        >
                            Login Now
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};
