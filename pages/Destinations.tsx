
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';

interface Destination {
    id: string;
    name: string;
    country: string;
    description: string;
    image_url: string;
    region: string;
    best_time_to_visit: string;
    created_at: string;
}

export const Destinations = () => {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRegion, setSelectedRegion] = useState<string>('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchDestinations();
    }, []);

    const fetchDestinations = async () => {
        try {
            const { data, error } = await supabase
                .from('destinations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setDestinations(data || []);
        } catch (error) {
            console.error('Error fetching destinations:', error);
        } finally {
            setLoading(false);
        }
    };

    const regions = ['all', ...Array.from(new Set(destinations.map(d => d.region)))];
    const filteredDestinations = selectedRegion === 'all'
        ? destinations
        : destinations.filter(d => d.region === selectedRegion);

    const handlePlanTrip = (destinationName: string) => {
        navigate('/plan', { state: { destination: destinationName } });
    };

    return (
        <>
            <Helmet>
                <title>Popular Destinations - TravelMate</title>
                <meta name="description" content="Explore popular travel destinations and start planning your next adventure with TravelMate's AI-powered trip planner." />
            </Helmet>
            <div className="min-h-screen bg-sand-50 dark:bg-charcoal-950 transition-colors pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="text-center mb-16 animate-fade-in-up">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-clay-500 to-clay-700 rounded-full mb-8 shadow-2xl animate-float">
                            <span className="text-5xl">🗺️</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-charcoal-900 dark:text-white mb-6 font-display">
                            Explore Destinations
                        </h1>
                        <p className="text-xl text-charcoal-600 dark:text-sand-300 max-w-3xl mx-auto leading-relaxed">
                            Discover amazing places around the world and start planning your perfect trip with AI-powered itineraries.
                        </p>
                    </div>

                    {/* Region Filter */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in-up">
                        {regions.map((region) => (
                            <button
                                key={region}
                                onClick={() => setSelectedRegion(region)}
                                className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${selectedRegion === region
                                    ? 'bg-gradient-to-r from-forest-500 to-forest-700 text-white shadow-lg scale-105'
                                    : 'bg-white dark:bg-charcoal-900 text-charcoal-700 dark:text-sand-200 border border-sand-200 dark:border-charcoal-700 hover:shadow-md hover:scale-105'
                                    }`}
                            >
                                {region.charAt(0).toUpperCase() + region.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-forest-500 border-t-transparent"></div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && filteredDestinations.length === 0 && (
                        <div className="text-center py-20 animate-fade-in-up">
                            <div className="text-6xl mb-6">🌍</div>
                            <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-4">No destinations found</h2>
                            <p className="text-charcoal-600 dark:text-sand-300 mb-8">
                                {selectedRegion === 'all'
                                    ? "We're adding new destinations soon! In the meantime, you can plan a trip to any destination you'd like."
                                    : `No destinations found in ${selectedRegion}. Try selecting a different region.`}
                            </p>
                            <a
                                href="/plan"
                                className="inline-block bg-gradient-to-r from-forest-500 to-forest-700 text-white font-bold px-8 py-3 rounded-full hover:from-forest-600 hover:to-forest-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform duration-200"
                            >
                                Plan Custom Trip
                            </a>
                        </div>
                    )}

                    {/* Destinations Grid */}
                    {!loading && filteredDestinations.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredDestinations.map((destination, idx) => (
                                <div
                                    key={destination.id}
                                    className="group bg-white dark:bg-charcoal-900 rounded-[2rem] overflow-hidden border border-sand-200 dark:border-charcoal-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in-up"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    {/* Image */}
                                    <div className="relative h-56 overflow-hidden">
                                        {destination.image_url ? (
                                            <img
                                                src={destination.image_url}
                                                alt={destination.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-clay-400 to-clay-600 flex items-center justify-center text-6xl">
                                                🌆
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-charcoal-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-charcoal-900 dark:text-white">
                                            {destination.region}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-2 font-display">
                                            {destination.name}
                                        </h3>
                                        <p className="text-charcoal-500 dark:text-sand-400 text-sm mb-3 flex items-center gap-2">
                                            <span>📍</span>
                                            {destination.country}
                                        </p>
                                        <p className="text-charcoal-600 dark:text-sand-300 text-sm mb-4 line-clamp-3">
                                            {destination.description}
                                        </p>
                                        {destination.best_time_to_visit && (
                                            <p className="text-forest-600 dark:text-forest-400 text-sm mb-4 flex items-center gap-2">
                                                <span>🌤️</span>
                                                Best time: {destination.best_time_to_visit}
                                            </p>
                                        )}
                                        <button
                                            onClick={() => handlePlanTrip(destination.name)}
                                            className="w-full bg-gradient-to-r from-forest-500 to-forest-700 text-white font-bold py-3 px-6 rounded-xl hover:from-forest-600 hover:to-forest-800 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                        >
                                            <span>Plan Trip</span>
                                            <span>→</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* CTA */}
                    <div className="mt-20 text-center bg-gradient-to-r from-clay-500 to-clay-700 rounded-[3rem] p-12 md:p-16 animate-fade-in-up shadow-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">
                            Don't See Your Dream Destination?
                        </h2>
                        <p className="text-xl text-clay-50 mb-8 max-w-2xl mx-auto">
                            No problem! TravelMate can plan trips to anywhere in the world.
                            Just tell us where you want to go.
                        </p>
                        <a
                            href="/plan"
                            className="inline-block bg-white text-clay-700 font-bold px-10 py-4 rounded-full hover:bg-sand-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform duration-200 text-lg"
                        >
                            Plan Custom Trip →
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};
