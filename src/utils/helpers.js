import clsx from 'clsx';

/**
 * Utility function for conditional class names
 */
export const cn = (...inputs) => {
  return clsx(inputs);
};

/**
 * Format numbers with commas
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num);
};

/**
 * Filter members based on search criteria
 */
export const filterMembers = (members, filters) => {
  return members.filter(member => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase().trim();
      if (!searchTerm) return true; // Empty search shows all
      
      const name = (member.name || '').toLowerCase();
      const handle = (member.handle || '').toLowerCase();
      
      // Quick check: if both are empty, don't match
      if (!name && !handle) return false;
      
      const matchesName = name.includes(searchTerm);
      const matchesHandle = handle.includes(searchTerm);
      
      if (!matchesName && !matchesHandle) return false;
    }

    // Track filter
    if (filters.track !== 'all' && member.track !== filters.track) {
      return false;
    }

    // Verified filter
    if (filters.verifiedOnly && !member.verified) {
      return false;
    }

    return true;
  });
};

/**
 * Sort members by specified field and direction
 */
export const sortMembers = (members, sortField, direction = 'desc') => {
  return [...members].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle string sorting (names)
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (direction === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });
};

/**
 * Assign ranks to members based on skill badges completed (with tiebreakers)
 * Ranks are determined by:
 * 1. Skill Badges Completed (primary)
 * 2. Arcade Games Completed (tiebreaker 1)
 * 3. Trivia Games Completed (tiebreaker 2)
 * This ensures ranks stay consistent regardless of how the table is sorted
 */
export const assignRanks = (members) => {
  // Create a copy and sort by skill badges to determine true ranks
  const sortedBySkillBadges = [...members].sort((a, b) => {
    const skillBadgesA = a.skillBadges || 0;
    const skillBadgesB = b.skillBadges || 0;
    
    // Primary sort: Skill Badges
    if (skillBadgesB !== skillBadgesA) {
      return skillBadgesB - skillBadgesA;
    }
    
    // Tiebreaker 1: Arcade Games
    const arcadeA = a.arcadeGames || 0;
    const arcadeB = b.arcadeGames || 0;
    if (arcadeB !== arcadeA) {
      return arcadeB - arcadeA;
    }
    
    // Tiebreaker 2: Trivia Games
    const triviaA = a.triviaGames || 0;
    const triviaB = b.triviaGames || 0;
    return triviaB - triviaA;
  });
  
  // Create a map of member ID to rank based on skill badge sorting
  const rankMap = new Map();
  sortedBySkillBadges.forEach((member, index) => {
    rankMap.set(member.id, index + 1);
  });
  
  // Apply the correct ranks to the original array (preserving current sort order)
  return members.map(member => ({
    ...member,
    rank: rankMap.get(member.id) || 999 // Fallback rank for members without ID
  }));
};

/**
 * Get top 3 performers
 */
export const getTopPerformers = (members) => {
  const sorted = sortMembers(members, 'points', 'desc');
  return sorted.slice(0, 3).map((member, index) => ({
    member,
    position: index + 1
  }));
};

/**
 * Export data to CSV
 */
export const exportToCSV = (members, filename = 'gdg-study-jam-leaderboard.csv') => {
  const headers = ['Rank', 'Name', 'Handle', 'Profile Completed', 'Streak', 'Syllabus Completed', 'Skill Badges', 'Arcade Games', 'Verified'];
  
  const csvContent = [
    headers.join(','),
    ...members.map((member, index) => {
      const rank = index + 1;
      const verified = member.verified ? 'Yes' : 'No';
      const streak = `${member.streak}d`;
      
      return [
        rank,
        `"${member.name}"`,
        `"${member.handle}"`,
        `"${member.profileCompleted}"`,
        streak,
        member.syllabusCompleted,
        member.skillBadges,
        member.arcadeGames,
        verified
      ].join(',');
    })
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Debounce function for search input
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};