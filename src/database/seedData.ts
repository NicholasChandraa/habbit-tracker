import { getDatabase } from './db';

function dateOffset(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const TODAY = dateOffset(0);

const HABITS = [
  { name: 'Morning Meditation', description: 'Start the day with 10 minutes of mindfulness to clear the mind.', difficulty: 'Easy', category: 'Mind', streak: 21, lastCompleted: TODAY, dueDate: '' },
  { name: 'Run 5KM', description: 'Outdoor run before 7am. Track distance with Nike Run Club.', difficulty: 'Hard', category: 'Fitness', streak: 14, lastCompleted: TODAY, dueDate: dateOffset(-3) },
  { name: 'Read 30 Minutes', description: 'Read a non-fiction book. Currently: Atomic Habits by James Clear.', difficulty: 'Easy', category: 'Mind', streak: 9, lastCompleted: TODAY, dueDate: '' },
  { name: 'Deep Work Session', description: 'Focused coding session with no distractions. Pomodoro 4x25min.', difficulty: 'Hard', category: 'Work', streak: 7, lastCompleted: dateOffset(1), dueDate: '' },
  { name: 'Drink 2L Water', description: 'Stay hydrated throughout the day. Use bottle tracker.', difficulty: 'Easy', category: 'Health', streak: 30, lastCompleted: dateOffset(1), dueDate: '' },
  { name: 'Workout at Gym', description: 'Push day: chest, shoulder, tricep. Follow PPL program.', difficulty: 'Medium', category: 'Fitness', streak: 5, lastCompleted: dateOffset(1), dueDate: '' },
  { name: 'Learn New Tech', description: 'Study React Native or any new framework for at least 1 hour.', difficulty: 'Medium', category: 'Work', streak: 12, lastCompleted: dateOffset(2), dueDate: dateOffset(-5) },
  { name: 'Journaling', description: 'Write 3 things I am grateful for and 1 goal for tomorrow.', difficulty: 'Easy', category: 'Mind', streak: 3, lastCompleted: dateOffset(1), dueDate: '' },
  { name: 'Meal Prep', description: 'Cook healthy meals for 3 days ahead every Sunday.', difficulty: 'Medium', category: 'Health', streak: 4, lastCompleted: dateOffset(3), dueDate: '' },
  { name: 'Creative Drawing', description: 'Sketch or digital illustration for 20 minutes. No pressure.', difficulty: 'Easy', category: 'Creative', streak: 2, lastCompleted: dateOffset(2), dueDate: '' },
  { name: 'Cold Shower', description: '2 minutes cold water after regular shower. Builds mental toughness.', difficulty: 'Medium', category: 'Health', streak: 8, lastCompleted: dateOffset(1), dueDate: '' },
  { name: 'No Social Media', description: 'Zero social media before 12pm. Only after deep work is done.', difficulty: 'Hard', category: 'Mind', streak: 6, lastCompleted: dateOffset(4), dueDate: '' },
];

const COMPLETIONS = [
  { name: 'Morning Meditation', difficulty: 'Easy', category: 'Mind' },
  { name: 'Run 5KM', difficulty: 'Hard', category: 'Fitness' },
  { name: 'Read 30 Minutes', difficulty: 'Easy', category: 'Mind' },
  { name: 'Deep Work Session', difficulty: 'Hard', category: 'Work' },
  { name: 'Drink 2L Water', difficulty: 'Easy', category: 'Health' },
  { name: 'Workout at Gym', difficulty: 'Medium', category: 'Fitness' },
  { name: 'Learn New Tech', difficulty: 'Medium', category: 'Work' },
  { name: 'Journaling', difficulty: 'Easy', category: 'Mind' },
  { name: 'Cold Shower', difficulty: 'Medium', category: 'Health' },
  { name: 'Morning Meditation', difficulty: 'Easy', category: 'Mind' },
  { name: 'Run 5KM', difficulty: 'Hard', category: 'Fitness' },
  { name: 'Deep Work Session', difficulty: 'Hard', category: 'Work' },
  { name: 'Drink 2L Water', difficulty: 'Easy', category: 'Health' },
  { name: 'No Social Media', difficulty: 'Hard', category: 'Mind' },
  { name: 'Creative Drawing', difficulty: 'Easy', category: 'Creative' },
  { name: 'Morning Meditation', difficulty: 'Easy', category: 'Mind' },
  { name: 'Workout at Gym', difficulty: 'Medium', category: 'Fitness' },
  { name: 'Learn New Tech', difficulty: 'Medium', category: 'Work' },
  { name: 'Cold Shower', difficulty: 'Medium', category: 'Health' },
  { name: 'Run 5KM', difficulty: 'Hard', category: 'Fitness' },
  { name: 'Journaling', difficulty: 'Easy', category: 'Mind' },
  { name: 'Read 30 Minutes', difficulty: 'Easy', category: 'Mind' },
  { name: 'Meal Prep', difficulty: 'Medium', category: 'Health' },
  { name: 'Deep Work Session', difficulty: 'Hard', category: 'Work' },
  { name: 'Morning Meditation', difficulty: 'Easy', category: 'Mind' },
];

export async function seedDummyData(): Promise<void> {
  const db = await getDatabase();

  // Check if already seeded
  const existing = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM habits');
  if (existing && existing.count > 0) return;

  const now = Date.now();

  // Insert habits
  for (let i = 0; i < HABITS.length; i++) {
    const h = HABITS[i];
    await db.runAsync(
      `INSERT INTO habits (name, description, difficulty, category, streak, last_completed_date, created_timestamp, due_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [h.name, h.description, h.difficulty, h.category, h.streak, h.lastCompleted, now - i * 60000, h.dueDate]
    );
  }

  // Insert completion history (spread over last 14 days)
  for (let i = 0; i < COMPLETIONS.length; i++) {
    const c = COMPLETIONS[i];
    const daysAgo = Math.floor(i / 2);
    const completedDate = dateOffset(daysAgo);
    await db.runAsync(
      `INSERT INTO habit_completions (habit_id, habit_name, difficulty, category, completed_date, completed_timestamp)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [i + 1, c.name, c.difficulty, c.category, completedDate, now - daysAgo * 86400000]
    );
  }

  // Update user stats to look impressive
  await db.runAsync(
    `INSERT OR REPLACE INTO user_stats (id, level, xp, xp_needed, coins, streak, last_active_date, inventory, equipped_avatar, equipped_title)
     VALUES (1, 8, 340, 450, 380, 21, ?, '', 'default', 'Guild Adventurer')`,
    [TODAY]
  );
}
