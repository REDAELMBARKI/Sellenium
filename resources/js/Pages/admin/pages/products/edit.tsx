import React, { useState, useEffect } from "react";
import { Edit2, X, Check, Upload, Trash2, Box } from "lucide-react";
import UnsavedChangesToast from "@/components/editProductPartials/UnsavedChangesToast";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";
import { SectionHeader } from "@/admin/components/layout/SectionHeader";
import { Button } from "@/components/ui/button";
import SelectByRadix from "@/components/ui/SelectByRadix";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import EmptyListSection from "@/admin/components/partials/EmptyListSection";
import { ProductDataGlobal, Variant } from "@/types/productsTypes";
import { Color , Fit , Material , Size  } from "@/types/inventoryTypes";
import { Tag } from "@/types/tagsTypes";
import ProductBasicInfo from "./compos/editPartials/ProductBasicInfo";


export default  function Edit({
    product,
    inventoryOptions,
    tagSuggestions,
}: EditProductProps){

    return (
        <EditContent  
           product={product}
          inventoryOptions={inventoryOptions}
          tagSuggestions={tagSuggestions}
        
        />
    )
}


interface EditProductProps {
    product: ProductDataGlobal;
    inventoryOptions: {
        colors: Color[];
        sizes: Size[];
        fits: Fit[];
        materials: Material[];
    };
    tagSuggestions: Tag[];
}

function EditContent({
    product,
    inventoryOptions,
    tagSuggestions,
}: EditProductProps) {
    // backend data
    const [productData, setProductData] = useState<ProductDataGlobal>(product);
    const [inventoryOptionsState, setInventoryOptionsState] =
        useState(inventoryOptions);
    const [tagSuggestionsState, setTagSuggestionsState] =
        useState(tagSuggestions);

    const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
    const [editingVariantId, setEditingVariantId] = useState<number | null>(
        null
    );
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [variantToDelete, setVariantToDelete] = useState<number | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const [basicInfoForm, setBasicInfoForm] = useState({
        name: product.name,
        brand: product.brand,
        price: product.price,
        description: product.description,
        category: product.category,
        gender: product.gender,
        isFeatured: product.isFeatured,
        free_shipping: product.free_shipping,
        thumbnail: product.thumbnail,
        tags: product.tags,
    });

    const [variantForm, setVariantForm] = useState<Variant | null>(null);

    useEffect(() => {
        if (hasUnsavedChanges && !showToast) {
            setShowToast(true);
        }
    }, [hasUnsavedChanges, showToast]);

    const handleEditBasicInfo = () => {
        setIsEditingBasicInfo(true);
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
                            tagSuggestions={tagSuggestions}
                            handleEditBasicInfo={handleEditBasicInfo}
                            handleThumbnailUpload={handleThumbnailUpload}
                            setBasicInfoForm={setBasicInfoForm}
                        />

                     <VariantsSections  
                     
                     
                     /> 

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

Edit.layout = (page: any) => <AdminLayout children={page} />;
