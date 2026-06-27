import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
  crown: '👑',
  wings: '🪶',
  shield: '🛡️',
  staff: '🪄',
};

export function GoldShopSection({ userStats, onBuyItem, onBuyPotion, onEquipAvatar }: Props) {
  return (
    <View style={styles.section}>
      {/* Header */}
      <View style={styles.sectionHeader}>
        <Ionicons name="cart" size={22} color={Colors.boldPrimary} />
        <Text style={styles.sectionTitle}>RPG ARMORY & SHOP</Text>
      </View>

      {/* XP Elixir */}
      <View style={styles.card}>
        <View style={styles.itemRow}>
          <View style={[styles.iconBox, { backgroundColor: Colors.boldPinkAccent }]}>
            <Text style={styles.emoji}>🧪</Text>
          </View>
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>XP Booster Elixir</Text>
            <Text style={styles.itemDesc}>Instantly drink to gain +50 EXP points.</Text>
          </View>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: Colors.boldPrimary, opacity: userStats.coins >= 15 ? 1 : 0.4 }]}
            onPress={onBuyPotion}
            disabled={userStats.coins < 15}
          >
            <Text style={styles.actionButtonText}>BUY (15g)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Shop Items */}
      {SHOP_ITEMS.map((item) => {
        const owns = hasItem(userStats, item.id);
        const isEquipped = userStats.equippedAvatar === item.id;
        const canAfford = userStats.coins >= item.cost;

        return (
          <View
            key={item.id}
            style={[styles.card, isEquipped && { borderColor: Colors.boldPrimary }]}
          >
            <View style={styles.itemRow}>
              <View style={[styles.iconBox, { backgroundColor: Colors.boldPrimaryContainer }]}>
                <Text style={styles.emoji}>{ITEM_EMOJIS[item.id] ?? '⚔️'}</Text>
              </View>

              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDesc}>{item.description}</Text>
              </View>

              {!owns ? (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: Colors.boldGold, opacity: canAfford ? 1 : 0.4 }]}
                  onPress={() => onBuyItem(item.id, item.cost)}
                  disabled={!canAfford}
                >
                  <Text style={styles.actionButtonText}>{item.cost}g</Text>
                </TouchableOpacity>
              ) : isEquipped ? (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: Colors.boldBorder }]}
                  onPress={() => onEquipAvatar('default')}
                >
                  <Text style={[styles.actionButtonText, { color: Colors.boldPrimaryText }]}>UNEQUIP</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: Colors.boldPrimary }]}
                  onPress={() => onEquipAvatar(item.id)}
                >
                  <Text style={styles.actionButtonText}>EQUIP</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: {
    fontSize: 14, fontWeight: '900', color: Colors.boldPrimaryText, letterSpacing: 1,
  },
  card: {
    backgroundColor: Colors.boldSurface,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.boldBorder,
    padding: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 22 },
  itemDetails: { flex: 1 },
  itemName: {
    fontSize: 14, fontWeight: '900', color: Colors.boldPrimaryText,
  },
  itemDesc: {
    fontSize: 12, color: Colors.boldSecondaryText, marginTop: 2,
  },
  actionButton: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionButtonText: {
    fontSize: 12, fontWeight: '900', color: Colors.white,
  },
});
