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
      const searchTerm = filters.search.toLowerCase();
      const matchesName = member.name.toLowerCase().includes(searchTerm);
      const matchesHandle = member.handle.toLowerCase().includes(searchTerm);
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
 * Assign ranks to members based on their position in sorted array
 */
export const assignRanks = (members) => {
  return members.map((member, index) => ({
    ...member,
    rank: index + 1
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