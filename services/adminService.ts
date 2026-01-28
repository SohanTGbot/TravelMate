
import { supabase } from './supabaseClient';
import { Blog, Destination, Service, FAQ, Review, Booking, AdminLog } from '../types';

export const adminService = {
    supabase,
    // --- UPLOAD ---
    async uploadImage(file: File, bucket: 'uploads' | 'avatars' = 'uploads'): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        return data.publicUrl;
    },

    async uploadDocument(file: File): Promise<{ path: string, signedUrl: string }> {
        // Use user ID in path for better organization if possible, but for now random filename
        // Actually best practice is user_id/filename, but we might not have user_id here easily without auth check
        // We'll rely on simpler path for now: uuid-filename or just random
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${file.name.replace(/\s+/g, '_')}`;
        const filePath = `${fileName}`;

        const { data, error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        // Create a signed URL for immediate access (valid for 1 hour)
        const { data: signedData, error: signedError } = await supabase.storage
            .from('documents')
            .createSignedUrl(filePath, 3600);

        if (signedError) throw signedError;

        return { path: data.path, signedUrl: signedData.signedUrl };
    },

    async getDocumentUrl(path: string): Promise<string> {
        const { data, error } = await supabase.storage
            .from('documents')
            .createSignedUrl(path, 3600); // Valid for 1 hour

        if (error) throw error;
        return data.signedUrl;
    },

    // --- BLOGS ---
    async getBlogs(): Promise<Blog[]> {
        const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async createBlog(blog: Partial<Blog>): Promise<Blog> {
        const { data, error } = await supabase.from('blogs').insert(blog).select().single();
        if (error) throw error;
        return data;
    },

    async updateBlog(id: string, updates: Partial<Blog>): Promise<Blog> {
        const { data, error } = await supabase.from('blogs').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },

    async deleteBlog(id: string): Promise<void> {
        const { error } = await supabase.from('blogs').delete().eq('id', id);
        if (error) throw error;
    },

    // --- DESTINATIONS ---
    async getDestinations(): Promise<Destination[]> {
        const { data, error } = await supabase.from('destinations').select('*').order('name', { ascending: true });
        if (error) throw error;
        return data;
    },

    async createDestination(dest: Partial<Destination>): Promise<Destination> {
        const { data, error } = await supabase.from('destinations').insert(dest).select().single();
        if (error) throw error;
        return data;
    },

    async updateDestination(id: string, updates: Partial<Destination>): Promise<Destination> {
        const { data, error } = await supabase.from('destinations').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },

    async deleteDestination(id: string): Promise<void> {
        const { error } = await supabase.from('destinations').delete().eq('id', id);
        if (error) throw error;
    },

    // --- SERVICES ---
    async getServices(): Promise<Service[]> {
        const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: true });
        if (error) throw error;
        return data;
    },

    async createService(service: Partial<Service>): Promise<Service> {
        const { data, error } = await supabase.from('services').insert(service).select().single();
        if (error) throw error;
        return data;
    },

    async updateService(id: string, updates: Partial<Service>): Promise<Service> {
        const { data, error } = await supabase.from('services').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },

    async deleteService(id: string): Promise<void> {
        const { error } = await supabase.from('services').delete().eq('id', id);
        if (error) throw error;
    },

    // --- FAQS ---
    async getFAQs(): Promise<FAQ[]> {
        const { data, error } = await supabase.from('faqs').select('*').order('created_at', { ascending: true });
        if (error) throw error;
        return data;
    },

    async createFAQ(faq: Partial<FAQ>): Promise<FAQ> {
        const { data, error } = await supabase.from('faqs').insert(faq).select().single();
        if (error) throw error;
        return data;
    },

    async updateFAQ(id: string, updates: Partial<FAQ>): Promise<FAQ> {
        const { data, error } = await supabase.from('faqs').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },

    async deleteFAQ(id: string): Promise<void> {
        const { error } = await supabase.from('faqs').delete().eq('id', id);
        if (error) throw error;
    },

    // --- REVIEWS ---
    async getReviews(): Promise<Review[]> {
        const { data, error } = await supabase
            .from('reviews')
            .select('*, profiles:user_id(full_name, email)')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async approveReview(id: string, approved: boolean): Promise<Review> {
        const { data, error } = await supabase.from('reviews').update({ approved }).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },


    async deleteReview(id: string): Promise<void> {
        const { error } = await supabase.from('reviews').delete().eq('id', id);
        if (error) throw error;
    },

    // --- USER MANAGEMENT ---
    async getAllUsers(): Promise<any[]> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async updateUserRole(userId: string, role: string): Promise<void> {
        const { error } = await supabase
            .from('profiles')
            .update({ role })
            .eq('id', userId);
        if (error) throw error;
    },

    async deleteUser(userId: string): Promise<void> {
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', userId);
        if (error) throw error;
    },

    // --- TRIP REQUEST MANAGEMENT ---
    async getTripRequests(): Promise<any[]> {
        const { data, error } = await supabase
            .from('trip_requests')
            .select(`
                *,
                profiles:user_id (
                    email,
                    full_name
                )
            `)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async updateTripRequestStatus(id: string, status: string): Promise<void> {
        const { error } = await supabase
            .from('trip_requests')
            .update({ status })
            .eq('id', id);
        if (error) throw error;
    },

    async deleteTripRequest(id: string): Promise<void> {
        const { error } = await supabase
            .from('trip_requests')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    // --- ANALYTICS ---
    async getStats(): Promise<any> {
        const [users, tripRequests, trips] = await Promise.all([
            supabase.from('profiles').select('id', { count: 'exact', head: true }),
            supabase.from('trip_requests').select('*'),
            supabase.from('trips').select('id', { count: 'exact', head: true })
        ]);

        const revenue = (tripRequests.data || []).reduce((sum, req) => {
            const budget = typeof req.budget === 'number' ? req.budget :
                parseInt(String(req.budget).replace(/[^0-9]/g, '')) || 0;
            return sum + budget;
        }, 0);

        return {
            totalUsers: users.count || 0,
            totalTripRequests: tripRequests.data?.length || 0,
            totalTrips: trips.count || 0,
            totalRevenue: revenue
        };
    },

    // --- CONTACT MESSAGES ---
    async getContactMessages(): Promise<any[]> {
        const { data, error } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async markContactAsRead(id: string): Promise<void> {
        const { error } = await supabase
            .from('contact_messages')
            .update({ read: true })
            .eq('id', id);
        if (error) throw error;
    },

    async deleteContactMessage(id: string): Promise<void> {
        const { error } = await supabase
            .from('contact_messages')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    // --- NEWSLETTER SUBSCRIBERS ---
    async getNewsletterSubscribers(): Promise<any[]> {
        const { data, error } = await supabase
            .from('newsletter_subscribers')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async deleteNewsletterSubscriber(id: string): Promise<void> {
        const { error } = await supabase
            .from('newsletter_subscribers')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    // --- BOOKINGS MANAGEMENT ---
    async getBookings(): Promise<Booking[]> {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                *,
                profiles:user_id (
                    email,
                    full_name
                ),
                trip_requests:trip_request_id (
                    destination,
                    duration
                )
            `)
            .order('booking_date', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async createBooking(booking: Partial<Booking>): Promise<Booking> {
        const { data, error } = await supabase
            .from('bookings')
            .insert(booking)
            .select()
            .single();
        if (error) throw error;

        // Log the action
        const user = await supabase.auth.getUser();
        if (user.data.user) {
            await this.logAdminAction('create', 'bookings', data.id, null, data);
        }

        return data;
    },

    async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
        // Get old data first
        const { data: oldData } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', id)
            .single();

        const { data, error } = await supabase
            .from('bookings')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;

        // Log the action
        const user = await supabase.auth.getUser();
        if (user.data.user) {
            await this.logAdminAction('update', 'bookings', id, oldData, data);
        }

        return data;
    },

    async deleteBooking(id: string): Promise<void> {
        // Get data before deletion for logging
        const { data: oldData } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', id)
            .single();

        const { error } = await supabase
            .from('bookings')
            .delete()
            .eq('id', id);
        if (error) throw error;

        // Log the action
        const user = await supabase.auth.getUser();
        if (user.data.user) {
            await this.logAdminAction('delete', 'bookings', id, oldData, null);
        }
    },

    // --- ADMIN LOGGING ---
    async getAdminLogs(limit: number = 50): Promise<AdminLog[]> {
        const { data, error } = await supabase
            .from('admin_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);
        if (error) throw error;
        return data || [];
    },

    async logAdminAction(
        actionType: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'status_change',
        tableName: string,
        recordId?: string,
        oldData?: any,
        newData?: any,
        description?: string
    ): Promise<void> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from('profiles')
                .select('email, role')
                .eq('id', user.id)
                .single();

            // Only log if user is admin
            if (!profile || !['admin', 'super_admin'].includes(profile.role)) return;

            const logEntry = {
                admin_id: user.id,
                admin_email: profile.email || user.email || 'unknown',
                action_type: actionType,
                table_name: tableName,
                record_id: recordId,
                old_data: oldData,
                new_data: newData,
                description: description || `${actionType} on ${tableName}`
            };

            await supabase.from('admin_logs').insert(logEntry);
        } catch (error) {
            // Silent fail - logging shouldn't break the main operation
            console.error('Failed to log admin action:', error);
        }
    },
};

