const express = require('express');
const cors = require('cors');
const LeaderBoard = require('./LeaderBoard');

const app = express();
app.use(cors());

app.get('/api/leaderboard', (req, res) => {
  try {
    const rows = LeaderBoard.readDataFile();
    if (!rows) return res.status(404).json({ error: 'No data file found' });
    const ranked = LeaderBoard.rankBySkill(rows);
    return res.json(ranked);
  } catch (err) {
    console.error('Error serving /api/leaderboard:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Express backend listening on http://localhost:${PORT}`));
