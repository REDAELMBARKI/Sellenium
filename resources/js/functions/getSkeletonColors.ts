import { ThemePalette } from "@/types/ThemeTypes";

export const getSkeletonColors = (
  theme: ThemePalette,
  mode: "light" | "dark"
) => {
  const isDark = mode === "dark";

  const gray = isDark
    ? {
        card: "#1f2937",
        image: "#374151",
        lineStrong: "#4b5563",
        lineSoft: "#374151",
        border: "#374151",
      }
    : {
        card: "#f9fafb",
        image: "#e5e7eb",
        lineStrong: "#d1d5db",
        lineSoft: "#e5e7eb",
        border: "#e5e7eb",
      };

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return {
    page: theme.bg,
    surface: theme.bgSecondary,
    shadow: theme.shadow,
    radius: theme.borderRadius,

    card: gray.card,
    image: gray.image,
    lineStrong: gray.lineStrong,
    lineSoft: gray.lineSoft,
    border: gray.border,

    accentRail: hexToRgba(theme.accent, 0.25),
    accentIconTint: hexToRgba(theme.accent, 0.15),
  };
};
