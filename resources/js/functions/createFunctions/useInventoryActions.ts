import { useInventory } from "@/contextHooks/createProductCtxHooks/useInventory";
import { useFormActions } from "./useFormActions";
import { Color, Size, Fit, Material, ProductVariant } from "@/types/inventoryTypes";
import isEqual from "lodash/isEqual";
import { useMedia } from "@/contextHooks/createProductCtxHooks/useMedia";
import { useMediaActions } from "./useMediaActions";
import { useUIContext } from "@/contextHooks/createProductCtxHooks/useUiContext";

type VariantField = "colors" | "sizes" | "fits" | "materials";

export const useInventoryActions = () => {
    const {
        currentVariant,
        setCurrentVariant,
        productVariants,
        setProductVariants,
        updateVariantMode,
        setUpdateVariantMode,
    } = useInventory();


    const { images, setImages, setImagesPlaceHolders, setIsVariantCoverPreview } = useMedia();
    const { scrollToVariantForm , resetVariantForm } = useFormActions();
    const {fileToDataUrl} = useMediaActions()  
    const {setIsFlashing} = useUIContext()

    const productVariantsHandler = (id: string): ProductVariant[] => {

        if (updateVariantMode && id) {
        
            return productVariants.filter((v) => v.id !== id);
        }
        return productVariants;
    };

    const sameArrays = <T>(arr1: T[], arr2: T[]): boolean => {
        if (arr1.length !== arr2.length) return false;
        return (
            arr1.every((item1) => arr2.some((item2) => isEqual(item1, item2))) &&
            arr2.every((item2) => arr1.some((item1) => isEqual(item1, item2)))
        );
    };

    const addVariant = (id: string) => {
        const allFieldsFilled = Object.entries(currentVariant)
            .filter(([key]) => key !== "covers" && key !== "id")
            .every(([, fieldValue]) => {
                if (Array.isArray(fieldValue)) return fieldValue.length > 0;
                if (typeof fieldValue === "number") return fieldValue > 0;
                return fieldValue !== "" && fieldValue !== null;
            });

        if (!allFieldsFilled) return;

        const variants = productVariantsHandler(id);

        const variantExists = variants.some((variant) => {
            return (
                sameArrays(currentVariant.colors, variant.colors) &&
                sameArrays(currentVariant.sizes, variant.sizes) &&
                sameArrays(currentVariant.fits, variant.fits) &&
                sameArrays(currentVariant.materials, variant.materials) &&
                sameArrays(currentVariant.covers, variant.covers)
            );
        });

        if (variantExists) {
            alert("This variant combination already exists! Please select different options.");
            return;
        }

        if (updateVariantMode) {
            setProductVariants((prevVariants) =>
                prevVariants.map((variant) =>
                    variant.id === currentVariant.id
                        ? { ...variant, ...currentVariant }
                        : variant
                )
            );
            setUpdateVariantMode(false);
        } else {
            const newVariant: ProductVariant = {
                id: String(Date.now()),
                colors: currentVariant.colors,
                sizes: currentVariant.sizes,
                fits: currentVariant.fits,
                materials: currentVariant.materials,
                quantity: currentVariant.quantity,
                covers: currentVariant.covers,
            };
            setProductVariants([...productVariants, newVariant]);
        }

        resetVariantForm();
    };

    const handleVariantSelection = (
        type: VariantField,
        option: Color | Size | Fit | Material
    ) => {
        if (type === "colors") {
            const color = option as Color;
            const exists = currentVariant.colors.some((c) => c.hex === color.hex);

            setCurrentVariant((prev) => ({
                ...prev,
                colors: exists
                    ? prev.colors.filter((c) => c.hex !== color.hex)
                    : [...prev.colors, color],
            }));
        } else {
            const item = option as Size | Fit | Material;
            const exists = currentVariant[type].some((i: Size | Fit | Material) => i.id === item.id);

            setCurrentVariant((prev) => ({
                ...prev,
                [type]: exists
                    ? prev[type].filter((i: Size | Fit | Material) => i.id !== item.id)
                    : [...prev[type], item],
            }));
        }
    };

    const removeVariant = (id: string) => {
        setProductVariants((prev) => prev.filter((el) => el.id !== id));

        if (id === currentVariant?.id) {
            resetVariantForm();
        }

        setUpdateVariantMode(false);
    };
 
   
    const editVariant = async (id: string) => {
    scrollToVariantForm();
    setIsFlashing(true);
    setUpdateVariantMode(true);

    const variant = productVariants?.find((v) => v.id === id);

    if (!variant) return;

    setCurrentVariant({
        ...currentVariant,
        id: variant.id,
        colors: [...variant.colors],
        quantity: variant.quantity,
        fits: [...variant.fits],
        sizes: [...variant.sizes],
        materials: [...variant.materials],
        covers: [...variant.covers],
    });

    const newImages: Record<string, string> = {};

    for (const coverObj  of variant.covers) {
        const coverKey = Object.keys(coverObj)[0];
        const file = Object.values(coverObj)[0] as unknown as File;
        const base64 = await fileToDataUrl(file);
        newImages[coverKey] = base64;
    }

    setImages((prev) => ({
        ...prev,
        ...newImages,
    }));

    if (variant.covers.length === 0 && images.thumbnail) {
        setIsVariantCoverPreview(true);
        setImages((prev) => ({
            ...prev,
            cover_1: prev.thumbnail,
        }));
    }

    const editedVariantPlaceHolders: number[] = [];
    for (let i = 1; i <= variant.covers.length; i++) {
        editedVariantPlaceHolders.push(i);
    }

    setImagesPlaceHolders(
        editedVariantPlaceHolders.length > 0 ? editedVariantPlaceHolders : [1]
    );

    setTimeout(() => {
        setIsFlashing(false);
    }, 100);
};
    return {
        editVariant , 
        addVariant,
        handleVariantSelection,
        removeVariant,
    };
};