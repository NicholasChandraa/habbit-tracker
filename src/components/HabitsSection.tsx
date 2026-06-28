import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Share, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Habit, CATEGORIES } from '../database/types';
import { Colors } from '../theme/colors';

interface Props {
  habits: Habit[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  onComplete: (habit: Habit) => void;
  onDelete: (habitId: number) => void;
  onEdit: (habit: Habit) => void;
  onViewDetail: (habit: Habit) => void;
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

export function HabitsSection({ habits, selectedCategory, onCategoryChange, onComplete, onDelete, onEdit, onViewDetail }: Props) {
  const filtered = selectedCategory === 'All' ? habits : habits.filter(h => h.category === selectedCategory);
  const active = filtered.filter(h => h.lastCompletedDate !== TODAY);
  const done   = filtered.filter(h => h.lastCompletedDate === TODAY);

  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-2">
        <Ionicons name="list" size={22} color={Colors.boldPrimary} />
        <Text className="text-sm font-black text-bold-text tracking-widest">ACTIVE QUESTS (HABITS)</Text>
      </View>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 2 }}>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              className="border-2 rounded-xl px-3.5 py-2"
              style={{
                backgroundColor: isSelected ? Colors.boldPrimary : Colors.boldSurface,
                borderColor: isSelected ? Colors.boldPrimary : Colors.boldBorder,
              }}
              onPress={() => onCategoryChange(cat)}
            >
              <Text className="font-black text-sm" style={{ color: isSelected ? Colors.white : Colors.boldPrimaryText }}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Active Habits */}
      {active.length === 0 ? (
        <View className="bg-bold-surface rounded-[28px] border-2 border-bold-border p-8 items-center gap-3">
          <Ionicons name="information-circle-outline" size={36} color={Colors.boldSecondaryText} />
          <Text className="text-bold-text-secondary text-center text-sm">
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
            onEdit={() => onEdit(habit)}
            onViewDetail={() => onViewDetail(habit)}
          />
        ))
      )}

      {/* Completed Today */}
      {done.length > 0 && (
        <CompletedTodaySection done={done} onComplete={onComplete} onDelete={onDelete} onEdit={onEdit} onViewDetail={onViewDetail} />
      )}
    </View>
  );
}

const PAGE_SIZE = 5;

function CompletedTodaySection({ done, onComplete, onDelete, onEdit, onViewDetail }: {
  done: Habit[];
  onComplete: (habit: Habit) => void;
  onDelete: (habitId: number) => void;
  onEdit: (habit: Habit) => void;
  onViewDetail: (habit: Habit) => void;
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = done.slice(0, visibleCount);
  const remaining = done.length - visibleCount;

  return (
    <View className="gap-3 mt-1">
      <View className="flex-row items-center gap-2">
        <Ionicons name="checkmark-circle" size={22} color={Colors.boldEmerald} />
        <Text className="text-sm font-black tracking-widest" style={{ color: Colors.boldEmerald }}>
          COMPLETED TODAY ({done.length})
        </Text>
      </View>
      {visible.map((habit) => (
        <HabitCardItem
          key={habit.id}
          habit={habit}
          onComplete={() => onComplete(habit)}
          onDelete={() => onDelete(habit.id)}
          onEdit={() => onEdit(habit)}
          onViewDetail={() => onViewDetail(habit)}
        />
      ))}
      {remaining > 0 && (
        <TouchableOpacity className="items-center py-3 bg-bold-primary-container rounded-xl" onPress={() => setVisibleCount(v => v + PAGE_SIZE)}>
          <Text className="text-bold-primary font-black text-[13px]">Show More ({remaining} remaining)</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function HabitCardItem({ habit, onComplete, onDelete, onEdit, onViewDetail }: {
  habit: Habit;
  onComplete: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onViewDetail: () => void;
}) {
  const isDoneToday = habit.lastCompletedDate === TODAY;
  const diffColor = getDifficultyColor(habit.difficulty);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleShare = async () => {
    setMenuVisible(false);
    const parts = [
      `📋 Quest: ${habit.name}`,
      habit.description ? habit.description : '',
      `⚔️ ${habit.difficulty} | 🏷️ ${habit.category}`,
      `🔥 Streak: ${habit.streak} days`,
    ].filter(Boolean);
    await Share.share({ message: parts.join('\n') });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onViewDetail}
      className="rounded-[28px] border-2 p-4"
      style={{ backgroundColor: Colors.boldSurface, borderColor: Colors.boldBorder, opacity: isDoneToday ? 0.6 : 1 }}
    >
      <View className="flex-row items-center gap-4">
        {/* Check Button */}
        <TouchableOpacity
          disabled={isDoneToday}
          onPress={onComplete}
          className="w-11 h-11 rounded-full border-2 items-center justify-center"
          style={{
            backgroundColor: isDoneToday ? Colors.boldPrimary : Colors.boldPrimaryContainer,
            borderColor: Colors.boldPrimary,
          }}
        >
          <Ionicons name="checkmark" size={isDoneToday ? 24 : 20}
            color={isDoneToday ? Colors.white : Colors.boldPrimary} />
        </TouchableOpacity>

        {/* Details */}
        <View className="flex-1 gap-1">
          <View className="flex-row gap-1.5">
            <View className="rounded-[6px] px-2 py-0.5"
              style={{ backgroundColor: Colors.boldPrimaryContainer }}>
              <Text className="text-[11px] font-black" style={{ color: Colors.boldPrimary }}>{habit.category}</Text>
            </View>
            <View className="rounded-[6px] px-2 py-0.5"
              style={{ backgroundColor: `${diffColor}26` }}>
              <Text className="text-[11px] font-black" style={{ color: diffColor }}>{habit.difficulty}</Text>
            </View>
          </View>

          <Text className="text-base font-black" style={{ color: Colors.boldPrimaryText, textDecorationLine: isDoneToday ? 'line-through' : 'none' }}>
            {habit.name}
          </Text>

          {habit.description ? (
            <Text className="text-xs" style={{ color: Colors.boldSecondaryText }} numberOfLines={1}>{habit.description}</Text>
          ) : null}

          {habit.dueDate ? (
            <Text className="text-[11px] font-bold" style={{ color: Colors.boldSecondaryText }}>📅 Due {habit.dueDate}</Text>
          ) : null}

          <View className="flex-row items-center gap-3 mt-1">
            <Text className="text-xs font-black" style={{ color: Colors.boldCoral }}>
              🔥 {habit.streak} Streak
            </Text>
            <View className="flex-row items-center gap-0.5">
              <Ionicons name="star" size={14} color={Colors.boldGold} />
              <Text className="text-[11px] font-bold" style={{ color: Colors.boldSecondaryText }}>
                +{habit.difficulty === 'Easy' ? 10 : habit.difficulty === 'Medium' ? 20 : 40} XP / +{habit.difficulty === 'Easy' ? 5 : habit.difficulty === 'Medium' ? 10 : 20}g
              </Text>
            </View>
          </View>
        </View>

        {/* Three-dot menu */}
        <TouchableOpacity className="p-2" onPress={() => setMenuVisible(true)}>
          <Ionicons name="ellipsis-vertical" size={20} color={Colors.boldSecondaryText} />
        </TouchableOpacity>

        <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
          <TouchableOpacity className="flex-1" activeOpacity={1} onPress={() => setMenuVisible(false)}
            style={{ backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' }}>
            <TouchableOpacity activeOpacity={1} className="bg-bold-surface rounded-t-[28px] px-5 pt-5 pb-8 gap-1">
              <Text className="text-xs font-black text-bold-text-secondary tracking-widest mb-2">{habit.name}</Text>
              <TouchableOpacity className="flex-row items-center gap-4 py-3.5" onPress={() => { setMenuVisible(false); onEdit(); }}>
                <Ionicons name="pencil-outline" size={22} color={Colors.boldPrimary} />
                <Text className="text-base font-bold text-bold-text">Edit Quest</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center gap-4 py-3.5" onPress={handleShare}>
                <Ionicons name="share-social-outline" size={22} color={Colors.boldPrimary} />
                <Text className="text-base font-bold text-bold-text">Share</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center gap-4 py-3.5" onPress={() => { setMenuVisible(false); onDelete(); }}>
                <Ionicons name="trash-outline" size={22} color="rgba(198,40,40,0.8)" />
                <Text className="text-base font-bold" style={{ color: 'rgba(198,40,40,0.9)' }}>Delete Quest</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </View>
    </TouchableOpacity>
  );
}
