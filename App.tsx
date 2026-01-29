
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NotFound } from './pages/NotFound';
import { OfflineNotice } from './components/OfflineNotice';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HelmetProvider } from 'react-helmet-async';
import { ScrollToTop } from './components/ScrollToTop';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const TravelForm = lazy(() => import('./pages/TravelForm').then(module => ({ default: module.TravelForm })));
const TripResult = lazy(() => import('./pages/TripResult').then(module => ({ default: module.TripResult })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const Register = lazy(() => import('./pages/Register').then(module => ({ default: module.Register })));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const Services = lazy(() => import('./pages/Services').then(module => ({ default: module.Services })));
const Blog = lazy(() => import('./pages/Blog').then(module => ({ default: module.Blog })));
const FAQPage = lazy(() => import('./pages/FAQPage').then(module => ({ default: module.FAQPage })));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage').then(module => ({ default: module.ReviewsPage })));
const Terms = lazy(() => import('./pages/Terms').then(module => ({ default: module.Terms })));
const Privacy = lazy(() => import('./pages/Privacy').then(module => ({ default: module.Privacy })));
const Cookies = lazy(() => import('./pages/Cookies').then(module => ({ default: module.Cookies })));
const Contact = lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })));
const Community = lazy(() => import('./pages/Community'));
const PublicProfile = lazy(() => import('./pages/PublicProfile'));
const Careers = lazy(() => import('./pages/Careers').then(module => ({ default: module.Careers })));
const Destinations = lazy(() => import('./pages/Destinations').then(module => ({ default: module.Destinations })));
const Profile = lazy(() => import('./pages/Profile').then(module => ({ default: module.Profile })));
const MyTripsPage = lazy(() => import('./pages/MyTripsPage').then(module => ({ default: module.MyTripsPage })));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then(module => ({ default: module.ForgotPassword })));
const ResetPassword = lazy(() => import('./pages/ResetPassword').then(module => ({ default: module.ResetPassword })));
const Sitemap = lazy(() => import('./pages/Sitemap').then(module => ({ default: module.Sitemap })));

// Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-sand-50 dark:bg-charcoal-950">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
  </div>
);

const App = () => {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AuthProvider>
          <AppProvider>
            <Router>
              <ScrollToTop />
              <div className="flex flex-col min-h-screen bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 transition-colors font-sans">
                <OfflineNotice />
                <Navbar />
                <main className="flex-grow">
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/plan" element={<ProtectedRoute><TravelForm /></ProtectedRoute>} />
                      <Route path="/result" element={<ProtectedRoute><TripResult /></ProtectedRoute>} />
                      <Route path="/trip/share/:shareId" element={<ProtectedRoute><TripResult /></ProtectedRoute>} />
                      <Route path="/my-trips" element={<ProtectedRoute><MyTripsPage /></ProtectedRoute>} />
                      <Route path="/community" element={<Community />} />
                      <Route path="/profile/:userId" element={<PublicProfile />} />
                      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/faq" element={<FAQPage />} />
                      <Route path="/reviews" element={<ReviewsPage />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/cookies" element={<Cookies />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/careers" element={<Careers />} />
                      <Route path="/destinations" element={<Destinations />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/my-trips" element={<MyTripsPage />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="/sitemap" element={<Sitemap />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </div>
            </Router>
          </AppProvider>
        </AuthProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
};

export default App;
