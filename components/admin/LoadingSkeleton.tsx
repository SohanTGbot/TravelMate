import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const StatCardSkeleton: React.FC = () => {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-charcoal-900 border border-white/10 p-6">
            <div className="flex items-start justify-between mb-4">
                <Skeleton circle width={48} height={48} baseColor="#1F2937" highlightColor="#374151" />
                <Skeleton width={60} height={20} baseColor="#1F2937" highlightColor="#374151" />
            </div>
            <Skeleton width={100} height={36} baseColor="#1F2937" highlightColor="#374151" className="mb-2" />
            <Skeleton width={120} height={16} baseColor="#1F2937" highlightColor="#374151" />
            <Skeleton width="100%" height={36} baseColor="#1F2937" highlightColor="#374151" className="mt-4" />
        </div>
    );
};

export const ChartSkeleton: React.FC = () => {
    return (
        <div className="bg-charcoal-900 p-6 rounded-xl border border-white/10">
            <Skeleton width={200} height={24} baseColor="#1F2937" highlightColor="#374151" className="mb-4" />
            <Skeleton width="100%" height={300} baseColor="#1F2937" highlightColor="#374151" />
        </div>
    );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
    return (
        <div className="bg-charcoal-900 rounded-xl border border-white/10 overflow-hidden">
            <div className="bg-charcoal-800 p-4">
                <Skeleton width="100%" height={40} baseColor="#1F2937" highlightColor="#374151" />
            </div>
            <div className="divide-y divide-white/5">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="p-4 flex gap-4">
                        <Skeleton width={60} height={20} baseColor="#1F2937" highlightColor="#374151" />
                        <Skeleton width="100%" height={20} baseColor="#1F2937" highlightColor="#374151" />
                        <Skeleton width={100} height={20} baseColor="#1F2937" highlightColor="#374151" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export const DashboardLoadingSkeleton: React.FC = () => {
    return (
        <div className="space-y-6 p-6">
            <Skeleton width={300} height={32} baseColor="#1F2937" highlightColor="#374151" />

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <StatCardSkeleton key={i} />
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartSkeleton />
                <ChartSkeleton />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartSkeleton />
                <ChartSkeleton />
            </div>
        </div>
    );
};
