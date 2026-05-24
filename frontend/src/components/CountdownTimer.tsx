import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endDate: string;
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endDate, className = '' }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(endDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        expired: false,
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endDate]);

  if (timeLeft.expired) {
    return <span className={`text-red-500 font-semibold text-xs ${className}`}>Expired</span>;
  }

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {timeLeft.days > 0 && (
        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-1.5 py-0.5 rounded">
          {timeLeft.days}d
        </span>
      )}
      <span className="bg-orange-100 text-orange-700 text-xs font-bold px-1.5 py-0.5 rounded">
        {pad(timeLeft.hours)}h
      </span>
      <span className="bg-orange-100 text-orange-700 text-xs font-bold px-1.5 py-0.5 rounded">
        {pad(timeLeft.minutes)}m
      </span>
      <span className="bg-orange-100 text-orange-700 text-xs font-bold px-1.5 py-0.5 rounded animate-pulse">
        {pad(timeLeft.seconds)}s
      </span>
    </div>
  );
};

export default CountdownTimer;
