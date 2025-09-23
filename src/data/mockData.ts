import { LeaderboardMember } from '../types/leaderboard';

/**
 * Mock data for the leaderboard
 * In a real application, this would come from an API
 */
export const mockLeaderboardData: LeaderboardMember[] = [
  {
    id: '1',
    name: 'Taylor Reed',
    handle: '@taylor',
    track: 'Android',
    modules: 12,
    points: 2320,
    streak: 9,
    progress: 85,
    lastActivity: '2h ago',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Alex Kim',
    handle: '@alex',
    track: 'Web',
    modules: 11,
    points: 2140,
    streak: 7,
    progress: 78,
    lastActivity: '5h ago',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Jordan Lee',
    handle: '@jordan',
    track: 'Cloud',
    modules: 10,
    points: 2115,
    streak: 12,
    progress: 70,
    lastActivity: '1d ago',
    verified: false,
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'Sam Wilson',
    handle: '@samw',
    track: 'ML',
    modules: 9,
    points: 1890,
    streak: 5,
    progress: 65,
    lastActivity: '3h ago',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: '5',
    name: 'Maya Patel',
    handle: '@maya',
    track: 'Web',
    modules: 8,
    points: 1750,
    streak: 3,
    progress: 60,
    lastActivity: '6h ago',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: '6',
    name: 'Chris Martinez',
    handle: '@chris',
    track: 'Android',
    modules: 7,
    points: 1620,
    streak: 0,
    progress: 55,
    lastActivity: '1w ago',
    verified: false,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: '7',
    name: 'Zoe Chen',
    handle: '@zoe',
    track: 'Cloud',
    modules: 6,
    points: 1480,
    streak: 2,
    progress: 50,
    lastActivity: '2d ago',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: '8',
    name: 'Riley Johnson',
    handle: '@riley',
    track: 'ML',
    modules: 5,
    points: 1250,
    streak: 1,
    progress: 42,
    lastActivity: '4h ago',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
  }
];

export const mockStatsData = {
  participants: 124,
  participantChange: 8,
  totalPoints: 18420,
  pointsChange: 4.2,
  avgModules: 7.8,
  activeStreaks: 36
};

export const mockWeeklyData = [
  { week: 'Wk 1', points: 2400 },
  { week: 'Wk 2', points: 2750 },
  { week: 'Wk 3', points: 3100 },
  { week: 'Wk 4', points: 2950 },
  { week: 'Wk 5', points: 3320 },
  { week: 'Wk 6', points: 3610 }
];

export const TRACK_COLORS = {
  Android: '#4CAF50',
  Web: '#2196F3', 
  Cloud: '#FF9800',
  ML: '#9C27B0'
} as const;