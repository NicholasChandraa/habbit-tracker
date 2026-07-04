import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Habit, DIFFICULTIES, CATEGORIES } from '../database/types';
import { Colors } from '../theme/colors';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onAdd: (name: string, description: string, difficulty: string, category: string, dueDate: string, isOneTime: boolean) => void;
  onEdit?: (updates: Partial<Pick<Habit, 'name' | 'description' | 'difficulty' | 'category' | 'dueDate' | 'isOneTime'>>) => void;
  editHabit?: Habit;
}

function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function ExpandableInput({ value, onChange, placeholder, multiline }: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  multiline?: boolean;
}) {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <View>
      <View className="border-2 border-bold-border rounded-xl bg-bold-bg" style={{ position: 'relative' }}>
        <TextInput
          className="px-4 py-3 text-[15px] text-bold-text"
          placeholder={placeholder}
          placeholderTextColor={Colors.boldSecondaryText}
          value={value}
          onChangeText={onChange}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          textAlignVertical={multiline ? 'top' : 'center'}
          style={multiline ? { minHeight: 80, paddingBottom: 32 } : { paddingRight: 30 }}
        />
        <TouchableOpacity
          onPress={() => setFullscreen(true)}
          style={{ position: 'absolute', bottom: 11, right: 8 }}
        >
          <Ionicons name="expand-outline" size={16} color={Colors.boldSecondaryText} />
        </TouchableOpacity>
      </View>

      <Modal visible={fullscreen} animationType="slide" onRequestClose={() => setFullscreen(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.boldSurface }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 2, borderBottomColor: Colors.boldBorder }}>
            <TouchableOpacity onPress={() => setFullscreen(false)} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.boldBorder, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="close" size={18} color={Colors.boldPrimaryText} />
            </TouchableOpacity>
            <Text style={{ fontSize: 12, fontWeight: '900', color: Colors.boldPrimaryText, letterSpacing: 2 }}>
              {multiline ? 'DESCRIPTION' : 'QUEST TITLE'}
            </Text>
            <TouchableOpacity onPress={() => setFullscreen(false)} style={{ backgroundColor: Colors.boldPrimary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 }}>
              <Text style={{ color: Colors.white, fontWeight: '900', fontSize: 12 }}>DONE</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={{ flex: 1, padding: 20, fontSize: 17, color: Colors.boldPrimaryText, textAlignVertical: 'top' }}
            placeholder={placeholder}
            placeholderTextColor={Colors.boldSecondaryText}
            value={value}
            onChangeText={onChange}
            multiline={multiline ?? false}
            autoFocus
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

function parseDateString(s: string): Date | null {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return isNaN(date.getTime()) ? null : date;
}

export function AddHabitModal({ visible, onDismiss, onAdd, onEdit, editHabit }: Props) {
  const isEditMode = !!editHabit;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<Habit['difficulty']>('Easy');
  const [category, setCategory] = useState<Habit['category']>('Health');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showIOSPicker, setShowIOSPicker] = useState(false);
  const [isOneTime, setIsOneTime] = useState(true); // Default to One-Time

  // Pre-fill when editing
  useEffect(() => {
    if (editHabit) {
      setName(editHabit.name);
      setDescription(editHabit.description);
      setDifficulty(editHabit.difficulty);
      setCategory(editHabit.category);
      setDueDate(parseDateString(editHabit.dueDate));
      setIsOneTime(editHabit.isOneTime);
    }
  }, [editHabit]);

  const openDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: dueDate ?? new Date(),
        mode: 'date',
        onValueChange: (_, selected) => { if (selected) setDueDate(selected); },
      });
    } else {
      setShowIOSPicker(true);
    }
  };

  const reset = () => {
    setName(''); setDescription(''); setDifficulty('Easy');
    setCategory('Health'); setDueDate(null); setShowIOSPicker(false);
    setIsOneTime(true);
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    const dueDateStr = dueDate ? toDateString(dueDate) : '';
    if (isEditMode && onEdit) {
      onEdit({ name: name.trim(), description: description.trim(), difficulty, category, dueDate: dueDateStr, isOneTime });
    } else {
      onAdd(name.trim(), description.trim(), difficulty, category, dueDateStr, isOneTime);
    }
    reset();
  };

  const handleDismiss = () => { reset(); onDismiss(); };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleDismiss}>
      <SafeAreaView className="flex-1 bg-bold-surface">
        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-4 pb-3 border-b-2 border-bold-border">
            <TouchableOpacity onPress={handleDismiss} className="w-9 h-9 rounded-full bg-bold-border items-center justify-center">
              <Ionicons name="close" size={20} color={Colors.boldPrimaryText} />
            </TouchableOpacity>
            <Text className="text-sm font-black text-bold-text tracking-widest">
              {isEditMode ? 'EDIT QUEST' : 'FORGE NEW QUEST'}
            </Text>
            <TouchableOpacity
              className="rounded-xl px-4 py-2 bg-bold-primary"
              style={{ opacity: name.trim() ? 1 : 0.4 }}
              onPress={handleSubmit}
              disabled={!name.trim()}
            >
              <Text className="text-white font-black text-sm">{isEditMode ? 'SAVE' : 'FORGE'}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 20, gap: 20 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Quest Title */}
            <View className="gap-2">
              <Text className="text-sm font-black text-bold-text">Quest Title</Text>
              <ExpandableInput
                value={name}
                onChange={setName}
                placeholder="e.g. Daily Meditation"
              />
            </View>

            {/* Description */}
            <View className="gap-2">
              <Text className="text-sm font-black text-bold-text">Description <Text className="font-normal text-bold-text-secondary">(Optional)</Text></Text>
              <ExpandableInput
                value={description}
                onChange={setDescription}
                placeholder="Describe this quest..."
                multiline
              />
            </View>

            {/* Quest Type */}
            <View className="gap-2">
              <Text className="text-sm font-black text-bold-text">Quest Type</Text>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  className="flex-1 rounded-xl px-3.5 py-2.5 items-center"
                  style={{ backgroundColor: isOneTime ? Colors.boldPrimary : Colors.boldPrimaryContainer }}
                  onPress={() => setIsOneTime(true)}
                >
                  <Text className="text-[13px] font-black" style={{ color: isOneTime ? Colors.white : Colors.boldPrimaryText }}>
                    One-Time
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 rounded-xl px-3.5 py-2.5 items-center"
                  style={{ backgroundColor: !isOneTime ? Colors.boldPrimary : Colors.boldPrimaryContainer }}
                  onPress={() => setIsOneTime(false)}
                >
                  <Text className="text-[13px] font-black" style={{ color: !isOneTime ? Colors.white : Colors.boldPrimaryText }}>
                    Daily Habit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Difficulty */}
            <View className="gap-2">
              <Text className="text-sm font-black text-bold-text">Difficulty Rank</Text>
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
            </View>

            {/* Category */}
            <View className="gap-2">
              <Text className="text-sm font-black text-bold-text">Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                {CATEGORIES.filter((c): c is Habit['category'] => c !== 'All').map((cat) => {
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
            </View>

            {/* Due Date */}
            <View className="gap-2">
              <Text className="text-sm font-black text-bold-text">Due Date <Text className="font-normal text-bold-text-secondary">(Optional)</Text></Text>
              <TouchableOpacity
                className="flex-row items-center justify-between border-2 border-bold-border rounded-xl px-4 py-3 bg-bold-bg"
                onPress={openDatePicker}
              >
                <Text className="text-[15px] text-bold-text">{dueDate ? toDateString(dueDate) : 'No due date'}</Text>
                {dueDate ? (
                  <TouchableOpacity onPress={() => setDueDate(null)} className="px-1">
                    <Ionicons name="close-circle" size={18} color={Colors.boldSecondaryText} />
                  </TouchableOpacity>
                ) : (
                  <Ionicons name="calendar-outline" size={18} color={Colors.boldSecondaryText} />
                )}
              </TouchableOpacity>
              {showIOSPicker && (
                <DateTimePicker
                  value={dueDate ?? new Date()}
                  mode="date"
                  display="inline"
                  onValueChange={(_, selected) => { if (selected) setDueDate(selected); }}
                />
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
