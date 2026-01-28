import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TripPlan } from '../../types';
import { communityService } from '../../services/communityService';
import { useAuth } from '../../context/AuthContext';

interface TripCardProps {
    trip: TripPlan & {
        user?: { full_name: string; avatar_url?: string };
        likes_count?: number;
        comments_count?: number;
        saves_count?: number;
    };
    onLike?: () => void;
    onSave?: () => void;
    onComment?: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onLike, onSave, onComment }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [likesCount, setLikesCount] = useState(trip.likes_count || 0);
    const [savesCount, setSavesCount] = useState(trip.saves_count || 0);
    const [commentsCount, setCommentsCount] = useState(trip.comments_count || 0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        checkUserInteractions();
    }, [trip.id, user]);

    const checkUserInteractions = async () => {
        if (!user || !trip.id) return;
        try {
            const [liked, saved] = await Promise.all([
                communityService.hasLiked('trip', trip.id),
                communityService.isSaved('trip', trip.id)
            ]);
            setIsLiked(liked);
            setIsSaved(saved);
        } catch (error) {
            console.error('Failed to check interactions:', error);
        }
    };

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            if (isLiked) {
                await communityService.unlikeItem('trip', trip.id);
                setLikesCount(prev => Math.max(0, prev - 1));
                setIsLiked(false);
            } else {
                await communityService.likeItem('trip', trip.id);
                setLikesCount(prev => prev + 1);
                setIsLiked(true);
            }
            onLike?.();
        } catch (error) {
            console.error('Failed to like trip:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            if (isSaved) {
                await communityService.unsaveItem('trip', trip.id);
                setSavesCount(prev => Math.max(0, prev - 1));
                setIsSaved(false);
            } else {
                await communityService.saveItem('trip', trip.id);
                setSavesCount(prev => prev + 1);
                setIsSaved(true);
            }
            onSave?.();
        } catch (error) {
            console.error('Failed to save trip:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = () => {
        navigate(`/result`, { state: { tripPlan: trip } });
    };

    const handleCommentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onComment?.();
    };

    const destination = trip.itinerary?.[0]?.city || 'Unknown Destination';
    const duration = trip.itinerary?.length || 0;
    const budget = trip.totalBudgetEstimation?.split(' ')[0] || 'N/A';

    return (
        <div
            onClick={handleCardClick}
            className="group cursor-pointer bg-white dark:bg-charcoal-900 rounded-[2rem] overflow-hidden border border-sand-200 dark:border-charcoal-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
        >
            {/* Trip Header Image */}
            <div className="relative h-48 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                {/* Destination Name Watermark */}
                <div className="absolute inset-0 flex items-center justify-center text-white/10 text-8xl font-display font-bold select-none">
                    {destination.slice(0, 3).toUpperCase()}
                </div>

                {/* Trip Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4 z-10">
                    <h3 className="text-2xl font-bold text-white mb-2 font-display group-hover:text-purple-200 transition-colors">
                        {destination}
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                        <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white">
                            📅 {duration} {duration === 1 ? 'Day' : 'Days'}
                        </span>
                        <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white">
                            💰 {budget}
                        </span>
                    </div>
                </div>
            </div>

            {/* Trip Details */}
            <div className="p-6">
                {/* Summary */}
                <p className="text-charcoal-600 dark:text-sand-300 text-sm line-clamp-3 mb-4">
                    {trip.summary || 'Explore this amazing destination with a carefully planned itinerary.'}
                </p>

                {/* Creator Info */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-sand-200 dark:border-charcoal-700">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-forest-500 to-clay-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {trip.user?.avatar_url ? (
                            <img src={trip.user.avatar_url} alt={trip.user.full_name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            trip.user?.full_name?.charAt(0).toUpperCase() || 'T'
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-charcoal-900 dark:text-white truncate">
                            {trip.user?.full_name || 'Traveler'}
                        </p>
                        <p className="text-xs text-charcoal-500 dark:text-sand-400">
                            Shared this trip
                        </p>
                    </div>
                </div>

                {/* Interaction Buttons */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                        {/* Like Button */}
                        <button
                            onClick={handleLike}
                            disabled={loading}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${isLiked
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                    : 'bg-sand-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-charcoal-700'
                                }`}
                            title={isLiked ? 'Unlike' : 'Like'}
                        >
                            <span className="text-base">{isLiked ? '❤️' : '🤍'}</span>
                            <span>{likesCount}</span>
                        </button>

                        {/* Comment Button */}
                        <button
                            onClick={handleCommentClick}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-sand-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-charcoal-700 transition-all"
                            title="Comments"
                        >
                            <span className="text-base">💬</span>
                            <span>{commentsCount}</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-1">
                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${isSaved
                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                    : 'bg-sand-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-charcoal-700'
                                }`}
                            title={isSaved ? 'Unsave' : 'Save'}
                        >
                            <span className="text-base">{isSaved ? '🔖' : '📑'}</span>
                            {savesCount > 0 && <span>{savesCount}</span>}
                        </button>

                        {/* View Details Button */}
                        <button
                            onClick={handleCardClick}
                            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg text-sm font-bold hover:shadow-lg transition-all"
                        >
                            View →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
