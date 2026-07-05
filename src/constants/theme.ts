import { Platform } from 'react-native';

/**
 * Design tokens. The palette is a festival-flavored violet with warm accents,
 * tuned for both light and dark mode.
 */
export const Colors = {
  light: {
    text: '#1B1531',
    textSecondary: '#5F5A73',
    textOnPrimary: '#FFFFFF',
    background: '#F7F6FC',
    surface: '#FFFFFF',
    surfaceAlt: '#EFEDF8',
    border: '#E4E1F0',
    primary: '#6C3EF5',
    primarySoft: '#ECE5FE',
    accent: '#FF7A00',
    accentSoft: '#FFEEDD',
    success: '#00A97F',
    successSoft: '#DCF5EE',
    danger: '#D93843',
    dangerSoft: '#FCE7E9',
    warning: '#B77800',
    warningSoft: '#FFF2D6',
  },
  dark: {
    text: '#F3F1FC',
    textSecondary: '#A9A3C2',
    textOnPrimary: '#FFFFFF',
    background: '#0F0C1D',
    surface: '#1B172E',
    surfaceAlt: '#262040',
    border: '#332C52',
    primary: '#9D7BFF',
    primarySoft: '#2C2352',
    accent: '#FF9A40',
    accentSoft: '#3D2A14',
    success: '#2FC79D',
    successSoft: '#123A30',
    danger: '#FF6B75',
    dangerSoft: '#421A1E',
    warning: '#FFC24D',
    warningSoft: '#3D3012',
  },
} as const;

export type ThemeColors = { [K in keyof typeof Colors.light]: string };
export type ThemeColor = keyof ThemeColors;

/** Colors used to distinguish stages/levels when none is set explicitly. */
export const StagePalette = ['#7C5CFC', '#00A97F', '#FF7A00', '#E5484D', '#0090FF', '#AB4ABA'];

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    rounded: 'normal',
    mono: 'monospace',
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const Type = {
  display: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { fontSize: 16, fontWeight: '600' },
  body: { fontSize: 15, fontWeight: '400' },
  caption: { fontSize: 13, fontWeight: '400' },
  label: { fontSize: 12, fontWeight: '600', letterSpacing: 0.4 },
} as const;

export const MaxContentWidth = 800;
