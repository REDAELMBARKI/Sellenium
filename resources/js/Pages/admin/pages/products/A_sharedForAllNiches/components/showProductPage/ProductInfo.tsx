import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Color, Size } from "@/types/inventoryTypes";
import { ThemePalette } from "@/types/ThemeTypes";
import ColorSelector from "./ColorSection";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";

interface Attr { id: number; key: string; value: string; }
interface SubCategory { id: number; name: string; slug?: string; }
interface Shipping { isReturnable?: boolean; returnPolicy?: string; returnWindow?: number; shippingClass?: string; shippingCostOverride?: number; }
interface Variant { id: number; price: number; compare_price?: number; stock: number; }

interface ProductInfoProps {
  name: string;
  brand: string;
  badgeText?: string;
  price: string;
  compareAtPrice?: string;
  stock?: number | string;
  description?: string;
  rating_average?: number;
  rating_count?: number;
  showCountdown?: boolean;
  colors: (Color & { variant_id: number })[];
  sizes: Size[];
  attrs?: Attr[];
  subCategories?: SubCategory[];
  variants?: Variant[];
  madeCountry?: string | { code: string; name: string };
  materials?: { id: string; name: string }[];
  fits?: { id: string; name: string }[];
  gender?: string[];
  styles?: string[];
  season?: string[];
  theme?: ThemePalette;
  onColorSelect: (color: Color & { variant_id: number }) => void;
  selectedColor?: Color & { variant_id: number };
}

const badgeColor = (text: string, primary: string) => {
  const t = text.toLowerCase();
  if (t.includes("new"))  return { bg: "#2563eb", fg: "#fff" };
  if (t.includes("sale")) return { bg: "#dc2626", fg: "#fff" };
  if (t.includes("hot") || t.includes("fire")) return { bg: "#ea580c", fg: "#fff" };
  if (t.includes("best")) return { bg: "#16a34a", fg: "#fff" };
  return { bg: primary ?? "#0f172a", fg: "#fff" };
};

function useCountdown(initial = { h: 7, m: 27, s: 5 }) {
  const [time, setTime] = useState(initial);
  useEffect(() => {
    const id = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) { h = 0; m = 0; s = 0; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  return [pad(time.h), pad(time.m), pad(time.s)];
}

const Sep = ({ theme }: { theme?: ThemePalette }) => (
  <div style={{ borderTop: `1px solid ${theme?.border ?? "#f1f5f9"}`, margin: "20px 0" }} />
);

export const ProductInfo: React.FC<ProductInfoProps> = ({
  name, brand, badgeText, price, compareAtPrice, stock, description,
  rating_average, rating_count, showCountdown, colors, sizes, attrs,
  subCategories, variants, madeCountry, materials, fits, gender, styles,
  season, theme, onColorSelect, selectedColor,
}) => {
  const [showDesc, setShowDesc] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Size | undefined>();
  const [displayPrice, setDisplayPrice] = useState(price);
  const [displayCompare, setDisplayCompare] = useState(compareAtPrice);
  const [displayStock, setDisplayStock] = useState<number | string | undefined>(stock);

  const countdown = useCountdown();
  const t = theme;

  useEffect(() => {
    if (colors.length > 0) onColorSelect(colors[0]);
    if (sizes.length > 0) setSelectedSize(sizes[2] ?? sizes[0]);
  }, []);

  useEffect(() => {
    if (!selectedColor || !variants) return;
    const v = variants.find(v => v.id === selectedColor.variant_id);
    if (!v) return;
    setDisplayPrice(String(v.price));
    setDisplayCompare(v.compare_price ? String(v.compare_price) : undefined);
    setDisplayStock(v.stock);
  }, [selectedColor, variants]);

  const saveAmount = displayCompare && Number(displayCompare) > 0
    ? (Number(displayCompare) - Number(displayPrice)).toFixed(2)
    : null;

  const bc = badgeText ? badgeColor(badgeText, t?.primary ?? "#0f172a") : null;
  const muted = { color: t?.textMuted };
  const col = { color: t?.text };

  return (
    <div>

      {/* Badge */}
      {badgeText && bc && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-1.5"
            style={{ borderRadius: 999, background: bc.bg, color: bc.fg, letterSpacing: "0.02em" }}>
            🔥 {badgeText}
          </span>
        </div>
      )}

      {/* Name */}
      <h1 className="text-2xl font-bold leading-snug mb-4" style={col}>{name}</h1>

      {/* Rating */}
      {rating_average != null && (
        <div className="flex items-center gap-3 mb-2">
          <div className="flex gap-1">
            {[1,2,3,4,5].map(s => (
              <span key={s} className={`text-lg ${s <= Math.round(rating_average) ? "text-amber-400" : "text-gray-300"}`}>★</span>
            ))}
          </div>
          <span className="text-base font-bold" style={col}>{rating_average}</span>
          {!!rating_count && <span className="text-sm" style={muted}>{rating_count} Reviews</span>}
        </div>
      )}

      <Sep theme={t} />

      {/* ── PRICE BLOCK ── */}
      <div className="mb-2">
        {/* Deals banner */}
        {showCountdown && (
          <div className="flex items-center justify-between px-5 py-3 mb-0"
            style={{
              background: t?.primary ?? "#0f172a",
              borderRadius: `${t?.borderRadius ?? "10px"} ${t?.borderRadius ?? "10px"} 0 0`,
            }}>
            <span className="font-extrabold text-base" style={{ color: t?.textInverse ?? "#fff" }}>
              🔥 SuperDeals
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium mr-1" style={{ color: t?.textInverse ?? "#fff", opacity: 0.75 }}>Ends:</span>
              {countdown.map((seg, i) => (
                <React.Fragment key={i}>
                  <span className="text-sm font-extrabold px-2 py-0.5 rounded"
                    style={{ background: "rgba(255,255,255,0.18)", color: t?.textInverse ?? "#fff", fontVariantNumeric: "tabular-nums", minWidth: 28, textAlign: "center", display: "inline-block" }}>
                    {seg}
                  </span>
                  {i < 2 && <span style={{ color: t?.textInverse ?? "#fff", opacity: 0.6, fontWeight: 700 }}>:</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Price row */}
        <div className={`flex items-center gap-4 flex-wrap py-4 px-1 ${showCountdown ? "border border-t-0 rounded-b-xl" : ""}`}
          style={showCountdown ? { borderColor: `${t?.primary ?? "#0f172a"}30`, borderRadius: `0 0 ${t?.borderRadius ?? "10px"} ${t?.borderRadius ?? "10px"}` } : {}}>
          <span className="text-4xl font-extrabold tracking-tight" style={col}>${displayPrice}</span>
          {saveAmount && (
            <span className="flex items-center gap-1 text-sm font-bold px-3 py-1.5"
              style={{ borderRadius: 999, background: "#fef2f2", color: "#dc2626" }}>
              ◄ Save ${saveAmount}
            </span>
          )}
          {Number(displayStock) > 0 && Number(displayStock) <= 10 && (
            <span className="text-sm font-bold px-3 py-1.5"
              style={{ borderRadius: 999, background: "#fff7ed", color: "#ea580c" }}>
              Only {displayStock} left
            </span>
          )}
          {(displayStock === 0 || displayStock === "0") && (
            <span className="text-sm font-bold px-3 py-1.5"
              style={{ borderRadius: 999, background: "#fef2f2", color: "#dc2626" }}>
              Out of stock
            </span>
          )}
        </div>

        {/* Compare price */}
        {displayCompare && Number(displayCompare) > 0 && (
          <p className="text-base line-through mt-1 px-1" style={muted}>${displayCompare}</p>
        )}
      </div>

      <Sep theme={t} />

      {/* ── COLORS ── */}
      {colors.length > 0 && (
        <div className="mb-6">
          <ColorSelector colors={colors} selectedColor={selectedColor} onColorSelect={onColorSelect} theme={t} />
        </div>
      )}

      {/* ── SIZES ── */}
      {sizes.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-widest mb-4" style={muted}>
            Size: <span className="normal-case tracking-normal font-bold" style={col}>{selectedSize?.name}</span>
          </p>
          <div className="flex flex-wrap gap-3">
            {sizes.map(size => {
              const isSel = selectedSize?.id === size.id;
              return (
                <button key={size.id} onClick={() => setSelectedSize(size)}
                  className="px-5 py-2.5 text-sm font-bold transition-all duration-150 hover:scale-105"
                  style={{
                    borderRadius: t?.borderRadius ?? "8px",
                    background: isSel ? (t?.primary ?? "#0f172a") : "transparent",
                    color: isSel ? (t?.textInverse ?? "#fff") : (t?.text ?? "#0f172a"),
                    border: `2px solid ${isSel ? (t?.primary ?? "#0f172a") : (t?.border ?? "#e2e8f0")}`,
                    minWidth: 52,
                  }}>
                  {size.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── ATTRS — inline badges ── */}
      {attrs && attrs.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-3">
          {attrs.map(attr => (
            <span key={attr.id}
              className="text-sm font-semibold px-4 py-2 capitalize"
              style={{
                borderRadius: t?.borderRadius ?? "8px",
                background: t?.card ?? "#f1f5f9",
                color: t?.textMuted ?? "#64748b",
                border: `1.5px solid ${t?.border ?? "#e2e8f0"}`,
              }}>
              {attr.key}: {attr.value}
            </span>
          ))}
        </div>
      )}

      {/* ── SUB-CATEGORIES ── */}
      {subCategories && subCategories.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-3">
          {subCategories.map(cat => (
            <button key={cat.id}
              onClick={() => router.visit(route("category.show", { slug: cat.slug ?? cat.id }))}
              className="text-sm font-semibold px-4 py-2 transition-opacity hover:opacity-75"
              style={{
                borderRadius: 999,
                background: `${t?.accent ?? t?.primary ?? "#0f172a"}10`,
                color: t?.accent ?? t?.primary ?? "#0f172a",
                border: `1.5px solid ${t?.accent ?? t?.primary ?? "#0f172a"}25`,
              }}>
              {cat.name}
            </button>
          ))}
        </div>
      )}

      <Sep theme={t} />

      {/* ── ACCORDIONS ── */}
      {description && (
        <div className="mb-2">
          <button type="button" onClick={() => setShowDesc(p => !p)}
            className="w-full flex items-center justify-between py-4 text-left"
            style={{ background: "transparent", color: t?.text }}>
            <span className="text-base font-bold">Description</span>
            <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${showDesc ? "rotate-180" : ""}`}
              style={muted} />
          </button>
          {showDesc && (
            <div className="pb-6 text-base leading-relaxed prose prose-base max-w-none"
              style={{ color: t?.text }}
              dangerouslySetInnerHTML={{ __html: description }} />
          )}
          <div style={{ borderTop: `1px solid ${t?.border ?? "#f1f5f9"}` }} />
        </div>
      )}

      {(materials || fits || season || styles || gender || madeCountry) && (
        <div className="mb-2">
          <button type="button" onClick={() => setShowDetails(p => !p)}
            className="w-full flex items-center justify-between py-4 text-left"
            style={{ background: "transparent", color: t?.text }}>
            <span className="text-base font-bold">Product Details</span>
            <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${showDetails ? "rotate-180" : ""}`}
              style={muted} />
          </button>
          {showDetails && (
            <div className="pb-6 space-y-3">
              {madeCountry && (
                <div className="flex gap-3">
                  <span className="w-24 text-sm flex-shrink-0" style={muted}>Made in</span>
                  <span className="text-sm font-semibold" style={col}>
                    {typeof madeCountry === "string" ? madeCountry : madeCountry.name}
                  </span>
                </div>
              )}
              {!!materials?.length && (
                <div className="flex gap-3">
                  <span className="w-24 text-sm flex-shrink-0" style={muted}>Material</span>
                  <span className="text-sm font-semibold" style={col}>{materials.map(m => m.name).join(", ")}</span>
                </div>
              )}
              {!!fits?.length && (
                <div className="flex gap-3">
                  <span className="w-24 text-sm flex-shrink-0" style={muted}>Fit</span>
                  <span className="text-sm font-semibold" style={col}>{fits.map(f => f.name).join(", ")}</span>
                </div>
              )}
              {!!gender?.length && (
                <div className="flex gap-3">
                  <span className="w-24 text-sm flex-shrink-0" style={muted}>Gender</span>
                  <span className="text-sm font-semibold capitalize" style={col}>{gender.join(", ")}</span>
                </div>
              )}
            </div>
          )}
          <div style={{ borderTop: `1px solid ${t?.border ?? "#f1f5f9"}` }} />
        </div>
      )}
    </div>
  );
};