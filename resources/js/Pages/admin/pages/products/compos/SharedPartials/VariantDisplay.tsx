import { Edit2, Trash2, Package } from "lucide-react";
import { useState } from "react";
import { VariantEditForm } from "./VariantEditForm";
import { Variant } from "@/types/productsTypes";
import { useEditProductDataCtx } from "@/contextHooks/editProductCtxHooks/useEditProductDataCtx";
import { currentTheme } from "@/data/currentTheme";
import { useEditProductUICtx } from "@/contextHooks/editProductCtxHooks/useEditProductUICtx";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";

interface VariantDisplayProps {
    variant: Variant;
   
}


export const VariantDisplay = ({ variant}: VariantDisplayProps) => {
    const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
    const { inventoryOptionsState  , setVariantForm , variantForm , setVariantToDelete } = useEditProductDataCtx();
    const {setEditingVariantId , setDeleteModalOpen , deleteModalOpen  } =  useEditProductUICtx()
    
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
    return (
        <>
            <div 
                    className=" rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 max-w-xs w-full flex flex-col p-4" 
                    style={{ 
                        backgroundColor: currentTheme.bg,
                        border: `1px solid ${currentTheme.border}`
                    }}
                >
                    
                    {/* Image Section - Centered Preview */}
                    <div 
                       className=" h-48 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden rounded-lg mb-4"
                     >
                        {variant.covers.length > 0 ? (
                            <img
                                src={`/images/perpel.jpg`}
                                alt={`Variant ${variant.id}`}
                                className="max-h-full max-w-full object-contain" 
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="text-center space-y-3">
                                    <div 
                                        className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: currentTheme.buttonSecondary }}
                                    >
                                        <Package className="w-8 h-8" style={{ color: currentTheme.accent }} />
                                    </div>
                                    <p className="text-slate-500 text-sm font-medium">No Image Available</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="space-y-3 flex-1">
                        
                        {/* Header with Variant ID and Quantity */}
                        <div 
                            className="flex items-start justify-between pb-2 border-b" 
                            style={{ borderColor: currentTheme.border }}
                        >
                            <div>
                                <h3 className="text-base font-bold" style={{ color: currentTheme.text }}>
                                    Variant #{variant.id}
                                </h3>
                                <p className="text-xs text-slate-500">Product Variant</p>
                            </div>
                            <div className="text-right">
                                <div 
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                                    style={{ backgroundColor: currentTheme.buttonSecondary }}
                                >
                                    <Package className="w-3 h-3 text-slate-600" />
                                    <span className="text-sm font-bold" style={{ color: currentTheme.text }}>
                                        {variant.quantity}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">In Stock</p>
                            </div>
                        </div>

                        {/* Colors Section */}
                        {variant.colors.length > 0 && (
                            <div 
                                className="border-2 border-dashed rounded-lg p-3 text-center"
                                style={{ 
                                    backgroundColor: currentTheme.buttonSecondary,
                                    borderColor: currentTheme.border
                                }}
                            >
                                <h4 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: currentTheme.text }}>
                                    Colors
                                </h4>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {variant.colors.map((color) => (
                                        <div
                                            key={color.id}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg border"
                                            style={{ 
                                                backgroundColor: currentTheme.bg,
                                                borderColor: currentTheme.border
                                            }}
                                        >
                                            <div
                                                className="w-6 h-6 rounded-full border-2 shadow-sm"
                                                style={{ 
                                                    backgroundColor: color.hex,
                                                    borderColor: '#ffffff'
                                                }}
                                            />
                                            <span className="text-xs font-semibold" style={{ color: currentTheme.text }}>
                                                {color.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sizes Section */}
                        {variant.sizes.length > 0 && (
                            <div 
                                className="border-2 border-dashed rounded-lg p-3 text-center"
                                style={{ 
                                    backgroundColor: currentTheme.buttonSecondary,
                                    borderColor: currentTheme.border
                                }}
                            >
                                <h4 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: currentTheme.text }}>
                                    Sizes
                                </h4>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {variant.sizes.map((size) => (
                                        <div
                                            key={size.id}
                                            className="flex items-center justify-center w-10 h-10 text-white rounded-lg font-bold text-sm shadow-sm"
                                            style={{ backgroundColor: currentTheme.buttonPrimary }}
                                        >
                                            {size.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Fits Section */}
                        {variant.fits.length > 0 && (
                            <div 
                                className="border-2 border-dashed rounded-lg p-3 text-center"
                                style={{ 
                                    backgroundColor: currentTheme.buttonSecondary,
                                    borderColor: currentTheme.border
                                }}
                            >
                                <h4 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: currentTheme.text }}>
                                    Fit Type
                                </h4>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {variant.fits.map((fit) => (
                                        <div
                                            key={fit.id}
                                            className="px-3 py-2 text-white rounded-lg text-xs font-semibold shadow-sm"
                                            style={{ backgroundColor: currentTheme.accent }}
                                        >
                                            {fit.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Materials Section */}
                        {variant.materials.length > 0 && (
                            <div 
                                className="border-2 border-dashed rounded-lg p-3 text-center"
                                style={{ 
                                    backgroundColor: currentTheme.buttonSecondary,
                                    borderColor: currentTheme.border
                                }}
                            >
                                <h4 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: currentTheme.text }}>
                                    Materials
                                </h4>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {variant.materials.map((material) => (
                                        <div
                                            key={material.id}
                                            className="px-3 py-2 text-white rounded-lg text-xs font-semibold shadow-sm"
                                            style={{ backgroundColor: currentTheme.accent }}
                                        >
                                            {material.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div 
                            className="flex gap-2 pt-3 border-t" 
                            style={{ borderColor: currentTheme.border }}
                        >
                            <button
                                onClick={() =>  {
                                     handleEditVariant(variant)
                                     setIsFormModalOpen(true)
                                }
                            }
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-white rounded-lg transition-all font-semibold text-sm shadow-sm hover:shadow-md"
                                style={{ backgroundColor: currentTheme.buttonPrimary }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.buttonHover}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = currentTheme.buttonPrimary}
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit
                            </button>

                            <button
                                onClick={() => handleDeleteVariantClick(variant.id)}
                                className="flex items-center justify-center gap-2 px-3 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all font-semibold text-sm shadow-sm hover:shadow-md"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

            {isFormModalOpen && (
                <VariantEditForm 
                   
                    key={variant.id}
                    VariantForm={variantForm}
                    inventoryOptions={inventoryOptionsState}
                    onSave={() => setIsFormModalOpen(false)}
                    onCancel={() => setIsFormModalOpen(false)}
                />
            )}


           <DeleteConfirmationModal isOpen={deleteModalOpen}  name="variant" entityType="variant" onClose={() => setDeleteModalOpen(false)} onConfirm={() => handleConfirmDelete()}/>
           
        </>
    );
};