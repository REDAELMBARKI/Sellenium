import { ThemePalette } from "@/types/ThemeTypes";
import { useRef, useState, useEffect } from "react";

const DB_COLORS = [
  { name: "Black",  hex: "#1a1a1a" },
  { name: "White",  hex: "#f0f0f0" },
  { name: "Red",    hex: "#e53e3e" },
  { name: "Blue",   hex: "#3182ce" },
  { name: "Green",  hex: "#38a169" },
  { name: "Yellow", hex: "#d69e2e" },
  { name: "Navy",   hex: "#2c3e7a" },
  { name: "Gray",   hex: "#718096" },
  { name: "Pink",   hex: "#ed64a6" },
  { name: "Beige",  hex: "#d4b896" },
];

interface ColorPickerProps {
  value: string | null;
  name?: string | null;
  onChange: (hex: string, name: string) => void;
  theme: ThemePalette;
}

export default function ColorPicker({ value, name, onChange, theme }: ColorPickerProps) {
  const pickerRef = useRef<HTMLInputElement>(null);
  const [customName, setCustomName] = useState(name || "");

  const predefined = DB_COLORS.find((c) => c.hex === value);
  const isCustom = !!value && !predefined;

  useEffect(() => {
    if (!isCustom) {
      setCustomName("");
    }
  }, [value]);

  const handleCustomColorChange = (hex: string) => {
    setCustomName("");
    onChange(hex, "");
  };

  const handleCustomNameBlur = () => {
    if (value && customName.trim()) {
      onChange(value, customName.trim());
    }
  };

  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: "0.1em", color: theme.textMuted, marginBottom: 10 }}>
        COLOR
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        {DB_COLORS.map((color) => {
          const sel = value === color.hex;
          return (
            <button
              type="button"
              key={color.hex}
              title={color.name}
              onClick={() => onChange(color.hex, color.name)}
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: color.hex,
                cursor: "pointer",
                border: sel ? `3px solid ${theme.primary}` : `2px solid ${theme.border}`,
                boxShadow: sel
                  ? `0 0 0 2px ${theme.bgSecondary}, 0 0 0 4px ${theme.primary}`
                  : "none",
              }}
            />
          );
        })}

        {/* Custom color */}
        <button
          type="button"
          title="Pick custom color"
          onClick={() => pickerRef.current?.click()}
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            cursor: "pointer",
            background: isCustom
              ? value!
              : "conic-gradient(red,yellow,lime,aqua,blue,magenta,red)",
            border: isCustom
              ? `3px solid ${theme.primary}`
              : `2px dashed ${theme.border}`,
          }}
        />

        <input
          ref={pickerRef}
          type="color"
          hidden
          onChange={(e) => handleCustomColorChange(e.target.value)}
        />

        {value && (
          <span style={{ fontSize: 12, color: theme.textSecondary, marginLeft: 6 }}>
            {(predefined?.name || customName || "Custom")} selected
          </span>
        )}
      </div>

      {/* Custom Name Input */}
      {isCustom && (
        <div style={{ marginTop: 12 }}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: theme.text,
              display: "block",
              marginBottom: 6,
            }}
          >
            Name this color <span style={{ color: theme.error }}>*</span>
          </label>

          <input
            type="text"
            value={customName}
            placeholder="Enter color name (e.g. Ocean Blue)"
            onChange={(e) => setCustomName(e.target.value)}
            onBlur={handleCustomNameBlur}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              border: `2px solid ${
                !customName ? theme.error : theme.border
              }`,
              background: theme.bg,
              color: theme.text,
              outline: "none",
            }}
          />

          {!customName && (
            <p style={{ fontSize: 11, color: theme.error, marginTop: 4 }}>
              A name is required for custom colors.
            </p>
          )}

          <p style={{ fontSize: 11, color: theme.textMuted, marginTop: 6 }}>
            This name will be displayed on the product page as the product color.
          </p>
        </div>
      )}
    </div>
  );
}