import React, { useState } from 'react';
import { TripPlan } from '../../types';
import { CommentSection } from './CommentSection';
import { useNavigate } from 'react-router-dom';

interface TripDetailModalProps {
    trip: TripPlan & {
        user?: { full_name: string; avatar_url?: string; id?: string };
        likes_count?: number;
        comments_count?: number;
        saves_count?: number;
    };
    isOpen: boolean;
    onClose: () => void;
    onLike?: () => void;
    onSave?: () => void;
}

export const TripDetailModal: React.FC<TripDetailModalProps> = ({
    trip,
    isOpen,
    onClose,
    onLike,
    onSave
}) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'itinerary' | 'comments'>('itinerary');

    if (!isOpen) return null;

    const handleCopyTrip = () => {
        // Navigate to plan page with trip data pre-filled
        navigate('/plan', { state: { copyTrip: trip } });
    };

    const handleViewProfile = () => {
        if (trip.user?.id) {
            navigate(`/profile/${trip.user.id}`);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white dark:bg-charcoal-900 rounded-[2rem] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative h-64 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200')] bg-cover bg-center opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all z-10"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Trip Title */}
                    <div className="absolute bottom-6 left-6 right-6">
                        <h2 className="text-4xl font-bold text-white mb-3 font-display">
                            {trip.itinerary?.[0]?.city || 'Amazing Trip'}
                        </h2>
                        <div className="flex gap-2 flex-wrap">
                            <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-white">
                                📅 {trip.itinerary?.length || 0} Days
                            </span>
                            <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-white">
                                💰 {trip.totalBudgetEstimation?.split(' ')[0] || 'N/A'}
                            </span>
                            <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-white">
                                ❤️ {trip.likes_count || 0} Likes
                            </span>
                        </div>
                    </div>
                </div>

                {/* Creator Info */}
                <div className="px-6 py-4 border-b border-sand-200 dark:border-charcoal-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-12 h-12 rounded-full bg-gradient-to-br from-forest-500 to-clay-600 flex items-center justify-center text-white font-bold cursor-pointer"
                                onClick={handleViewProfile}
                            >
                                {trip.user?.avatar_url ? (
                                    <img src={trip.user.avatar_url} alt={trip.user.full_name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    trip.user?.full_name?.charAt(0).toUpperCase() || 'T'
                                )}
                            </div>
                            <div>
                                <p className="font-semibold text-charcoal-900 dark:text-white cursor-pointer hover:text-purple-600 dark:hover:text-purple-400" onClick={handleViewProfile}>
                                    {trip.user?.full_name || 'Traveler'}
                                </p>
                                <p className="text-sm text-charcoal-500 dark:text-sand-400">
                                    Shared this amazing trip
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleCopyTrip}
                            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                        >
                            📋 Copy & Customize
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-6 py-3 border-b border-sand-200 dark:border-charcoal-700">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveTab('itinerary')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === 'itinerary'
                                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                : 'text-charcoal-600 dark:text-sand-300 hover:bg-sand-100 dark:hover:bg-charcoal-800'
                                }`}
                        >
                            📍 Itinerary
                        </button>
                        <button
                            onClick={() => setActiveTab('comments')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === 'comments'
                                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                : 'text-charcoal-600 dark:text-sand-300 hover:bg-sand-100 dark:hover:bg-charcoal-800'
                                }`}
                        >
                            💬 Comments ({trip.comments_count || 0})
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-400px)] p-6">
                    {activeTab === 'itinerary' ? (
                        <div className="space-y-6">
                            {/* Summary */}
                            {trip.summary && (
                                <div className="bg-sand-50 dark:bg-charcoal-800 rounded-xl p-6">
                                    <h3 className="font-bold text-charcoal-900 dark:text-white mb-2">Trip Summary</h3>
                                    <p className="text-charcoal-700 dark:text-sand-200">{trip.summary}</p>
                                </div>
                            )}

                            {/* Daily Itinerary */}
                            <div>
                                <h3 className="font-bold text-xl text-charcoal-900 dark:text-white mb-4">Daily Itinerary</h3>
                                <div className="space-y-4">
                                    {trip.itinerary?.map((day, index) => (
                                        <div key={index} className="bg-white dark:bg-charcoal-800 rounded-xl p-6 border border-sand-200 dark:border-charcoal-700">
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-bold">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-lg text-charcoal-900 dark:text-white mb-2">
                                                        Day {index + 1}: {day.city}
                                                    </h4>
                                                    {day.activities && day.activities.length > 0 && (
                                                        <ul className="space-y-2">
                                                            {day.activities.map((activity, actIndex) => (
                                                                <li key={actIndex} className="flex items-start gap-2 text-charcoal-700 dark:text-sand-200">
                                                                    <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                                                                    <span>{typeof activity === 'string' ? activity : activity.description || 'Activity'}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                    {day.accommodation && (
                                                        <div className="mt-3 text-sm text-charcoal-600 dark:text-sand-300">
                                                            🏨 <strong>Stay:</strong> {typeof day.accommodation === 'string' ? day.accommodation : day.accommodation.name || 'Accommodation'}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Budget Breakdown */}
                            {trip.totalBudgetEstimation && (
                                <div className="bg-sand-50 dark:bg-charcoal-800 rounded-xl p-6">
                                    <h3 className="font-bold text-charcoal-900 dark:text-white mb-2">Total Budget</h3>
                                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                        {trip.totalBudgetEstimation}
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <CommentSection
                            itemType="trip"
                            itemId={trip.id}
                            onCommentAdded={() => {
                                // Refresh trip data if needed
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
