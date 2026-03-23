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
      textMuted: '#78716c',
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
 
      // BORDERS
      border: '#c9c8c5',
      borderHover: '#b5b4b1',
      borderRadius: '8px',
 
      // LINKS
      link: '#111111',
      linkHover: '#000000',
 
      // SHADOWS
      shadow: '0 1px 3px rgba(0,0,0,0.12)',
      shadowMd: '0 6px 14px rgba(0,0,0,0.16)',
      shadowLg: '0 18px 36px rgba(0,0,0,0.22)',
 
      // PRODUCT PAGE
      priceText: '#111111',
      priceStrike: '#b0aea9',
      dealBg: '#f0ece3',
      starColor: '#bfa36f',
    },
 
    dark: {
      // SURFACES
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
 
      // TEXT
      text: '#f9fafb',
      textSecondary: '#d1d5db',
      textMuted: '#9ca3af',
      textInverse: '#000000',
 
      // ACTIONS / ACCENTS
      primary: '#f9fafb',
      primaryHover: '#e5e7eb',
      secondary: '#1f2937',
      secondaryHover: '#374151',
      accent: '#d6b97b',
      accentHover: '#bfa36f',
 
      // STATES / BADGES
      badge: '#d6b97b',
      success: '#5f8f7c',
      info: '#6b7f99',
      warning: '#c59a5a',
      error: '#a14b4b',
 
      // BORDERS
      border: '#262626',
      borderHover: '#3f3f46',
      borderRadius: '8px',
 
      // LINKS
      link: '#d6b97b',
      linkHover: '#f5dca3',
 
      // SHADOWS
      shadow: '0 2px 6px rgba(0,0,0,0.6)',
      shadowMd: '0 10px 20px rgba(0,0,0,0.7)',
      shadowLg: '0 24px 48px rgba(0,0,0,0.85)',
 
      // PRODUCT PAGE
      priceText: '#f9fafb',
      priceStrike: '#4a4a52',
      dealBg: '#18150f',
      starColor: '#d6b97b',
    },
  },
 
  softPastel: {
    light: {
      // SURFACES
      bg: '#f2f2f5',
      bgSecondary: '#e8e8ec',
      card: '#ffffff',
      modal: '#ffffff',
      overlay: 'rgba(15,23,42,0.4)',
 
      sidebarBg: '#f8fafc',
      sidebarFg: '#1f2937',
      sidebarBorder: '#d1d5db',
      sidebarHover: '#eef2ff',
      sidebarMuted: '#f1f5f9',
      sidebarMutedFg: '#64748b',
      sidebarActive: '#8b5cf6',
      sidebarActiveFg: '#ffffff',
 
      // TEXT
      text: '#1f2937',
      textSecondary: '#374151',
      textMuted: '#6b7280',
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
 
      // BORDERS
      border: '#c4c7d1',
      borderHover: '#a8aab8',
      borderRadius: '10px',
 
      // LINKS
      link: '#8b5cf6',
      linkHover: '#7c3aed',
 
      // SHADOWS
      shadow: '0 1px 2px rgba(0,0,0,0.08)',
      shadowMd: '0 6px 14px rgba(0,0,0,0.12)',
      shadowLg: '0 18px 30px rgba(0,0,0,0.16)',
 
      // PRODUCT PAGE
      priceText: '#1f2937',
      priceStrike: '#a0a3b1',
      dealBg: '#faf5ff',
      starColor: '#f59e0b',
    },
 
    dark: {
      // SURFACES
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
 
      // TEXT
      text: '#f9fafb',
      textSecondary: '#cbd5f5',
      textMuted: '#94a3b8',
      textInverse: '#0f172a',
 
      // ACTIONS / ACCENTS
      primary: '#a78bfa',
      primaryHover: '#8b5cf6',
      secondary: '#334155',
      secondaryHover: '#475569',
      accent: '#f472b6',
      accentHover: '#ec4899',
 
      // STATES / BADGES
      badge: '#f472b6',
      success: '#4ade80',
      info: '#60a5fa',
      warning: '#fbbf24',
      error: '#f87171',
 
      // BORDERS
      border: '#334155',
      borderHover: '#475569',
      borderRadius: '10px',
 
      // LINKS
      link: '#a78bfa',
      linkHover: '#c4b5fd',
 
      // SHADOWS
      shadow: '0 2px 6px rgba(0,0,0,0.6)',
      shadowMd: '0 10px 20px rgba(0,0,0,0.7)',
      shadowLg: '0 26px 48px rgba(0,0,0,0.85)',
 
      // PRODUCT PAGE
      priceText: '#f9fafb',
      priceStrike: '#475569',
      dealBg: '#1a1033',
      starColor: '#fbbf24',
    },
  },

  orangeNight: {
    light: {
      // SURFACES
      bg: '#f5f3f0',           // warm off-white with subtle orange undertone
      bgSecondary: '#ece9e4',  // clear step down
      card: '#faf9f7',         // clean warm white card
      modal: '#faf9f7',
      overlay: 'rgba(0,0,0,0.5)',

      sidebarBg: '#1a1210',    // very dark warm brown-black (your dark bg color)
      sidebarFg: '#f0ede8',
      sidebarBorder: '#2e2420',
      sidebarHover: '#231815',
      sidebarMuted: '#1e1512',
      sidebarMutedFg: '#9c9189',
      sidebarActive: '#ff6b35', // orange accent
      sidebarActiveFg: '#ffffff',

      // TEXT
      text: '#1a1210',
      textSecondary: '#3d2f28',
      textMuted: '#8a7a72',
      textInverse: '#ffffff',

      // ACTIONS / ACCENTS
      primary: '#ff6b35',       // vibrant orange
      primaryHover: '#e85520',
      secondary: '#ece9e4',
      secondaryHover: '#dedad3',
      accent: '#ff6b35',
      accentHover: '#e85520',

      // STATES / BADGES
      badge: '#ff6b35',
      success: '#3a7d5c',
      info: '#3a6080',
      warning: '#c47c1a',
      error: '#c0392b',

      // BORDERS
      border: '#d9d4cc',
      borderHover: '#c4bdb4',
      borderRadius: '8px',

      // LINKS
      link: '#ff6b35',
      linkHover: '#e85520',

      // SHADOWS
      shadow: '0 1px 3px rgba(0,0,0,0.1)',
      shadowMd: '0 6px 14px rgba(0,0,0,0.14)',
      shadowLg: '0 18px 36px rgba(0,0,0,0.2)',

      // PRODUCT PAGE
      priceText: '#1a1210',
      priceStrike: '#b0a89e',
      dealBg: '#fff3ee',       // very light orange tint
      starColor: '#ff6b35',
    },

    dark: {
      // SURFACES
      bg: '#0f0b09',           // your dark background — near black with warm undertone
      bgSecondary: '#141009',
      card: '#1a1410',         // dark warm card
      modal: '#201812',
      overlay: 'rgba(0,0,0,0.75)',

      sidebarBg: '#0c0a07',    // even deeper dark for sidebar
      sidebarFg: '#f0ede8',
      sidebarBorder: '#2a2018',
      sidebarHover: '#1c1610',
      sidebarMuted: '#120e0a',
      sidebarMutedFg: '#9c9189',
      sidebarActive: '#ff6b35', // orange stays vibrant on dark
      sidebarActiveFg: '#ffffff',

      // TEXT
      text: '#f5f0ea',         // warm white
      textSecondary: '#d4ccc3',
      textMuted: '#9c9189',
      textInverse: '#0f0b09',

      // ACTIONS / ACCENTS
      primary: '#ff6b35',      // orange pops on dark bg
      primaryHover: '#ff8555',
      secondary: '#2a2018',
      secondaryHover: '#382d20',
      accent: '#ff6b35',
      accentHover: '#ff8555',

      // STATES / BADGES
      badge: '#ff6b35',
      success: '#4d9e78',
      info: '#5b8fad',
      warning: '#e09030',
      error: '#d95c4a',

      // BORDERS
      border: '#2a2018',
      borderHover: '#3d3025',
      borderRadius: '8px',

      // LINKS
      link: '#ff6b35',
      linkHover: '#ff9966',

      // SHADOWS
      shadow: '0 2px 6px rgba(0,0,0,0.7)',
      shadowMd: '0 10px 20px rgba(0,0,0,0.8)',
      shadowLg: '0 24px 48px rgba(0,0,0,0.9)',

      // PRODUCT PAGE
      priceText: '#f5f0ea',
      priceStrike: '#4a3d30',
      dealBg: '#1f1208',       // very dark orange-brown — premium flyer feel
      starColor: '#ff6b35',
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
