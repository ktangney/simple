import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create or open database
const db = new Database(join(__dirname, 'golf-scores.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
function initDatabase() {
  // Users table - stores authenticated users
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      google_id TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      name TEXT,
      picture TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Games table - stores each game session
  db.exec(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Players table - stores player information
  db.exec(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Game participants - links players to games with their scores
  db.exec(`
    CREATE TABLE IF NOT EXISTS game_participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id INTEGER NOT NULL,
      player_id INTEGER NOT NULL,
      total_score INTEGER NOT NULL,
      round_1 INTEGER DEFAULT 0,
      round_2 INTEGER DEFAULT 0,
      round_3 INTEGER DEFAULT 0,
      round_4 INTEGER DEFAULT 0,
      round_5 INTEGER DEFAULT 0,
      round_6 INTEGER DEFAULT 0,
      round_7 INTEGER DEFAULT 0,
      round_8 INTEGER DEFAULT 0,
      round_9 INTEGER DEFAULT 0,
      won INTEGER DEFAULT 0,
      FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
      FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
      UNIQUE(game_id, player_id)
    )
  `);

  console.log('Database initialized successfully');
}

initDatabase();

export default db;
