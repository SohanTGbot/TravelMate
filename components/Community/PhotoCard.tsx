import React, { useState } from 'react';
import { CommunityPhoto } from '../../services/communityService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'router-dom';

interface PhotoCardProps {
    photo: CommunityPhoto;
    onLike?: () => void;
    onDelete?: () => void;
    onClick?: () => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onLike, onDelete, onClick }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(photo.likes || 0);
    const [isDeleting, setIsDeleting] = useState(false);

    const isOwner = user?.id === photo.user_id;

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const { communityService } = await import('../../services/communityService');
            if (isLiked) {
                await communityService.unlikeItem('photo', photo.id);
                setIsLiked(false);
                setLikesCount(prev => Math.max(0, prev - 1));
            } else {
                await communityService.likeItem('photo', photo.id);
                setIsLiked(true);
                setLikesCount(prev => prev + 1);
            }
            onLike?.();
        } catch (error) {
            console.error('Failed to like photo:', error);
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Delete this photo?')) return;

        try {
            setIsDeleting(true);
            const { communityService } = await import('../../services/communityService');
            await communityService.deletePhoto(photo.id, photo.image_url);
            onDelete?.();
        } catch (error) {
            console.error('Failed to delete photo:', error);
            alert('Failed to delete photo');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div
            onClick={onClick}
            className="group relative bg-white dark:bg-charcoal-900 rounded-2xl overflow-hidden border border-sand-200 dark:border-charcoal-700 hover:shadow-2xl transition-all duration-300 cursor-pointer"
        >
            {/* Photo */}
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={photo.image_url}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                />

                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Like Button Overlay */}
                <button
                    onClick={handleLike}
                    className="absolute top-3 right-3 w-10 h-10 bg-white/90 dark:bg-charcoal-800/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                >
                    <span className="text-xl">{isLiked ? '❤️' : '🤍'}</span>
                </button>

                {/* Delete Button (Owner Only) */}
                {isOwner && (
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="absolute top-3 left-3 w-10 h-10 bg-red-500/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 disabled:opacity-50"
                    >
                        <span className="text-white text-xl">{isDeleting ? '⏳' : '🗑️'}</span>
                    </button>
                )}
            </div>

            {/* Info */}
            <div className="p-4">
                {/* Caption */}
                {photo.caption && (
                    <p className="text-charcoal-900 dark:text-white font-medium mb-2 line-clamp-2">
                        {photo.caption}
                    </p>
                )}

                {/* Location */}
                {photo.location && (
                    <div className="flex items-center gap-1 text-sm text-charcoal-600 dark:text-sand-400 mb-3">
                        <span>📍</span>
                        <span>{photo.location}</span>
                    </div>
                )}

                {/* User Info & Stats */}
                <div className="flex items-center justify-between">
                    <div
                        className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (photo.user_id) navigate(`/profile/${photo.user_id}`);
                        }}
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-sm font-bold">
                            {photo.user?.avatar_url ? (
                                <img
                                    src={photo.user.avatar_url}
                                    alt={photo.user.full_name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                photo.user?.full_name?.charAt(0).toUpperCase() || '?'
                            )}
                        </div>
                        <span className="text-sm font-medium text-charcoal-700 dark:text-sand-200">
                            {photo.user?.full_name || 'Anonymous'}
                        </span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-sm text-charcoal-600 dark:text-sand-400">
                        <div className="flex items-center gap-1">
                            <span>❤️</span>
                            <span>{likesCount}</span>
                        </div>
                        {photo.comment_count > 0 && (
                            <div className="flex items-center gap-1">
                                <span>💬</span>
                                <span>{photo.comment_count}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
