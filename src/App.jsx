import React from 'react';
import { Users, Trophy, LayoutList, Flame, Calendar, Download } from 'lucide-react';

// Components
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import TopPerformers from './components/TopPerformers';
import WeeklyChart from './components/WeeklyChart';
import SearchInput from './components/SearchInput';
import Dropdown from './components/Dropdown';
import LeaderboardTable from './components/LeaderboardTable';

// Hooks and data
import { useLeaderboard } from './hooks/useLeaderboard';
import { mockLeaderboardData, mockStatsData, mockWeeklyData } from './data/mockData';
import { getTopPerformers, exportToCSV } from './utils/helpers';

const App = () => {
  const {
    data: members,
    filters,
    sortState,
    updateSearch,
    updateWeekFilter,
    updateSort
  } = useLeaderboard(mockLeaderboardData);

  const topPerformers = getTopPerformers(mockLeaderboardData);

  const handleExportCSV = () => {
    exportToCSV(members, 'gdg-study-jam-leaderboard.csv');
  };


  const weekOptions = [
    { value: 'all', label: 'All time' },
    { value: 'w1', label: 'Week 1' },
    { value: 'w2', label: 'Week 2' },
    { value: 'w3', label: 'Week 3' },
    { value: 'w4', label: 'Week 4' }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 antialiased selection:bg-blue-200/60 selection:text-neutral-900">
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
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
        </main>
      </div>
    </div>
  );
};

export default App;
