import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBooking } from '../../services/api';
import type { Booking } from '../../types';
import { QRCodeSVG } from 'qrcode.react';
import StatusBadge from '../../components/StatusBadge';

const BookingConfirmationPage: React.FC = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooking(Number(id))
      .then((r) => setBooking(r.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-pink-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Booking not found</p>
          <Link to="/" className="mt-3 inline-block text-pink-600 hover:underline text-sm">Back to offers</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Success animation */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200 animate-float">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">Booking Confirmed!</h1>
          <p className="text-gray-500 text-sm">Your slot has been reserved successfully</p>
        </div>

        {/* Booking card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden animate-slide-up" style={{ animationDelay: '100ms' }}>
          {/* Top gradient */}
          <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />

          <div className="p-6 space-y-5">
            {/* Reference */}
            <div className="text-center bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Booking Reference</p>
              <p className="text-xl font-black font-mono text-pink-700">{booking.bookingReference}</p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center">
              <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                <QRCodeSVG
                  value={booking.bookingReference}
                  size={120}
                  bgColor="#ffffff"
                  fgColor="#4f46e5"
                  level="M"
                />
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Offer</span>
                <span className="text-sm font-semibold text-gray-900 text-right max-w-48">{booking.offerTitle}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Business</span>
                <span className="text-sm font-semibold text-gray-900">{booking.businessName}</span>
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Date</span>
                <span className="text-sm font-semibold text-gray-900">
                  {new Date(booking.slotDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Time</span>
                <span className="text-sm font-semibold text-gray-900">{booking.slotStartTime} – {booking.slotEndTime}</span>
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex justify-between">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Customer</span>
                <span className="text-sm font-semibold text-gray-900">{booking.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Phone</span>
                <span className="text-sm font-semibold text-gray-900">{booking.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">People</span>
                <span className="text-sm font-semibold text-gray-900">{booking.peopleCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Status</span>
                <StatusBadge status={booking.status} size="md" />
              </div>
              {booking.specialNote && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Note</p>
                  <p className="text-sm text-gray-600">{booking.specialNote}</p>
                </div>
              )}
            </div>

            {/* Booked at */}
            <p className="text-xs text-gray-400 text-center">
              Booked on {new Date(booking.createdAt).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <Link
            to="/offers"
            className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors text-center"
          >
            Browse More Offers
          </Link>
          <button
            onClick={() => window.print()}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold hover:opacity-90 transition-opacity"
          >
            Print / Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
