import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface PhotoUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadSuccess?: () => void;
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({ isOpen, onClose, onUploadSuccess }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [caption, setCaption] = useState('');
    const [location, setLocation] = useState('');
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    if (!isOpen) return null;

    const handleFileSelect = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('Image must be less than 10MB');
            return;
        }

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (!selectedFile) {
            alert('Please select a photo');
            return;
        }

        if (!caption.trim()) {
            alert('Please add a caption');
            return;
        }

        try {
            setUploading(true);
            const { communityService } = await import('../../services/communityService');
            await communityService.uploadPhoto(selectedFile, caption.trim(), location.trim());

            // Reset form
            setSelectedFile(null);
            setPreviewUrl('');
            setCaption('');
            setLocation('');

            onUploadSuccess?.();
            onClose();
            alert('✅ Photo uploaded successfully!');
        } catch (error) {
            console.error('Upload failed:', error);
            alert('❌ Failed to upload photo');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-charcoal-900 rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-charcoal-900 border-b border-sand-200 dark:border-charcoal-700 p-6 rounded-t-[2rem]">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white font-display">
                            📸 Upload Photo
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
                    {/* File Upload Area */}
                    <div>
                        <label className="block text-sm font-semibold text-charcoal-700 dark:text-sand-200 mb-2">
                            Photo *
                        </label>
                        {!previewUrl ? (
                            <div
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${dragActive
                                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                        : 'border-sand-300 dark:border-charcoal-600 hover:border-purple-400 dark:hover:border-purple-600'
                                    }`}
                            >
                                <div className="text-6xl mb-4">📷</div>
                                <p className="text-charcoal-700 dark:text-sand-200 font-semibold mb-2">
                                    Drop your photo here or click to browse
                                </p>
                                <p className="text-sm text-charcoal-500 dark:text-sand-400">
                                    JPG, PNG, or GIF • Max 10MB
                                </p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                                    className="hidden"
                                />
                            </div>
                        ) : (
                            <div className="relative">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full rounded-2xl max-h-96 object-cover"
                                />
                                <button
                                    onClick={() => {
                                        setSelectedFile(null);
                                        setPreviewUrl('');
                                    }}
                                    className="absolute top-3 right-3 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Caption */}
                    <div>
                        <label className="block text-sm font-semibold text-charcoal-700 dark:text-sand-200 mb-2">
                            Caption *
                        </label>
                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Share the story behind this photo..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-sand-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white placeholder-charcoal-400 dark:placeholder-sand-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                            maxLength={500}
                        />
                        <div className="text-xs text-charcoal-500 dark:text-sand-400 mt-1 text-right">
                            {caption.length}/500
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-semibold text-charcoal-700 dark:text-sand-200 mb-2">
                            Location
                        </label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Where was this taken?"
                            className="w-full px-4 py-3 rounded-xl border border-sand-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white placeholder-charcoal-400 dark:placeholder-sand-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            maxLength={100}
                        />
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
                            onClick={handleUpload}
                            disabled={uploading || !selectedFile || !caption.trim()}
                            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? 'Uploading...' : 'Upload Photo'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
