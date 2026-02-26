import CollapsibleSection from "@/components/CollapsibleSection";
import { useProductDataCtx } from "@/contextHooks/product/useProductDataCtx";
import {
    Video as VideoIcon,
    Droplet,
    Settings,
    HelpCircle,
    Tag,
    Layers,
} from "lucide-react";
import { useState, useRef } from "react";
import MediaSection from "../components/editAndCreate/MediaSection";
import {
    CategoryCode,
    Video,
} from "@/types/inventoryTypes";
import BaseSharedForm from "../components/editAndCreate/BaseSharedForm";

import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import {
    ATTRIBUTES_FORM_SECTIONS,
} from "@/data/formSectionConfigurations";
import NotifyUser from "@/components/ui/NotifyUser";
import PricingSection from "../components/editAndCreate/PricingSection";
import CollapsibleFrendlySection from "@/components/CollapsibleFrendlySection";
import adapters from "@/functions/product/adapters";
import CustomSelectForObjectNative from "@/components/ui/CustomSelectForObjectNative";
import { Button } from "@/components/ui/button";
import VariantBuilder from "../variantBuilder/VariantBuilder";
import FaqsSection from "../components/editAndCreate/FAQS";
import ProductSettingsSection from "../components/editAndCreate/VisibilitySettings";
import BadgePicker from "../components/editAndCreate/BadgePicker";
import VisibilitySettings from "../components/editAndCreate/VisibilitySettings";
import RelatedProductsSection from "../components/editAndCreate/RelatedProductsSection";


interface ProductCrEdFormFormProps {
    register : any
}

const ProductCrEdForm = ({register} : ProductCrEdFormFormProps) => {
    const { basicInfoForm, setBasicInfoForm , category , setCategory , options } = useProductDataCtx();
    const {toSelectOptionAdapter } = adapters()
    const {
        state: { currentTheme },
    } = useStoreConfigCtx();
   
    const isOpenShowMedia =
        basicInfoForm.covers.length > 0 ||
        !!(basicInfoForm.video && Object.keys(basicInfoForm.video).length > 0); // check if media is set
    const isOpenShowVariantBuilder = basicInfoForm.variants.length > 0; // check if the variants are set
    const [showVariantBuilder, setShowVariantBuilder] = useState<boolean>(
        isOpenShowVariantBuilder
    );


    // check if at least one of  the attributes is set
    const isOpenShowAttributes = true;
    //   const isOpenShowAttributes = keys.some(key => {
    //   const value : FashionAttributes[keyof FashionAttributes] = basicInfoForm[key];

    //   // If array: must have at least 1 element
    //   if (Array.isArray(value)) {
    //     return value.length > 0;
    //   }

    //   // If object (like madeCountry)
    //   if (typeof value === "object" && value !== undefined) {
    //      if(!value) return ;
    //      return  Object.keys(value).length > 0;
    //   }

    //   return false;
    // });
    //  states
    const [showAttributes, setShowAttributes] =
        useState<boolean>(isOpenShowAttributes);
    const [videoPreview, setVideoPreview] = useState<Video | null>(basicInfoForm.video);
    
    const [frontEndErrors, setFrontEndErrors] = useState<
        Record<string, string>
    >({});
    const [showMedia, setShowMedia] = useState<boolean>(isOpenShowMedia);
    const [showFaqs, setShowFaqs] = useState(false)
    const [showVisibility, setShowVisibility] = useState(false) ;
    const [showRelated, setShowRelated] = useState(false) ;
    
    //refs
    const isMountedRef = useRef<boolean>(false);
    const mediaRef = useRef<HTMLDivElement | null>(null);
    const attributesRef = useRef<HTMLDivElement | null>(null);
    const variantRef = useRef<HTMLDivElement | null>(null);
    const thumbnailPreviewRef = useRef<any | null>(null);


    // useEffect(() => {
    //     if (!isMountedRef.current) {
    //         isMountedRef.current = true;
    //         return;
    //     }

    //     if (showMedia && mediaRef.current) {
    //         mediaRef.current.scrollIntoView({ behavior: "smooth" });
    //     }

    //     // Scroll based on which section is visible
    //     if (showAttributes && attributesRef.current) {
    //         attributesRef.current.scrollIntoView({ behavior: "smooth" });
    //     } else if (showVariantBuilder && variantRef.current) {
    //         variantRef.current.scrollIntoView({ behavior: "smooth" });
    //     } else if (showAdvanced && advancedRef.current) {
    //         advancedRef.current.scrollIntoView({ behavior: "smooth" });
    //     }
    // }, [showAttributes, showVariantBuilder, showAdvanced, showMedia]);

    const handleToggleSection = (
        sectionName: string,
        currentState: boolean,
        setter: (value: boolean) => void,
        clearData?: () => void
    ) => {
        if (currentState && clearData) {
            const confirmed = window.confirm(
                `Deactivating "${sectionName}" will clear all data. Proceed?`
            );
            if (confirmed) {
                clearData();
                setter(false);
            }
        } else {
            setter(!currentState);
        }
    };


    const AttibutesBuilder = category ? ATTRIBUTES_FORM_SECTIONS[category.name  as CategoryCode] : null;
    return (
        <div className="w-full h-full overflow-y-auto ">
            <div
                className="space-y-8 py-8 px-4 rounded-xl shadow-2xl "
                style={{ background: "transparent", color: currentTheme.text }}
            >
                {/* category selectin here */}

                <section
                    className="p-4 border border-1"
                    style={{
                        background: currentTheme.card,
                        borderColor: currentTheme.border,
                    }}
                >
                    <h2
                        className="text-xl font-bold uppercase tracking-wide mb-4"
                        style={{ color: currentTheme.text }}
                    >
                        What You are going to sell ??
                    </h2>
                    <CustomSelectForObjectNative
                        options={options?.categories?.map(toSelectOptionAdapter)}
                        value={{value : category?.id ?? "" , label : category?.name ?? ''}}
                        onChange={(value) => {
                            setCategory({id :  value.value as string , name :value.label})
                            setBasicInfoForm({
                                ...basicInfoForm,
                                category_niche_id: Number(value.value),
                            });
                        }}
                    />

                    <NotifyUser message="choose hte category so realted category sections would apear " />
                </section>

                {/* base form */}
                <section
                    className="p-4 border border-1"
                    style={{
                        background: currentTheme.card,
                        borderColor: currentTheme.border,
                    }}
                >
                    {/* Base Shared Info */}
                    <BaseSharedForm
                        {...{ frontEndErrors }}
                        getThumbnailPreview={(thumbnail) =>
                            (thumbnailPreviewRef.current = thumbnail)
                        }
                    />
                </section>

               

                <section
                    className="p-4 border border-1"
                    style={{
                        background: currentTheme.card,
                        borderColor: currentTheme.border,
                    }}
                >
                    {/* Media */}
                    <div ref={mediaRef}>
                        <CollapsibleFrendlySection
                            title="Add Media"
                            icon={VideoIcon}
                            isOpen={showMedia} 
                            onToggle={() => setShowMedia((prev) => !prev)}
                            headerActions={
                              <>
                                <Button type="button" className="px-3 py-1.5 text-sm rounded-lg border">
                                  Add images
                                </Button>
                                <Button type="button" className="px-3 py-1.5 text-sm rounded-lg border">
                                  Add video
                                </Button>
                              </>
                            }
                        >
                            <MediaSection
                                {...{ videoPreview, setVideoPreview }}
                            />
                        </CollapsibleFrendlySection>
                    </div>
                </section>

                {/* faqs */}
                <section
                    className="border border-1"
                    style={{
                        background: currentTheme.card,
                        borderColor: currentTheme.border,
                    }}
                >
                    <CollapsibleSection
                        title="FAQs"
                        icon={HelpCircle}
                        isOpen={showFaqs}
                        onToggle={() => handleToggleSection("FAQs", showFaqs, setShowFaqs)}
                    >
                        <FaqsSection />
                    </CollapsibleSection>
                </section>
               
                
                {/* Attributes */}

                {AttibutesBuilder && (
                    <section
                        className="p-4 border border-1"
                        style={{
                            background: currentTheme.card,
                            borderColor: currentTheme.border,
                        }}
                    >
                        <div ref={attributesRef}>
                            <CollapsibleSection 
                                title="Product Attributes"
                                icon={Settings}
                                isOpen={showAttributes}
                                onToggle={() =>
                                    handleToggleSection(
                                        "Product Attributes",
                                        showAttributes,
                                        setShowAttributes
                                    )
                                }
                            >
                                <AttibutesBuilder />
                            </CollapsibleSection>
                        </div>
                    </section>
                )}
 
            {/* related products */}
            <CollapsibleSection title="Related Products" icon={Layers} isOpen={showRelated}
              onToggle={() => handleToggleSection("Related Products", showRelated, setShowRelated)}>
              <RelatedProductsSection />
            </CollapsibleSection>
            {/* visibility*/}
            <section
                className="border border-1"
                style={{
                    background: currentTheme.card,
                    borderColor: currentTheme.border,
                }}
            >
                <CollapsibleSection
                    title="Visibilily Settings"
                    icon={Settings}
                    isOpen={showVisibility}
                    onToggle={() => handleToggleSection("Product Settings", showVisibility, setShowVisibility)}
                >
                    <VisibilitySettings />
                </CollapsibleSection>
            </section>
             
            </div>
        </div>
    );
};

export default ProductCrEdForm;
