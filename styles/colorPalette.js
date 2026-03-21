/**
 * MuscleMind Color Palette
 * Soft, nature-inspired pastels — calm, breathable, and approachable.
 * Reference palette: Matcha Latte #D1EFBD, Botanist #89D385,
 *                    Aquamarine #6CD1F0, Grape Soda #A1A1F7, Pink Diamond #EFCCEA
 * All colors are in HEX format.
 */

const colorPalette = {
  // ── Primary Brand — Aquamarine ─────────────────────────────────────────────
  primary: {
    50: '#f0fbff',
    100: '#d6f4fd',
    200: '#abe8fb',
    300: '#6CD1F0', // Aquamarine
    400: '#3bbde4',
    500: '#1aa8d4', // Main brand
    600: '#1187ae',
    700: '#116c8e',
    800: '#135873',
    900: '#144960',
    950: '#0d2f3f',
  },

  // ── Accent — Grape Soda (soft lavender) ───────────────────────────────────
  accent: {
    50: '#f2f1ff',
    100: '#e6e5ff',
    200: '#cfceff',
    300: '#A1A1F7', // Grape Soda
    400: '#7979f2',
    500: '#5b5bec',
    600: '#4545e0',
    700: '#3535cc', // Main accent
    800: '#2828a8',
    900: '#1d1d80',
    950: '#111158',
  },

  // ── Sage Green — Botanist / Matcha Latte ──────────────────────────────────
  neon: {
    50: '#f2faee',
    100: '#D1EFBD', // Matcha Latte
    200: '#b8e49e',
    300: '#89D385', // Botanist
    400: '#5ebe58',
    500: '#3da637', // Success / active state
    600: '#2e8829',
    700: '#236b1e',
    800: '#1a5217',
    900: '#123813',
    950: '#08200a',
  },

  // ── Warm Gold (soft, muted) ────────────────────────────────────────────────
  gold: {
    50: '#fffcf0',
    100: '#fef8d9',
    200: '#fdf0b3',
    300: '#fce47d',
    400: '#f9d34a',
    500: '#f0be1f', // Premium / gold plans
    600: '#d19f0a',
    700: '#ab7f08',
    800: '#87620b',
    900: '#6d4f0c',
    950: '#3d2a05',
  },

  // ── Blush — Pink Diamond ──────────────────────────────────────────────────
  blush: {
    50: '#fdf6fc',
    100: '#faeaf7',
    200: '#EFCCEA', // Pink Diamond
    300: '#e3aedd',
    400: '#d490cf',
    500: '#c172bf',
    600: '#a657a4',
    700: '#864086',
    800: '#632d63',
    900: '#421c41',
    950: '#281028',
  },

  // ── Danger / Soft Coral ───────────────────────────────────────────────────
  danger: {
    50: '#fff1f1',
    100: '#ffe0e0',
    200: '#ffc5c5',
    300: '#ff9d9d',
    400: '#ff6b6b',
    500: '#f44040', // Error state
    600: '#e02020',
    700: '#bc1717',
    800: '#9b1717',
    900: '#801818',
    950: '#450808',
  },

  // ── Neutral / Dark backgrounds ────────────────────────────────────────────
  dark: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a', // Dark sidebar
    950: '#020617', // Deepest background
  },

  // ── Gym-specific accent palette (softened) ────────────────────────────────
  gym: {
    iron: '#3d3d3d', // Iron / steel
    chalk: '#f5f5f0', // Chalk white
    rubber: '#1a1a1a', // Rubber mat black
    sweat: '#6CD1F0', // Aquamarine — hydration / flow
    muscle: '#e57373', // Soft coral-red
    energy: '#ffb74d', // Warm amber
    endurance: '#89D385', // Botanist green
    pulse: '#A1A1F7', // Grape Soda lavender
    platinum: '#b0bec5', // Platinum silver
    carbon: '#37474f', // Carbon dark
  },

  // ── UI Semantic ────────────────────────────────────────────────────────────
  semantic: {
    success: '#3da637', // Sage green
    warning: '#f0be1f', // Soft gold
    error: '#f44040', // Soft coral-red
    info: '#1aa8d4', // Aquamarine
  },

  // ── Pure ──────────────────────────────────────────────────────────────────
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
};

export default colorPalette;
