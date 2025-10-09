import express from 'express';
import cors from 'cors';
import LeaderBoard from './LeaderBoard';
// import dotenv from 'dotenv';

const app = express();
app.use(cors());

app.get('/api/leaderboard', (req, res) => {
  try {
    const { search, track, week, verifiedOnly, sortField, sortDir, limit } = req.query;
    const options = {
      search,
      track,
      week,
      verifiedOnly: verifiedOnly === 'true' || verifiedOnly === '1',
      sortField: sortField || 'skillBadges',
      sortDir: sortDir || 'desc',
      limit: limit ? Number(limit) : undefined
    };
    const rows = LeaderBoard.getLeaderboard(options);
    return res.json(rows);
  } catch (err) {
    console.error('Error serving /api/leaderboard:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/leaderboard/stats', (req, res) => {
  try {
    const rows = LeaderBoard.getLeaderboard({});
    const stats = LeaderBoard.computeStats(rows);
    return res.json(stats);
  } catch (err) {
    console.error('Error serving /api/leaderboard/stats:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/leaderboard/top', (req, res) => {
  try {
    const n = Number(req.query.n) || 3;
    return res.json(LeaderBoard.topPerformers(n));
  } catch (err) {
    console.error('Error serving /api/leaderboard/top:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/leaderboard/weekly', (req, res) => {
  try {
    return res.json(LeaderBoard.weeklyData());
  } catch (err) {
    console.error('Error serving /api/leaderboard/weekly:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/leaderboard/csv', (req, res) => {
  try {
    const rows = LeaderBoard.getLeaderboard({});
    const csv = LeaderBoard.exportCSV(rows);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leaderboard.csv"');
    return res.send(csv);
  } catch (err) {
    console.error('Error serving /api/leaderboard/csv:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = (typeof process !== 'undefined' && process?.env?.PORT) || 4000;
app.listen(PORT, () => console.log(`Express backend listening on http://localhost:${PORT}`));
