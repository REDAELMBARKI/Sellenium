import CollapsibleSection from "@/components/CollapsibleSection";
import CustomSelect from "@/components/ui/CustomSelect";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import { useProductDataCtx } from "@/contextHooks/sharedhooks/useProductDataCtx";
import { Upload, X, Plus, Video, Droplet, Settings  ,Trash2, Edit2, AlertCircle } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import MediaSection from "../../A_sharedForAllNiches/components/MediaSection";
import { Color, Cover, Fit, Material, Season, Size, Style } from "@/types/inventoryTypes";
import BaseSharedForm from "../../A_sharedForAllNiches/components/BaseSharedForm";
import {  FashionAttributes, FashionProduct, FashionVariant, Gender } from '@/types/productsTypes';
import { useColorsCtx } from "@/contextHooks/useColorsCtx";
import ProductMetaData from "../../A_sharedForAllNiches/components/ProductMetaData";
import { Tag as TagType } from "@/types/tagsTypes";
import MultiSelectDropdownForObject from "@/components/ui/MultiSelectDropdownForObject";
import VariantBuilder from "../components/VariantBuilder";

import AttributesSection from "../components/AttributesSection";
import { ImagePreviewItem } from "@/types/mediaTypes";


const keys: Array<keyof FashionAttributes> = [
  "materials",
  "gender",
  "fits",
  "madeCountry",
  "season",
  "styles",
];
function getVideoPreview(video: Cover | ImagePreviewItem | null) {
  if (!video) return null;
  if ("path" in video) return video.path;
  if ("url" in video) return video.url;
  return null;
}

const FashionBasicInfoForm = () => {
  const { basicInfoForm : bif, setBasicInfoForm } = useProductDataCtx();
  const basicInfoForm = bif as FashionProduct  ; 

  const { currentTheme } = useColorsCtx();

  const [videoPreview, setVideoPreview] = useState<string | null>(getVideoPreview(basicInfoForm.video));

  const isOpenShowMedia = (basicInfoForm.covers.length > 0) || !!(basicInfoForm.video &&  Object.keys(basicInfoForm.video).length > 0 ) ; // check if media is set

  const [showMedia, setShowMedia] = useState<boolean>(isOpenShowMedia);
  const isMountedRef = useRef<boolean>(false);


 // check if at least one of  the attributes is set
  const isOpenShowAttributes = keys.some(key => { 
  const value : FashionAttributes[keyof FashionAttributes] = basicInfoForm[key];

  // If array: must have at least 1 element
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  // If object (like madeCountry)
  if (typeof value === "object" && value !== undefined) {
     if(!value) return ;
     return  Object.keys(value).length > 0;
  }

  return false;
});

  const [showAttributes, setShowAttributes] = useState<boolean>(isOpenShowAttributes);

  const isOpenShowVariantBuilder = basicInfoForm.variants.length > 0  // check if the variants are set 
  const [showVariantBuilder, setShowVariantBuilder] = useState<boolean>(isOpenShowVariantBuilder);

  const isOpenShowAdvanced = basicInfoForm.tags.length > 0 || basicInfoForm.sku !== '' // check if the meta data is set
  const [showAdvanced, setShowAdvanced] = useState<boolean>(isOpenShowAdvanced); // this has meta dat alike sku and tags

  const mediaRef = useRef<HTMLDivElement | null>(null);
  const attributesRef = useRef<HTMLDivElement | null>(null);
  const variantRef = useRef<HTMLDivElement | null>(null);
  const advancedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [videoPreview]);
  // scroll into the view of the section opened

 
 useEffect(() => {
  if (!isMountedRef.current) {
    isMountedRef.current = true;
    return;
  }

  if (showMedia && mediaRef.current) {
      mediaRef.current.scrollIntoView({ behavior: "smooth" });
  }

  // Scroll based on which section is visible
  if (showAttributes && attributesRef.current) {
    attributesRef.current.scrollIntoView({ behavior: "smooth" });
  } else if (showVariantBuilder && variantRef.current) {
    variantRef.current.scrollIntoView({ behavior: "smooth" });
  } else if (showAdvanced && advancedRef.current) {
    advancedRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [showAttributes, showVariantBuilder, showAdvanced, showMedia]);


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
                  setBasicInfoForm({ ...basicInfoForm, covers: [] as Cover[], video: {file : null , url : null , id : null } });
                  setVideoPreview(null);
                })
              }
            >
              <MediaSection {...{ setVideoPreview, videoPreview }} />
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
           {/* // ------------------ VARIANT BUILDER SECTION ------------------ */}

              <VariantBuilder />
            </CollapsibleSection>
          </div>

          {/* Advanced / Meta  tags and sku*/}
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

