import React, { useState, useEffect } from 'react';

export const OfflineNotice = () => {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div className="fixed bottom-4 left-4 z-50 animate-slide-up">
            <div className="bg-charcoal-900 dark:bg-white text-white dark:text-charcoal-900 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-charcoal-700 dark:border-sand-200">
                <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="font-medium text-sm">You are offline. Retrying connection...</span>
            </div>
        </div>
    );
};
