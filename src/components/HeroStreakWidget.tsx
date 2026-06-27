import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  streakCount: number;
}

export function HeroStreakWidget({ streakCount }: Props) {
  return (
    <View className="items-center justify-center py-3">
      <View className="bg-bold-primary-container rounded-full px-3.5 py-1.5 mb-1">
        <Text className="text-bold-primary font-black text-[11px] tracking-widest">CURRENT STREAK</Text>
      </View>
      <Text style={{ fontSize: 110, fontWeight: '900', fontStyle: 'italic', lineHeight: 120, letterSpacing: -4 }} className="text-bold-text">
        {streakCount}
      </Text>
      <Text className="text-base font-black text-bold-text-secondary" style={{ marginTop: -8 }}>
        {streakCount === 1 ? 'Day Unstoppable' : 'Days Unstoppable'}
      </Text>
    </View>
  );
}
