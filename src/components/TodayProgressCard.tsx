import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Habit } from '../database/types';
import { Colors } from '../theme/colors';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface Props {
  habits: Habit[];
}

export function TodayProgressCard({ habits }: Props) {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const total = habits.length;
  const done = habits.filter(h => h.lastCompletedDate === today).length;
  const pct = total > 0 ? done / total : 0;

  return (
    <View style={styles.card}>
      {/* Date */}
      <View style={styles.dateRow}>
        <View>
          <Text style={styles.dayName}>{DAY_NAMES[now.getDay()]}</Text>
          <Text style={styles.dateText}>{now.getDate()} {MONTH_NAMES[now.getMonth()]} {now.getFullYear()}</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{done}/{total}</Text>
          <Text style={styles.countLabel}>done</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct * 100}%` }]} />
      </View>

      <Text style={styles.caption}>
        {total === 0
          ? 'No quests yet — forge one!'
          : done === total
          ? 'All quests complete today! 🎉'
          : `${total - done} quest${total - done > 1 ? 's' : ''} remaining`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.boldSurface,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.boldBorder,
    padding: 20,
    gap: 12,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayName: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.boldPrimary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  dateText: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.boldPrimaryText,
  },
  countBadge: {
    alignItems: 'center',
    backgroundColor: Colors.boldPrimaryContainer,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  countText: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.boldPrimary,
  },
  countLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.boldPrimary,
    letterSpacing: 1,
  },
  track: {
    height: 8,
    backgroundColor: Colors.boldBorder,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.boldPrimary,
    borderRadius: 999,
  },
  caption: {
    fontSize: 12,
    color: Colors.boldSecondaryText,
    fontWeight: '700',
  },
});
