
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { Destination, FAQ, Review, User, TripPlan, TripRequest, Blog, Service, ContactMessage, TripRequestRecord } from '../types';
import { MOCK_DESTINATIONS, MOCK_FAQS, MOCK_REVIEWS, MOCK_BLOGS, MOCK_SERVICES } from '../constants';
import { generateTripPlan } from '../services/geminiService';
import { authService } from '../services/authService';
import { supabase } from '../services/supabaseClient';

// Storage Keys (Only for strictly local UI preference or static mocks now)
const KEYS = {
  DESTINATIONS: 'travelmate_destinations',
  FAQS: 'travelmate_faqs',
  REVIEWS: 'travelmate_reviews',
  BLOGS: 'travelmate_blogs',
  SERVICES: 'travelmate_services',
};

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currency: string;
  setCurrency: (c: string) => void;
  user: User | null;
  isLoadingAuth: boolean;
  logout: () => void;

  // Data
  destinations: Destination[];
  faqs: FAQ[];
  reviews: Review[];
  blogs: Blog[];
  services: Service[];
  messages: ContactMessage[];
  tripRequests: TripRequestRecord[];
  allUsers: User[]; // For admin

  // Actions
  addDestination: (d: Destination) => void;
  removeDestination: (id: string) => void;
  addFAQ: (f: FAQ) => void;
  removeFAQ: (id: string) => void;
  addReview: (r: Review) => void;
  deleteReview: (id: string) => void;
  addBlog: (b: Blog) => void;
  deleteBlog: (id: string) => void;
  addService: (s: Service) => void;
  deleteService: (id: string) => void;
  sendMessage: (m: ContactMessage) => void;
  deleteMessage: (id: string) => void;
  deleteUser: (id: string) => void;
  deleteTripRequest: (id: string) => void;

  // AI & Trip
  currentTripPlan: TripPlan | null;
  isGenerating: boolean;
  generateTrip: (req: TripRequest) => Promise<void>;
  tripError: string | null;
  updateTripPlan: (plan: TripPlan) => void;
  saveTrip: (plan: TripPlan) => Promise<boolean>;
  deleteSavedTrip: (id: string) => Promise<boolean>;
  setTripPlan: React.Dispatch<React.SetStateAction<TripPlan | null>>;
  refreshUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to get or set initial data safely
const getInitialData = <T,>(key: string, defaultData: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed !== null ? parsed : defaultData;
    }
  } catch (e) {
    console.error(`Error loading key ${key}`, e);
  }

  localStorage.setItem(key, JSON.stringify(defaultData));
  return defaultData;
};

export const AppProvider = ({ children }: PropsWithChildren<{}>) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currency, setCurrency] = useState('INR');
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Real-time Data States
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  // Data from API (Centralized)
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [tripRequests, setTripRequests] = useState<TripRequestRecord[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Trip State
  const [currentTripPlan, setCurrentTripPlan] = useState<TripPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tripError, setTripError] = useState<string | null>(null);

  const refreshUser = async () => {
    try {
      const u = await authService.getMe();
      setUser(u);
    } catch (e) { setUser(null); } finally { setIsLoadingAuth(false); }
  };

  // Initialization & Real-time Listener
  useEffect(() => {
    // Theme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }

    // Load Local/Mock Data
    loadLocalData();

    // Initialize Auth & Listen for Supabase Session Changes
    refreshUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await refreshUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoadingAuth(false);
      }
    });

    // Listen for storage events (Cross-tab Real-time for local data only)
    const handleStorageChange = (e: StorageEvent) => {
      if (Object.values(KEYS).includes(e.key || '')) {
        loadLocalData();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fetch Admin Data when role is confirmed
  useEffect(() => {
    if (user?.role === 'admin') {
      const fetchAdminData = async () => {
        try {
          const [fetchedUsers, fetchedRequests, fetchedMessages] = await Promise.all([
            authService.getAllUsers(),
            authService.getTripRequests(),
            authService.getMessages()
          ]);
          setAllUsers(fetchedUsers);
          setTripRequests(fetchedRequests);
          setMessages(fetchedMessages);
        } catch (e) {
          console.error("Failed to load admin data", e);
        }
      };
      fetchAdminData();
    }
  }, [user]);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  const loadLocalData = () => {
    setDestinations(getInitialData(KEYS.DESTINATIONS, MOCK_DESTINATIONS));
    setFaqs(getInitialData(KEYS.FAQS, MOCK_FAQS));
    setReviews(getInitialData(KEYS.REVIEWS, MOCK_REVIEWS));
    setBlogs(getInitialData(KEYS.BLOGS, MOCK_BLOGS));
    setServices(getInitialData(KEYS.SERVICES, MOCK_SERVICES));
  };

  const saveData = (key: string, data: any, setter: React.Dispatch<any>) => {
    localStorage.setItem(key, JSON.stringify(data));
    setter(data);
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  // --- CRUD ACTIONS ---
  const addDestination = (d: Destination) => saveData(KEYS.DESTINATIONS, [d, ...destinations], setDestinations);
  const removeDestination = (id: string) => saveData(KEYS.DESTINATIONS, destinations.filter(d => d.id !== id), setDestinations);

  const addFAQ = (f: FAQ) => saveData(KEYS.FAQS, [f, ...faqs], setFaqs);
  const removeFAQ = (id: string) => saveData(KEYS.FAQS, faqs.filter(f => f.id !== id), setFaqs);

  const addReview = (r: Review) => saveData(KEYS.REVIEWS, [r, ...reviews], setReviews);
  const deleteReview = (id: string) => saveData(KEYS.REVIEWS, reviews.filter(r => r.id !== id), setReviews);

  const addBlog = (b: Blog) => saveData(KEYS.BLOGS, [b, ...blogs], setBlogs);
  const deleteBlog = (id: string) => saveData(KEYS.BLOGS, blogs.filter(b => b.id !== id), setBlogs);

  const addService = (s: Service) => saveData(KEYS.SERVICES, [s, ...services], setServices);
  const deleteService = (id: string) => saveData(KEYS.SERVICES, services.filter(s => s.id !== id), setServices);

  // --- API ACTIONS ---

  const sendMessage = async (m: ContactMessage) => {
    // Optimistic UI update not strictly needed for contact form, just send to server
    try {
      await authService.sendMessage(m);
      // If admin, refresh messages
      if (user?.role === 'admin') {
        const msgs = await authService.getMessages();
        setMessages(msgs);
      }
    } catch (e) {
      console.error("Failed to send message", e);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      await authService.deleteMessage(id);
      setMessages(prev => prev.filter(m => m.id !== id));
    } catch (e) {
      alert("Failed to delete message");
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await authService.deleteUser(id);
      setAllUsers(prev => prev.filter(u => u.id !== id));
    } catch (e) {
      alert("Failed to delete user.");
    }
  };

  const deleteTripRequest = async (id: string) => {
    try {
      await authService.deleteTripRequest(id);
      setTripRequests(prev => prev.filter(t => t.id !== id));
    } catch (e) {
      alert("Failed to delete request");
    }
  };

  // --- TRIP LOGIC ---
  const generateTrip = async (req: TripRequest) => {
    setIsGenerating(true);
    setTripError(null);
    setCurrentTripPlan(null);

    // Log Request to Server for Analytics
    const logData = {
      ...req,
      userId: user?.id,
      userName: user?.name || 'Guest'
    };

    // Fire and forget log
    authService.logTripRequest(logData).then(() => {
      if (user?.role === 'admin') {
        authService.getTripRequests().then(setTripRequests);
      }
    });

    try {
      const plan = await generateTripPlan(req);
      setCurrentTripPlan(plan);
    } catch (e: any) {
      setTripError(e.message || "Something went wrong.");
    } finally {
      setIsGenerating(false);
    }
  };

  const updateTripPlan = (plan: TripPlan) => setCurrentTripPlan(plan);

  const saveTrip = async (plan: TripPlan): Promise<boolean> => {
    if (!user) {
      throw new Error('Must be logged in to save trips');
    }
    try {
      const { tripService } = await import('../services/tripService');
      await tripService.saveTrip(user.id, plan);
      // Optionally refresh user trips here if we add that to context
      return true;
    } catch (error: any) {
      console.error('Failed to save trip:', error);
      throw error;
    }
  };

  const deleteSavedTrip = async (id: string): Promise<boolean> => {
    if (!user) {
      throw new Error('Must be logged in to delete trips');
    }
    try {
      const { tripService } = await import('../services/tripService');
      await tripService.deleteTrip(id, user.id);
      return true;
    } catch (e: any) {
      console.error(e);
      throw new Error("Failed to delete trip: " + e.message);
    }
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme, currency, setCurrency,
      user, isLoadingAuth, logout, refreshUser,

      destinations, faqs, reviews, blogs, services, messages, tripRequests, allUsers,

      addDestination, removeDestination,
      addFAQ, removeFAQ,
      addReview, deleteReview,
      addBlog, deleteBlog,
      addService, deleteService,
      sendMessage, deleteMessage,
      deleteUser, deleteTripRequest,

      currentTripPlan, isGenerating, generateTrip, tripError, updateTripPlan, saveTrip, deleteSavedTrip,
      setTripPlan: setCurrentTripPlan
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
