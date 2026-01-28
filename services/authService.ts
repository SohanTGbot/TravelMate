import { User, TripPlan, AuthResponse, ContactMessage, TripRequestRecord } from '../types';
import { supabase } from './supabaseClient';

export const authService = {
  // --- AUTH ---
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error("Registration failed");


    // Profile created via trigger
    const user: User = {
      id: authData.user.id,
      email: email,
      name: name,
      role: 'user', // Default
      savedTrips: [],
      createdAt: new Date().toISOString()
    };

    return {
      user,
      token: authData.session?.access_token || ''
    };
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error("Login failed");

    // Fetch profile to get role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name, avatar_url')
      .eq('id', data.user.id)
      .single();

    const user: User = {
      id: data.user.id,
      email: email,
      name: profile?.full_name || data.user.user_metadata.full_name || 'User',
      avatar_url: profile?.avatar_url,
      role: profile?.role || 'user',
      savedTrips: [],
      createdAt: data.user.created_at
    };

    return { user, token: data.session?.access_token || '' };
  },

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },

  async getMe(): Promise<User | null> {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session || !session.user) return null;

    const uid = session.user.id;
    const email = session.user.email;

    let profile: any = null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .maybeSingle();

      if (!error) profile = data;
    } catch (e) {
      console.warn("Profile fetch failed.");
    }

    const name = profile?.full_name || session.user.user_metadata.full_name || 'User';
    // Trust DB role only
    let role: 'user' | 'admin' = profile?.role || 'user';

    let savedTrips: TripPlan[] = [];
    try {
      const { data: tripsData, error } = await supabase
        .from('trips')
        .select('id, trip_data, created_at')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });

      if (!error && tripsData) {
        savedTrips = tripsData.map((row: any) => ({
          ...row.trip_data,
          id: row.id,
          createdAt: row.created_at
        }));
      }
    } catch (e) {
      console.warn("Saved trips fetch failed.");
    }

    return {
      id: uid,
      email: email || '',
      name,
      avatar_url: profile?.avatar_url,
      role,
      savedTrips,
      createdAt: session.user.created_at
    };
  },

  // --- USER DATA ---
  async saveTrip(userId: string, plan: TripPlan): Promise<User> {
    const { error } = await supabase.from('trips').insert({
      user_id: userId,
      title: plan.tripName || 'Untitled Trip',
      destination: plan.itinerary?.[0]?.city || 'Unknown',
      trip_data: plan
    });

    if (error) throw new Error(`Failed to save trip: ${error.message}`);

    const updatedUser = await this.getMe();
    if (!updatedUser) throw new Error("User session not found after saving");

    return updatedUser;
  },

  async deleteSavedTrip(userId: string, tripId: string): Promise<User> {
    const { error } = await supabase.from('trips').delete().eq('id', tripId).eq('user_id', userId);
    if (error) throw new Error(`Failed to delete trip: ${error.message}`);

    const updatedUser = await this.getMe();
    if (!updatedUser) throw new Error("User session not found after deleting");

    return updatedUser;
  },

  // --- PUBLIC / LOGS ---
  async sendMessage(msg: ContactMessage): Promise<void> {
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: msg.name,
        email: msg.email,
        message: msg.message
      });

      if (error) {
        console.warn("Contact message logging skipped:", error.message);
      }
    } catch (e) {
      console.warn("Messages table likely missing or schema mismatch", e);
    }
  },

  async logTripRequest(req: any): Promise<void> {
    // Log as background task, don't throw to prevent UI crashes if DB config is wrong
    try {
      const payload = {
        user_id: req.userId || null,
        user_name: req.userName || 'Guest',
        destination: req.destination,
        duration: req.duration,
        budget: req.budget,
        group_type: req.groupType,
      };

      const { error } = await supabase.from('trip_requests').insert(payload);

      if (error) {
        // Handle common background errors gracefully
        if (error.code === '42501') {
          console.warn("Analytics: Public insert permission missing. Run 'supabase_fix_rls.sql'.");
        } else if (error.message?.includes('Failed to fetch')) {
          console.warn("Analytics: Logging skipped (Network/Blocker).");
        } else {
          console.warn("Analytics: Error logging request:", error.message);
        }
      }
    } catch (e) {
      // Completely silence background errors
    }
  },

  // --- ADMIN FETCHERS ---

  async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return [];

      return data.map((p: any) => ({
        id: p.id,
        email: p.email,
        name: p.name || 'Unknown',
        avatar_url: p.avatar_url,
        role: p.role as 'user' | 'admin',
        savedTrips: [],
        createdAt: p.created_at
      }));
    } catch (e) {
      return [];
    }
  },

  async deleteUser(userId: string): Promise<void> {
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    if (error) throw new Error(error.message);
  },

  async getMessages(): Promise<ContactMessage[]> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return [];

      return data.map((m: any) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        message: m.message,
        read: m.read || false,
        date: m.created_at
      }));
    } catch (e) {
      return [];
    }
  },

  async deleteMessage(id: string): Promise<void> {
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  async getTripRequests(): Promise<TripRequestRecord[]> {
    try {
      const { data, error } = await supabase
        .from('trip_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return [];

      return data.map((r: any) => ({
        id: r.id,
        destination: r.destination,
        duration: r.duration,
        budget: r.budget,
        groupType: r.group_type,
        userName: r.user_name,
        userId: r.user_id,
        timestamp: r.created_at,
        travelMonth: '', currency: '', language: '', dietary: '', activityLevel: 'Moderate', interests: []
      }));
    } catch (e) {
      return [];
    }
  },

  async deleteTripRequest(id: string): Promise<void> {
    const { error } = await supabase.from('trip_requests').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
};