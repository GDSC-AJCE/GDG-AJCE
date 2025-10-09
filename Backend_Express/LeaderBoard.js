const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const CSV_FILE = path.join(DATA_DIR, 'leaderboard.csv');
const XLSX_FILE = path.join(DATA_DIR, 'leaderboard.xlsx');

function normalizeRows(rows) {
  return rows.map(r => ({
    username: r.name || r.username || r.Username || r.user || '',
    link: r.handle || r.link || r.profile || '',
    streak: Number(r.streak || r.Streak || 0),
    syllabusCompleted: Number(r.syllabusCompleted || r.SyllabusCompleted || r.syllabus || r.Syllabus || 0),
    skillBadges: Number(r.skillBadges || r.SkillBadges || r.badges || 0),
    arcadeGame: Number(r.arcadeGames || r.ArcadeGames || r.arcade || r.arcadeGame || 0)
  }));
}

function rankBySkill(rows) {
  const normalized = normalizeRows(rows);
  const ranked = normalized.sort((a, b) => b.skillBadges - a.skillBadges).map((r, idx) => ({ place: idx + 1, ...r }));
  return ranked;
}

function readDataFile() {
  if (fs.existsSync(XLSX_FILE)) {
    const workbook = XLSX.readFile(XLSX_FILE);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet, { defval: null });
  }

  if (fs.existsSync(CSV_FILE)) {
    const workbook = XLSX.readFile(CSV_FILE, { type: 'file' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet, { defval: null });
  }

  return null;
}

module.exports = {
  readDataFile,
  rankBySkill
};
