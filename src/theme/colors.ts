// Bold Typography Palette — ported from Android Color.kt
export const Colors = {
  // Backgrounds
  boldBg: '#FDFCFB',           // Warm paper light background
  boldSurface: '#FFFFFF',       // Pure white card background
  boldSurfaceVariant: '#F3EFFF',// Very light tinted purple surface

  // Text
  boldPrimaryText: '#1D1B1E',   // Deep dark purple ink text
  boldSecondaryText: '#49454F', // Slate-grey secondary text

  // Primary Brand
  boldPrimary: '#6750A4',           // Signature dark purple
  boldPrimaryContainer: '#EADDFF',  // Light purple background tint
  boldSecondaryContainer: '#D0BCFF',// Medium pastel purple

  // Borders
  boldBorder: '#E7E0EC',       // Thick container stroke color
  boldBorderMuted: '#CAC4D0',  // Muted gray stroke color

  // Accents
  boldPinkAccent: '#FFD8E4',   // Soft warning/highlight pink
  boldDarkPinkText: '#31111D', // Dark maroon ink text for pink container

  // Gamification
  boldGold: '#D09C00',         // High contrast bronze-gold
  boldEmerald: '#1B8A4E',      // Rich forest green for Easy difficulty/completes
  boldCyan: '#007A94',         // Rich teal-cyan for Medium difficulty
  boldMagenta: '#9E1F8C',      // Deep plum magenta for Hard difficulty
  boldCoral: '#BF360C',        // Flame red-orange for streaks

  // Utility
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof Colors;
