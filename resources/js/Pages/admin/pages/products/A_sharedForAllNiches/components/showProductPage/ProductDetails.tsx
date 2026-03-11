import React, { useState } from "react";
import Reviews from "./Reviews";
import ProductMoreDetailsTabMaster from "./ProductMoreDetailsTabMaster";
import Specs from "./Specs";
import MediaGallery from "./MediaGallery";
import { ProductInfo } from "./ProductInfo";
import Tabs from "./Tabs";
import VariantModal from "./VariantModal";
import RelatedProducts from "./RelatedProducts";
import {
  HelpCircle, MessageCircle, X,
  Truck, RotateCcw, ShieldCheck, CreditCard, Store, Info, Star, User,
} from "lucide-react";
import { router, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import { VariantSchemaType } from "@/shemas/productSchema";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import { Color } from "@/types/inventoryTypes";

interface ProductDetailProps { onStepChange: (action: "next" | "prev") => void; }
interface FaqItem { question: string; answer: string; }
interface Variant { id: number; price: number; compare_price?: number; stock: number; }

/* ── FAQ DRAWER ── */
const FaqDrawer = ({ faqs, theme, open, onClose }: {
  faqs: FaqItem[]; theme: any; open: boolean; onClose: () => void;
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(2px)", opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none", transition: "opacity 0.3s ease",
      }} />
      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50, width: 340,
        display: "flex", flexDirection: "column", background: theme.bgSecondary,
        borderRight: `1px solid ${theme.border}`,
        boxShadow: "4px 0 32px rgba(0,0,0,0.18)",
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.38s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${theme.border}` }}>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" style={{ color: theme.accent ?? theme.primary }} />
            <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: theme.text }}>FAQs</h3>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center"
            style={{ borderRadius: "50%", background: theme.card, color: theme.textMuted, border: `1px solid ${theme.border}` }}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="px-4 py-4 flex flex-wrap gap-2 overflow-y-auto">
          {faqs.map((faq, i) => {
            const isActive = activeIndex === i;
            return (
              <button key={i} onClick={() => setActiveIndex(isActive ? null : i)}
                className="text-xs font-medium px-3 py-1.5 transition-all duration-200"
                style={{
                  borderRadius: 999, background: isActive ? theme.primary : theme.card,
                  color: isActive ? theme.textInverse : theme.text,
                  border: `1px solid ${isActive ? theme.primary : theme.border}`,
                }}>
                {faq.question.length > 32 ? faq.question.slice(0, 32) + "…" : faq.question}
              </button>
            );
          })}
        </div>
        {activeIndex !== null && (
          <div className="mx-4 mb-4 px-4 pb-4 pt-3"
            style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: theme.borderRadius ?? "10px" }}>
            <p className="text-xs font-semibold mb-2" style={{ color: theme.textMuted }}>{faqs[activeIndex].question}</p>
            <p className="text-sm leading-relaxed" style={{ color: theme.text }}>{faqs[activeIndex].answer}</p>
          </div>
        )}
      </div>
    </>
  );
};

/* ── RIGHT STICKY PANEL ── */
const RightPanel = ({ theme, product, selectedColor, variants, onAddToCart, onBuyNow }: {
  theme: any; product: any;
  selectedColor?: Color & { variant_id: number };
  variants: Variant[]; onAddToCart: () => void; onBuyNow: () => void;
}) => {
  const [qty, setQty] = useState(1);
  const t = theme;
  const activeVariant = selectedColor
    ? variants.find(v => v.id === selectedColor.variant_id)
    : variants[0];
  const stock = activeVariant?.stock ?? 0;
  const shipping = product.shipping;

  const Sep = () => <div style={{ borderTop: `1px solid ${t.border}`, margin: "14px 0" }} />;

  return (
    <div style={{
      background: t.bgSecondary ?? t.card,
      borderRadius: t.borderRadius ?? "14px",
      padding: "20px 18px",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Sold by */}
      <p className="text-xs font-medium mb-1" style={{ color: t.textMuted }}>Sold by</p>
      <div className="flex items-center gap-2 mb-1">
        <Store className="w-4 h-4 flex-shrink-0" style={{ color: t.accent ?? t.primary }} />
        <p className="text-sm font-bold" style={{ color: t.text }}>{product.brand ?? "Store"}</p>
      </div>

      <Sep />

      {/* Shipping */}
      <div className="space-y-3">
        {shipping?.shippingClass && (
          <div className="flex items-start gap-2.5">
            <Truck className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: t.info ?? "#2563eb" }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: t.text }}>
                {shipping.shippingClass === "express" ? "Express Shipping" : "Standard Shipping"}
              </p>
              <p className="text-xs mt-0.5" style={{ color: t.textMuted }}>
                {shipping.shippingCostOverride === 0 ? "Free delivery" : shipping.shippingCostOverride ? `$${shipping.shippingCostOverride}` : ""}
              </p>
            </div>
          </div>
        )}
        {shipping?.isReturnable && (
          <div className="flex items-start gap-2.5">
            <RotateCcw className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: t.success ?? "#16a34a" }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: t.text }}>{shipping.returnWindow ?? 30}-Day Returns</p>
              {shipping.returnPolicy === "free_return" && (
                <p className="text-xs mt-0.5" style={{ color: t.textMuted }}>Free return</p>
              )}
            </div>
          </div>
        )}
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: t.textMuted }} />
          <p className="text-sm font-semibold" style={{ color: t.text }}>Security & Privacy</p>
        </div>
        <div className="flex items-center gap-2.5">
          <CreditCard className="w-4 h-4 flex-shrink-0" style={{ color: t.accent ?? t.primary }} />
          <p className="text-sm font-semibold" style={{ color: t.text }}>Cash on Delivery</p>
        </div>
      </div>

      <Sep />

      {/* Qty */}
      <p className="text-sm font-bold mb-3" style={{ color: t.text }}>Quantity</p>
      <div className="flex items-center gap-4">
        <button onClick={() => setQty(q => Math.max(1, q - 1))}
          className="w-8 h-8 flex items-center justify-center font-bold text-lg transition-all hover:scale-110"
          style={{ borderRadius: "50%", border: `1.5px solid ${t.border}`, background: t.card, color: t.text }}>
          −
        </button>
        <span className="text-base font-bold w-5 text-center" style={{ color: t.text }}>{qty}</span>
        <button onClick={() => setQty(q => Math.min(stock, q + 1))}
          className="w-8 h-8 flex items-center justify-center font-bold text-lg transition-all hover:scale-110"
          style={{ borderRadius: "50%", border: `1.5px solid ${t.border}`, background: t.card, color: t.text }}>
          +
        </button>
      </div>
      {stock > 0 && stock <= 10 && (
        <p className="text-xs mt-2.5 font-semibold" style={{ color: t.warning ?? "#d97706" }}>Only {stock} left</p>
      )}
      {stock === 0 && (
        <p className="text-xs mt-2.5 font-semibold" style={{ color: t.error ?? "#dc2626" }}>Out of stock</p>
      )}

      <Sep />

      {/* CTAs */}
      <div className="flex flex-col gap-3">
        <button onClick={onAddToCart} disabled={stock === 0}
          className="w-full py-3 text-sm font-bold transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
          style={{ borderRadius: t.borderRadius ?? "10px", background: t.primary, color: t.textInverse ?? "#fff" }}>
          Add to Cart
        </button>
        <button onClick={onBuyNow} disabled={stock === 0}
          className="w-full py-3 text-sm font-bold transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
          style={{ borderRadius: t.borderRadius ?? "10px", background: "transparent", color: t.primary, border: `2px solid ${t.primary}` }}>
          Buy Now
        </button>
      </div>
    </div>
  );
};

/* ── MAIN PAGE ── */
const ProductDetails = ({ onStepChange }: ProductDetailProps) => {
  const { product } = usePage<any>().props;
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  console.log(product)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"cart" | "buynow">("cart");
  const [faqOpen, setFaqOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<Color & { variant_id: number } | undefined>();

  const defaultVariant = product.variants?.[0];
  const shouldShowVariantModal =
    Array.isArray(product.variants) &&
    product.variants.length > 0 &&
    Number(product.variants[0]?.is_single) === 0;

  const galleryMedia = (product.covers ?? []).map((c: any) => ({
    id: c.id, url: c.url, variant_id: c.variant_id,
  }));

  const handleAddToCart = () => {
    if (shouldShowVariantModal) { setModalMode("cart"); setModalOpen(true); }
    else { router.post(route("cart.store"), { id: product.id, variant_id: defaultVariant?.id }); }
  };
  const handleBuyNow = () => {
    if (shouldShowVariantModal) { setModalMode("buynow"); setModalOpen(true); }
    else { onStepChange("next"); }
  };
  const handleModalConfirm = (variant: VariantSchemaType) => {
    setModalOpen(false);
    if (modalMode === "cart") router.post(route("cart.store"), { id: product.id, variant_id: variant.variant_id });
    else onStepChange("next");
  };

  const tabsData = [
    { id: "reviews", Icon: Star, label: "Reviews", content: <Reviews theme={theme} /> },
    {
      id: "details", Icon: Info, label: "Product Details",
      content: (
        <ProductMoreDetailsTabMaster
          description={product.description ?? ""}
          brand={product.brand ?? ""}
          category={product.sub_categories?.map((c: any) => ({ id: String(c.id), name: c.name })) ?? []}
          releaseDate={product.releaseDate ?? undefined}
          theme={theme}
        />
      ),
    },
    {
      id: "specs", label: "Specifications", Icon: User,
      content: <Specs madeCountry={product.madeCountry ?? undefined} theme={theme} />,
    },
  ];

  const t = theme;

  return (
    <div className="min-h-screen" style={{ background: t.bg, color: t.text }}>
      <div className="max-w-screen-full mx-auto px-4 py-10">

        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-xs mb-8" style={{ color: t.textMuted }}>
          <span className="cursor-pointer hover:underline" style={{ color: t.link }}>Home</span>
          <span>/</span>
          <span className="cursor-pointer hover:underline" style={{ color: t.link }}>
            {product.nich_category?.name ?? "Category"}
          </span>
          <span>/</span>
          <span className="font-medium truncate max-w-[200px]" style={{ color: t.text }}>{product.name}</span>
        </div>
        <div className="flex gap-8 items-start">

          {/* LEFT + CENTER — flex col so tabs sit below gallery naturally */}
          <div className="flex-1 min-w-0 flex flex-col gap-0">

            {/* TOP ROW: gallery left + product info right */}
            <div className="flex gap-8 items-start">

              {/* LEFT — sticky gallery */}
              <div className="sticky top-6 flex-shrink-0" style={{ width: "42%" }}>
                <MediaGallery
                  selectedColor={selectedColor}
                  media={galleryMedia}
                  video={null}
                  theme={t}
                />
              </div>

              {/* CENTER — product info, scrolls with page */}
              <div className="flex-1 min-w-0 max-w-[50%]">
                <ProductInfo
                  name={product.name}
                  brand={product.brand ?? ""}
                  badgeText={product.badge_text ?? undefined}
                  rating_average={product.rating_average ?? undefined}
                  rating_count={product.rating_count ?? 0}
                  price={String(defaultVariant?.price ?? 0)}
                  compareAtPrice={
                    defaultVariant?.compare_price
                      ? String(defaultVariant.compare_price)
                      : undefined
                  }
                  stock={defaultVariant?.stock ?? 0}
                  description={product.description ?? ""}
                  colors={product.colors ?? []}
                  sizes={product.sizes ?? []}
                  attrs={product.attrs ?? []}
                  subCategories={product.sub_categories ?? []}
                  variants={product.variants ?? []}
                  madeCountry={product.madeCountry ?? undefined}
                  showCountdown={product.show_countdown === 1}
                  theme={t}
                  onColorSelect={(color: Color & { variant_id: number }) => setSelectedColor(color)}
                  selectedColor={selectedColor}
                />
              </div>
            </div>

            {/* TABS — full width below both gallery and product info */}
            <div className="mt-14">
              <Tabs tabs={tabsData} defaultTab="reviews" />
            </div>
          </div>

          {/* RIGHT — sticky, stays through tabs, unpins at related products */}
          <div className="sticky top-6 flex-shrink-0 w-[25%]">
            <RightPanel
              theme={t}
              product={product}
              selectedColor={selectedColor}
              variants={product.variants ?? []}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </div>
        </div>

        {/* RELATED — right panel naturally unpins here */}
        <div className="mt-20">
          <RelatedProducts theme={t} />
        </div>

      </div>

      {/* FLOATING BUTTONS */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3" style={{ zIndex: 39 }}>
        <button className="flex items-center gap-2 px-4 py-3 font-semibold text-sm transition-all hover:scale-105"
          style={{
            borderRadius: 999, background: t.bgSecondary, color: t.text,
            border: `1px solid ${t.border}`, boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          }}>
          <MessageCircle className="w-4 h-4" style={{ color: t.accent ?? t.primary }} />
          Chat with us
        </button>
        {product.faqs?.length > 0 && (
          <button onClick={() => setFaqOpen(p => !p)}
            className="flex items-center gap-2 px-4 py-3 font-semibold text-sm transition-all hover:scale-105"
            style={{
              borderRadius: 999,
              background: faqOpen ? t.primary : t.bgSecondary,
              color: faqOpen ? t.textInverse : t.text,
              border: `1px solid ${faqOpen ? t.primary : t.border}`,
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            }}>
            <HelpCircle className="w-4 h-4" style={{ color: faqOpen ? t.textInverse : (t.accent ?? t.primary) }} />
            FAQs
          </button>
        )}
      </div>

      {product.faqs?.length > 0 && (
        <FaqDrawer faqs={product.faqs} theme={t} open={faqOpen} onClose={() => setFaqOpen(false)} />
      )}

      <VariantModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        variants={product.variants ?? []}
        covers={product.covers ?? []}
        productName={product.name}
        mode={modalMode}
        onConfirm={handleModalConfirm}
        theme={t}
      />
    </div>
  );
};

export default ProductDetails;