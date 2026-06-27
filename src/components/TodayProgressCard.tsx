import React from 'react';
import { View, Text } from 'react-native';
import { Habit } from '../database/types';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface Props {
  habits: Habit[];
}

export function TodayProgressCard({ habits }: Props) {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const total = habits.length;
  const done = habits.filter(h => h.lastCompletedDate === today).length;
  const pct = total > 0 ? done / total : 0;

  return (
    <View className="bg-bold-surface rounded-[28px] border-2 border-bold-border p-5 gap-3">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-[11px] font-black text-bold-primary tracking-widest uppercase">{DAY_NAMES[now.getDay()]}</Text>
          <Text className="text-xl font-black text-bold-text">{now.getDate()} {MONTH_NAMES[now.getMonth()]} {now.getFullYear()}</Text>
        </View>
        <View className="items-center bg-bold-primary-container rounded-2xl px-4 py-2">
          <Text className="text-lg font-black text-bold-primary">{done}/{total}</Text>
          <Text className="text-[10px] font-black text-bold-primary tracking-widest">done</Text>
        </View>
      </View>

      <View className="h-2 bg-bold-border rounded-full overflow-hidden">
        <View className="h-full bg-bold-primary rounded-full" style={{ width: `${pct * 100}%` }} />
      </View>

      <Text className="text-xs font-bold text-bold-text-secondary">
        {total === 0
          ? 'No quests yet — forge one!'
          : done === total
          ? 'All quests complete today! 🎉'
          : `${total - done} quest${total - done > 1 ? 's' : ''} remaining`}
      </Text>
    </View>
  );
}
