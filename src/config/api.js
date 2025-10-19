/**
 * API Configuration
 * Centralized configuration for API endpoints
 */

// Determine the API base URL based on environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://gdg-ajce.onrender.com';

export const API_ENDPOINTS = {
  leaderboard: `${API_BASE_URL}/api/leaderboard`,
  stats: `${API_BASE_URL}/api/leaderboard/stats`,
  weekly: `${API_BASE_URL}/api/leaderboard/weekly`,
  top: (n = 3) => `${API_BASE_URL}/api/leaderboard/top?n=${n}`,
};

export default API_ENDPOINTS;
