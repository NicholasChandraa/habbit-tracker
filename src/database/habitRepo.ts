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
  };
}

export async function fetchHabits(): Promise<Habit[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<any>('SELECT * FROM habits ORDER BY created_timestamp DESC');
  return rows.map(rowToHabit);
}

export async function insertHabit(name: string, description: string, difficulty: string, category: string, dueDate = ''): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `INSERT INTO habits (name, description, difficulty, category, streak, last_completed_date, created_timestamp, due_date)
     VALUES (?, ?, ?, ?, 0, '', ?, ?)`,
    [name, description, difficulty, category, Date.now(), dueDate]
  );
}

export async function updateHabit(id: number, updates: Partial<Pick<Habit, 'name' | 'description' | 'difficulty' | 'category' | 'dueDate'>>): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    'UPDATE habits SET name=?, description=?, difficulty=?, category=?, due_date=? WHERE id=?',
    [updates.name ?? '', updates.description ?? '', updates.difficulty ?? '', updates.category ?? '', updates.dueDate ?? '', id]
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
