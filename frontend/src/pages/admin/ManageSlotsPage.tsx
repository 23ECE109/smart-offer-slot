import React, { useEffect, useState } from 'react';
import { getSlots, getOffers, createSlot, updateSlot, deleteSlot } from '../../services/api';
import type { OfferSlot, Offer } from '../../types';
import AdminLayout from '../../components/AdminLayout';
import StatusBadge from '../../components/StatusBadge';

const SLOT_STATUSES = ['Available', 'Full', 'Closed', 'Expired', 'Cancelled'];

const ManageSlotsPage: React.FC = () => {
  const [slots, setSlots] = useState<OfferSlot[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [filterOffer, setFilterOffer] = useState('');

  const [form, setForm] = useState({
    offerId: 0, slotDate: '', startTime: '09:00', endTime: '10:00', capacity: '', status: 'Available',
  });

  const load = () => {
    setLoading(true);
    Promise.all([
      getSlots(filterOffer ? { offerId: filterOffer } : {}),
      getOffers({ adminView: true }),
    ]).then(([s, o]) => {
      setSlots(s.data);
      setOffers(o.data);
      if (o.data.length > 0 && !form.offerId) setForm((f) => ({ ...f, offerId: o.data[0].id }));
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filterOffer]);

  const handleEdit = (s: OfferSlot) => {
    setEditId(s.id);
    setForm({
      offerId: s.offerId,
      slotDate: s.slotDate.split('T')[0],
      startTime: s.startTime,
      endTime: s.endTime,
      capacity: String(s.capacity),
      status: s.status,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const payload = {
        ...form,
        offerId: Number(form.offerId),
        capacity: Number(form.capacity),
        slotDate: new Date(form.slotDate).toISOString(),
      };
      if (editId) {
        await updateSlot(editId, payload);
        setMsg('Slot updated');
      } else {
        await createSlot(payload);
        setMsg('Slot created');
      }
      setEditId(null);
      setForm({ offerId: offers[0]?.id || 0, slotDate: '', startTime: '09:00', endTime: '10:00', capacity: '', status: 'Available' });
      load();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setMsg(e.response?.data?.message || 'Error saving slot');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this slot?')) return;
    await deleteSlot(id);
    load();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Manage Slots</h1>
          <p className="text-sm text-gray-400 mt-1">Create and manage time slots for your offers</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Form */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-slide-up">
            <h2 className="text-sm font-bold text-gray-700 mb-4">{editId ? 'Edit Slot' : 'Add Slot'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Offer *</label>
                <select
                  value={form.offerId}
                  onChange={(e) => setForm({ ...form, offerId: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-gray-50 focus:bg-white transition-all"
                  required
                >
                  {offers.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Slot Date *</label>
                <input
                  type="date"
                  value={form.slotDate}
                  onChange={(e) => setForm({ ...form, slotDate: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-gray-50 focus:bg-white transition-all"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Start Time</label>
                  <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-gray-50 focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">End Time</label>
                  <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-gray-50 focus:bg-white transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Capacity *</label>
                <input
                  type="number"
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-gray-50 focus:bg-white transition-all"
                  placeholder="10"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-gray-50 focus:bg-white transition-all"
                >
                  {SLOT_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              {msg && (
                <div className={`text-sm px-3 py-2.5 rounded-xl border animate-fade-in ${msg.includes('Error') ? 'bg-red-50 border-red-200 text-red-600' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
                  {msg}
                </div>
              )}

              <div className="flex gap-2">
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold hover:opacity-90 disabled:opacity-60 transition-opacity">
                  {saving ? 'Saving...' : editId ? 'Update' : 'Add Slot'}
                </button>
                {editId && (
                  <button type="button" onClick={() => { setEditId(null); setMsg(''); }}
                    className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Slots list */}
          <div className="xl:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <select
                value={filterOffer}
                onChange={(e) => setFilterOffer(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-white"
              >
                <option value="">All Offers</option>
                {offers.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
              </select>
              <span className="text-sm text-gray-400">{slots.length} slots</span>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-pink-200 border-t-violet-600 rounded-full animate-spin" />
              </div>
            ) : slots.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <p className="text-gray-400 text-sm">No slots found. Add one!</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Offer</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Time</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Capacity</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {slots.map((s, i) => (
                      <tr key={s.id} className="hover:bg-gray-50/50 transition-colors animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                        <td className="px-4 py-3 font-medium text-gray-900 max-w-32 truncate">{s.offerTitle}</td>
                        <td className="px-4 py-3 text-gray-600">{new Date(s.slotDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{s.startTime} – {s.endTime}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                                style={{ width: `${(s.bookedCount / s.capacity) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">{s.bookedCount}/{s.capacity}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(s)} className="text-xs text-pink-600 hover:text-pink-800 font-semibold">Edit</button>
                            <button onClick={() => handleDelete(s.id)} className="text-xs text-red-500 hover:text-red-700 font-semibold">Del</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageSlotsPage;
