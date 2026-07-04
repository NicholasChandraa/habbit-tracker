import { DailyQuest } from './types';
import { getDatabase } from './db';
import { getTodayString, getYesterdayString } from './dateUtils';
import { getOrInitUserStats, saveUserStats } from './userStatsRepo';
import { addXP, addCoins } from './types';

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

export async function fetchQuests(): Promise<DailyQuest[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<any>('SELECT * FROM daily_quests');
  return rows.map(rowToQuest);
}

export async function updateQuestProgress(questId: string, amount: number): Promise<void> {
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
  
  // Clean up completed one-time habits when day changes
  await database.runAsync("DELETE FROM habits WHERE is_one_time = 1 AND last_completed_date != ''");

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
