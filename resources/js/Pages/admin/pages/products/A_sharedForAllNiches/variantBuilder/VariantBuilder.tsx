import { useState, useRef, useCallback, useEffect } from "react";
import { Plus, Zap, AlertCircle } from "lucide-react";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import { Variant } from "@/types/products/productVariantType";
import OptionSelector from "./OptionSelector";
import VariantCard from "./VariantCard";
import GenerateModal from "./GenerateModel";
import { useProductDataCtx } from "@/contextHooks/product/useProductDataCtx";

const PRODUCT_PRICE = 100;

export default function VariantBuilder() {
  // swap MOCK_THEME with: const { state: { currentTheme: theme } } = useStoreConfigCtx();
  const {state:{currentTheme : theme}} = useStoreConfigCtx() ;
  const [activeOptions, setActiveOptions] = useState<string[]>([]);
  const [colorImages, setColorImages] = useState<Record<string, string>>({});
  const { basicInfoForm : {variants} , setBasicInfoForm } = useProductDataCtx();
  const [showModal, setShowModal] = useState(false);

  const newCardRef = useRef<HTMLDivElement>(null);

  // ── check if any card is still open ────────────────────────────────────
  const hasOpenCard = variants.some((v) => v.isOpen);

  // ── add empty variant (with spam prevention + scroll) ──────────────────
  const addEmpty = useCallback(() => {
    if (hasOpenCard) return; // block if a card is already open
    
    const newVariant: Variant = {
      id: `v-${Date.now()}`,
      attrs : null,
      price: PRODUCT_PRICE, stock: "",
      sku: `SKU-${String(variants.length + 1).padStart(3, "0")}`,
      imageUrl: null, isOpen: true,
    };

    setBasicInfoForm(prev => ({...prev , variants : [...prev.variants , newVariant]}))
    // scroll to new card after render
    setTimeout(() => {
      newCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }, [hasOpenCard, variants.length]);

  // ── variant CRUD ────────────────────────────────────────────────────────
  const updateVariant = (id: string, field: string, value: any) =>
  setBasicInfoForm((prev) => ({
    ...prev,
    variants: prev.variants.map(v => {
      if (v.id !== id) return v;
      if (field.startsWith("attrs.")) {
        const attrKey = field.replace("attrs.", "");
        return {
          ...v,
          attrs: {
            ...(v.attrs ?? {}),  // ← fix: handle null attrs
            [attrKey]: value
          }
        };
      }
      return { ...v, [field]: value };
    })
  }));

  const removeVariant = (id: string) =>
    setBasicInfoForm(prev => ({...prev , variants : prev.variants.filter((v) => v.id !== id)}))

  const markDone = (id: string) =>
    setBasicInfoForm(prev => ({...prev , variants : prev.variants.map((v) => v.id === id ? { ...v, isOpen: false } : v)}))

  const addGeneratedVariants = (generated: Variant[]) => {
    setBasicInfoForm(prev => ({...prev , variants : [...prev.variants , ...generated]}))

    setTimeout(() => {
      newCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };

  // ── color image handlers ────────────────────────────────────────────────
  const handleColorImageUpload = (hex: string, url: string) =>
    setColorImages((prev) => ({ ...prev, [hex]: url }));

  const handleColorImageRemove = (hex: string) =>
    setColorImages((prev) => { const n = { ...prev }; delete n[hex]; return n; });

  useEffect(() => {
     console.log()
  }, [variants]);
  return (
    <div style={{
      minHeight: "100vh",
      padding: "",
      fontFamily: "'Outfit', sans-serif",
      color: theme.text,
      maxWidth: "100%",
      margin: "0 auto",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input, select, button { font-family: inherit; outline: none; }
        input:focus, select:focus { border-color: ${theme.primary} !important; box-shadow: 0 0 0 3px ${theme.primary}18 !important; }
        input::placeholder { color: ${theme.textMuted}; }
        select option { background: white; color: ${theme.text}; }
        button:active { opacity: 0.85; }
      `}</style>

    
      {/* Step 1 */}
      <OptionSelector
        selected={activeOptions}
        colorImages={colorImages}
        onChange={setActiveOptions}
        onColorImageUpload={handleColorImageUpload}
        onColorImageRemove={handleColorImageRemove}
        theme={theme}
      />

      {/* Step 2 */}
      {activeOptions.length > 0 && (
        <div style={{ marginTop: 28 }}>

          {/* section header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 12, letterSpacing: "0.1em", color: theme.textMuted, marginBottom: 2, fontWeight: 600 }}>STEP 2 — VARIANTS</p>
              <p style={{ fontSize: 13, color: theme.textSecondary }}>
                {variants.length === 0
                  ? "Add your first variant below"
                  : `${variants.length} variant${variants.length !== 1 ? "s" : ""} · ${variants.filter((v) => !v.stock).length > 0 ? `${variants.filter((v) => !v.stock).length} missing stock` : "all good ✓"}`
                }
              </p>
            </div>

            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button type="button" onClick={() => setShowModal(true)} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "9px 16px", borderRadius: theme.borderRadius,
                border: `1.5px solid ${theme.primary}`,
                background: theme.secondary,
                color: theme.primary, fontSize: 13, fontWeight: 500, cursor: "pointer",
                transition: "all 0.15s",
              }}>
                <Zap size={14} /> Generate
              </button>

              <div style={{ position: "relative" }}>
                <button
                 type="button"
                  onClick={addEmpty}
                  disabled={hasOpenCard}
                  title={hasOpenCard ? "Save the open variant first" : "Add a new variant"}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "9px 16px", borderRadius: theme.borderRadius,
                    background: hasOpenCard ? theme.border : theme.primary,
                    border: "none",
                    color: hasOpenCard ? theme.textMuted : theme.textInverse,
                    fontSize: 13, fontWeight: 500,
                    cursor: hasOpenCard ? "not-allowed" : "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <Plus size={14} /> Add manually
                </button>
              </div>
            </div>
          </div>

          {/* warning banner when a card is open */}
          {hasOpenCard && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 14px", marginBottom: 12,
              background: theme.warning + "15",
              border: `1px solid ${theme.warning}44`,
              borderRadius: theme.borderRadius,
            }}>
              <AlertCircle size={14} color={theme.warning} />
              <span style={{ fontSize: 12, color: theme.warning }}>
                Save the open variant before adding another one.
              </span>
            </div>
          )}

          {/* empty state */}
          {variants.length === 0 && (
            <div style={{
              textAlign: "center", padding: "52px 24px",
              border: `2px dashed ${theme.border}`,
              borderRadius: theme.borderRadius,
              background: theme.bgSecondary,
            }}>
              <p style={{ fontSize: 28, marginBottom: 12 }}>📦</p>
              <p style={{ fontSize: 14, fontWeight: 500, color: theme.text, marginBottom: 6 }}>No variants yet</p>
              <p style={{ fontSize: 13, color: theme.textMuted, marginBottom: 20 }}>
                Example: a Red T-shirt in size M with 10 units at 150 MAD
              </p>
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                <button type="button"  onClick={addEmpty} style={{ padding: "9px 20px", borderRadius: theme.borderRadius, background: theme.primary, border: "none", color: theme.textInverse, fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
                  + Add first variant
                </button>
                <button type="button" onClick={() => setShowModal(true)} style={{ padding: "9px 20px", borderRadius: theme.borderRadius, border: `1.5px solid ${theme.primary}`, background: theme.secondary, color: theme.primary, fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
                  ⚡ Generate
                </button>
              </div>
            </div>
          )}

          {/* variant cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {variants.map((v, i) => (
              <div key={v.id} ref={i === variants.length - 1 ? newCardRef : undefined}>
                <VariantCard
                  variant={v}
                  activeOptions={activeOptions}
                  productPrice={PRODUCT_PRICE}
                  colorImages={colorImages}
                  onChange={updateVariant}
                  onRemove={removeVariant}
                  onDone={markDone}
                  theme={theme}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* no options yet */}
      {activeOptions.length === 0 && (
        <div style={{
          marginTop: 24, textAlign: "center", padding: "52px 24px",
          border: `2px dashed ${theme.border}`,
          borderRadius: theme.borderRadius,
          background: theme.bgSecondary,
        }}>
          <p style={{ fontSize: 28, marginBottom: 12 }}>☝️</p>
          <p style={{ fontSize: 14, fontWeight: 500, color: theme.text, marginBottom: 6 }}>Select options first</p>
          <p style={{ fontSize: 13, color: theme.textMuted }}>
            For a t-shirt → select <strong>Color</strong> + <strong>Size</strong><br />
            For a phone → select <strong>Storage</strong> + <strong>Color</strong>
          </p>
        </div>
      )}

      {/* generate modal */}
      {showModal && (
        <GenerateModal
          activeOptions={activeOptions}
          existingVariants={variants}
          productPrice={PRODUCT_PRICE}
          onAdd={addGeneratedVariants}
          onClose={() => setShowModal(false)}
          theme={theme}
        />
      )}
    </div>
  );
}