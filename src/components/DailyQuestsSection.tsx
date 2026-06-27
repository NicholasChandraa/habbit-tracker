import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DailyQuest } from '../database/types';
import { Colors } from '../theme/colors';

interface Props {
  quests: DailyQuest[];
  onClaim: (quest: DailyQuest) => void;
}

export function DailyQuestsSection({ quests, onClaim }: Props) {
  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-2">
        <Ionicons name="star" size={22} color={Colors.boldPrimary} />
        <Text className="text-sm font-black text-bold-text tracking-widest">DAILY QUEST BOARD</Text>
      </View>

      {quests.length === 0 ? (
        <View className="bg-bold-surface rounded-[28px] border-2 border-bold-border p-6 items-center">
          <Text className="text-bold-text-secondary text-center text-sm">Initializing Daily Quests... Tap sync to load board.</Text>
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

  return (
    <View className="rounded-[28px] border-2 p-4"
      style={{
        backgroundColor: isClaimable ? Colors.boldPrimaryContainer : Colors.boldSurface,
        borderColor: isClaimable ? Colors.boldPrimary : Colors.boldBorder,
      }}>
      <View className="flex-row items-center gap-4">
        {/* Badge */}
        <View className="w-11 h-11 rounded-2xl items-center justify-center"
          style={{
            backgroundColor: quest.isClaimed ? Colors.boldBorder : quest.isCompleted ? Colors.boldPrimary : Colors.boldPrimaryContainer,
          }}>
          <Ionicons
            name={quest.isClaimed ? 'checkmark' : 'star'} size={22}
            color={quest.isClaimed ? Colors.boldSecondaryText : quest.isCompleted ? Colors.white : Colors.boldPrimary}
          />
        </View>

        {/* Details */}
        <View className="flex-1 gap-1">
          <Text className="text-sm font-black text-bold-text" numberOfLines={1}>{quest.title}</Text>
          <Text className="text-xs text-bold-text-secondary" numberOfLines={2}>{quest.description}</Text>
          <View className="flex-row items-center gap-2 mt-1">
            <View className="flex-1 h-1.5 bg-bold-border rounded-full overflow-hidden">
              <View className="h-full rounded-full"
                style={{
                  width: `${progressFraction * 100}%`,
                  backgroundColor: isClaimable ? Colors.boldPrimaryContainer : Colors.boldPrimary,
                }} />
            </View>
            <Text className="text-[11px] font-black text-bold-text">{quest.currentProgress}/{quest.targetProgress}</Text>
          </View>
        </View>

        {/* Action */}
        <View className="items-end gap-1">
          {isClaimable ? (
            <TouchableOpacity className="bg-bold-primary rounded-xl px-3 py-1.5" onPress={onClaim}>
              <Text className="text-white font-black text-xs">CLAIM</Text>
            </TouchableOpacity>
          ) : quest.isClaimed ? (
            <Text className="font-black text-xs" style={{ color: Colors.boldEmerald }}>Claimed ✓</Text>
          ) : (
            <View className="items-end">
              <Text className="font-black text-[11px] text-bold-primary">+{quest.xpReward} XP</Text>
              <Text className="font-black text-[11px]" style={{ color: Colors.boldGold }}>+{quest.coinReward}g</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
