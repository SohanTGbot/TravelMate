import React, { useState } from 'react';
import { adminService } from '../services/adminService';

interface ImageUploadProps {
    onUploadComplete: (url: string) => void;
    bucket?: 'uploads' | 'avatars';
    currentImage?: string;
    label?: string;
    accept?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    onUploadComplete,
    bucket = 'uploads',
    currentImage,
    label = 'Upload Image',
    accept = 'image/*'
}) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB');
            return;
        }

        setError(null);
        setUploading(true);

        try {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload to Supabase
            const url = await adminService.uploadImage(file, bucket);
            onUploadComplete(url);
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.message || 'Failed to upload image');
            setPreview(currentImage || null);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium">{label}</label>

            {/* Preview */}
            {preview && (
                <div className="relative w-full max-w-md">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-xl border-2 border-white/10"
                    />
                    {uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                            <div className="text-white font-semibold">Uploading...</div>
                        </div>
                    )}
                </div>
            )}

            {/* Upload Input */}
            <div className="flex items-center gap-3">
                <label className={`
                    px-6 py-3 rounded-xl font-semibold cursor-pointer transition-all
                    ${uploading
                        ? 'bg-charcoal-800 text-charcoal-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30'
                    }
                `}>
                    {uploading ? 'Uploading...' : preview ? 'Change Image' : 'Choose Image'}
                    <input
                        type="file"
                        accept={accept}
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="hidden"
                    />
                </label>

                {preview && !uploading && (
                    <button
                        type="button"
                        onClick={() => {
                            setPreview(null);
                            onUploadComplete('');
                        }}
                        className="px-4 py-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
                    >
                        Remove
                    </button>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-500/20 text-red-400 rounded-xl text-sm border border-red-500/30">
                    {error}
                </div>
            )}

            {/* Help Text */}
            <p className="text-xs text-charcoal-400">
                Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
            </p>
        </div>
    );
};
