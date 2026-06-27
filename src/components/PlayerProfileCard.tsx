import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserStats } from '../database/types';
import { PlayerAvatar } from './PlayerAvatar';
import { Colors } from '../theme/colors';

interface Props {
  userStats: UserStats;
}

export function PlayerProfileCard({ userStats }: Props) {
  const progress = userStats.xpNeeded > 0
    ? Math.min(userStats.xp / userStats.xpNeeded, 1)
    : 0;

  return (
    <View style={styles.card}>
      {/* Avatar + Info Row */}
      <View style={styles.row}>
        <PlayerAvatar equipped={userStats.equippedAvatar} size={72} />

        <View style={styles.infoColumn}>
          <Text style={styles.guildLabel}>GUILD ADVENTURER</Text>
          <Text style={styles.levelText}>Level {userStats.level}</Text>
          <Text style={styles.titleText}>Title: {userStats.equippedTitle}</Text>
        </View>
      </View>

      {/* XP Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabel}>XP {userStats.xp} / {userStats.xpNeeded}</Text>
          <Text style={styles.nextLevelLabel}>NEXT: LEVEL {userStats.level + 1}</Text>
        </View>
      </View>
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
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  infoColumn: {
    flex: 1,
    gap: 2,
  },
  guildLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.boldSecondaryText,
    letterSpacing: 1,
  },
  levelText: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.boldPrimaryText,
  },
  titleText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.boldPrimary,
  },
  progressSection: {
    gap: 6,
  },
  progressTrack: {
    height: 10,
    backgroundColor: Colors.boldPrimaryContainer,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.boldPrimary,
    borderRadius: 999,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.boldSecondaryText,
  },
  nextLevelLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.boldPrimary,
  },
});
