import React, { useState, useEffect } from 'react';
import { communityService, Comment } from '../../services/communityService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CommentSectionProps {
    itemType: string;
    itemId: string;
    onCommentAdded?: () => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ itemType, itemId, onCommentAdded }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadComments();
    }, [itemType, itemId]);

    const loadComments = async () => {
        try {
            setLoading(true);
            const data = await communityService.getComments(itemType, itemId);
            setComments(data);
        } catch (error) {
            console.error('Failed to load comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        if (!newComment.trim()) return;

        try {
            setSubmitting(true);
            await communityService.addComment(itemType, itemId, newComment.trim());
            setNewComment('');
            await loadComments();
            onCommentAdded?.();
        } catch (error) {
            console.error('Failed to add comment:', error);
            alert('Failed to add comment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!window.confirm('Delete this comment?')) return;

        try {
            await communityService.deleteComment(commentId);
            await loadComments();
        } catch (error) {
            console.error('Failed to delete comment:', error);
            alert('Failed to delete comment.');
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="space-y-4">
            {/* Comment Form */}
            {user ? (
                <form onSubmit={handleSubmit} className="bg-sand-50 dark:bg-charcoal-800 rounded-xl p-4">
                    <div className="flex gap-3">
                        <div className="flex-shrink-0">
                            {user.avatar_url ? (
                                <img src={user.avatar_url} alt={user.full_name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold">
                                    {user.full_name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                rows={3}
                                className="w-full px-4 py-3 bg-white dark:bg-charcoal-700 border border-sand-200 dark:border-charcoal-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    type="submit"
                                    disabled={submitting || !newComment.trim()}
                                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Posting...' : 'Post Comment'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="bg-sand-50 dark:bg-charcoal-800 rounded-xl p-6 text-center">
                    <p className="text-charcoal-600 dark:text-sand-300 mb-3">Sign in to join the conversation</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                    >
                        Sign In
                    </button>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-3">
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-sand-50 dark:bg-charcoal-800 rounded-xl p-4 animate-pulse">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-full bg-sand-200 dark:bg-charcoal-700"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-sand-200 dark:bg-charcoal-700 rounded w-1/4"></div>
                                        <div className="h-3 bg-sand-200 dark:bg-charcoal-700 rounded w-3/4"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-8 text-charcoal-500 dark:text-sand-400">
                        <p className="text-4xl mb-2">💬</p>
                        <p>No comments yet. Be the first to comment!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="bg-white dark:bg-charcoal-900 rounded-xl p-4 border border-sand-200 dark:border-charcoal-700">
                            <div className="flex gap-3">
                                <div className="flex-shrink-0">
                                    {comment.user?.avatar_url ? (
                                        <img src={comment.user.avatar_url} alt={comment.user.full_name} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-forest-500 to-clay-600 flex items-center justify-center text-white font-bold text-sm">
                                            {comment.user?.full_name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-charcoal-900 dark:text-white text-sm">
                                                {comment.user?.full_name || 'Anonymous'}
                                            </span>
                                            <span className="text-xs text-charcoal-500 dark:text-sand-400">
                                                {formatTimeAgo(comment.created_at)}
                                            </span>
                                        </div>
                                        {user && comment.user_id === user.id && (
                                            <button
                                                onClick={() => handleDelete(comment.id)}
                                                className="text-xs text-red-600 dark:text-red-400 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-charcoal-700 dark:text-sand-200 text-sm whitespace-pre-wrap break-words">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
