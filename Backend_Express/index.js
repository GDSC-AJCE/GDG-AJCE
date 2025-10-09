const express = require('express');
const cors = require('cors');
const multer = require('multer');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: path.join(__dirname, 'uploads/') });

app.use(cors());
app.use(express.json());

// In-memory storage for parsed leaderboard
let leaderboardData = [];

// Serve stored JSON file if present
const DATA_FILE = path.join(__dirname, 'leaderboard.json');
if (fs.existsSync(DATA_FILE)) {
  try {
    leaderboardData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    console.log('Loaded existing leaderboard.json');
  } catch (err) {
    console.warn('Could not parse leaderboard.json', err.message);
  }
}

// Upload Excel file and parse
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet, { defval: null });

    // Map spreadsheet columns to frontend fields heuristically
    const mapped = json.map((row, idx) => ({
      id: row.id?.toString() || String(idx + 1),
      name: row.name || row.Name || row.full_name || row.FullName || row['Full Name'] || '',
      handle: row.handle || row.Handle || row.username || row.Username || (row.email ? '@' + row.email.split('@')[0] : ''),
      modules: Number(row.modules || row.Modules || row.ModulesCompleted || 0),
      points: Number(row.points || row.Points || row.score || 0),
      streak: Number(row.streak || row.Streak || row.current_streak || 0),
      progress: Number(row.progress || row.Progress || 0),
      lastActivity: row.lastActivity || row['last activity'] || '',
      verified: (row.verified || row.Verified) === true || (String(row.verified || row.Verified).toLowerCase() === 'yes'),
      avatar: row.avatar || row.Avatar || '',
      profileCompleted: row.profileCompleted || row.ProfileCompleted || (row.profile_completed ? 'Yes' : 'No') || 'No',
      redeemed: Number(row.redeemed || row.Redeemed || 0),
      syllabusCompleted: Number(row.syllabusCompleted || row.SyllabusCompleted || row.Syllabus || 0),
      skillBadges: Number(row.skillBadges || row.SkillBadges || row.badges || 0),
      arcadeGames: Number(row.arcadeGames || row.ArcadeGames || row.games_played || 0)
    }));

    leaderboardData = mapped;

    // Save to disk
    fs.writeFileSync(DATA_FILE, JSON.stringify(leaderboardData, null, 2), 'utf8');

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({ success: true, count: leaderboardData.length });
  } catch (err) {
    console.error('Upload parse error:', err);
    return res.status(500).json({ error: 'Failed to parse file' });
  }
});

// Return parsed leaderboard JSON
app.get('/api/leaderboard', (req, res) => {
  res.json(leaderboardData);
});

// Serve static uploaded JSON for debug
app.get('/api/leaderboard.json', (req, res) => {
  if (fs.existsSync(DATA_FILE)) {
    res.sendFile(DATA_FILE);
  } else {
    res.status(404).json({ error: 'No leaderboard.json available' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Express backend listening on http://localhost:${PORT}`));
