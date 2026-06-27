import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { UserStats, Habit, DailyQuest, DEFAULT_USER_STATS } from '../database/types';
import {
  fetchUserStats,
  fetchHabits,
  fetchQuests,
  checkDailyRefresh,
  insertHabit,
  deleteHabit,
  completeHabit,
  claimQuestReward,
  buyShopItem,
  useXPBoostPotion,
  equipAvatar,
} from '../database/database';

// ─── State & Actions ──────────────────────────────────────────────────────────

interface HabitState {
  userStats: UserStats;
  habits: Habit[];
  quests: DailyQuest[];
  isLoading: boolean;
}

type HabitAction =
  | { type: 'SET_ALL'; userStats: UserStats; habits: Habit[]; quests: DailyQuest[] }
  | { type: 'SET_LOADING'; value: boolean };

function habitReducer(state: HabitState, action: HabitAction): HabitState {
  switch (action.type) {
    case 'SET_ALL':
      return { ...state, userStats: action.userStats, habits: action.habits, quests: action.quests, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.value };
    default:
      return state;
  }
}

const initialState: HabitState = {
  userStats: DEFAULT_USER_STATS,
  habits: [],
  quests: [],
  isLoading: true,
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface HabitContextValue extends HabitState {
  refresh: () => Promise<void>;
  addHabit: (name: string, description: string, difficulty: string, category: string) => Promise<void>;
  removeHabit: (habitId: number) => Promise<void>;
  markHabitComplete: (habit: Habit) => Promise<void>;
  claimQuest: (quest: DailyQuest) => Promise<void>;
  purchaseItem: (itemId: string, cost: number) => Promise<void>;
  purchasePotion: () => Promise<void>;
  changeAvatar: (itemId: string) => Promise<void>;
}

const HabitContext = createContext<HabitContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(habitReducer, initialState);

  const refresh = useCallback(async () => {
    const [userStats, habits, quests] = await Promise.all([
      fetchUserStats(),
      fetchHabits(),
      fetchQuests(),
    ]);
    dispatch({ type: 'SET_ALL', userStats, habits, quests });
  }, []);

  // Initial load + daily refresh
  useEffect(() => {
    (async () => {
      dispatch({ type: 'SET_LOADING', value: true });
      await checkDailyRefresh();
      await refresh();
    })();
  }, [refresh]);

  const addHabit = useCallback(async (name: string, description: string, difficulty: string, category: string) => {
    await insertHabit(name, description, difficulty, category);
    await refresh();
  }, [refresh]);

  const removeHabit = useCallback(async (habitId: number) => {
    await deleteHabit(habitId);
    await refresh();
  }, [refresh]);

  const markHabitComplete = useCallback(async (habit: Habit) => {
    await completeHabit(habit);
    await refresh();
  }, [refresh]);

  const claimQuest = useCallback(async (quest: DailyQuest) => {
    await claimQuestReward(quest);
    await refresh();
  }, [refresh]);

  const purchaseItem = useCallback(async (itemId: string, cost: number) => {
    await buyShopItem(itemId, cost);
    await refresh();
  }, [refresh]);

  const purchasePotion = useCallback(async () => {
    await useXPBoostPotion();
    await refresh();
  }, [refresh]);

  const changeAvatar = useCallback(async (itemId: string) => {
    await equipAvatar(itemId);
    await refresh();
  }, [refresh]);

  return (
    <HabitContext.Provider value={{
      ...state,
      refresh,
      addHabit,
      removeHabit,
      markHabitComplete,
      claimQuest,
      purchaseItem,
      purchasePotion,
      changeAvatar,
    }}>
      {children}
    </HabitContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useHabits(): HabitContextValue {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error('useHabits must be used inside HabitProvider');
  return ctx;
}
