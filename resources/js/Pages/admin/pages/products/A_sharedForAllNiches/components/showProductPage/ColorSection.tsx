import React from "react";
import { Check } from "lucide-react";
import { ThemePalette } from "@/types/ThemeTypes";
import { Color } from "@/types/inventoryTypes";

interface ColorSelectorProps {
  colors: (Color & {variant_id : number})[];
  selectedColor?: Color & {variant_id : number};
  onColorSelect: (color: Color & {variant_id : number}) => void;
  theme?: ThemePalette;
}

export const  ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  selectedColor,
  onColorSelect,
  theme,
}) => {
  const handleColorClick = (color: Color & {variant_id : number}) => {
    onColorSelect(color);
  };

  return (
    <div className="space-y-3">
      <label
        className="text-sm font-semibold uppercase tracking-wide"
        style={{ color: theme?.text ?? "#0f172a" }}
      >
        Color:{" "}
        <span style={{ color: theme?.accent ?? "#64748b" }}>
          {selectedColor?.name}
        </span>
      </label>

      <div className="flex flex-wrap gap-3">
        {colors.map((color) => {
          const isSelected = selectedColor?.id === color.id;
          /* Determine contrast for the checkmark */
          const hex = color.hex?.replace("#", "") ?? "000000";
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const checkColor = luminance > 0.55 ? "#000000" : "#ffffff";

          return (
            <button
              key={color.id}
              onClick={() => handleColorClick(color)}
              title={color.name}
              className="relative flex-shrink-0 transition-all duration-200"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                backgroundColor: color.hex,
                /* visible border always – thicker + offset when selected */
                outline: isSelected
                  ? `3px solid ${theme?.primary ?? "#0f172a"}`
                  : `2px solid ${theme?.border ?? "#cbd5e1"}`,
                outlineOffset: isSelected ? 3 : 1,
                boxShadow: isSelected
                  ? `0 0 0 1px ${theme?.bg ?? "#fff"}, 0 4px 12px rgba(0,0,0,0.18)`
                  : "0 1px 4px rgba(0,0,0,0.12)",
                transform: isSelected ? "scale(1.12)" : "scale(1)",
              }}
              onMouseEnter={(e) => {
                if (!isSelected)
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                if (!isSelected)
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1)";
              }}
            >
              {isSelected && (
                <span
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ color: checkColor }}
                >
                  <Check strokeWidth={3} style={{ width: 18, height: 18 }} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorSelector;