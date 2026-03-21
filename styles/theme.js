import colorPalette from './colorPalette';

const baseTheme = {
  borderRadius: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    full: '9999px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  typography: {
    fontFamily: {
      sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
    fontSize: {
      xs: '11px',
      sm: '13px',
      base: '14px',
      md: '15px',
      lg: '16px',
      xl: '18px',
      '2xl': '20px',
      '3xl': '24px',
      '4xl': '30px',
      '5xl': '36px',
      '6xl': '48px',
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },
  shadows: {
    xs: '0 1px 2px rgba(0,0,0,0.05)',
    sm: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
    md: '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)',
    lg: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
    xl: '0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)',
    '2xl': '0 25px 50px rgba(0,0,0,0.25)',
    glow: '0 0 20px rgba(26, 168, 212, 0.35)',
    glowBlue: '0 0 20px rgba(53, 53, 204, 0.3)',
    glowGreen: '0 0 20px rgba(61, 166, 55, 0.3)',
    inner: 'inset 0 2px 4px rgba(0,0,0,0.06)',
  },
  transitions: {
    fast: '0.1s ease',
    normal: '0.2s ease',
    slow: '0.3s ease',
    spring: '0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  zIndex: {
    base: 0,
    dropdown: 100,
    sticky: 200,
    overlay: 300,
    modal: 400,
    toast: 500,
    tooltip: 600,
  },
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

export const lightTheme = {
  ...baseTheme,
  mode: 'light',
  colors: {
    // Backgrounds
    bgPrimary: '#edf1f7',
    bgSecondary: '#e2e9f2',
    bgTertiary: '#d5dfe9',
    bgCard: '#edf1f7',
    bgSidebar: '#0f172a',
    bgNavbar: '#edf1f7',
    bgHover: '#d5dfe9',
    bgActive: '#c3cfde',
    bgInput: '#f3f6fa',
    bgOverlay: 'rgba(0,0,0,0.5)',

    // Text
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textTertiary: '#94a3b8',
    textMuted: '#cbd5e1',
    textInverse: colorPalette.white,
    textOnDark: '#e2e8f0',

    // Brand
    brandPrimary: colorPalette.primary[500],
    brandSecondary: colorPalette.accent[700],
    brandAccent: colorPalette.neon[500],
    brandGold: colorPalette.gold[500],

    // Borders
    border: '#e2e8f0',
    borderHover: '#cbd5e1',
    borderFocus: colorPalette.primary[500],

    // States
    success: colorPalette.semantic.success,
    warning: colorPalette.semantic.warning,
    error: colorPalette.semantic.error,
    info: colorPalette.semantic.info,

    // Sidebar
    sidebarBg: '#0f172a',
    sidebarText: '#94a3b8',
    sidebarActive: colorPalette.primary[500],
    sidebarHover: '#1e293b',
    sidebarBorder: '#1e293b',
    sidebarIcon: '#64748b',
    sidebarActiveText: colorPalette.white,

    // Stats cards
    statCard1: '#e2f5fc',
    statCard2: '#e8e8ff',
    statCard3: '#e4f4da',
    statCard4: '#f7e8f5',
  },
};

export const darkTheme = {
  ...baseTheme,
  mode: 'dark',
  colors: {
    // Backgrounds
    bgPrimary: '#070d1a',
    bgSecondary: '#0d1626',
    bgTertiary: '#172031',
    bgCard: '#0d1626',
    bgSidebar: '#02040e',
    bgNavbar: '#0d1626',
    bgHover: '#172031',
    bgActive: '#243347',
    bgInput: '#0d1626',
    bgOverlay: 'rgba(0,0,0,0.8)',

    // Text
    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    textTertiary: '#64748b',
    textMuted: '#475569',
    textInverse: '#0f172a',
    textOnDark: '#e2e8f0',

    // Brand
    brandPrimary: colorPalette.primary[400],
    brandSecondary: colorPalette.accent[400],
    brandAccent: colorPalette.neon[400],
    brandGold: colorPalette.gold[400],

    // Borders
    border: '#334155',
    borderHover: '#475569',
    borderFocus: colorPalette.primary[400],

    // States
    success: colorPalette.neon[400],
    warning: colorPalette.gold[400],
    error: colorPalette.danger[400],
    info: '#60a5fa',

    // Sidebar
    sidebarBg: '#020617',
    sidebarText: '#64748b',
    sidebarActive: colorPalette.primary[500],
    sidebarHover: '#0f172a',
    sidebarBorder: '#0f172a',
    sidebarIcon: '#475569',
    sidebarActiveText: colorPalette.white,

    // Stats cards
    statCard1: '#0a1e2a',
    statCard2: '#0e0e30',
    statCard3: '#071508',
    statCard4: '#1a0a18',
  },
};

export default { lightTheme, darkTheme };
