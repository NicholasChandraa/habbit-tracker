import './global.css';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { HabitProvider } from './src/context/HabitContext';
import { TabNavigator } from './src/navigation/TabNavigator';

export default function App() {
  return (
    <HabitProvider>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </HabitProvider>
  );
}
