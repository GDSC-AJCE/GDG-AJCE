import pkg from 'xlsx';
const { readFile, utils } = pkg;
import { existsSync } from 'fs';
import { join } from 'path';

import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DATA_DIR = join(__dirname, 'data');
const CSV_FILE = join(DATA_DIR, 'leaderboard.csv');
const XLSX_FILE = join(DATA_DIR, 'leaderboard.xlsx');

function normalizeRows(rows) {
  return rows.map(r => ({
    // common name fields (support many possible CSV/XLSX headers)
    username: r.name || r['User Name'] || r.username || r.Username || r.user || '',
  // keep `link`/handle short (e.g., @handle) and expose the external profile URL separately
  link: r.handle || r.link || r.profile || '',
  profileUrl: r['Profile URL'] || r['Google Cloud Skills Boost Profile URL'] || r.profileUrl || r.profile || '',
    // streak may not exist in the new CSV; default to 0
    streak: Number(r.streak || r.Streak || 0),
    syllabusCompleted: Number(r.syllabusCompleted || r.SyllabusCompleted || r.syllabus || r.Syllabus || r.syllabusCompleted || 0),
    // support both plain and verbose headers from the provided CSV
    skillBadges: Number(
      r['# of Skill Badges Completed'] || r['# of Skill Badges & Games Completed'] || r.skillBadges || r.SkillBadges || r.badges || r.skill_badges || 0
    ),
    arcadeGame: Number(
      r['# of Arcade Games Completed'] || r['# of Arcade Games Completed'] || r.arcadeGames || r.ArcadeGames || r.arcade || r.arcadeGame || r.arcade_Game || 0
    ),
    // points: if present use it, otherwise compute a simple default score from badges + arcade games
    points: Number(r.points || r.Points || r.score || 0) || (Number(r['# of Skill Badges Completed'] || r.skillBadges || 0) * 100 + Number(r['# of Arcade Games Completed'] || r.arcadeGames || 0) * 10),
    modules: Number(r.modules || r.Modules || r.modulesCompleted || 0),
    verified: (r.verified === true) || (String(r.verified || r.Verified || r['Profile URL Status'] || '').toLowerCase() === 'yes')
  }));
}

function rankBySkill(rows) {
  const normalized = normalizeRows(rows);
  const ranked = normalized.sort((a, b) => b.skillBadges - a.skillBadges).map((r, idx) => ({ place: idx + 1, ...r }));
  return ranked;
}

function readDataFile() {
  if (existsSync(XLSX_FILE)) {
    const workbook = readFile(XLSX_FILE);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return utils.sheet_to_json(sheet, { defval: null });
  }

  if (existsSync(CSV_FILE)) {
    const workbook = readFile(CSV_FILE, { type: 'file' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return utils.sheet_to_json(sheet, { defval: null });
  }

  return null;
}

// --- New utility functions ---

function getRows() {
  const rows = readDataFile();
  if (!rows) return [];
  return normalizeRows(rows);
}

function filterRows(rows, { search, track, week, verifiedOnly } = {}) {
  let out = rows;
  if (search) {
    const term = String(search).toLowerCase();
    out = out.filter(r => (r.username || '').toLowerCase().includes(term) || (r.link || '').toLowerCase().includes(term));
  }

  // track and week filters are domain-specific; if absent on rows, this will be no-op
  if (track && track !== 'all') {
    out = out.filter(r => String(r.track || 'all') === String(track));
  }

  if (week && week !== 'all') {
    // If rows have a week field, filter by it. Otherwise ignore.
    out = out.filter(r => String(r.week || 'all') === String(week));
  }

  if (verifiedOnly) {
    out = out.filter(r => !!r.verified);
  }

  return out;
}

function sortRows(rows, field = 'skillBadges', direction = 'desc') {
  const sorted = [...rows].sort((a, b) => {
    const getVal = (obj, key) => (obj[key] == null ? 0 : obj[key]);

    // Primary sort: skillBadges with tie-breakers points -> streak
    if (field === 'skillBadges') {
      const aS = getVal(a, 'skillBadges');
      const bS = getVal(b, 'skillBadges');
      if (aS !== bS) return direction === 'asc' ? aS - bS : bS - aS;

      // tie-breaker 1: points
      const aP = getVal(a, 'points');
      const bP = getVal(b, 'points');
      if (aP !== bP) return direction === 'asc' ? aP - bP : bP - aP;

      // tie-breaker 2: streak
      const aSt = getVal(a, 'streak');
      const bSt = getVal(b, 'streak');
      return direction === 'asc' ? aSt - bSt : bSt - aSt;
    }

    const aV = getVal(a, field);
    const bV = getVal(b, field);
    if (typeof aV === 'string') return direction === 'asc' ? String(aV).localeCompare(String(bV)) : String(bV).localeCompare(String(aV));
    return direction === 'asc' ? aV - bV : bV - aV;
  });
  return sorted;
}

function assignPlaces(rows) {
  return rows.map((r, idx) => ({ place: idx + 1, ...r }));
}

function getLeaderboard(options = {}) {
  const { search, track, week, verifiedOnly, sortField = 'skillBadges', sortDir = 'desc', limit } = options;
  let rows = getRows();
  rows = filterRows(rows, { search, track, week, verifiedOnly });
  rows = sortRows(rows, sortField, sortDir);
  rows = assignPlaces(rows);
  if (limit) return rows.slice(0, Number(limit));
  return rows;
}

function computeStats(rows) {
  const participants = rows.length;
  const totalPoints = rows.reduce((s, r) => s + (r.points || 0), 0);
  const avgModules = participants ? (rows.reduce((s, r) => s + (r.modules || 0), 0) / participants) : 0;
  const activeStreaks = rows.filter(r => (r.streak || 0) > 0).length;
  return {
    participants,
    totalPoints,
    avgModules: Number(avgModules.toFixed(2)),
    activeStreaks
  };
}

function topPerformers(n = 3) {
  const rows = getLeaderboard({ sortField: 'skillBadges', sortDir: 'desc', limit: n });
  return rows;
}

function weeklyData() {
  // If rows contain week/points per week, aggregate. Otherwise generate a simple weekly split of total points.
  const rows = getRows();
  const weeks = [];
  if (rows.some(r => r.week)) {
    const map = {};
    rows.forEach(r => {
      const w = r.week || 'unknown';
      map[w] = (map[w] || 0) + (r.points || 0);
    });
  Object.keys(map).forEach(k => weeks.push({ week: k, points: map[k] }));
    return weeks;
  }

  // fallback: split total points into 6 weeks roughly
  const total = rows.reduce((s, r) => s + (r.points || 0), 0);
  const per = Math.round(total / 6) || 0;
  for (let i = 1; i <= 6; i++) weeks.push({ week: `Wk ${i}`, points: per * i });
  return weeks;
}

function exportCSV(rows) {
  // Build header and CSV string
  const header = ['place', 'username', 'link', 'streak', 'syllabusCompleted', 'skillBadges', 'arcadeGame', 'points', 'modules', 'verified'];
  const lines = [header.join(',')];
  rows.forEach(r => {
    const vals = header.map(h => {
      const v = r[h] == null ? '' : r[h];
      // Escape quotes
      return typeof v === 'string' && v.includes(',') ? `"${v.replace(/"/g, '""')}"` : v;
    });
    lines.push(vals.join(','));
  });
  return lines.join('\n');
}

export default {
  readDataFile,
  rankBySkill,
  getLeaderboard,
  computeStats,
  topPerformers,
  weeklyData,
  exportCSV
};
