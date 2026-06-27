// TypeScript types — ported from Android Entities.kt

export interface UserStats {
  id: number;
  level: number;
  xp: number;
  xpNeeded: number;
  coins: number;
  streak: number;
  lastActiveDate: string;
  inventory: string; // comma-separated item IDs
  equippedAvatar: string;
  equippedTitle: string;
}

export interface Habit {
  id: number;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Health' | 'Mind' | 'Work' | 'Fitness' | 'Creative';
  streak: number;
  lastCompletedDate: string;
  createdTimestamp: number;
  dueDate: string; // 'YYYY-MM-DD' or '' if none
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  targetProgress: number;
  currentProgress: number;
  isCompleted: boolean;
  isClaimed: boolean;
  xpReward: number;
  coinReward: number;
  dateString: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
}

// Helper functions (ported from Entities.kt)
export function hasItem(stats: UserStats, itemId: string): boolean {
  if (!stats.inventory) return false;
  return stats.inventory.split(',').includes(itemId);
}

export function buyItem(stats: UserStats, itemId: string, cost: number): UserStats {
  if (stats.coins < cost || hasItem(stats, itemId)) return stats;
  const newInventory = stats.inventory ? `${stats.inventory},${itemId}` : itemId;
  return { ...stats, coins: stats.coins - cost, inventory: newInventory };
}

export function equipItem(stats: UserStats, itemId: string): UserStats {
  if (!hasItem(stats, itemId) && itemId !== 'default') return stats;
  return { ...stats, equippedAvatar: itemId };
}

export function equipTitle(stats: UserStats, title: string): UserStats {
  return { ...stats, equippedTitle: title };
}

export function addXP(stats: UserStats, amount: number): UserStats {
  let currentXP = stats.xp + amount;
  let currentLevel = stats.level;
  let currentXPNeeded = stats.xpNeeded;

  while (currentXP >= currentXPNeeded) {
    currentXP -= currentXPNeeded;
    currentLevel++;
    currentXPNeeded = Math.floor(currentXPNeeded * 1.5);
  }

  return { ...stats, level: currentLevel, xp: currentXP, xpNeeded: currentXPNeeded };
}

export function addCoins(stats: UserStats, amount: number): UserStats {
  return { ...stats, coins: stats.coins + amount };
}

export function getHabitXPReward(difficulty: string): number {
  switch (difficulty) {
    case 'Easy': return 10;
    case 'Medium': return 20;
    case 'Hard': return 40;
    default: return 10;
  }
}

export function getHabitCoinReward(difficulty: string): number {
  switch (difficulty) {
    case 'Easy': return 5;
    case 'Medium': return 10;
    case 'Hard': return 20;
    default: return 5;
  }
}

export const DEFAULT_USER_STATS: UserStats = {
  id: 1,
  level: 1,
  xp: 0,
  xpNeeded: 100,
  coins: 50,
  streak: 0,
  lastActiveDate: '',
  inventory: '',
  equippedAvatar: 'default',
  equippedTitle: 'Novice',
};

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'crown', name: 'Golden Crown', description: 'Visual accessory. Wear a majestic gold crown!', cost: 100 },
  { id: 'wings', name: 'Phoenix Wings', description: 'Visual accessory. Radiate giant phoenix energy wings!', cost: 150 },
  { id: 'shield', name: 'Paladin Shield', description: 'Visual accessory. Carry a custom paladin shield!', cost: 50 },
  { id: 'staff', name: 'Wizard Staff', description: 'Visual accessory. Hold an emerald sorcerer staff!', cost: 75 },
];

export const CATEGORIES = ['All', 'Health', 'Mind', 'Work', 'Fitness', 'Creative'] as const;
export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const;
