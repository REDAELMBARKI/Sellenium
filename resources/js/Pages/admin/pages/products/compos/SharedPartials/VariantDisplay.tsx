import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { VariantEditForm } from "./VariantEditForm";
import { Variant } from "@/types/productsTypes";



interface VariantDisplayProps {
    variant: Variant;
    onEdit: (variant: Variant) => void;
    onDelete: (id: number) => void;
}

export const VariantDisplay = ({ variant, onEdit, onDelete }: VariantDisplayProps) => {
    const [isFormModalOpen , setIsFormModalOpen] = useState<boolean>(false)
    return (<>

        {   isFormModalOpen ? <VariantEditForm  
                                key={variant.id}
                                variant={variant}
                                inventoryOptions={inventoryOptions}
                                onSave={onSaveVariant}
                                onCancel={onCancelVariant}
                                onUpdateVariant={onUpdateVariantForm}
                                onImageUpload={onImageUpload}
                                onRemoveImage={onRemoveImage}
                                      
                                /> 
        :
        ( <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">
                    Variant #{variant.id}
                </h3>

                <div className="flex gap-2">
                    <button
                        onClick={() => {
                                setIsFormModalOpen(true)
                                onEdit(variant)
                                }
                       }
                            
                        className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                        <Edit2 className="w-3 h-3" />
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(variant.id)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                        <Trash2 className="w-3 h-3" />
                        Delete
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Images
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {variant.images.map((img, idx) => (
                            <div key={idx} className="relative w-20 h-20">
                                <img
                                    src={img}
                                    alt={`Variant ${idx + 1}`}
                                    className="w-full h-full object-cover rounded-lg border border-slate-300"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Color
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {variant.colors.map((color) => (
                            <div key={color.id} className="flex items-center gap-2">
                                <div
                                    className="w-8 h-8 rounded-full border-2 border-slate-300"
                                    style={{ backgroundColor: color.hex }}
                                />
                                <span className="text-sm text-slate-700">{color.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Size
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {variant.sizes.map((size) => (
                            <span
                                key={size.id}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                            >
                                {size.name}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Fit
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {variant.fits.map((fit) => (
                            <span
                                key={fit.id}
                                className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium"
                            >
                                {fit.name}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Material
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {variant.materials.map((material) => (
                            <span
                                key={material.id}
                                className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium"
                            >
                                {material.name}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Quantity
                    </label>
                    <p className="text-slate-900 font-medium">{variant.quantity} units</p>
                </div>
            </div>
        </div>
        
        )}

        </>
    );
};
