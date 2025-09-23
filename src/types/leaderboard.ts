export interface LeaderboardMember {
  id: string;
  name: string;
  handle: string;
  track: 'Android' | 'Web' | 'Cloud' | 'ML';
  modules: number;
  points: number;
  streak: number;
  progress: number; // Percentage (0-100)
  lastActivity: string; // ISO date string or relative time
  verified: boolean;
  avatar: string;
  rank?: number; // Calculated based on sorting
}

export interface StatsData {
  participants: number;
  participantChange: number;
  totalPoints: number;
  pointsChange: number;
  avgModules: number;
  activeStreaks: number;
}

export interface WeeklyData {
  week: string;
  points: number;
}

export interface TopPerformer {
  member: LeaderboardMember;
  position: 1 | 2 | 3;
}

export type SortField = 'points' | 'modules' | 'name' | 'streak';
export type SortDirection = 'asc' | 'desc';
export type WeekFilter = 'all' | 'w1' | 'w2' | 'w3' | 'w4';
export type TrackFilter = 'all' | 'Android' | 'Web' | 'Cloud' | 'ML';

export interface FilterState {
  search: string;
  track: TrackFilter;
  week: WeekFilter;
  verifiedOnly: boolean;
}

export interface SortState {
  field: SortField;
  direction: SortDirection;
}