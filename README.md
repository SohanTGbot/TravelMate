
# 🌍 TravelMate - Intelligent AI Travel Planner

![TravelMate Banner](https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop)

**TravelMate** is a next-generation travel planning application that combines the power of **Google Gemini AI** with a premium, mobile-first interface to create bespoke itineraries in seconds. 

Whether you're a backpacker looking for hidden gems or a luxury traveler seeking 5-star experiences, TravelMate understands your style and handles the logistics—from daily schedules to packing lists—so you can focus on the journey.

---

## ✨ Key Features

### 🧠 **Smart AI Planning Engine**
- **Personalized Itineraries:** Generates day-by-day plans based on your budget ('Budget' vs 'Luxury'), interests (History, Food, Nature), and travel style.
- **Visual Discovery:** "Surprise Me" quiz helps indecisive travelers find their perfect destination using visual A/B testing.
- **Real-time Validity:** Checks historical weather data and flight availability before suggesting a trip.

### 🗺️ **Interactive Itinerary Management**
- **Drag-and-Drop Timeline:** Easily reorder activities; transit times and efficient routes are recalculated instantly.
- **Synchronized Map:** Fully interactive WebGL map that updates as you browse your schedule.
- **Deep-Link Booking:** One-click booking for flights (Skyscanner) and hotels (Booking.com) with pre-filled details.

### 📱 **Premium Mobile Experience**
- **Offline Mode:** Download trips as lightweight HTML files or .ICS calendar invites for access without internet.
- **App-Like Feel:** Swipeable drawers, touch-optimized cards, and a bottom navigation bar for mobile users.
- **Adaptive Theming:** System-syncing Dark Mode (Charcoal-950) for comfortable night planning.

### 🤝 **Community Ecosystem**
- **Share & Collaborate:** Toggle trips between Private and Public.
- **Crowd Intelligence:** Get "Crowd Level" warnings for peak tourist seasons.
- **Social Feed:** Browse, clone, and comment on itineraries created by other travelers.

### 🎒 **Smart Utilities**
- **Sonic Atmosphere:** Auto-generates Spotify playlists based on the destination's vibe (e.g., City Pop for Tokyo).
- **Dynamic Packing List:** Suggests items based on live weather forecasts (e.g., "Raincoat" for varying weather).
- **Emergency Card:** Instant access to local Police, Ambulance, and Embassy numbers.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS (Custom Design System with Glassmorphism)
- **AI Core:** Google Gemini Pro API
- **Backend / Auth:** Supabase (PostgreSQL, Row Level Security)
- **Maps:** Leaflet / Mapbox (via React Components)
- **Deployment:** Vercel

---

## 🚀 Getting Started

Follow these steps to set up TravelMate locally.

### Prerequisites
- Node.js (v18+)
- A [Supabase](https://supabase.com/) account
- A [Google Gemini API Key](https://ai.google.dev/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SohanTGbot/TravelMate.git
   cd TravelMate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your keys:
   ```env
   GEMINI_API_KEY=your_gemini_key_here
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Deployment

TravelMate is optimized for **Vercel**.

1. Fork this repo to your GitHub.
2. Login to Vercel and "Add New Project".
3. Select your TravelMate repo.
4. Add the **Environment Variables** (GEMINI_API_KEY, SUPABASE_URL, etc.) in the Vercel dashboard.
5. Click **Deploy**.

For detailed instructions, see the [Vercel Deployment Guide](./vercel_deployment_guide.md).

---

## 📖 Documentation

- **[How It Works / User Manual](./pages/HowItWorksPage.tsx)**: Comprehensive guide for end-users.
- **[Git Workflow](./git_workflow_guide.md)**: Guide for developers contributing to the repo.

---
**Built with ❤️ by the TravelMate Team.**
