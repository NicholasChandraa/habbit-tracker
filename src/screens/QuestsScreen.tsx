import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '../context/HabitContext';
import { Habit } from '../database/types';
import { HabitsSection } from '../components/HabitsSection';
import { CompletionHistorySection } from '../components/CompletionHistorySection';
import { AddHabitModal } from '../components/AddHabitModal';
import { HabitDetailModal } from '../components/HabitDetailModal';
import { Colors } from '../theme/colors';

export function QuestsScreen() {
  const { habits, addHabit, editHabit, removeHabit, markHabitComplete } = useHabits();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [detailHabit, setDetailHabit] = useState<Habit | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowAddModal(true);
  };

  const handleSaveEdit = async (updates: Partial<Pick<Habit, 'name' | 'description' | 'difficulty' | 'category' | 'dueDate'>>) => {
    if (!editingHabit) return;
    await editHabit(editingHabit.id, updates);
    setShowAddModal(false);
    setEditingHabit(null);
  };

  const handleDismissModal = () => {
    setShowAddModal(false);
    setEditingHabit(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-bold-bg">
      <StatusBar barStyle="dark-content" backgroundColor={Colors.boldBg} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24, gap: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <HabitsSection
          habits={habits}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onComplete={markHabitComplete}
          onDelete={removeHabit}
          onEdit={handleEdit}
          onViewDetail={setDetailHabit}
        />
        <CompletionHistorySection />
        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-8 right-7 w-16 h-16 rounded-[20px] bg-bold-primary items-center justify-center"
        style={{ elevation: 10, shadowColor: Colors.boldPrimary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12 }}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>

      <AddHabitModal
        visible={showAddModal}
        onDismiss={handleDismissModal}
        editHabit={editingHabit ?? undefined}
        onAdd={async (name, desc, diff, cat, dueDate) => {
          setShowAddModal(false);
          await addHabit(name, desc, diff, cat, dueDate);
        }}
        onEdit={handleSaveEdit}
      />

      <HabitDetailModal
        habit={detailHabit}
        onDismiss={() => setDetailHabit(null)}
        onComplete={async (habit) => {
          await markHabitComplete(habit);
          setDetailHabit(null);
        }}
        onEdit={(habit) => {
          setDetailHabit(null);
          handleEdit(habit);
        }}
      />
    </SafeAreaView>
  );
}
