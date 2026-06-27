import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar,
} from 'react-native';
import {
  SafeAreaView
} from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '../context/HabitContext';
import { PlayerProfileCard } from '../components/PlayerProfileCard';
import { HeroStreakWidget } from '../components/HeroStreakWidget';
import { DailyQuestsSection } from '../components/DailyQuestsSection';
import { HabitsSection } from '../components/HabitsSection';
import { GoldShopSection } from '../components/GoldShopSection';
import { AddHabitModal } from '../components/AddHabitModal';
import { TodayProgressCard } from '../components/TodayProgressCard';
import { Colors } from '../theme/colors';

export function DashboardScreen() {
  const {
    userStats, habits, quests,
    addHabit, removeHabit, markHabitComplete,
    claimQuest, purchaseItem, purchasePotion, changeAvatar,
    refresh,
  } = useHabits();

  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.boldBg} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Row */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* Level Badge */}
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>{userStats.level}</Text>
            </View>
            <View>
              <Text style={styles.masterLabel}>MASTER LEVEL</Text>
              <Text style={styles.titleLabel}>{userStats.equippedTitle}</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            {/* Coins */}
            <View style={styles.coinsChip}>
              <Text>⚡️</Text>
              <Text style={styles.coinsText}>{userStats.coins}g</Text>
            </View>

            {/* Refresh Button */}
            <TouchableOpacity style={styles.refreshBtn} onPress={refresh}>
              <Ionicons name="refresh" size={18} color={Colors.boldPrimaryText} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 1. Today Progress */}
        <TodayProgressCard habits={habits} />

        {/* 2. Player Profile Card */}
        <PlayerProfileCard userStats={userStats} />

        {/* 2. Hero Streak Widget */}
        <HeroStreakWidget streakCount={userStats.streak} />

        {/* 3. Daily Quest Board */}
        <DailyQuestsSection quests={quests} onClaim={claimQuest} />

        {/* 4. Habits Section */}
        <HabitsSection
          habits={habits}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onComplete={markHabitComplete}
          onDelete={removeHabit}
        />

        {/* 5. Gold Shop */}
        <GoldShopSection
          userStats={userStats}
          onBuyItem={purchaseItem}
          onBuyPotion={purchasePotion}
          onEquipAvatar={changeAvatar}
        />

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowModal(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>

      {/* Add Habit Modal */}
      <AddHabitModal
        visible={showModal}
        onDismiss={() => setShowModal(false)}
        onAdd={async (name, desc, diff, cat, dueDate) => {
          setShowModal(false);
          await addHabit(name, desc, diff, cat, dueDate);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.boldBg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  levelBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.boldPrimary,
    borderWidth: 4,
    borderColor: Colors.boldPrimaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadgeText: {
    color: Colors.white,
    fontWeight: '900',
    fontSize: 18,
  },
  masterLabel: {
    fontSize: 11,
    color: Colors.boldPrimary,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  titleLabel: {
    fontSize: 16,
    color: Colors.boldPrimaryText,
    fontWeight: '900',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coinsChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.boldPrimaryContainer,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  coinsText: {
    fontWeight: '900',
    color: Colors.boldPrimaryText,
    fontSize: 14,
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.boldBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 28,
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.boldPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.boldPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
});
