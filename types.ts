
export interface Destination {
  id: string;
  name: string;
  image: string;
  description: string;
  rating: number;
  category: 'Beach' | 'Mountain' | 'City' | 'Desert' | 'Culture';
  bestMonth: string;
  idealDuration: string;
  priceLevel: 'Low' | 'Medium' | 'High';
}

export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  approved: boolean;
  location: string;
  tripType: 'Solo' | 'Family' | 'Couple' | 'Friends';
  date: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface TripRequest {
  origin?: string;
  destination: string;
  tripType: 'Single City' | 'Multi-City';
  stops?: string[];
  duration: number;
  travelMonth: string;
  currency: string;
  language: string;
  dietary: string;
  budget: 'Backpacker' | 'Budget' | 'Moderate' | 'Luxury' | 'Ultra Luxury';
  budgetBreakdown?: {
    flights: number;
    hotels: number;
    daily: number;
  };
  vibe?: string;
  activityLevel: 'Relaxed' | 'Moderate' | 'Fast Paced';
  groupType: 'Solo' | 'Couple' | 'Family' | 'Family with Kids' | 'Family with Teens' | 'Friends' | 'Business' | 'Large Group';
  interests: string[];
}

export interface TripRequestRecord extends TripRequest {
  id: string;
  userId?: string;
  userName?: string;
  timestamp: string;
}

// --- NEW DETAILED ITINERARY INTERFACES ---

export interface ActivityDetail {
  time: string;
  activity: string;
  description: string;
  type: 'Visit' | 'Food' | 'Shopping' | 'Rest' | 'Travel';
}

export interface DayTravel {
  from: string;
  to: string;
  mode: 'Bus' | 'Train' | 'Flight' | 'Taxi' | 'Ferry' | 'Walk';
  duration: string;
  arrival: string;
}

export interface DayAccommodation {
  name: string;
  location: string;
  checkIn: string;
  checkOut: string;
  nights: number;
}

export interface DayMeals {
  breakfast: string;
  lunch: string;
  dinner: string;
}

export interface DayCost {
  hotel: string;
  travel: string;
  activities: string;
  food: string;
  total: string;
}

export interface ItineraryDay {
  day: number;
  date: string; // e.g., "June 12"
  city: string;
  title: string; // Theme
  travel?: DayTravel;
  accommodation?: DayAccommodation;
  activities: ActivityDetail[];
  meals: DayMeals;
  costEstimate: DayCost;
}

export interface TripPlan {
  id?: string;
  tripName: string;
  summary: string;
  totalBudgetEstimation: string;
  currency: string;
  hotels: string[]; // General list kept for backward compat/summary
  transportation: string; // General summary
  itinerary: ItineraryDay[];
  packingTips: string[];
  createdAt?: string;

  // New Fields
  suitabilityTags: string[];
  qualityScore: {
    score: number; // 1-100
    text: string; // "Excellent", "Good", "Challenging"
    reason: string; // Why this score (weather, crowds, etc)
  };

  crowdLevel?: 'Low' | 'Moderate' | 'High';
  weather?: {
    temperature: string;
    advice: string;
  };
  food?: {
    dailyBudget: string;
    mustTryDishes: string[];
  };
  localEtiquette?: {
    dos: string[];
    donts: string[];
  };
  costSavingTips?: string[];
  emergencyInfo?: {
    police: string;
    ambulance: string;
    embassyHelp: string;
  };
  isPublic?: boolean;
  shareId?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  name: string;
  avatar_url?: string;
  savedTrips: TripPlan[];
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string; // Keep as string for now, could be relation
  date: string; // created_at
  category: string;
  readTime: string;
  featured?: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  stats?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
}

export interface Booking {
  id: string;
  user_id: string;
  trip_request_id?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total_price: number;
  currency: string;
  booking_date: string;
  payment_status: 'unpaid' | 'paid' | 'refunded' | 'failed';
  payment_method?: string;
  confirmed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  profiles?: {
    email: string;
    full_name?: string;
  };
  trip_requests?: {
    destination: string;
    duration: number;
  };
}

export interface AdminLog {
  id: string;
  admin_id?: string;
  admin_email: string;
  action_type: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'status_change';
  table_name: string;
  record_id?: string;
  old_data?: any;
  new_data?: any;
  description?: string;
  created_at: string;
}

export interface UserDocument {
  id: string;
  user_id: string;
  name: string;
  type: 'adhar' | 'passport' | 'license' | 'other';
  file_path: string;
  created_at: string;
}

export interface TripComment {
  id: string;
  trip_id: string;
  user_id: string;
  content: string;
  created_at: string;
  // Join structure from Supabase
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
}