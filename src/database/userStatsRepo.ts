import { UserStats, DEFAULT_USER_STATS, hasItem, buyItem, equipItem, addXP, addCoins } from './types';
import { getDatabase } from './db';

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

export async function getOrInitUserStats(): Promise<UserStats> {
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

export async function saveUserStats(stats: UserStats): Promise<void> {
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

export async function buyShopItem(itemId: string, cost: number): Promise<void> {
  let stats = await getOrInitUserStats();
  if (stats.coins >= cost && !hasItem(stats, itemId)) {
    stats = buyItem(stats, itemId, cost);
    await saveUserStats(stats);
  }
}

export async function useXPBoostPotion(): Promise<void> {
  let stats = await getOrInitUserStats();
  const potionCost = 15;
  if (stats.coins >= potionCost) {
    stats = { ...stats, coins: stats.coins - potionCost };
    stats = addXP(stats, 50);
    await saveUserStats(stats);
  }
}

export async function equipAvatar(itemId: string): Promise<void> {
  let stats = await getOrInitUserStats();
  if (hasItem(stats, itemId) || itemId === 'default') {
    stats = equipItem(stats, itemId);
    await saveUserStats(stats);
  }
}
