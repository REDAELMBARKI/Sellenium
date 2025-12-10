import CollapsibleSection from "@/components/CollapsibleSection";
import CustomSelect from "@/components/ui/CustomSelect";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import { useProductDataCtx } from "@/contextHooks/sharedhooks/useProductDataCtx";
import { Upload, X, Plus, Video, Droplet, DollarSign, Settings, Tag } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import MediaSection from "../../MediaSection";
import { Cover } from "@/types/inventoryTypes";
import BaseSharedForm from "./BaseSharedForm";
import { FashionProduct } from '@/types/productsTypes';
import { useColorsCtx } from "@/contextHooks/useColorsCtx";
import ProductMetaData from "../../ProductMetaData";
import { Tag as TagType } from "@/types/tagsTypes";



const FashionBasicInfoForm = () => {
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [showMedia, setShowMedia] = useState(false);
  const [showAttributes, setShowAttributes] = useState(false);
  const [showVariantBuilder, setShowVariantBuilder] = useState(false);
  const [showSEO, setShowSEO] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const mediaRef = useRef<HTMLDivElement | null>(null);
  const attributesRef = useRef<HTMLDivElement | null>(null);
  const variantRef = useRef<HTMLDivElement | null>(null);
  const seoRef = useRef<HTMLDivElement | null>(null);
  
  const { basicInfoForm , setBasicInfoForm } = useProductDataCtx();
  const {currentTheme} = useColorsCtx()
  
  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [videoPreview]);

  useEffect(() => {
    if (showMedia && mediaRef.current) mediaRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    if (showAttributes && attributesRef.current) attributesRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    if (showVariantBuilder && variantRef.current) variantRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    if (showSEO && seoRef.current) seoRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [showMedia, showAttributes, showVariantBuilder, showSEO]);

  if (!basicInfoForm || basicInfoForm.niche !== "fashion") return null;

  const handleToggleSection = (
    sectionName: string,
    currentState: boolean,
    setter: (value: boolean) => void,
    clearData?: () => void
  ) => {
    if (currentState && clearData) {
      const confirmed = window.confirm(`Deactivating this section will destroy all data in "${sectionName}". Are you sure?`);
      if (confirmed) {
        clearData();
        setter(false);
      }
    } else {
      setter(!currentState);
    }
  };

  return (
    <div className="w-full h-full z-[999] overflow-y-auto" style={{ backgroundColor: currentTheme.bg }}>
      <div className="space-y-8 p-8 rounded-xl bg-white shadow-2xl m-4">

        {/* BASE SHARED INFO */}
        <section>
          <BaseSharedForm />
        </section>

        {/* OPTIONAL SECTIONS */}
        <div className="space-y-6">
          <h2 
            className="text-xl font-bold uppercase tracking-wide mb-4" 
            style={{ color: currentTheme.text }}
          >
            Optional Sections
          </h2>

          {/* MEDIA SECTION */}
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
            ref={mediaRef}
          >
            <MediaSection {...{ setBasicInfoForm, basicInfoForm, setVideoPreview, videoPreview }} />
          </CollapsibleSection>

          {/* PRODUCT ATTRIBUTES SECTION */}
          <CollapsibleSection
            title="Product Attributes"
            icon={Settings}
            isOpen={showAttributes}
            onToggle={() => handleToggleSection("Product Attributes", showAttributes, setShowAttributes)}
            ref={attributesRef}
          >
            <div className="space-y-4">
              <MultiSelectDropdown
                label="Materials"
                options={[]}
                selectedValues={basicInfoForm.materials || []}
                onChange={(v) => setBasicInfoForm({ ...basicInfoForm, materials: v })}
              />

              <MultiSelectDropdown
                label="Gender"
                options={[]}
                selectedValues={basicInfoForm.gender || []}
                onChange={(v) => setBasicInfoForm({ ...basicInfoForm, gender: v })}
              />

              <MultiSelectDropdown
                label="Fits"
                options={[]}
                selectedValues={basicInfoForm.fits || []}
                onChange={(v) => setBasicInfoForm({ ...basicInfoForm, fits: v })}
              />

              <MultiSelectDropdown
                label="Styles"
                options={[]}
                selectedValues={basicInfoForm.styles || []}
                onChange={(v) => setBasicInfoForm({ ...basicInfoForm, styles: v })}
              />

              <MultiSelectDropdown
                label="Season"
                options={[]}
                selectedValues={basicInfoForm.season || []}
                onChange={(v) => setBasicInfoForm({ ...basicInfoForm, season: v })}
              />
            </div>
          </CollapsibleSection>

          {/* VARIANT BUILDER SECTION */}
          <CollapsibleSection
            title="Variant Builder"
            icon={Droplet}
            isOpen={showVariantBuilder}
            onToggle={() => handleToggleSection("Variant Builder", showVariantBuilder, setShowVariantBuilder)}
            ref={variantRef}
          >
            <div className="space-y-4">
              {/* COLOR */}
              <CustomSelect
                options={[]}
                value={"red"}
                onChange={() => {}}
              />

              {/* SIZES */}
              <MultiSelectDropdown
                label="Sizes"
                options={[]}
                selectedValues={[]}
                onChange={() => {}}
              />

              {/* QUANTITY */}
              <input
                type="number"
                className="input"
                placeholder="Quantity"
              />

              {/* VARIANTS LIST PLACEHOLDER */}
              <div className="p-4 bg-gray-100 rounded-lg text-gray-600 text-sm">
                Variants List will appear here...
              </div>
            </div>
          </CollapsibleSection>

          {/* SEO SECTION */}
           {/* ADVANCED Section  aku and tags */}
            <CollapsibleSection
              title="add perfumes meta data "
              icon={Settings}
              isOpen={showAdvanced}
              onToggle={(newState) =>
                handleToggleSection("Advanced Settings", showAdvanced, setShowAdvanced, () => {
                  setBasicInfoForm({
                    ...basicInfoForm,
                    sku: '',
                    tags: [] as   TagType[] ,
                  });
                })
              }
              ref={advancedRef}
            >
            <ProductMetaData />
            </CollapsibleSection>
        </div>
      </div>
    </div>
  );
};

export default FashionBasicInfoForm;
