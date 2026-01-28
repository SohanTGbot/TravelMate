
import React, { useState } from 'react';
import { Button } from '../Button';
import { adminService } from '../../services/adminService';
import { Blog, Destination, Service, FAQ } from '../../types';

// --- GENERIC IMAGE UPLOAD ---
const ImageUpload = ({ onUpload, currentImage }: { onUpload: (url: string) => void, currentImage?: string }) => {
    const [uploading, setUploading] = useState(false);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploading(true);
        try {
            const url = await adminService.uploadImage(e.target.files[0]);
            onUpload(url);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-charcoal-300">Image</label>
            <div className="flex items-center gap-4">
                {currentImage && (
                    <img src={currentImage} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-white/10" />
                )}
                <div className="relative">
                    <Button size="sm" variant="outline" type="button" disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Upload Image'}
                    </Button>
                    <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFile}
                        accept="image/*"
                    />
                </div>
            </div>
        </div>
    );
};

// --- BLOG FORM ---
interface BlogFormProps {
    initialData?: Partial<Blog>;
    onSubmit: (data: Partial<Blog>) => void;
    onCancel: () => void;
}

export const BlogForm: React.FC<BlogFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Blog>>(initialData || {
        title: '',
        excerpt: '',
        content: '',
        category: 'Travel',
        readTime: '5 min read'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-charcoal-900 p-8 rounded-3xl border border-white/10">
            <h3 className="text-xl font-bold">{initialData ? 'Edit Blog' : 'New Blog Post'}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-charcoal-300">Title</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-charcoal-800 border-white/10 rounded-xl p-3 text-white focus:ring-forest-500"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-charcoal-300">Category</label>
                    <select
                        className="w-full bg-charcoal-800 border-white/10 rounded-xl p-3 text-white focus:ring-forest-500"
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                        <option>Travel</option>
                        <option>Guides</option>
                        <option>Tips</option>
                        <option>Food</option>
                        <option>Culture</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-charcoal-300">Excerpt</label>
                <textarea
                    className="w-full bg-charcoal-800 border-white/10 rounded-xl p-3 text-white focus:ring-forest-500 h-20"
                    value={formData.excerpt}
                    onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                />
            </div>

            <ImageUpload
                currentImage={formData.image}
                onUpload={url => setFormData({ ...formData, image: url })}
            />

            <div className="space-y-2">
                <label className="block text-sm font-medium text-charcoal-300">Content (Markdown)</label>
                <textarea
                    className="w-full bg-charcoal-800 border-white/10 rounded-xl p-3 text-white focus:ring-forest-500 h-64 font-mono text-sm"
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    placeholder="# Use markdown for formatting..."
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <Button variant="ghost" onClick={onCancel} type="button">Cancel</Button>
                <Button type="submit">Save Blog</Button>
            </div>
        </form>
    );
};

// --- DESTINATION FORM ---
interface DestinationFormProps {
    initialData?: Partial<Destination>;
    onSubmit: (data: Partial<Destination>) => void;
    onCancel: () => void;
}

export const DestinationForm: React.FC<DestinationFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Destination>>(initialData || {
        name: '',
        description: '',
        category: 'City',
        priceLevel: 'Medium',
        bestMonth: '',
        idealDuration: '3-5 days'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-charcoal-900 p-8 rounded-3xl border border-white/10">
            <h3 className="text-xl font-bold">{initialData ? 'Edit Destination' : 'New Destination'}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-charcoal-300">Name</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-charcoal-800 border-white/10 rounded-xl p-3 text-white focus:ring-forest-500"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-charcoal-300">Category</label>
                    <select
                        className="w-full bg-charcoal-800 border-white/10 rounded-xl p-3 text-white focus:ring-forest-500"
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                    >
                        <option>City</option>
                        <option>Beach</option>
                        <option>Mountain</option>
                        <option>Culture</option>
                        <option>Desert</option>
                    </select>
                </div>
            </div>

            <ImageUpload
                currentImage={formData.image}
                onUpload={url => setFormData({ ...formData, image: url })}
            />

            <div className="space-y-2">
                <label className="block text-sm font-medium text-charcoal-300">Description</label>
                <textarea
                    className="w-full bg-charcoal-800 border-white/10 rounded-xl p-3 text-white focus:ring-forest-500 h-32"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-charcoal-300">Best Month</label>
                    <input
                        type="text"
                        className="w-full bg-charcoal-800 border-white/10 rounded-xl p-3 text-white focus:ring-forest-500"
                        value={formData.bestMonth}
                        onChange={e => setFormData({ ...formData, bestMonth: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-charcoal-300">Duration</label>
                    <input
                        type="text"
                        className="w-full bg-charcoal-800 border-white/10 rounded-xl p-3 text-white focus:ring-forest-500"
                        value={formData.idealDuration}
                        onChange={e => setFormData({ ...formData, idealDuration: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-charcoal-300">Price Level</label>
                    <select
                        className="w-full bg-charcoal-800 border-white/10 rounded-xl p-3 text-white focus:ring-forest-500"
                        value={formData.priceLevel}
                        onChange={e => setFormData({ ...formData, priceLevel: e.target.value as any })}
                    >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <Button variant="ghost" onClick={onCancel} type="button">Cancel</Button>
                <Button type="submit">Save Destination</Button>
            </div>
        </form>
    );
};

// --- SERVICE FORM ---
interface ServiceFormProps {
    initialData?: Partial<Service>;
    onSubmit: (data: Partial<Service>) => void;
    onCancel: () => void;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Service>>(initialData || {
        title: '',
        description: '',
        icon: '✈️'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-charcoal-900 p-8 rounded-3xl border border-white/10">
            <h3 className="text-xl font-bold">{initialData ? 'Edit Service' : 'New Service'}</h3>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-charcoal-300">Title</label>
                <input
                    type="text"
                    required
                    className="w-full bg-charcoal-800 border-white/10 rounded-xl p-3 text-white focus:ring-forest-500"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-charcoal-300">Icon (Emoji)</label>
                <input
                    type="text"
                    className="w-full bg-charcoal-800 border-white/10 rounded-xl p-3 text-white focus:ring-forest-500"
                    value={formData.icon}
                    onChange={e => setFormData({ ...formData, icon: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-charcoal-300">Description</label>
                <textarea
                    className="w-full bg-charcoal-800 border-white/10 rounded-xl p-3 text-white focus:ring-forest-500 h-32"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <Button variant="ghost" onClick={onCancel} type="button">Cancel</Button>
                <Button type="submit">Save Service</Button>
            </div>
        </form>
    );
};

// --- FAQ FORM ---
interface FAQFormProps {
    initialData?: Partial<FAQ>;
    onSubmit: (data: Partial<FAQ>) => void;
    onCancel: () => void;
}

export const FAQForm: React.FC<FAQFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Partial<FAQ>>(initialData || {
        question: '',
        answer: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-charcoal-900 p-8 rounded-3xl border border-white/10">
            <h3 className="text-xl font-bold">{initialData ? 'Edit FAQ' : 'New FAQ'}</h3>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-charcoal-300">Question</label>
                <input
                    type="text"
                    required
                    className="w-full bg-charcoal-800 border-white/10 rounded-xl p-3 text-white focus:ring-forest-500"
                    value={formData.question}
                    onChange={e => setFormData({ ...formData, question: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-charcoal-300">Answer</label>
                <textarea
                    className="w-full bg-charcoal-800 border-white/10 rounded-xl p-3 text-white focus:ring-forest-500 h-32"
                    value={formData.answer}
                    onChange={e => setFormData({ ...formData, answer: e.target.value })}
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <Button variant="ghost" onClick={onCancel} type="button">Cancel</Button>
                <Button type="submit">Save FAQ</Button>
            </div>
        </form>
    );
};
