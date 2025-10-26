# API Integration Guide

## Overview
The frontend now connects to the GDG-AJCE backend API to fetch leaderboard data in real-time.

## Endpoints Used

### Production API
Base URL: `https://gdg-ajce.onrender.com`

The following endpoints are integrated:

1. **GET /api/leaderboard** - Fetch all leaderboard entries
2. **GET /api/leaderboard/stats** - Fetch leaderboard statistics (participants, total points, avg modules)
3. **GET /api/leaderboard/weekly** - Fetch weekly progress data for charts
4. **GET /api/leaderboard/top?n=3** - Fetch top N performers

## Configuration

### Environment Variables
Create a `.env` file in the root directory (copy from `.env.example`):

```env
VITE_API_BASE_URL=https://gdg-ajce.onrender.com
```

For local development with a local backend:
```env
VITE_API_BASE_URL=http://localhost:4000
```

### API Configuration File
The API endpoints are centrally managed in `src/config/api.js`:

```javascript
import API_ENDPOINTS from '../config/api';

// Usage example:
fetch(API_ENDPOINTS.leaderboard)
fetch(API_ENDPOINTS.stats)
fetch(API_ENDPOINTS.weekly)
fetch(API_ENDPOINTS.top(3))
```

## Data Mapping

The backend returns data in a specific format that is mapped to the frontend's expected structure:

### Backend Response Format
```json
{
  "username": "John Doe",
  "link": "profile-url",
  "profileUrl": "https://...",
  "modules": 10,
  "points": 500,
  "streak": 5,
  "progress": 80,
  "place": 1,
  "verified": true,
  "skillBadges": 3,
  "arcadeGame": 2
}
```

### Frontend Data Structure
```javascript
{
  id: row.link || row.username,
  name: row.username,
  handle: row.link,
  profileUrl: row.profileUrl || row.link,
  modules: row.modules,
  points: row.points,
  streak: row.streak,
  progress: row.progress,
  lastActivity: row.lastActivity,
  verified: row.verified,
  rank: row.place,
  skillBadges: row.skillBadges,
  arcadeGames: row.arcadeGame
}
```

## Testing

### Local Development
1. Ensure the backend is running (if testing locally)
2. Update `.env` with the appropriate API base URL
3. Run the frontend development server:
```bash
npm run dev
```

### Production
The production build automatically uses the production API endpoint specified in `.env`:
```bash
npm run build
```

## Error Handling

The frontend includes error handling for API failures:
- Failed requests are logged to the console
- The application continues to function with empty data
- Individual endpoint failures don't break the entire page

## CORS Considerations

Ensure the backend API has CORS configured to accept requests from your frontend domain:
- Development: `http://localhost:5173` (or your Vite dev server port)
- Production: Your deployed frontend URL

## Future Improvements

1. Add loading states for better UX
2. Implement retry logic for failed requests
3. Add request caching to reduce API calls
4. Implement error toast notifications
5. Add pagination for large datasets
