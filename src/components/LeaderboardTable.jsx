import React from 'react';
import { ChevronsUpDown, Info, ExternalLink, Trophy, Gamepad2, Flame } from 'lucide-react';

const LeaderboardTable = ({ 
  members, 
  sortState, 
  onSort
}) => {
  const getSortIcon = (field) => {
    if (sortState.field !== field) {
      return <ChevronsUpDown className="h-3.5 w-3.5" />;
    }
    return <ChevronsUpDown className="h-3.5 w-3.5" />;
  };

  const getRankBadgeClasses = (rank) => {
    if (rank === 1) {
      return 'inline-flex h-6 w-6 items-center justify-center rounded-md bg-neutral-900 text-white text-xs font-medium';
    } else if (rank === 2) {
      return 'inline-flex h-6 w-6 items-center justify-center rounded-md bg-neutral-700 text-white text-xs font-medium';
    } else if (rank === 3) {
      return 'inline-flex h-6 w-6 items-center justify-center rounded-md bg-neutral-600 text-white text-xs font-medium';
    }
    return 'inline-flex h-6 w-6 items-center justify-center rounded-md bg-neutral-200 text-neutral-900 text-xs font-medium';
  };

  const getProfileIcon = (handle) => {
    return (
      <a 
        href={`/profile/${handle.replace('@', '')}`} 
        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-neutral-200 hover:bg-neutral-300 transition-all duration-200 group"
        title={`View ${handle}'s profile`}
      >
        <ExternalLink className="h-4 w-4 text-neutral-700 group-hover:text-neutral-900" />
      </a>
    );
  };

  return (
    <section className="rounded-lg bg-white border border-neutral-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
        <h3 className="text-base font-semibold tracking-tight">Leaderboard</h3>
        <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500">
          <Info className="h-3.5 w-3.5" />
          Click headers to sort
        </div>
      </div>
      
      {/* Mobile Card View */}
      <div className="block lg:hidden">
        {members.map((member) => (
          <div key={member.id} className="p-4 border-b border-neutral-200 last:border-b-0">
            <div className="flex items-center gap-3 mb-4">
              <span className={getRankBadgeClasses(member.rank)}>
                {member.rank}
              </span>
              <div className="flex-1 min-w-0">
                <a 
                  href={`/profile/${member.handle.replace('@', '')}`} 
                  className="font-medium text-sm truncate text-neutral-900 hover:text-neutral-700 hover:underline"
                >
                  {member.name}
                </a>
                <div className="text-xs text-neutral-500 truncate">{member.handle}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-neutral-500 mb-1">Profile</div>
                {getProfileIcon(member.handle)}
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1">Streak</div>
                <div className="flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5 text-orange-500" />
                  <span className="font-medium">{member.streak}d</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1">Syllabus Completed</div>
                <div className="font-medium">{member.syllabusCompleted}</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1">Skill Badges</div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-3.5 w-3.5 text-neutral-900" />
                  <span className="font-medium">{member.skillBadges}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1">Arcade Games</div>
                <div className="flex items-center gap-1">
                  <Gamepad2 className="h-3.5 w-3.5 text-neutral-700" />
                  <span className="font-medium">{member.arcadeGames}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-900">
            <tr className="border-b border-neutral-200">
              <th className="px-4 py-3 text-left font-semibold">Rank</th>
              <th className="px-4 py-3 text-left font-semibold">User Name</th>
              <th className="px-4 py-3 text-left font-semibold">Profile</th>
              <th 
                className="px-4 py-3 text-left font-semibold cursor-pointer select-none hover:text-neutral-900 transition-colors"
                onClick={() => onSort('streak')}
              >
                <div className="inline-flex items-center gap-1">
                  <Flame className="h-4 w-4 text-orange-500" />
                  Streak
                  {getSortIcon('streak')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left font-semibold cursor-pointer select-none hover:text-neutral-900 transition-colors"
                onClick={() => onSort('syllabusCompleted')}
              >
                <div className="inline-flex items-center gap-1">
                  Syllabus Completed
                  {getSortIcon('syllabusCompleted')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left font-semibold cursor-pointer select-none hover:text-neutral-900 transition-colors"
                onClick={() => onSort('skillBadges')}
              >
                <div className="inline-flex items-center gap-1">
                  Skill Badges
                  {getSortIcon('skillBadges')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left font-semibold cursor-pointer select-none hover:text-neutral-900 transition-colors"
                onClick={() => onSort('arcadeGames')}
              >
                <div className="inline-flex items-center gap-1">
                  Arcade Games
                  {getSortIcon('arcadeGames')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {members.map((member) => (
              <tr 
                key={member.id} 
                className="hover:bg-gradient-to-r hover:from-neutral-50 hover:to-neutral-100 transition-all duration-200"
              >
                <td className="px-4 py-4">
                  <span className={getRankBadgeClasses(member.rank)}>
                    {member.rank}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="min-w-0">
                    <a 
                      href={`/profile/${member.handle.replace('@', '')}`} 
                      className="font-semibold text-neutral-900 hover:text-neutral-700 hover:underline truncate block"
                    >
                      {member.name}
                    </a>
                    <div className="text-xs text-neutral-500 truncate">{member.handle}</div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {getProfileIcon(member.handle)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="font-semibold text-neutral-900">{member.streak}d</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900">{member.syllabusCompleted}</span>
                    <div className="flex-1 max-w-[60px] h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-neutral-700 to-neutral-900 rounded-full" 
                        style={{ width: `${Math.min((member.syllabusCompleted / 10) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-neutral-900" />
                    <span className="font-semibold text-neutral-900">{member.skillBadges}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4 text-neutral-700" />
                    <span className="font-semibold text-neutral-900">{member.arcadeGames}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {members.length === 0 && (
        <div className="px-4 py-8 text-center text-neutral-500">
          No members found matching your criteria.
        </div>
      )}
    </section>
  );
};

export default LeaderboardTable;