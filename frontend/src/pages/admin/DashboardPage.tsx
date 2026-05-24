import React, { useEffect, useState } from 'react';
import { getDashboardSummary } from '../../services/api';
import type { DashboardSummary } from '../../types';
import AdminLayout from '../../components/AdminLayout';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardSummary()
      .then((r) => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-pink-200 border-t-violet-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const stats = data ? [
    { label: 'Total Offers', value: data.totalOffers, sub: `${data.activeOffers} active`, gradient: 'from-pink-500 to-rose-500' },
    { label: 'Total Bookings', value: data.totalBookings, sub: `${data.todaysBookings} today`, gradient: 'from-emerald-400 to-teal-500' },
    { label: 'Booked Seats', value: data.bookedSeats, sub: `of ${data.totalCapacity} total`, gradient: 'from-orange-400 to-red-500' },
    { label: 'Conversion Rate', value: `${data.conversionRate}%`, sub: `${data.availableSeats} seats available`, gradient: 'from-blue-400 to-rose-500' },
  ] : [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Overview of your business performance</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} delay={i * 100} />
          ))}
        </div>

        {/* Capacity visual */}
        {data && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-slide-up">
            <h2 className="text-sm font-bold text-gray-700 mb-4">Seat Utilization</h2>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex-1">
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-1000"
                    style={{ width: data.totalCapacity > 0 ? `${(data.bookedSeats / data.totalCapacity) * 100}%` : '0%' }}
                  />
                </div>
              </div>
              <span className="text-sm font-bold text-gray-700 w-12 text-right">{data.conversionRate}%</span>
            </div>
            <div className="flex gap-6 text-xs text-gray-500">
              <span><span className="font-semibold text-pink-600">{data.bookedSeats}</span> booked</span>
              <span><span className="font-semibold text-emerald-600">{data.availableSeats}</span> available</span>
              <span><span className="font-semibold text-gray-700">{data.totalCapacity}</span> total</span>
            </div>
          </div>
        )}

        {/* Recent bookings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-slide-up">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-700">Recent Bookings</h2>
          </div>
          {data?.recentBookings && data.recentBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Reference</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Offer</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Slot</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">People</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.recentBookings.map((b, i) => (
                    <tr key={b.id} className="hover:bg-gray-50/50 transition-colors animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                      <td className="px-5 py-3 font-mono text-xs text-pink-600 font-semibold">{b.bookingReference}</td>
                      <td className="px-5 py-3 font-medium text-gray-900">{b.customerName}</td>
                      <td className="px-5 py-3 text-gray-600 max-w-32 truncate">{b.offerName}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{b.slotTime}</td>
                      <td className="px-5 py-3 text-gray-600">{b.peopleCount}</td>
                      <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-400 text-sm">No bookings yet</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
