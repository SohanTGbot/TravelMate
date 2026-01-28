import React from 'react';
import { Meetup } from '../../services/communityService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface MeetupCardProps {
    meetup: Meetup;
    onClick?: () => void;
}

export const MeetupCard: React.FC<MeetupCardProps> = ({ meetup, onClick }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'open': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800',
            'closed': 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800',
            'completed': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800',
            'cancelled': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800',
        };
        return colors[status] || colors.open;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const spotsLeft = meetup.max_travelers - meetup.current_travelers;

    return (
        <div
            onClick={onClick}
            className="bg-white dark:bg-charcoal-900 rounded-2xl overflow-hidden border border-sand-200 dark:border-charcoal-700 hover:shadow-lg transition-all cursor-pointer group"
        >
            {/* Header with Gradient */}
            <div className="relative h-32 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 p-6">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800')] bg-cover bg-center opacity-20" />
                <div className="relative z-10">
                    <div className="flex items-start justify-between mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(meetup.status)}`}>
                            {meetup.status}
                        </span>
                        <div className="text-white text-right">
                            <div className="text-2xl font-bold">{meetup.current_travelers}/{meetup.max_travelers}</div>
                            <div className="text-xs opacity-80">Travelers</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                    {meetup.title}
                </h3>

                {/* Destination */}
                <div className="flex items-center gap-2 text-charcoal-600 dark:text-sand-400 mb-3">
                    <span className="text-lg">📍</span>
                    <span className="font-medium">{meetup.destination}</span>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-2 text-sm text-charcoal-600 dark:text-sand-400 mb-4">
                    <span>📅</span>
                    <span>{formatDate(meetup.start_date)} - {formatDate(meetup.end_date)}</span>
                </div>

                {/* Description */}
                <p className="text-charcoal-700 dark:text-sand-200 text-sm line-clamp-2 mb-4">
                    {meetup.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-sand-200 dark:border-charcoal-700">
                    {/* Host Info */}
                    <div
                        className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (meetup.user_id) navigate(`/profile/${meetup.user_id}`);
                        }}
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-forest-500 to-clay-600 flex items-center justify-center text-white text-sm font-bold">
                            {meetup.user?.avatar_url ? (
                                <img
                                    src={meetup.user.avatar_url}
                                    alt={meetup.user.full_name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                meetup.user?.full_name?.charAt(0).toUpperCase() || '?'
                            )}
                        </div>
                        <div>
                            <p className="text-xs text-charcoal-500 dark:text-sand-500">Hosted by</p>
                            <p className="text-sm font-medium text-charcoal-700 dark:text-sand-200">
                                {meetup.user?.full_name || 'Anonymous'}
                            </p>
                        </div>
                    </div>

                    {/* Spots Left */}
                    {meetup.status === 'open' && (
                        <div className="text-right">
                            <p className="text-xs text-charcoal-500 dark:text-sand-500">Spots left</p>
                            <p className={`text-sm font-bold ${spotsLeft > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {spotsLeft > 0 ? spotsLeft : 'Full'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
