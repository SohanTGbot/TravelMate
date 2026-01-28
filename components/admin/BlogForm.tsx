import React, { useState } from 'react';
import { Button } from '../Button';
import { ImageUpload } from '../ImageUpload';

interface Blog {
    id: string;
    title: string;
    content: string;
    author: string;
    excerpt?: string;
    image?: string;
    is_published?: boolean;
}

interface BlogFormProps {
    initialData?: Blog | null;
    onSubmit: (data: Omit<Blog, 'id'>) => void;
    onCancel: () => void;
}

export const BlogForm: React.FC<BlogFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [author, setAuthor] = useState(initialData?.author || '');
    const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
    const [image, setImage] = useState(initialData?.image || '');
    const [isPublished, setIsPublished] = useState(initialData?.is_published ?? true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            title,
            content,
            author,
            excerpt: excerpt || title.substring(0, 100),
            image,
            is_published: isPublished
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-charcoal-900 rounded-xl p-6 max-w-4xl w-full border border-white/10 my-8">
                <h3 className="text-2xl font-bold mb-6">{initialData ? 'Edit Blog' : 'Create Blog'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Title *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-charcoal-950 p-3 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Author *</label>
                            <input
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="w-full bg-charcoal-950 p-3 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Image Upload Component */}
                    <ImageUpload
                        onUploadComplete={(url) => setImage(url)}
                        bucket="uploads"
                        currentImage={image}
                        label="Blog Cover Image"
                    />

                    <div>
                        <label className="block text-sm font-medium mb-2">Excerpt (preview text)</label>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            rows={2}
                            className="w-full bg-charcoal-950 p-3 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500"
                            placeholder="Short description..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Content (HTML supported) *</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={12}
                            className="w-full bg-charcoal-950 p-3 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500 font-mono text-sm"
                            placeholder="Write your blog content here... You can use HTML tags like <p>, <h2>, <strong>, etc."
                            required
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            💡 Tip: You can use HTML tags: &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;, etc.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="published"
                            checked={isPublished}
                            onChange={(e) => setIsPublished(e.target.checked)}
                            className="w-4 h-4"
                        />
                        <label htmlFor="published" className="text-sm font-medium">
                            Publish immediately
                        </label>
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2 rounded-lg bg-charcoal-800 hover:bg-charcoal-700"
                        >
                            Cancel
                        </button>
                        <Button type="submit">
                            {initialData ? 'Update Blog' : 'Create Blog'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Re-export existing forms
export { FAQForm, DestinationForm, ServiceForm } from './ContentForms';
