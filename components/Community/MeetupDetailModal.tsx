import React, { useState } from 'react';
import { Meetup } from '../../services/communityService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface MeetupDetailModalProps {
    meetup: Meetup;
    isOpen: boolean;
    onClose: () => void;
    onJoinLeave?: () => void;
}

export const MeetupDetailModal: React.FC<MeetupDetailModalProps> = ({ meetup, isOpen, onClose, onJoinLeave }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [joining, setJoining] = useState(false);
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const isHost = user?.id === meetup.user_id;
    const spotsLeft = meetup.max_travelers - meetup.current_travelers;

    const handleJoin = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            setJoining(true);
            const { communityService } = await import('../../services/communityService');
            await communityService.joinMeetup(meetup.id, message.trim() || undefined);
            alert('✅ Join request sent!');
            setMessage('');
            onJoinLeave?.();
            onClose();
        } catch (error) {
            console.error('Failed to join meetup:', error);
            alert('❌ Failed to join meetup');
        } finally {
            setJoining(false);
        }
    };

    const handleLeave = async () => {
        if (!confirm('Leave this meetup?')) return;

        try {
            const { communityService } = await import('../../services/communityService');
            await communityService.leaveMeetup(meetup.id);
            alert('You have left the meetup');
            onJoinLeave?.();
            onClose();
        } catch (error) {
            console.error('Failed to leave meetup:', error);
            alert('Failed to leave meetup');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-charcoal-900 rounded-[2rem] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Gradient */}
                <div className="relative h-48 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-t-[2rem] p-6">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200')] bg-cover bg-center opacity-20 rounded-t-[2rem]" />
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${meetup.status === 'open'
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800'
                                    : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800'
                                }`}>
                                {meetup.status}
                            </span>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-2xl hover:bg-white/20 transition-colors"
                            >
                                ×
                            </button>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2 font-display">
                                {meetup.title}
                            </h2>
                            <div className="flex items-center gap-2 text-white/90">
                                <span className="text-xl">📍</span>
                                <span className="text-lg font-medium">{meetup.destination}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Dates */}
                    <div className="bg-sand-50 dark:bg-charcoal-800 rounded-2xl p-4">
                        <div className="flex items-center gap-2 text-charcoal-600 dark:text-sand-400 mb-2">
                            <span className="text-xl">📅</span>
                            <span className="font-semibold">Travel Dates</span>
                        </div>
                        <div className="text-charcoal-900 dark:text-white">
                            <p className="font-medium">{formatDate(meetup.start_date)}</p>
                            <p className="text-charcoal-500 dark:text-sand-500 text-sm">to</p>
                            <p className="font-medium">{formatDate(meetup.end_date)}</p>
                        </div>
                    </div>

                    {/* Participants */}
                    <div className="bg-sand-50 dark:bg-charcoal-800 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-charcoal-600 dark:text-sand-400">
                                <span className="text-xl">👥</span>
                                <span className="font-semibold">Participants</span>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                    {meetup.current_travelers}/{meetup.max_travelers}
                                </p>
                                {spotsLeft > 0 && meetup.status === 'open' && (
                                    <p className="text-xs text-green-600 dark:text-green-400">
                                        {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-bold text-charcoal-900 dark:text-white mb-3">
                            About This Meetup
                        </h3>
                        <p className="text-charcoal-700 dark:text-sand-200 whitespace-pre-wrap">
                            {meetup.description}
                        </p>
                    </div>

                    {/* Host Info */}
                    <div className="border-t border-sand-200 dark:border-charcoal-700 pt-6">
                        <h3 className="text-lg font-bold text-charcoal-900 dark:text-white mb-3">
                            Hosted By
                        </h3>
                        <div
                            className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity"
                            onClick={() => {
                                if (meetup.user_id) {
                                    navigate(`/profile/${meetup.user_id}`);
                                    onClose();
                                }
                            }}
                        >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-forest-500 to-clay-600 flex items-center justify-center text-white text-lg font-bold">
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
                                <p className="font-semibold text-charcoal-900 dark:text-white">
                                    {meetup.user?.full_name || 'Anonymous'}
                                </p>
                                <p className="text-sm text-charcoal-600 dark:text-sand-400">
                                    View Profile →
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Join/Leave Section */}
                    {!isHost && meetup.status === 'open' && (
                        <div className="border-t border-sand-200 dark:border-charcoal-700 pt-6">
                            <h3 className="text-lg font-bold text-charcoal-900 dark:text-white mb-3">
                                Join This Meetup
                            </h3>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Introduce yourself and why you'd like to join (optional)"
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-sand-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white placeholder-charcoal-400 dark:placeholder-sand-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none mb-3"
                                maxLength={500}
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={handleJoin}
                                    disabled={joining || spotsLeft === 0}
                                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {joining ? 'Joining...' : spotsLeft === 0 ? 'Meetup Full' : 'Join Meetup'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Host Controls */}
                    {isHost && (
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4 border border-purple-200 dark:border-purple-700">
                            <p className="text-purple-800 dark:text-purple-300 font-semibold mb-2">
                                👑 You're the host
                            </p>
                            <p className="text-sm text-purple-700 dark:text-purple-400">
                                Manage participants and meetup details from your profile
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
