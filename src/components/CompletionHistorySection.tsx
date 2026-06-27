import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchCompletions, countCompletions, HabitCompletion } from '../database';
import { Colors } from '../theme/colors';

const PAGE_SIZE = 10;

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'Easy': return Colors.boldEmerald;
    case 'Medium': return Colors.boldCyan;
    case 'Hard': return Colors.boldMagenta;
    default: return Colors.boldPrimary;
  }
}

export function CompletionHistorySection() {
  const [items, setItems] = useState<HabitCompletion[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const load = useCallback(async (reset = false) => {
    setLoading(true);
    const offset = reset ? 0 : items.length;
    const [rows, count] = await Promise.all([
      fetchCompletions(PAGE_SIZE, offset),
      reset ? countCompletions() : Promise.resolve(total),
    ]);
    setItems(prev => reset ? rows : [...prev, ...rows]);
    if (reset) setTotal(count);
    setLoading(false);
  }, [items.length, total]);

  useEffect(() => {
    if (expanded && items.length === 0) load(true);
  }, [expanded]);

  return (
    <View className="gap-3">
      <TouchableOpacity className="flex-row items-center gap-2" onPress={() => setExpanded(v => !v)}>
        <Ionicons name="time" size={22} color={Colors.boldPrimary} />
        <Text className="flex-1 text-sm font-black text-bold-text tracking-widest">COMPLETION HISTORY</Text>
        {total > 0 && (
          <Text className="bg-bold-primary-container text-bold-primary font-black text-xs px-2 py-0.5 rounded-lg overflow-hidden">{total}</Text>
        )}
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.boldSecondaryText} />
      </TouchableOpacity>

      {expanded && (
        <View className="gap-2">
          {items.length === 0 && !loading && (
            <View className="p-4 items-center bg-bold-surface rounded-2xl border-2 border-bold-border">
              <Text className="text-[13px] text-bold-text-secondary">No completions yet.</Text>
            </View>
          )}

          {items.map((item) => (
            <View key={item.id} className="flex-row items-center gap-3 bg-bold-surface rounded-2xl border-2 border-bold-border px-4 py-3">
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: getDifficultyColor(item.difficulty) }} />
              <View className="flex-1">
                <Text className="text-sm font-black text-bold-text">{item.habitName}</Text>
                <Text className="text-[11px] text-bold-text-secondary mt-0.5">{item.category} · {item.difficulty}</Text>
              </View>
              <Text className="text-[11px] font-bold text-bold-text-secondary">{item.completedDate}</Text>
            </View>
          ))}

          {loading && <ActivityIndicator color={Colors.boldPrimary} className="my-2" />}

          {!loading && items.length < total && (
            <TouchableOpacity className="items-center py-3 bg-bold-primary-container rounded-xl" onPress={() => load(false)}>
              <Text className="text-bold-primary font-black text-[13px]">Load More ({total - items.length} remaining)</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
