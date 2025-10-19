import React from 'react';
import { Crown, Medal, Award } from 'lucide-react';
import { formatNumber } from '../utils/helpers';

const TopPerformers = ({ performers }) => {
  const getPositionIcon = (position) => {
    switch (position) {
      case 1:
        return <Crown className="h-3.5 w-3.5" />;
      case 2:
        return <Medal className="h-3.5 w-3.5" />;
      case 3:
        return <Award className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };

  const getPositionText = (position) => {
    switch (position) {
      case 1:
        return '1st';
      case 2:
        return '2nd';
      case 3:
        return '3rd';
      default:
        return `${position}th`;
    }
  };

  const getCardClasses = (position) => {
    if (position === 1) {
      return 'rounded-md border-2 border-neutral-900 bg-neutral-900 text-white p-4 flex flex-col items-center text-center shadow-sm';
    }
    return 'rounded-md border border-neutral-200 bg-white p-4 flex flex-col items-center text-center hover:border-neutral-300 transition-colors';
  };

  const getAvatarClasses = (position) => {
    const baseClasses = 'rounded-full flex items-center justify-center mt-2 ring-2';
    if (position === 1) {
      return `${baseClasses} h-16 w-16 ring-amber-300 bg-amber-50`;
    }
    return `${baseClasses} h-14 w-14 ring-blue-200 bg-blue-50`;
  };

  const getIconColor = (position) => {
    switch (position) {
      case 1:
        return 'text-amber-300';
      case 2:
      case 3:
        return 'text-neutral-600';
      default:
        return 'text-neutral-600';
    }
  };

  const getRankIconSize = (position) => {
    if (position === 1) {
      return 'h-8 w-8';
    }
    return 'h-6 w-6';
  };

  const getRankIconColor = (position) => {
    switch (position) {
      case 1:
        return 'text-amber-500';
      case 2:
        return 'text-gray-500';
      case 3:
        return 'text-amber-600';
      default:
        return 'text-gray-400';
    }
  };

  // For desktop: reorder to show 2nd, 1st, 3rd for podium effect
  // For mobile: show 1st, 2nd, 3rd in order
  const podiumOrderPerformers = performers.length >= 3 
    ? [performers[1], performers[0], performers[2]]
    : performers;

  return (
    <div className="rounded-lg bg-white border border-neutral-200 p-3 sm:p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-semibold tracking-tight">Top Performers</h2>
        <span className="text-xs text-neutral-500">All time</span>
      </div>
      
      {/* Mobile View - Sequential Order (1st, 2nd, 3rd) */}
      <div className="mt-3 sm:mt-4 grid grid-cols-1 gap-3 sm:hidden">
        {performers.map(({ member, position }) => (
          <div key={member.id} className={getCardClasses(position)}>
            <div className={`flex items-center gap-1 text-xs ${getIconColor(position)}`}>
              {getPositionIcon(position)}
              {getPositionText(position)}
            </div>
            <div className={getAvatarClasses(position)}>
              <div className={getRankIconColor(position)}>
                {React.cloneElement(getPositionIcon(position), { 
                  className: getRankIconSize(position) 
                })}
              </div>
            </div>
            <div className="mt-2 text-sm font-medium truncate w-full px-2">{member.name}</div>
            <div className={`text-xs truncate w-full px-2 ${position === 1 ? 'text-neutral-200' : 'text-neutral-500'}`}>
              {member.track} • {formatNumber(member.points)} pts
            </div>
          </div>
        ))}
      </div>
      
      {/* Desktop View - Podium Order (2nd, 1st, 3rd) */}
      <div className="mt-3 sm:mt-4 hidden sm:grid sm:grid-cols-3 gap-3 sm:gap-4">
        {podiumOrderPerformers.map(({ member, position }) => (
          <div key={member.id} className={getCardClasses(position)}>
            <div className={`flex items-center gap-1 text-xs ${getIconColor(position)}`}>
              {getPositionIcon(position)}
              {getPositionText(position)}
            </div>
            <div className={getAvatarClasses(position)}>
              <div className={getRankIconColor(position)}>
                {React.cloneElement(getPositionIcon(position), { 
                  className: getRankIconSize(position) 
                })}
              </div>
            </div>
            <div className="mt-2 text-sm font-medium truncate">{member.name}</div>
            <div className={`text-xs truncate ${position === 1 ? 'text-neutral-200' : 'text-neutral-500'}`}>
              {member.track} • {formatNumber(member.points)} pts
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPerformers;