import React from "react";
import { ThemePalette } from "@/types/ThemeTypes";
import { Color } from "@/types/inventoryTypes";

interface ColorSelectorProps {
  colors: (Color & { variant_id: number })[];
  selectedColor?: Color & { variant_id: number };
  onColorSelect: (color: Color & { variant_id: number }) => void;
  theme?: ThemePalette;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  selectedColor,
  onColorSelect,
  theme,
}) => {
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

      <div className="flex flex-wrap gap-4">
        {colors.map((color) => {
          const isSelected = selectedColor?.id === color.id;

          const hex = color.hex?.replace("#", "") ?? "000000";
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const dotColor = luminance > 0.55 ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.85)";

          return (
            <button
              key={color.id}
              onClick={() => onColorSelect(color)}
              title={color.name}
              className="relative flex-shrink-0 transition-all duration-200 hover:scale-110"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: color.hex,
                boxShadow: isSelected
                  ? `0 0 0 3px ${theme?.bg ?? "#fff"}, 0 0 0 5px ${theme?.primary ?? "#0f172a"}`
                  : `0 0 0 2px ${theme?.border ?? "#cbd5e1"}`,
                transform: isSelected ? "scale(1.15)" : "scale(1)",
                outline: "none",
              }}
            >
              {isSelected && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: dotColor,
                      display: "block",
                    }}
                  />
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