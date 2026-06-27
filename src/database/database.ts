import * as SQLite from 'expo-sqlite';
import {
  UserStats,
  Habit,
  DailyQuest,
  DEFAULT_USER_STATS,
  hasItem,
  buyItem,
  equipItem,
  addXP,
  addCoins,
  getHabitXPReward,
  getHabitCoinReward,
} from './types';

let db: SQLite.SQLiteDatabase | null = null;

// ─── DB Init ────────────────────────────────────────────────────────────────

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
      created_timestamp INTEGER NOT NULL DEFAULT 0
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
  `);
}

// ─── Date Utilities ──────────────────────────────────────────────────────────

export function getTodayString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getYesterdayString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const y = yesterday.getFullYear();
  const m = String(yesterday.getMonth() + 1).padStart(2, '0');
  const d = String(yesterday.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// ─── Row Mappers ─────────────────────────────────────────────────────────────

function rowToUserStats(row: any): UserStats {
  return {
    id: row.id,
    level: row.level,
    xp: row.xp,
    xpNeeded: row.xp_needed,
    coins: row.coins,
    streak: row.streak,
    lastActiveDate: row.last_active_date,
    inventory: row.inventory,
    equippedAvatar: row.equipped_avatar,
    equippedTitle: row.equipped_title,
  };
}

function rowToHabit(row: any): Habit {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    difficulty: row.difficulty,
    category: row.category,
    streak: row.streak,
    lastCompletedDate: row.last_completed_date,
    createdTimestamp: row.created_timestamp,
  };
}

function rowToQuest(row: any): DailyQuest {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    targetProgress: row.target_progress,
    currentProgress: row.current_progress,
    isCompleted: row.is_completed === 1,
    isClaimed: row.is_claimed === 1,
    xpReward: row.xp_reward,
    coinReward: row.coin_reward,
    dateString: row.date_string,
  };
}

// ─── User Stats ───────────────────────────────────────────────────────────────

async function getOrInitUserStats(): Promise<UserStats> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<any>('SELECT * FROM user_stats WHERE id = 1');
  if (!row) {
    const s = DEFAULT_USER_STATS;
    await database.runAsync(
      `INSERT OR REPLACE INTO user_stats (id, level, xp, xp_needed, coins, streak, last_active_date, inventory, equipped_avatar, equipped_title)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [s.id, s.level, s.xp, s.xpNeeded, s.coins, s.streak, s.lastActiveDate, s.inventory, s.equippedAvatar, s.equippedTitle]
    );
    return s;
  }
  return rowToUserStats(row);
}

async function saveUserStats(stats: UserStats): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `INSERT OR REPLACE INTO user_stats (id, level, xp, xp_needed, coins, streak, last_active_date, inventory, equipped_avatar, equipped_title)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [stats.id, stats.level, stats.xp, stats.xpNeeded, stats.coins, stats.streak, stats.lastActiveDate, stats.inventory, stats.equippedAvatar, stats.equippedTitle]
  );
}

export async function fetchUserStats(): Promise<UserStats> {
  return getOrInitUserStats();
}

// ─── Daily Refresh ────────────────────────────────────────────────────────────

export async function checkDailyRefresh(): Promise<void> {
  const stats = await getOrInitUserStats();
  const today = getTodayString();
  if (stats.lastActiveDate === today) return;

  const yesterday = getYesterdayString();
  const newStreak = stats.lastActiveDate === yesterday ? stats.streak + 1 : 1;

  const freshQuests: DailyQuest[] = [
    { id: 'quest_first_victory', title: 'First Victory', description: 'Complete any 1 habit today.', targetProgress: 1, currentProgress: 0, isCompleted: false, isClaimed: false, xpReward: 15, coinReward: 5, dateString: today },
    { id: 'quest_triathlon', title: 'Habit Triathlon', description: 'Complete any 3 habits today.', targetProgress: 3, currentProgress: 0, isCompleted: false, isClaimed: false, xpReward: 30, coinReward: 15, dateString: today },
    { id: 'quest_boss_fight', title: 'Boss Slayer', description: "Complete a 'Hard' difficulty habit.", targetProgress: 1, currentProgress: 0, isCompleted: false, isClaimed: false, xpReward: 40, coinReward: 20, dateString: today },
    { id: 'quest_spend_coins', title: 'Treasure Hunter', description: 'Purchase or consume any item from the shop.', targetProgress: 1, currentProgress: 0, isCompleted: false, isClaimed: false, xpReward: 20, coinReward: 10, dateString: today },
  ];

  const database = await getDatabase();
  await database.runAsync('DELETE FROM daily_quests');
  for (const q of freshQuests) {
    await database.runAsync(
      `INSERT OR REPLACE INTO daily_quests (id, title, description, target_progress, current_progress, is_completed, is_claimed, xp_reward, coin_reward, date_string)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [q.id, q.title, q.description, q.targetProgress, q.currentProgress, 0, 0, q.xpReward, q.coinReward, q.dateString]
    );
  }

  await saveUserStats({ ...stats, streak: newStreak, lastActiveDate: today });
}

// ─── Habits ──────────────────────────────────────────────────────────────────

export async function fetchHabits(): Promise<Habit[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<any>('SELECT * FROM habits ORDER BY created_timestamp DESC');
  return rows.map(rowToHabit);
}

export async function insertHabit(name: string, description: string, difficulty: string, category: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `INSERT INTO habits (name, description, difficulty, category, streak, last_completed_date, created_timestamp)
     VALUES (?, ?, ?, ?, 0, '', ?)`,
    [name, description, difficulty, category, Date.now()]
  );
}

export async function deleteHabit(habitId: number): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM habits WHERE id = ?', [habitId]);
}

export async function completeHabit(habit: Habit): Promise<void> {
  const today = getTodayString();
  if (habit.lastCompletedDate === today) return;

  const yesterday = getYesterdayString();
  const newStreak = habit.lastCompletedDate === yesterday ? habit.streak + 1 : 1;

  const database = await getDatabase();
  await database.runAsync(
    'UPDATE habits SET streak = ?, last_completed_date = ? WHERE id = ?',
    [newStreak, today, habit.id]
  );

  let stats = await getOrInitUserStats();
  stats = addXP(stats, getHabitXPReward(habit.difficulty));
  stats = addCoins(stats, getHabitCoinReward(habit.difficulty));
  await saveUserStats(stats);

  await updateQuestProgress('quest_first_victory', 1);
  await updateQuestProgress('quest_triathlon', 1);
  if (habit.difficulty === 'Hard') {
    await updateQuestProgress('quest_boss_fight', 1);
  }
}

// ─── Daily Quests ─────────────────────────────────────────────────────────────

export async function fetchQuests(): Promise<DailyQuest[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<any>('SELECT * FROM daily_quests');
  return rows.map(rowToQuest);
}

async function updateQuestProgress(questId: string, amount: number): Promise<void> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<any>('SELECT * FROM daily_quests WHERE id = ?', [questId]);
  if (!row || row.is_completed === 1) return;

  const quest = rowToQuest(row);
  const newProgress = Math.min(quest.currentProgress + amount, quest.targetProgress);
  const isNowCompleted = newProgress >= quest.targetProgress;

  await database.runAsync(
    'UPDATE daily_quests SET current_progress = ?, is_completed = ? WHERE id = ?',
    [newProgress, isNowCompleted ? 1 : 0, questId]
  );
}

export async function claimQuestReward(quest: DailyQuest): Promise<void> {
  if (!quest.isCompleted || quest.isClaimed) return;
  const database = await getDatabase();
  await database.runAsync('UPDATE daily_quests SET is_claimed = 1 WHERE id = ?', [quest.id]);

  let stats = await getOrInitUserStats();
  stats = addXP(stats, quest.xpReward);
  stats = addCoins(stats, quest.coinReward);
  await saveUserStats(stats);
}

// ─── Shop & Equipment ─────────────────────────────────────────────────────────

export async function buyShopItem(itemId: string, cost: number): Promise<void> {
  let stats = await getOrInitUserStats();
  if (stats.coins >= cost && !hasItem(stats, itemId)) {
    stats = buyItem(stats, itemId, cost);
    await saveUserStats(stats);
    await updateQuestProgress('quest_spend_coins', 1);
  }
}

export async function useXPBoostPotion(): Promise<void> {
  let stats = await getOrInitUserStats();
  const potionCost = 15;
  if (stats.coins >= potionCost) {
    stats = { ...stats, coins: stats.coins - potionCost };
    stats = addXP(stats, 50);
    await saveUserStats(stats);
    await updateQuestProgress('quest_spend_coins', 1);
  }
}

export async function equipAvatar(itemId: string): Promise<void> {
  let stats = await getOrInitUserStats();
  if (hasItem(stats, itemId) || itemId === 'default') {
    stats = equipItem(stats, itemId);
    await saveUserStats(stats);
  }
}
