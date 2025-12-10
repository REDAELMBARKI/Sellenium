import { UIColorsType } from "@/types/UIColorsType";


export const currentThemeExample  : UIColorsType = {
  // Backgrounds
  bg: '#ffffff',
  bgSecondary: '#f8fafc',   // subtle secondary background
  card: '#f1f5f9',          // card background
  modal: '#f9fafb',
  overlay: 'rgba(15, 23, 42, 0.7)',

  // Text
  text: '#0f172a',           // main text
  textSecondary: '#334155',  // secondary text
  textMuted: '#64748b',      // disabled/muted text
  textInverse: '#ffffff',    // for dark backgrounds

  // Buttons
  buttonPrimary: '#8b5cf6',
  buttonPrimaryHover: '#7c3aed',
  buttonSecondary: '#e2e8f0',
  buttonSecondaryHover: '#cbd5e1',
  buttonDisabled: '#94a3b8',

  // Accent / Highlight
  accent: '#8b5cf6',
  accentHover: '#7c3aed',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',

  // Borders & Shadows
  border: '#e2e8f0',
  borderHover: '#cbd5e1',
  borderMuted: '#cbd5e1',
  shadow: '0 1px 3px rgba(0,0,0,0.1)',
  shadowMd: '0 4px 6px rgba(0,0,0,0.1)',
  shadowLg: '0 10px 15px rgba(0,0,0,0.1)',

  // Grays
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',

  // Semantic / Special
  link: '#3b82f6',
  linkHover: '#2563eb',
  borderRadius: '0.75rem', // 12px rounded cards
  transition: 'all 0.2s ease-in-out',
};
