import { supabase } from './supabaseClient';
import { TripPlan } from '../types';

export const tripService = {
    /**
   * Save a trip to the database for a specific user
   */
    async saveTrip(userId: string, tripPlan: TripPlan) {
        try {
            const { data, error } = await supabase
                .from('trips')
                .insert({
                    user_id: userId,
                    trip_name: tripPlan.tripName || 'Untitled Trip',
                    trip_data: tripPlan // Store entire plan as JSON
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error: any) {
            console.error('Error saving trip:', error);
            throw new Error(error.message || 'Failed to save trip');
        }
    },

    /**
     * Get all trips for a specific user
     */
    async getUserTrips(userId: string) {
        try {
            const { data, error } = await supabase
                .from('trips')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error: any) {
            console.error('Error fetching trips:', error);
            throw new Error(error.message || 'Failed to fetch trips');
        }
    },

    /**
     * Get a specific trip by ID
     */
    async getTripById(tripId: string, userId: string) {
        try {
            const { data, error } = await supabase
                .from('trips')
                .select('*')
                .eq('id', tripId)
                .eq('user_id', userId)
                .single();

            if (error) throw error;
            return data;
        } catch (error: any) {
            console.error('Error fetching trip:', error);
            throw new Error(error.message || 'Failed to fetch trip');
        }
    },

    /**
   * Update an existing trip
   */
    async updateTrip(tripId: string, userId: string, tripPlan: TripPlan) {
        try {
            const { data, error } = await supabase
                .from('trips')
                .update({
                    trip_name: tripPlan.tripName || 'Untitled Trip',
                    trip_data: tripPlan
                })
                .eq('id', tripId)
                .eq('user_id', userId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error: any) {
            console.error('Error updating trip:', error);
            throw new Error(error.message || 'Failed to update trip');
        }
    },

    /**
     * Delete a trip
     */
    async deleteTrip(tripId: string, userId: string) {
        try {
            const { error } = await supabase
                .from('trips')
                .delete()
                .eq('id', tripId)
                .eq('user_id', userId);

            if (error) throw error;
            return true;
        } catch (error: any) {
            console.error('Error deleting trip:', error);
            throw new Error(error.message || 'Failed to delete trip');
        }
    },

    /**
     * Convert database trip format to TripPlan format for UI
     */
    dbTripToTripPlan(dbTrip: any): TripPlan {
        // If trip_data exists, use it directly
        if (dbTrip.trip_data) {
            const plan = dbTrip.trip_data as TripPlan;
            // Inject ID, share_id, etc if missing in JSON but present in Columns
            if (dbTrip.id) plan.id = dbTrip.id;
            if (dbTrip.is_public !== undefined) plan.isPublic = dbTrip.is_public;
            if (dbTrip.share_id) plan.shareId = dbTrip.share_id;
            return plan;
        }

        // Fallback for old format (shouldn't happen with new schema)
        return {
            tripName: dbTrip.trip_name,
            summary: dbTrip.summary,
            itinerary: dbTrip.itinerary || [],
            totalBudgetEstimation: dbTrip.total_budget || '',
            weather: dbTrip.weather || {},
            emergencyInfo: dbTrip.emergency_info || {},
            packingTips: dbTrip.packing_tips || [],
            food: dbTrip.food || {},
            localEtiquette: dbTrip.local_etiquette || {},
            costSavingTips: dbTrip.cost_saving_tips || [],
            qualityScore: dbTrip.quality_score || null,
            crowdLevel: dbTrip.crowd_level || null,
            suitabilityTags: dbTrip.suitability_tags || [],
            currency: dbTrip.currency || 'USD',
            hotels: [],
            transportation: ''
        };
    },

    // --- COMMUNITY & PUBLIC FEATURES ---

    /**
     * Get all public trips for the Community Feed
     */
    async getPublicTrips() {
        try {
            const { data, error } = await supabase
                .from('trips')
                .select('*, profiles(full_name, avatar_url)')
                .eq('is_public', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error: any) {
            console.error('Error fetching public trips:', error);
            throw new Error(error.message);
        }
    },

    /**
     * Toggle trip public status
     */
    async togglePublicStatus(tripId: string, isPublic: boolean) {
        try {
            const { data, error } = await supabase
                .from('trips')
                .update({ is_public: isPublic })
                .eq('id', tripId)
                .select('is_public, share_id')
                .single();

            if (error) throw error;
            return data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    },

    /**
     * Get trip by Share ID (for public viewing)
     */
    async getTripByShareId(shareId: string) {
        try {
            const { data, error } = await supabase
                .from('trips')
                .select('*')
                .eq('share_id', shareId)
                .single();

            if (error) throw error;
            return data;
        } catch (error: any) {
            throw new Error('Trip not found or private');
        }
    },

    /**
     * Post a comment on a trip
     */
    async addComment(tripId: string, userId: string, content: string) {
        try {
            const { data, error } = await supabase
                .from('trip_comments')
                .insert({ trip_id: tripId, user_id: userId, content })
                .select('*, profiles(full_name, avatar_url)')
                .single();

            if (error) throw error;
            return data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    },

    /**
     * Get comments for a trip
     */
    async getComments(tripId: string) {
        try {
            const { data, error } = await supabase
                .from('trip_comments')
                .select('*, profiles(full_name, avatar_url)')
                .eq('trip_id', tripId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
};
