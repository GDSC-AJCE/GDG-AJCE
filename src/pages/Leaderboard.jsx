import React, { useEffect, useState } from 'react';
import { Users, Trophy, LayoutList, Flame, Calendar, Download } from 'lucide-react';

// Components
import StatsCard from '../components/StatsCard';
import TopPerformers from '../components/TopPerformers';
import WeeklyChart from '../components/WeeklyChart';
import SearchInput from '../components/SearchInput';
import Dropdown from '../components/Dropdown';
import LeaderboardTable from '../components/LeaderboardTable';

// Hooks and data
import { useLeaderboard } from '../hooks/useLeaderboard';
import { mockLeaderboardData, mockStatsData, mockWeeklyData } from '../data/mockData';
import { getTopPerformers } from '../utils/helpers';

const Leaderboard = () => {
  const [initialData, setInitialData] = useState(mockLeaderboardData);

  // Fetch leaderboard from express backend if available
  useEffect(() => {
    let mounted = true;
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/leaderboard');
        if (!res.ok) throw new Error('Not found');
        const json = await res.json();
        if (mounted && Array.isArray(json) && json.length > 0) {
          setInitialData(json);
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err.message);
        // fallback to mock data (already set)
        // console.info('Using mock leaderboard data:', err.message);
      }
    };
    fetchLeaderboard();
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

  const topPerformers = getTopPerformers(initialData);



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
          value={mockStatsData.participants}
          change={mockStatsData.participantChange}
          icon={Users}
        />
        <StatsCard
          title="Total Points"
          value={mockStatsData.totalPoints}
          change={mockStatsData.pointsChange}
          changeType="increase"
          icon={Trophy}
          suffix=""
        />
        <StatsCard
          title="Avg. Modules"
          value={mockStatsData.avgModules}
          icon={LayoutList}
          suffix=" per member"
        />
      </section>

      {/* Top 3 + Chart */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2">
          <TopPerformers performers={topPerformers} />
        </div>
        <div className="min-h-[300px]">
          <WeeklyChart data={mockWeeklyData} />
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
