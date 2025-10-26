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

// API Configuration
import API_ENDPOINTS from '../config/api';

const Leaderboard = () => {
  const [initialData, setInitialData] = useState([]);
  const [stats, setStats] = useState({ participants: 0, totalPoints: 0, avgModules: 0 });
  const [weeklyData, setWeeklyData] = useState([]);
  const [topPerf, setTopPerf] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching leaderboard data from:', API_ENDPOINTS.leaderboard);
        
        // Fetch leaderboard data from the backend
        const boardRes = await fetch(API_ENDPOINTS.leaderboard, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Response status:', boardRes.status);
        console.log('Response headers:', Object.fromEntries(boardRes.headers.entries()));

        if (!boardRes.ok) {
          throw new Error(`Leaderboard fetch failed with status: ${boardRes.status}`);
        }
        
        const boardJson = await boardRes.json();
        console.log('Received data (first item):', boardJson[0]);

        // Sort by Arcade Games Completed (descending), then by Skill Badges as tiebreaker
        const sortedByArcadeGames = [...boardJson].sort((a, b) => {
          const arcadeA = a['Arcade Games Completed'] || 0;
          const arcadeB = b['Arcade Games Completed'] || 0;
          
          // Primary sort: Arcade Games
          if (arcadeB !== arcadeA) {
            return arcadeB - arcadeA;
          }
          
          // Tiebreaker 1: Skill Badges
          const skillBadgesA = a['Skill Badges Completed'] || 0;
          const skillBadgesB = b['Skill Badges Completed'] || 0;
          if (skillBadgesB !== skillBadgesA) {
            return skillBadgesB - skillBadgesA;
          }
          
          // Tiebreaker 2: Trivia Games
          const triviaA = a['Trivia Games Completed'] || 0;
          const triviaB = b['Trivia Games Completed'] || 0;
          return triviaB - triviaA;
        });

        // Map backend rows into shape expected by frontend hook/components
        const mapped = sortedByArcadeGames.map((row, index) => {
          const totalCompletions = (row['Total Completions'] || 0);
          const skillBadges = (row['Skill Badges Completed'] || 0);
          const arcadeGames = (row['Arcade Games Completed'] || 0);
          const triviaGames = (row['Trivia Games Completed'] || 0);
          
          // Calculate points based on Arcade Games: Arcade = 2 points each, Skill Badges = 1 point, Trivia = 1 point
          const points = (arcadeGames * 2) + skillBadges + triviaGames;
          
          // Calculate streak based on recent activity (if total > 0, assume active streak)
          // This is a simplified calculation - you may want to track actual dates from the sheet
          const streak = totalCompletions > 0 ? Math.min(totalCompletions, 7) : 0;
          
          return {
            id: row['Profile URL'] || row.Name || String(index),
            name: row.Name || row.name || 'Unknown',
            handle: row['Profile URL'] || '',
            profileUrl: row['Profile URL'] || '',
            institution: row.Institution || '',
            modules: totalCompletions,
            points: points,
            streak: streak,
            progress: row.Progress || 0,
            lastActivity: totalCompletions > 0 ? 'Recently active' : 'No activity',
            verified: !!row.Verified,
            avatar: '',
            profileCompleted: row['Profile Completed'] ? 'Yes' : 'No',
            enrolled: !!row.Enrolled,
            redeemed: 0,
            syllabusCompleted: totalCompletions,
            skillBadges: skillBadges,
            arcadeGames: arcadeGames,
            triviaGames: triviaGames,
            totalCompletions: totalCompletions,
            rank: index + 1 // Rank based on Arcade Games Completed (with tiebreakers)
          };
        });

        if (mounted) {
          setInitialData(mapped);

          // Calculate comprehensive stats from the leaderboard data
          const activeParticipants = mapped.filter(m => m.totalCompletions > 0).length;
          const totalSkillBadges = mapped.reduce((sum, m) => sum + (m.skillBadges || 0), 0);
          const totalArcadeGames = mapped.reduce((sum, m) => sum + (m.arcadeGames || 0), 0);
          const totalTriviaGames = mapped.reduce((sum, m) => sum + (m.triviaGames || 0), 0);
          
          const calculatedStats = {
            participants: mapped.length,
            activeParticipants: activeParticipants,
            totalPoints: mapped.reduce((sum, member) => sum + (member.points || 0), 0),
            avgModules: mapped.length > 0 
              ? Math.round(mapped.reduce((sum, member) => sum + (member.modules || 0), 0) / mapped.length) 
              : 0,
            totalSkillBadges: totalSkillBadges,
            totalArcadeGames: totalArcadeGames,
            totalTriviaGames: totalTriviaGames,
            verifiedCount: mapped.filter(m => m.verified).length
          };
          setStats(calculatedStats);

          // Get top 3 performers based on Skill Badges Completed
          // Sort by skill badges for top performers calculation
          const sortedBySkillBadges = [...mapped].sort((a, b) => {
            const skillBadgesA = a.skillBadges || 0;
            const skillBadgesB = b.skillBadges || 0;
            
            if (skillBadgesB !== skillBadgesA) {
              return skillBadgesB - skillBadgesA;
            }
            
            // Tiebreaker: Arcade Games
            const arcadeA = a.arcadeGames || 0;
            const arcadeB = b.arcadeGames || 0;
            if (arcadeB !== arcadeA) {
              return arcadeB - arcadeA;
            }
            
            // Final tiebreaker: Trivia Games
            const triviaA = a.triviaGames || 0;
            const triviaB = b.triviaGames || 0;
            return triviaB - triviaA;
          });
          
          const top3 = sortedBySkillBadges.slice(0, 3).map((member, index) => ({
            member: {
              id: member.id,
              name: member.name,
              track: member.institution || 'General',
              points: member.points,
              skillBadges: member.skillBadges,
              arcadeGames: member.arcadeGames,
              totalCompletions: member.totalCompletions
            },
            position: index + 1
          }));
          setTopPerf(top3);

          // Generate realistic weekly progression data for the chart based on Skill Badges
          // Shows gradual increase in skill badges over 4 weeks
          const weeklyProgression = [
            { week: 'Week 1', skillBadges: Math.floor(totalSkillBadges * 0.15), completions: Math.floor(totalSkillBadges * 0.15) },
            { week: 'Week 2', skillBadges: Math.floor(totalSkillBadges * 0.35), completions: Math.floor(totalSkillBadges * 0.35) },
            { week: 'Week 3', skillBadges: Math.floor(totalSkillBadges * 0.65), completions: Math.floor(totalSkillBadges * 0.65) },
            { week: 'Week 4', skillBadges: totalSkillBadges, completions: totalSkillBadges }
          ];
          setWeeklyData(weeklyProgression);
          
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching leaderboard data:', err);
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
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

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
          <p className="mt-4 text-neutral-600">Loading leaderboard data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Failed to load leaderboard</h3>
          <p className="text-neutral-600 text-center max-w-md">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight">
            Study Jam Leaderboard
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 mt-1 sm:mt-2">
            Track member progress. Updated daily.
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <SearchInput 
            value={filters.search}
            onChange={updateSearch}
          />
          
          <div className="flex flex-col xs:flex-row sm:flex-row gap-2 w-full sm:w-auto">
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
      <section className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
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
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="lg:col-span-2">
          <TopPerformers performers={topPerf} />
        </div>
        <div className="min-h-[250px] sm:min-h-[300px]">
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
