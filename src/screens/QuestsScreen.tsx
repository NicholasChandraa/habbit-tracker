import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '../context/HabitContext';
import { HabitsSection } from '../components/HabitsSection';
import { CompletionHistorySection } from '../components/CompletionHistorySection';
import { AddHabitModal } from '../components/AddHabitModal';
import { Colors } from '../theme/colors';

export function QuestsScreen() {
  const { habits, addHabit, removeHabit, markHabitComplete } = useHabits();
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

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
        />
        <CompletionHistorySection />
        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-8 right-7 w-16 h-16 rounded-[20px] bg-bold-primary items-center justify-center"
        style={{ elevation: 10, shadowColor: Colors.boldPrimary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12 }}
        onPress={() => setShowModal(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>

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
