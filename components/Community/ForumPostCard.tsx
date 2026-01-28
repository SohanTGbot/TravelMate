import React from 'react';
import { CommunityPost } from '../../services/communityService';
import { useNavigate } from 'react-router-dom';

interface ForumPostCardProps {
    post: CommunityPost;
    onClick?: () => void;
}

export const ForumPostCard: React.FC<ForumPostCardProps> = ({ post, onClick }) => {
    const navigate = useNavigate();

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'tips': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800',
            'destinations': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800',
            'planning': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800',
            'budget': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800',
            'safety': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800',
        };
        return colors[category.toLowerCase()] || 'bg-sand-100 dark:bg-charcoal-800 text-charcoal-800 dark:text-sand-200 border-sand-200 dark:border-charcoal-700';
    };

    return (
        <div
            onClick={onClick}
            className="bg-white dark:bg-charcoal-900 rounded-2xl p-6 border border-sand-200 dark:border-charcoal-700 hover:shadow-lg transition-all cursor-pointer group"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    {/* Category & Resolved Badge */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getCategoryColor(post.category)}`}>
                            {post.category}
                        </span>
                        {post.is_resolved && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800">
                                ✓ Resolved
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                        {post.title}
                    </h3>

                    {/* Content Preview */}
                    <p className="text-charcoal-600 dark:text-sand-300 line-clamp-2 mb-3">
                        {post.content}
                    </p>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.slice(0, 3).map((tag, i) => (
                                <span
                                    key={i}
                                    className="px-2 py-1 bg-sand-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-sand-400 rounded-lg text-xs"
                                >
                                    #{tag}
                                </span>
                            ))}
                            {post.tags.length > 3 && (
                                <span className="px-2 py-1 text-charcoal-500 dark:text-sand-500 text-xs">
                                    +{post.tags.length - 3} more
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Vote Score */}
                <div className="flex flex-col items-center gap-1 ml-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold">
                        {(post.upvotes || 0) - (post.downvotes || 0)}
                    </div>
                    <span className="text-xs text-charcoal-500 dark:text-sand-500">votes</span>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-sand-200 dark:border-charcoal-700">
                {/* User Info */}
                <div
                    className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (post.user_id) navigate(`/profile/${post.user_id}`);
                    }}
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-forest-500 to-clay-600 flex items-center justify-center text-white text-sm font-bold">
                        {post.user?.avatar_url ? (
                            <img
                                src={post.user.avatar_url}
                                alt={post.user.full_name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            post.user?.full_name?.charAt(0).toUpperCase() || '?'
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-charcoal-700 dark:text-sand-200">
                            {post.user?.full_name || 'Anonymous'}
                        </p>
                        <p className="text-xs text-charcoal-500 dark:text-sand-500">
                            {new Date(post.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-charcoal-600 dark:text-sand-400">
                    <div className="flex items-center gap-1">
                        <span>💬</span>
                        <span>{post.reply_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>👁️</span>
                        <span>{post.view_count || 0}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
