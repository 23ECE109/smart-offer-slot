import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Admin pages
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import BusinessPage from './pages/admin/BusinessPage';
import CreateOfferPage from './pages/admin/CreateOfferPage';
import ManageOffersPage from './pages/admin/ManageOffersPage';
import ManageSlotsPage from './pages/admin/ManageSlotsPage';
import ManageBookingsPage from './pages/admin/ManageBookingsPage';

// Public pages
import LandingPage from './pages/LandingPage';
import OfferListingPage from './pages/public/OfferListingPage';
import OfferDetailPage from './pages/public/OfferDetailPage';
import BookingConfirmationPage from './pages/public/BookingConfirmationPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          {/* Default → role selection landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* Public routes */}
          <Route path="/offers" element={<OfferListingPage />} />
          <Route path="/offers/:id" element={<OfferDetailPage />} />
          <Route path="/booking/confirmation/:id" element={<BookingConfirmationPage />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/admin/business" element={<ProtectedRoute><BusinessPage /></ProtectedRoute>} />
          <Route path="/admin/offers" element={<ProtectedRoute><ManageOffersPage /></ProtectedRoute>} />
          <Route path="/admin/offers/create" element={<ProtectedRoute><CreateOfferPage /></ProtectedRoute>} />
          <Route path="/admin/offers/edit/:id" element={<ProtectedRoute><CreateOfferPage /></ProtectedRoute>} />
          <Route path="/admin/slots" element={<ProtectedRoute><ManageSlotsPage /></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute><ManageBookingsPage /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
