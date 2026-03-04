import { Themes } from "@/types/ThemeTypes";
export const currentThemeExample: Themes = {
  luxuryNoir: {
    light: {
      // SURFACES
      bg: '#efefed',           // warm off-white, easy on eyes
      bgSecondary: '#e5e4e1',  // clear separation from bg
      card: '#f8f8f6',         // slightly off-white card
      modal: '#f8f8f6',
      overlay: 'rgba(0,0,0,0.55)',

      sidebarBg: '#141414',
      sidebarFg: '#e5e5e5',
      sidebarBorder: '#262626',
      sidebarHover: '#1f1f1f',
      sidebarMuted: '#1a1a1a',
      sidebarMutedFg: '#9ca3af',
      sidebarActive: '#bfa36f',
      sidebarActiveFg: '#111111',

      // TEXT
      text: '#111111',
      textSecondary: '#3f3f46',
      textMuted: '#78716c',    // warmer, more readable on light bg
      textInverse: '#ffffff',

      // ACTIONS / ACCENTS
      primary: '#111111',
      primaryHover: '#000000',
      secondary: '#dddcda',
      secondaryHover: '#cccbc8',
      accent: '#bfa36f',
      accentHover: '#a88b5e',

      // STATES / BADGES
      badge: '#bfa36f',
      success: '#3f6f5e',
      info: '#4b5d73',
      warning: '#a67c3a',
      error: '#7a2e2e',

      // BORDERS — main fix: much more visible
      border: '#c9c8c5',
      borderHover: '#b5b4b1',

      // LINKS
      link: '#111111',
      linkHover: '#000000',

      // SHADOWS
      shadow: '0 1px 3px rgba(0,0,0,0.12)',
      shadowMd: '0 6px 14px rgba(0,0,0,0.16)',
      shadowLg: '0 18px 36px rgba(0,0,0,0.22)',
    },

    dark: {
      bg: '#0c0c0d',
      bgSecondary: '#111113',
      card: '#161618',
      modal: '#1c1c1f',
      overlay: 'rgba(0,0,0,0.75)',

      sidebarBg: '#0f0f10',
      sidebarFg: '#f5f5f5',
      sidebarBorder: '#262626',
      sidebarHover: '#1c1c1e',
      sidebarMuted: '#141416',
      sidebarMutedFg: '#9ca3af',
      sidebarActive: '#d6b97b',
      sidebarActiveFg: '#000000',

      text: '#f9fafb',
      textSecondary: '#d1d5db',
      textMuted: '#9ca3af',
      textInverse: '#000000',

      primary: '#f9fafb',
      primaryHover: '#e5e7eb',
      secondary: '#1f2937',
      secondaryHover: '#374151',
      accent: '#d6b97b',
      accentHover: '#bfa36f',

      badge: '#d6b97b',
      success: '#5f8f7c',
      info: '#6b7f99',
      warning: '#c59a5a',
      error: '#a14b4b',

      border: '#262626',
      borderHover: '#3f3f46',

      link: '#d6b97b',
      linkHover: '#f5dca3',

      shadow: '0 2px 6px rgba(0,0,0,0.6)',
      shadowMd: '0 10px 20px rgba(0,0,0,0.7)',
      shadowLg: '0 24px 48px rgba(0,0,0,0.85)',
    },
  },

  softPastel: {
    light: {
      // SURFACES — bg is gray so card white has contrast
      bg: '#f2f2f5',           // soft cool gray, not stark white
      bgSecondary: '#e8e8ec',  // clear step down from bg
      card: '#ffffff',         // white works here since bg is gray
      modal: '#ffffff',
      overlay: 'rgba(15,23,42,0.4)',

      sidebarBg: '#f8fafc',
      sidebarFg: '#1f2937',
      sidebarBorder: '#d1d5db',  // darker sidebar border
      sidebarHover: '#eef2ff',
      sidebarMuted: '#f1f5f9',
      sidebarMutedFg: '#64748b',
      sidebarActive: '#8b5cf6',
      sidebarActiveFg: '#ffffff',

      // TEXT
      text: '#1f2937',
      textSecondary: '#374151',  // darker than before
      textMuted: '#6b7280',      // darker — readable as placeholder
      textInverse: '#ffffff',

      // ACTIONS / ACCENTS
      primary: '#8b5cf6',
      primaryHover: '#7c3aed',
      secondary: '#dde0e7',
      secondaryHover: '#c8ccd6',
      accent: '#ec4899',
      accentHover: '#db2777',

      // STATES / BADGES
      badge: '#e879f9',
      success: '#22c55e',
      info: '#38bdf8',
      warning: '#f59e0b',
      error: '#ef4444',

      // BORDERS — main fix: visible on both bg and card
      border: '#c4c7d1',
      borderHover: '#a8aab8',

      // LINKS
      link: '#8b5cf6',
      linkHover: '#7c3aed',

      // SHADOWS
      shadow: '0 1px 2px rgba(0,0,0,0.08)',
      shadowMd: '0 6px 14px rgba(0,0,0,0.12)',
      shadowLg: '0 18px 30px rgba(0,0,0,0.16)',
    },

    dark: {
      bg: '#0f172a',
      bgSecondary: '#111827',
      card: '#1f2937',
      modal: '#1f2937',
      overlay: 'rgba(0,0,0,0.7)',

      sidebarBg: '#111827',
      sidebarFg: '#f9fafb',
      sidebarBorder: '#334155',
      sidebarHover: '#1e293b',
      sidebarMuted: '#0f172a',
      sidebarMutedFg: '#94a3b8',
      sidebarActive: '#a78bfa',
      sidebarActiveFg: '#0f172a',

      text: '#f9fafb',
      textSecondary: '#cbd5f5',
      textMuted: '#94a3b8',
      textInverse: '#0f172a',

      primary: '#a78bfa',
      primaryHover: '#8b5cf6',
      secondary: '#334155',
      secondaryHover: '#475569',
      accent: '#f472b6',
      accentHover: '#ec4899',

      badge: '#f472b6',
      success: '#4ade80',
      info: '#60a5fa',
      warning: '#fbbf24',
      error: '#f87171',

      border: '#334155',
      borderHover: '#475569',

      link: '#a78bfa',
      linkHover: '#c4b5fd',

      shadow: '0 2px 6px rgba(0,0,0,0.6)',
      shadowMd: '0 10px 20px rgba(0,0,0,0.7)',
      shadowLg: '0 26px 48px rgba(0,0,0,0.85)',
    },
  },
};

export const grayColors = {
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
}

export const accentColors = {
  lightAccent: 'rgba(255, 200, 150, 0.1)',  // subtle warm tone
  darkAccent: 'rgba(100, 150, 255, 0.1)',   // subtle cool tone
};
