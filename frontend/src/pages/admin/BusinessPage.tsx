import React, { useEffect, useState } from 'react';
import { getBusinesses, createBusiness, updateBusiness } from '../../services/api';
import type { Business } from '../../types';
import AdminLayout from '../../components/AdminLayout';

const BUSINESS_TYPES = ['Restaurant', 'Gym', 'Salon', 'Clinic', 'Coaching', 'Turf', 'Spa', 'Gaming Zone', 'Other'];

const emptyForm = {
  name: '', businessType: 'Gym', ownerName: '', phone: '', email: '',
  address: '', city: '', logoUrl: '', openingTime: '09:00', closingTime: '21:00',
};

const BusinessPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => {
    setLoading(true);
    getBusinesses().then((r) => setBusinesses(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleEdit = (b: Business) => {
    setEditId(b.id);
    setForm({
      name: b.name, businessType: b.businessType, ownerName: b.ownerName,
      phone: b.phone, email: b.email, address: b.address, city: b.city,
      logoUrl: b.logoUrl || '', openingTime: b.openingTime, closingTime: b.closingTime,
    });
    setMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      if (editId) {
        await updateBusiness(editId, form);
        setMsg('Business profile updated successfully');
      } else {
        await createBusiness(form);
        setMsg('Business profile created successfully');
      }
      setForm({ ...emptyForm });
      setEditId(null);
      load();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setMsg(e.response?.data?.message || 'Error saving business');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-gray-50 focus:bg-white transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:bg-gray-700";

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Business Profile</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your business information</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 animate-slide-up">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-5">
              {editId ? 'Edit Business' : 'Create Business Profile'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Business Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Business Type *</label>
                  <select value={form.businessType} onChange={(e) => setForm((f) => ({ ...f, businessType: e.target.value }))} className={inputCls}>
                    {BUSINESS_TYPES.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Owner Name *</label>
                  <input type="text" value={form.ownerName} onChange={(e) => setForm((f) => ({ ...f, ownerName: e.target.value }))} className={inputCls} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Phone *</label>
                  <input type="text" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={inputCls} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputCls} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">City *</label>
                  <input type="text" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className={inputCls} required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Address</label>
                <input type="text" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} className={inputCls} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Logo URL</label>
                <input type="text" value={form.logoUrl} onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))} className={inputCls} placeholder="https://..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Opening Time</label>
                  <input type="time" value={form.openingTime} onChange={(e) => setForm((f) => ({ ...f, openingTime: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Closing Time</label>
                  <input type="time" value={form.closingTime} onChange={(e) => setForm((f) => ({ ...f, closingTime: e.target.value }))} className={inputCls} />
                </div>
              </div>

              {msg && (
                <div className={`text-sm px-4 py-3 rounded-xl border animate-fade-in ${
                  msg.includes('Error') ? 'bg-red-50 border-red-200 text-red-600' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}>
                  {msg}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {saving ? 'Saving...' : editId ? 'Update Profile' : 'Create Profile'}
                </button>
                {editId && (
                  <button
                    type="button"
                    onClick={() => { setEditId(null); setForm({ ...emptyForm }); setMsg(''); }}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List */}
          <div className="space-y-3">
            {loading ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 text-center">
                <div className="w-8 h-8 border-2 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto" />
              </div>
            ) : businesses.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 text-center">
                <p className="text-gray-400 text-sm">No businesses yet. Create one!</p>
              </div>
            ) : (
              businesses.map((b, i) => (
                <div
                  key={b.id}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 animate-slide-up hover:shadow-md transition-all"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {b.logoUrl ? (
                        <img src={b.logoUrl} alt={b.name} className="w-10 h-10 rounded-xl object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{b.name[0]}</span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">{b.name}</h3>
                        <p className="text-xs text-gray-400">{b.businessType} · {b.city}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEdit(b)}
                      className="text-xs text-pink-600 hover:text-pink-800 font-semibold px-3 py-1.5 rounded-lg border border-pink-200 hover:bg-pink-50 transition-all"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{b.phone}</span>
                    <span>{b.email}</span>
                    <span>{b.openingTime} – {b.closingTime}</span>
                    <span>{b.address}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BusinessPage;
