import { ThemePalette } from "@/types/ThemeTypes";
import { useRef } from "react";

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
  onChange: (hex: string, name: string) => void;
  theme: ThemePalette;
}

export default function ColorPicker({ value, onChange, theme }: ColorPickerProps) {
  const pickerRef = useRef<HTMLInputElement>(null);
  const isCustom = value && !DB_COLORS.find((c) => c.hex === value);

  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: "0.1em", color: theme.textMuted, marginBottom: 10 }}>COLOR</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        {DB_COLORS.map((color) => {
          const sel = value === color.hex;
          return (
            <button type="button" key={color.hex} title={color.name} onClick={() => onChange(color.hex, color.name)} style={{
              width: 30, height: 30, borderRadius: "50%", background: color.hex, cursor: "pointer",
              border: sel ? `3px solid ${theme.primary}` : `2px solid ${theme.border}`,
              boxShadow: sel ? `0 0 0 2px ${theme.bgSecondary}, 0 0 0 4px ${theme.primary}` : "none",
              transition: "all 0.15s", position: "relative", flexShrink: 0,
            }}>
              {sel && (
                <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: color.hex === "#f0f0f0" ? "#333" : "#fff", fontWeight: 700 }}>✓</span>
              )}
            </button>
          );
        })}

        {/* Custom color picker */}
        <button type="button" title="Pick custom color" onClick={() => pickerRef.current?.click()} style={{
          width: 30, height: 30, borderRadius: "50%", cursor: "pointer", flexShrink: 0,
          background: isCustom ? value! : "conic-gradient(red,yellow,lime,aqua,blue,magenta,red)",
          border: isCustom ? `3px solid ${theme.primary}` : `2px dashed ${theme.border}`,
          boxShadow: isCustom ? `0 0 0 2px ${theme.bgSecondary}, 0 0 0 4px ${theme.primary}` : "none",
          transition: "all 0.15s",
        }} />
        <input ref={pickerRef} type="color" hidden onChange={(e) => onChange(e.target.value, "Custom")} />

        {value && (
          <span style={{ fontSize: 12, color: theme.textSecondary, marginLeft: 4 }}>
            {DB_COLORS.find((c) => c.hex === value)?.name || "Custom"} selected
          </span>
        )}
      </div>
    </div>
  );
}