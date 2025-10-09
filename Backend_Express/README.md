Express backend for GDG AJCE — accepts Excel uploads and exposes parsed leaderboard JSON at /api/leaderboard

Endpoints:
- POST /upload  -> multipart form-data with field `file` (Excel). Parses and stores to leaderboard.json
- GET /api/leaderboard -> returns parsed JSON array
- GET /api/leaderboard.json -> returns raw stored file

Start:
1. cd Backend_Express
2. npm install
3. npm run dev  (nodemon) or npm start


API response changes:

- GET /api/leaderboard now returns rows normalized to the following fields:

  - place (computed rank based on skillBadges desc)
  - username
  - link (profile link/handle)
  - streak
  - syllabusCompleted
  - skillBadges
  - arcadeGame
