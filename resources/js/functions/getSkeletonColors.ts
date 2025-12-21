import { ThemePalette } from "@/types/ThemeTypes";

export const getSkeletonColors = (
  theme: ThemePalette,
  mode: "light" | "dark"
) => {
  const isDark = mode === "dark";

  // Neutral grayscale (content)
  const gray = isDark
    ? {
        card: "#1f2937",     // gray-800
        image: "#374151",    // gray-700
        lineStrong: "#4b5563", // gray-600
        lineSoft: "#374151",   // gray-700
        border: "#374151",
      }
    : {
        card: "#f1f5f9",     // gray-100
        image: "#e5e7eb",    // gray-200
        lineStrong: "#d1d5db", // gray-300
        lineSoft: "#e5e7eb",   // gray-200
        border: "#e5e7eb",
      };

  return {
    // 🔹 STRUCTURE (theme-aware)
    page: theme.bg,
    surface: theme.bgSecondary,
    header: theme.bgSecondary,
    accent: theme.accent,          // use VERY sparingly
    shadow: theme.shadow,
    radius: theme.borderRadius ,

    // 🔹 CONTENT (always neutral)
    card: gray.card,
    image: gray.image,
    lineStrong: gray.lineStrong,
    lineSoft: gray.lineSoft,
    border: gray.border,
  };
};
