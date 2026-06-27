import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '../context/HabitContext';
import { PlayerProfileCard } from '../components/PlayerProfileCard';
import { HeroStreakWidget } from '../components/HeroStreakWidget';
import { DailyQuestsSection } from '../components/DailyQuestsSection';
import { TodayProgressCard } from '../components/TodayProgressCard';
import { Colors } from '../theme/colors';

export function DashboardScreen() {
  const { userStats, habits, quests, claimQuest, refresh } = useHabits();

  return (
    <SafeAreaView className="flex-1 bg-bold-bg">
      <StatusBar barStyle="dark-content" backgroundColor={Colors.boldBg} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24, gap: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-2xl bg-bold-primary border-4 border-bold-primary-container items-center justify-center">
              <Text className="text-white font-black text-lg">{userStats.level}</Text>
            </View>
            <View>
              <Text className="text-[11px] text-bold-primary font-black tracking-widest">MASTER LEVEL</Text>
              <Text className="text-base font-black text-bold-text">{userStats.equippedTitle}</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            <View className="flex-row items-center gap-1 bg-bold-primary-container rounded-xl px-3 py-1.5">
              <Text>⚡️</Text>
              <Text className="font-black text-bold-text text-sm">{userStats.coins}g</Text>
            </View>
            <TouchableOpacity
              className="w-9 h-9 rounded-full bg-bold-border items-center justify-center"
              onPress={refresh}
            >
              <Ionicons name="refresh" size={18} color={Colors.boldPrimaryText} />
            </TouchableOpacity>
          </View>
        </View>

        <TodayProgressCard habits={habits} />
        <PlayerProfileCard userStats={userStats} />
        <HeroStreakWidget streakCount={userStats.streak} />
        <DailyQuestsSection quests={quests} onClaim={claimQuest} />
      </ScrollView>
    </SafeAreaView>
  );
}
