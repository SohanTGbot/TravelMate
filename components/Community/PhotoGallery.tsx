import React, { useState, useEffect } from 'react';
import { CommunityPhoto } from '../../services/communityService';
import { PhotoCard } from './PhotoCard';

interface PhotoGalleryProps {
    onPhotoClick?: (photo: CommunityPhoto) => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ onPhotoClick }) => {
    const [photos, setPhotos] = useState<CommunityPhoto[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPhoto, setSelectedPhoto] = useState<CommunityPhoto | null>(null);

    useEffect(() => {
        loadPhotos();
    }, []);

    const loadPhotos = async () => {
        try {
            setLoading(true);
            const { communityService } = await import('../../services/communityService');
            const data = await communityService.getPhotos(50, 0);
            setPhotos(data);
        } catch (error) {
            console.error('Failed to load photos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoClick = (photo: CommunityPhoto) => {
        setSelectedPhoto(photo);
        onPhotoClick?.(photo);
    };

    const closeLightbox = () => {
        setSelectedPhoto(null);
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="aspect-square bg-sand-100 dark:bg-charcoal-800 rounded-2xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (photos.length === 0) {
        return (
            <div className="text-center py-20 bg-white dark:bg-charcoal-900 rounded-[2rem] border border-sand-200 dark:border-charcoal-700">
                <div className="text-6xl mb-4">📷</div>
                <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-2">
                    No Photos Yet
                </h3>
                <p className="text-charcoal-600 dark:text-sand-400">
                    Be the first to share your travel moments!
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Masonry Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {photos.map((photo) => (
                    <PhotoCard
                        key={photo.id}
                        photo={photo}
                        onClick={() => handlePhotoClick(photo)}
                        onLike={loadPhotos}
                        onDelete={loadPhotos}
                    />
                ))}
            </div>

            {/* Lightbox */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl hover:bg-white/20 transition-colors z-10"
                    >
                        ×
                    </button>

                    <div className="max-w-6xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={selectedPhoto.image_url}
                            alt={selectedPhoto.caption}
                            className="max-w-full max-h-[70vh] object-contain rounded-2xl"
                        />

                        <div className="mt-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
                            {selectedPhoto.caption && (
                                <p className="text-lg mb-2">{selectedPhoto.caption}</p>
                            )}
                            {selectedPhoto.location && (
                                <p className="text-sm opacity-80 flex items-center gap-2">
                                    <span>📍</span>
                                    {selectedPhoto.location}
                                </p>
                            )}
                            <div className="flex items-center gap-4 mt-4 text-sm">
                                <span>❤️ {selectedPhoto.likes}</span>
                                {selectedPhoto.comment_count > 0 && (
                                    <span>💬 {selectedPhoto.comment_count}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
