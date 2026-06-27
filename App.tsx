import React from 'react';
import { HabitProvider } from './src/context/HabitContext';
import { DashboardScreen } from './src/screens/DashboardScreen';

export default function App() {
  return (
    <HabitProvider>
      <DashboardScreen />
    </HabitProvider>
  );
}
