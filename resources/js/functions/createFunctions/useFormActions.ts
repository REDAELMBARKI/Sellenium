
import { useInventory } from "@/contextHooks/useInventory";
import { useMedia } from "@/contextHooks/useMedia";
import { useProductForm } from "@/contextHooks/useProductForm";
import { FormEvent } from "react";

export const useFormActions = () => {
    const { setCurrentVariant, setProductVariants, variantFormRef } = useInventory();
    const { setImages, setImagesPlaceHolders } = useMedia();
    const { post } = useProductForm();

    const resetVariantForm = () => {
        setCurrentVariant({
            id: null,
            colors: [],
            sizes: [],
            fits: [],
            materials: [],
            quantity: 1,
            covers: [],
        });

        setImages((prev) => {
            return Object.fromEntries(
                Object.entries(prev).map(([key, value]) =>
                    key.startsWith("cover_") ? [key, null] : [key, value]
                )
            );
        });

        setImagesPlaceHolders([1]);
    };

    const scrollToVariantForm = () => {
        if (variantFormRef?.current) {
            variantFormRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    const submitForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post("/products", {
            preserveScroll: true,
            onError: (errors: Record<string, string>) => {
                const keys = ["colors", "materials", "fits", "sizes", "covers"];

                setProductVariants((prevVariants) =>
                    prevVariants.map((variant, index) => {
                        const hasErrors = keys.some((key) => {
                            const error = errors[`inventory.${index}.${key}`];
                            return typeof error === "string" && error.trim() !== "";
                        });

                        return {
                            ...variant,
                            hasErrors,
                        };
                    })
                );
            },
        });
    };

    return {
        resetVariantForm,
        scrollToVariantForm,
        submitForm,
    };
};