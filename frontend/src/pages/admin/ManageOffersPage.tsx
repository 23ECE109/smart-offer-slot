import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOffers, deleteOffer, updateOffer } from '../../services/api';
import type { Offer } from '../../types';
import AdminLayout from '../../components/AdminLayout';
import StatusBadge from '../../components/StatusBadge';

const ManageOffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const load = () => {
    setLoading(true);
    getOffers({ adminView: true })
      .then((r) => setOffers(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this offer?')) return;
    await deleteOffer(id);
    load();
  };

  const handleStatusChange = async (offer: Offer, status: string) => {
    await updateOffer(offer.id, {
      businessId: offer.businessId, title: offer.title, description: offer.description,
      category: offer.category, originalPrice: offer.originalPrice, offerPrice: offer.offerPrice,
      startDate: offer.startDate, endDate: offer.endDate, startTime: offer.startTime,
      endTime: offer.endTime, totalCapacity: offer.totalCapacity,
      maxBookingPerCustomer: offer.maxBookingPerCustomer,
      termsAndConditions: offer.termsAndConditions, status,
    });
    load();
  };

  const filtered = offers.filter((o) => {
    const matchSearch = o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.businessName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Manage Offers</h1>
            <p className="text-sm text-gray-400 mt-1">{offers.length} total offers</p>
          </div>
          <Link
            to="/admin/offers/create"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-pink-200"
          >
            + New Offer
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search offers..."
            className="flex-1 min-w-48 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-white"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-white"
          >
            <option value="">All Status</option>
            {['Draft', 'Active', 'Paused', 'Expired', 'Cancelled'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-pink-200 border-t-violet-600 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <p className="text-gray-400">No offers found</p>
            <Link to="/admin/offers/create" className="mt-3 inline-block text-sm text-pink-600 font-semibold hover:underline">
              Create your first offer
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Offer</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Business</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Dates</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Slots</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((o, i) => (
                    <tr key={o.id} className="hover:bg-gray-50/50 transition-colors animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                      <td className="px-5 py-3">
                        <div>
                          <p className="font-semibold text-gray-900">{o.title}</p>
                          <p className="text-xs text-gray-400">{o.category}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-600">{o.businessName}</td>
                      <td className="px-5 py-3">
                        <div>
                          <p className="font-bold text-pink-700">₹{o.offerPrice}</p>
                          <p className="text-xs text-gray-400 line-through">₹{o.originalPrice}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-500">
                        <div>
                          <p>{new Date(o.startDate).toLocaleDateString()}</p>
                          <p>→ {new Date(o.endDate).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-600">{o.availableSlots}/{o.totalSlots}</td>
                      <td className="px-5 py-3">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-pink-400 bg-white"
                        >
                          {['Draft', 'Active', 'Paused', 'Expired', 'Cancelled'].map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/offers/edit/${o.id}`}
                            className="text-xs text-pink-600 hover:text-pink-800 font-semibold"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(o.id)}
                            className="text-xs text-red-500 hover:text-red-700 font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageOffersPage;
