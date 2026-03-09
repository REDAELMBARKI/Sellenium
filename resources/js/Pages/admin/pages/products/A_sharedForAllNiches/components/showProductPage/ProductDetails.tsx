import React, { useState } from "react";
import Reviews from "./Reviews";
import ProductMoreDetailsTabMaster from "./ProductMoreDetailsTabMaster";
import Specs from "./Specs";
import MediaGallery from "./MediaGallery";
import { ProductInfo } from "./ProductInfo";
import AddToCart from "./AddToCart";
import Tabs from "./Tabs";
import VariantModal from "./VariantModal";
import RelatedProducts from "./RelatedProducts";
import { Info, Star, User, HelpCircle, MessageCircle, X } from "lucide-react";
import { router, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import { VariantSchemaType } from "@/shemas/productSchema";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";

interface ProductDetailProps {
  onStepChange: (action: "next" | "prev") => void;
}

interface FaqItem {
  question: string;
  answer: string;
}

/* ─────────────────────────────────────────────────────────────
   FAQ DRAWER — fixed overlay, slides in from the left
───────────────────────────────────────────────────────────── */
const FaqDrawer = ({
  faqs,
  theme,
  open,
  onClose,
}: {
  faqs: FaqItem[];
  theme: any;
  open: boolean;
  onClose: () => void;
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(2px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Drawer panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          width: 340,
          display: "flex",
          flexDirection: "column",
          background: theme.bgSecondary,
          borderRight: `1px solid ${theme.border}`,
          boxShadow: theme.shadowLg ?? "4px 0 32px rgba(0,0,0,0.18)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.38s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: `1px solid ${theme.border}` }}
        >
          <div className="flex items-center gap-2">
            <HelpCircle
              className="w-4 h-4"
              style={{ color: theme.accent ?? theme.primary }}
            />
            <h3
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: theme.text }}
            >
              FAQs
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center transition-colors"
            style={{
              borderRadius: "50%",
              background: theme.card,
              color: theme.textMuted,
              border: `1px solid ${theme.border}`,
            }}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pill question buttons */}
        <div className="px-4 py-4 flex flex-wrap gap-2 flex-shrink-0 overflow-y-auto">
          {faqs.map((faq, i) => {
            const isActive = activeIndex === i;
            return (
              <button
                key={i}
                onClick={() => setActiveIndex(isActive ? null : i)}
                className="text-xs font-medium px-3 py-1.5 transition-all duration-200"
                style={{
                  borderRadius: 999,
                  background: isActive ? theme.primary : theme.card,
                  color: isActive ? theme.textInverse : theme.text,
                  border: `1px solid ${isActive ? theme.primary : theme.border}`,
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                  boxShadow: isActive ? theme.shadow : "none",
                }}
              >
                {faq.question.length > 32
                  ? faq.question.slice(0, 32) + "…"
                  : faq.question}
              </button>
            );
          })}
        </div>

        {/* Answer panel — max-height slide + paper-unfold animation */}
        <div
          style={{
            overflow: "hidden",
            maxHeight: activeIndex !== null ? 320 : 0,
            transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
            flexShrink: 0,
          }}
        >
          {activeIndex !== null && (
            <div
              key={activeIndex}
              className="mx-4 mb-4 px-4 pb-4 pt-3"
              style={{
                animation: "faqAnswerIn 0.32s cubic-bezier(0.4,0,0.2,1) both",
                background: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: theme.borderRadius ?? "10px",
              }}
            >
              <p
                className="text-xs font-semibold mb-2"
                style={{ color: theme.textSecondary ?? theme.textMuted }}
              >
                {faqs[activeIndex].question}
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: theme.text }}
              >
                {faqs[activeIndex].answer}
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes faqAnswerIn {
          from {
            opacity: 0;
            transform: translateX(-20px) scaleX(0.94);
            transform-origin: left center;
          }
          to {
            opacity: 1;
            transform: translateX(0) scaleX(1);
          }
        }
      `}</style>
    </>
  );
};

/* ─────────────────────────────────────────────────────────────
   PRODUCT DETAILS PAGE
───────────────────────────────────────────────────────────── */
const ProductDetails = ({ onStepChange }: ProductDetailProps) => {
  const { product } = usePage<any>().props;
  const {
    state: { currentTheme: theme },
  } = useStoreConfigCtx();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"cart" | "buynow">("cart");
  const [faqOpen, setFaqOpen] = useState(false);

  const defaultVariant = product.variants?.[0];

  const shouldShowVariantModal =
    Array.isArray(product.variants) &&
    product.variants.length > 0 &&
    Number(product.variants[0]?.is_single) === 0;

  const galleryMedia = (product.covers ?? []).map((c: any) => ({
    id: c.id,
    url: c.url,
  }));

  const handleAddToCart = () => {
    if (shouldShowVariantModal) {
      setModalMode("cart");
      setModalOpen(true);
    } else {
      router.post(route("cart.store"), {
        id: product.id,
        variant_id: defaultVariant?.id,
      });
    }
  };

  const handleBuyNow = () => {
    if (shouldShowVariantModal) {
      setModalMode("buynow");
      setModalOpen(true);
    } else {
      onStepChange("next");
    }
  };

  const handleModalConfirm = (variant: VariantSchemaType) => {
    setModalOpen(false);
    if (modalMode === "cart") {
      router.post(route("cart.store"), {
        id: product.id,
        variant_id: variant.variant_id,
      });
    } else {
      onStepChange("next");
    }
  };

  const tabsData = [
    {
      id: "reviews",
      Icon: Star,
      label: "Reviews",
      content: <Reviews theme={theme} />,
    },
    {
      id: "details",
      Icon: Info,
      label: "Product Details",
      content: (
        <ProductMoreDetailsTabMaster
          description={product.description ?? ""}
          brand={product.brand ?? ""}
          category={
            product.sub_categories?.map((c: any) => ({
              id: String(c.id),
              name: c.name,
            })) ?? []
          }
          releaseDate={product.releaseDate ?? undefined}
          theme={theme}
        />
      ),
    },
    {
      id: "specs",
      label: "Specifications",
      Icon: User,
      content: (
        <Specs
          madeCountry={product.madeCountry ?? undefined}
          theme={theme}
        />
      ),
    },
  ];

  return (
    <div
      className="min-h-screen pb-12"
      style={{ background: theme.bg, color: theme.text }}
    >
      <div className="max-w-full mx-auto px-4 py-8">

        {/* BREADCRUMB */}
        <div
          className="flex items-center gap-2 text-xs mb-6"
          style={{ color: theme.textMuted }}
        >
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.link }}
          >
            Home
          </span>
          <span>/</span>
          <span
            className="cursor-pointer hover:underline"
            style={{ color: theme.link }}
          >
            {product.nich_category?.name ?? "Category"}
          </span>
          <span>/</span>
          <span
            className="font-medium truncate max-w-[200px]"
            style={{ color: theme.text }}
          >
            {product.name}
          </span>
        </div>

        {/* MAIN LAYOUT */}
        <div className="flex gap-6 items-start mb-16">
          <div className="flex flex-1 gap-6 min-w-0">

            {/* Media Gallery */}
            <div className="sticky top-4 flex-1 min-w-0">
              <MediaGallery media={galleryMedia} video={null} theme={theme} />
            </div>

            {/* Product Info */}
            <div className="sticky top-4 flex-1 min-w-0">
              <div
                className="p-5"
                style={{
                  background: theme.bgSecondary,
                  border: `1px solid ${theme.border}`,
                  boxShadow: theme.shadow,
                  borderRadius: theme.borderRadius,
                }}
              >
                <ProductInfo
                  name={product.name}
                  brand={product.brand ?? ""}
                  rating_average={product.rating_average ?? undefined}
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
                  theme={theme}
                />
                <div
                  className="pt-4 mt-4"
                  style={{ borderTop: `1px solid ${theme.border}` }}
                >
                  <AddToCart
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    stock={defaultVariant?.stock ?? 0}
                    theme={theme}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="mb-16">
          <Tabs tabs={tabsData} defaultTab="reviews" />
        </div>

        {/* RELATED PRODUCTS */}
        <RelatedProducts theme={theme} />
      </div>

      {/* ── STICKY FLOATING BUTTONS bottom-right ── */}
      <div
        className="fixed bottom-6 right-6 flex flex-col gap-3"
        style={{ zIndex: 39 }}
      >
        {/* Chatbot */}
        <button
          className="flex items-center gap-2 px-4 py-3 font-semibold text-sm transition-all duration-200 hover:scale-105"
          style={{
            borderRadius: 999,
            background: theme.bgSecondary,
            color: theme.text,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.shadowMd ?? "0 4px 16px rgba(0,0,0,0.12)",
          }}
        >
          <MessageCircle
            className="w-4 h-4"
            style={{ color: theme.accent ?? theme.primary }}
          />
          Chat with us
        </button>

        {/* FAQ — only if faqs exist */}
        {product.faqs?.length > 0 && (
          <button
            onClick={() => setFaqOpen((p) => !p)}
            className="flex items-center gap-2 px-4 py-3 font-semibold text-sm transition-all duration-200 hover:scale-105"
            style={{
              borderRadius: 999,
              background: faqOpen ? theme.primary : theme.bgSecondary,
              color: faqOpen ? theme.textInverse : theme.text,
              border: `1px solid ${faqOpen ? theme.primary : theme.border}`,
              boxShadow: theme.shadowMd ?? "0 4px 16px rgba(0,0,0,0.12)",
            }}
          >
            <HelpCircle
              className="w-4 h-4"
              style={{
                color: faqOpen
                  ? theme.textInverse
                  : (theme.accent ?? theme.primary),
              }}
            />
            FAQs
          </button>
        )}
      </div>

      {/* FAQ DRAWER */}
      {product.faqs?.length > 0 && (
        <FaqDrawer
          faqs={product.faqs}
          theme={theme}
          open={faqOpen}
          onClose={() => setFaqOpen(false)}
        />
      )}

      {/* VARIANT MODAL */}
      <VariantModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        variants={product.variants ?? []}
        covers={product.covers ?? []}
        productName={product.name}
        mode={modalMode}
        onConfirm={handleModalConfirm}
        theme={theme}
      />
    </div>
  );
};

export default ProductDetails;