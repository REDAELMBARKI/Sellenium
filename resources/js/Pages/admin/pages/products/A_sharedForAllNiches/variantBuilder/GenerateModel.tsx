import { useState } from "react";
import { X, Zap } from "lucide-react";
import { Variant } from "@/types/products/productVariantType";
import { ThemePalette } from "@/types/ThemeTypes";

const DB_COLORS = [
  { name: "Black",  hex: "#1a1a1a" }, { name: "White",  hex: "#f0f0f0" },
  { name: "Red",    hex: "#e53e3e" }, { name: "Blue",   hex: "#3182ce" },
  { name: "Green",  hex: "#38a169" }, { name: "Yellow", hex: "#d69e2e" },
  { name: "Navy",   hex: "#2c3e7a" }, { name: "Gray",   hex: "#718096" },
  { name: "Pink",   hex: "#ed64a6" }, { name: "Beige",  hex: "#d4b896" },
];
const COLOR_HEX = Object.fromEntries(DB_COLORS.map((c) => [c.name, c.hex]));

const OPTION_SUGGESTIONS: Record<string, string[]> = {
  Size:         ["XS","S","M","L","XL","XXL"],
  Storage:      ["32GB","64GB","128GB","256GB","512GB"],
  RAM:          ["4GB","8GB","16GB","32GB"],
  Style:        ["Classic","Modern","Slim","Oversized"],
  Width:        ["Narrow","Regular","Wide"],
  Connectivity: ["WiFi","4G","5G"],
  Flavor:       ["Vanilla","Chocolate","Strawberry","Mint"],
};

function generateCombinations(optionValues: Record<string, string[]>): Array<Record<string, string>> {
  const keys = Object.keys(optionValues).filter((k) => (optionValues[k] || []).length > 0);
  if (!keys.length) return [];
  const combine = (arrays: string[][]): string[][] =>
    arrays.reduce<string[][]>((acc, arr) => acc.flatMap((a) => arr.map((b) => [...a, b])), [[]]);
  return combine(keys.map((k) => optionValues[k])).map((combo) =>
    Object.fromEntries(keys.map((k, i) => [k, combo[i]]))
  );
}

interface GenerateModalProps {
  activeOptions: string[];
  existingVariants: Variant[];
  productPrice: number;
  onAdd: (variants: Variant[]) => void;
  onClose: () => void;
  theme: ThemePalette;
}

export default function GenerateModal({ activeOptions, existingVariants, productPrice, onAdd, onClose, theme }: GenerateModalProps) {
  const [modalValues, setModalValues] = useState<Record<string, string[]>>(
    Object.fromEntries(activeOptions.map((o) => [o, []]))
  );
  const [generated, setGenerated] = useState<Array<Record<string, string>>>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleValue = (opt: string, val: string) => {
    setModalValues((prev) => {
      const cur = prev[opt] || [];
      return { ...prev, [opt]: cur.includes(val) ? cur.filter((v) => v !== val) : [...cur, val] };
    });
    setGenerated([]); setSelected(new Set());
  };

  const comboKey = (combo: Record<string, string>) => Object.values(combo).join(" / ");

  const alreadyAdded = (combo: Record<string, string>) =>
    existingVariants.some((v) => {
      const vKey = activeOptions.map((o) => o === "Color" ? v.colorName : v.attrs[o]).join(" / ");
      return vKey === comboKey(combo);
    });

  const toggleSelect = (key: string) =>
    setSelected((prev) => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });

  const handleAdd = () => {
    const toAdd: Variant[] = generated
      .filter((c) => selected.has(comboKey(c)) && !alreadyAdded(c))
      .map((c, i) => ({
        id: `gen-${Date.now()}-${i}`,
        colorHex: c["Color"] ? (COLOR_HEX[c["Color"]] || "#888") : null,
        colorName: c["Color"] || null,
        attrs: Object.fromEntries(Object.entries(c).filter(([k]) => k !== "Color")),
        price: productPrice, stock: "",
        sku: `SKU-${String(existingVariants.length + i + 1).padStart(3, "0")}`,
        imageUrl: null,
        isOpen: true,
      }));
    onAdd(toAdd); onClose();
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: theme.overlay, zIndex: 40 }} />
      <div style={{ position: "fixed", zIndex: 50, top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "90%", maxWidth: 520, maxHeight: "80vh", overflowY: "auto", background: theme.modal, border: `1px solid ${theme.border}`, borderRadius: theme.borderRadius, boxShadow: theme.shadowLg }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${theme.border}`, position: "sticky", top: 0, background: theme.modal, zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Zap size={16} color={theme.primary} />
            <span style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>Generate Variants</span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: theme.textMuted }}><X size={16} /></button>
        </div>

        <div style={{ padding: 20 }}>
          <p style={{ fontSize: 12, color: theme.textMuted, marginBottom: 20 }}>
            Select values for each option — combinations will be generated automatically. Then pick which ones you want.
          </p>

          {activeOptions.map((opt) => (
            <div key={opt} style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 11, letterSpacing: "0.1em", color: theme.textMuted, marginBottom: 8 }}>{opt.toUpperCase()}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {opt === "Color"
                  ? DB_COLORS.map((c) => {
                      const active = (modalValues[opt] || []).includes(c.name);
                      return (
                        <button key={c.name} onClick={() => toggleValue(opt, c.name)} title={c.name} style={{
                          width: 28, height: 28, borderRadius: "50%", background: c.hex, cursor: "pointer", flexShrink: 0,
                          border: active ? `3px solid ${theme.primary}` : `2px solid ${theme.border}`,
                          boxShadow: active ? `0 0 0 2px ${theme.modal}, 0 0 0 4px ${theme.primary}` : "none",
                          transition: "all 0.12s",
                        }} />
                      );
                    })
                  : (OPTION_SUGGESTIONS[opt] || []).map((s) => {
                      const active = (modalValues[opt] || []).includes(s);
                      return (
                        <button key={s} onClick={() => toggleValue(opt, s)} style={{
                          padding: "5px 12px", borderRadius: theme.borderRadius, fontSize: 12,
                          border: `1px solid ${active ? theme.primary : theme.border}`,
                          background: active ? theme.primary + "22" : "transparent",
                          color: active ? theme.primary : theme.textSecondary,
                          cursor: "pointer", transition: "all 0.12s",
                        }}>{s}</button>
                      );
                    })
                }
              </div>
            </div>
          ))}

          <button
            onClick={() => { setGenerated(generateCombinations(modalValues)); setSelected(new Set()); }}
            style={{ width: "100%", padding: 10, borderRadius: theme.borderRadius, background: theme.primary, border: "none", color: theme.textInverse, fontSize: 13, cursor: "pointer", fontWeight: 600, marginBottom: 20 }}
          >
            Generate Combinations →
          </button>

          {generated.length > 0 && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: theme.textMuted }}>{generated.length} combinations</span>
                <button
                  onClick={() => setSelected(new Set(generated.filter((c) => !alreadyAdded(c)).map(comboKey)))}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: theme.primary }}
                >
                  Select all available
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                {generated.map((combo) => {
                  const key = comboKey(combo); const added = alreadyAdded(combo); const isSel = selected.has(key);
                  return (
                    <div key={key} onClick={() => !added && toggleSelect(key)} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                      borderRadius: theme.borderRadius,
                      border: `1px solid ${isSel ? theme.primary : theme.border}`,
                      background: added ? "#ffffff06" : isSel ? theme.primary + "11" : "transparent",
                      cursor: added ? "default" : "pointer", opacity: added ? 0.5 : 1, transition: "all 0.12s",
                    }}>
                      <div style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0, border: `1px solid ${isSel ? theme.primary : theme.border}`, background: isSel ? theme.primary : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {isSel && <span style={{ fontSize: 10, color: "#fff" }}>✓</span>}
                      </div>
                      {combo["Color"] && (
                        <span style={{ width: 12, height: 12, borderRadius: "50%", flexShrink: 0, background: COLOR_HEX[combo["Color"]] || "#888", border: `1px solid ${theme.border}` }} />
                      )}
                      <span style={{ flex: 1, fontSize: 13, color: added ? theme.textMuted : theme.text }}>{key}</span>
                      {added && <span style={{ fontSize: 11, color: theme.textMuted }}>already added</span>}
                    </div>
                  );
                })}
              </div>

              {selected.size > 0 && (
                <button onClick={handleAdd} style={{ width: "100%", padding: 10, borderRadius: theme.borderRadius, background: theme.primary, border: "none", color: theme.textInverse, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
                  Add selected ({selected.size}) →
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}