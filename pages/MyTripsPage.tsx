import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { tripService } from '../services/tripService';
import { Button } from '../components/Button';
import { DocumentUpload } from '../components/DocumentUpload';
import { adminService } from '../services/adminService';

import { documentService } from '../services/documentService';
import { TripCardSkeleton } from '../components/Cards/TripCardSkeleton';

export const MyTripsPage = () => {
    const navigate = useNavigate();
    const { user, isLoadingAuth, currentTripPlan, updateTripPlan } = useAppContext();
    const [trips, setTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        loadTrips();
    }, [user]);

    const loadTrips = async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const userTrips = await tripService.getUserTrips(user.id);
            setTrips(userTrips);
        } catch (error) {
            console.error('Failed to load trips:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewTrip = (trip: any) => {
        const tripPlan = tripService.dbTripToTripPlan(trip);
        updateTripPlan(tripPlan);
        navigate('/result');
    };

    const handleDeleteTrip = async (tripId: string) => {
        if (!confirm('Are you sure you want to delete this trip?')) return;

        try {
            setDeletingId(tripId);
            await tripService.deleteTrip(tripId, user!.id);
            setTrips(trips.filter(t => t.id !== tripId));
        } catch (error: any) {
            alert(error.message || 'Failed to delete trip');
        } finally {
            setDeletingId(null);
        }
    };

    const handleAddDocument = async (trip: any, result: any) => {
        const newDoc = {
            name: result.name,
            path: result.path,
            uploaded_at: new Date().toISOString()
        };

        const updatedTripData = {
            ...trip.trip_data,
            documents: [...(trip.trip_data?.documents || []), newDoc]
        };

        try {
            await tripService.updateTrip(trip.id, user!.id, updatedTripData);
            setTrips(trips.map(t => t.id === trip.id ? { ...t, trip_data: updatedTripData } : t));
            alert('✅ Document attached!');
        } catch (error) {
            console.error(error);
            alert('Failed to save document attachment');
        }
    };

    const handleViewDocument = async (path: string) => {
        try {
            const url = await adminService.getDocumentUrl(path);
            window.open(url, '_blank');
        } catch (error) {
            console.error(error);
            alert('Failed to open document');
        }
    };

    const handleDeleteDocument = async (trip: any, index: number) => {
        if (!confirm('Remove this document?')) return;

        const updatedDocs = [...(trip.trip_data?.documents || [])];
        updatedDocs.splice(index, 1);

        const updatedTripData = {
            ...trip.trip_data,
            documents: updatedDocs
        };

        try {
            await tripService.updateTrip(trip.id, user!.id, updatedTripData);
            setTrips(trips.map(t => t.id === trip.id ? { ...t, trip_data: updatedTripData } : t));
        } catch (error) {
            console.error(error);
            alert('Failed to remove document');
        }
    };

    // Loading state
    if (isLoadingAuth || loading) {
        return (
            <div className="min-h-screen bg-sand-50 dark:bg-charcoal-950 pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-10 animate-pulse">
                        <div>
                            <div className="h-12 w-48 bg-sand-200 dark:bg-charcoal-700 rounded-lg mb-2"></div>
                            <div className="h-4 w-32 bg-sand-200 dark:bg-charcoal-700 rounded"></div>
                        </div>
                        <div className="h-10 w-32 bg-sand-200 dark:bg-charcoal-700 rounded-xl"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => <TripCardSkeleton key={i} />)}
                    </div>
                </div>
            </div>
        );
    }

    // Not logged in
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-sand-50 dark:bg-charcoal-950 px-4">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-6">🔒</div>
                    <h1 className="text-3xl font-bold text-charcoal-900 dark:text-white mb-4">Login Required</h1>
                    <p className="text-charcoal-600 dark:text-sand-300 mb-6">
                        Please log in to view your saved trips.
                    </p>
                    <Button onClick={() => navigate('/login')}>Go to Login</Button>
                </div>
            </div>
        );
    }

    // Empty state
    if (trips.length === 0) {
        return (
            <div className="min-h-screen bg-sand-50 dark:bg-charcoal-950 pt-24 px-4">
                <div className="max-w-4xl mx-auto text-center py-20">
                    <div className="text-8xl mb-8">✈️</div>
                    <h1 className="text-4xl font-bold text-charcoal-900 dark:text-white mb-4 font-display">
                        No Trips Yet
                    </h1>
                    <p className="text-charcoal-600 dark:text-sand-300 text-lg mb-8 max-w-lg mx-auto">
                        Start planning your next adventure! Our AI will create a personalized itinerary just for you.
                    </p>
                    <Button variant="primary" onClick={() => navigate('/plan')}>
                        Plan Your First Trip
                    </Button>
                </div>
            </div>
        );
    }

    // Trips list
    return (
        <div className="min-h-screen bg-sand-50 dark:bg-charcoal-950 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-charcoal-900 dark:text-white mb-2 font-display">
                            My Trips
                        </h1>
                        <p className="text-charcoal-600 dark:text-sand-300">
                            {trips.length} {trips.length === 1 ? 'trip' : 'trips'} saved
                        </p>
                    </div>
                    <Button variant="primary" onClick={() => navigate('/plan')}>
                        + Plan New Trip
                    </Button>
                </div>

                {/* Trips Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.map((trip) => (
                        <div
                            key={trip.id}
                            className="bg-white dark:bg-charcoal-900 rounded-2xl border border-sand-200 dark:border-charcoal-700 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                        >
                            {/* Card Header */}
                            <div className="p-6 border-b border-sand-100 dark:border-charcoal-800">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-xl font-bold text-charcoal-900 dark:text-white group-hover:text-forest-600 dark:group-hover:text-forest-400 transition-colors line-clamp-2 flex-1">
                                        {trip.trip_name}
                                    </h3>
                                </div>
                                <p className="text-sm text-charcoal-600 dark:text-sand-300 line-clamp-2 mb-3">
                                    {trip.trip_data?.summary || trip.summary || 'No description'}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                    {trip.trip_data?.itinerary && (
                                        <span className="px-3 py-1 bg-forest-100 dark:bg-forest-900/30 text-forest-800 dark:text-forest-300 rounded-full text-xs font-bold">
                                            {trip.trip_data.itinerary.length} Days
                                        </span>
                                    )}
                                    {trip.trip_data?.totalBudgetEstimation && (
                                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-bold">
                                            {trip.trip_data.totalBudgetEstimation}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 bg-sand-50 dark:bg-charcoal-800/50">
                                <div className="flex items-center justify-between text-xs text-charcoal-500 dark:text-charcoal-400 mb-4">
                                    <span>📅 {new Date(trip.created_at).toLocaleDateString()}</span>
                                    {trip.trip_data?.qualityScore && (
                                        <span className="font-bold text-forest-600 dark:text-forest-400">
                                            Score: {trip.trip_data.qualityScore.score}/100
                                        </span>
                                    )}
                                </div>

                                {/* Documents Section */}
                                <div className="mb-4 pt-4 border-t border-sand-200 dark:border-charcoal-700">
                                    <h4 className="text-sm font-bold text-charcoal-800 dark:text-sand-200 mb-2">Attached Documents</h4>
                                    <div className="space-y-2 mb-3">
                                        {trip.trip_data?.documents?.map((doc: any, idx: number) => (
                                            <div key={idx} className="flex justify-between items-center text-sm bg-white dark:bg-charcoal-900 p-2 rounded border border-sand-200 dark:border-charcoal-700">
                                                <button
                                                    onClick={() => handleViewDocument(doc.path)}
                                                    className="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[150px] text-left"
                                                    title={doc.name}
                                                >
                                                    📄 {doc.name}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteDocument(trip, idx)}
                                                    className="text-red-500 hover:text-red-700 ml-2"
                                                    title="Remove"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                        {(!trip.trip_data?.documents || trip.trip_data.documents.length === 0) && (
                                            <p className="text-xs text-charcoal-400 italic">No documents attached</p>
                                        )}
                                    </div>
                                    <DocumentUpload
                                        onUploadComplete={(result) => handleAddDocument(trip, result)}
                                        label="+ Attach File"
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleViewTrip(trip)}
                                        className="flex-1"
                                    >
                                        View Details
                                    </Button>
                                    <button
                                        onClick={() => handleDeleteTrip(trip.id)}
                                        disabled={deletingId === trip.id}
                                        className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {deletingId === trip.id ? '...' : '🗑️'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
