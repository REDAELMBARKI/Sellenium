import React, { useState, useEffect } from "react";
import { Edit2, X, Check, Upload, Trash2, Box } from "lucide-react";
import UnsavedChangesToast from "@/components/editProductPartials/UnsavedChangesToast";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";
import { SectionHeader } from "@/admin/components/layout/SectionHeader";
import { Button } from "@/components/ui/button";
import SelectByRadix from "@/components/ui/SelectByRadix";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import EmptyListSection from "@/admin/components/partials/EmptyListSection";
import { EditProductBackendProps, ProductBasicInfoData, ProductDataGlobal, Variant } from "@/types/productsTypes";
import { Color , Fit , InventoryItem, InventoryOptions, Material , Size  } from "@/types/inventoryTypes";
import { Tag } from "@/types/tagsTypes";
import ProductBasicInfo from "./compos/editPartials/ProductBasicInfo";
import EditProductDataProvider from "@/contextProvoders/editProductProviders/editProductDataProvider";
import EditProductUIProvider from "@/contextProvoders/editProductProviders/editProductUIProvider";
import { useEditProductDataCtx } from "@/contextHooks/editProductCtxHooks/useEditProductDataCtx";
import { useEditProductUICtx } from "@/contextHooks/editProductCtxHooks/useEditProductUICtx";
import { VariantsSection } from "./compos/SharedPartials/VariantsSection";


export default  function Edit({product , inventoryOptions , tagSuggestions}:EditProductBackendProps){

    return ( 
                <EditProductDataProvider  product={product} inventoryOptions={inventoryOptions}  tagSuggestions={tagSuggestions}>
                        <EditProductUIProvider>
                                    <EditContent/>
                        </EditProductUIProvider>
                </EditProductDataProvider>
        
    )
}
Edit.layout = (page: any) => <AdminLayout children={page} />;




function EditContent() {

    const  {basicInfoForm  , setBasicInfoForm , productData , setProductData , tagSuggestionsState, setTagSuggestionsState , setInventoryOptionsState ,  setVariantForm , setVariantToDelete} = useEditProductDataCtx()
    const  {hasUnsavedChanges , showToast , isEditingBasicInfo ,deleteConfirmText , deleteModalOpen, setShowToast ,  setIsEditingBasicInfo , setHasUnsavedChanges , setEditingVariantId , setDeleteConfirmText , setDeleteModalOpen , } = useEditProductUICtx()


    useEffect(() => {
        if (hasUnsavedChanges && !showToast) {
            setShowToast(true);
        }
    }, [hasUnsavedChanges, showToast]);

    const handleEditBasicInfo = () => {
        setIsEditingBasicInfo(true);

        if(!productData)  return ;
        setBasicInfoForm({
            name: productData.name,
            brand: productData.brand,
            price: productData.price,
            description: productData.description,
            category: productData.category,
            gender: productData.gender,
            isFeatured: productData.isFeatured,
            free_shipping: productData.free_shipping,
            thumbnail: productData.thumbnail,
            tags: productData.tags,
        });
    };

    const handleSaveBasicInfo = () => {
        setProductData({
            ...productData,
            ...basicInfoForm,
        });
        setIsEditingBasicInfo(false);
        setHasUnsavedChanges(true);
    };

    const handleCancelBasicInfo = () => {
        setIsEditingBasicInfo(false);
        if(!productData) return ;
        setBasicInfoForm({
            name: productData.name,
            brand: productData.brand,
            price: productData.price,
            description: productData.description,
            category: productData.category,
            gender: productData.gender,
            isFeatured: productData.isFeatured,
            free_shipping: productData.free_shipping,
            thumbnail: productData.thumbnail,
            tags: productData.tags,
        });
    };

    const handleEditVariant = (variant: Variant) => {
        setEditingVariantId(variant.id);
        setVariantForm({ ...variant });
    };

    const handleSaveVariant = () => {
        if (!variantForm || editingVariantId === null) return;

        setProductData({
            ...productData,
            variants: productData?.variants?.map((v) =>
                v.id === editingVariantId ? variantForm : v
            ),
        });
        setEditingVariantId(null);
        setVariantForm(null);
        setHasUnsavedChanges(true);
    };

    const handleCancelVariant = () => {
        setEditingVariantId(null);
        setVariantForm(null);
    };

    const handleDeleteVariantClick = (variantId: number) => {
        setVariantToDelete(variantId);
        setDeleteModalOpen(true);
        setDeleteConfirmText("");
    };

    const handleConfirmDelete = () => {
        if (
            deleteConfirmText.toLowerCase() === "delete" &&
            variantToDelete !== null
        ) {
            setProductData({
                ...productData,
                variants: productData?.variants?.filter(
                    (v) => v.id !== variantToDelete
                ),
            });
            setDeleteModalOpen(false);
            setDeleteConfirmText("");
            setVariantToDelete(null);
            setHasUnsavedChanges(true);
        }
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
        setDeleteConfirmText("");
        setVariantToDelete(null);
    };

    const handleSaveAllChanges = () => {
        console.log("Saving all changes:", productData);
        alert("Changes saved successfully!");
        setHasUnsavedChanges(false);
        setShowToast(false);
    };

    const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBasicInfoForm({
                    ...basicInfoForm,
                    thumbnail: reader.result as string,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVariantImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!variantForm) return;
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setVariantForm({
                    ...variantForm,
                    images: [...variantForm.images, reader.result as string],
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const removeVariantImage = (index: number) => {
        if (!variantForm) return;
        setVariantForm({
            ...variantForm,
            images: variantForm.images.filter((_, i) => i !== index),
        });
    };

    const toggleVariantAttribute = <T extends Color | Size | Fit | Material>(
        key: "colors" | "sizes" | "fits" | "materials",
        item: T
    ) => {
        if (!variantForm) return;

        const currentItems = variantForm[key] as T[];
        const exists = currentItems.some((i) => i.id === item.id);

        setVariantForm({
            ...variantForm,
            [key]: exists
                ? currentItems.filter((i) => i.id !== item.id)
                : [...currentItems, item],
        });
    };

    const removeTag = (tagId: string) => {
        setBasicInfoForm({
            ...basicInfoForm,
            tags: basicInfoForm?.tags?.filter((t) => Number(t.id) !== Number(tagId)),
        });
    };

    const addTag = (tag : Tag) => {
        if (!basicInfoForm?.tags?.some((t) => Number(t.id) === Number(tag.id))) {
            setBasicInfoForm({
                ...basicInfoForm,
                tags: [...basicInfoForm.tags, tag],
            });
        }
    };

    return (
        <>
            {showToast && hasUnsavedChanges && (
                <UnsavedChangesToast
                    message="Changes unsaved"
                    onClose={() => setShowToast(false)}
                />
            )}
            <div className="min-h-screen bg-slate-50 py-8 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* hehader */}
                    <SectionHeader
                        title="Edit Product"
                        description="Update product details and variants"
                    />
                    <div className="space-y-6">
                        <ProductBasicInfo
                            basicInfoForm={basicInfoForm}
                            isEditingBasicInfo={isEditingBasicInfo}
                            productData={productData}
                            removeTag={removeTag}
                            addTag={addTag}
                            tagSuggestions={tagSuggestionsState}
                            handleEditBasicInfo={handleEditBasicInfo}
                            handleThumbnailUpload={handleThumbnailUpload}
                            setBasicInfoForm={setBasicInfoForm}
                        />

                     {/* <VariantsSection /> */}
                     
                     
                    
                        <div className="flex justify-center">
                            <button
                                onClick={handleSaveAllChanges}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                            >
                                Save All Changes
                            </button>
                        </div>
                    </div>
                </div>

                {deleteModalOpen && (
                    <DeleteConfirmationModal
                        name={"somethong"}
                        isOpen={deleteModalOpen}
                        entityType="variant"
                        onConfirm={() => {}}
                        onClose={() => setDeleteModalOpen(false)}
                    />
                )}
            </div>
        </>
    );
}

