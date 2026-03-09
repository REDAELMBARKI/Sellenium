import React from "react";
import { ThemePalette } from "@/types/theme";

interface Attribute {
  id: string;
  name: string;
}

interface AttributeSelectorProps {
  label: string;
  attributes: Attribute[];
  selectedAttribute?: Attribute;
  onAttributeSelect: (attribute: Attribute) => void;
  theme?: ThemePalette;
}

export const AttributeSelector: React.FC<AttributeSelectorProps> = ({
  label,
  attributes,
  selectedAttribute,
  onAttributeSelect,
  theme,
}) => {
  return (
    <div className="space-y-3">
      <label
        className="text-sm font-semibold uppercase tracking-wide"
        style={{ color: theme?.text ?? "#0f172a" }}
      >
        {label}:{" "}
        <span style={{ color: theme?.accent ?? "#64748b" }}>
          {selectedAttribute?.name}
        </span>
      </label>
      <div className="flex flex-wrap gap-3">
        {attributes.map((attr) => {
          const isSelected = selectedAttribute?.id === attr.id;
          return (
            <button
              key={attr.id}
              onClick={() => onAttributeSelect(attr)}
              className="px-6 py-3 font-semibold transition-all duration-200 hover:scale-105"
              style={{
                borderRadius: theme?.borderRadius ?? "12px",
                background: isSelected
                  ? (theme?.primary ?? "#0f172a")
                  : (theme?.card ?? "#fff"),
                color: isSelected
                  ? (theme?.textInverse ?? "#fff")
                  : (theme?.text ?? "#0f172a"),
                border: `2px solid ${isSelected ? (theme?.primary ?? "#0f172a") : (theme?.border ?? "#cbd5e1")}`,
                boxShadow: isSelected ? (theme?.shadow ?? "0 2px 8px rgba(0,0,0,0.15)") : "none",
                outline: isSelected ? `2px solid ${theme?.primary ?? "#0f172a"}` : "none",
                outlineOffset: isSelected ? 2 : 0,
              }}
            >
              {attr.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AttributeSelector;