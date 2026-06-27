import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { DIFFICULTIES, CATEGORIES } from '../database/types';
import { Colors } from '../theme/colors';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onAdd: (name: string, description: string, difficulty: string, category: string, dueDate: string) => void;
}

function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function AddHabitModal({ visible, onDismiss, onAdd }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<string>('Easy');
  const [category, setCategory] = useState<string>('Health');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showIOSPicker, setShowIOSPicker] = useState(false);

  const openDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: dueDate ?? new Date(),
        minimumDate: new Date(),
        mode: 'date',
        onChange: (_, selected) => { if (selected) setDueDate(selected); },
      });
    } else {
      setShowIOSPicker(true);
    }
  };

  const reset = () => {
    setName(''); setDescription(''); setDifficulty('Easy');
    setCategory('Health'); setDueDate(null); setShowIOSPicker(false);
  };

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), description.trim(), difficulty, category, dueDate ? toDateString(dueDate) : '');
    reset();
  };

  const handleDismiss = () => { reset(); onDismiss(); };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleDismiss}>
      <View className="flex-1 justify-center px-6" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View className="bg-bold-surface rounded-[28px] p-6 gap-4" style={{ maxHeight: '90%' }}>
            <Text className="text-xl font-black text-bold-text">Forge New Quest</Text>

            <ScrollView style={{ flexGrow: 0 }} showsVerticalScrollIndicator={false}>
              <TextInput
                className="border-2 border-bold-border rounded-xl px-4 py-3 text-[15px] text-bold-text bg-bold-bg"
                placeholder="Quest Title (e.g. Daily Zen)"
                placeholderTextColor={Colors.boldSecondaryText}
                value={name}
                onChangeText={setName}
              />

              <TextInput
                className="border-2 border-bold-border rounded-xl px-4 py-3 text-[15px] text-bold-text bg-bold-bg mt-3"
                placeholder="Quest Description (Optional)"
                placeholderTextColor={Colors.boldSecondaryText}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={2}
              />

              <Text className="text-sm font-black text-bold-text mt-4 mb-2">Difficulty Rank</Text>
              <View className="flex-row gap-2">
                {DIFFICULTIES.map((diff) => {
                  const isSelected = difficulty === diff;
                  return (
                    <TouchableOpacity
                      key={diff}
                      className="flex-1 rounded-xl px-3.5 py-2.5 items-center"
                      style={{ backgroundColor: isSelected ? Colors.boldPrimary : Colors.boldPrimaryContainer }}
                      onPress={() => setDifficulty(diff)}
                    >
                      <Text className="text-[13px] font-black" style={{ color: isSelected ? Colors.white : Colors.boldPrimaryText }}>
                        {diff}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text className="text-sm font-black text-bold-text mt-4 mb-2">Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                {CATEGORIES.filter(c => c !== 'All').map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      className="rounded-xl px-3.5 py-2.5 items-center"
                      style={{ backgroundColor: isSelected ? Colors.boldPrimary : Colors.boldPrimaryContainer }}
                      onPress={() => setCategory(cat)}
                    >
                      <Text className="text-[13px] font-black" style={{ color: isSelected ? Colors.white : Colors.boldPrimaryText }}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <Text className="text-sm font-black text-bold-text mt-4 mb-2">Due Date (Optional)</Text>
              <TouchableOpacity
                className="flex-row items-center justify-between border-2 border-bold-border rounded-xl px-4 py-3 bg-bold-bg"
                onPress={openDatePicker}
              >
                <Text className="text-[15px] text-bold-text">{dueDate ? toDateString(dueDate) : 'No due date'}</Text>
                {dueDate && (
                  <TouchableOpacity onPress={() => setDueDate(null)} className="px-1">
                    <Text className="text-sm text-bold-text-secondary">✕</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>

              {showIOSPicker && (
                <DateTimePicker
                  value={dueDate ?? new Date()}
                  minimumDate={new Date()}
                  mode="date"
                  display="inline"
                  onChange={(_, selected) => { if (selected) setDueDate(selected); }}
                />
              )}
            </ScrollView>

            <View className="flex-row justify-end items-center gap-3 mt-2">
              <TouchableOpacity className="px-3 py-2" onPress={handleDismiss}>
                <Text className="text-bold-text-secondary font-bold text-sm">CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-bold-primary rounded-xl px-6 py-2.5"
                style={{ opacity: name.trim() ? 1 : 0.4 }}
                onPress={handleAdd}
                disabled={!name.trim()}
              >
                <Text className="text-white font-black text-sm">FORGE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
