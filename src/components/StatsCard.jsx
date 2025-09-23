import React from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { formatNumber } from '../utils/helpers';

const StatsCard = ({ title, value, change, changeType = 'increase', icon: Icon, suffix = '' }) => {
  const isPositive = changeType === 'increase';
  
  return (
    <div className="rounded-lg bg-white border border-neutral-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-neutral-600 truncate">{title}</p>
        {Icon && <Icon className="h-4 w-4 text-neutral-700 flex-shrink-0" />}
      </div>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-xl sm:text-2xl font-semibold tracking-tight">
          {formatNumber(value)}{suffix}
        </span>
        {change !== undefined && (
          <span className={`text-xs inline-flex items-center gap-1 flex-shrink-0 ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <ArrowUpRight className="h-3.5 w-3.5 rotate-180" />
            )}
            {typeof change === 'number' ? (
              change % 1 === 0 ? `+${change}` : `+${change}%`
            ) : change}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatsCard;