import React, { useEffect, useState } from 'react';
import { getBookings, updateBookingStatus } from '../../services/api';
import type { Booking } from '../../types';
import AdminLayout from '../../components/AdminLayout';
import StatusBadge from '../../components/StatusBadge';

const STATUSES = ['Pending', 'Confirmed', 'Cancelled', 'Completed', 'NoShow'];

const ManageBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updating, setUpdating] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    getBookings(statusFilter ? { status: statusFilter } : {})
      .then((r) => setBookings(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [statusFilter]);

  const handleStatusChange = async (id: number, status: string) => {
    setUpdating(id);
    try {
      await updateBookingStatus(id, status);
      load();
    } finally {
      setUpdating(null);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Reference', 'Customer', 'Phone', 'Offer', 'Slot Date', 'Slot Time', 'People', 'Status', 'Created'];
    const rows = bookings.map((b) => [
      b.bookingReference, b.customerName, b.customerPhone, b.offerTitle,
      new Date(b.slotDate).toLocaleDateString(),
      `${b.slotStartTime} - ${b.slotEndTime}`,
      b.peopleCount, b.status,
      new Date(b.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bookings.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = bookings.filter((b) =>
    b.customerName.toLowerCase().includes(search.toLowerCase()) ||
    b.bookingReference.toLowerCase().includes(search.toLowerCase()) ||
    b.offerTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Manage Bookings</h1>
            <p className="text-sm text-gray-400 mt-1">{bookings.length} total bookings</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, reference, offer..."
            className="flex-1 min-w-48 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-white"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-white"
          >
            <option value="">All Status</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Status summary pills */}
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => {
            const count = bookings.filter((b) => b.status === s).length;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(statusFilter === s ? '' : s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  statusFilter === s
                    ? 'bg-pink-500 text-white border-violet-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300'
                }`}
              >
                {s} ({count})
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-pink-200 border-t-violet-600 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <p className="text-gray-400">No bookings found</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Reference</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Offer</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Slot</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">People</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((b, i) => (
                    <tr key={b.id} className="hover:bg-gray-50/50 transition-colors animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                      <td className="px-5 py-3 font-mono text-xs text-pink-600 font-semibold">{b.bookingReference}</td>
                      <td className="px-5 py-3">
                        <div>
                          <p className="font-semibold text-gray-900">{b.customerName}</p>
                          <p className="text-xs text-gray-400">{b.customerPhone}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div>
                          <p className="font-medium text-gray-900 max-w-32 truncate">{b.offerTitle}</p>
                          <p className="text-xs text-gray-400">{b.businessName}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-500">
                        <div>
                          <p>{new Date(b.slotDate).toLocaleDateString()}</p>
                          <p>{b.slotStartTime} – {b.slotEndTime}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-600">{b.peopleCount}</td>
                      <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
                      <td className="px-5 py-3">
                        <select
                          value={b.status}
                          onChange={(e) => handleStatusChange(b.id, e.target.value)}
                          disabled={updating === b.id}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-pink-400 bg-white disabled:opacity-50"
                        >
                          {STATUSES.map((s) => <option key={s}>{s}</option>)}
                        </select>
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

export default ManageBookingsPage;
