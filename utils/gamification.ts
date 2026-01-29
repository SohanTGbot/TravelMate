
import { User, TripPlan } from "../types";

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    earned: boolean;
    color: string;
}

export interface PassportStamp {
    id: string;
    city: string;
    country: string; // Inferred or same as city if unknown
    date: string;
}

export const GAMIFICATION = {
    getBadges: (user: User): Badge[] => {
        const trips = user.savedTrips || [];
        const badges: Badge[] = [
            {
                id: 'novice_planner',
                name: 'Novice Planner',
                description: 'Created your first trip!',
                icon: '🗺️',
                earned: trips.length >= 1,
                color: 'from-blue-400 to-blue-600'
            },
            {
                id: 'seasoned_traveler',
                name: 'Seasoned Traveler',
                description: 'Planned 5+ trips.',
                icon: '✈️',
                earned: trips.length >= 5,
                color: 'from-purple-400 to-purple-600'
            },
            {
                id: 'luxury_lover',
                name: 'Luxury Lover',
                description: 'Planned a Luxury or Ultra Luxury trip.',
                icon: '💎',
                earned: trips.some(t => t.totalBudgetEstimation.includes('Luxury') || (t.tags || []).includes('Luxury')), // Heuristic
                color: 'from-yellow-400 to-yellow-600'
            },
            {
                id: 'backpacker',
                name: 'Backpacker',
                description: 'Planned a budget-friendly adventure.',
                icon: '🎒',
                earned: trips.some(t => t.totalBudgetEstimation.includes('Backpacker') || t.totalBudgetEstimation.includes('Budget')),
                color: 'from-green-400 to-green-600'
            },
            {
                id: 'foodie',
                name: 'Foodie',
                description: 'Planned a trip with a focus on Food.',
                icon: '🍜',
                earned: trips.some(t => (t.interests || []).includes('Food') || t.summary.toLowerCase().includes('food')),
                color: 'from-red-400 to-red-600'
            }
        ];
        return badges;
    },

    getPassportStamps: (user: User): PassportStamp[] => {
        const trips = user.savedTrips || [];
        const stamps: PassportStamp[] = [];
        const seenDestinations = new Set<string>();

        trips.forEach(trip => {
            // Try to extract destination. usually trip.itinerary[0].city or tripName
            // Heuristic: tripName is often "Trip to [City]"
            let destination = trip.tripName.replace('Trip to ', '').replace('Trip for ', '');

            // If we have itinerary, use the first city
            if (trip.itinerary && trip.itinerary.length > 0) {
                destination = trip.itinerary[0].city;
            }

            if (destination && !seenDestinations.has(destination)) {
                seenDestinations.add(destination);
                stamps.push({
                    id: trip.id || Math.random().toString(),
                    city: destination.split(',')[0], // "Paris" from "Paris, France"
                    country: destination, // Full string as country for now
                    date: new Date(trip.createdAt || Date.now()).toLocaleDateString()
                });
            }
        });

        return stamps;
    }
};
