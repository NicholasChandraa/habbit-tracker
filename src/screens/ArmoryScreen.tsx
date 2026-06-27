import React from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHabits } from '../context/HabitContext';
import { GoldShopSection } from '../components/GoldShopSection';
import { Colors } from '../theme/colors';

export function ArmoryScreen() {
  const { userStats, purchaseItem, purchasePotion, changeAvatar } = useHabits();

  return (
    <SafeAreaView className="flex-1 bg-bold-bg">
      <StatusBar barStyle="dark-content" backgroundColor={Colors.boldBg} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <GoldShopSection
          userStats={userStats}
          onBuyItem={purchaseItem}
          onBuyPotion={purchasePotion}
          onEquipAvatar={changeAvatar}
        />
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
