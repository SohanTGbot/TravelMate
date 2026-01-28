
import React, { useEffect, useState } from 'react';
import { tripService } from '../services/tripService';
import { TripComment } from '../types';
import { useAppContext } from '../context/AppContext';
import { formatDistanceToNow } from 'date-fns';

interface TripCommentsProps {
    tripId: string;
}

export const TripComments: React.FC<TripCommentsProps> = ({ tripId }) => {
    const { user } = useAppContext();
    const [comments, setComments] = useState<TripComment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadComments();
    }, [tripId]);

    const loadComments = async () => {
        if (!tripId) return; // Safeguard
        try {
            const data = await tripService.getComments(tripId);
            setComments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        try {
            const added = await tripService.addComment(tripId, user.id, newComment);
            setComments([...comments, added]);
            setNewComment('');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 shadow-sm border border-sand-200 dark:border-charcoal-700">
            <h3 className="text-xl font-bold text-charcoal-800 dark:text-sand-100 mb-6 flex items-center gap-2">
                <span>💬</span> Trip Discussion
                <span className="text-sm font-normal text-charcoal-500 bg-sand-100 dark:bg-charcoal-700 px-2 py-0.5 rounded-full">
                    {comments.length}
                </span>
            </h3>

            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto scrollbar-thin">
                {loading ? (
                    <p className="text-charcoal-400 text-sm">Loading comments...</p>
                ) : comments.length === 0 ? (
                    <p className="text-charcoal-400 text-sm italic">No comments yet. Start the conversation!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center font-bold text-xs shrink-0">
                                {comment.profiles?.avatar_url ? (
                                    <img src={comment.profiles.avatar_url} alt="User" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    (comment.profiles?.full_name || 'U')[0].toUpperCase()
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-sm text-charcoal-800 dark:text-sand-100">
                                        {comment.profiles?.full_name || 'User'}
                                    </span>
                                    <span className="text-xs text-charcoal-400">
                                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="text-sm text-charcoal-600 dark:text-sand-200 leading-relaxed">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {user ? (
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 bg-sand-50 dark:bg-charcoal-900 border border-sand-200 dark:border-charcoal-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                    />
                    <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="bg-forest-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Post
                    </button>
                </form>
            ) : (
                <div className="text-center p-3 bg-sand-50 dark:bg-charcoal-900 rounded-xl">
                    <p className="text-sm text-charcoal-500">
                        Please <span className="font-bold underline cursor-pointer">login</span> to comment.
                    </p>
                </div>
            )}
        </div>
    );
};
