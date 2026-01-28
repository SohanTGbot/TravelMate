import React, { useState } from 'react';
import { Search, X, User, Clock, Activity, ToggleLeft, ToggleRight, TrendingUp, Mail, MapPin } from 'lucide-react';

interface UserManagementProps {
    users: any[];
    onUpdateUserStatus: (userId: string, status: 'active' | 'suspended') => Promise<void>;
}

export const UserSearch: React.FC<{ onSearch: (query: string) => void }> = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSearch = (value: string) => {
        setQuery(value);
        onSearch(value);
    };

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search users by name or email..."
                className="w-full pl-10 pr-10 py-2 bg-charcoal-800 border border-white/10 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            {query && (
                <button
                    onClick={() => handleSearch('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

interface UserStatsCardProps {
    user: any;
    stats: {
        tripRequests: number;
        bookings: number;
        reviews: number;
        lastLogin: Date | null;
    };
}

export const UserStatsCard: React.FC<UserStatsCardProps> = ({ user, stats }) => {
    const formatLastLogin = (date: Date | null) => {
        if (!date) return 'Never';
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="bg-charcoal-800/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white">User Statistics</h4>
                <Clock className="w-4 h-4 text-stone-400" />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-charcoal-900 rounded-lg p-3">
                    <div className="text-xs text-stone-400 mb-1">Trip Requests</div>
                    <div className="text-xl font-bold text-emerald-400">{stats.tripRequests}</div>
                </div>
                <div className="bg-charcoal-900 rounded-lg p-3">
                    <div className="text-xs text-stone-400 mb-1">Bookings</div>
                    <div className="text-xl font-bold text-blue-400">{stats.bookings}</div>
                </div>
                <div className="bg-charcoal-900 rounded-lg p-3">
                    <div className="text-xs text-stone-400 mb-1">Reviews</div>
                    <div className="text-xl font-bold text-purple-400">{stats.reviews}</div>
                </div>
                <div className="bg-charcoal-900 rounded-lg p-3">
                    <div className="text-xs text-stone-400 mb-1">Last Login</div>
                    <div className="text-sm font-semibold text-orange-400">{formatLastLogin(stats.lastLogin)}</div>
                </div>
            </div>
        </div>
    );
};

interface UserActivityTimelineProps {
    activities: Array<{
        id: string;
        type: 'trip_request' | 'booking' | 'review' | 'login';
        description: string;
        timestamp: Date;
    }>;
}

export const UserActivityTimeline: React.FC<UserActivityTimelineProps> = ({ activities }) => {
    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'trip_request': return <MapPin className="w-4 h-4" />;
            case 'booking': return <Activity className="w-4 h-4" />;
            case 'review': return <TrendingUp className="w-4 h-4" />;
            case 'login': return <User className="w-4 h-4" />;
            default: return <Activity className="w-4 h-4" />;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'trip_request': return 'text-emerald-400 bg-emerald-500/20';
            case 'booking': return 'text-blue-400 bg-blue-500/20';
            case 'review': return 'text-purple-400 bg-purple-500/20';
            case 'login': return 'text-orange-400 bg-orange-500/20';
            default: return 'text-stone-400 bg-stone-500/20';
        }
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="bg-charcoal-800/50 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Recent Activity
            </h4>

            <div className="space-y-3 max-h-64 overflow-y-auto admin-scrollbar">
                {activities.length === 0 ? (
                    <div className="text-center text-stone-400 py-8">
                        <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No recent activity</p>
                    </div>
                ) : (
                    activities.map((activity, idx) => (
                        <div key={activity.id} className="flex gap-3">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full ${getActivityColor(activity.type)} flex items-center justify-center`}>
                                {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-white">{activity.description}</p>
                                <p className="text-xs text-stone-400 mt-1">{formatTime(activity.timestamp)}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

interface AccountStatusToggleProps {
    userId: string;
    currentStatus: 'active' | 'suspended';
    onToggle: (userId: string, newStatus: 'active' | 'suspended') => Promise<void>;
}

export const AccountStatusToggle: React.FC<AccountStatusToggleProps> = ({ userId, currentStatus, onToggle }) => {
    const [isToggling, setIsToggling] = useState(false);

    const handleToggle = async () => {
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
        const confirmMessage = newStatus === 'suspended'
            ? 'Are you sure you want to suspend this user account?'
            : 'Are you sure you want to activate this user account?';

        if (!confirm(confirmMessage)) return;

        setIsToggling(true);
        try {
            await onToggle(userId, newStatus);
        } catch (error) {
            alert('Failed to update account status');
        } finally {
            setIsToggling(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isToggling}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${currentStatus === 'active'
                    ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
                    : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                }`}
        >
            {currentStatus === 'active' ? (
                <>
                    <ToggleRight className="w-5 h-5" />
                    Active
                </>
            ) : (
                <>
                    <ToggleLeft className="w-5 h-5" />
                    Suspended
                </>
            )}
        </button>
    );
};

interface UserDetailsModalProps {
    user: any;
    isOpen: boolean;
    onClose: () => void;
    stats: {
        tripRequests: number;
        bookings: number;
        reviews: number;
        lastLogin: Date | null;
    };
    activities: Array<{
        id: string;
        type: 'trip_request' | 'booking' | 'review' | 'login';
        description: string;
        timestamp: Date;
    }>;
    onUpdateStatus: (userId: string, status: 'active' | 'suspended') => Promise<void>;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
    user,
    isOpen,
    onClose,
    stats,
    activities,
    onUpdateStatus
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-charcoal-900 rounded-2xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl">
                            {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{user.full_name || 'Unknown User'}</h2>
                            <p className="text-sm text-stone-400 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {user.email}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Account Status */}
                    <div>
                        <h3 className="text-sm font-semibold text-stone-300 mb-3">Account Status</h3>
                        <AccountStatusToggle
                            userId={user.id}
                            currentStatus={user.status || 'active'}
                            onToggle={onUpdateStatus}
                        />
                    </div>

                    {/* User Stats */}
                    <UserStatsCard user={user} stats={stats} />

                    {/* Activity Timeline */}
                    <UserActivityTimeline activities={activities} />
                </div>
            </div>
        </div>
    );
};
