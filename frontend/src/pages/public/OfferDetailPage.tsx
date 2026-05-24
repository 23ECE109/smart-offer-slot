import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOffer, getOfferSlots, createBooking } from '../../services/api';
import type { Offer, OfferSlot } from '../../types';
import CountdownTimer from '../../components/CountdownTimer';
import StatusBadge from '../../components/StatusBadge';

const OfferDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [slots, setSlots] = useState<OfferSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<OfferSlot | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [booking, setBooking] = useState({ customerName: '', customerPhone: '', customerEmail: '', peopleCount: '1', specialNote: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getOffer(Number(id)), getOfferSlots(Number(id))])
      .then(([o, s]) => {
        setOffer(o.data);
        setSlots(s.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    setError('');
    setSubmitting(true);
    try {
      const res = await createBooking({
        offerId: Number(id),
        slotId: selectedSlot.id,
        customerName: booking.customerName,
        customerPhone: booking.customerPhone,
        customerEmail: booking.customerEmail || undefined,
        peopleCount: Number(booking.peopleCount),
        specialNote: booking.specialNote || undefined,
      });
      navigate(`/booking/confirmation/${res.data.id}`);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-pink-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg font-medium">Offer not found</p>
          <button onClick={() => navigate('/')} className="mt-4 text-pink-600 hover:underline text-sm">
            Back to offers
          </button>
        </div>
      </div>
    );
  }

  const availableSlots = slots.filter((s) => s.status === 'Available' && s.availableCount > 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Back nav */}
      <div className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/offers')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to offers
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-slide-up">
              <div className="h-2 bg-gradient-to-r from-pink-500 to-rose-500" />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      {offer.businessName} · {offer.businessCity}
                    </p>
                    <h1 className="text-2xl font-black text-gray-900">{offer.title}</h1>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={offer.status} size="md" />
                    <span className="text-xs font-bold px-3 py-1 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                      {offer.discountPercentage}% OFF
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed mb-5">{offer.description}</p>

                {/* Price */}
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-4xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                    ₹{offer.offerPrice}
                  </span>
                  <div>
                    <p className="text-sm text-gray-400 line-through">₹{offer.originalPrice}</p>
                    <p className="text-xs text-emerald-600 font-semibold">Save ₹{offer.originalPrice - offer.offerPrice}</p>
                  </div>
                </div>

                {/* Meta */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-0.5">Category</p>
                    <p className="font-semibold text-gray-700">{offer.category}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-0.5">Available Slots</p>
                    <p className="font-semibold text-gray-700">{offer.availableSlots} of {offer.totalSlots}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-0.5">Valid Until</p>
                    <p className="font-semibold text-gray-700">{new Date(offer.endDate).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-0.5">Max per Customer</p>
                    <p className="font-semibold text-gray-700">{offer.maxBookingPerCustomer} seat(s)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Countdown */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-100 p-4 flex items-center justify-between animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div>
                <p className="text-xs font-semibold text-orange-700 mb-1">Offer expires in</p>
                <CountdownTimer endDate={offer.endDate} />
              </div>
              <div className="text-2xl animate-float">⏰</div>
            </div>

            {/* Terms */}
            {offer.termsAndConditions && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <h2 className="text-sm font-bold text-gray-700 mb-3">Terms & Conditions</h2>
                <p className="text-sm text-gray-500 leading-relaxed">{offer.termsAndConditions}</p>
              </div>
            )}

            {/* Slots */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <h2 className="text-sm font-bold text-gray-700 mb-4">Available Time Slots</h2>
              {slots.length === 0 ? (
                <p className="text-sm text-gray-400">No slots available for this offer.</p>
              ) : (
                <div className="space-y-2">
                  {slots.map((slot) => {
                    const isAvailable = slot.status === 'Available' && slot.availableCount > 0;
                    const isSelected = selectedSlot?.id === slot.id;
                    return (
                      <button
                        key={slot.id}
                        onClick={() => isAvailable && setSelectedSlot(isSelected ? null : slot)}
                        disabled={!isAvailable}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? 'border-pink-400 bg-pink-50'
                            : isAvailable
                            ? 'border-gray-200 hover:border-pink-300 hover:bg-gray-50'
                            : 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {new Date(slot.slotDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                          </p>
                          <p className="text-xs text-gray-500">{slot.startTime} – {slot.endTime}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-xs font-semibold text-gray-700">{slot.availableCount} left</p>
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1">
                              <div
                                className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                                style={{ width: `${(slot.availableCount / slot.capacity) * 100}%` }}
                              />
                            </div>
                          </div>
                          <StatusBadge status={slot.status} />
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Booking sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20 animate-slide-up" style={{ animationDelay: '150ms' }}>
              <h2 className="text-sm font-bold text-gray-700 mb-4">Book This Offer</h2>

              {!showBooking ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">Selected Slot</p>
                    {selectedSlot ? (
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(selectedSlot.slotDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                        <p className="text-xs text-gray-500">{selectedSlot.startTime} – {selectedSlot.endTime}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">Select a slot above</p>
                    )}
                  </div>

                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Offer Price</span>
                      <span className="font-bold text-pink-700">₹{offer.offerPrice}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>You save</span>
                      <span className="text-emerald-600 font-semibold">₹{offer.originalPrice - offer.offerPrice}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowBooking(true)}
                    disabled={!selectedSlot || availableSlots.length === 0}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 shadow-lg shadow-pink-200"
                  >
                    {availableSlots.length === 0 ? 'No Slots Available' : selectedSlot ? 'Proceed to Book' : 'Select a Slot First'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBook} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
                    <input
                      value={booking.customerName}
                      onChange={(e) => setBooking({ ...booking, customerName: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-gray-50 focus:bg-white transition-all"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Phone *</label>
                    <input
                      value={booking.customerPhone}
                      onChange={(e) => setBooking({ ...booking, customerPhone: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-gray-50 focus:bg-white transition-all"
                      placeholder="10-digit mobile"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={booking.customerEmail}
                      onChange={(e) => setBooking({ ...booking, customerEmail: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-gray-50 focus:bg-white transition-all"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Number of People *</label>
                    <input
                      type="number"
                      value={booking.peopleCount}
                      onChange={(e) => setBooking({ ...booking, peopleCount: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-gray-50 focus:bg-white transition-all"
                      min="1"
                      max={offer.maxBookingPerCustomer}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Special Note</label>
                    <textarea
                      value={booking.specialNote}
                      onChange={(e) => setBooking({ ...booking, specialNote: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-gray-50 focus:bg-white transition-all resize-none"
                      placeholder="Any special requests..."
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2.5 rounded-xl animate-fade-in">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold hover:opacity-90 disabled:opacity-60 transition-opacity"
                    >
                      {submitting ? 'Booking...' : 'Confirm Booking'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowBooking(false); setError(''); }}
                      className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferDetailPage;
