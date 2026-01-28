import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { tripService } from '../services/tripService';
import { communityService, CommunityPost, CommunityPhoto, Meetup } from '../services/communityService';
import { TripPlan } from '../types';
import { useAuth } from '../context/AuthContext';
import { TripCard } from '../components/Community/TripCard';
import { TripDetailModal } from '../components/Community/TripDetailModal';
import { PhotoCard } from '../components/Community/PhotoCard';
import { PhotoUploadModal } from '../components/Community/PhotoUploadModal';
import { PhotoGallery } from '../components/Community/PhotoGallery';
import { ForumPostCard } from '../components/Community/ForumPostCard';
import { CreatePostModal } from '../components/Community/CreatePostModal';
import { PostDetailView } from '../components/Community/PostDetailView';
import { MeetupCard } from '../components/Community/MeetupCard';
import { CreateMeetupModal } from '../components/Community/CreateMeetupModal';
import { MeetupDetailModal } from '../components/Community/MeetupDetailModal';

const Community: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Tab state
    const [activeTab, setActiveTab] = useState<'trips' | 'photos' | 'qa' | 'meetups'>('trips');

    // Shared Trips
    const [publicTrips, setPublicTrips] = useState<TripPlan[]>([]);
    const [tripsLoading, setTripsLoading] = useState(true);
    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDuration, setSelectedDuration] = useState('all');
    const [selectedBudget, setSelectedBudget] = useState('all');

    // Photos
    const [photos, setPhotos] = useState<CommunityPhoto[]>([]);
    const [photosLoading, setPhotosLoading] = useState(false);

    // Q&A Posts
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [postsLoading, setPostsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Meetups
    const [meetups, setMeetups] = useState<Meetup[]>([]);
    const [meetupsLoading, setMeetupsLoading] = useState(false);

    // Modal states
    const [selectedTrip, setSelectedTrip] = useState<TripPlan | null>(null);
    const [showTripModal, setShowTripModal] = useState(false);
    const [showPhotoUpload, setShowPhotoUpload] = useState(false);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
    const [showPostDetail, setShowPostDetail] = useState(false);
    const [showCreateMeetup, setShowCreateMeetup] = useState(false);
    const [selectedMeetup, setSelectedMeetup] = useState<Meetup | null>(null);
    const [showMeetupDetail, setShowMeetupDetail] = useState(false);

    useEffect(() => {
        loadPublicTrips();
    }, []);

    useEffect(() => {
        if (activeTab === 'photos' && photos.length === 0) {
            loadPhotos();
        } else if (activeTab === 'qa' && posts.length === 0) {
            loadPosts();
        } else if (activeTab === 'meetups' && meetups.length === 0) {
            loadMeetups();
        }
    }, [activeTab]);

    const loadPublicTrips = async () => {
        try {
            setTripsLoading(true);
            const data = await tripService.getPublicTrips();
            const plans = data.map((trip: any) => tripService.dbTripToTripPlan(trip));
            setPublicTrips(plans);
        } catch (err) {
            console.error('Failed to load trips:', err);
        } finally {
            setTripsLoading(false);
        }
    };

    const loadPhotos = async () => {
        try {
            setPhotosLoading(true);
            const data = await communityService.getPhotos(20, 0);
            setPhotos(data);
        } catch (err) {
            console.error('Failed to load photos:', err);
        } finally {
            setPhotosLoading(false);
        }
    };

    const loadPosts = async () => {
        try {
            setPostsLoading(true);
            const data = await communityService.getPosts(selectedCategory === 'all' ? undefined : selectedCategory);
            setPosts(data);
        } catch (err) {
            console.error('Failed to load posts:', err);
        } finally {
            setPostsLoading(false);
        }
    };

    const loadMeetups = async () => {
        try {
            setMeetupsLoading(true);
            const data = await communityService.getMeetups('open');
            setMeetups(data);
        } catch (err) {
            console.error('Failed to load meetups:', err);
        } finally {
            setMeetupsLoading(false);
        }
    };

    const handleLikePhoto = async (photoId: string) => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const hasLiked = await communityService.hasLiked('photo', photoId);
            if (hasLiked) {
                await communityService.unlikeItem('photo', photoId);
            } else {
                await communityService.likeItem('photo', photoId);
            }
            loadPhotos();
        } catch (err) {
            console.error('Failed to like photo:', err);
        }
    };

    const tabs = [
        { id: 'trips', label: 'Shared Trips', icon: '✈️', count: publicTrips.length },
        { id: 'photos', label: 'Photos', icon: '📸', count: photos.length },
        { id: 'qa', label: 'Travel Tips', icon: '💡', count: posts.length },
        { id: 'meetups', label: 'Meetups', icon: '🤝', count: meetups.length }
    ];

    const categories = [
        { id: 'all', label: 'All Topics' },
        { id: 'visa', label: 'Visa & Documents' },
        { id: 'packing', label: 'Packing Tips' },
        { id: 'safety', label: 'Safety' },
        { id: 'budget', label: 'Budget Travel' },
        { id: 'transport', label: 'Transportation' },
        { id: 'culture', label: 'Culture' }
    ];

    // Filter Trips Logic
    const filteredTrips = publicTrips.filter(trip => {
        // Search Filter (City/Destination)
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const city = trip.itinerary[0]?.city?.toLowerCase() || '';
            const summary = trip.summary?.toLowerCase() || '';
            if (!city.includes(query) && !summary.includes(query)) return false;
        }

        // Duration Filter
        if (selectedDuration !== 'all') {
            const days = trip.itinerary.length;
            if (selectedDuration === 'short' && days > 3) return false;
            if (selectedDuration === 'medium' && (days < 4 || days > 7)) return false;
            if (selectedDuration === 'long' && days < 8) return false;
        }

        // Budget Filter
        if (selectedBudget !== 'all') {
            const budget = trip.totalBudgetEstimation || '';
            if (selectedBudget === 'low' && !budget.includes('$') && !budget.includes('Low')) return false; // Basic check
            // Note: Budget filtering is tricky with string estimation. 
            // Ideally, we'd parse the number. For MVP, we'll try to match standard text if possible.
            // Or improvement: Just search the string for "Low", "Medium", "High" if your backend provides categories.
            // Let's assume text search for now or rely on budget ranges if stored structured.
            // Since `totalBudgetEstimation` is a string like "$1000 - $1500", precise filtering is hard without parsing.
            // Let's stick to basic keyword matching or length logic if applicable.

            // Actually, let's implement parsing logic for better UX
            const amountMatch = budget.match(/\d+/);
            const amount = amountMatch ? parseInt(amountMatch[0]) : 0;

            if (selectedBudget === 'budget' && amount > 1000) return false;
            if (selectedBudget === 'moderate' && (amount <= 1000 || amount > 3000)) return false;
            if (selectedBudget === 'luxury' && amount <= 3000) return false;
        }

        return true;
    });

    return (
        <>
            <Helmet>
                <title>Community - TravelMate</title>
                <meta name="description" content="Connect with fellow travelers, share experiences, get travel tips, and find travel buddies." />
            </Helmet>

            <div className="min-h-screen bg-sand-50 dark:bg-charcoal-950 pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="text-center mb-12 animate-fade-in-up">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full mb-6 shadow-2xl animate-float">
                            <span className="text-4xl">🌍</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-charcoal-900 dark:text-white mb-4 font-display">
                            Travel Community
                        </h1>
                        <p className="text-xl text-charcoal-600 dark:text-sand-300 max-w-3xl mx-auto">
                            Connect with travelers worldwide. Share experiences, get inspired, and plan together.
                        </p>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <div className="bg-white dark:bg-charcoal-900 rounded-[2rem] p-2 shadow-lg border border-sand-200 dark:border-charcoal-700">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`px-4 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === tab.id
                                            ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg scale-105'
                                            : 'text-charcoal-600 dark:text-sand-300 hover:bg-sand-50 dark:hover:bg-charcoal-800'
                                            }`}
                                    >
                                        <span className="text-xl">{tab.icon}</span>
                                        <span className="hidden sm:inline">{tab.label}</span>
                                        {tab.count > 0 && (
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-sand-200 dark:bg-charcoal-700'
                                                }`}>
                                                {tab.count}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>

                        {/* Shared Trips Tab */}
                        {activeTab === 'trips' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white font-display">
                                        Discover Amazing Trips
                                    </h2>
                                    <button
                                        onClick={() => navigate('/plan')}
                                        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-full font-bold hover:shadow-lg transition-all"
                                    >
                                        + Share Your Trip
                                    </button>
                                </div>

                                {/* Filters Bar */}
                                <div className="bg-white dark:bg-charcoal-900 rounded-2xl p-4 shadow-sm border border-sand-200 dark:border-charcoal-700 mb-6 flex flex-wrap gap-4 items-center">
                                    <div className="flex-1 min-w-[200px] relative">
                                        <input
                                            type="text"
                                            placeholder="Search destinations..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full px-4 py-2 pl-10 bg-sand-50 dark:bg-charcoal-800 rounded-xl border border-sand-200 dark:border-charcoal-700 focus:outline-none focus:border-purple-500 transition-colors"
                                        />
                                        <span className="absolute left-3 top-2.5 text-charcoal-400">🔍</span>
                                    </div>

                                    <select
                                        value={selectedDuration}
                                        onChange={(e) => setSelectedDuration(e.target.value)}
                                        className="px-4 py-2 bg-sand-50 dark:bg-charcoal-800 rounded-xl border border-sand-200 dark:border-charcoal-700 focus:outline-none focus:border-purple-500 cursor-pointer"
                                    >
                                        <option value="all">Any Duration</option>
                                        <option value="short">Short Trip (1-3 days)</option>
                                        <option value="medium">Medium (4-7 days)</option>
                                        <option value="long">Long Trip (8+ days)</option>
                                    </select>

                                    <select
                                        value={selectedBudget}
                                        onChange={(e) => setSelectedBudget(e.target.value)}
                                        className="px-4 py-2 bg-sand-50 dark:bg-charcoal-800 rounded-xl border border-sand-200 dark:border-charcoal-700 focus:outline-none focus:border-purple-500 cursor-pointer"
                                    >
                                        <option value="all">Any Budget</option>
                                        <option value="budget">Budget Friendly (Under $1k)</option>
                                        <option value="moderate">Moderate ($1k - $3k)</option>
                                        <option value="luxury">Luxury ($3k+)</option>
                                    </select>
                                </div>

                                {tripsLoading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[1, 2, 3, 4, 5, 6].map(i => (
                                            <div key={i} className="h-80 bg-sand-100 dark:bg-charcoal-800 rounded-[2rem] animate-pulse"></div>
                                        ))}
                                    </div>
                                ) : publicTrips.length === 0 ? (
                                    <div className="text-center py-20 bg-white dark:bg-charcoal-900 rounded-[2rem] border border-sand-200 dark:border-charcoal-700">
                                        <div className="text-6xl mb-4">✈️</div>
                                        <p className="text-charcoal-500 dark:text-sand-400 text-lg mb-4">No public trips yet</p>
                                        <p className="text-charcoal-400 dark:text-sand-500 text-sm mb-6">Be the first to share your amazing trip!</p>
                                        <button
                                            onClick={() => navigate('/plan')}
                                            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-full font-bold hover:shadow-lg transition-all"
                                        >
                                            Plan & Share Trip
                                        </button>
                                    </div>
                                ) : filteredTrips.length === 0 ? (
                                    <div className="text-center py-20 bg-white dark:bg-charcoal-900 rounded-[2rem] border border-sand-200 dark:border-charcoal-700">
                                        <div className="text-6xl mb-4">🔍</div>
                                        <p className="text-charcoal-500 dark:text-sand-400 text-lg mb-4">No trips match your filters</p>
                                        <button
                                            onClick={() => { setSearchQuery(''); setSelectedDuration('all'); setSelectedBudget('all'); }}
                                            className="text-purple-600 font-bold hover:underline"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredTrips.map((trip) => (
                                            <div
                                                key={trip.id}
                                                onClick={() => navigate(`/result`, { state: { tripPlan: trip } })}
                                                className="group cursor-pointer bg-white dark:bg-charcoal-900 rounded-[2rem] overflow-hidden border border-sand-200 dark:border-charcoal-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                                            >
                                                {/* Trip Image/Header */}
                                                <div className="relative h-48 bg-gradient-to-br from-purple-500 to-purple-700 overflow-hidden">
                                                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800')] bg-cover bg-center opacity-30"></div>
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                    <div className="absolute bottom-4 left-4 right-4">
                                                        <h3 className="text-2xl font-bold text-white mb-2 font-display">
                                                            {trip.itinerary[0]?.city || 'Amazing Trip'}
                                                        </h3>
                                                        <div className="flex gap-2">
                                                            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white">
                                                                {trip.itinerary.length} Days
                                                            </span>
                                                            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white">
                                                                {trip.totalBudgetEstimation.split(' ')[0]}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Trip Details */}
                                                <div className="p-6">
                                                    <p className="text-charcoal-600 dark:text-sand-300 text-sm line-clamp-3 mb-4">
                                                        {trip.summary}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-xs text-charcoal-500 dark:text-sand-400">
                                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-forest-500 to-clay-600 flex items-center justify-center text-white font-bold text-xs">
                                                                T
                                                            </div>
                                                            <span>Traveler</span>
                                                        </div>
                                                        <button className="text-purple-600 dark:text-purple-400 font-bold text-sm hover:underline">
                                                            View Details →
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Photos Tab */}
                        {activeTab === 'photos' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white font-display">
                                        Travel Gallery
                                    </h2>
                                    {user && (
                                        <button
                                            onClick={() => setShowPhotoUpload(true)}
                                            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-full font-bold hover:shadow-lg transition-all"
                                        >
                                            + Upload Photo
                                        </button>
                                    )}
                                </div>

                                {photosLoading ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                            <div key={i} className="aspect-square bg-sand-100 dark:bg-charcoal-800 rounded-xl animate-pulse"></div>
                                        ))}
                                    </div>
                                ) : photos.length === 0 ? (
                                    <div className="text-center py-20 bg-white dark:bg-charcoal-900 rounded-[2rem] border border-sand-200 dark:border-charcoal-700">
                                        <div className="text-6xl mb-4">📸</div>
                                        <p className="text-charcoal-500 dark:text-sand-400 text-lg mb-4">No photos yet</p>
                                        <p className="text-charcoal-400 dark:text-sand-500 text-sm">Share your travel memories!</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {photos.map((photo) => (
                                            <div
                                                key={photo.id}
                                                className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
                                            >
                                                <img
                                                    src={photo.image_url}
                                                    alt={photo.caption}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                                        <p className="text-sm font-bold mb-2 line-clamp-2">{photo.caption}</p>
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span>📍 {photo.location}</span>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleLikePhoto(photo.id);
                                                                }}
                                                                className="flex items-center gap-1"
                                                            >
                                                                ❤️ {photo.likes}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Q&A Tab */}
                        {activeTab === 'qa' && (
                            <div>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                    <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white font-display">
                                        Travel Tips & Advice
                                    </h2>
                                    {user && (
                                        <button
                                            onClick={() => setShowCreatePost(true)}
                                            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-full font-bold hover:shadow-lg transition-all whitespace-nowrap"
                                        >
                                            + Ask Question
                                        </button>
                                    )}
                                </div>

                                {/* Category Filter */}
                                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => {
                                                setSelectedCategory(cat.id);
                                                loadPosts();
                                            }}
                                            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${selectedCategory === cat.id
                                                ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg'
                                                : 'bg-white dark:bg-charcoal-900 text-charcoal-600 dark:text-sand-300 border border-sand-200 dark:border-charcoal-700 hover:border-purple-500'
                                                }`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>

                                {postsLoading ? (
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-32 bg-sand-100 dark:bg-charcoal-800 rounded-xl animate-pulse"></div>
                                        ))}
                                    </div>
                                ) : posts.length === 0 ? (
                                    <div className="text-center py-20 bg-white dark:bg-charcoal-900 rounded-[2rem] border border-sand-200 dark:border-charcoal-700">
                                        <div className="text-6xl mb-4">💡</div>
                                        <p className="text-charcoal-500 dark:text-sand-400 text-lg mb-4">No questions yet</p>
                                        <p className="text-charcoal-400 dark:text-sand-500 text-sm">Be the first to ask!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {posts.map((post) => (
                                            <div
                                                key={post.id}
                                                onClick={() => {
                                                    setSelectedPost(post);
                                                    setShowPostDetail(true);
                                                }}
                                                className="bg-white dark:bg-charcoal-900 rounded-xl p-6 border border-sand-200 dark:border-charcoal-700 hover:shadow-lg transition-all cursor-pointer"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold">
                                                            {post.user?.full_name?.charAt(0) || 'U'}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h3 className="font-bold text-charcoal-900 dark:text-white">{post.title}</h3>
                                                            {post.is_resolved && (
                                                                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs px-2 py-0.5 rounded-full font-bold">
                                                                    ✓ Solved
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-charcoal-600 dark:text-sand-300 text-sm mb-3 line-clamp-2">
                                                            {post.content}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-xs text-charcoal-500 dark:text-sand-400">
                                                            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full font-semibold capitalize">
                                                                {post.category}
                                                            </span>
                                                            <span>👍 {post.upvotes}</span>
                                                            <span>💬 {post.reply_count} answers</span>
                                                            <span>👁️ {post.view_count} views</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Meetups Tab */}
                        {activeTab === 'meetups' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white font-display">
                                        Find Travel Buddies
                                    </h2>
                                    {user && (
                                        <button
                                            onClick={() => setShowCreateMeetup(true)}
                                            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-full font-bold hover:shadow-lg transition-all"
                                        >
                                            + Create Meetup
                                        </button>
                                    )}
                                </div>

                                {meetupsLoading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="h-48 bg-sand-100 dark:bg-charcoal-800 rounded-xl animate-pulse"></div>
                                        ))}
                                    </div>
                                ) : meetups.length === 0 ? (
                                    <div className="text-center py-20 bg-white dark:bg-charcoal-900 rounded-[2rem] border border-sand-200 dark:border-charcoal-700">
                                        <div className="text-6xl mb-4">🤝</div>
                                        <p className="text-charcoal-500 dark:text-sand-400 text-lg mb-4">No active meetups</p>
                                        <p className="text-charcoal-400 dark:text-sand-500 text-sm">Create one to find travel companions!</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {meetups.map((meetup) => (
                                            <div
                                                key={meetup.id}
                                                onClick={() => {
                                                    setSelectedMeetup(meetup);
                                                    setShowMeetupDetail(true);
                                                }}
                                                className="bg-white dark:bg-charcoal-900 rounded-xl p-6 border border-sand-200 dark:border-charcoal-700 hover:shadow-lg transition-all cursor-pointer"
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <h3 className="font-bold text-lg text-charcoal-900 dark:text-white mb-1">
                                                            {meetup.title}
                                                        </h3>
                                                        <p className="text-purple-600 dark:text-purple-400 text-sm font-semibold">
                                                            📍 {meetup.destination}
                                                        </p>
                                                    </div>
                                                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs px-3 py-1 rounded-full font-bold">
                                                        Open
                                                    </span>
                                                </div>
                                                <p className="text-charcoal-600 dark:text-sand-300 text-sm mb-4 line-clamp-2">
                                                    {meetup.description}
                                                </p>
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="text-charcoal-500 dark:text-sand-400">
                                                        <div>📅 {new Date(meetup.start_date).toLocaleDateString()} - {new Date(meetup.end_date).toLocaleDateString()}</div>
                                                        <div className="mt-1">👥 {meetup.current_travelers}/{meetup.max_travelers} travelers</div>
                                                    </div>
                                                    <button className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg font-bold hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all">
                                                        Join
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Modals */}
                <PhotoUploadModal
                    isOpen={showPhotoUpload}
                    onClose={() => setShowPhotoUpload(false)}
                    onUploadSuccess={loadPhotos}
                />

                <CreatePostModal
                    isOpen={showCreatePost}
                    onClose={() => setShowCreatePost(false)}
                    onPostCreated={loadPosts}
                />

                {selectedPost && (
                    <PostDetailView
                        post={selectedPost}
                        onClose={() => {
                            setShowPostDetail(false);
                            setSelectedPost(null);
                        }}
                    />
                )}

                <CreateMeetupModal
                    isOpen={showCreateMeetup}
                    onClose={() => setShowCreateMeetup(false)}
                    onMeetupCreated={loadMeetups}
                />

                {selectedMeetup && (
                    <MeetupDetailModal
                        meetup={selectedMeetup}
                        isOpen={showMeetupDetail}
                        onClose={() => {
                            setShowMeetupDetail(false);
                            setSelectedMeetup(null);
                        }}
                        onJoinLeave={loadMeetups}
                    />
                )}

                {selectedTrip && (
                    <TripDetailModal
                        trip={selectedTrip}
                        isOpen={showTripModal}
                        onClose={() => {
                            setShowTripModal(false);
                            setSelectedTrip(null);
                        }}
                    />
                )}
            </div>
        </>
    );
};

export default Community;
