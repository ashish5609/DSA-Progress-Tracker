import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const bundledCsvPath = path.resolve(root, 'data/DSA_question_sheet_sorted_learning_order.csv');
const csvPath = process.env.DSA_CSV_PATH || (fs.existsSync(bundledCsvPath) ? bundledCsvPath : 'C:/Users/Ashish/Downloads/DSA_question_sheet_sorted_learning_order.csv');
const db = new Database(path.resolve(root, 'dsa-killers.db'));
db.pragma('foreign_keys = ON');
export default db;

function parseCsv(text) {
  const rows = []; let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) { const c = text[i], n = text[i + 1];
    if (c === '"' && quoted && n === '"') { field += '"'; i++; }
    else if (c === '"') quoted = !quoted;
    else if (c === ',' && !quoted) { row.push(field); field = ''; }
    else if ((c === '\n' || c === '\r') && !quoted) { if (c === '\r' && n === '\n') i++; row.push(field); if (row.some(Boolean)) rows.push(row); row = []; field = ''; }
    else field += c;
  } return rows;
}
export function initializeDatabase() {
  db.exec(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, username TEXT NOT NULL, password_hash TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY, study_order INTEGER UNIQUE, difficulty TEXT, title TEXT, frequency REAL, link TEXT, topics TEXT, study_topic TEXT);
  CREATE TABLE IF NOT EXISTS user_progress (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, question_id INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'unsolved' CHECK(status IN ('unsolved','in_progress','solved')), is_starred INTEGER NOT NULL DEFAULT 0, notes TEXT DEFAULT '', updated_at TEXT DEFAULT CURRENT_TIMESTAMP, UNIQUE(user_id, question_id), FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY(question_id) REFERENCES questions(id) ON DELETE CASCADE);`);
  if (db.prepare('SELECT COUNT(*) AS count FROM questions').get().count) return;
  if (!fs.existsSync(csvPath)) throw new Error(`CSV not found: ${csvPath}`);
  const [, ...records] = parseCsv(fs.readFileSync(csvPath, 'utf8'));
  const insert = db.prepare('INSERT INTO questions (study_order,difficulty,title,frequency,link,topics,study_topic) VALUES (?,?,?,?,?,?,?)');
  const seed = db.transaction(() => records.forEach(r => insert.run(Number(r[0]), r[1], r[2], Number(r[3]) || 0, r[4], r[5], r[6]))); seed();
}
