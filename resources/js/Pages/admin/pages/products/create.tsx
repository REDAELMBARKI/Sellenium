import React, { useState, useEffect } from "react";
import "../../../../../css/createProduct.css"
import { useTagsInventoryValidation } from "@/hooks/createProductHooks/useTagsInventoryValidation";
import { useFieldAndThumbValidation } from "@/hooks/createProductHooks/useFieldAndThumbValidation";
import { useFinalSubmitFormValidationCheck } from "@/hooks/createProductHooks/useFinalSubmitFormValidationCheck";
import { useThumbnailManipuler } from "@/hooks/createProductHooks/useThumbnailManipuler";
import { useTagSuggestionsMaker } from "@/hooks/createProductHooks/useTagSuggestionsMaker";
import { ProductFormProvider } from "@/contextProvoders/ProductFormProvider";
import { TagsProvider } from "@/contextProvoders/TagsProvider";
import { InventoryProvider } from "@/contextProvoders/InventoryProvider";
import { MediaProvider } from "@/contextProvoders/MediaProvider";
import { useInventory } from "@/contextHooks/useInventory";
import { useMedia } from "@/contextHooks/useMedia";
import { useProductForm } from "@/contextHooks/useProductForm";
import { useTags } from "@/contextHooks/useTags";
import { useFormActions } from "@/functions/createFunctions/useFormActions";
import Layout from "@/Layouts/Layout";
import AddImagesSection from "@/Pages/admin/pages/products/addProductPartials/AddImagesSection";
import BasicInformationsSection from "@/Pages/admin/pages/products/addProductPartials/BasicInformationsSection";
import VariantForm from "@/Pages/admin/pages/products/addProductPartials/VariantForm";
import VariantsList from "@/Pages/admin/pages/products/addProductPartials/VariantsList";
import { TagSuggestion } from "@/types/tagsTypes";
import { InventoryOptions } from "@/types/inventoryTypes";
import { UIProvider } from "@/contextProvoders/UiProvider";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";


interface CreatePageProps {
    tagSuggestions: TagSuggestion[];
    inventoryOptions: InventoryOptions;
}
export default function Create({ tagSuggestions, inventoryOptions }: CreatePageProps) {
    return (
        <UIProvider>
        <InventoryProvider>
            <ProductFormProvider>
                <TagsProvider>
                    <MediaProvider>
                        <CreateContent
                            tagSuggestions={tagSuggestions}
                            inventoryOptions={inventoryOptions}
                        />
                    </MediaProvider>
                </TagsProvider>
            </ProductFormProvider>
        </InventoryProvider>
        </UIProvider>
    );
}


Create.layout = (page:any) => <AdminLayout  children={page} />

function CreateContent({ tagSuggestions, inventoryOptions }: CreatePageProps) {


    const { currentVariant, productVariants } = useInventory();
    const { setImagesPlaceHolders } = useMedia();
    const { data, isReadyToSubmit, setData } = useProductForm();
    const { selectedTags } = useTags();
    const { submitForm } = useFormActions();

    const isReadyToAdd = Object.entries(currentVariant)
        .filter(([key]) => key !== "id" && key !== "covers")
        .every(
            ([, value]) =>
                value !== null &&
                value !== "" &&
                (!Array.isArray(value) || value.length > 0)
        );

    useTagSuggestionsMaker({ tagSuggestions });
    useThumbnailManipuler();

    useEffect(() => {
        setImagesPlaceHolders([1]);
    }, [setImagesPlaceHolders]);

    useEffect(() => {
        setData("inventory", productVariants);
        setData("tags", selectedTags);
    }, [productVariants, selectedTags, setData]);

    useTagsInventoryValidation();
    useFieldAndThumbValidation();
    useFinalSubmitFormValidationCheck();

    return (
        <>
            <div className="py-8 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">
                            Add New Product
                        </h1>
                        <p className="text-slate-600">
                            Create and manage your product inventory
                        </p>
                    </div>

                    <section className="bg-white rounded-xl shadow-md border border-slate-200 p-8 space-y-8">
                        <BasicInformationsSection />

                        <AddImagesSection title="Thumbnail" forInventory={false} />

                        <div className="space-y-6">
                            <VariantForm
                                isReadyToAdd={isReadyToAdd}
                                inventoryOptions={inventoryOptions}
                            />
                            <VariantsList />
                        </div>

                        <div className="pt-6 border-t border-slate-200">
                            <button
                                id="saveProduct"
                                type="button"
                                onClick={submitForm}
                                className={`${
                                    isReadyToSubmit.bool
                                        ? "opacity-100 from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 shadow-lg hover:shadow-xl hover:scale-105"
                                        : "opacity-40"
                                } transition-all duration-200 font-semibold text-lg bg-gradient-to-r from-blue-900 to-indigo-900 w-full md:w-auto px-10 py-4 text-white rounded-xl`}
                            >
                                {isReadyToSubmit.bool
                                    ? "Save Product"
                                    : "Fill all required fields"}
                            </button>

                            <ul className="mt-4 px-4 py-2 bg-orange-50 border border-orange-300 rounded-lg">
                                {Object.keys(isReadyToSubmit)
                                    .filter((key) => key !== "bool")
                                    .map((key) =>
                                        !isReadyToSubmit[key as keyof typeof isReadyToSubmit] ? (
                                            <li
                                                key={key}
                                                className="text-sm text-orange-600 font-medium py-1 pl-2 flex items-center gap-2"
                                            >
                                                <span className="w-2 h-2 bg-orange-500 rounded-full" />
                                                <span className="capitalize">{key} is missing</span>
                                            </li>
                                        ) : null
                                    )}
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}