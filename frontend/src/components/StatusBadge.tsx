import React from 'react';

const colorMap: Record<string, string> = {
  Active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Draft: 'bg-gray-100 text-gray-600 border-gray-200',
  Paused: 'bg-amber-100 text-amber-700 border-amber-200',
  Expired: 'bg-red-100 text-red-600 border-red-200',
  Cancelled: 'bg-red-100 text-red-700 border-red-200',
  Available: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Full: 'bg-orange-100 text-orange-700 border-orange-200',
  Closed: 'bg-gray-100 text-gray-600 border-gray-200',
  Pending: 'bg-amber-100 text-amber-700 border-amber-200',
  Confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Completed: 'bg-blue-100 text-blue-700 border-blue-200',
  NoShow: 'bg-red-100 text-red-600 border-red-200',
};

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const cls = colorMap[status] || 'bg-gray-100 text-gray-600 border-gray-200';
  return (
    <span
      className={`inline-flex items-center border font-semibold rounded-full ${
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
      } ${cls}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
