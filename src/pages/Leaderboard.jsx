import React, { useEffect, useState } from 'react';
import { Users, Trophy, LayoutList, Flame, Calendar, Download } from 'lucide-react';

// Components
import StatsCard from '../components/StatsCard';
import TopPerformers from '../components/TopPerformers';
import WeeklyChart from '../components/WeeklyChart';
import SearchInput from '../components/SearchInput';
import Dropdown from '../components/Dropdown';
import LeaderboardTable from '../components/LeaderboardTable';

// Hooks
import { useLeaderboard } from '../hooks/useLeaderboard';

const Leaderboard = () => {
  const [initialData, setInitialData] = useState([]);
  const [stats, setStats] = useState({ participants: 0, totalPoints: 0, avgModules: 0 });
  const [weeklyData, setWeeklyData] = useState([]);
  const [topPerf, setTopPerf] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      try {
        const [boardRes, statsRes, weeklyRes, topRes] = await Promise.all([
          fetch('http://localhost:4000/api/leaderboard'),
          fetch('http://localhost:4000/api/leaderboard/stats'),
          fetch('http://localhost:4000/api/leaderboard/weekly'),
          fetch('http://localhost:4000/api/leaderboard/top?n=3')
        ]);

        if (!boardRes.ok) throw new Error('Leaderboard fetch failed');
        const boardJson = await boardRes.json();

        // Map backend rows into shape expected by frontend hook/components
        const mapped = boardJson.map(row => ({
          id: row.link || row.username || String(row.place || Math.random()),
          name: row.username || row.name || '',
          handle: row.link || row.handle || '',
          modules: row.modules || 0,
          points: row.points || 0,
          streak: row.streak || 0,
          progress: row.progress || 0,
          lastActivity: row.lastActivity || '',
          verified: !!row.verified,
          avatar: row.avatar || '',
          profileCompleted: row.profileCompleted || 'No',
          redeemed: row.redeemed || 0,
          syllabusCompleted: row.syllabusCompleted || row.syllabusCompleted || 0,
          skillBadges: row.skillBadges || 0,
          arcadeGames: row.arcadeGame || row.arcadeGames || 0,
          rank: row.place || null
        }));

        if (mounted) {
          setInitialData(mapped);
        }

        if (statsRes.ok) {
          const statsJson = await statsRes.json();
          if (mounted) setStats(statsJson);
        }

        if (weeklyRes.ok) {
          const weeklyJson = await weeklyRes.json();
          if (mounted) setWeeklyData(weeklyJson);
        }

        if (topRes.ok) {
          const topJson = await topRes.json();
          // Map backend top rows to the { member, position } shape expected by TopPerformers
          const mappedTop = topJson.map(r => ({ member: { id: r.link || r.username, name: r.username || r.name || '', track: r.track || '', points: r.points || 0 }, position: r.place }));
          if (mounted) setTopPerf(mappedTop);
        }
      } catch (err) {
        console.error('Error fetching leaderboard data:', err.message);
      }
    };

    fetchAll();
    return () => { mounted = false; };
  }, []);

  const {
    data: members,
    filters,
    sortState,
    updateSearch,
    updateWeekFilter,
    updateSort
  } = useLeaderboard(initialData);



  const weekOptions = [
    { value: 'all', label: 'All time' },
    { value: 'w1', label: 'Week 1' },
    { value: 'w2', label: 'Week 2' },
    { value: 'w3', label: 'Week 3' },
    { value: 'w4', label: 'Week 4' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
            Study Jam Leaderboard
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Track member progress. Updated daily.
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <SearchInput 
            value={filters.search}
            onChange={updateSearch}
          />
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Dropdown
              label={weekOptions.find(opt => opt.value === filters.week)?.label}
              value={filters.week}
              options={weekOptions}
              onChange={updateWeekFilter}
              icon={Calendar}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatsCard
          title="Participants"
          value={stats.participants}
          icon={Users}
        />
        <StatsCard
          title="Total Points"
          value={stats.totalPoints}
          changeType="increase"
          icon={Trophy}
          suffix=""
        />
        <StatsCard
          title="Avg. Modules"
          value={stats.avgModules}
          icon={LayoutList}
          suffix=" per member"
        />
      </section>

      {/* Top 3 + Chart */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2">
          <TopPerformers performers={topPerf} />
        </div>
        <div className="min-h-[300px]">
          <WeeklyChart data={weeklyData} />
        </div>
      </section>

      {/* Leaderboard Table */}
      <LeaderboardTable 
        members={members}
        sortState={sortState}
        onSort={updateSort}
      />
    </div>
  );
};

export default Leaderboard;
