import React, { useState } from 'react';
import {
  Modal, View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
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
        onValueChange: (_, selected) => { if (selected) setDueDate(selected); },
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
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleDismiss}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>Forge New Quest</Text>

            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
              {/* Quest Title */}
              <TextInput
                style={styles.input}
                placeholder="Quest Title (e.g. Daily Zen)"
                placeholderTextColor={Colors.boldSecondaryText}
                value={name}
                onChangeText={setName}
              />

              {/* Description */}
              <TextInput
                style={[styles.input, { marginTop: 12 }]}
                placeholder="Quest Description (Optional)"
                placeholderTextColor={Colors.boldSecondaryText}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={2}
              />

              {/* Difficulty Selector */}
              <Text style={styles.selectorLabel}>Difficulty Rank</Text>
              <View style={styles.pillRow}>
                {DIFFICULTIES.map((diff) => {
                  const isSelected = difficulty === diff;
                  return (
                    <TouchableOpacity
                      key={diff}
                      style={[styles.pill, { flex: 1, backgroundColor: isSelected ? Colors.boldPrimary : Colors.boldPrimaryContainer }]}
                      onPress={() => setDifficulty(diff)}
                    >
                      <Text style={[styles.pillText, { color: isSelected ? Colors.white : Colors.boldPrimaryText }]}>
                        {diff}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Category Selector */}
              <Text style={styles.selectorLabel}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
                {CATEGORIES.filter(c => c !== 'All').map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.pill, { backgroundColor: isSelected ? Colors.boldPrimary : Colors.boldPrimaryContainer }]}
                      onPress={() => setCategory(cat)}
                    >
                      <Text style={[styles.pillText, { color: isSelected ? Colors.white : Colors.boldPrimaryText }]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              {/* Due Date */}
              <Text style={styles.selectorLabel}>Due Date (Optional)</Text>
              <TouchableOpacity style={styles.dateButton} onPress={openDatePicker}>
                <Text style={styles.dateButtonText}>
                  {dueDate ? toDateString(dueDate) : 'No due date'}
                </Text>
                {dueDate && (
                  <TouchableOpacity onPress={() => setDueDate(null)}>
                    <Text style={styles.clearDate}>✕</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>

              {showIOSPicker && (
                <DateTimePicker
                  value={dueDate ?? new Date()}
                  minimumDate={new Date()}
                  mode="date"
                  display="inline"
                  onValueChange={(_, selected) => { if (selected) setDueDate(selected); }}
                />
              )}
            </ScrollView>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={handleDismiss} style={styles.cancelButton}>
                <Text style={styles.cancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.forgeButton, { opacity: name.trim() ? 1 : 0.4 }]}
                onPress={handleAdd}
                disabled={!name.trim()}
              >
                <Text style={styles.forgeText}>FORGE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  dialog: {
    backgroundColor: Colors.boldSurface,
    borderRadius: 28,
    padding: 24,
    gap: 16,
    maxHeight: '80%',
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.boldPrimaryText,
  },
  body: {
    flexGrow: 0,
  },
  input: {
    borderWidth: 2,
    borderColor: Colors.boldBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.boldPrimaryText,
    backgroundColor: Colors.boldBg,
  },
  selectorLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.boldPrimaryText,
    marginTop: 16,
    marginBottom: 8,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryRow: {
    gap: 6,
  },
  pill: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '900',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: Colors.boldBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.boldBg,
  },
  dateButtonText: {
    fontSize: 15,
    color: Colors.boldPrimaryText,
  },
  clearDate: {
    fontSize: 14,
    color: Colors.boldSecondaryText,
    paddingHorizontal: 4,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cancelText: {
    color: Colors.boldSecondaryText,
    fontWeight: '700',
    fontSize: 14,
  },
  forgeButton: {
    backgroundColor: Colors.boldPrimary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  forgeText: {
    color: Colors.white,
    fontWeight: '900',
    fontSize: 14,
  },
});
