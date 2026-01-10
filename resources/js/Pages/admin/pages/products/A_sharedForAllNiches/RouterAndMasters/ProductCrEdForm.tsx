import CollapsibleSection from "@/components/CollapsibleSection";
import CustomSelect from "@/components/ui/CustomSelect";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import { useProductDataCtx } from "@/contextHooks/sharedhooks/useProductDataCtx";
import {
    Upload,
    X,
    Plus,
    Video,
    Droplet,
    Settings,
    Trash2,
    Edit2,
    AlertCircle,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import MediaSection from "../components/editAndCreate/MediaSection";
import {
    Color,
    Cover,
    Fit,
    Material,
    Season,
    Size,
    Style,
} from "@/types/inventoryTypes";
import BaseSharedForm from "../components/editAndCreate/BaseSharedForm";
import ProductMetaData from "../components/editAndCreate/ProductMetaData";
import { Tag as TagType } from "@/types/tagsTypes";

import { ImagePreviewItem } from "@/types/mediaTypes";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import {
    ATTRIBUTES_FORM_SECTIONS,
    VARIANTS_FORM_SECTIONS,
} from "@/data/formSectionConfigurations";
import { CategoryCode } from "@/types/products/categories";
import { CATEGORIES } from "@/data/listOfCategories";
import NotifyUser from "@/components/ui/NotifyUser";
import PricingSection from "../components/editAndCreate/PricingSection";
import CollapsibleFrendlySection from "@/components/CollapsibleFrendlySection";
import CustomSelectNative from "@/components/ui/CustomSelectNative";
import adapters from "@/functions/adapters";
import CustomSelectForObjectNative from "@/components/ui/CustomSelectForObjectNative";

function getVideoPreview(video: Cover | ImagePreviewItem | null) {
    if (!video) return null;
    if ("path" in video) return video.path;
    if ("url" in video) return video.url;
    return null;
}

const ProductCrEdForm = () => {
    const { basicInfoForm, setBasicInfoForm } = useProductDataCtx();

    const {
        state: { currentTheme, currentCategory },
        dispatch,
    } = useStoreConfigCtx();
    const { options } = useProductDataCtx();

    const [videoPreview, setVideoPreview] = useState<string | null>(
        getVideoPreview(basicInfoForm.video)
    );

    const isOpenShowMedia =
        basicInfoForm.covers.length > 0 ||
        !!(basicInfoForm.video && Object.keys(basicInfoForm.video).length > 0); // check if media is set

    const [showMedia, setShowMedia] = useState<boolean>(isOpenShowMedia);
    const isMountedRef = useRef<boolean>(false);

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

    const [showAttributes, setShowAttributes] =
        useState<boolean>(isOpenShowAttributes);

    const isOpenShowVariantBuilder = basicInfoForm.variants.length > 0; // check if the variants are set
    const [showVariantBuilder, setShowVariantBuilder] = useState<boolean>(
        isOpenShowVariantBuilder
    );

    const isOpenShowAdvanced = basicInfoForm.tags.length > 0; // check if the meta data is set
    const [showAdvanced, setShowAdvanced] =
        useState<boolean>(isOpenShowAdvanced); // this has meta dat alike sku and tags
    const [frontEndErrors, setFrontEndErrors] = useState<
        Record<string, string>
    >({});
    const {toSelectOptionAdapter , toSetterAdapter} = adapters()

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

    const validateField = (field: string, value: any) => {
        const newFrontEndErrors = { ...frontEndErrors };

        if (field === "name" && !value?.trim()) {
            newFrontEndErrors.name = "Product name is required";
        } else if (field === "name") {
            delete newFrontEndErrors.name;
        }

        if (field === "brand" && !value?.trim()) {
            newFrontEndErrors.brand = "Brand is required";
        } else if (field === "brand") {
            delete newFrontEndErrors.brand;
        }

        if (field === "price" && (!value || parseFloat(value) <= 0)) {
            newFrontEndErrors.price = "Valid price is required";
        } else if (field === "price") {
            delete newFrontEndErrors.price;
        }

        if (field === "description" && !value?.trim()) {
            newFrontEndErrors.description = "Description is required";
        } else if (field === "description") {
            delete newFrontEndErrors.description;
        }

        if (field === "thumbnail" && !value && !thumbnailPreviewRef.current) {
            newFrontEndErrors.thumbnail = "Product thumbnail is required";
        } else if (field === "thumbnail") {
            delete newFrontEndErrors.thumbnail;
        }

        setFrontEndErrors(newFrontEndErrors);
    };

    const VariantBuilder = VARIANTS_FORM_SECTIONS[currentCategory.name as CategoryCode ];
    const AttibutesBuilder = ATTRIBUTES_FORM_SECTIONS[currentCategory.name  as CategoryCode];
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
                        options={CATEGORIES.map(toSelectOptionAdapter)}
                        value={{ label : basicInfoForm?.category.name ?? '' , value : basicInfoForm?.category.id ?? '' }}
                        onChange={(value) => {
                            dispatch({
                                type: "SET_CATEGORY",
                                payload: {id :  value.value as string , name :value.label} ,
                            });
                            setBasicInfoForm({
                                ...basicInfoForm,
                                category: {name : value.label  , id : value.value as string} ,
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
                        {...{ frontEndErrors, validateField }}
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
                    <PricingSection {...{ frontEndErrors, validateField }} />
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
                            icon={Video}
                            isOpen={showMedia} 
                            onToggle={() => setShowMedia((prev) => !prev)}
                            headerActions={
                              <>
                                <button className="px-3 py-1.5 text-sm rounded-lg border">
                                  Add images
                                </button>
                                <button className="px-3 py-1.5 text-sm rounded-lg border">
                                  Add video
                                </button>
                              </>
                            }
                        >
                            <MediaSection
                                {...{ videoPreview, setVideoPreview }}
                            />
                        </CollapsibleFrendlySection>
                    </div>
                </section>

                {/* Variant Builder */}
                {VariantBuilder && (
                    <section
                        className="p-4 border border-1"
                        style={{
                            background: currentTheme.bg,
                            borderColor: currentTheme.border,
                        }}
                    >
                        <div ref={variantRef}>
                            <CollapsibleSection
                                title="Variant Builder"
                                icon={Droplet}
                                isOpen={showVariantBuilder}
                                onToggle={() =>
                                    handleToggleSection(
                                        "Variant Builder",
                                        showVariantBuilder,
                                        setShowVariantBuilder
                                    )
                                }
                            >
                                {/* // ------------------ VARIANT BUILDER SECTION ------------------ */}

                                <VariantBuilder />
                            </CollapsibleSection>
                        </div>
                    </section>
                )}

                
                {/* Attributes */}

                {AttibutesBuilder && (
                    <section
                        className="p-4 border border-1"
                        style={{
                            background: currentTheme.bg,
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


             
            </div>
        </div>
    );
};

export default ProductCrEdForm;
