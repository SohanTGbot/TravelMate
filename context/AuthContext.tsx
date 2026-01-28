
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            fetchProfile(session?.user || null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            fetchProfile(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, []);

    async function fetchProfile(authUser: any) {
        if (!authUser) {
            setUser(null);
            setIsAdmin(false);
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
            }

            const role = data?.role || 'user';
            const userProfile: User = {
                id: authUser.id,
                email: authUser.email,
                name: data?.full_name || authUser.user_metadata?.full_name || 'User',
                role: role,
                savedTrips: [], // Populate later if needed
                createdAt: data?.created_at || new Date().toISOString()
            };

            setUser(userProfile);
            setIsAdmin(role === 'admin');
        } catch (error) {
            console.error('Auth formatting error', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function signInWithGoogle() {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
    }

    async function signOut() {
        await supabase.auth.signOut();
        setUser(null);
        setIsAdmin(false);
    }

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, isAdmin }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
