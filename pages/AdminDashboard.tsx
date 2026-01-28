
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { adminService } from '../services/adminService';
import { useAppContext } from '../context/AppContext';
import { FAQForm, DestinationForm, ServiceForm } from '../components/admin/ContentForms';
import { BlogForm } from '../components/admin/BlogForm';
import { StatCard } from '../components/admin/StatCard';
import { UserGrowthChart, TripRequestsChart, BookingStatusChart, NewsletterGrowthChart } from '../components/admin/Charts';
import { DashboardLoadingSkeleton } from '../components/admin/LoadingSkeleton';
import { BulkActions, RefreshControl, NotificationBadge } from '../components/admin/BulkActions';
import { EmailComposer } from '../components/admin/EmailComposer';
import { Users, MapPin, Briefcase, DollarSign, Mail, MessageSquare, Calendar, TrendingUp } from 'lucide-react';

export const AdminDashboard = () => {
    const navigate = useNavigate();
    const context = useAppContext();
    const { user, isLoadingAuth } = context || {};

    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);

    // Data states
    const [stats, setStats] = useState({ totalUsers: 0, totalTripRequests: 0, totalTrips: 0, totalRevenue: 0 });
    const [users, setUsers] = useState<any[]>([]);
    const [tripRequests, setTripRequests] = useState<any[]>([]);
    const [destinations, setDestinations] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [faqs, setFaqs] = useState<any[]>([]);
    const [blogs, setBlogs] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [contactMessages, setContactMessages] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [adminLogs, setAdminLogs] = useState<any[]>([]);
    const [newsletterSubscribers, setNewsletterSubscribers] = useState<any[]>([]);
    const [blogSearch, setBlogSearch] = useState('');
    const [blogFilter, setBlogFilter] = useState<'all' | 'published' | 'draft'>('all');

    // Form states
    const [showFAQForm, setShowFAQForm] = useState(false);
    const [showDestForm, setShowDestForm] = useState(false);
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [showBlogForm, setShowBlogForm] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    // Bulk actions and real-time states
    const [selectedNewsletterIds, setSelectedNewsletterIds] = useState<string[]>([]);
    const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
    const [showEmailComposer, setShowEmailComposer] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Check admin access
    const isAdmin = user?.role === 'admin' || user?.email === 'travelmate@gmail.com';

    // Debug: Log user state
    useEffect(() => {
        console.log('🔍 Admin Dashboard - User State:', {
            user,
            isAdmin,
            userRole: user?.role,
            userEmail: user?.email,
            isLoadingAuth
        });
    }, [user, isAdmin, isLoadingAuth]);

    // Load all data
    const loadData = async () => {
        console.log('🔄 loadData called, isAdmin:', isAdmin);
        if (!isAdmin) {
            console.warn('⚠️ loadData blocked - user is not admin');
            return;
        }
        setLoading(true);
        console.log('📡 Fetching data from Supabase...');
        try {
            const [statsData, usersData, tripsData, destsData, servicesData, faqsData, blogsData, reviewsData, contactData, bookingsData, logsData, newsletterData] = await Promise.all([
                adminService.getStats().catch(e => { console.error('❌ getStats error:', e); return { totalUsers: 0, totalTripRequests: 0, totalTrips: 0, totalRevenue: 0 }; }),
                adminService.getAllUsers().catch(e => { console.error('❌ getAllUsers error:', e); return []; }),
                adminService.getTripRequests().catch(e => { console.error('❌ getTripRequests error:', e); return []; }),
                adminService.getDestinations().catch(e => { console.error('❌ getDestinations error:', e); return []; }),
                adminService.getServices().catch(e => { console.error('❌ getServices error:', e); return []; }),
                adminService.getFAQs().catch(e => { console.error('❌ getFAQs error:', e); return []; }),
                adminService.getBlogs().catch(e => { console.error('❌ getBlogs error:', e); return []; }),
                adminService.getReviews().catch(e => { console.error('❌ getReviews error:', e); return []; }),
                adminService.getContactMessages().catch(e => { console.error('❌ getContactMessages error:', e); return []; }),
                adminService.getBookings().catch(e => { console.error('❌ getBookings error:', e); return []; }),
                adminService.getAdminLogs().catch(e => { console.error('❌ getAdminLogs error:', e); return []; }),
                adminService.getNewsletterSubscribers().catch(e => { console.error('❌ getNewsletterSubscribers error:', e); return []; })
            ]);

            console.log('✅ Data fetched successfully:', {
                stats: statsData,
                users: usersData.length,
                trips: tripsData.length,
                dests: destsData.length,
                services: servicesData.length,
                faqs: faqsData.length,
                blogs: blogsData.length,
                reviews: reviewsData.length,
                contacts: contactData.length,
                bookings: bookingsData.length,
                logs: logsData.length
            });

            setStats(statsData);
            setUsers(usersData);
            setTripRequests(tripsData);
            setDestinations(destsData);
            setServices(servicesData);
            setFaqs(faqsData);
            setBlogs(blogsData);
            setReviews(reviewsData);
            setContactMessages(contactData);
            setBookings(bookingsData);
            setAdminLogs(logsData);
            setNewsletterSubscribers(newsletterData);

            setLastRefresh(new Date());
            console.log('🎯 State updated with data');
        } catch (error) {
            console.error('💥 Fatal error loading admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('🎬 useEffect triggered - isAdmin:', isAdmin);
        if (isAdmin) {
            console.log('✅ User is admin, calling loadData()');
            loadData();
        } else {
            console.log('❌ User is NOT admin, skipping loadData()');
        }
    }, [isAdmin]);

    // Handlers
    const handleLogout = async () => {
        await adminService.supabase.auth.signOut();
        navigate('/');
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await adminService.deleteUser(id);
            await loadData();
        } catch (error) {
            alert('Failed to delete user');
        }
    };

    const handleChangeRole = async (id: string, newRole: string) => {
        try {
            await adminService.updateUserRole(id, newRole);
            await loadData();
        } catch (error) {
            alert('Failed to change user role');
        }
    };

    const handleDeleteTripRequest = async (id: string) => {
        if (!confirm('Delete this trip request?')) return;
        try {
            await adminService.deleteTripRequest(id);
            await loadData();
        } catch (error) {
            alert('Failed to delete trip request');
        }
    };

    const handleUpdateTripStatus = async (id: string, status: string) => {
        try {
            await adminService.updateTripRequestStatus(id, status);
            await loadData();
        } catch (error) {
            alert('Failed to update trip status');
        }
    };

    const handleDeleteDestination = async (id: string) => {
        if (!confirm('Delete this destination?')) return;
        try {
            await adminService.deleteDestination(id);
            await loadData();
        } catch (error) {
            alert('Failed to delete destination');
        }
    };

    const handleDeleteService = async (id: string) => {
        if (!confirm('Delete this service?')) return;
        try {
            await adminService.deleteService(id);
            await loadData();
        } catch (error) {
            alert('Failed to delete service');
        }
    };

    const handleDeleteFAQ = async (id: string) => {
        if (!confirm('Delete this FAQ?')) return;
        try {
            await adminService.deleteFAQ(id);
            await loadData();
        } catch (error) {
            alert('Failed to delete FAQ');
        }
    };

    const handleSaveFAQ = async (data: any) => {
        try {
            if (editingItem) {
                await adminService.updateFAQ(editingItem.id, data);
            } else {
                await adminService.createFAQ(data);
            }
            setShowFAQForm(false);
            setEditingItem(null);
            await loadData();
        } catch (error) {
            alert('Failed to save FAQ');
        }
    };

    const handleSaveDestination = async (data: any) => {
        try {
            if (editingItem) {
                await adminService.updateDestination(editingItem.id, data);
            } else {
                await adminService.createDestination(data);
            }
            setShowDestForm(false);
            setEditingItem(null);
            await loadData();
        } catch (error) {
            alert('Failed to save destination');
        }
    };

    const handleSaveService = async (data: any) => {
        try {
            if (editingItem) {
                await adminService.updateService(editingItem.id, data);
            } else {
                await adminService.createService(data);
            }
            setShowServiceForm(false);
            setEditingItem(null);
            await loadData();
        } catch (error) {
            alert('Failed to save service');
        }
    };

    const handleSaveBlog = async (data: any) => {
        try {
            if (editingItem) {
                await adminService.updateBlog(editingItem.id, data);
            } else {
                await adminService.createBlog(data);
            }
            setShowBlogForm(false);
            setEditingItem(null);
            await loadData();
        } catch (error) {
            alert('Failed to save blog');
        }
    };

    const handleDeleteBlog = async (id: string) => {
        if (!confirm('Delete this blog?')) return;
        try {
            await adminService.deleteBlog(id);
            await loadData();
        } catch (error) {
            alert('Failed to delete blog');
        }
    };

    const handleDeleteNewsletterSubscriber = async (id: string) => {
        if (!confirm('Delete this subscriber?')) return;
        try {
            await adminService.deleteNewsletterSubscriber(id);
            await loadData();
        } catch (error) {
            alert('Failed to delete subscriber');
        }
    };

    // Bulk Actions Handlers
    const handleSelectAllNewsletter = () => {
        setSelectedNewsletterIds(newsletterSubscribers.map((s: any) => s.id));
    };

    const handleDeselectAllNewsletter = () => {
        setSelectedNewsletterIds([]);
    };

    const handleBulkDeleteNewsletter = async () => {
        if (!confirm(`Delete ${selectedNewsletterIds.length} subscribers?`)) return;
        try {
            await Promise.all(selectedNewsletterIds.map(id => adminService.deleteNewsletterSubscriber(id)));
            setSelectedNewsletterIds([]);
            await loadData();
        } catch (error) {
            alert('Failed to delete subscribers');
        }
    };

    const handleBulkEmailNewsletter = () => {
        setShowEmailComposer(true);
    };

    const handleSendBulkEmail = async (subject: string, message: string) => {
        const recipients = newsletterSubscribers
            .filter((s: any) => selectedNewsletterIds.includes(s.id))
            .map((s: any) => s.email);

        if (recipients.length === 0) return;

        // Create mailto link with BCC for privacy
        // Note: mailto links have length limits, so for very large lists this might truncate
        const bcc = recipients.join(',');
        const mailtoLink = `mailto:?bcc=${encodeURIComponent(bcc)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

        // Open default email client
        window.location.href = mailtoLink;

        // Clear selection after action
        setSelectedNewsletterIds([]);
        setShowEmailComposer(false);
    };

    // Refresh Handlers
    const handleManualRefresh = async () => {
        setIsRefreshing(true);
        await loadData();
        setIsRefreshing(false);
    };

    const handleToggleAutoRefresh = () => {
        setAutoRefresh(!autoRefresh);
    };

    // Auto-refresh effect
    useEffect(() => {
        if (autoRefresh) {
            const interval = setInterval(() => {
                loadData();
            }, 30000); // Refresh every 30 seconds
            return () => clearInterval(interval);
        }
    }, [autoRefresh]);

    const handleApproveReview = async (id: string) => {
        try {
            await adminService.approveReview(id, true);
            await loadData();
        } catch (error) {
            alert('Failed to approve review');
        }
    };

    const handleDeleteReview = async (id: string) => {
        if (!confirm('Delete this review?')) return;
        try {
            await adminService.deleteReview(id);
            await loadData();
        } catch (error) {
            alert('Failed to delete review');
        }
    };

    // Auth check
    if (isLoadingAuth) {
        return <div className="min-h-screen flex items-center justify-center bg-charcoal-950 text-white">Loading...</div>;
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-charcoal-950 text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                    <p className="mb-4">You don't have admin privileges.</p>
                    <Button onClick={() => navigate('/')}>Go Home</Button>
                </div>
            </div>
        );
    }

    // Main Dashboard
    return (
        <div className="min-h-screen bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-950 text-white pt-24">
            {/* Premium Header */}
            <div className="bg-gradient-to-r from-charcoal-900 via-charcoal-800 to-charcoal-900 border-b border-emerald-500/20 shadow-2xl">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/50">
                                <img
                                    src="/travelmate-logo.png"
                                    alt="TravelMate"
                                    className="w-10 h-10 object-contain"
                                />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">TravelMate Admin</h1>
                                <p className="text-charcoal-400 text-sm">Content Management System</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="text-right">
                                <p className="text-sm text-charcoal-400">Logged in as</p>
                                <p className="font-semibold text-emerald-400">{user?.email}</p>
                            </div>
                            <Button
                                size="sm"
                                onClick={handleLogout}
                                className="!bg-gradient-to-r !from-red-500 !to-red-600 hover:!from-red-600 hover:!to-red-700 !shadow-lg !shadow-red-500/30"
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Tabs */}
            <div className="bg-gradient-to-r from-charcoal-900 via-charcoal-800 to-charcoal-900 border-b border-white/10 shadow-lg">
                <div className="max-w-7xl mx-auto flex gap-2 p-4 overflow-x-auto">
                    {['overview', 'users', 'bookings', 'trip-requests', 'destinations', 'services', 'faqs', 'blogs', 'reviews', 'contacts', 'newsletter', 'settings'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 rounded-xl whitespace-nowrap transition-all duration-300 font-semibold text-sm ${activeTab === tab
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/50 scale-105'
                                : 'bg-charcoal-800/50 text-charcoal-300 hover:bg-charcoal-700 hover:text-white border border-charcoal-700/50'}`}
                        >
                            {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto p-6">
                {loading && <DashboardLoadingSkeleton />}

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard
                                title="Total Users"
                                value={stats.totalUsers}
                                icon={<Users className="w-6 h-6" />}
                                color="emerald"
                                trend={{ value: 12, isPositive: true }}
                                action={{
                                    label: "View All Users",
                                    onClick: () => setActiveTab('users')
                                }}
                            />
                            <StatCard
                                title="Trip Requests"
                                value={stats.totalTripRequests}
                                icon={<MapPin className="w-6 h-6" />}
                                color="blue"
                                trend={{ value: 8, isPositive: true }}
                                action={{
                                    label: "Manage Requests",
                                    onClick: () => setActiveTab('trip-requests')
                                }}
                            />
                            <StatCard
                                title="Active Bookings"
                                value={bookings.length}
                                icon={<Calendar className="w-6 h-6" />}
                                color="purple"
                                trend={{ value: 5, isPositive: true }}
                                action={{
                                    label: "View Bookings",
                                    onClick: () => setActiveTab('bookings')
                                }}
                            />

                        </div>

                        {/* Additional Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title="Newsletter Subscribers"
                                value={newsletterSubscribers.length}
                                icon={<Mail className="w-6 h-6" />}
                                color="pink"
                                trend={{ value: 20, isPositive: true }}
                                action={{
                                    label: "View Subscribers",
                                    onClick: () => setActiveTab('newsletter')
                                }}
                            />
                            <StatCard
                                title="Contact Messages"
                                value={contactMessages.length}
                                icon={<MessageSquare className="w-6 h-6" />}
                                color="blue"
                                action={{
                                    label: "View Messages",
                                    onClick: () => setActiveTab('contacts')
                                }}
                            />
                            <StatCard
                                title="Blog Posts"
                                value={blogs.length}
                                icon={<Briefcase className="w-6 h-6" />}
                                color="emerald"
                                action={{
                                    label: "Manage Blogs",
                                    onClick: () => setActiveTab('blogs')
                                }}
                            />
                            <StatCard
                                title="Total Reviews"
                                value={reviews.length}
                                icon={<TrendingUp className="w-6 h-6" />}
                                color="purple"
                                action={{
                                    label: "View Reviews",
                                    onClick: () => setActiveTab('reviews')
                                }}
                            />
                        </div>

                        {/* Data Visualization Charts */}
                        <div className="grid grid-cols-1 gap-6">
                            <UserGrowthChart
                                data={[
                                    { month: 'Jan', users: 45 },
                                    { month: 'Feb', users: 52 },
                                    { month: 'Mar', users: 61 },
                                    { month: 'Apr', users: 70 },
                                    { month: 'May', users: 85 },
                                    { month: 'Jun', users: stats.totalUsers }
                                ]}
                            />

                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <TripRequestsChart
                                data={tripRequests.reduce((acc: any[], req) => {
                                    const dest = req.destination || 'Unknown';
                                    const existing = acc.find(item => item.destination === dest);
                                    if (existing) {
                                        existing.requests++;
                                    } else {
                                        acc.push({ destination: dest, requests: 1 });
                                    }
                                    return acc;
                                }, []).slice(0, 8)}
                            />
                            <BookingStatusChart
                                data={[
                                    { name: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length },
                                    { name: 'Pending', value: bookings.filter(b => b.status === 'pending').length },
                                    { name: 'Completed', value: bookings.filter(b => b.status === 'completed').length },
                                    { name: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length }
                                ].filter(item => item.value > 0)}
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <NewsletterGrowthChart
                                data={[
                                    { month: 'Jan', subscribers: 120 },
                                    { month: 'Feb', subscribers: 180 },
                                    { month: 'Mar', subscribers: 250 },
                                    { month: 'Apr', subscribers: 340 },
                                    { month: 'May', subscribers: 450 },
                                    { month: 'Jun', subscribers: newsletterSubscribers.length }
                                ]}
                            />

                            {/* Content Stats Card */}
                            <div className="bg-charcoal-900 p-6 rounded-xl border border-white/10">
                                <h3 className="text-xl font-bold mb-4">Content Overview</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-charcoal-800/50 rounded-lg">
                                        <span className="text-stone-300">Destinations</span>
                                        <span className="font-bold text-emerald-400 text-lg">{destinations.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-charcoal-800/50 rounded-lg">
                                        <span className="text-stone-300">Services</span>
                                        <span className="font-bold text-blue-400 text-lg">{services.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-charcoal-800/50 rounded-lg">
                                        <span className="text-stone-300">FAQs</span>
                                        <span className="font-bold text-purple-400 text-lg">{faqs.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-charcoal-800/50 rounded-lg">
                                        <span className="text-stone-300">Blog Posts</span>
                                        <span className="font-bold text-orange-400 text-lg">{blogs.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-charcoal-800/50 rounded-lg">
                                        <span className="text-stone-300">Reviews</span>
                                        <span className="font-bold text-pink-400 text-lg">{reviews.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">User Management ({users.length})</h2>
                        <div className="bg-charcoal-900 rounded-xl border border-white/10 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-charcoal-800">
                                    <tr>
                                        <th className="text-left p-4">Email</th>
                                        <th className="text-left p-4">Name</th>
                                        <th className="text-left p-4">Role</th>
                                        <th className="text-left p-4">Created</th>
                                        <th className="text-left p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id} className="border-t border-white/5">
                                            <td className="p-4">{u.email}</td>
                                            <td className="p-4">{u.full_name || 'N/A'}</td>
                                            <td className="p-4">
                                                <select
                                                    value={u.role || 'user'}
                                                    onChange={(e) => handleChangeRole(u.id, e.target.value)}
                                                    className="bg-charcoal-800 px-2 py-1 rounded"
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            <td className="p-4">{new Date(u.created_at).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                <button onClick={() => handleDeleteUser(u.id)} className="text-red-400 hover:text-red-300">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Trip Requests Tab */}
                {activeTab === 'trip-requests' && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Trip Requests ({tripRequests.length})</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {tripRequests.map(req => (
                                <div key={req.id} className="bg-charcoal-900 p-6 rounded-xl border border-white/10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold">{req.destination || 'Destination not specified'}</h3>
                                            <p className="text-charcoal-400">User: {req.profiles?.email || 'Unknown'}</p>
                                            {req.status && <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs bg-blue-600">{req.status}</span>}
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleUpdateTripStatus(req.id, 'approved')} className="text-green-400 hover:text-green-300 text-sm">Approve</button>
                                            <button onClick={() => handleUpdateTripStatus(req.id, 'rejected')} className="text-yellow-400 hover:text-yellow-300 text-sm">Reject</button>
                                            <button onClick={() => handleDeleteTripRequest(req.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div><span className="text-charcoal-400">Budget:</span> {req.budget || 'N/A'}</div>
                                        <div><span className="text-charcoal-400">Duration:</span> {req.duration || 'N/A'}</div>
                                        <div><span className="text-charcoal-400">Travelers:</span> {req.travelers || 'N/A'}</div>
                                        <div><span className="text-charcoal-400">Date:</span> {req.timestamp ? new Date(req.timestamp).toLocaleDateString() : 'N/A'}</div>
                                    </div>
                                </div>
                            ))}
                            {tripRequests.length === 0 && <div className="text-center text-charcoal-400 py-8">No trip requests found</div>}
                        </div>
                    </div>
                )}

                {/* Destinations Tab */}
                {activeTab === 'destinations' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Destinations ({destinations.length})</h2>
                            <Button size="sm" onClick={() => { setEditingItem(null); setShowDestForm(true); }}>+ New Destination</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {destinations.map(dest => (
                                <div key={dest.id} className="bg-charcoal-900 p-4 rounded-xl border border-white/10">
                                    {dest.image && <img src={dest.image} alt={dest.name} className="w-full h-40 object-cover rounded-lg mb-3" />}
                                    <h3 className="text-lg font-bold mb-2">{dest.name}</h3>
                                    <p className="text-sm text-charcoal-400 mb-3">{dest.description?.substring(0, 100)}...</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setEditingItem(dest); setShowDestForm(true); }} className="text-blue-400 text-sm hover:text-blue-300">Edit</button>
                                        <button onClick={() => handleDeleteDestination(dest.id)} className="text-red-400 text-sm hover:text-red-300">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Services Tab */}
                {activeTab === 'services' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Services ({services.length})</h2>
                            <Button size="sm" onClick={() => { setEditingItem(null); setShowServiceForm(true); }}>+ New Service</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {services.map(service => (
                                <div key={service.id} className="bg-charcoal-900 p-6 rounded-xl border border-white/10">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold">{service.title || service.name}</h3>
                                        <span className="text-2xl">{service.icon}</span>
                                    </div>
                                    <p className="text-charcoal-400 mb-4">{service.description}</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setEditingItem(service); setShowServiceForm(true); }} className="text-blue-400 text-sm hover:text-blue-300">Edit</button>
                                        <button onClick={() => handleDeleteService(service.id)} className="text-red-400 text-sm hover:text-red-300">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* FAQs Tab */}
                {activeTab === 'faqs' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">FAQs ({faqs.length})</h2>
                            <Button size="sm" onClick={() => { setEditingItem(null); setShowFAQForm(true); }}>+ New FAQ</Button>
                        </div>
                        <div className="space-y-3">
                            {faqs.map(faq => (
                                <div key={faq.id} className="bg-charcoal-900 p-6 rounded-xl border border-white/10">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold">{faq.question}</h3>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditingItem(faq); setShowFAQForm(true); }} className="text-blue-400 text-sm hover:text-blue-300">Edit</button>
                                            <button onClick={() => handleDeleteFAQ(faq.id)} className="text-red-400 text-sm hover:text-red-300">Delete</button>
                                        </div>
                                    </div>
                                    <p className="text-charcoal-400">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Enhanced Blogs Tab */}
                {activeTab === 'blogs' && (
                    <div className="space-y-6">
                        {/* Header with Actions */}
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Blog Management</h2>
                                <p className="text-charcoal-400 mt-1">{blogs.length} total articles</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setEditingItem(null); setShowBlogForm(true); }}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30"
                                >
                                    + Create New Blog
                                </button>
                                <button
                                    onClick={() => navigate('/blog')}
                                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/30"
                                >
                                    View Public Journal →
                                </button>
                            </div>
                        </div>

                        {/* Search & Filters */}
                        <div className="bg-gradient-to-br from-charcoal-900 to-charcoal-800 p-6 rounded-2xl border border-white/10 shadow-xl">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Search */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-charcoal-300 mb-2">Search Blogs</label>
                                    <input
                                        type="text"
                                        placeholder="Search by title, content, or author..."
                                        value={blogSearch}
                                        onChange={(e) => setBlogSearch(e.target.value)}
                                        className="w-full px-4 py-3 bg-charcoal-800 border border-charcoal-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Filter */}
                                <div>
                                    <label className="block text-sm font-semibold text-charcoal-300 mb-2">Filter by Status</label>
                                    <select
                                        value={blogFilter}
                                        onChange={(e) => setBlogFilter(e.target.value as any)}
                                        className="w-full px-4 py-3 bg-charcoal-800 border border-charcoal-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                    >
                                        <option value="all">All Blogs</option>
                                        <option value="published">Published Only</option>
                                        <option value="draft">Drafts Only</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Blogs Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {blogs
                                .filter(blog => {
                                    // Search filter
                                    const matchesSearch = blogSearch === '' ||
                                        blog.title?.toLowerCase().includes(blogSearch.toLowerCase()) ||
                                        blog.excerpt?.toLowerCase().includes(blogSearch.toLowerCase()) ||
                                        blog.content?.toLowerCase().includes(blogSearch.toLowerCase());

                                    // Status filter
                                    const matchesFilter = blogFilter === 'all' ||
                                        (blogFilter === 'published' && !blog.is_draft) ||
                                        (blogFilter === 'draft' && blog.is_draft);

                                    return matchesSearch && matchesFilter;
                                })
                                .map(blog => (
                                    <div
                                        key={blog.id}
                                        className="group bg-gradient-to-br from-charcoal-900 to-charcoal-800 p-6 rounded-2xl border border-white/10 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20"
                                    >
                                        {/* Image */}
                                        {blog.image && (
                                            <div className="mb-4 rounded-xl overflow-hidden">
                                                <img
                                                    src={blog.image}
                                                    alt={blog.title}
                                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        )}

                                        {/* Status Badges */}
                                        <div className="flex gap-2 mb-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${blog.is_draft
                                                ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
                                                : 'bg-green-600/20 text-green-400 border border-green-600/30'}`}>
                                                {blog.is_draft ? '📝 Draft' : '✓ Published'}
                                            </span>
                                            {blog.featured && (
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-600/20 text-purple-400 border border-purple-600/30">
                                                    ⭐ Featured
                                                </span>
                                            )}
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600/20 text-blue-400 border border-blue-600/30">
                                                {blog.category || 'Uncategorized'}
                                            </span>
                                        </div>

                                        {/* Title & Excerpt */}
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">{blog.title}</h3>
                                        <p className="text-charcoal-400 text-sm mb-4 line-clamp-2">{blog.excerpt}</p>

                                        {/* Meta Info */}
                                        <div className="flex items-center gap-4 text-xs text-charcoal-500 mb-4">
                                            <span>👤 {blog.author || 'Admin'}</span>
                                            <span>📅 {new Date(blog.created_at).toLocaleDateString()}</span>
                                            <span>⏱️ {blog.readTime || '5 min read'}</span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-4 border-t border-white/5">
                                            <button
                                                onClick={async () => {
                                                    await adminService.supabase
                                                        .from('blogs')
                                                        .update({ is_draft: !blog.is_draft })
                                                        .eq('id', blog.id);
                                                    await loadData();
                                                }}
                                                className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${blog.is_draft
                                                    ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30 border border-green-600/30'
                                                    : 'bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30 border border-yellow-600/30'}`}
                                            >
                                                {blog.is_draft ? '📤 Publish' : '📝 Draft'}
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    await adminService.supabase
                                                        .from('blogs')
                                                        .update({ featured: !blog.featured })
                                                        .eq('id', blog.id);
                                                    await loadData();
                                                }}
                                                className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${blog.featured
                                                    ? 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 border border-purple-600/30'
                                                    : 'bg-charcoal-700 text-charcoal-300 hover:bg-charcoal-600 border border-charcoal-600'}`}
                                            >
                                                {blog.featured ? '⭐ Featured' : 'Set Featured'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteBlog(blog.id)}
                                                className="px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg font-semibold text-sm transition-all border border-red-600/30"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        {/* Empty State */}
                        {blogs.filter(blog => {
                            const matchesSearch = blogSearch === '' ||
                                blog.title?.toLowerCase().includes(blogSearch.toLowerCase());
                            const matchesFilter = blogFilter === 'all' ||
                                (blogFilter === 'published' && !blog.is_draft) ||
                                (blogFilter === 'draft' && blog.is_draft);
                            return matchesSearch && matchesFilter;
                        }).length === 0 && (
                                <div className="text-center py-16">
                                    <div className="text-6xl mb-4">📝</div>
                                    <h3 className="text-xl font-bold mb-2">No blogs found</h3>
                                    <p className="text-charcoal-400">Try adjusting your search or filters</p>
                                </div>
                            )}
                    </div>
                )}

                {/* Destinations Tab */}
                {activeTab === 'destinations' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Destinations ({destinations.length})</h2>
                            <Button size="sm" onClick={() => { setEditingItem(null); setShowDestForm(true); }}>+ New Destination</Button>
                        </div>
                        {/* Placeholder for destinations content */}
                        <div className="text-center text-charcoal-400 py-8">Destinations content will go here.</div>
                    </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Reviews ({reviews.length})</h2>
                        <div className="space-y-3">
                            {reviews.map(review => (
                                <div key={review.id} className="bg-charcoal-900 p-6 rounded-xl border border-white/10">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold">{review.profiles?.full_name || 'Anonymous'}</h3>
                                            <div className="text-yellow-400">{'⭐'.repeat(review.rating || 0)}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            {!review.approved && <button onClick={() => handleApproveReview(review.id)} className="text-green-400 text-sm">Approve</button>}
                                            <button onClick={() => handleDeleteReview(review.id)} className="text-red-400 text-sm">Delete</button>
                                        </div>
                                    </div>
                                    <p className="text-charcoal-400">{review.comment}</p>
                                    <div className="text-sm text-charcoal-500 mt-2">Status: {review.approved ? 'Approved' : 'Pending'}</div>
                                </div>
                            ))}
                            {reviews.length === 0 && <div className="text-center text-charcoal-400 py-8">No reviews found</div>}
                        </div>
                    </div>
                )}

                {/* Contact Messages Tab */}
                {activeTab === 'contacts' && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Contact Messages ({contactMessages.length})</h2>
                        <div className="space-y-3">
                            {contactMessages.map(msg => (
                                <div key={msg.id} className="bg-charcoal-900 p-6 rounded-xl border border-white/10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg">{msg.name}</h3>
                                            <p className="text-charcoal-400 text-sm">{msg.email}</p>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <span className={`text-xs px-3 py-1 rounded-full ${msg.read ? 'bg-green-600/20 text-green-400' : 'bg-blue-600/20 text-blue-400'}`}>
                                                {msg.read ? 'Read' : 'New'}
                                            </span>
                                            <button onClick={() => adminService.deleteContactMessage(msg.id).then(loadData)} className="text-red-400 text-sm hover:text-red-300">Delete</button>
                                        </div>
                                    </div>
                                    <p className="text-charcoal-300 whitespace-pre-wrap">{msg.message}</p>
                                    <div className="text-sm text-charcoal-500 mt-3">
                                        {new Date(msg.created_at).toLocaleString()}
                                    </div>
                                    {!msg.read && (
                                        <button
                                            onClick={() => adminService.markContactAsRead(msg.id).then(loadData)}
                                            className="mt-3 text-blue-400 text-sm hover:text-blue-300"
                                        >
                                            Mark as Read
                                        </button>
                                    )}
                                </div>
                            ))}
                            {contactMessages.length === 0 && <div className="text-center text-charcoal-400 py-8">No contact messages</div>}
                        </div>
                    </div>
                )}

                {/* Newsletter Subscribers Tab */}
                {activeTab === 'newsletter' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center flex-wrap gap-4">
                            <h2 className="text-2xl font-bold">Newsletter Subscribers ({newsletterSubscribers.length})</h2>
                            <RefreshControl
                                lastRefresh={lastRefresh}
                                onRefresh={handleManualRefresh}
                                autoRefresh={autoRefresh}
                                onToggleAutoRefresh={handleToggleAutoRefresh}
                                isRefreshing={isRefreshing}
                            />
                        </div>

                        {/* Bulk Actions */}
                        <BulkActions
                            selectedCount={selectedNewsletterIds.length}
                            totalCount={newsletterSubscribers.length}
                            onSelectAll={handleSelectAllNewsletter}
                            onDeselectAll={handleDeselectAllNewsletter}
                            onBulkDelete={handleBulkDeleteNewsletter}
                            onBulkEmail={handleBulkEmailNewsletter}
                        />

                        {/* Email Composer Modal */}
                        <EmailComposer
                            isOpen={showEmailComposer}
                            onClose={() => setShowEmailComposer(false)}
                            recipients={newsletterSubscribers
                                .filter((s: any) => selectedNewsletterIds.includes(s.id))
                                .map((s: any) => s.email)}
                            onSend={handleSendBulkEmail}
                        />

                        <div className="bg-charcoal-900 rounded-xl border border-white/10 overflow-hidden">
                            <table className="w-full admin-table">
                                <thead className="bg-charcoal-800">
                                    <tr>
                                        <th className="text-left p-4 w-12">
                                            <input
                                                type="checkbox"
                                                checked={selectedNewsletterIds.length === newsletterSubscribers.length && newsletterSubscribers.length > 0}
                                                onChange={(e) => e.target.checked ? handleSelectAllNewsletter() : handleDeselectAllNewsletter()}
                                                className="w-4 h-4 rounded border-white/20 bg-charcoal-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                                            />
                                        </th>
                                        <th className="text-left p-4">Email</th>
                                        <th className="text-left p-4">Subscribed Date</th>
                                        <th className="text-left p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {newsletterSubscribers.map(subscriber => (
                                        <tr key={subscriber.id} className="border-t border-white/5 hover:bg-charcoal-800/50 transition-all">
                                            <td className="p-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedNewsletterIds.includes(subscriber.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedNewsletterIds([...selectedNewsletterIds, subscriber.id]);
                                                        } else {
                                                            setSelectedNewsletterIds(selectedNewsletterIds.filter(id => id !== subscriber.id));
                                                        }
                                                    }}
                                                    className="w-4 h-4 rounded border-white/20 bg-charcoal-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                                                />
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-emerald-400">✉️</span>
                                                    <span className="font-medium">{subscriber.email}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-charcoal-400">
                                                {new Date(subscriber.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => handleDeleteNewsletterSubscriber(subscriber.id)}
                                                    className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {newsletterSubscribers.length === 0 && (
                                <div className="text-center text-charcoal-400 py-12">
                                    <div className="text-4xl mb-2">📭</div>
                                    <p>No newsletter subscribers yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Bookings Tab */}
                {activeTab === 'bookings' && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Bookings Management ({bookings.length})</h2>
                        <div className="bg-charcoal-900 rounded-xl border border-white/10 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-charcoal-800">
                                    <tr>
                                        <th className="text-left p-4">User</th>
                                        <th className="text-left p-4">Destination</th>
                                        <th className="text-left p-4">Price</th>
                                        <th className="text-left p-4">Status</th>
                                        <th className="text-left p-4">Payment</th>
                                        <th className="text-left p-4">Date</th>
                                        <th className="text-left p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map(booking => (
                                        <tr key={booking.id} className="border-t border-white/5">
                                            <td className="p-4">{booking.profiles?.email || 'N/A'}</td>
                                            <td className="p-4">{booking.trip_requests?.destination || 'N/A'}</td>
                                            <td className="p-4">{booking.currency} {booking.total_price?.toLocaleString()}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs ${booking.status === 'confirmed' ? 'bg-green-600/20 text-green-400' :
                                                    booking.status === 'completed' ? 'bg-blue-600/20 text-blue-400' :
                                                        booking.status === 'cancelled' ? 'bg-red-600/20 text-red-400' :
                                                            'bg-yellow-600/20 text-yellow-400'
                                                    }`}>{booking.status}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs ${booking.payment_status === 'paid' ? 'bg-green-600/20 text-green-400' :
                                                    booking.payment_status === 'refunded' ? 'bg-blue-600/20 text-blue-400' :
                                                        booking.payment_status === 'failed' ? 'bg-red-600/20 text-red-400' :
                                                            'bg-yellow-600/20 text-yellow-400'
                                                    }`}>{booking.payment_status}</span>
                                            </td>
                                            <td className="p-4">{new Date(booking.booking_date).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    {booking.status === 'pending' && (
                                                        <button
                                                            onClick={async () => {
                                                                await adminService.updateBooking(booking.id, { status: 'confirmed', confirmed_at: new Date().toISOString() });
                                                                await loadData();
                                                            }}
                                                            className="text-green-400 hover:text-green-300 text-sm"
                                                        >Confirm</button>
                                                    )}
                                                    {booking.status !== 'cancelled' && (
                                                        <button
                                                            onClick={async () => {
                                                                await adminService.updateBooking(booking.id, { status: 'cancelled', cancelled_at: new Date().toISOString() });
                                                                await loadData();
                                                            }}
                                                            className="text-yellow-400 hover:text-yellow-300 text-sm"
                                                        >Cancel</button>
                                                    )}
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm('Delete this booking?')) {
                                                                await adminService.deleteBooking(booking.id);
                                                                await loadData();
                                                            }
                                                        }}
                                                        className="text-red-400 hover:text-red-300 text-sm"
                                                    >Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {bookings.length === 0 && <div className="text-center text-charcoal-400 py-8">No bookings found</div>}
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Admin Settings</h2>

                        <div className="bg-charcoal-900 p-6 rounded-xl border border-white/10">
                            <h3 className="text-xl font-bold mb-4">Database Information</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-charcoal-400">Supabase Project:</span>
                                    <span className="font-mono">dadaybwtuvedpwedlmnm</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-charcoal-400">Total Records:</span>
                                    <span>{stats.totalUsers + destinations.length + services.length + faqs.length + blogs.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-charcoal-400">Admin Role:</span>
                                    <span className="text-green-400">Active</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-charcoal-900 p-6 rounded-xl border border-white/10">
                            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Button onClick={loadData} className="w-full">Refresh All Data</Button>
                                <Button onClick={() => setActiveTab('overview')} variant="secondary" className="w-full">Go to Dashboard</Button>
                            </div>
                        </div>

                        <div className="bg-charcoal-900 p-6 rounded-xl border border-white/10">
                            <h3 className="text-xl font-bold mb-4">Admin Account</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-charcoal-400">Email:</span>
                                    <span>{user?.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-charcoal-400">Role:</span>
                                    <span className="text-blue-400">{user?.role || 'admin'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-charcoal-900 p-6 rounded-xl border border-white/10">
                            <h3 className="text-xl font-bold mb-4">Recent Admin Activity</h3>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {adminLogs.slice(0, 20).map(log => (
                                    <div key={log.id} className="border-b border-white/5 pb-3 last:border-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="flex gap-2 items-center">
                                                <span className={`px-2 py-1 rounded text-xs ${log.action_type === 'create' ? 'bg-green-600/20 text-green-400' :
                                                    log.action_type === 'update' ? 'bg-blue-600/20 text-blue-400' :
                                                        log.action_type === 'delete' ? 'bg-red-600/20 text-red-400' :
                                                            log.action_type === 'approve' ? 'bg-purple-600/20 text-purple-400' :
                                                                'bg-yellow-600/20 text-yellow-400'
                                                    }`}>{log.action_type}</span>
                                                <span className="text-sm font-mono text-charcoal-300">{log.table_name}</span>
                                            </div>
                                            <span className="text-xs text-charcoal-500">{new Date(log.created_at).toLocaleString()}</span>
                                        </div>
                                        <div className="text-sm text-charcoal-400">
                                            {log.admin_email} - {log.description || `${log.action_type} on ${log.table_name}`}
                                        </div>
                                    </div>
                                ))}
                                {adminLogs.length === 0 && <div className="text-center text-charcoal-400 py-4">No admin activity logged yet</div>}
                            </div>
                        </div>
                    </div>
                )}

                {/* Form Modals */}
                {showFAQForm && (
                    <FAQForm
                        initialData={editingItem}
                        onSubmit={handleSaveFAQ}
                        onCancel={() => { setShowFAQForm(false); setEditingItem(null); }}
                    />
                )}
                {showDestForm && (
                    <DestinationForm
                        initialData={editingItem}
                        onSubmit={handleSaveDestination}
                        onCancel={() => { setShowDestForm(false); setEditingItem(null); }}
                    />
                )}
                {showServiceForm && (
                    <ServiceForm
                        initialData={editingItem}
                        onSubmit={handleSaveService}
                        onCancel={() => { setShowServiceForm(false); setEditingItem(null); }}
                    />
                )}
                {showBlogForm && (
                    <BlogForm
                        initialData={editingItem}
                        onSubmit={handleSaveBlog}
                        onCancel={() => { setShowBlogForm(false); setEditingItem(null); }}
                    />
                )}
            </div>
        </div >
    );
};