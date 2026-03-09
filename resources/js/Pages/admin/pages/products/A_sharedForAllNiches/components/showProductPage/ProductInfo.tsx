import React, { useState } from "react";
import { ChevronDown, Truck, Package, Clock, CreditCard } from "lucide-react";
import { Color, Size } from "@/types/inventoryTypes";
import AttributeSelector from "./AttributeSelector";
import ColorSelector from "./ColorSection";
import { ThemePalette } from "@/types/theme";

interface Material { id: string; name: string; }
interface Fit { id: string; name: string; }
interface Country { code: string; name: string; }

interface ProductInfoProps {
  name: string;
  brand: string;
  price: string;
  compareAtPrice?: string;
  sku?: string;
  stock?: number | string;
  description?: string;
  rating_average?: number;
  materials?: Material[];
  fits?: Fit[];
  gender?: string[];
  styles?: string[];
  season?: string[];
  madeCountry?: Country;
  colors: Color[];
  sizes: Size[];
  isCOD?: boolean;
  theme?: ThemePalette;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  name, brand, price, compareAtPrice, sku, stock, description,
  rating_average, materials, fits, gender, styles, season, madeCountry,
  colors, sizes, isCOD = true, theme,
}) => {
  const [showDescription, setShowDescription] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [selectedColor, setSelectedColor] = useState<Color | undefined>();
  const [selectedSize, setSelectedSize] = useState<Size | undefined>();

  React.useEffect(() => {
    if (colors.length > 0) setSelectedColor(colors[0]);
    if (sizes.length > 0) setSelectedSize(sizes[2] ?? sizes[0]);
  }, []);

  const t = theme;
  const textStyle = { color: t?.text };
  const mutedStyle = { color: t?.textMuted };
  const borderStyle = { borderColor: t?.border };
  const cardStyle = {
    background: t?.card ?? "#fff",
    border: `1px solid ${t?.border ?? "#e2e8f0"}`,
    borderRadius: t?.borderRadius ?? "8px",
    overflow: "hidden",
  };
  const accordionBtnStyle = {
    background: "transparent",
    color: t?.text,
  };

  const AccordionRow = ({
    label,
    open,
    toggle,
    children,
  }: {
    label: string;
    open: boolean;
    toggle: () => void;
    children: React.ReactNode;
  }) => (
    <div style={cardStyle}>
      <button
        type="button"
        onClick={toggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
        style={accordionBtnStyle}
      >
        <span className="font-semibold text-sm">{label}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          style={mutedStyle}
        />
      </button>
      {open && (
        <div
          className="px-4 pb-4 text-sm border-t"
          style={{ borderColor: t?.border, background: t?.bgSecondary ?? "#f8fafc", color: t?.text }}
        >
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Brand + Name */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={mutedStyle}>
          {brand}
        </p>
        <h1 className="text-3xl font-bold mb-3" style={textStyle}>{name}</h1>
      </div>

      {/* Rating */}
      {rating_average && (
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={`text-lg ${star <= Math.round(rating_average) ? "text-amber-400" : "text-gray-300"}`}>★</span>
            ))}
          </div>
          <span className="text-sm" style={mutedStyle}>({rating_average}/5)</span>
        </div>
      )}

      {/* Price */}
      <div className="space-y-2 pt-2 pb-4">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold" style={textStyle}>{price}</span>
          {compareAtPrice && (
            <span className="text-lg line-through" style={mutedStyle}>{compareAtPrice}</span>
          )}
        </div>
        {stock !== undefined && stock !== 0 && stock !== "0" && (
          <p className="text-sm font-medium" style={{ color: t?.success ?? "#16a34a" }}>{stock} in stock</p>
        )}
        {(stock === 0 || stock === "0") && (
          <p className="text-sm font-medium" style={{ color: t?.error ?? "#dc2626" }}>Out of stock</p>
        )}
      </div>

      {/* Colors + Sizes */}
      <div className="pt-4" style={{ borderTop: `1px solid ${t?.border ?? "#f1f5f9"}` }}>
        {colors && colors.length > 0 && (
          <div className="mb-6">
            <ColorSelector
              colors={colors}
              selectedColor={selectedColor}
              onColorSelect={(color) => setSelectedColor(color)}
              theme={theme}
            />
          </div>
        )}
        {sizes && sizes.length > 0 && (
          <AttributeSelector
            label="Size"
            attributes={sizes}
            selectedAttribute={selectedSize}
            onAttributeSelect={setSelectedSize}
            theme={theme}
          />
        )}
      </div>

      {/* Accordions */}
      <div className="space-y-2">
        {description && (
          <AccordionRow label="Description" open={showDescription} toggle={() => setShowDescription((p) => !p)}>
            <p className="pt-3 leading-relaxed">{description}</p>
          </AccordionRow>
        )}

        {(materials || fits || season || styles || gender || madeCountry) && (
          <AccordionRow label="Product Details" open={showProductDetails} toggle={() => setShowProductDetails((p) => !p)}>
            <div className="pt-3 space-y-2">
              {materials?.length && (
                <div className="flex"><span className="w-24 flex-shrink-0" style={mutedStyle}>Material:</span><span className="font-medium">{materials.map(m => m.name).join(", ")}</span></div>
              )}
              {fits?.length && (
                <div className="flex"><span className="w-24 flex-shrink-0" style={mutedStyle}>Fit:</span><span className="font-medium">{fits.map(f => f.name).join(", ")}</span></div>
              )}
              {season?.length && (
                <div className="flex"><span className="w-24 flex-shrink-0" style={mutedStyle}>Season:</span><span className="font-medium capitalize">{season.join(", ")}</span></div>
              )}
              {styles?.length && (
                <div className="flex"><span className="w-24 flex-shrink-0" style={mutedStyle}>Style:</span><span className="font-medium capitalize">{styles.join(", ")}</span></div>
              )}
              {gender?.length && (
                <div className="flex"><span className="w-24 flex-shrink-0" style={mutedStyle}>Gender:</span><span className="font-medium capitalize">{gender.join(", ")}</span></div>
              )}
              {madeCountry && (
                <div className="flex"><span className="w-24 flex-shrink-0" style={mutedStyle}>Made in:</span><span className="font-medium">{madeCountry.name}</span></div>
              )}
            </div>
          </AccordionRow>
        )}

        {isCOD && (
          <AccordionRow label="Shipping Information" open={showShipping} toggle={() => setShowShipping((p) => !p)}>
            <div className="pt-3 space-y-3">
              {[
                { Icon: CreditCard, color: t?.success ?? "#16a34a", title: "Cash on Delivery", desc: "Pay when you receive your order" },
                { Icon: Truck, color: t?.info ?? "#2563eb", title: "Free Delivery", desc: "Standard shipping at no extra cost" },
                { Icon: Clock, color: t?.warning ?? "#d97706", title: "Estimated Delivery", desc: "3-5 business days" },
                { Icon: Package, color: t?.textMuted ?? "#64748b", title: "Secure Packaging", desc: "Protected and sealed for safety" },
              ].map(({ Icon, color, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color }} />
                  <div>
                    <p className="text-sm font-semibold" style={textStyle}>{title}</p>
                    <p className="text-xs" style={mutedStyle}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </AccordionRow>
        )}
      </div>
    </div>
  );
};