import React from "react";
import { Check } from "lucide-react";

interface Color {
  id: string;
  name: string;
  hex: string;
}

interface ColorSelectorProps {
  colors: Color[];
  selectedColor?: Color;
  onColorSelect: (color: Color) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  selectedColor,
  onColorSelect
}) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
        Color: {selectedColor?.name}
      </label>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color.id}
            onClick={() => onColorSelect(color)}
            className={`relative w-12 h-12 rounded-full transition-all duration-200 transform hover:scale-110 ${
              selectedColor?.id === color.id
                ? "ring-4 ring-slate-900 ring-offset-2 shadow-lg"
                : "ring-2 ring-slate-300 hover:ring-slate-400"
            }`}
            style={{ backgroundColor: color.hex }}
            title={color.name}
          >
            {selectedColor?.id === color.id && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className="w-6 h-6 text-white drop-shadow-lg" strokeWidth={3} />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;
