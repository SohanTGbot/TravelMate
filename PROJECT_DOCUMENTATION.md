# 🌍 TravelMate - Project Documentation

**Version:** 1.0.0  
**Last Updated:** January 2026

---

## 1. Executive Summary

**TravelMate** is a cutting-edge, AI-powered travel planning application designed to revolutionize how users create travel itineraries. By leveraging **Google Gemini AI**, the platform generates bespoke, detailed day-by-day travel plans based on nuanced user preferences such as budget, travel style ("Vibe"), and specific interests.

Beyond simple itinerary generation, TravelMate offers a full ecosystem including a community feed for sharing trips, a comprehensive admin dashboard for content management, and robust user profile features for managing travel documents and history.

---

## 2. Platform Features

### 🧠 Core Module: AI Trip Planner
The heart of the application is the intelligent travel form and result engine.
- **Smart Inputs:** Users specify destination, dates, budget (`Backpacker` to `Ultra Luxury`), group size, and dynamic tags like "History", "Nature", "Hidden Gems".
- **Generative AI Engine:** Uses Google Gemini to construct a logical, time-optimized itinerary.
- **Dynamic Itinerary:**
  - Day-by-day breakdown with morning, afternoon, and evening activities.
  - **Budget Estimation:** Detailed cost breakdown for flights, reliable accommodation, and daily expenses.
  - **Suitability Score:** An AI-generated 1-100 score assessing how well the destination fits the user's specific request logic.
  - **Smart Packing:** Weather-aware packing list suggestions.
- **Visuals & Maps:** Interactive maps powered by Leaflet to visualize the route.

### 👤 User Experience (UX)
- **Profile Management:**
  - Personal dashboard to view "My Trips".
  - **Document Vault:** Securely upload and store travel documents (Passport, Adhar, License).
  - Profile customization (Avatar, Bio).
- **Authentication:** Secure Email/Password login and registration via Supabase Auth.
- **Community & Social:**
  - **Trip Feed:** Explore public itineraries created by other users.
  - **Interaction:** Like, clone (copy to my trips), and comment on community trips.
  - **Public Profiles:** View other travelers' shared history.

### 🛠️ Administrator Panel
A powerful dashboard for platform oversight.
- **Content Management:** CRUD operations for Destinations, Blogs, FAQs, and Services.
- **User Verification:** Review and approve/reject user-submitted reviews.
- **Analytics:** View booking stats (simulated) and platform usage.
- **Audit Logs:** Track admin actions for security and accountability.
- **Financial Reports:** Visual charts for revenue and booking trends.

### 📱 General UI/UX
- **Glassmorphism Design:** Modern, translucent UI aesthetics using TailwindCSS.
- **Responsive:** Fully optimized for Mobile, Tablet, and Desktop.
- **Dark Mode:** System-aware thematic adjustments.

---

## 3. Technology Stack

### Frontend
- **Framework:** [React 18](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/) (High-performance bundler)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict type safety)
- **Styling:** [TailwindCSS](https://tailwindcss.com/) + Custom CSS variables for theming.
- **Routing:** React Router v6+.
- **Icons:** `lucide-react`.

### Backend & Infrastructure
- **BaaS (Backend-as-a-Service):** [Supabase](https://supabase.com/)
  - **Database:** PostgreSQL.
  - **Auth:** Supabase Auth (JWT based).
  - **Storage:** Supabase Storage (Buckets for avatars, trip images, documents).
- **AI Model:** [Google Gemini Pro](https://ai.google.dev/) via `@google/genai`.

### Key Libraries
- **Maps:** `react-leaflet`, `leaflet`.
- **Charts:** `recharts` (Admin analytics).
- **Utilities:** `date-fns` (Date manipulation), `html2pdf.js` (Export functionality), `react-loading-skeleton` (Loading states).

---

## 4. Application Architecture

### Folder Structure
```
/src
  ├── components/       # Reusable UI components (Buttons, Cards, Modals)
  ├── context/          # React Context providers (Auth, Theme)
  ├── db/               # Database interaction layer / Types
  ├── pages/            # Page-level components corresponding to Routes
  ├── services/         # API services (Gemini Service, Supabase Service)
  ├── types.ts          # TypeScript interfaces (Trip, User, AdminLog)
  └── App.tsx           # Main application entry and Routing setup
```

### Data Models (Key Tables)
The application relies on a relational PostgreSQL schema.
- **`profiles`**: Extends auth.users with app-specific data (name, avatar).
- **`trips`**: Stores generated JSON itineraries, user associations, and public status.
- **`trip_comments`**: Links users to trips for social interaction.
- **`user_documents`**: Links specific uploaded files to users.
- **`admin_logs`**: System-wide audit trail.
- **`reviews`**, **`destinations`**, **`blogs`**: Content tables managed via Admin Panel.

---

## 5. Local Development Setup

To run this project locally, follow these steps:

**Prerequisites:**
- Node.js (v18 or higher)
- npm or yarn

**Steps:**

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/SohanTGbot/TravelMate.git
    cd travelmate-(main)
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env.local` file in the root and populate it with your credentials:
    ```env
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_ANON_KEY=your_public_anon_key
    VITE_GEMINI_API_KEY=your_google_ai_key
    ```
    *(Note: Ensure your Supabase instance has the required tables created. Refer to `community_schema.sql` for structure.)*

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:5173`.

---

## 6. Deployment

The application is configured for deployment on **Vercel**.
- The `vercel.json` file handles routing rewrites for SPA (Single Page Application) support.
- Environment variables must be set in the Vercel project settings matching your `.env.local`.

---

## 7. Future Roadmap
- [ ] **Real-time Collaboration:** Allow multiple users to edit a trip simultaneously.
- [ ] **Live Booking Integration:** Connect APIs (Skyscanner/Amadeus) for real flight booking.
- [ ] **Native Mobile App:** Port to React Native for iOS/Android stores.
