import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/Button';
import { ItineraryDay } from '../types';
import { InteractiveMap } from '../components/InteractiveMap';
import { TripChat } from '../components/TripChat';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { TripComments } from '../components/TripComments';
import { SpotifyWidget } from '../components/SpotifyWidget';

export const TripResult = () => {
    const navigate = useNavigate();
    const { shareId } = useParams<{ shareId: string }>(); // Get shareId from URL
    const { currentTripPlan, isGenerating, user, saveTrip, updateTripPlan, setTripPlan } = useAppContext();
    const [isSaving, setIsSaving] = useState(false);
    const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    // State for Public Toggle (initialized from plan)
    const [isPublic, setIsPublic] = useState(false);

    // Fetch trip if accessing via Share Link
    useEffect(() => {
        const fetchSharedTrip = async () => {
            if (shareId) {
                try {
                    // Dynamic import to avoid circular dependency issues if any
                    const { tripService } = await import('../services/tripService');
                    const trip = await tripService.getTripByShareId(shareId);
                    if (trip) {
                        const plan = tripService.dbTripToTripPlan(trip);
                        setTripPlan(plan);
                    }
                } catch (error) {
                    console.error("Failed to load shared trip", error);
                    navigate('/');
                }
            }
        };

        if (shareId && !currentTripPlan) {
            fetchSharedTrip();
        } else if (shareId && currentTripPlan && currentTripPlan.shareId !== shareId) {
            // If we have a plan but it doesn't match the URL (rare case of nav), fetch
            fetchSharedTrip();
        }
    }, [shareId, navigate, setTripPlan, currentTripPlan]);

    // Update local state when currentTripPlan changes
    useEffect(() => {
        if (currentTripPlan) {
            setIsPublic(!!currentTripPlan.isPublic);
        }
    }, [currentTripPlan]);

    useEffect(() => {
        if (!currentTripPlan && !isGenerating && !shareId) navigate('/plan');
    }, [currentTripPlan, isGenerating, navigate, shareId]);

    const isOwner = user && currentTripPlan?.id && (!shareId || (user.savedTrips?.some(t => t.id === currentTripPlan.id))); // Rough check for ownership

    if (!currentTripPlan) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-sand-50 dark:bg-charcoal-950">
                <div className="w-24 h-24 border-4 border-forest-200 border-t-forest-600 rounded-full animate-spin mb-6"></div>
                <p className="text-forest-800 dark:text-forest-200 font-display text-xl animate-pulse">
                    {shareId ? "Loading shared trip..." : "Consulting the maps..."}
                </p>
            </div>
        );
    }

    const handleSaveTrip = async () => {
        if (!user) {
            if (confirm("Log in to save this trip?")) navigate('/login');
            return;
        }

        try {
            setIsSaving(true);
            // Include isPublic in the trip plan before saving
            const tripToSave = { ...currentTripPlan, isPublic };
            await saveTrip(tripToSave);
            alert("✅ Trip saved successfully!" + (isPublic ? " Your trip is now visible in the community!" : ""));
        } catch (error: any) {
            console.error('Save trip error:', error);
            alert("❌ Failed to save trip: " + (error.message || 'Unknown error'));
        } finally {
            setIsSaving(false);
        }
    };

    // const getGoogleMapsUrl = (query: string) => {
    //     return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    // };

    const toggleDay = (idx: number) => {
        setActiveDayIndex(activeDayIndex === idx ? -1 : idx);
    };

    const togglePackingItem = (item: string) => {
        setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }));
    };

    // --- DOWNLOAD & SHARE HANDLERS ---


    const handleSaveOffline = async () => {
        if (!currentTripPlan) return;
        try {
            // dynamic import to avoid SSR/build issues if any
            const { offlineService } = await import('../services/offlineService');
            const success = offlineService.saveTripOffline(currentTripPlan);
            if (success) {
                alert("✅ Trip downloaded for offline use!");
            } else {
                alert("❌ Failed to save offline. Storage might be full.");
            }
        } catch (e) {
            console.error(e);
            alert("Error saving offline.");
        }
    };

    const handleExportCalendar = () => {
        // Simple .ics generation
        let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//TravelMate//Trip Plan//EN\n";

        currentTripPlan.itinerary.forEach((day, i) => {
            const dateStr = new Date().toISOString().replace(/-|:|\.\d\d\d/g, "").substring(0, 8); // Mock date for now
            // In real app, parse day.date strictly

            day.activities.forEach((act: any) => {
                icsContent += "BEGIN:VEVENT\n";
                icsContent += `SUMMARY:${act.activity}\n`;
                icsContent += `DESCRIPTION:${act.description}\n`;
                icsContent += `LOCATION:${day.city}\n`;
                icsContent += `DTSTART;VALUE=DATE:${dateStr}\n`; // All day for simplicity or parse time
                icsContent += "END:VEVENT\n";
            });
        });

        icsContent += "END:VCALENDAR";

        const element = document.createElement("a");
        const file = new Blob([icsContent], { type: 'text/calendar' });
        element.href = URL.createObjectURL(file);
        element.download = `Trip_${currentTripPlan.tripName.replace(/\s+/g, '_')}.ics`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const handleDownloadHTML = () => {
        const trip = currentTripPlan;
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${trip.tripName} - Itinerary</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; color: #333; }
                    h1 { color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px; }
                    .summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #2ecc71; }
                    .day-card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
                    .day-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px; }
                    .day-title { font-size: 1.2em; font-weight: bold; color: #2980b9; }
                    .activity { padding: 10px 0; border-bottom: 1px dashed #eee; display: flex; gap: 15px; }
                    .time { font-weight: bold; color: #7f8c8d; min-width: 80px; }
                    .act-details h4 { margin: 0 0 5px 0; color: #2c3e50; }
                    .act-details p { margin: 0; font-size: 0.9em; color: #666; }
                    .badge { background: #e0f2f1; color: #00695c; padding: 2px 6px; border-radius: 4px; font-size: 0.8em; }
                    .footer { margin-top: 50px; text-align: center; color: #aaa; font-size: 0.8em; }
                    @media print { body { max-width: 100%; margin: 0; } .day-card { break-inside: avoid; } }
                </style>
            </head>
            <body>
                <h1>✈️ ${trip.tripName}</h1>
                
                <div class="summary">
                    <p><strong>Duration:</strong> ${trip.itinerary.length} Days</p>
                    <p><strong>Budget:</strong> ${trip.totalBudgetEstimation}</p>
                    <p>${trip.summary}</p>
                </div>

                ${trip.itinerary.map(day => `
                    <div class="day-card">
                        <div class="day-header">
                            <span class="day-title">Day ${day.day}: ${day.title || day.city}</span>
                            <small>${day.city}</small>
                        </div>
                        ${day.activities.map(act => `
                            <div class="activity">
                                <div class="time">${act.time}</div>
                                <div class="act-details">
                                    <h4>${act.activity} <span class="badge">${act.type}</span></h4>
                                    <p>${act.description}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `).join('')}

                <div class="footer">
                    <p>Planned with TravelMate AI • ${new Date().toLocaleDateString()}</p>
                </div>
            </body>
            </html>
        `;

        const element = document.createElement("a");
        const file = new Blob([htmlContent], { type: 'text/html' });
        element.href = URL.createObjectURL(file);
        element.download = `TravelMate_${trip.tripName.replace(/\s+/g, '_')}.html`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const handleShareWhatsApp = () => {
        const text = `Check out this trip to ${currentTripPlan.tripName} I planned with TravelMate! 🌍✈️`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleCopyLink = async () => {
        // Use shareId if available, fall back to current URL if owner, or generic
        let link = window.location.href;
        if (currentTripPlan.shareId) {
            link = `${window.location.origin}/trip/share/${currentTripPlan.shareId}`;
        }

        await navigator.clipboard.writeText(link);
        alert("Trip link copied to clipboard!");
        setShowShareModal(false);
    };

    return (
        <div className="min-h-screen bg-sand-50 dark:bg-charcoal-950 pt-24 pb-20 transition-colors duration-500">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* --- Header --- */}
                <div className="mb-10 animate-fade-in-up">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                        <div className="flex-1">
                            {/* ... Content ... */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="px-3 py-1 bg-forest-100 dark:bg-forest-900/50 text-forest-800 dark:text-forest-200 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {currentTripPlan.itinerary?.length} Days
                                </span>
                                <span className="px-3 py-1 bg-clay-100 dark:bg-clay-900/50 text-clay-800 dark:text-clay-200 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {currentTripPlan.totalBudgetEstimation}
                                </span>
                                {/* SUITABILITY TAGS */}
                                {currentTripPlan.suitabilityTags?.map((tag, i) => (
                                    <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-200 dark:border-blue-800">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold text-charcoal-900 dark:text-white font-display leading-tight">
                                {currentTripPlan.tripName}
                            </h1>
                            <p className="text-charcoal-500 dark:text-sand-300 mt-2 text-lg max-w-2xl leading-relaxed">{currentTripPlan.summary}</p>
                        </div>

                        {/* QUALITY SCORE & ACTIONS */}
                        <div className="flex flex-col gap-4 items-end">
                            {currentTripPlan.qualityScore && (
                                <div className="flex items-center gap-4 bg-white dark:bg-charcoal-900 p-2 pr-6 rounded-full border border-sand-200 dark:border-charcoal-700 shadow-sm">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${currentTripPlan.qualityScore.score >= 80 ? 'bg-green-500' :
                                        currentTripPlan.qualityScore.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}>
                                        {currentTripPlan.qualityScore.score}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-bold uppercase text-charcoal-400">Trip Score</div>
                                        <div className="font-bold text-charcoal-900 dark:text-white leading-none">{currentTripPlan.qualityScore.text}</div>
                                    </div>
                                </div>
                            )}

                            {/* Public Toggle - Share to Community */}
                            {user && isOwner && (
                                <div className="flex items-center gap-3 mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-800">
                                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={isPublic}
                                                onChange={(e) => setIsPublic(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-sand-300 dark:bg-charcoal-700 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-purple-700 transition-all"></div>
                                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-md"></div>
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm font-bold text-charcoal-900 dark:text-white block">
                                                Share to Community
                                            </span>
                                            <span className="text-xs text-charcoal-600 dark:text-sand-400">
                                                {isPublic ? '✨ Visible to all users' : '🔒 Private - only you can see'}
                                            </span>
                                        </div>
                                    </label>
                                    {isPublic && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-charcoal-800 rounded-full border border-purple-300 dark:border-purple-700">
                                            <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                                                🌍 Public
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setShowShareModal(true)}>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                    Share
                                </Button>
                                <Button variant="outline" onClick={handleDownloadHTML}>
                                    <span className="mr-2">📄</span> Download Itinerary
                                </Button>

                                <Button variant="outline" onClick={handleExportCalendar}>
                                    <span className="mr-2">📅</span> Export
                                </Button>
                                <Button variant="outline" onClick={handleSaveOffline}>
                                    <span className="mr-2">⬇️</span> Offline
                                </Button>
                                {isOwner ? (
                                    <Button variant="primary" onClick={handleSaveTrip} isLoading={isSaving}>Save Trip</Button>
                                ) : (
                                    <Button variant="primary" onClick={handleDownloadHTML}>Download Copy</Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">

                    {/* --- Left Column: Itinerary Cards --- */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* --- Mobile Only: Quick Stats & Context --- */}
                        <div className="lg:hidden space-y-6 mb-8">
                            {/* Map Toggle (Optional placeholder) */}
                            {/* <div className="bg-sand-100 dark:bg-charcoal-800 h-40 rounded-3xl flex items-center justify-center text-charcoal-500">Map View (Desktop)</div> */}

                            <div className="grid grid-cols-2 gap-4">
                                {/* Weather */}
                                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h3 className="font-bold text-blue-100 uppercase text-[10px] tracking-wider mb-1">Weather</h3>
                                        <div className="text-xl font-bold">{currentTripPlan.weather?.temperature}</div>
                                    </div>
                                    <div className="absolute right-0 bottom-0 text-5xl opacity-20 -mr-2 -mb-2">🌤</div>
                                </div>
                                {/* Crowd */}
                                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h3 className="font-bold text-purple-100 uppercase text-[10px] tracking-wider mb-1">Crowd</h3>
                                        <div className="text-xl font-bold">{currentTripPlan.crowdLevel || 'Moderate'}</div>
                                    </div>
                                    <div className="absolute right-0 bottom-0 text-5xl opacity-20 -mr-2 -mb-2">👥</div>
                                </div>
                            </div>

                            {/* Emergency Info Accordion or Compact Card */}
                            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-4">
                                <h3 className="text-red-800 dark:text-red-300 font-bold text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Emergency
                                </h3>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div>
                                        <span className="text-red-600 dark:text-red-300 block opacity-70">Police</span>
                                        <span className="font-bold text-red-900 dark:text-white">{currentTripPlan.emergencyInfo?.police}</span>
                                    </div>
                                    <div>
                                        <span className="text-red-600 dark:text-red-300 block opacity-70">Ambulance</span>
                                        <span className="font-bold text-red-900 dark:text-white">{currentTripPlan.emergencyInfo?.ambulance}</span>
                                    </div>
                                    <div>
                                        <span className="text-red-600 dark:text-red-300 block opacity-70">Help</span>
                                        <span className="font-bold text-red-900 dark:text-white truncate">{currentTripPlan.emergencyInfo?.embassyHelp}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {currentTripPlan.itinerary?.map((day: ItineraryDay, idx: number) => {
                            const isOpen = activeDayIndex === idx;

                            return (
                                <div
                                    key={idx}
                                    className={`rounded-3xl transition-all duration-300 overflow-hidden border ${isOpen
                                        ? 'bg-white dark:bg-charcoal-900 shadow-xl border-forest-500/50 ring-1 ring-forest-500/50'
                                        : 'bg-white/60 dark:bg-charcoal-900/60 hover:bg-white dark:hover:bg-charcoal-900 border-sand-200 dark:border-charcoal-700'
                                        }`}
                                >
                                    {/* Card Header (Clickable) */}
                                    <div
                                        onClick={() => toggleDay(idx)}
                                        className="p-6 cursor-pointer flex justify-between items-center"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-colors ${isOpen ? 'bg-forest-600 text-white' : 'bg-sand-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-sand-300'}`}>
                                                <span className="text-xs font-bold uppercase tracking-wider">Day</span>
                                                <span className="text-2xl font-bold font-display">{day.day}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-bold text-forest-600 dark:text-forest-400 uppercase tracking-wide">{day.date}</span>
                                                    <span className="text-charcoal-300 dark:text-charcoal-600">•</span>
                                                    <span className="text-sm font-bold text-charcoal-500 dark:text-charcoal-400">{day.city}</span>
                                                </div>
                                                <h3 className="text-xl font-bold text-charcoal-900 dark:text-white font-display">{day.title}</h3>
                                            </div>
                                        </div>
                                        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                            <svg className="w-6 h-6 text-charcoal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    {isOpen && (
                                        <div className="border-t border-sand-100 dark:border-charcoal-800 animate-slide-up">

                                            {/* 1. Travel Section */}
                                            {day.travel && (
                                                <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 border-b border-sand-100 dark:border-charcoal-800 flex flex-wrap gap-6 items-center">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl">
                                                        ✈️
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-xs font-bold uppercase text-blue-800 dark:text-blue-300 mb-1">Travel Details</h4>
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex flex-wrap gap-4 text-sm text-charcoal-700 dark:text-sand-200">
                                                                <div className="flex items-center gap-1">
                                                                    <span className="font-bold">Mode:</span> {day.travel.mode}
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <span className="font-bold">From:</span> {day.travel.from} → {day.travel.to}
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <span className="font-bold">Arrival:</span> {day.travel.arrival}
                                                                </div>
                                                            </div>
                                                            <a
                                                                href={`https://www.skyscanner.com/transport/flights/${day.travel.from?.substring(0, 3)}/${day.travel.to?.substring(0, 3)}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center w-fit text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
                                                            >
                                                                Book Flight ↗
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* 2. Hotel Section */}
                                            {day.accommodation && (
                                                <div className="p-6 bg-amber-50/50 dark:bg-amber-900/10 border-b border-sand-100 dark:border-charcoal-800 flex flex-wrap gap-6 items-center">
                                                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl">
                                                        🏨
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-xs font-bold uppercase text-amber-800 dark:text-amber-300 mb-1">Accommodation</h4>
                                                        <div className="flex flex-col gap-2">
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-charcoal-700 dark:text-sand-200">
                                                                <div><span className="font-bold">{day.accommodation.name}</span></div>
                                                                <div className="text-xs opacity-80">{day.accommodation.location}</div>
                                                                <div className="flex gap-4 mt-1 text-xs">
                                                                    <span>Check-in: <b>{day.accommodation.checkIn}</b></span>
                                                                    <span>Nights: <b>{day.accommodation.nights}</b></span>
                                                                </div>
                                                            </div>
                                                            <a
                                                                href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(day.accommodation.name + " " + day.city)}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center w-fit text-xs font-bold text-amber-600 hover:text-amber-800 hover:underline"
                                                            >
                                                                Book Hotel ↗
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* 3. Activities Timeline (Drag & Drop) */}
                                            <div className="p-6 md:p-8">
                                                <h4 className="text-sm font-bold uppercase text-charcoal-400 mb-6 tracking-widest">Daily Timeline</h4>
                                                <div className="space-y-0 relative">
                                                    <div className="absolute left-[85px] top-2 bottom-6 w-px bg-sand-200 dark:bg-charcoal-700"></div>

                                                    <DragDropContext onDragEnd={(result) => {
                                                        if (!result.destination) return;

                                                        const newItinerary = [...currentTripPlan.itinerary];
                                                        const dayActivities = [...newItinerary[idx].activities];
                                                        const [reorderedItem] = dayActivities.splice(result.source.index, 1);
                                                        dayActivities.splice(result.destination.index, 0, reorderedItem);

                                                        newItinerary[idx] = { ...newItinerary[idx], activities: dayActivities };
                                                        updateTripPlan({ ...currentTripPlan, itinerary: newItinerary });
                                                    }}>
                                                        <Droppable droppableId={`day-${idx}`}>
                                                            {(provided) => (
                                                                <div
                                                                    {...provided.droppableProps}
                                                                    ref={provided.innerRef}
                                                                    className="space-y-4"
                                                                >
                                                                    {day.activities.map((act: any, actIdx: number) => (
                                                                        <Draggable key={`${idx}-${actIdx}`} draggableId={`${idx}-${actIdx}`} index={actIdx}>
                                                                            {(provided) => (
                                                                                <div
                                                                                    ref={provided.innerRef}
                                                                                    {...provided.draggableProps}
                                                                                    {...provided.dragHandleProps}
                                                                                    className="relative flex group bg-white dark:bg-charcoal-800 rounded-xl"
                                                                                >
                                                                                    <div className="w-[70px] flex-shrink-0 text-right pr-4 pt-4">
                                                                                        <span className="text-xs font-bold text-charcoal-500 dark:text-charcoal-400 font-mono">{act.time}</span>
                                                                                    </div>
                                                                                    <div className="relative z-10 w-8 flex flex-col items-center pt-4">
                                                                                        <div className={`w-3 h-3 rounded-full border-2 border-white dark:border-charcoal-900 ${act.type === 'Food' ? 'bg-orange-400' :
                                                                                            act.type === 'Rest' ? 'bg-blue-400' :
                                                                                                act.type === 'Travel' ? 'bg-charcoal-400' : 'bg-forest-500'
                                                                                            }`}></div>
                                                                                    </div>
                                                                                    <div className="flex-1 pb-4 pl-4 pr-4 py-2">
                                                                                        <div className="bg-sand-50 dark:bg-charcoal-800/50 p-4 rounded-xl border border-sand-100 dark:border-charcoal-800 hover:border-forest-200 dark:hover:border-forest-800 transition-colors cursor-move">
                                                                                            <div className="flex justify-between items-start mb-1">
                                                                                                <h5 className="font-bold text-charcoal-900 dark:text-white">{act.activity}</h5>
                                                                                                <span className="text-[10px] uppercase font-bold text-charcoal-400 bg-white dark:bg-charcoal-900 px-2 py-0.5 rounded border border-sand-100 dark:border-charcoal-700">{act.type}</span>
                                                                                            </div>
                                                                                            <p className="text-sm text-charcoal-600 dark:text-sand-300">{act.description}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </Draggable>
                                                                    ))}
                                                                    {provided.placeholder}
                                                                </div>
                                                            )}
                                                        </Droppable>
                                                    </DragDropContext>
                                                </div>
                                            </div>

                                            {/* 4. Meals Grid */}
                                            <div className="p-6 bg-sand-50 dark:bg-charcoal-800/30 border-t border-sand-100 dark:border-charcoal-800">
                                                <h4 className="text-sm font-bold uppercase text-charcoal-400 mb-4 tracking-widest flex items-center gap-2">
                                                    <span>🍽️</span> Meal Plan
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="p-3 bg-white dark:bg-charcoal-800 rounded-lg border border-sand-100 dark:border-charcoal-700">
                                                        <span className="block text-xs font-bold text-orange-600 dark:text-orange-400 uppercase mb-1">Breakfast</span>
                                                        <span className="text-sm text-charcoal-800 dark:text-sand-100">{day.meals.breakfast}</span>
                                                    </div>
                                                    <div className="p-3 bg-white dark:bg-charcoal-800 rounded-lg border border-sand-100 dark:border-charcoal-700">
                                                        <span className="block text-xs font-bold text-orange-600 dark:text-orange-400 uppercase mb-1">Lunch</span>
                                                        <span className="text-sm text-charcoal-800 dark:text-sand-100">{day.meals.lunch}</span>
                                                    </div>
                                                    <div className="p-3 bg-white dark:bg-charcoal-800 rounded-lg border border-sand-100 dark:border-charcoal-700">
                                                        <span className="block text-xs font-bold text-orange-600 dark:text-orange-400 uppercase mb-1">Dinner</span>
                                                        <span className="text-sm text-charcoal-800 dark:text-sand-100">{day.meals.dinner}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 5. Daily Cost (Optional) */}
                                            {day.costEstimate && (
                                                <div className="p-6 border-t border-sand-100 dark:border-charcoal-800 flex flex-col md:flex-row justify-between items-center gap-4">
                                                    <div className="flex gap-6 text-xs text-charcoal-500 dark:text-charcoal-400">
                                                        <div>Hotel: <span className="font-bold text-charcoal-700 dark:text-sand-200">{day.costEstimate.hotel}</span></div>
                                                        <div>Food: <span className="font-bold text-charcoal-700 dark:text-sand-200">{day.costEstimate.food}</span></div>
                                                        <div>Activities: <span className="font-bold text-charcoal-700 dark:text-sand-200">{day.costEstimate.activities}</span></div>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-forest-100 dark:bg-forest-900/40 px-4 py-2 rounded-lg">
                                                        <span className="text-xs font-bold uppercase text-forest-800 dark:text-forest-200">Est. Total:</span>
                                                        <span className="text-sm font-bold text-forest-900 dark:text-white">{day.costEstimate.total}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* --- Right Column: Sticky Context --- */}
                    <div className="hidden lg:block lg:col-span-5 relative">
                        <div className="sticky top-24 space-y-6">

                            {/* Dynamic Map Card */}
                            <div className="bg-white dark:bg-charcoal-900 rounded-[2rem] shadow-2xl overflow-hidden border border-white/20 dark:border-charcoal-700 h-[320px] relative group animate-fade-in-up">
                                <InteractiveMap itinerary={currentTripPlan.itinerary} activeDayIndex={activeDayIndex} />
                            </div>

                            {/* Spotify Widget */}
                            <div className="animate-fade-in-up delay-75">
                                <SpotifyWidget city={currentTripPlan.itinerary[0]?.city || 'Travel'} />
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4 animate-fade-in-up delay-100">
                                {/* Weather */}
                                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h3 className="font-bold text-blue-100 uppercase text-[10px] tracking-wider mb-1">Weather</h3>
                                        <div className="text-2xl font-bold">{currentTripPlan.weather?.temperature}</div>
                                        <p className="mt-1 text-blue-50 text-xs line-clamp-2">{currentTripPlan.weather?.advice}</p>
                                    </div>
                                    <div className="absolute right-0 bottom-0 text-7xl opacity-20 -mr-2 -mb-2">🌤</div>
                                </div>

                                {/* Crowd */}
                                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h3 className="font-bold text-purple-100 uppercase text-[10px] tracking-wider mb-1">Crowd Level</h3>
                                        <div className="text-2xl font-bold">{currentTripPlan.crowdLevel || 'Moderate'}</div>
                                        <p className="mt-1 text-purple-50 text-xs">Plan accordingly</p>
                                    </div>
                                    <div className="absolute right-0 bottom-0 text-7xl opacity-20 -mr-2 -mb-2">👥</div>
                                </div>
                            </div>

                            {/* Emergency Info Card */}
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-3xl p-6 animate-fade-in-up delay-200">
                                <h3 className="text-red-800 dark:text-red-300 font-bold text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Emergency Info
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between border-b border-red-200 dark:border-red-800 pb-2">
                                        <span className="text-red-700 dark:text-red-200">Police</span>
                                        <span className="font-bold text-red-900 dark:text-white">{currentTripPlan.emergencyInfo?.police}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-red-200 dark:border-red-800 pb-2">
                                        <span className="text-red-700 dark:text-red-200">Ambulance</span>
                                        <span className="font-bold text-red-900 dark:text-white">{currentTripPlan.emergencyInfo?.ambulance}</span>
                                    </div>
                                    <div className="pt-1">
                                        <span className="text-red-700 dark:text-red-200 text-xs block mb-1">Embassy / Help</span>
                                        <span className="font-bold text-red-900 dark:text-white text-xs block">{currentTripPlan.emergencyInfo?.embassyHelp}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Travel Essentials Grid --- */}
                <div className="mt-20">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sand-300 dark:via-charcoal-600 to-transparent"></div>
                        <h2 className="text-3xl font-bold text-charcoal-900 dark:text-white font-display">Travel Essentials</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sand-300 dark:via-charcoal-600 to-transparent"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/* Food & Dining */}
                        <div className="bg-white dark:bg-charcoal-900 rounded-[2.5rem] p-8 border border-sand-100 dark:border-charcoal-800 hover:shadow-xl transition-all duration-300 group">
                            <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">🍜</div>
                            <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-2">Local Cuisine</h3>
                            <p className="text-sm text-charcoal-500 dark:text-sand-400 mb-6">Daily Budget: <span className="text-orange-600 dark:text-orange-400 font-bold">{currentTripPlan.food?.dailyBudget}</span></p>

                            <div className="space-y-3">
                                <p className="text-xs font-bold uppercase text-charcoal-400 tracking-wider">Must Try:</p>
                                <div className="flex flex-wrap gap-2">
                                    {currentTripPlan.food?.mustTryDishes.slice(0, 5).map((dish: string, i: number) => (
                                        <span key={i} className="px-3 py-1 bg-sand-50 dark:bg-charcoal-800 rounded-lg text-xs font-medium text-charcoal-700 dark:text-sand-200 border border-sand-100 dark:border-charcoal-700">
                                            {dish}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Culture & Etiquette */}
                        <div className="bg-white dark:bg-charcoal-900 rounded-[2.5rem] p-8 border border-sand-100 dark:border-charcoal-800 hover:shadow-xl transition-all duration-300 group">
                            <div className="w-14 h-14 bg-forest-100 dark:bg-forest-900/30 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">🙏</div>
                            <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-6">Culture & Etiquette</h3>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold uppercase text-forest-600 dark:text-forest-400 tracking-wider mb-2 flex items-center gap-1">
                                        <span className="text-lg">✓</span> Do's
                                    </p>
                                    <ul className="text-sm text-charcoal-600 dark:text-sand-300 space-y-1">
                                        {currentTripPlan.localEtiquette?.dos.slice(0, 3).map((tip: string, i: number) => (
                                            <li key={i}>• {tip}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase text-red-600 dark:text-red-400 tracking-wider mb-2 flex items-center gap-1">
                                        <span className="text-lg">✕</span> Don'ts
                                    </p>
                                    <ul className="text-sm text-charcoal-600 dark:text-sand-300 space-y-1">
                                        {currentTripPlan.localEtiquette?.donts.slice(0, 3).map((tip: string, i: number) => (
                                            <li key={i}>• {tip}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Packing Checklist */}
                        <div className="bg-white dark:bg-charcoal-900 rounded-[2.5rem] p-8 border border-sand-100 dark:border-charcoal-800 hover:shadow-xl transition-all duration-300 group">
                            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">🎒</div>
                            <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-6">Smart Packing</h3>

                            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                {currentTripPlan.packingTips?.map((tip: string, i: number) => (
                                    <div
                                        key={i}
                                        className={`flex items-start gap-3 p-2 rounded-lg transition-colors cursor-pointer ${checkedItems[tip] ? 'opacity-50 line-through' : 'hover:bg-sand-50 dark:hover:bg-charcoal-800'}`}
                                        onClick={() => togglePackingItem(tip)}
                                    >
                                        <div className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center ${checkedItems[tip] ? 'bg-blue-500 border-blue-500 text-white' : 'border-charcoal-300 dark:border-charcoal-600'}`}>
                                            {checkedItems[tip] && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                        <span className="text-sm text-charcoal-700 dark:text-sand-200">{tip}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Budget & Savings */}
                        <div className="bg-forest-900 rounded-[2.5rem] p-8 text-white shadow-xl hover:shadow-2xl hover:shadow-forest-900/30 transition-all duration-300 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-forest-800 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">💸</div>
                                <h3 className="text-xl font-bold mb-6">Budget Tips</h3>
                                <ul className="space-y-4">
                                    {currentTripPlan.costSavingTips?.slice(0, 4).map((tip: string, i: number) => (
                                        <li key={i} className="flex gap-3 text-sm text-sand-100">
                                            <span className="text-forest-400 font-bold">★</span>
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="mt-12 animate-fade-in-up">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sand-300 dark:via-charcoal-600 to-transparent"></div>
                        <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white font-display">Community & Discussion</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sand-300 dark:via-charcoal-600 to-transparent"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            {currentTripPlan.id ? (
                                <TripComments tripId={currentTripPlan.id} />
                            ) : (
                                <div className="bg-sand-50 dark:bg-charcoal-800 rounded-3xl p-8 text-center border-2 border-dashed border-sand-200 dark:border-charcoal-700">
                                    <p className="text-lg font-bold text-charcoal-600 dark:text-sand-300 mb-2">Start the Discussion</p>
                                    <p className="text-charcoal-500 mb-4">Save your trip to enable comments and collaboration.</p>
                                    <Button variant="primary" onClick={handleSaveTrip} isLoading={isSaving}>Save Trip to Discuss</Button>
                                </div>
                            )}
                        </div>

                        {/* Owner Actions Sidebar */}
                        {isOwner && (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 shadow-sm border border-sand-200 dark:border-charcoal-700">
                                    <h3 className="font-bold text-charcoal-800 dark:text-white mb-4">Trip Settings</h3>

                                    <div className="flex items-center justify-between p-4 bg-sand-50 dark:bg-charcoal-900 rounded-xl">
                                        <div>
                                            <span className="block font-bold text-sm text-charcoal-900 dark:text-white">Public Access</span>
                                            <span className="text-xs text-charcoal-500 dark:text-sand-400">Allow anyone to view this trip</span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={isPublic}
                                                onChange={async (e) => {
                                                    const newState = e.target.checked;
                                                    setIsPublic(newState); // Optimistic update
                                                    try {
                                                        await import('../services/tripService').then(m => m.tripService.togglePublicStatus(currentTripPlan.id!, newState));
                                                        // Update the global plan too so it persists
                                                        updateTripPlan({ ...currentTripPlan, isPublic: newState });
                                                        alert(newState ? "Trip is now Public! 🌍" : "Trip is now Private. 🔒");
                                                    } catch (err) {
                                                        setIsPublic(!newState); // Revert
                                                        alert("Failed to update status.");
                                                    }
                                                }}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-forest-300 dark:peer-focus:ring-forest-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-forest-600"></div>
                                        </label>
                                    </div>

                                    <div className="mt-4 text-xs text-charcoal-500 dark:text-charcoal-400">
                                        <p>Share this trip with friends:</p>
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={async () => {
                                                    // Ensure we have the share ID
                                                    if (!currentTripPlan.shareId) {
                                                        alert("Please make the trip public to generate a share link first!");
                                                        return;
                                                    }
                                                    const link = `${window.location.origin}/trip/share/${currentTripPlan.shareId}`;
                                                    await navigator.clipboard.writeText(link);
                                                    alert("Link copied! 📋");
                                                    setShowShareModal(false);
                                                }}
                                                className="flex-1 py-2 bg-sand-100 dark:bg-charcoal-700 rounded-lg font-bold hover:bg-sand-200 dark:hover:bg-charcoal-600 transition-colors"
                                            >
                                                Copy Link
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- SHARE MODAL --- */}
                {showShareModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/80 backdrop-blur-sm" onClick={() => setShowShareModal(false)}>
                        <div
                            className="bg-white dark:bg-charcoal-800 rounded-3xl p-8 max-w-md w-full animate-scale-in"
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-6">Share Trip Plan</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <button onClick={handleShareWhatsApp} className="flex items-center justify-center gap-3 p-4 rounded-xl bg-[#25D366] text-white font-bold hover:brightness-105 transition-all">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                                    Share on WhatsApp
                                </button>
                                <button onClick={handleCopyLink} className="flex items-center justify-center gap-3 p-4 rounded-xl bg-charcoal-100 dark:bg-charcoal-700 text-charcoal-900 dark:text-white font-bold hover:bg-charcoal-200 dark:hover:bg-charcoal-600 transition-all">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    Copy Link
                                </button>
                            </div>
                            <button onClick={() => setShowShareModal(false)} className="mt-6 w-full text-center text-sm text-charcoal-500 hover:text-charcoal-900 dark:hover:text-white">Cancel</button>
                        </div>
                    </div>
                )}
            </div>
            {/* Floating Chat Button */}
            <button
                onClick={() => setShowChat(!showChat)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-forest-600 text-white rounded-full shadow-2xl flex items-center justify-center text-3xl hover:bg-forest-700 hover:scale-110 transition-all z-40"
            >
                {showChat ? '✕' : '✨'}
            </button>

            {/* AI Assistant Chat */}
            {showChat && <TripChat onClose={() => setShowChat(false)} />}
        </div>
    );
};