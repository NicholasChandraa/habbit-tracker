import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('habit_tracker.db');
  await initSchema(db);
  return db;
}

async function initSchema(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS user_stats (
      id INTEGER PRIMARY KEY DEFAULT 1,
      level INTEGER NOT NULL DEFAULT 1,
      xp INTEGER NOT NULL DEFAULT 0,
      xp_needed INTEGER NOT NULL DEFAULT 100,
      coins INTEGER NOT NULL DEFAULT 50,
      streak INTEGER NOT NULL DEFAULT 0,
      last_active_date TEXT NOT NULL DEFAULT '',
      inventory TEXT NOT NULL DEFAULT '',
      equipped_avatar TEXT NOT NULL DEFAULT 'default',
      equipped_title TEXT NOT NULL DEFAULT 'Novice'
    );

    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      difficulty TEXT NOT NULL DEFAULT 'Easy',
      category TEXT NOT NULL DEFAULT 'Health',
      streak INTEGER NOT NULL DEFAULT 0,
      last_completed_date TEXT NOT NULL DEFAULT '',
      created_timestamp INTEGER NOT NULL DEFAULT 0,
      due_date TEXT NOT NULL DEFAULT '',
      is_one_time INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS daily_quests (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      target_progress INTEGER NOT NULL,
      current_progress INTEGER NOT NULL DEFAULT 0,
      is_completed INTEGER NOT NULL DEFAULT 0,
      is_claimed INTEGER NOT NULL DEFAULT 0,
      xp_reward INTEGER NOT NULL,
      coin_reward INTEGER NOT NULL,
      date_string TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS habit_completions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id INTEGER NOT NULL,
      habit_name TEXT NOT NULL,
      difficulty TEXT NOT NULL DEFAULT 'Easy',
      category TEXT NOT NULL DEFAULT 'Health',
      completed_date TEXT NOT NULL,
      completed_timestamp INTEGER NOT NULL DEFAULT 0
    );
  `);
  // ponytail: migrate existing installs — throws if column exists, that's fine
  try { await database.execAsync(`ALTER TABLE habits ADD COLUMN due_date TEXT NOT NULL DEFAULT ''`); } catch {}
  try { await database.execAsync(`ALTER TABLE habits ADD COLUMN is_one_time INTEGER NOT NULL DEFAULT 0`); } catch {}
}
