import { useRef, useState } from "react";
import { X, Upload, ChevronDown, Image, Wand2 } from "lucide-react";
import { ThemePalette } from "@/types/ThemeTypes";
import { Variant } from "@/types/products/productVariantType";
import ColorPicker from "./ColorPicker";
import PricePreview from "../components/editAndCreate/PricePreview";
import { Input } from "@/components/ui/input";

const OPTION_VALUES: Record<string, string[]> = {
  Size:         ["XS", "S", "M", "L", "XL", "XXL"],
  Storage:      ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"],
  RAM:          ["4GB", "8GB", "16GB", "32GB"],
  Style:        ["Classic", "Modern", "Slim", "Oversized", "Cropped"],
  Width:        ["Narrow", "Regular", "Wide", "Extra Wide"],
  Connectivity: ["WiFi", "4G", "5G", "Bluetooth"],
  Flavor:       ["Vanilla", "Chocolate", "Strawberry", "Mint", "Caramel"],
};

// ─── Types ────────────────────────────────────────────────────────────────────
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

interface CreateVariantFormProps {
  variant: Variant;
  activeOptions: string[];
  colorHex: string | null;
  colorName: string | null;
  inheritedImage: string | null;
  overrideImage: boolean;
  setOverrideImage: (val: boolean) => void;
  imgRef: React.RefObject<HTMLInputElement> | null;
  onChange: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
  onDone: (id: string) => void;
  theme: ThemePalette;
}

// ─── Variant Form ─────────────────────────────────────────────────────────────
function CreateVariantForm({
  variant, activeOptions,
  colorHex, colorName,
  inheritedImage, overrideImage, setOverrideImage, imgRef,
  onChange, onRemove, onDone, theme,
}: CreateVariantFormProps) {

  const inputClassName = "w-full px-5 py-4 rounded-xl font-medium shadow-sm";
  const inputStyle = (hasError?: boolean) => ({
    backgroundColor: theme.bg,
    color: theme.text,
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: hasError ? '#ef4444' : theme.border,
  });
  const labelClassName = "block text-sm font-bold mb-4 uppercase tracking-wide";
  const sectionLabelClassName = "text-xs font-bold uppercase tracking-widest mb-3";

  return (
    <div style={{ padding: "0 16px 20px", borderTop: `1px solid ${theme.border}` }}>

      {/* Color picker */}
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
        <div className="grid grid-cols-2 gap-4" style={{ marginTop: 18 }}>
          {activeOptions.filter((o) => o !== "Color").map((opt) => (
            <div key={opt}>
              <label className={labelClassName} style={{ color: theme.text }}>{opt}</label>
              <div style={{ position: "relative" }}>
                <select
                  value={(variant.attrs?.[opt.toLowerCase()] as string) || ""}
                  onChange={(e) => onChange(variant.id, `attrs.${opt.toLowerCase()}`, e.target.value)}
                  className={inputClassName}
                  style={{ ...inputStyle(), cursor: "pointer", appearance: "none" as any }}
                >
                  <option value="">— pick {opt.toLowerCase()} —</option>
                  {(OPTION_VALUES[opt] || []).map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
                <ChevronDown size={12} color={theme.textMuted} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Pricing Section ───────────────────────────────────────────────── */}
      <div
        className="rounded-xl p-4"
        style={{ marginTop: 18, border: `2px solid ${theme.border}`, background: theme.bgSecondary }}
      >
        <p className={sectionLabelClassName} style={{ color: theme.textMuted }}>Pricing</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Price */}
          <div>
            <label className={labelClassName} style={{ color: theme.text }}>Price</label>
            <Input
              type="number"
              value={variant.price ?? ''}
              placeholder="e.g. 299"
              onChange={(e) => onChange(variant.id, "price", e.target.value === '' ? null : Number(e.target.value))}
              className={inputClassName}
              style={inputStyle()}
            />
            <p className="text-xs mt-2" style={{ color: theme.textMuted }}>pre-filled from product</p>
          </div>

          {/* Compare Price */}
          <div>
            <label className={labelClassName} style={{ color: theme.text }}>Compare Price</label>
            <Input
              type="number"
              value={variant.compare_price ?? ''}
              placeholder="e.g. 399"
              onChange={(e) => onChange(variant.id, "compare_price", e.target.value === '' ? null : Number(e.target.value))}
              className={inputClassName}
              style={inputStyle()}
            />
            <p className="text-xs mt-2" style={{ color: theme.textMuted }}>original / crossed-out price</p>
          </div>

          {/* Preview */}
          <div>
            <label className={labelClassName} style={{ color: theme.text }}>Preview</label>
            <PricePreview
              price={variant.price ?? null}
              comparePrice={variant.compare_price ?? null}
              currentTheme={theme}
            />
          </div>
        </div>
      </div>

      {/* ── Stock & SKU Section ───────────────────────────────────────────── */}
      <div
        className="rounded-xl p-4"
        style={{ marginTop: 12, border: `2px solid ${theme.border}`, background: theme.bgSecondary }}
      >
        <p className={sectionLabelClassName} style={{ color: theme.textMuted }}>Inventory</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Stock */}
          <div>
            <label className={labelClassName} style={{ color: theme.text }}>
              Stock <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={variant.stock ?? ''}
              placeholder="e.g. 50"
              onChange={(e) => onChange(variant.id, "stock", e.target.value === '' ? null : Number(e.target.value))}
              className={inputClassName}
              style={inputStyle(!variant.stock)}
            />
            {!variant.stock && (
              <p className="text-red-500 text-xs mt-2">Stock is required</p>
            )}
          </div>

   <div>
          <label
            className="block text-sm font-bold mb-4 uppercase tracking-wide flex items-center gap-2"
            style={{ color: theme.text }}
          >
            SKU
            {!variant.sku && (
                          <span
                            className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full normal-case tracking-normal"
                            style={{
                              backgroundColor: theme.primary + '18',
                              color: theme.primary,
                              border: `1px solid ${theme.primary}40`,
                            }}
                          >
                            <Wand2 size={10} />
                            Auto
                          </span>
              )}
          </label>
          <Input
            type="text"
            value={variant.sku ?? ''}
            placeholder="Leave empty to auto-generate"
            onChange={(e) => onChange(variant.id, "sku", e.target.value)}
            className={inputClassName}
            style={inputStyle()}
          />
    
        </div>
   
        </div>
      </div>

      {/* ── Image Section ─────────────────────────────────────────────────── */}
      <div style={{ marginTop: 12 }}>
        <label className={labelClassName} style={{ color: theme.text }}>Image</label>

        {inheritedImage && !overrideImage ? (
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: theme.bg, border: `2px solid ${theme.border}` }}
          >
            <img src={inheritedImage} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, border: `1px solid ${theme.border}` }} />
            <div style={{ flex: 1 }}>
              <p className="text-sm font-medium" style={{ color: theme.text }}>
                Inherited from <strong style={{ color: colorHex || theme.text }}>{colorName}</strong>
              </p>
              <p className="text-xs mt-0.5" style={{ color: theme.textMuted }}>
                All {colorName} variants share this image
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOverrideImage(true)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg"
              style={{ border: `1px solid ${theme.border}`, background: "transparent", color: theme.textMuted, cursor: "pointer" }}
            >
              Override
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {variant.imageUrl ? (
              <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
                <img src={variant.imageUrl} alt="" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 10, border: `2px solid ${theme.border}` }} />
                <button
                  type="button"
                  onClick={() => { onChange(variant.id, "imageUrl", null); setOverrideImage(false); }}
                  style={{ position: "absolute", top: -6, right: -6, background: theme.error, border: "none", borderRadius: "50%", width: 18, height: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <X size={10} color="#fff" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => imgRef.current?.click()}
                className="flex flex-col items-center justify-center gap-1 cursor-pointer"
                style={{ width: 64, height: 64, borderRadius: 10, border: `2px dashed ${theme.border}`, background: theme.bg, flexShrink: 0 }}
              >
                <Upload size={16} color={theme.textMuted} />
                <span style={{ fontSize: 9, color: theme.textMuted }}>upload</span>
              </div>
            )}
            <Input
              ref={imgRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onChange(variant.id, "imageUrl", URL.createObjectURL(f));
              }}
            />
            <div>
              <p className="text-sm" style={{ color: theme.textSecondary }}>
                {variant.imageUrl ? "Custom image for this variant" : "Upload a specific image for this variant"}
              </p>
              {inheritedImage && (
                <button
                  type="button"
                  onClick={() => { onChange(variant.id, "imageUrl", null); setOverrideImage(false); }}
                  className="text-xs mt-1"
                  style={{ background: "none", border: "none", cursor: "pointer", color: theme.textMuted, padding: 0 }}
                >
                  ← Use inherited image
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={() => onRemove(variant.id)}
          className="px-4 py-2 rounded-xl text-sm font-medium"
          style={{ border: `2px solid ${theme.border}`, background: "transparent", color: theme.textMuted, cursor: "pointer" }}
        >
          Remove
        </button>
        <button
          type="button"
          onClick={() => onDone(variant.id)}
          className="px-6 py-2 rounded-xl text-sm font-semibold"
          style={{ background: theme.primary, border: "none", color: theme.textInverse, cursor: "pointer" }}
        >
          ✓ Save Variant
        </button>
      </div>
    </div>
  );
}
// ─── Variant Card ─────────────────────────────────────────────────────────────
export default function VariantCard({
  variant, activeOptions, productPrice, colorImages,
  onChange, onRemove, onDone, theme
}: VariantCardProps) {
  const [overrideImage, setOverrideImage] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);

  const color = variant.attrs?.color as { hex: string; name: string } | undefined;
  const colorHex  = color?.hex  ?? null;
  const colorName = color?.name ?? null;

  const label = activeOptions
    .map((opt) => {
      if (opt === "Color") return colorName;
      return variant.attrs?.[opt.toLowerCase()] as string | undefined;
    })
    .filter(Boolean)
    .join(" / ") || "New Variant";

  const inheritedImage = colorHex ? colorImages[colorHex] : null;
  const displayImage   = variant.imageUrl || inheritedImage;
  const isInherited    = !variant.imageUrl && !!inheritedImage;

  return (
    <div style={{
      background: theme.bgSecondary,
      border: `1px solid ${theme.border}`,
      borderRadius: theme.borderRadius,
      overflow: "hidden",
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
              <div style={{ width: 36, height: 36, borderRadius: 6, background: colorHex || theme.border, border: `2px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
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

        <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: theme.text }}>{label}</span>

        {!variant.isOpen && (
          <span style={{ fontSize: 12, color: theme.textMuted }}>
            {variant.price || productPrice} MAD &nbsp;·&nbsp;{' '}
            {variant.stock
              ? `${variant.stock} units`
              : <span style={{ color: theme.error + "cc" }}>no stock</span>
            }
          </span>
        )}

        <button
          type="button"
          onClick={() => onChange(variant.id, "isOpen", !variant.isOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", color: theme.textMuted, padding: 2 }}
        >
          <ChevronDown size={14} style={{ transform: variant.isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
        </button>

        <button
          type="button"
          onClick={() => onRemove(variant.id)}
          style={{ background: "none", border: "none", cursor: "pointer", color: theme.textMuted, padding: 2 }}
        >
          <X size={14} />
        </button>
      </div>

      {/* ── Body ── */}
      {variant.isOpen && (
        <CreateVariantForm
          variant={variant}
          activeOptions={activeOptions}
          colorHex={colorHex}
          colorName={colorName}
          inheritedImage={inheritedImage}
          overrideImage={overrideImage}
          setOverrideImage={setOverrideImage}
          imgRef={imgRef}
          onChange={onChange}
          onRemove={onRemove}
          onDone={onDone}
          theme={theme}
        />
      )}
    </div>
  );
}