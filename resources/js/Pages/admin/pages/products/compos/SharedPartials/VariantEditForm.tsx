import { Color, Fit, InventoryOptions, Material, Size } from "@/types/inventoryTypes";
import { Variant } from "@/types/productsTypes";
import { Check, X, Upload, Trash2 } from "lucide-react";


interface VariantEditFormProps {
    variant: Variant;
    inventoryOptions: InventoryOptions;
    onSave: () => void;
    onCancel: () => void;
    onUpdateVariant: (variant: Variant) => void;
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: (idx: number) => void;
}

export const VariantEditForm = ({
    variant,
    inventoryOptions,
    onSave,
    onCancel,
    onUpdateVariant,
    onImageUpload,
    onRemoveImage,
}: VariantEditFormProps) => {
    const toggleAttribute = (
        key: "colors" | "sizes" | "fits" | "materials",
        item: Color | Size | Fit | Material
    ) => {
        const currentList = variant[key];
        const exists = currentList.some((existing) => existing.id === item.id);
        const newList = exists
            ? currentList.filter((existing) => existing.id !== item.id)
            : [...currentList, item];
        
        onUpdateVariant({ ...variant, [key]: newList as any });
    };

    return (
        <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">
                    Variant #{variant.id}
                </h3>

                <div className="flex gap-2">
                    <button
                        onClick={onSave}
                        className="flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                        <Check className="w-3 h-3" />
                        Save
                    </button>
                    <button
                        onClick={onCancel}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                        <X className="w-3 h-3" />
                        Cancel
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
                            <div key={idx} className="relative w-20 h-20 group">
                                <img
                                    src={img}
                                    alt={`Variant ${idx + 1}`}
                                    className="w-full h-full object-cover rounded-lg border border-slate-300"
                                />
                                <button
                                    onClick={() => onRemoveImage(idx)}
                                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        <label className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-slate-400 transition-colors">
                            <Upload className="w-5 h-5 text-slate-400" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={onImageUpload}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Color
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {inventoryOptions.colors.map((color) => {
                            const isSelected = variant.colors.some((c) => c.id === color.id);
                            return (
                                <button
                                    key={color.id}
                                    type="button"
                                    onClick={() => toggleAttribute("colors", color)}
                                    className="relative w-10 h-10 rounded-full transition-all"
                                    style={{
                                        backgroundColor: color.hex,
                                        border: isSelected
                                            ? "3px solid #1e293b"
                                            : "2px solid #cbd5e1",
                                    }}
                                    title={color.name}
                                />
                            );
                        })}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Size
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {inventoryOptions.sizes.map((size) => {
                            const isSelected = variant.sizes.some((s) => s.id === size.id);
                            return (
                                <button
                                    key={size.id}
                                    type="button"
                                    onClick={() => toggleAttribute("sizes", size)}
                                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                                        isSelected
                                            ? "bg-blue-500 text-white border-blue-600"
                                            : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                                    }`}
                                >
                                    {size.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Fit
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {inventoryOptions.fits.map((fit) => {
                            const isSelected = variant.fits.some((f) => f.id === fit.id);
                            return (
                                <button
                                    key={fit.id}
                                    type="button"
                                    onClick={() => toggleAttribute("fits", fit)}
                                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                                        isSelected
                                            ? "bg-green-500 text-white border-green-600"
                                            : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                                    }`}
                                >
                                    {fit.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Material
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {inventoryOptions.materials.map((material) => {
                            const isSelected = variant.materials.some((m) => m.id === material.id);
                            return (
                                <button
                                    key={material.id}
                                    type="button"
                                    onClick={() => toggleAttribute("materials", material)}
                                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                                        isSelected
                                            ? "bg-amber-500 text-white border-amber-600"
                                            : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                                    }`}
                                >
                                    {material.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Quantity
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={variant.quantity}
                        onChange={(e) =>
                            onUpdateVariant({ ...variant, quantity: Number(e.target.value) })
                        }
                        className="w-32 p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                </div>
            </div>
        </div>
    );
};
