import React, { useEffect, useState } from "react";
import { ChevronDown, Truck, RotateCcw, ShieldCheck, CreditCard } from "lucide-react";
import { Color, Size } from "@/types/inventoryTypes";
import AttributeSelector from "./AttributeSelector";
import ColorSelector from "./ColorSection";
import { ThemePalette } from "@/types/ThemeTypes";

interface Material { id: string; name: string; }
interface Fit { id: string; name: string; }

interface Attr {
  id: number;
  key: string;
  value: string;
}

interface SubCategory {
  id: number;
  name: string;
}

interface Shipping {
  isReturnable?: boolean;
  returnPolicy?: string;
  returnWindow?: number;
  shippingClass?: string;
  shippingCostOverride?: number;
}

interface Variant {
  id: number;
  price: number;
  compare_price?: number;
  stock: number;
}

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
  materials?: Material[];
  fits?: Fit[];
  gender?: string[];
  styles?: string[];
  season?: string[];
  madeCountry?: string | { code: string; name: string };
  colors: (Color & { variant_id: number })[];
  sizes: Size[];
  attrs?: Attr[];
  subCategories?: SubCategory[];
  shipping?: Shipping;
  variants?: Variant[];
  isCOD?: boolean;
  theme?: ThemePalette;
  onColorSelect: (color: Color & { variant_id: number }) => void;
  selectedColor?: Color & { variant_id: number };
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  name, brand, badgeText, price, compareAtPrice, stock, description,
  rating_average, rating_count, materials, fits, gender, styles, season,
  madeCountry, colors, sizes, attrs, subCategories, shipping, variants,
  isCOD = true, theme, onColorSelect, selectedColor,
}) => {
  const [showDescription, setShowDescription] = useState(true);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [showShipping, setShowShipping] = useState(true);
  const [selectedSize, setSelectedSize] = useState<Size | undefined>();

  /* variant-driven state */
  const [displayPrice, setDisplayPrice] = useState(price);
  const [displayCompare, setDisplayCompare] = useState(compareAtPrice);
  const [displayStock, setDisplayStock] = useState<number | string | undefined>(stock);

  useEffect(() => {
    if (colors.length > 0) onColorSelect(colors[0]);
    if (sizes.length > 0) setSelectedSize(sizes[2] ?? sizes[0]);
  }, []);

  useEffect(() => {
    if (!selectedColor || !variants) return;
    const variant = variants.find((v) => v.id === selectedColor.variant_id);
    if (!variant) return;
    setDisplayPrice(String(variant.price));
    setDisplayCompare(variant.compare_price ? String(variant.compare_price) : undefined);
    setDisplayStock(variant.stock);
  }, [selectedColor, variants]);

  const t = theme;
  const textStyle = { color: t?.text };
  const mutedStyle = { color: t?.textMuted };

  const cardStyle = {
    background: t?.card ?? "#fff",
    border: `1px solid ${t?.border ?? "#e2e8f0"}`,
    borderRadius: t?.borderRadius ?? "8px",
    overflow: "hidden",
  };

  const AccordionRow = ({
    label, open, toggle, children,
  }: {
    label: string; open: boolean; toggle: () => void; children: React.ReactNode;
  }) => (
    <div style={cardStyle}>
      <button
        type="button" onClick={toggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        style={{ background: "transparent", color: t?.text }}
      >
        <span className="font-semibold text-sm">{label}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          style={mutedStyle}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm border-t"
          style={{ borderColor: t?.border, background: t?.bgSecondary ?? "#f8fafc", color: t?.text }}>
          {children}
        </div>
      )}
    </div>
  );

  /* shipping rows */
  const shippingRows = () => {
    if (!shipping && !isCOD) return [];
    const rows: { Icon: any; color: string; title: string; desc: string }[] = [];
    if (shipping?.shippingClass) {
      const isExpress = shipping.shippingClass === "express";
      rows.push({
        Icon: Truck,
        color: isExpress ? (t?.info ?? "#2563eb") : (t?.warning ?? "#d97706"),
        title: isExpress ? "Express Shipping" : "Standard Shipping",
        desc: shipping.shippingCostOverride === 0
          ? "Free delivery"
          : shipping.shippingCostOverride
          ? `$${shipping.shippingCostOverride} flat rate`
          : "Fast delivery",
      });
    }
    if (isCOD) {
      rows.push({ Icon: CreditCard, color: t?.accent ?? "#7c3aed", title: "Cash on Delivery", desc: "Pay when you receive" });
    }
    if (shipping?.isReturnable) {
      rows.push({
        Icon: RotateCcw,
        color: t?.success ?? "#16a34a",
        title: `${shipping.returnWindow ?? 30}-Day Returns`,
        desc: shipping.returnPolicy === "free_return" ? "Free returns accepted" : "Returns accepted",
      });
    }
    rows.push({ Icon: ShieldCheck, color: t?.textMuted ?? "#64748b", title: "Secure Payment", desc: "Your data is protected" });
    return rows;
  };

  return (
    <div className="space-y-5">

      {/* Brand + Badge */}
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-xs font-semibold uppercase tracking-wide" style={mutedStyle}>{brand}</p>
        {badgeText && (
          <span
            className="text-xs font-bold px-2 py-0.5"
            style={{
              borderRadius: 999,
              background: t?.primary ?? "#0f172a",
              color: t?.textInverse ?? "#fff",
            }}
          >
            {badgeText}
          </span>
        )}
      </div>

      {/* Name */}
      <h1 className="text-2xl font-bold leading-snug" style={textStyle}>{name}</h1>

      {/* Rating */}
      {rating_average !== undefined && rating_average !== null && (
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={`text-base ${star <= Math.round(rating_average) ? "text-amber-400" : "text-gray-300"}`}>★</span>
            ))}
          </div>
          <span className="text-sm font-medium" style={textStyle}>{rating_average}</span>
          {rating_count !== undefined && rating_count > 0 && (
            <span className="text-sm" style={mutedStyle}>{rating_count} Reviews</span>
          )}
        </div>
      )}

      {/* Divider */}
      <div style={{ borderTop: `1px solid ${t?.border ?? "#f1f5f9"}` }} />

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold" style={textStyle}>{displayPrice}</span>
        {displayCompare && Number(displayCompare) > 0 && (
          <span className="text-lg line-through" style={mutedStyle}>{displayCompare}</span>
        )}
        {displayStock !== undefined && Number(displayStock) > 0 && (
          <span className="text-xs font-medium px-2 py-0.5 ml-1"
            style={{ background: `${t?.success ?? "#16a34a"}18`, color: t?.success ?? "#16a34a", borderRadius: 999 }}>
            {displayStock} in stock
          </span>
        )}
        {(displayStock === 0 || displayStock === "0") && (
          <span className="text-xs font-medium px-2 py-0.5 ml-1"
            style={{ background: `${t?.error ?? "#dc2626"}18`, color: t?.error ?? "#dc2626", borderRadius: 999 }}>
            Out of stock
          </span>
        )}
      </div>

      {/* Divider */}
      <div style={{ borderTop: `1px solid ${t?.border ?? "#f1f5f9"}` }} />

      {/* Colors */}
      {colors.length > 0 && (
        <ColorSelector
          colors={colors}
          selectedColor={selectedColor}
          onColorSelect={onColorSelect}
          theme={theme}
        />
      )}

      {/* Sizes */}
      {sizes.length > 0 && (
        <AttributeSelector
          label="Size"
          attributes={sizes}
          selectedAttribute={selectedSize}
          onAttributeSelect={setSelectedSize}
          selectable={true}
          theme={theme}
        />
      )}

      {/* Attrs — inline badges, no label header */}
      {attrs && attrs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attrs.map((attr) => (
            <span
              key={attr.id}
              className="text-xs font-medium px-2.5 py-1 capitalize"
              style={{
                borderRadius: t?.borderRadius ?? "6px",
                background: t?.card ?? "#f1f5f9",
                color: t?.textMuted ?? "#64748b",
                border: `1px solid ${t?.border ?? "#e2e8f0"}`,
              }}
            >
              {attr.key}: {attr.value}
            </span>
          ))}
        </div>
      )}

      {/* Sub-categories */}
      {subCategories && subCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {subCategories.map((cat) => (
            <span
              key={cat.id}
              className="text-xs font-medium px-2.5 py-1 cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                borderRadius: 999,
                background: `${t?.accent ?? t?.primary ?? "#0f172a"}14`,
                color: t?.accent ?? t?.primary ?? "#0f172a",
                border: `1px solid ${t?.accent ?? t?.primary ?? "#0f172a"}30`,
              }}
            >
              {cat.name}
            </span>
          ))}
        </div>
      )}

      {/* Divider */}
      <div style={{ borderTop: `1px solid ${t?.border ?? "#f1f5f9"}` }} />

      {/* Accordions */}
      <div className="space-y-2">
        {description && (
          <AccordionRow label="Description" open={showDescription} toggle={() => setShowDescription((p) => !p)}>
            <div className="pt-3 leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: description }} />
          </AccordionRow>
        )}

        <AccordionRow label="Shipping & Returns" open={showShipping} toggle={() => setShowShipping((p) => !p)}>
          <div className="pt-3 space-y-3">
            {shippingRows().map(({ Icon, color, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color }} />
                <div>
                  <p className="text-sm font-semibold" style={textStyle}>{title}</p>
                  <p className="text-xs" style={mutedStyle}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </AccordionRow>

        {(materials || fits || season || styles || gender || madeCountry) && (
          <AccordionRow label="Product Details" open={showProductDetails} toggle={() => setShowProductDetails((p) => !p)}>
            <div className="pt-3 space-y-2">
              {!!materials?.length && (
                <div className="flex"><span className="w-24 flex-shrink-0" style={mutedStyle}>Material:</span>
                  <span className="font-medium">{materials.map((m) => m.name).join(", ")}</span></div>
              )}
              {!!fits?.length && (
                <div className="flex"><span className="w-24 flex-shrink-0" style={mutedStyle}>Fit:</span>
                  <span className="font-medium">{fits.map((f) => f.name).join(", ")}</span></div>
              )}
              {!!season?.length && (
                <div className="flex"><span className="w-24 flex-shrink-0" style={mutedStyle}>Season:</span>
                  <span className="font-medium capitalize">{season.join(", ")}</span></div>
              )}
              {!!styles?.length && (
                <div className="flex"><span className="w-24 flex-shrink-0" style={mutedStyle}>Style:</span>
                  <span className="font-medium capitalize">{styles.join(", ")}</span></div>
              )}
              {!!gender?.length && (
                <div className="flex"><span className="w-24 flex-shrink-0" style={mutedStyle}>Gender:</span>
                  <span className="font-medium capitalize">{gender.join(", ")}</span></div>
              )}
              {madeCountry && (
                <div className="flex"><span className="w-24 flex-shrink-0" style={mutedStyle}>Made in:</span>
                  <span className="font-medium">
                    {typeof madeCountry === "string" ? madeCountry : madeCountry.name}
                  </span></div>
              )}
            </div>
          </AccordionRow>
        )}
      </div>
    </div>
  );
};