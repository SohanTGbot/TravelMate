
import { TripPlan } from '../types';

const OFFLINE_TRIPS_KEY = 'travelmate_offline_trips';

export const offlineService = {
    /**
     * Save a trip for offline access
     */
    saveTripOffline(trip: TripPlan) {
        try {
            if (!trip.id) {
                // Generate a temporary ID if not saved to DB yet
                trip.id = `temp_${Date.now()}`;
            }

            const stored = localStorage.getItem(OFFLINE_TRIPS_KEY);
            const trips: TripPlan[] = stored ? JSON.parse(stored) : [];

            // Update existing or add new
            const existingIndex = trips.findIndex(t => t.id === trip.id || t.tripName === trip.tripName);
            if (existingIndex >= 0) {
                trips[existingIndex] = trip;
            } else {
                trips.push(trip);
            }

            localStorage.setItem(OFFLINE_TRIPS_KEY, JSON.stringify(trips));
            return true;
        } catch (error) {
            console.error('Failed to save offline:', error);
            return false; // Likely quota exceeded
        }
    },

    /**
     * Get all offline trips
     */
    getOfflineTrips(): TripPlan[] {
        try {
            const stored = localStorage.getItem(OFFLINE_TRIPS_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            return [];
        }
    },

    /**
     * Check if a trip is saved offline
     */
    isTripOffline(tripId: string): boolean {
        const trips = this.getOfflineTrips();
        return trips.some(t => t.id === tripId);
    },

    /**
     * Remove a trip from offline storage
     */
    removeOfflineTrip(tripId: string) {
        const trips = this.getOfflineTrips().filter(t => t.id !== tripId);
        localStorage.setItem(OFFLINE_TRIPS_KEY, JSON.stringify(trips));
    }
};
