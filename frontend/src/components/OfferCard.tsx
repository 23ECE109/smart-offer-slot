import React from 'react';
import { Link } from 'react-router-dom';
import type { Offer } from '../types';
import CountdownTimer from './CountdownTimer';
import StatusBadge from './StatusBadge';

interface OfferCardProps {
  offer: Offer;
  index?: number;
}

const categoryColors: Record<string, string> = {
  Fitness: 'from-pink-500 to-rose-500',
  Food: 'from-orange-400 to-red-500',
  Beauty: 'from-pink-400 to-rose-500',
  Health: 'from-emerald-400 to-teal-500',
  Sports: 'from-blue-400 to-rose-500',
  Education: 'from-amber-400 to-orange-500',
  Entertainment: 'from-cyan-400 to-blue-500',
  Other: 'from-gray-400 to-slate-500',
};

const OfferCard: React.FC<OfferCardProps> = ({ offer, index = 0 }) => {
  const gradient = categoryColors[offer.category] || 'from-pink-500 to-rose-500';

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group animate-slide-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Top gradient bar */}
      <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              {offer.businessName} · {offer.businessCity}
            </p>
            <h3 className="font-bold text-gray-900 text-base leading-tight truncate group-hover:text-pink-700 transition-colors">
              {offer.title}
            </h3>
          </div>
          <span className={`ml-2 text-xs font-bold px-2 py-1 rounded-lg bg-gradient-to-r ${gradient} text-white flex-shrink-0`}>
            {offer.discountPercentage}% OFF
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{offer.description}</p>

        {/* Price */}
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-2xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            ₹{offer.offerPrice}
          </span>
          <span className="text-sm text-gray-400 line-through">₹{offer.originalPrice}</span>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
              {offer.category}
            </span>
            <StatusBadge status={offer.status} />
          </div>
          <span className="text-xs text-gray-500">
            {offer.availableSlots} slot{offer.availableSlots !== 1 ? 's' : ''} left
          </span>
        </div>

        {/* Countdown */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-gray-400">Expires in:</span>
          <CountdownTimer endDate={offer.endDate} />
        </div>

        {/* Availability bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Availability</span>
            <span>{offer.availableSlots}/{offer.totalSlots} slots</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500`}
              style={{ width: offer.totalSlots > 0 ? `${(offer.availableSlots / offer.totalSlots) * 100}%` : '0%' }}
            />
          </div>
        </div>

        {/* CTA */}
        <Link
          to={`/offers/${offer.id}`}
          className={`block w-full text-center py-2.5 rounded-xl bg-gradient-to-r ${gradient} text-white text-sm font-bold hover:opacity-90 transition-opacity`}
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default OfferCard;
