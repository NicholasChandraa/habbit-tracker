import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Habit, CATEGORIES } from '../database/types';
import { Colors } from '../theme/colors';

interface Props {
  habits: Habit[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  onComplete: (habit: Habit) => void;
  onDelete: (habitId: number) => void;
}

const TODAY = (() => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
})();

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'Easy': return Colors.boldEmerald;
    case 'Medium': return Colors.boldCyan;
    case 'Hard': return Colors.boldMagenta;
    default: return Colors.boldPrimary;
  }
}

export function HabitsSection({ habits, selectedCategory, onCategoryChange, onComplete, onDelete }: Props) {
  const filtered = selectedCategory === 'All'
    ? habits
    : habits.filter(h => h.category === selectedCategory);

  const active = filtered.filter(h => h.lastCompletedDate !== TODAY);
  const done   = filtered.filter(h => h.lastCompletedDate === TODAY);

  return (
    <View style={styles.section}>
      {/* Header */}
      <View style={styles.sectionHeader}>
        <Ionicons name="list" size={22} color={Colors.boldPrimary} />
        <Text style={styles.sectionTitle}>ACTIVE QUESTS (HABITS)</Text>
      </View>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.filterChip, isSelected && styles.filterChipActive]}
              onPress={() => onCategoryChange(cat)}
            >
              <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Active Habits */}
      {active.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="information-circle-outline" size={36} color={Colors.boldSecondaryText} />
          <Text style={styles.emptyText}>
            {selectedCategory === 'All'
              ? 'No Active Quests yet. Forge one to start earning XP and Gold!'
              : `No quests under category '${selectedCategory}'.`}
          </Text>
        </View>
      ) : (
        active.map((habit) => (
          <HabitCardItem
            key={habit.id}
            habit={habit}
            onComplete={() => onComplete(habit)}
            onDelete={() => onDelete(habit.id)}
          />
        ))
      )}

      {/* Completed Today */}
      {done.length > 0 && (
        <View style={styles.completedSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="checkmark-circle" size={22} color={Colors.boldEmerald} />
            <Text style={[styles.sectionTitle, { color: Colors.boldEmerald }]}>COMPLETED TODAY</Text>
          </View>
          {done.map((habit) => (
            <HabitCardItem
              key={habit.id}
              habit={habit}
              onComplete={() => onComplete(habit)}
              onDelete={() => onDelete(habit.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

function HabitCardItem({
  habit,
  onComplete,
  onDelete,
}: {
  habit: Habit;
  onComplete: () => void;
  onDelete: () => void;
}) {
  const isDoneToday = habit.lastCompletedDate === TODAY;
  const isFeatured = !isDoneToday && (habit.difficulty === 'Medium' || habit.difficulty === 'Hard');
  const diffColor = getDifficultyColor(habit.difficulty);

  const containerBg = isDoneToday
    ? Colors.boldSurface
    : isFeatured
    ? Colors.boldPrimary
    : Colors.boldSurface;

  const contentColor = isFeatured ? Colors.white : Colors.boldPrimaryText;
  const subColor = isFeatured ? 'rgba(255,255,255,0.8)' : Colors.boldSecondaryText;
  const borderColor = isFeatured ? Colors.boldPrimary : Colors.boldBorder;

  return (
    <View style={[styles.habitCard, { backgroundColor: containerBg, borderColor, opacity: isDoneToday ? 0.6 : 1 }]}>
      <View style={styles.habitRow}>
        {/* Checkmark Button */}
        <TouchableOpacity
          disabled={isDoneToday}
          onPress={onComplete}
          style={[
            styles.checkBtn,
            {
              backgroundColor: isDoneToday
                ? Colors.boldPrimary
                : isFeatured
                ? 'rgba(255,255,255,0.2)'
                : Colors.boldPrimaryContainer,
              borderColor: isDoneToday
                ? Colors.boldPrimary
                : isFeatured
                ? Colors.white
                : Colors.boldPrimary,
            },
          ]}
        >
          <Ionicons
            name="checkmark"
            size={isDoneToday ? 24 : 20}
            color={isDoneToday ? Colors.white : isFeatured ? Colors.white : Colors.boldPrimary}
          />
        </TouchableOpacity>

        {/* Details */}
        <View style={styles.habitDetails}>
          <View style={styles.tagsRow}>
            <View style={[styles.tag, { backgroundColor: isFeatured ? 'rgba(255,255,255,0.2)' : Colors.boldPrimaryContainer }]}>
              <Text style={[styles.tagText, { color: isFeatured ? Colors.white : Colors.boldPrimary }]}>
                {habit.category}
              </Text>
            </View>
            <View style={[styles.tag, { backgroundColor: isFeatured ? 'rgba(255,255,255,0.2)' : `${diffColor}26` }]}>
              <Text style={[styles.tagText, { color: isFeatured ? Colors.white : diffColor }]}>
                {habit.difficulty}
              </Text>
            </View>
          </View>

          <Text style={[
            styles.habitName,
            { color: contentColor, textDecorationLine: isDoneToday ? 'line-through' : 'none' }
          ]}>
            {habit.name}
          </Text>

          {habit.description ? (
            <Text style={[styles.habitDesc, { color: subColor }]} numberOfLines={2}>
              {habit.description}
            </Text>
          ) : null}

          <View style={styles.habitMeta}>
            <Text style={[styles.streakText, { color: isFeatured ? Colors.white : Colors.boldCoral }]}>
              🔥 {habit.streak} Streak
            </Text>
            <View style={styles.rewardRow}>
              <Ionicons name="star" size={14} color={isFeatured ? Colors.white : Colors.boldGold} />
              <Text style={[styles.rewardText, { color: subColor }]}>
                +{habit.difficulty === 'Easy' ? 10 : habit.difficulty === 'Medium' ? 20 : 40} XP / +{habit.difficulty === 'Easy' ? 5 : habit.difficulty === 'Medium' ? 10 : 20}g
              </Text>
            </View>
          </View>
        </View>

        {/* Right Action */}
        {isFeatured ? (
          <TouchableOpacity style={styles.startButton} onPress={onComplete}>
            <Text style={styles.startButtonText}>START</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={22} color="rgba(198,40,40,0.8)" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  completedSection: { gap: 12, marginTop: 4 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: {
    fontSize: 14, fontWeight: '900', color: Colors.boldPrimaryText, letterSpacing: 1,
  },
  filterRow: { gap: 8, paddingBottom: 2 },
  filterChip: {
    backgroundColor: Colors.boldSurface,
    borderWidth: 2,
    borderColor: Colors.boldBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterChipActive: {
    backgroundColor: Colors.boldPrimary,
    borderColor: Colors.boldPrimary,
  },
  filterChipText: {
    fontWeight: '900', fontSize: 14, color: Colors.boldPrimaryText,
  },
  filterChipTextActive: { color: Colors.white },
  emptyCard: {
    backgroundColor: Colors.boldSurface,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.boldBorder,
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: { color: Colors.boldSecondaryText, textAlign: 'center', fontSize: 14 },
  habitCard: {
    borderRadius: 28,
    borderWidth: 2,
    padding: 16,
  },
  habitRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  checkBtn: {
    width: 44, height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitDetails: { flex: 1, gap: 4 },
  tagsRow: { flexDirection: 'row', gap: 6 },
  tag: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: { fontSize: 11, fontWeight: '900' },
  habitName: { fontSize: 16, fontWeight: '900' },
  habitDesc: { fontSize: 12 },
  habitMeta: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 },
  streakText: { fontSize: 12, fontWeight: '900' },
  rewardRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  rewardText: { fontSize: 11, fontWeight: '700' },
  startButton: {
    backgroundColor: Colors.boldPinkAccent,
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  startButtonText: { fontWeight: '900', fontSize: 12, color: Colors.boldDarkPinkText },
  deleteBtn: { padding: 4 },
});
