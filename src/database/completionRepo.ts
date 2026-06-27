import { getDatabase } from './db';
import { Habit } from './types';

export interface HabitCompletion {
  id: number;
  habitId: number;
  habitName: string;
  difficulty: string;
  category: string;
  completedDate: string;
  completedTimestamp: number;
}

function rowToCompletion(row: any): HabitCompletion {
  return {
    id: row.id,
    habitId: row.habit_id,
    habitName: row.habit_name,
    difficulty: row.difficulty,
    category: row.category,
    completedDate: row.completed_date,
    completedTimestamp: row.completed_timestamp,
  };
}

export async function logCompletion(habit: Habit): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `INSERT INTO habit_completions (habit_id, habit_name, difficulty, category, completed_date, completed_timestamp)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [habit.id, habit.name, habit.difficulty, habit.category, new Date().toISOString().slice(0, 10), Date.now()]
  );
}

export async function fetchCompletions(limit: number, offset: number): Promise<HabitCompletion[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<any>(
    'SELECT * FROM habit_completions ORDER BY completed_timestamp DESC LIMIT ? OFFSET ?',
    [limit, offset]
  );
  return rows.map(rowToCompletion);
}

export async function countCompletions(): Promise<number> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ total: number }>('SELECT COUNT(*) as total FROM habit_completions');
  return row?.total ?? 0;
}
