import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPostCreated?: () => void;
}

const CATEGORIES = [
    { value: 'tips', label: '💡 Tips & Tricks', color: 'blue' },
    { value: 'destinations', label: '🌍 Destinations', color: 'green' },
    { value: 'planning', label: '📋 Planning', color: 'purple' },
    { value: 'budget', label: '💰 Budget', color: 'yellow' },
    { value: 'safety', label: '🛡️ Safety', color: 'red' },
    { value: 'other', label: '📌 Other', color: 'gray' },
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onPostCreated }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('tips');
    const [tags, setTags] = useState('');
    const [creating, setCreating] = useState(false);

    if (!isOpen) return null;

    const handleCreate = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (!title.trim() || !content.trim()) {
            alert('Please fill in title and content');
            return;
        }

        try {
            setCreating(true);
            const { communityService } = await import('../../services/communityService');

            const tagArray = tags
                .split(',')
                .map(t => t.trim())
                .filter(t => t.length > 0);

            await communityService.createPost(title.trim(), content.trim(), category, tagArray);

            // Reset form
            setTitle('');
            setContent('');
            setCategory('tips');
            setTags('');

            onPostCreated?.();
            onClose();
            alert('✅ Question posted successfully!');
        } catch (error) {
            console.error('Failed to create post:', error);
            alert('❌ Failed to post question');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-charcoal-900 rounded-[2rem] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-charcoal-900 border-b border-sand-200 dark:border-charcoal-700 p-6 rounded-t-[2rem]">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white font-display">
                            ❓ Ask a Question
                        </h2>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-sand-100 dark:bg-charcoal-800 flex items-center justify-center hover:bg-sand-200 dark:hover:bg-charcoal-700 transition-colors"
                        >
                            <span className="text-xl">×</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Category */}
                    <div>
                        <label className="block text-sm font-semibold text-charcoal-700 dark:text-sand-200 mb-2">
                            Category *
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => setCategory(cat.value)}
                                    className={`px-4 py-3 rounded-xl border-2 font-medium transition-all ${category === cat.value
                                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                                            : 'border-sand-300 dark:border-charcoal-600 text-charcoal-700 dark:text-sand-300 hover:border-purple-300 dark:hover:border-purple-700'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-charcoal-700 dark:text-sand-200 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What's your question?"
                            className="w-full px-4 py-3 rounded-xl border border-sand-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white placeholder-charcoal-400 dark:placeholder-sand-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            maxLength={200}
                        />
                        <div className="text-xs text-charcoal-500 dark:text-sand-400 mt-1 text-right">
                            {title.length}/200
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-semibold text-charcoal-700 dark:text-sand-200 mb-2">
                            Details *
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Provide more details about your question..."
                            rows={8}
                            className="w-full px-4 py-3 rounded-xl border border-sand-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white placeholder-charcoal-400 dark:placeholder-sand-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                            maxLength={2000}
                        />
                        <div className="text-xs text-charcoal-500 dark:text-sand-400 mt-1 text-right">
                            {content.length}/2000
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-semibold text-charcoal-700 dark:text-sand-200 mb-2">
                            Tags (optional)
                        </label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="paris, solo-travel, budget (comma-separated)"
                            className="w-full px-4 py-3 rounded-xl border border-sand-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white placeholder-charcoal-400 dark:placeholder-sand-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <p className="text-xs text-charcoal-500 dark:text-sand-400 mt-1">
                            Add tags to help others find your question
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-xl border border-sand-300 dark:border-charcoal-600 text-charcoal-700 dark:text-sand-200 font-semibold hover:bg-sand-100 dark:hover:bg-charcoal-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={creating || !title.trim() || !content.trim()}
                            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {creating ? 'Posting...' : 'Post Question'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
