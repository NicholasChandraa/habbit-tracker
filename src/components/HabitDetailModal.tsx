import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Habit } from '../database/types';
import { Colors } from '../theme/colors';

interface Props {
  habit: Habit | null;
  onDismiss: () => void;
  onComplete: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
}

const TODAY = (() => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
})();

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'Easy': return Colors.boldEmerald;
    case 'Medium': return Colors.boldCyan;
    case 'Hard': return Colors.boldMagenta;
    default: return Colors.boldPrimary;
  }
}

export function HabitDetailModal({ habit, onDismiss, onComplete, onEdit }: Props) {
  if (!habit) return null;

  const isDoneToday = habit.lastCompletedDate === TODAY;
  const diffColor = getDifficultyColor(habit.difficulty);
  const xp = habit.difficulty === 'Easy' ? 10 : habit.difficulty === 'Medium' ? 20 : 40;
  const coins = habit.difficulty === 'Easy' ? 5 : habit.difficulty === 'Medium' ? 10 : 20;

  const handleShare = async () => {
    const parts = [
      `📋 Quest: ${habit.name}`,
      habit.description ? `\n${habit.description}` : '',
      `\n⚔️ Difficulty: ${habit.difficulty}`,
      `🏷️ Category: ${habit.category}`,
      habit.dueDate ? `📅 Due: ${habit.dueDate}` : '',
      `🔥 Streak: ${habit.streak} days`,
    ].filter(Boolean);
    await Share.share({ message: parts.join('\n') });
  };

  return (
    <Modal visible={!!habit} animationType="slide" onRequestClose={onDismiss}>
      <SafeAreaView className="flex-1 bg-bold-bg">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
          <TouchableOpacity onPress={onDismiss} className="w-9 h-9 rounded-full bg-bold-border items-center justify-center">
            <Ionicons name="close" size={20} color={Colors.boldPrimaryText} />
          </TouchableOpacity>
          <Text className="text-sm font-black text-bold-text tracking-widest">QUEST DETAIL</Text>
          <View className="flex-row gap-2">
            <TouchableOpacity onPress={handleShare} className="w-9 h-9 rounded-full bg-bold-border items-center justify-center">
              <Ionicons name="share-social-outline" size={18} color={Colors.boldPrimaryText} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { onDismiss(); onEdit(habit); }}
              className="w-9 h-9 rounded-full bg-bold-border items-center justify-center"
            >
              <Ionicons name="pencil-outline" size={18} color={Colors.boldPrimaryText} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingVertical: 20, gap: 20 }} showsVerticalScrollIndicator={false}>
          {/* Badges */}
          <View className="flex-row gap-2">
            <View className="rounded-xl px-3 py-1.5" style={{ backgroundColor: Colors.boldPrimaryContainer }}>
              <Text className="text-xs font-black" style={{ color: Colors.boldPrimary }}>{habit.category}</Text>
            </View>
            <View className="rounded-xl px-3 py-1.5" style={{ backgroundColor: `${diffColor}22` }}>
              <Text className="text-xs font-black" style={{ color: diffColor }}>{habit.difficulty}</Text>
            </View>
            {isDoneToday && (
              <View className="rounded-xl px-3 py-1.5" style={{ backgroundColor: `${Colors.boldEmerald}22` }}>
                <Text className="text-xs font-black" style={{ color: Colors.boldEmerald }}>✓ DONE TODAY</Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text className="text-2xl font-black text-bold-text leading-8"
            style={{ textDecorationLine: isDoneToday ? 'line-through' : 'none' }}>
            {habit.name}
          </Text>

          {/* Description */}
          {habit.description ? (
            <View className="bg-bold-surface rounded-2xl p-4 border-2 border-bold-border">
              <Text className="text-sm font-black text-bold-text-secondary mb-1">Description</Text>
              <Text className="text-base text-bold-text leading-6">{habit.description}</Text>
            </View>
          ) : (
            <View className="bg-bold-surface rounded-2xl p-4 border-2 border-bold-border">
              <Text className="text-sm text-bold-text-secondary italic">No description added.</Text>
            </View>
          )}

          {/* Stats row */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-bold-surface rounded-2xl p-4 border-2 border-bold-border items-center gap-1">
              <Text className="text-2xl font-black text-bold-text">{habit.streak}</Text>
              <Text className="text-xs text-bold-text-secondary font-bold">🔥 STREAK</Text>
            </View>
            <View className="flex-1 bg-bold-surface rounded-2xl p-4 border-2 border-bold-border items-center gap-1">
              <Text className="text-2xl font-black" style={{ color: Colors.boldPrimary }}>+{xp}</Text>
              <Text className="text-xs text-bold-text-secondary font-bold">⭐ XP</Text>
            </View>
            <View className="flex-1 bg-bold-surface rounded-2xl p-4 border-2 border-bold-border items-center gap-1">
              <Text className="text-2xl font-black" style={{ color: Colors.boldGold }}>+{coins}</Text>
              <Text className="text-xs text-bold-text-secondary font-bold">⚡ GOLD</Text>
            </View>
          </View>

          {/* Due date */}
          {habit.dueDate ? (
            <View className="flex-row items-center gap-2 bg-bold-surface rounded-2xl p-4 border-2 border-bold-border">
              <Ionicons name="calendar-outline" size={18} color={Colors.boldSecondaryText} />
              <Text className="text-sm text-bold-text">Due date: <Text className="font-black">{habit.dueDate}</Text></Text>
            </View>
          ) : null}
        </ScrollView>

        {/* Complete button */}
        <View className="px-5 pb-6 pt-3">
          <TouchableOpacity
            className="rounded-2xl py-4 items-center"
            style={{
              backgroundColor: isDoneToday ? Colors.boldBorder : Colors.boldPrimary,
              opacity: isDoneToday ? 0.6 : 1,
            }}
            onPress={() => { if (!isDoneToday) { onComplete(habit); onDismiss(); } }}
            disabled={isDoneToday}
          >
            <Text className="font-black text-base" style={{ color: isDoneToday ? Colors.boldSecondaryText : Colors.white }}>
              {isDoneToday ? '✓ Completed Today' : '⚔️ Complete Quest'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
