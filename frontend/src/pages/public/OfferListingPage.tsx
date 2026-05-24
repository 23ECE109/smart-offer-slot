import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOffers } from '../../services/api';
import type { Offer } from '../../types';
import OfferCard from '../../components/OfferCard';

const BUSINESS_TYPES = ['Restaurant', 'Gym', 'Salon', 'Clinic', 'Coaching', 'Turf', 'Spa', 'Gaming Zone', 'Other'];
const CATEGORIES = ['Fitness', 'Food', 'Beauty', 'Health', 'Sports', 'Education', 'Entertainment', 'Other'];

const OfferListingPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  const load = () => {
    setLoading(true);
    getOffers({
      businessType: businessType || undefined,
      category: category || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      availableOnly: availableOnly || undefined,
    })
      .then((r) => setOffers(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [businessType, category, minPrice, maxPrice, availableOnly]);

  const filtered = offers.filter((o) =>
    o.title.toLowerCase().includes(search.toLowerCase()) ||
    o.businessName.toLowerCase().includes(search.toLowerCase()) ||
    o.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Top nav */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
            <span className="text-white font-black text-xs">S</span>
          </div>
          <span className="font-bold text-gray-900 text-sm">SmartOffer</span>
        </div>
        <Link to="/" className="text-xs font-semibold text-pink-600 hover:text-pink-800 px-3 py-1.5 rounded-lg border border-pink-200 hover:bg-pink-50 transition-all">
          ← Home
        </Link>
        <Link to="/admin/login" className="text-xs font-semibold text-pink-600 hover:text-pink-800 px-3 py-1.5 rounded-lg border border-pink-200 hover:bg-pink-50 transition-all">
          Admin Login
        </Link>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-100 rounded-full blur-3xl opacity-60 animate-pulse-slow" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-pink-500 rounded-full blur-3xl opacity-60 animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-200 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            <span className="text-xs font-semibold text-pink-700">Live Offers Available</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-4 animate-slide-up">
            Exclusive Deals,<br />
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Limited Slots
            </span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
            Book time-limited offers from top businesses near you. Gyms, salons, restaurants, clinics and more.
          </p>

          {/* Search */}
          <div className="max-w-lg mx-auto animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search offers, businesses..."
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm shadow-sm bg-white"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside className="w-56 flex-shrink-0 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 animate-slide-up">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Filters</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Business Type</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-xs bg-gray-50 focus:bg-white transition-all"
                  >
                    <option value="">All Types</option>
                    {BUSINESS_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-xs bg-gray-50 focus:bg-white transition-all"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Price Range (₹)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="Min"
                      className="w-full px-2 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-xs bg-gray-50 focus:bg-white transition-all"
                    />
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="Max"
                      className="w-full px-2 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-xs bg-gray-50 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setAvailableOnly(!availableOnly)}
                    className={`w-9 h-5 rounded-full transition-colors ${availableOnly ? 'bg-pink-500' : 'bg-gray-200'} relative`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${availableOnly ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </div>
                  <span className="text-xs font-semibold text-gray-600">Available only</span>
                </label>

                {(businessType || category || minPrice || maxPrice || availableOnly) && (
                  <button
                    onClick={() => { setBusinessType(''); setCategory(''); setMinPrice(''); setMaxPrice(''); setAvailableOnly(false); }}
                    className="w-full text-xs text-red-500 hover:text-red-700 font-semibold py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Offers grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                <span className="font-bold text-gray-900">{filtered.length}</span> offers found
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 h-64 animate-pulse">
                    <div className="h-1.5 bg-gray-200 rounded-t-2xl" />
                    <div className="p-5 space-y-3">
                      <div className="h-3 bg-gray-100 rounded-full w-3/4" />
                      <div className="h-4 bg-gray-100 rounded-full" />
                      <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <p className="text-gray-500 font-medium">No offers found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((offer, i) => (
                  <OfferCard key={offer.id} offer={offer} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferListingPage;
