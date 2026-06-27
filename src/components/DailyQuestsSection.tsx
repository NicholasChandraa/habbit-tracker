import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DailyQuest } from '../database/types';
import { Colors } from '../theme/colors';

interface Props {
  quests: DailyQuest[];
  onClaim: (quest: DailyQuest) => void;
}

export function DailyQuestsSection({ quests, onClaim }: Props) {
  return (
    <View style={styles.section}>
      {/* Header */}
      <View style={styles.sectionHeader}>
        <Ionicons name="star" size={22} color={Colors.boldPrimary} />
        <Text style={styles.sectionTitle}>DAILY QUEST BOARD</Text>
      </View>

      {quests.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Initializing Daily Quests... Tap sync to load board.</Text>
        </View>
      ) : (
        quests.map((quest) => (
          <QuestItemRow key={quest.id} quest={quest} onClaim={() => onClaim(quest)} />
        ))
      )}
    </View>
  );
}

function QuestItemRow({ quest, onClaim }: { quest: DailyQuest; onClaim: () => void }) {
  const progressFraction = quest.targetProgress > 0
    ? Math.min(quest.currentProgress / quest.targetProgress, 1)
    : 0;

  const isClaimable = quest.isCompleted && !quest.isClaimed;
  const cardBg = isClaimable ? Colors.boldPrimaryContainer : Colors.boldSurface;
  const borderColor = isClaimable ? Colors.boldPrimary : Colors.boldBorder;

  const badgeBg = quest.isClaimed
    ? Colors.boldBorder
    : quest.isCompleted
    ? Colors.boldPrimary
    : Colors.boldPrimaryContainer;

  const badgeIconColor = quest.isClaimed
    ? Colors.boldSecondaryText
    : quest.isCompleted
    ? Colors.white
    : Colors.boldPrimary;

  return (
    <View style={[styles.questCard, { backgroundColor: cardBg, borderColor }]}>
      <View style={styles.questRow}>
        {/* Status Badge */}
        <View style={[styles.questBadge, { backgroundColor: badgeBg }]}>
          <Ionicons
            name={quest.isClaimed ? 'checkmark' : 'star'}
            size={22}
            color={badgeIconColor}
          />
        </View>

        {/* Details */}
        <View style={styles.questDetails}>
          <Text style={styles.questTitle} numberOfLines={1}>{quest.title}</Text>
          <Text style={styles.questDesc} numberOfLines={2}>{quest.description}</Text>

          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, {
                width: `${progressFraction * 100}%`,
                backgroundColor: isClaimable ? Colors.boldPrimaryContainer : Colors.boldPrimary,
              }]} />
            </View>
            <Text style={styles.progressCount}>
              {quest.currentProgress}/{quest.targetProgress}
            </Text>
          </View>
        </View>

        {/* Right Action */}
        <View style={styles.questRight}>
          {isClaimable ? (
            <TouchableOpacity style={styles.claimButton} onPress={onClaim}>
              <Text style={styles.claimText}>CLAIM</Text>
            </TouchableOpacity>
          ) : quest.isClaimed ? (
            <Text style={styles.claimedText}>Claimed ✓</Text>
          ) : (
            <View style={styles.rewardsCol}>
              <Text style={styles.xpReward}>+{quest.xpReward} XP</Text>
              <Text style={styles.coinReward}>+{quest.coinReward}g</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.boldPrimaryText,
    letterSpacing: 1,
  },
  emptyCard: {
    backgroundColor: Colors.boldSurface,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.boldBorder,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.boldSecondaryText,
    textAlign: 'center',
    fontSize: 14,
  },
  questCard: {
    borderRadius: 28,
    borderWidth: 2,
    padding: 16,
  },
  questRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  questBadge: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questDetails: {
    flex: 1,
    gap: 4,
  },
  questTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.boldPrimaryText,
  },
  questDesc: {
    fontSize: 12,
    color: Colors.boldSecondaryText,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.boldBorder,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  progressCount: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.boldPrimaryText,
  },
  questRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  claimButton: {
    backgroundColor: Colors.boldPrimary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  claimText: {
    color: Colors.white,
    fontWeight: '900',
    fontSize: 12,
  },
  claimedText: {
    color: Colors.boldEmerald,
    fontWeight: '900',
    fontSize: 12,
  },
  rewardsCol: {
    alignItems: 'flex-end',
  },
  xpReward: {
    color: Colors.boldPrimary,
    fontWeight: '900',
    fontSize: 11,
  },
  coinReward: {
    color: Colors.boldGold,
    fontWeight: '900',
    fontSize: 11,
  },
});
