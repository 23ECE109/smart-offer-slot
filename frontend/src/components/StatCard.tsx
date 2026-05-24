import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  gradient: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, sub, gradient, delay = 0 }) => {
  return (
    <div
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up overflow-hidden relative"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Decorative blob */}
      <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10 ${gradient}`} />
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-3xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent animate-count-up`}>
        {value}
      </p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
};

export default StatCard;
