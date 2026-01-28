import React, { useState } from 'react';
import { adminService } from '../services/adminService';

interface DocumentUploadProps {
    onUploadComplete: (result: { path: string, signedUrl: string, name: string }) => void;
    label?: string;
    accept?: string;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
    onUploadComplete,
    label = 'Upload Document',
    accept = '.pdf,.doc,.docx,.txt'
}) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (max 10MB for docs)
        if (file.size > 10 * 1024 * 1024) {
            setError('File must be less than 10MB');
            return;
        }

        setError(null);
        setUploading(true);

        try {
            // Upload to Supabase
            const result = await adminService.uploadDocument(file);
            onUploadComplete({ ...result, name: file.name });
            // Clear input
            e.target.value = '';
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.message || 'Failed to upload document');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                <label className={`
                    px-4 py-2 rounded-lg font-semibold cursor-pointer transition-all text-sm
                    ${uploading
                        ? 'bg-charcoal-800 text-charcoal-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md'
                    }
                `}>
                    {uploading ? 'Uploading...' : label}
                    <input
                        type="file"
                        accept={accept}
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="hidden"
                    />
                </label>
            </div>

            {/* Error Message */}
            {error && (
                <div className="text-red-400 text-xs mt-1">
                    {error}
                </div>
            )}
        </div>
    );
};
