import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createOffer, updateOffer, getOffer, getBusinesses } from '../../services/api';
import type { Business } from '../../types';
import AdminLayout from '../../components/AdminLayout';

const CATEGORIES = ['Fitness', 'Food', 'Beauty', 'Health', 'Sports', 'Education', 'Entertainment', 'Other'];
const STATUSES = ['Draft', 'Active', 'Paused'];

const CreateOfferPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    businessId: 0,
    title: '',
    description: '',
    category: 'Fitness',
    originalPrice: '',
    offerPrice: '',
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '21:00',
    totalCapacity: '',
    maxBookingPerCustomer: '1',
    termsAndConditions: '',
    status: 'Draft',
  });

  useEffect(() => {
    getBusinesses().then((r) => {
      setBusinesses(r.data);
      if (r.data.length > 0 && !isEdit) setForm((f) => ({ ...f, businessId: r.data[0].id }));
    });
    if (isEdit) {
      getOffer(Number(id)).then((r) => {
        const o = r.data;
        setForm({
          businessId: o.businessId,
          title: o.title,
          description: o.description,
          category: o.category,
          originalPrice: String(o.originalPrice),
          offerPrice: String(o.offerPrice),
          startDate: o.startDate.split('T')[0],
          endDate: o.endDate.split('T')[0],
          startTime: o.startTime,
          endTime: o.endTime,
          totalCapacity: String(o.totalCapacity),
          maxBookingPerCustomer: String(o.maxBookingPerCustomer),
          termsAndConditions: o.termsAndConditions || '',
          status: o.status,
        });
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (Number(form.offerPrice) >= Number(form.originalPrice)) {
      setError('Offer price must be less than original price');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        businessId: Number(form.businessId),
        originalPrice: Number(form.originalPrice),
        offerPrice: Number(form.offerPrice),
        totalCapacity: Number(form.totalCapacity),
        maxBookingPerCustomer: Number(form.maxBookingPerCustomer),
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
      };
      if (isEdit) {
        await updateOffer(Number(id), payload);
      } else {
        await createOffer(payload);
      }
      navigate('/admin/offers');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Error saving offer');
    } finally {
      setSaving(false);
    }
  };

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const discount = form.originalPrice && form.offerPrice
    ? Math.max(0, Math.round((Number(form.originalPrice) - Number(form.offerPrice)) / Number(form.originalPrice) * 100))
    : 0;

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">{isEdit ? 'Edit Offer' : 'Create Offer'}</h1>
          <p className="text-sm text-gray-400 mt-1">Fill in the details to {isEdit ? 'update' : 'create'} an offer</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 animate-slide-up">
            <h2 className="text-sm font-bold text-gray-700 pb-2 border-b border-gray-100">Basic Information</h2>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Business *</label>
              <select
                value={form.businessId}
                onChange={(e) => set('businessId', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-gray-50 focus:bg-white transition-all"
                required
              >
                <option value={0}>Select business...</option>
                {businesses.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Offer Title *</label>
              <input
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-gray-50 focus:bg-white transition-all"
                placeholder="e.g. Afternoon Gym Trial"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-gray-50 focus:bg-white transition-all resize-none"
                placeholder="Describe the offer..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-gray-50 focus:bg-white transition-all"
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => set('status', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-gray-50 focus:bg-white transition-all"
                >
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h2 className="text-sm font-bold text-gray-700 pb-2 border-b border-gray-100">Pricing</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Original Price (₹) *</label>
                <input
                  type="number"
                  value={form.originalPrice}
                  onChange={(e) => set('originalPrice', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-gray-50 focus:bg-white transition-all"
                  placeholder="499"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Offer Price (₹) *</label>
                <input
                  type="number"
                  value={form.offerPrice}
                  onChange={(e) => set('offerPrice', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-gray-50 focus:bg-white transition-all"
                  placeholder="99"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Discount</label>
                <div className="px-3 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-sm font-bold text-emerald-700">
                  {discount}% OFF
                </div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-sm font-bold text-gray-700 pb-2 border-b border-gray-100">Schedule</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Start Date *</label>
                <input type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-gray-50 focus:bg-white transition-all" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">End Date *</label>
                <input type="date" value={form.endDate} onChange={(e) => set('endDate', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-gray-50 focus:bg-white transition-all" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Start Time</label>
                <input type="time" value={form.startTime} onChange={(e) => set('startTime', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-gray-50 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">End Time</label>
                <input type="time" value={form.endTime} onChange={(e) => set('endTime', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-gray-50 focus:bg-white transition-all" />
              </div>
            </div>
          </div>

          {/* Capacity */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <h2 className="text-sm font-bold text-gray-700 pb-2 border-b border-gray-100">Capacity & Rules</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Total Capacity *</label>
                <input type="number" value={form.totalCapacity} onChange={(e) => set('totalCapacity', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-gray-50 focus:bg-white transition-all"
                  placeholder="20" min="1" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Max Booking Per Customer</label>
                <input type="number" value={form.maxBookingPerCustomer} onChange={(e) => set('maxBookingPerCustomer', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-gray-50 focus:bg-white transition-all"
                  placeholder="1" min="1" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Terms & Conditions</label>
              <textarea
                value={form.termsAndConditions}
                onChange={(e) => set('termsAndConditions', e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-gray-50 focus:bg-white transition-all resize-none"
                placeholder="Enter terms and conditions..."
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl animate-fade-in">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 shadow-lg shadow-pink-200"
            >
              {saving ? 'Saving...' : isEdit ? 'Update Offer' : 'Create Offer'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/offers')}
              className="px-6 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CreateOfferPage;
