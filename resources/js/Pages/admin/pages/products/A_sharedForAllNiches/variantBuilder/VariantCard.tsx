import { useRef, useState } from "react";
import { X, Upload, ChevronDown, Image } from "lucide-react";
import { ThemePalette } from "@/types/ThemeTypes";
import { Variant } from "@/types/products/productVariantType";
import ColorPicker from "./ColorPicker";

const OPTION_VALUES: Record<string, string[]> = {
  Size:         ["XS", "S", "M", "L", "XL", "XXL"],
  Storage:      ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"],
  RAM:          ["4GB", "8GB", "16GB", "32GB"],
  Style:        ["Classic", "Modern", "Slim", "Oversized", "Cropped"],
  Width:        ["Narrow", "Regular", "Wide", "Extra Wide"],
  Connectivity: ["WiFi", "4G", "5G", "Bluetooth"],
  Flavor:       ["Vanilla", "Chocolate", "Strawberry", "Mint", "Caramel"],
};

const DEMO_PLACEHOLDERS: Record<string, string> = {
  price: "e.g. 299",
  stock: "e.g. 50",
  sku: "e.g. SHIRT-RED-M",
};

interface VariantCardProps {
  variant: Variant;
  activeOptions: string[];
  productPrice: number;
  colorImages: Record<string, string>;
  onChange: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
  onDone: (id: string) => void;
  theme: ThemePalette;
}

export default function VariantCard({
  variant, activeOptions, productPrice, colorImages,
  onChange, onRemove, onDone, theme
}: VariantCardProps) {
  const [overrideImage, setOverrideImage] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);

  // ── pull color from attrs ──────────────────────────────────────────────
  const color = variant.attrs?.color as { hex: string; name: string } | undefined;
  const colorHex  = color?.hex  ?? null;
  const colorName = color?.name ?? null;

  // ── label ──────────────────────────────────────────────────────────────
  const label = activeOptions
    .map((opt) => {
      if (opt === "Color") return colorName;
      return variant.attrs?.[opt] as string | undefined;
    })
    .filter(Boolean)
    .join(" / ") || "New Variant";

  // ── images ─────────────────────────────────────────────────────────────
  const inheritedImage = colorHex ? colorImages[colorHex] : null;
  const displayImage   = variant.imageUrl || inheritedImage;
  const isInherited    = !variant.imageUrl && !!inheritedImage;

  const inp: React.CSSProperties = {
    background: theme.bg,
    border: `1px solid ${theme.border}`,
    borderRadius: theme.borderRadius,
    padding: "9px 12px",
    fontSize: 13,
    color: theme.text,
    width: "100%",
    transition: "border-color 0.15s",
  };

  return (
    <div style={{
      background: theme.bgSecondary,
      border: `1px solid ${variant.isOpen ? theme.primary + "55" : theme.border}`,
      borderRadius: theme.borderRadius,
      overflow: "hidden",
      transition: "border-color 0.2s, box-shadow 0.2s",
      boxShadow: variant.isOpen ? `0 0 0 3px ${theme.primary}18` : "none",
    }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px" }}>

        {activeOptions.includes("Color") && (
          <div style={{ position: "relative", flexShrink: 0 }}>
            {displayImage ? (
              <div style={{ width: 36, height: 36, borderRadius: 6, overflow: "hidden", border: `2px solid ${colorHex || theme.border}` }}>
                <img src={displayImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ) : (
              <div style={{
                width: 36, height: 36, borderRadius: 6,
                background: colorHex || theme.border,
                border: `2px solid ${theme.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {!colorHex && <Image size={14} color={theme.textMuted} />}
              </div>
            )}
            {isInherited && (
              <div style={{ position: "absolute", bottom: -3, right: -3, background: theme.success, borderRadius: "50%", width: 12, height: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 7, color: "#fff" }}>↓</span>
              </div>
            )}
          </div>
        )}

        <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: variant.isOpen ? theme.text : theme.textSecondary }}>
          {label}
        </span>

        {!variant.isOpen && (
          <span style={{ fontSize: 12, color: theme.textMuted }}>
            {variant.price || productPrice} MAD &nbsp;·&nbsp; {variant.stock ? `${variant.stock} units` : <span style={{ color: theme.error + "cc" }}>no stock</span>}
          </span>
        )}

        <button
          onClick={() => onChange(variant.id, "isOpen", !variant.isOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", color: theme.textMuted, padding: 2 }}
        >
          <ChevronDown size={14} style={{ transform: variant.isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
        </button>

        <button onClick={() => onRemove(variant.id)} style={{ background: "none", border: "none", cursor: "pointer", color: theme.textMuted, padding: 2 }}>
          <X size={14} />
        </button>
      </div>

      {/* ── Body ── */}
      {variant.isOpen && (
        <div style={{ padding: "0 16px 20px", borderTop: `1px solid ${theme.border}` }}>

          {/* Color */}
          {activeOptions.includes("Color") && (
            <div style={{ marginTop: 18 }}>
              <ColorPicker
                value={colorHex}
                onChange={(hex, name) => {
                  onChange(variant.id, "attrs.color", { hex, name });
                  setOverrideImage(false);
                }}
                theme={theme}
              />
            </div>
          )}

          {/* Other option selects */}
          {activeOptions.filter((o) => o !== "Color").length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 18 }}>
              {activeOptions.filter((o) => o !== "Color").map((opt) => (
                <div key={opt}>
                  <label style={{ fontSize: 11, color: theme.textMuted, letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                    {opt.toUpperCase()}
                  </label>
                  <div style={{ position: "relative" }}>
                    <select
                      value={(variant.attrs?.[opt] as string) || ""}
                      onChange={(e) => onChange(variant.id, `attrs.${opt.toLowerCase()}`, e.target.value)}
                      style={{ ...inp, cursor: "pointer", appearance: "none" as any }}
                    >
                      <option value="">— pick {opt.toLowerCase()} —</option>
                      {(OPTION_VALUES[opt] || []).map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                    <ChevronDown size={12} color={theme.textMuted} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Price / Stock / SKU */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 18 }}>
            <div>
              <label style={{ fontSize: 11, color: theme.textMuted, letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>PRICE</label>
              <input
                type="number"
                value={variant.price}
                placeholder={DEMO_PLACEHOLDERS.price}
                onChange={(e) => onChange(variant.id, "price", e.target.value)}
                style={inp}
              />
              <span style={{ fontSize: 10, color: theme.textMuted, marginTop: 4, display: "block" }}>pre-filled from product</span>
            </div>
            <div>
              <label style={{ fontSize: 11, color: theme.textMuted, letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                STOCK <span style={{ color: theme.error }}>*</span>
              </label>
              <input
                type="number"
                value={variant.stock}
                placeholder={DEMO_PLACEHOLDERS.stock}
                onChange={(e) => onChange(variant.id, "stock", e.target.value)}
                style={{ ...inp, borderColor: !variant.stock ? theme.error + "66" : theme.border }}
              />
              <span style={{ fontSize: 10, color: theme.textMuted, marginTop: 4, display: "block" }}>how many in stock</span>
            </div>
            <div>
              <label style={{ fontSize: 11, color: theme.textMuted, letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>SKU</label>
              <input
                value={variant.sku}
                placeholder={DEMO_PLACEHOLDERS.sku}
                onChange={(e) => onChange(variant.id, "sku", e.target.value)}
                style={inp}
              />
              <span style={{ fontSize: 10, color: theme.textMuted, marginTop: 4, display: "block" }}>auto-generated</span>
            </div>
          </div>

          {/* Image section */}
          <div style={{ marginTop: 18 }}>
            <label style={{ fontSize: 11, color: theme.textMuted, letterSpacing: "0.08em", display: "block", marginBottom: 10 }}>IMAGE</label>

            {inheritedImage && !overrideImage ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: theme.borderRadius }}>
                <img src={inheritedImage} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, border: `1px solid ${theme.border}` }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, color: theme.text, marginBottom: 2 }}>Inherited from <strong style={{ color: colorHex || "color" }}>{colorName}</strong></p>
                  <p style={{ fontSize: 11, color: theme.textMuted }}>All {colorName} variants share this image</p>
                </div>
                <button
                  onClick={() => setOverrideImage(true)}
                  style={{ padding: "5px 10px", borderRadius: theme.borderRadius, border: `1px solid ${theme.border}`, background: "transparent", color: theme.textMuted, fontSize: 11, cursor: "pointer" }}
                >
                  Override
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {variant.imageUrl ? (
                  <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
                    <img src={variant.imageUrl} alt="" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: theme.borderRadius, border: `1px solid ${theme.border}` }} />
                    <button
                      onClick={() => { onChange(variant.id, "imageUrl", null); setOverrideImage(false); }}
                      style={{ position: "absolute", top: -6, right: -6, background: theme.error, border: "none", borderRadius: "50%", width: 18, height: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <X size={10} color="#fff" />
                    </button>
                  </div>
                ) : (
                  <div onClick={() => imgRef.current?.click()} style={{ width: 64, height: 64, borderRadius: theme.borderRadius, border: `2px dashed ${theme.border}`, background: theme.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", gap: 4, flexShrink: 0 }}>
                    <Upload size={16} color={theme.textMuted} />
                    <span style={{ fontSize: 9, color: theme.textMuted }}>upload</span>
                  </div>
                )}
                <input ref={imgRef} type="file" accept="image/*" hidden onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onChange(variant.id, "imageUrl", URL.createObjectURL(f));
                }} />
                <div>
                  <p style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 4 }}>
                    {variant.imageUrl ? "Custom image for this variant" : "Upload a specific image for this variant"}
                  </p>
                  {inheritedImage && (
                    <button onClick={() => { onChange(variant.id, "imageUrl", null); setOverrideImage(false); }}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: theme.textMuted, padding: 0 }}>
                      ← Use inherited image
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Done */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20, gap: 8 }}>
            <button onClick={() => onRemove(variant.id)} style={{ padding: "8px 16px", borderRadius: theme.borderRadius, border: `1px solid ${theme.border}`, background: "transparent", color: theme.textMuted, fontSize: 13, cursor: "pointer" }}>
              Remove
            </button>
            <button onClick={() => onDone(variant.id)} style={{ padding: "8px 24px", borderRadius: theme.borderRadius, background: theme.primary, border: "none", color: theme.textInverse, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
              ✓ Save Variant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}