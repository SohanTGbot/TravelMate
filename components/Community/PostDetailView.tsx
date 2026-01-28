import React, { useState, useEffect } from 'react';
import { CommunityPost, CommunityReply } from '../../services/communityService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface PostDetailViewProps {
    post: CommunityPost;
    onClose: () => void;
}

export const PostDetailView: React.FC<PostDetailViewProps> = ({ post, onClose }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [replies, setReplies] = useState<CommunityReply[]>([]);
    const [newReply, setNewReply] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(null);

    const isAuthor = user?.id === post.user_id;

    useEffect(() => {
        loadReplies();
        loadUserVote();
    }, [post.id]);

    const loadReplies = async () => {
        try {
            setLoading(true);
            const { communityService } = await import('../../services/communityService');
            const data = await communityService.getReplies(post.id);
            setReplies(data);
        } catch (error) {
            console.error('Failed to load replies:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadUserVote = async () => {
        if (!user) return;
        try {
            const { communityService } = await import('../../services/communityService');
            const vote = await communityService.getUserVote('post', post.id);
            setUserVote(vote);
        } catch (error) {
            console.error('Failed to load vote:', error);
        }
    };

    const handleVote = async (voteType: 'upvote' | 'downvote') => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const { communityService } = await import('../../services/communityService');
            await communityService.vote('post', post.id, voteType);
            setUserVote(userVote === voteType ? null : voteType);
        } catch (error) {
            console.error('Failed to vote:', error);
        }
    };

    const handleSubmitReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        if (!newReply.trim()) return;

        try {
            setSubmitting(true);
            const { communityService } = await import('../../services/communityService');
            await communityService.createReply(post.id, newReply.trim());
            setNewReply('');
            await loadReplies();
        } catch (error) {
            console.error('Failed to submit reply:', error);
            alert('Failed to submit reply');
        } finally {
            setSubmitting(false);
        }
    };

    const handleMarkBestAnswer = async (replyId: string) => {
        if (!isAuthor) return;

        try {
            const { communityService } = await import('../../services/communityService');
            await communityService.markBestAnswer(replyId, post.id);
            await loadReplies();
        } catch (error) {
            console.error('Failed to mark best answer:', error);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-charcoal-900 rounded-[2rem] max-w-4xl w-full my-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-charcoal-900 border-b border-sand-200 dark:border-charcoal-700 p-6 rounded-t-[2rem]">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-800 uppercase">
                                    {post.category}
                                </span>
                                {post.is_resolved && (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800">
                                        ✓ Resolved
                                    </span>
                                )}
                            </div>
                            <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-2">
                                {post.title}
                            </h2>
                            {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 bg-sand-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-sand-400 rounded-lg text-xs"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-sand-100 dark:bg-charcoal-800 flex items-center justify-center hover:bg-sand-200 dark:hover:bg-charcoal-700 transition-colors ml-4"
                        >
                            <span className="text-xl">×</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {/* Question */}
                    <div className="mb-8">
                        <div className="flex gap-4">
                            {/* Voting */}
                            <div className="flex flex-col items-center gap-2">
                                <button
                                    onClick={() => handleVote('upvote')}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${userVote === 'upvote'
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-sand-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-sand-400 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                                        }`}
                                >
                                    ▲
                                </button>
                                <span className="font-bold text-lg text-charcoal-900 dark:text-white">
                                    {(post.upvotes || 0) - (post.downvotes || 0)}
                                </span>
                                <button
                                    onClick={() => handleVote('downvote')}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${userVote === 'downvote'
                                            ? 'bg-red-500 text-white'
                                            : 'bg-sand-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-sand-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                                        }`}
                                >
                                    ▼
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <p className="text-charcoal-700 dark:text-sand-200 whitespace-pre-wrap mb-4">
                                    {post.content}
                                </p>

                                {/* Author Info */}
                                <div className="flex items-center gap-2 text-sm text-charcoal-600 dark:text-sand-400">
                                    <span>Asked by</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-forest-500 to-clay-600 flex items-center justify-center text-white text-xs font-bold">
                                            {post.user?.full_name?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <span className="font-medium">{post.user?.full_name || 'Anonymous'}</span>
                                    </div>
                                    <span>•</span>
                                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Replies */}
                    <div className="border-t border-sand-200 dark:border-charcoal-700 pt-6">
                        <h3 className="text-lg font-bold text-charcoal-900 dark:text-white mb-4">
                            {replies.length} {replies.length === 1 ? 'Answer' : 'Answers'}
                        </h3>

                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2].map(i => (
                                    <div key={i} className="h-24 bg-sand-100 dark:bg-charcoal-800 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : replies.length === 0 ? (
                            <div className="text-center py-8 text-charcoal-500 dark:text-sand-500">
                                No answers yet. Be the first to help!
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {replies.map((reply) => (
                                    <div
                                        key={reply.id}
                                        className={`p-4 rounded-xl border ${reply.is_best_answer
                                                ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10'
                                                : 'border-sand-200 dark:border-charcoal-700'
                                            }`}
                                    >
                                        {reply.is_best_answer && (
                                            <div className="flex items-center gap-2 mb-2 text-green-700 dark:text-green-300 font-semibold text-sm">
                                                <span>✓</span>
                                                <span>Best Answer</span>
                                            </div>
                                        )}
                                        <p className="text-charcoal-700 dark:text-sand-200 mb-3 whitespace-pre-wrap">
                                            {reply.content}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm text-charcoal-600 dark:text-sand-400">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-xs font-bold">
                                                    {reply.user?.full_name?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <span className="font-medium">{reply.user?.full_name || 'Anonymous'}</span>
                                                <span>•</span>
                                                <span>{new Date(reply.created_at).toLocaleDateString()}</span>
                                            </div>
                                            {isAuthor && !reply.is_best_answer && (
                                                <button
                                                    onClick={() => handleMarkBestAnswer(reply.id)}
                                                    className="px-3 py-1 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-semibold hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                                                >
                                                    Mark as Best Answer
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Reply Form */}
                    <div className="border-t border-sand-200 dark:border-charcoal-700 pt-6 mt-6">
                        <h3 className="text-lg font-bold text-charcoal-900 dark:text-white mb-4">
                            Your Answer
                        </h3>
                        {user ? (
                            <form onSubmit={handleSubmitReply}>
                                <textarea
                                    value={newReply}
                                    onChange={(e) => setNewReply(e.target.value)}
                                    placeholder="Share your knowledge..."
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-sand-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white placeholder-charcoal-400 dark:placeholder-sand-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none mb-3"
                                />
                                <button
                                    type="submit"
                                    disabled={submitting || !newReply.trim()}
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Posting...' : 'Post Answer'}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-8 bg-sand-50 dark:bg-charcoal-800 rounded-xl">
                                <p className="text-charcoal-600 dark:text-sand-400 mb-4">
                                    Sign in to answer this question
                                </p>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold hover:shadow-lg transition-all"
                                >
                                    Sign In
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
