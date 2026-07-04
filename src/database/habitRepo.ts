import { Habit, getHabitXPReward, getHabitCoinReward, addXP, addCoins } from './types';
import { getDatabase } from './db';
import { getTodayString, getYesterdayString } from './dateUtils';
import { getOrInitUserStats, saveUserStats } from './userStatsRepo';
import { updateQuestProgress } from './questRepo';
import { logCompletion } from './completionRepo';

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
    dueDate: row.due_date ?? '',
    isOneTime: row.is_one_time === 1,
  };
}

export async function fetchHabits(): Promise<Habit[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<any>('SELECT * FROM habits ORDER BY created_timestamp DESC');
  return rows.map(rowToHabit);
}

export async function insertHabit(name: string, description: string, difficulty: string, category: string, dueDate = '', isOneTime = false): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `INSERT INTO habits (name, description, difficulty, category, streak, last_completed_date, created_timestamp, due_date, is_one_time)
     VALUES (?, ?, ?, ?, 0, '', ?, ?, ?)`,
    [name, description, difficulty, category, Date.now(), dueDate, isOneTime ? 1 : 0]
  );
}

export async function updateHabit(id: number, updates: Partial<Pick<Habit, 'name' | 'description' | 'difficulty' | 'category' | 'dueDate' | 'isOneTime'>>): Promise<void> {
  const database = await getDatabase();
  const existing = await database.getFirstAsync<any>('SELECT * FROM habits WHERE id = ?', [id]);
  if (!existing) return;

  const name = updates.name !== undefined ? updates.name : existing.name;
  const description = updates.description !== undefined ? updates.description : existing.description;
  const difficulty = updates.difficulty !== undefined ? updates.difficulty : existing.difficulty;
  const category = updates.category !== undefined ? updates.category : existing.category;
  const dueDate = updates.dueDate !== undefined ? updates.dueDate : existing.due_date;
  const isOneTime = updates.isOneTime !== undefined ? (updates.isOneTime ? 1 : 0) : existing.is_one_time;

  await database.runAsync(
    'UPDATE habits SET name=?, description=?, difficulty=?, category=?, due_date=?, is_one_time=? WHERE id=?',
    [name, description, difficulty, category, dueDate, isOneTime, id]
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

  await logCompletion(habit);

  await updateQuestProgress('quest_first_victory', 1);
  await updateQuestProgress('quest_triathlon', 1);
  if (habit.difficulty === 'Hard') {
    await updateQuestProgress('quest_boss_fight', 1);
  }
}
