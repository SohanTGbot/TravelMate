import React from 'react';
import { Trash2, Mail, CheckSquare, Square, RefreshCw } from 'lucide-react';

interface BulkActionsProps {
    selectedCount: number;
    totalCount: number;
    onSelectAll: () => void;
    onDeselectAll: () => void;
    onBulkDelete?: () => void;
    onBulkEmail?: () => void;
    onBulkStatusUpdate?: (status: string) => void;
    statusOptions?: string[];
}

export const BulkActions: React.FC<BulkActionsProps> = ({
    selectedCount,
    totalCount,
    onSelectAll,
    onDeselectAll,
    onBulkDelete,
    onBulkEmail,
    onBulkStatusUpdate,
    statusOptions = []
}) => {
    if (selectedCount === 0) return null;

    return (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-4 animate-fade-in">
            <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Selection Info */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <CheckSquare className="w-5 h-5 text-emerald-400" />
                        <span className="font-semibold text-emerald-400">
                            {selectedCount} selected
                        </span>
                    </div>

                    <button
                        onClick={selectedCount === totalCount ? onDeselectAll : onSelectAll}
                        className="text-sm text-emerald-400 hover:text-emerald-300 underline transition-colors"
                    >
                        {selectedCount === totalCount ? 'Deselect All' : `Select All (${totalCount})`}
                    </button>
                </div>

                {/* Bulk Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                    {onBulkDelete && (
                        <button
                            onClick={onBulkDelete}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg border border-red-500/30 hover:border-red-500/50 transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete ({selectedCount})
                        </button>
                    )}

                    {onBulkEmail && (
                        <button
                            onClick={onBulkEmail}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg border border-blue-500/30 hover:border-blue-500/50 transition-all"
                        >
                            <Mail className="w-4 h-4" />
                            Email ({selectedCount})
                        </button>
                    )}

                    {onBulkStatusUpdate && statusOptions.length > 0 && (
                        <select
                            onChange={(e) => {
                                if (e.target.value) {
                                    onBulkStatusUpdate(e.target.value);
                                    e.target.value = '';
                                }
                            }}
                            className="px-4 py-2 bg-charcoal-800 border border-white/10 rounded-lg text-white hover:border-white/20 transition-all cursor-pointer"
                        >
                            <option value="">Update Status...</option>
                            {statusOptions.map(status => (
                                <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>
        </div>
    );
};

interface RefreshControlProps {
    lastRefresh: Date | null;
    onRefresh: () => void;
    autoRefresh: boolean;
    onToggleAutoRefresh: () => void;
    isRefreshing?: boolean;
}

export const RefreshControl: React.FC<RefreshControlProps> = ({
    lastRefresh,
    onRefresh,
    autoRefresh,
    onToggleAutoRefresh,
    isRefreshing = false
}) => {
    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        return date.toLocaleTimeString();
    };

    return (
        <div className="flex items-center gap-3 bg-charcoal-900 border border-white/10 rounded-xl px-4 py-2">
            {/* Auto-refresh Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={onToggleAutoRefresh}
                    className="w-4 h-4 rounded border-white/20 bg-charcoal-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-sm text-stone-300">Auto-refresh</span>
            </label>

            {/* Last Refresh Time */}
            {lastRefresh && (
                <span className="text-xs text-stone-400">
                    {formatTime(lastRefresh)}
                </span>
            )}

            {/* Manual Refresh Button */}
            <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="text-sm">Refresh</span>
            </button>
        </div>
    );
};

interface NotificationBadgeProps {
    count: number;
    type?: 'info' | 'warning' | 'danger';
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count, type = 'info' }) => {
    if (count === 0) return null;

    const colorClasses = {
        info: 'bg-blue-500 text-white',
        warning: 'bg-yellow-500 text-charcoal-900',
        danger: 'bg-red-500 text-white'
    };

    return (
        <span className={`absolute -top-1 -right-1 ${colorClasses[type]} text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center pulse-glow`}>
            {count > 99 ? '99+' : count}
        </span>
    );
};
