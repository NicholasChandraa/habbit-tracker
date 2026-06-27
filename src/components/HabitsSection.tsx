import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
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

export function HabitsSection({ habits, selectedCategory, onCategoryChange, onComplete, onDelete }: Props) {
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
          <HabitCardItem key={habit.id} habit={habit} onComplete={() => onComplete(habit)} onDelete={() => onDelete(habit.id)} />
        ))
      )}

      {/* Completed Today */}
      {done.length > 0 && (
        <CompletedTodaySection done={done} onComplete={onComplete} onDelete={onDelete} />
      )}
    </View>
  );
}

const PAGE_SIZE = 5;

function CompletedTodaySection({ done, onComplete, onDelete }: {
  done: Habit[];
  onComplete: (habit: Habit) => void;
  onDelete: (habitId: number) => void;
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
        <HabitCardItem key={habit.id} habit={habit} onComplete={() => onComplete(habit)} onDelete={() => onDelete(habit.id)} />
      ))}
      {remaining > 0 && (
        <TouchableOpacity className="items-center py-3 bg-bold-primary-container rounded-xl" onPress={() => setVisibleCount(v => v + PAGE_SIZE)}>
          <Text className="text-bold-primary font-black text-[13px]">Show More ({remaining} remaining)</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function HabitCardItem({ habit, onComplete, onDelete }: { habit: Habit; onComplete: () => void; onDelete: () => void }) {
  const isDoneToday = habit.lastCompletedDate === TODAY;
  const isFeatured = !isDoneToday && (habit.difficulty === 'Medium' || habit.difficulty === 'Hard');
  const diffColor = getDifficultyColor(habit.difficulty);

  const cardBg = isDoneToday ? Colors.boldSurface : isFeatured ? Colors.boldPrimary : Colors.boldSurface;
  const contentColor = isFeatured ? Colors.white : Colors.boldPrimaryText;
  const subColor = isFeatured ? 'rgba(255,255,255,0.8)' : Colors.boldSecondaryText;
  const borderColor = isFeatured ? Colors.boldPrimary : Colors.boldBorder;

  return (
    <View className="rounded-[28px] border-2 p-4" style={{ backgroundColor: cardBg, borderColor, opacity: isDoneToday ? 0.6 : 1 }}>
      <View className="flex-row items-center gap-4">
        {/* Check Button */}
        <TouchableOpacity
          disabled={isDoneToday}
          onPress={onComplete}
          className="w-11 h-11 rounded-full border-2 items-center justify-center"
          style={{
            backgroundColor: isDoneToday ? Colors.boldPrimary : isFeatured ? 'rgba(255,255,255,0.2)' : Colors.boldPrimaryContainer,
            borderColor: isDoneToday ? Colors.boldPrimary : isFeatured ? Colors.white : Colors.boldPrimary,
          }}
        >
          <Ionicons name="checkmark" size={isDoneToday ? 24 : 20}
            color={isDoneToday ? Colors.white : isFeatured ? Colors.white : Colors.boldPrimary} />
        </TouchableOpacity>

        {/* Details */}
        <View className="flex-1 gap-1">
          <View className="flex-row gap-1.5">
            <View className="rounded-[6px] px-2 py-0.5"
              style={{ backgroundColor: isFeatured ? 'rgba(255,255,255,0.2)' : Colors.boldPrimaryContainer }}>
              <Text className="text-[11px] font-black" style={{ color: isFeatured ? Colors.white : Colors.boldPrimary }}>{habit.category}</Text>
            </View>
            <View className="rounded-[6px] px-2 py-0.5"
              style={{ backgroundColor: isFeatured ? 'rgba(255,255,255,0.2)' : `${diffColor}26` }}>
              <Text className="text-[11px] font-black" style={{ color: isFeatured ? Colors.white : diffColor }}>{habit.difficulty}</Text>
            </View>
          </View>

          <Text className="text-base font-black" style={{ color: contentColor, textDecorationLine: isDoneToday ? 'line-through' : 'none' }}>
            {habit.name}
          </Text>

          {habit.description ? (
            <Text className="text-xs" style={{ color: subColor }} numberOfLines={2}>{habit.description}</Text>
          ) : null}

          {habit.dueDate ? (
            <Text className="text-[11px] font-bold" style={{ color: subColor }}>📅 Due {habit.dueDate}</Text>
          ) : null}

          <View className="flex-row items-center gap-3 mt-1">
            <Text className="text-xs font-black" style={{ color: isFeatured ? Colors.white : Colors.boldCoral }}>
              🔥 {habit.streak} Streak
            </Text>
            <View className="flex-row items-center gap-0.5">
              <Ionicons name="star" size={14} color={isFeatured ? Colors.white : Colors.boldGold} />
              <Text className="text-[11px] font-bold" style={{ color: subColor }}>
                +{habit.difficulty === 'Easy' ? 10 : habit.difficulty === 'Medium' ? 20 : 40} XP / +{habit.difficulty === 'Easy' ? 5 : habit.difficulty === 'Medium' ? 10 : 20}g
              </Text>
            </View>
          </View>
        </View>

        {/* Right Action */}
        {isFeatured ? (
          <TouchableOpacity className="rounded-full px-3.5 py-2 bg-bold-pink" onPress={onComplete}>
            <Text className="font-black text-xs" style={{ color: Colors.boldDarkPinkText }}>START</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity className="p-1" onPress={onDelete}>
            <Ionicons name="trash-outline" size={22} color="rgba(198,40,40,0.8)" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
