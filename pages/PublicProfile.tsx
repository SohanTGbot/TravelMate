import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { communityService } from '../services/communityService';
import { tripService } from '../services/tripService';
import { useAuth } from '../context/AuthContext';
import { TripPlan } from '../types';
import { TripCard } from '../components/Community/TripCard';
import { TripDetailModal } from '../components/Community/TripDetailModal';

interface UserProfile {
    id: string;
    full_name: string;
    avatar_url?: string;
    bio?: string;
    created_at: string;
    followers_count: number;
    following_count: number;
    trips_shared_count: number;
}

const PublicProfile: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [userTrips, setUserTrips] = useState<TripPlan[]>([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [tripsLoading, setTripsLoading] = useState(true);
    const [selectedTrip, setSelectedTrip] = useState<TripPlan | null>(null);
    const [showTripModal, setShowTripModal] = useState(false);

    useEffect(() => {
        if (userId) {
            loadProfile();
            loadUserTrips();
            checkFollowStatus();
        }
    }, [userId]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await communityService.getUserProfile(userId!);
            setProfile(data);
        } catch (error) {
            console.error('Failed to load profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadUserTrips = async () => {
        try {
            setTripsLoading(true);
            // For now, load all public trips and filter by user
            const data = await tripService.getPublicTrips();
            const plans = data
                .filter((trip: any) => trip.user_id === userId)
                .map((trip: any) => tripService.dbTripToTripPlan(trip));
            setUserTrips(plans);
        } catch (error) {
            console.error('Failed to load user trips:', error);
        } finally {
            setTripsLoading(false);
        }
    };

    const checkFollowStatus = async () => {
        if (!currentUser || !userId) return;
        try {
            const following = await communityService.isFollowing(userId);
            setIsFollowing(following);
        } catch (error) {
            console.error('Failed to check follow status:', error);
        }
    };

    const handleFollow = async () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        try {
            if (isFollowing) {
                await communityService.unfollowUser(userId!);
                setIsFollowing(false);
                setProfile(prev => prev ? { ...prev, followers_count: Math.max(0, prev.followers_count - 1) } : null);
            } else {
                await communityService.followUser(userId!);
                setIsFollowing(true);
                setProfile(prev => prev ? { ...prev, followers_count: prev.followers_count + 1 } : null);
            }
        } catch (error) {
            console.error('Failed to follow/unfollow:', error);
            alert('Failed to update follow status');
        }
    };

    const isOwnProfile = currentUser?.id === userId;

    if (loading) {
        return (
            <div className="min-h-screen bg-sand-50 dark:bg-charcoal-950 pt-24 pb-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse">
                        <div className="h-64 bg-sand-200 dark:bg-charcoal-800 rounded-[2rem] mb-6"></div>
                        <div className="h-32 bg-sand-200 dark:bg-charcoal-800 rounded-[2rem]"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-sand-50 dark:bg-charcoal-950 pt-24 pb-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="text-6xl mb-4">👤</div>
                    <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-2">User Not Found</h2>
                    <p className="text-charcoal-600 dark:text-sand-300 mb-6">This profile doesn't exist or has been removed.</p>
                    <button
                        onClick={() => navigate('/community')}
                        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                    >
                        Back to Community
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{profile.full_name} - TravelMate Community</title>
                <meta name="description" content={`View ${profile.full_name}'s travel profile and shared trips on TravelMate.`} />
            </Helmet>

            <div className="min-h-screen bg-sand-50 dark:bg-charcoal-950 pt-24 pb-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Profile Header */}
                    <div className="bg-white dark:bg-charcoal-900 rounded-[2rem] overflow-hidden border border-sand-200 dark:border-charcoal-700 shadow-lg mb-8">
                        {/* Cover Image */}
                        <div className="relative h-48 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200')] bg-cover bg-center opacity-20"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        </div>

                        {/* Profile Info */}
                        <div className="relative px-8 pb-8">
                            {/* Avatar */}
                            <div className="flex items-end justify-between -mt-16 mb-6">
                                <div className="flex items-end gap-4">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-forest-500 to-clay-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-white dark:border-charcoal-900 shadow-xl">
                                        {profile.avatar_url ? (
                                            <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            profile.full_name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="mb-2">
                                        <h1 className="text-3xl font-bold text-charcoal-900 dark:text-white font-display mb-1">
                                            {profile.full_name}
                                        </h1>
                                        <p className="text-charcoal-500 dark:text-sand-400 text-sm">
                                            Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                {/* Follow Button */}
                                {!isOwnProfile && (
                                    <button
                                        onClick={handleFollow}
                                        className={`px-6 py-2 rounded-lg font-bold transition-all ${isFollowing
                                            ? 'bg-sand-200 dark:bg-charcoal-700 text-charcoal-900 dark:text-white hover:bg-sand-300 dark:hover:bg-charcoal-600'
                                            : 'bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:shadow-lg'
                                            }`}
                                    >
                                        {isFollowing ? '✓ Following' : '+ Follow'}
                                    </button>
                                )}
                            </div>

                            {/* Bio */}
                            {profile.bio && (
                                <p className="text-charcoal-700 dark:text-sand-200 mb-6 max-w-2xl">
                                    {profile.bio}
                                </p>
                            )}

                            {/* Stats */}
                            <div className="flex gap-8">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                        {profile.trips_shared_count}
                                    </div>
                                    <div className="text-sm text-charcoal-600 dark:text-sand-400">
                                        Trips Shared
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                        {profile.followers_count}
                                    </div>
                                    <div className="text-sm text-charcoal-600 dark:text-sand-400">
                                        Followers
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                        {profile.following_count}
                                    </div>
                                    <div className="text-sm text-charcoal-600 dark:text-sand-400">
                                        Following
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shared Trips */}
                    <div>
                        <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-6 font-display">
                            Shared Trips
                        </h2>

                        {tripsLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-80 bg-sand-100 dark:bg-charcoal-800 rounded-[2rem] animate-pulse"></div>
                                ))}
                            </div>
                        ) : userTrips.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-charcoal-900 rounded-[2rem] border border-sand-200 dark:border-charcoal-700">
                                <div className="text-6xl mb-4">✈️</div>
                                <p className="text-charcoal-500 dark:text-sand-400 text-lg">
                                    {isOwnProfile ? "You haven't shared any trips yet" : "No trips shared yet"}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {userTrips.map((trip) => (
                                    <TripCard
                                        key={trip.id}
                                        trip={{ ...trip, user: { full_name: profile.full_name, avatar_url: profile.avatar_url } }}
                                        onComment={() => {
                                            setSelectedTrip(trip);
                                            setShowTripModal(true);
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Trip Detail Modal */}
            {selectedTrip && (
                <TripDetailModal
                    trip={{ ...selectedTrip, user: { full_name: profile.full_name, avatar_url: profile.avatar_url, id: profile.id } }}
                    isOpen={showTripModal}
                    onClose={() => {
                        setShowTripModal(false);
                        setSelectedTrip(null);
                    }}
                />
            )}
        </>
    );
};

export default PublicProfile;
