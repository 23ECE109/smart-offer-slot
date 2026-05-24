import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="flex flex-col items-center mb-12 animate-slide-up">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-4 shadow-lg shadow-pink-200 animate-float">
          <span className="text-white font-black text-2xl">S</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">SmartOffer Slot</h1>
        <p className="text-gray-400 text-sm text-center max-w-xs">
          Book exclusive limited-time offers from top businesses near you
        </p>
      </div>

      {/* Role selection */}
      <div className="w-full max-w-sm space-y-4 animate-slide-up" style={{ animationDelay: '150ms' }}>
        <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
          Who are you?
        </p>

        {/* Customer */}
        <button
          onClick={() => navigate('/offers')}
          className="w-full group relative overflow-hidden bg-white border-2 border-gray-100 hover:border-pink-200 rounded-2xl p-6 text-left transition-all duration-300 hover:shadow-lg hover:shadow-pink-100"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-rose-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center flex-shrink-0 group-hover:from-pink-200 group-hover:to-rose-200 transition-all">
              <span className="text-2xl">🛍️</span>
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-900 text-base mb-0.5">I'm a Customer</h2>
              <p className="text-xs text-gray-400">Browse offers and book slots</p>
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-pink-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* Admin */}
        <button
          onClick={() => navigate('/admin/login')}
          className="w-full group relative overflow-hidden bg-white border-2 border-gray-100 hover:border-pink-200 rounded-2xl p-6 text-left transition-all duration-300 hover:shadow-lg hover:shadow-pink-100"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-rose-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center flex-shrink-0 group-hover:from-pink-200 group-hover:to-rose-200 transition-all">
              <span className="text-2xl">⚙️</span>
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-900 text-base mb-0.5">I'm an Admin</h2>
              <p className="text-xs text-gray-400">Manage offers, slots and bookings</p>
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-pink-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Footer */}
      <p className="mt-12 text-xs text-gray-300 animate-fade-in" style={{ animationDelay: '300ms' }}>
        Smart Offer Slot Booking System
      </p>
    </div>
  );
};

export default LandingPage;
