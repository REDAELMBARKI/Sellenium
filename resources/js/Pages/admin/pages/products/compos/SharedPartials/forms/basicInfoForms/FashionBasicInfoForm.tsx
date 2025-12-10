import CollapsibleSection from "@/components/CollapsibleSection";
import CustomSelect from "@/components/ui/CustomSelect";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import { useProductDataCtx } from "@/contextHooks/sharedhooks/useProductDataCtx";
import { Upload, X, Plus, Video, Droplet, Settings } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import MediaSection from "../../MediaSection";
import { Color, Cover, Fit, Material, Season, Size, Style } from "@/types/inventoryTypes";
import BaseSharedForm from "./BaseSharedForm";
import { FashionProduct, FashionVariant, Gender } from '@/types/productsTypes';
import { useColorsCtx } from "@/contextHooks/useColorsCtx";
import ProductMetaData from "../../ProductMetaData";
import { Tag as TagType } from "@/types/tagsTypes";
import MultiSelectDropdownForObject from "@/components/ui/MultiSelectDropdownForObject";

const PRESET_COLORS: Color[] = [
  { name: "Red", hex: "#FF0000" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Green", hex: "#00FF00" },
];

const PRESET_SIZES: Size[] = [
  { id: 1, name: "S" },
  { id: 2, name: "M" },
  { id: 3, name: "L" },
  { id: 4, name: "XL" },
];

const FashionBasicInfoForm = () => {
  const { basicInfoForm, setBasicInfoForm } = useProductDataCtx();
  const { currentTheme } = useColorsCtx();

  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [showMedia, setShowMedia] = useState(false);
  const [showAttributes, setShowAttributes] = useState(false);
  const [showVariantBuilder, setShowVariantBuilder] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const mediaRef = useRef<HTMLDivElement | null>(null);
  const attributesRef = useRef<HTMLDivElement | null>(null);
  const variantRef = useRef<HTMLDivElement | null>(null);
  const advancedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [videoPreview]);

  useEffect(() => {
    if (showMedia && mediaRef.current) mediaRef.current.scrollIntoView({ behavior: "smooth" });
    if (showAttributes && attributesRef.current) attributesRef.current.scrollIntoView({ behavior: "smooth" });
    if (showVariantBuilder && variantRef.current) variantRef.current.scrollIntoView({ behavior: "smooth" });
    if (showAdvanced && advancedRef.current) advancedRef.current.scrollIntoView({ behavior: "smooth" });
  }, [showMedia, showAttributes, showVariantBuilder, showAdvanced]);

  if (!basicInfoForm || basicInfoForm.niche !== "fashion") return null;

  const handleToggleSection = (
    sectionName: string,
    currentState: boolean,
    setter: (value: boolean) => void,
    clearData?: () => void
  ) => {
    if (currentState && clearData) {
      const confirmed = window.confirm(`Deactivating "${sectionName}" will clear all data. Proceed?`);
      if (confirmed) {
        clearData();
        setter(false);
      }
    } else {
      setter(!currentState);
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto" style={{ backgroundColor: currentTheme.bg }}>
      <div className="space-y-8 p-8 rounded-xl bg-white shadow-2xl m-4">

        {/* Base Shared Info */}
        <BaseSharedForm />

        {/* Optional Sections */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-wide mb-4" style={{ color: currentTheme.text }}>
            Optional Sections
          </h2>

          {/* Media */}
          <div ref={mediaRef}>
            <CollapsibleSection
              title="Add Media"
              icon={Video}
              isOpen={showMedia}
              onToggle={(newState) =>
                handleToggleSection("Add Media", showMedia, setShowMedia, () => {
                  setBasicInfoForm({ ...basicInfoForm, covers: [] as Cover[], video: "" });
                  setVideoPreview(null);
                })
              }
            >
              <MediaSection {...{ setBasicInfoForm, basicInfoForm, setVideoPreview, videoPreview }} />
            </CollapsibleSection>
          </div>

          {/* Attributes */}
          <div ref={attributesRef}>
            <CollapsibleSection
              title="Product Attributes"
              icon={Settings}
              isOpen={showAttributes}
              onToggle={() => handleToggleSection("Product Attributes", showAttributes, setShowAttributes)}
            >
              <AttributesSection />
            </CollapsibleSection>
          </div>

          {/* Variant Builder */}
          <div ref={variantRef}>
            <CollapsibleSection
              title="Variant Builder"
              icon={Droplet}
              isOpen={showVariantBuilder}
              onToggle={() => handleToggleSection("Variant Builder", showVariantBuilder, setShowVariantBuilder)}
            >
              <VariantBuilder />
            </CollapsibleSection>
          </div>

          {/* Advanced / Meta */}
          <div ref={advancedRef}>
            <CollapsibleSection
              title="Advanced Settings"
              icon={Settings}
              isOpen={showAdvanced}
              onToggle={() => handleToggleSection("Advanced Settings", showAdvanced, setShowAdvanced, () => {
                setBasicInfoForm({ ...basicInfoForm, sku: '', tags: [] as TagType[] });
              })}
            >
              <ProductMetaData />
            </CollapsibleSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FashionBasicInfoForm;

// ------------------ ATTRIBUTES SECTION ------------------
const AttributesSection = () => {
  const { basicInfoForm, setBasicInfoForm } = useProductDataCtx();
  const { currentTheme } = useColorsCtx();

  if (!basicInfoForm || basicInfoForm.niche !== 'fashion') return null;

  return (
    <div className="space-y-4 p-4 border rounded-lg" style={{ backgroundColor: currentTheme.card }}>
      <MultiSelectDropdownForObject
        label="Materials"
        options={[]} 
        selectedValues={basicInfoForm?.materials || []}
        onChange={(v) => setBasicInfoForm({ ...basicInfoForm, materials: v  as Material[]})}
      />
      <MultiSelectDropdown
        label="Gender"
        options={[]} 
        selectedValues={basicInfoForm?.gender || []}
        onChange={(v) => setBasicInfoForm({ ...basicInfoForm, gender: v as Gender[] })}
      />
      <MultiSelectDropdownForObject
        label="Fits"
        options={[]} 
        selectedValues={basicInfoForm?.fits || []}
        onChange={(v) => setBasicInfoForm({ ...basicInfoForm, fits: v as Fit[]})}
      />
      <MultiSelectDropdown
        label="Styles"
        options={[]} 
        selectedValues={basicInfoForm?.styles || []}
        onChange={(v) => setBasicInfoForm({ ...basicInfoForm, styles: v as Style[]})}
      />
      <MultiSelectDropdown
        label="Season"
        options={[]} 
        selectedValues={basicInfoForm?.season || []}
        onChange={(v) => setBasicInfoForm({ ...basicInfoForm, season: v  as Season[]})}
      />
      <input
        type="text"
        placeholder="Country"
        className="w-full px-4 py-2 rounded-lg border"
        value={basicInfoForm?.country || ""}
        onChange={(e) => setBasicInfoForm({ ...basicInfoForm, country: e.target.value })}
      />
    </div>
  );
};

// ------------------ VARIANT BUILDER ------------------
const VariantBuilder = () => {
  const { basicInfoForm, setBasicInfoForm } = useProductDataCtx();
  
  if (!basicInfoForm  || basicInfoForm.niche !== 'fashion') return null;

  const addVariant = () => {
    const newVariant: FashionVariant = {
      niche: "fashion",
      id: Date.now().toString(),
      attributes: { color: PRESET_COLORS[0], sizes: [], covers: [] },
      quantity: 0,
    };
    setBasicInfoForm({
      ...basicInfoForm,
      variants: [...(basicInfoForm.variants || []), newVariant],
    });
  };

  const updateVariant = (variantId: string, attrs: Partial<FashionVariant["attributes"]>) => {
    setBasicInfoForm({
      ...basicInfoForm,
      variants: basicInfoForm.variants?.map(v =>
        v.id === variantId ? { ...v, attributes: { ...v.attributes, ...attrs } } : v
      ),
    });
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    setBasicInfoForm({
      ...basicInfoForm,
      variants: basicInfoForm.variants?.map(v => (v.id === variantId ? { ...v, quantity } : v)),
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <button
        onClick={addVariant}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        <Plus size={16} /> Add Variant
      </button>

      {basicInfoForm.variants?.map(variant => (
        <div key={variant.id} className="p-4 border rounded-lg space-y-2">
          <h4 className="font-bold">Variant ID: {variant.id}</h4>

          {/* Color */}
          {/* <CustomSelect
            label="Color"
            options={PRESET_COLORS.map(c => ({ label: c.name, value: c.name }))}
            value={variant.attributes.color?.name || ""}
            onChange={(val) => {
              const selected = PRESET_COLORS.find(c => c.name === val);
              if (selected) updateVariant(variant.id, { color: selected });
            }}
          /> */}

          {/* Sizes */}
          <MultiSelectDropdown
            label="Sizes"
            options={PRESET_SIZES.map(s => s.name)}
            selectedValues={variant.attributes.sizes.map(s => s.name)}
            onChange={(vals: string[]) => {
              const selectedSizes = PRESET_SIZES.filter(s => vals.includes(s.name));
              updateVariant(variant.id, { sizes: selectedSizes });
            }}
          />

          {/* Covers */}
          {/* <MediaSection
            variantCovers={variant.attributes.covers}
            onChange={(covers: Cover[]) => updateVariant(variant.id, { covers })}
          /> */}
          <p className="text-sm text-gray-500">
            Covers are linked to this color and selected sizes.
          </p>

          {/* Quantity */}
          <input
            type="number"
            placeholder="Quantity"
            value={variant.quantity}
            onChange={(e) => updateQuantity(variant.id, parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      ))}
    </div>
  );
};
