import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface Props {
  streakCount: number;
}

export function HeroStreakWidget({ streakCount }: Props) {
  return (
    <View style={styles.container}>
      {/* "CURRENT STREAK" badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>CURRENT STREAK</Text>
      </View>

      {/* Giant italic streak number */}
      <Text style={styles.streakNumber}>{streakCount}</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        {streakCount === 1 ? 'Day Unstoppable' : 'Days Unstoppable'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  badge: {
    backgroundColor: Colors.boldPrimaryContainer,
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 4,
  },
  badgeText: {
    color: Colors.boldPrimary,
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1.5,
  },
  streakNumber: {
    fontSize: 110,
    fontWeight: '900',
    fontStyle: 'italic',
    color: Colors.boldPrimaryText,
    lineHeight: 120,
    letterSpacing: -4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.boldSecondaryText,
    marginTop: -8,
  },
});
