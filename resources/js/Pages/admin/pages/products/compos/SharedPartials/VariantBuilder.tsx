

import EmptyListSection from "@/admin/components/partials/EmptyListSection";
import { useProductDataCtx } from "@/contextHooks/sharedhooks/useProductDataCtx";
import { Color, Cover, FashionOptions, Size } from "@/types/inventoryTypes";
import { ImagePreviewItem } from "@/types/mediaTypes";
import { FashionProduct, FashionVariant } from "@/types/productsTypes";
import { set } from "lodash";
import { Plus, Trash2, Edit2, AlertCircle, Package2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";


// Preset data
const PRESET_SIZES: Size[] = [
  { id: 1, name: "XS" },
  { id: 2, name: "S" },
  { id: 3, name: "M" },
  { id: 4, name: "L" },
  { id: 5, name: "XL" },
  { id: 6, name: "XXL" },
];


const PRESET_COLORS : Color[] = [
    { id: 1, name: "Black", hex: "#000000" },
    { id: 2, name: "White", hex: "#FFFFFF" },
    { id: 3, name: "Red", hex: "#EF4444" },
    { id: 4, name: "Blue", hex: "#3B82F6" },
  ]
const VariantBuilder = () => {

  const  {basicInfoForm  ,  setBasicInfoForm , nicheOptionsState } = useProductDataCtx()
  const fashionForm = basicInfoForm as FashionProduct;
  const fashionOptions = nicheOptionsState  as FashionOptions ;
  const [savedVariants, setSavedVariants] = useState<FashionVariant[]>(fashionForm.variants as FashionVariant[] || []);

  const [editingVariant, setEditingVariant] = useState<FashionVariant | null>(null);
  const [availableColors, setAvailableColors] = useState<Color[]>(fashionOptions?.colors  ?? PRESET_COLORS);
  const [availableSizes] = useState<Size[]>(fashionOptions?.sizes  ?? PRESET_SIZES);
  const [previewColor, setPreviewColor] = useState<Color | null>(null);
  // for scrolling to view the form once add variant clicked 
  const addVariantFormRef = useRef<HTMLDivElement | null>(null)

  if (!basicInfoForm || basicInfoForm.niche !== "fashion") return null;
  

  useEffect(() => {
    setBasicInfoForm({
      ...basicInfoForm,
      variants: savedVariants,
    });
  }, [savedVariants]);


  const startNewVariant = () => {
    console.log('scroll') 
    if(addVariantFormRef.current) addVariantFormRef.current?.scrollIntoView({ behavior: "smooth" })
    const newVariant: FashionVariant = {
      niche: "fashion",
      id: Date.now().toString(),
      attributes: { color: null, sizes: [], covers: [] },
      quantity: 0,
    };
    setEditingVariant(newVariant);

  };

  
  const updateVariantColor = (color: Color) => {
    if (!editingVariant) return;
    setEditingVariant({
      ...editingVariant,
      attributes: { ...editingVariant.attributes, color },
    });
  };

  const toggleVariantSize = (size: Size) => {
    if (!editingVariant) return;
    
    const hasSize = editingVariant.attributes.sizes.some(s => s.id === size.id);
    const newSizes = hasSize
      ? editingVariant.attributes.sizes.filter(s => s.id !== size.id)
      : [...editingVariant.attributes.sizes, size];
    
    setEditingVariant({
      ...editingVariant,
      attributes: { ...editingVariant.attributes, sizes: newSizes },
    });
  };

  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingVariant) return;
    
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newCovers: ImagePreviewItem[] = Array.from(files).map((file) => ({
      id: v4(),
      url: URL.createObjectURL(file),
      file: file,
    }));

    setEditingVariant({
      ...editingVariant,
      attributes: {
        ...editingVariant.attributes,
        covers: [...editingVariant.attributes.covers, ...newCovers],
      },
    });

    e.target.value = "";
  };

  const removeCover = (coverId: string) => {
    if (!editingVariant) return;
     
    const coverToRemove : (Cover | ImagePreviewItem) | undefined = editingVariant.attributes.covers.find(c => c.id === coverId);
    if(!coverToRemove) return;

    if("url" in coverToRemove && coverToRemove.url!.startsWith("blob:")){
        URL.revokeObjectURL(coverToRemove.url!);
    }
    

    setEditingVariant({
      ...editingVariant,
      attributes: {
        ...editingVariant.attributes,
        covers: editingVariant.attributes.covers.filter(c => c.id !== coverId),
      },
    });
  };

  const updateQuantity = (quantity: number) => {
    if (!editingVariant) return;
    setEditingVariant({ ...editingVariant, quantity });
  };

  const handleAddColor = () => {
    if (!previewColor) return;
    setAvailableColors([...availableColors, previewColor]);
    setPreviewColor(null);
  };

  const getValidationErrors = () => {
    if (!editingVariant) return [];
    const errors = [];
    
    if (!editingVariant.attributes.color) {
      errors.push("Color is required");
    }
    if (editingVariant.attributes.sizes.length === 0) {
      errors.push("At least one size is required");
    }
    
    return errors;
  };

  const canSave = () => {
    return getValidationErrors().length === 0;
  };

  const saveVariant = () => {
    if (!editingVariant || !canSave()) return;
    
    const existingIndex = savedVariants.findIndex(v => v.id === editingVariant.id);
    
    if (existingIndex >= 0) {
      const updated = [...savedVariants];
      updated[existingIndex] = editingVariant;
      setSavedVariants(updated);
    } else {
      setSavedVariants([...savedVariants, editingVariant]);
    }
    
    setEditingVariant(null);
  };

  const cancelEdit = () => {
    setEditingVariant(null);
  };

  const validationErrors = getValidationErrors();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Product Variants</h2>
        {!editingVariant && (
          <button
            onClick={startNewVariant}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
          >
            <Plus size={18} /> Add Variant
          </button>
        )}
      </div>

      {/* Saved Variants Preview */}
      {savedVariants.length > 0 && (
         <VariantPreviewList  {...{setSavedVariants ,  setEditingVariant , savedVariants }} />
      )}

      {/* Editing Form */}
      {editingVariant && (
        <div ref={addVariantFormRef} className="p-6 border-2 border-blue-200 rounded-xl bg-blue-50/30 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-700">
              {savedVariants.some(v => v.id === editingVariant.id) ? "Edit Variant" : "New Variant"}
            </h3>
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-red-800">Please complete the following:</p>
                  <ul className="text-sm text-red-700 list-disc list-inside space-y-0.5">
                    {validationErrors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Colors */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">
              Color <span className="text-red-500">*</span>
            </label>

            <div className="flex flex-wrap gap-4">
              {availableColors.map((color) => {
                const isCurrent = editingVariant.attributes.color?.hex === color.hex;

                return (
                  <div className="relative w-10 h-10 rounded-full" key={color.id}>
                    <button
                      style={{ backgroundColor: color.hex }}
                      className={`w-full h-full rounded-full ring-2 ring-slate-400 transition-all duration-200 hover:scale-110 shadow-sm ${
                        isCurrent
                          ? "scale-125 ring-4 ring-blue-500"
                          : editingVariant.attributes.color
                          ? "opacity-40"
                          : ""
                      }`}
                      type="button"
                      onClick={() => updateVariantColor(color)}
                      title={color.name}
                    />

                    {isCurrent && (
                      <span
                        className="pointer-events-none absolute top-1/2 left-1/2"
                        style={{
                          width: "60%",
                          height: "60%",
                          borderRadius: "50%",
                          border: "3px solid",
                          borderColor:
                            color.hex.toLowerCase() === "#ffffff" ||
                            color.hex.toLowerCase() === "white"
                              ? "black"
                              : "white",
                          transform: "translate(-50%, -50%)",
                          boxSizing: "border-box",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 mt-4">
              {previewColor && (
                <div
                  className="w-12 h-12 rounded-full ring-4 ring-purple-500 shadow-md transition-transform duration-200"
                  style={{ backgroundColor: previewColor.hex }}
                  title="Preview color"
                />
              )}

              <div
                onClick={() => document.getElementById(`custom-color-input`)?.click()}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 flex items-center justify-center text-white text-2xl font-bold ring-2 ring-slate-300 hover:ring-slate-400 shadow-sm transition-all duration-200 hover:scale-110 cursor-pointer"
              >
                +
                <input
                  id={`custom-color-input`}
                  type="color"
                  className="absolute opacity-0 pointer-events-none"
                  onChange={(e) => {
                    setPreviewColor({
                      id: Date.now(),
                      name: "Custom",
                      hex: e.target.value,
                    });
                  }}
                />
              </div>

              {previewColor && (
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 ring-2 ring-orange-300 transition-colors text-sm font-medium"
                >
                  + Add this color
                </button>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-2">Select one color for this variant</p>
          </div>

          {/* Sizes */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">
              Sizes <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {availableSizes.map((size) => {
                const isSelected = editingVariant.attributes.sizes.some(s => s.id === size.id);
                return (
                  <button
                    type="button"
                    key={size.id}
                    className={`px-5 py-3 rounded-xl border-2 font-medium transition-all duration-200 ${
                      isSelected
                        ? "bg-blue-500 border-blue-500 text-white shadow-md scale-105"
                        : "bg-white/50 border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400 shadow-sm"
                    }`}
                    onClick={() => toggleVariantSize(size)}
                  >
                    {size.name}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-500">Select one or more sizes for this variant</p>
          </div>

          {/* Covers */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">
              Covers <span className="text-slate-400">(optional)</span>
            </label>
            
            {/* Upload Button */}
            <div>
              <input
                type="file"
                id="cover-upload"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="cover-upload"
                className="inline-flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border-2 border-dashed border-slate-300 hover:border-slate-400 cursor-pointer transition-all font-medium"
              >
                <Plus size={18} />
                Upload Images
              </label>
            </div>

            {/* Preview Uploaded Covers */}
            {editingVariant.attributes.covers.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {editingVariant.attributes.covers.map((cover) => (
                  <div
                    key={cover.id}
                    className="relative w-24 h-24 rounded-lg overflow-hidden ring-2 ring-slate-300 shadow-sm group"
                  >
                    <img
                      src={"url" in cover ? cover.url : cover.path}
                      alt="Uploaded cover"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeCover(cover.id as string)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <p className="text-xs text-slate-500">Upload one or more images for this variant</p>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Quantity <span className="text-slate-400">(optional)</span>
            </label>
            <input
              type="number"
              min="0"
              placeholder="Enter quantity (default: 0)"
              value={editingVariant.quantity || ""}
              onChange={(e) => updateQuantity(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={saveVariant}
              disabled={!canSave()}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                canSave()
                  ? "bg-blue-500 text-white hover:bg-blue-600 shadow-sm"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Save Variant
            </button>
            <button
              onClick={cancelEdit}
              className="px-6 py-3 rounded-lg font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!editingVariant && savedVariants.length === 0 && (
        <EmptyListSection label="No variants yet. Click Add Variant to get started."  Icon={Package2} description="" />
      )}
    </div>
  );
};

export default VariantBuilder;



interface VariantPreviewListProps {
    setSavedVariants: React.Dispatch<React.SetStateAction<FashionVariant[]>>;
    setEditingVariant: React.Dispatch<React.SetStateAction<FashionVariant | null>>;
    savedVariants: FashionVariant[];
}

const VariantPreviewList = ({setSavedVariants ,  setEditingVariant , savedVariants }:VariantPreviewListProps) => {
    
    const deleteVariant = (variantId: string) => {
    setSavedVariants(savedVariants.filter(v => v.id !== variantId));
  };

  const editVariant = (variant: FashionVariant) => {
    setEditingVariant({ ...variant });
  };




    return (
         <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Saved Variants</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedVariants.map((variant) => (
              <div
                key={variant.id}
                className="p-4 border-2 border-slate-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Cover Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                    {variant.attributes.covers[0] ? (
                      <img
                        src={"url" in variant.attributes.covers[0] ? variant.attributes.covers[0].url : variant.attributes.covers[0].path}
                        alt="Variant cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                        No cover
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Color:</span>
                      {variant.attributes.color && (
                        <div className="flex items-center gap-1">
                          <div
                            className="w-5 h-5 rounded-full ring-2 ring-slate-300"
                            style={{ backgroundColor: variant.attributes.color.hex }}
                          />
                          <span className="text-xs text-slate-600">{variant.attributes.color.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Sizes:</span>
                      <div className="flex flex-wrap gap-1">
                        {variant.attributes.sizes.map((size) => (
                          <span
                            key={size.id}
                            className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-medium"
                          >
                            {size.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-slate-500">
                      Quantity: <span className="font-medium text-slate-700">{variant.quantity}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200">
                  <button
                    onClick={() => editVariant(variant)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => deleteVariant(variant.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
    )
}