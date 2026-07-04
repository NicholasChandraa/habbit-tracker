# Agent Guidelines - Habit Tracker RPG (React Native & Expo)

Welcome to the Habit Tracker (RPG Edition) codebase. This file contains rules, structural guidelines, and conventions that all developers and AI agents must follow when modifying or extending this application.

---

## 📂 Project Overview & Structure

This is a React Native app built using **Expo SDK 56** with local SQLite storage (`expo-sqlite`) and styled using **NativeWind v4** (Tailwind CSS).

The directory structure is organized as follows:
- **`src/components/`**: Presentation and container UI components.
- **`src/screens/`**: High-level page screens (Dashboard, Quests, Armory).
- **`src/context/`**: React Context state management (`HabitContext.tsx`) which bridges repositories and UI components.
- **`src/database/`**: Persistence layer utilizing the Repository pattern.
- **`src/navigation/`**: Tab-based router setup.
- **`src/theme/`**: Color palettes and design tokens.

---

## 🛠️ Key Architectural Constraints & Rules

### 1. State Management & Data Syncing
* **No Direct DB Calls in UI**: Never import SQLite functions or execute queries directly in screens or components.
* **Use HabitContext**: Always perform actions through the React context hooks (via `useHabits()`).
* **Trigger Refresh**: When database changes are made directly (e.g. within a custom repository or setup), ensure `refresh()` is called from the context to synchronize state across the React render tree.

### 2. SQLite Database & Repository Pattern (`src/database/`)
* **Async APIs**: We use the new asynchronous `expo-sqlite` APIs (`db.runAsync`, `db.getAllAsync`, `db.execAsync`). Do not use obsolete synchronous methods.
* **Separation of concerns**:
  * Keep queries confined to specific repository files (`habitRepo.ts`, `questRepo.ts`, `completionRepo.ts`, `userStatsRepo.ts`).
  * Ensure schema updates in `db.ts` include safe migration paths (e.g., using `ALTER TABLE ... ADD COLUMN` inside `try-catch` blocks).

### 3. Styling & Theming
* **Tailwind Utility Classes**: Use NativeWind utility classes (e.g., `className="..."`) for component styling.
* **Theming**: Adhere to the theme variables configured in `src/theme/colors.ts`. Avoid hardcoding hex codes.

### 4. Type Safety
* **Types Definition**: All schema entities, state types, and helpers are defined in `src/database/types.ts`.
* **TypeScript Check**: Before submitting code, run the typecheck command:
  ```bash
  npm run typecheck
  ```
  Ensure all TypeScript code passes compilation without errors.

---

## 🏆 RPG Gamification Logic & Rules
* **XP and Gold calculation**: Reward values must follow rules defined in `src/database/types.ts` (`getHabitXPReward` and `getHabitCoinReward`).
* **Leveling up**: Level calculation is logic-bound in the helper `addXP` function. Avoid custom XP thresholds without updating the main scaling logic.
