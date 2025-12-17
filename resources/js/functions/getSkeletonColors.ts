// getSkeletonColors.ts
import { grayColors, accentColors } from "@/data/currentTheme";
import { UIColorsType } from "@/types/UIColorsType";

export const getSkeletonColors = (theme: UIColorsType, mode: 'light' | 'dark') => {
  if (mode === 'light') {
    return {
      page: grayColors.gray50,
      card: grayColors.gray100,
      image: grayColors.gray200,
      line: grayColors.gray300,
      border: grayColors.gray200,
      accent: accentColors.lightAccent, // subtle warm/cool tint
      shadow: '0 2px 6px rgba(0,0,0,0.08)',
      borderRadius: '8px',
      gray200: grayColors.gray200,
      gray300: grayColors.gray300,
    };
  } else {
    return {
      page: grayColors.gray900,
      card: grayColors.gray800,
      image: grayColors.gray700,
      line: grayColors.gray600,
      border: grayColors.gray700,
      accent: accentColors.darkAccent, // subtle glow/tint
      shadow: '0 2px 6px rgba(0,0,0,0.4)',
      borderRadius: '8px',
      gray200: grayColors.gray700,
      gray300: grayColors.gray600,
    };
  }
};
