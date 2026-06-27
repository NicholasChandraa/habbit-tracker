import React from 'react';
import { View, Text } from 'react-native';
import { UserStats } from '../database/types';
import { PlayerAvatar } from './PlayerAvatar';

interface Props {
  userStats: UserStats;
}

export function PlayerProfileCard({ userStats }: Props) {
  const progress = userStats.xpNeeded > 0 ? Math.min(userStats.xp / userStats.xpNeeded, 1) : 0;

  return (
    <View className="bg-bold-surface rounded-[28px] border-2 border-bold-border p-5 gap-4">
      <View className="flex-row items-center gap-4">
        <PlayerAvatar equipped={userStats.equippedAvatar} size={72} />
        <View className="flex-1 gap-0.5">
          <Text className="text-[11px] font-bold text-bold-text-secondary tracking-widest">GUILD ADVENTURER</Text>
          <Text className="text-[22px] font-black text-bold-text">Level {userStats.level}</Text>
          <Text className="text-[13px] font-bold text-bold-primary">Title: {userStats.equippedTitle}</Text>
        </View>
      </View>

      <View className="gap-1.5">
        <View className="h-2.5 bg-bold-primary-container rounded-full overflow-hidden">
          <View className="h-full bg-bold-primary rounded-full" style={{ width: `${progress * 100}%` }} />
        </View>
        <View className="flex-row justify-between">
          <Text className="text-xs font-bold text-bold-text-secondary">XP {userStats.xp} / {userStats.xpNeeded}</Text>
          <Text className="text-xs font-bold text-bold-primary">NEXT: LEVEL {userStats.level + 1}</Text>
        </View>
      </View>
    </View>
  );
}
