import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserStats, SHOP_ITEMS, hasItem } from '../database/types';
import { Colors } from '../theme/colors';

interface Props {
  userStats: UserStats;
  onBuyItem: (itemId: string, cost: number) => void;
  onBuyPotion: () => void;
  onEquipAvatar: (itemId: string) => void;
}

const ITEM_EMOJIS: Record<string, string> = {
  crown: '👑', wings: '🪶', shield: '🛡️', staff: '🪄',
};

export function GoldShopSection({ userStats, onBuyItem, onBuyPotion, onEquipAvatar }: Props) {
  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-2">
        <Ionicons name="cart" size={22} color={Colors.boldPrimary} />
        <Text className="text-sm font-black text-bold-text tracking-widest">RPG ARMORY & SHOP</Text>
      </View>

      {/* XP Elixir */}
      <View className="bg-bold-surface rounded-[28px] border-2 border-bold-border p-4">
        <View className="flex-row items-center gap-4">
          <View className="w-11 h-11 rounded-xl items-center justify-center bg-bold-pink">
            <Text style={{ fontSize: 22 }}>🧪</Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-black text-bold-text">XP Booster Elixir</Text>
            <Text className="text-xs text-bold-text-secondary mt-0.5">Instantly drink to gain +50 EXP points.</Text>
          </View>
          <TouchableOpacity
            className="rounded-xl px-3 py-2 bg-bold-primary"
            style={{ opacity: userStats.coins >= 15 ? 1 : 0.4 }}
            onPress={onBuyPotion}
            disabled={userStats.coins < 15}
          >
            <Text className="text-xs font-black text-white">BUY (15g)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {SHOP_ITEMS.map((item) => {
        const owns = hasItem(userStats, item.id);
        const isEquipped = userStats.equippedAvatar === item.id;
        const canAfford = userStats.coins >= item.cost;

        return (
          <View key={item.id} className="bg-bold-surface rounded-[28px] border-2 p-4"
            style={{ borderColor: isEquipped ? Colors.boldPrimary : Colors.boldBorder }}>
            <View className="flex-row items-center gap-4">
              <View className="w-11 h-11 rounded-xl items-center justify-center bg-bold-primary-container">
                <Text style={{ fontSize: 22 }}>{ITEM_EMOJIS[item.id] ?? '⚔️'}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-black text-bold-text">{item.name}</Text>
                <Text className="text-xs text-bold-text-secondary mt-0.5">{item.description}</Text>
              </View>
              {!owns ? (
                <TouchableOpacity
                  className="rounded-xl px-3 py-2"
                  style={{ backgroundColor: Colors.boldGold, opacity: canAfford ? 1 : 0.4 }}
                  onPress={() => onBuyItem(item.id, item.cost)}
                  disabled={!canAfford}
                >
                  <Text className="text-xs font-black text-white">{item.cost}g</Text>
                </TouchableOpacity>
              ) : isEquipped ? (
                <TouchableOpacity
                  className="rounded-xl px-3 py-2 bg-bold-border"
                  onPress={() => onEquipAvatar('default')}
                >
                  <Text className="text-xs font-black text-bold-text">UNEQUIP</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  className="rounded-xl px-3 py-2 bg-bold-primary"
                  onPress={() => onEquipAvatar(item.id)}
                >
                  <Text className="text-xs font-black text-white">EQUIP</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}
