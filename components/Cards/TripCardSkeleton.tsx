import React from 'react';

export const TripCardSkeleton = () => {
    return (
        <div className="bg-white dark:bg-charcoal-900 rounded-3xl overflow-hidden border border-sand-200 dark:border-charcoal-700 shadow-sm">
            <div className="h-48 bg-sand-100 dark:bg-charcoal-800 animate-pulse" />
            <div className="p-6 space-y-4">
                <div className="h-6 w-3/4 bg-sand-100 dark:bg-charcoal-800 rounded animate-pulse" />
                <div className="space-y-2">
                    <div className="h-4 w-full bg-sand-100 dark:bg-charcoal-800 rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-sand-100 dark:bg-charcoal-800 rounded animate-pulse" />
                </div>
                <div className="flex gap-2 pt-2">
                    <div className="h-8 w-20 bg-sand-100 dark:bg-charcoal-800 rounded-lg animate-pulse" />
                    <div className="h-8 w-20 bg-sand-100 dark:bg-charcoal-800 rounded-lg animate-pulse" />
                </div>
            </div>
        </div>
    );
};
