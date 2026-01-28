import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, File, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface MediaUploadProps {
    onUpload: (files: File[]) => Promise<string[]>;
    accept?: string;
    maxSize?: number; // in MB
    maxFiles?: number;
}

export const DragDropUpload: React.FC<MediaUploadProps> = ({
    onUpload,
    accept = 'image/*',
    maxSize = 5,
    maxFiles = 10
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

    const validateFile = (file: File): string | null => {
        // Check file size
        if (file.size > maxSize * 1024 * 1024) {
            return `${file.name} exceeds ${maxSize}MB limit`;
        }

        // Check file type
        const acceptedTypes = accept.split(',').map(t => t.trim());
        const fileType = file.type;
        const isAccepted = acceptedTypes.some(type => {
            if (type === 'image/*') return fileType.startsWith('image/');
            if (type === 'video/*') return fileType.startsWith('video/');
            if (type === 'audio/*') return fileType.startsWith('audio/');
            return fileType === type;
        });

        if (!isAccepted) {
            return `${file.name} is not an accepted file type`;
        }

        return null;
    };

    const handleFiles = useCallback((newFiles: FileList | null) => {
        if (!newFiles) return;

        const fileArray = Array.from(newFiles);
        const validationErrors: string[] = [];
        const validFiles: File[] = [];
        const newPreviews: string[] = [];

        // Check max files limit
        if (files.length + fileArray.length > maxFiles) {
            validationErrors.push(`Maximum ${maxFiles} files allowed`);
            setErrors(validationErrors);
            return;
        }

        fileArray.forEach(file => {
            const error = validateFile(file);
            if (error) {
                validationErrors.push(error);
            } else {
                validFiles.push(file);

                // Create preview for images
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        newPreviews.push(reader.result as string);
                        if (newPreviews.length === validFiles.length) {
                            setPreviews([...previews, ...newPreviews]);
                        }
                    };
                    reader.readAsDataURL(file);
                } else {
                    newPreviews.push('');
                }
            }
        });

        setFiles([...files, ...validFiles]);
        setErrors(validationErrors);
    }, [files, previews, maxFiles, maxSize, accept]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
        setPreviews(previews.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setUploading(true);
        setErrors([]);

        try {
            const urls = await onUpload(files);
            setUploadedUrls(urls);
            setFiles([]);
            setPreviews([]);
        } catch (error) {
            setErrors(['Upload failed. Please try again.']);
        } finally {
            setUploading(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-white/20 hover:border-white/40 bg-charcoal-800/50'
                    }`}
            >
                <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-emerald-400' : 'text-stone-400'}`} />
                <h3 className="text-lg font-semibold text-white mb-2">
                    {isDragging ? 'Drop files here' : 'Drag & drop files here'}
                </h3>
                <p className="text-sm text-stone-400 mb-4">
                    or click to browse (max {maxSize}MB per file, {maxFiles} files max)
                </p>
                <input
                    type="file"
                    multiple
                    accept={accept}
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                />
                <label
                    htmlFor="file-upload"
                    className="inline-block px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-lg cursor-pointer transition-all"
                >
                    Browse Files
                </label>
            </div>

            {/* Errors */}
            {
                errors.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h4 className="font-semibold text-red-400 mb-2">Upload Errors</h4>
                                <ul className="text-sm text-red-300 space-y-1">
                                    {errors.map((error, idx) => (
                                        <li key={idx}>• {error}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* File Previews */}
            {
                files.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="font-semibold text-white">Selected Files ({files.length})</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {files.map((file, idx) => (
                                <div key={idx} className="relative bg-charcoal-800 rounded-lg overflow-hidden border border-white/10 group">
                                    {previews[idx] ? (
                                        <img
                                            src={previews[idx]}
                                            alt={file.name}
                                            className="w-full h-32 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-32 flex items-center justify-center bg-charcoal-700">
                                            <File className="w-8 h-8 text-stone-400" />
                                        </div>
                                    )}
                                    <div className="p-2">
                                        <p className="text-xs text-white truncate" title={file.name}>
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-stone-400">{formatFileSize(file.size)}</p>
                                    </div>
                                    <button
                                        onClick={() => removeFile(idx)}
                                        className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Upload Button */}
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {uploading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-5 h-5" />
                                    Upload {files.length} File{files.length !== 1 ? 's' : ''}
                                </>
                            )}
                        </button>
                    </div>
                )
            }

            {/* Success Message */}
            {
                uploadedUrls.length > 0 && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h4 className="font-semibold text-emerald-400 mb-2">
                                    Successfully uploaded {uploadedUrls.length} file{uploadedUrls.length !== 1 ? 's' : ''}!
                                </h4>
                                <div className="text-sm text-emerald-300 space-y-1 max-h-32 overflow-y-auto admin-scrollbar">
                                    {uploadedUrls.map((url, idx) => (
                                        <div key={idx} className="truncate">
                                            <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                {url}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

interface ImagePreviewGalleryProps {
    images: Array<{ url: string; name: string; size?: number }>;
    onDelete?: (url: string) => void;
}

export const ImagePreviewGallery: React.FC<ImagePreviewGalleryProps> = ({ images, onDelete }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, idx) => (
                <div key={idx} className="relative bg-charcoal-800 rounded-lg overflow-hidden border border-white/10 group">
                    <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-32 object-cover"
                    />
                    <div className="p-2">
                        <p className="text-xs text-white truncate" title={image.name}>
                            {image.name}
                        </p>
                        {image.size && (
                            <p className="text-xs text-stone-400">
                                {(image.size / (1024 * 1024)).toFixed(1)} MB
                            </p>
                        )}
                    </div>
                    {onDelete && (
                        <button
                            onClick={() => onDelete(image.url)}
                            className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};
