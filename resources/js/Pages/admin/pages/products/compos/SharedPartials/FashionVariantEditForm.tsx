import { SectionHeader } from "@/admin/components/layout/SectionHeader";
import LoadingBlankPage from "@/components/LoadingBlankPage";
import { useEditProductUICtx } from "@/contextHooks/editProductCtxHooks/useEditProductUICtx";
import { useProductDataCtx } from "@/contextHooks/sharedhooks/useProductDataCtx";
import { useNicheCtx } from "@/contextHooks/useNicheCtx";
import { currentTheme } from "@/data/currentTheme";
import { Color, FashionOptions, Fit, InventoryOptions, Material, Size } from "@/types/inventoryTypes";
import { FashionAttributes, FashionVariant, ProductVariant } from "@/types/productsTypes";
import { Check, X, Upload, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidByV4 } from "uuid";




  interface ImageItem {
  file: File;
  url: string;
  id : string
}

export const FashionVariantEditForm = () => {

    
    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);
    
    
    const  {setVariantForm , variantForm ,  productData , setProductData , inventoryOptionsState : inventoryOptions } = useProductDataCtx();
    const {editingVariantId , setEditingVariantId , setHasUnsavedChanges } = useEditProductUICtx()
    if(variantForm?.niche !== 'fashion') return ;
    const formRef = useRef<HTMLDivElement | null>(null)
    const [isFormLoading , setIsFormLoading] = useState(true)
  

    const [imageItemsFileWithPreviewUrl, setImageItemsFileWithPreviewUrl] = useState<ImageItem[]>([]);
    

    //data loading 
    useEffect(() => {
           const isReady =
            variantForm &&
            variantForm.attributes !== undefined &&
            variantForm.quantity !== undefined;


    if(isReady){
        setTimeout(()=> setIsFormLoading(false) , 1000)
    }
    }, [variantForm]);

    const toggleFashionVariantAttribute = <T extends Color | Size | Fit | Material>(
            key: keyof FashionAttributes,
            item: T
        ) => {
            if (!variantForm) return;
       
            console.log(key , 'key')
            console.log(item , 'item')
            const attributes = variantForm.attributes as FashionAttributes;
            const currentItems = attributes[key] as T[] ?? [];

            const exists = currentItems.some((i) => i.id === item.id);
    
            setVariantForm({
                ...variantForm,
                [key]: exists
                    ? currentItems.filter((i) => i.id !== item.id)
                    : [...currentItems, item],
            });
        };
    

    
    const onRemoveImage = (coverId : number) => {
        setVariantForm(prev => {
            if(!prev) return prev ; 

            if(prev.niche !== "fashion" ) return prev

            return {
                ...prev , 
             attributes : {

                    ...prev.attributes , 
                     covers : prev?.attributes?.covers.filter(c =>   Number(c.id) !== coverId)
               
             }
            }
        })
    }

    const onRemovePreviewImage = (id : string) => {
        setImageItemsFileWithPreviewUrl(prev => prev.filter(previewItem => previewItem.id !== id))
    }

    // uploads preview
    useEffect(() => {
        return () => {
            imageItemsFileWithPreviewUrl.forEach(url => URL.revokeObjectURL(url))
        }
    }, [imageItemsFileWithPreviewUrl]);

    const onImageUpload = (e : React.ChangeEvent<HTMLInputElement>) => {
      // give it  a random iid\
      const id = uuidByV4()
      const file  = e.target.files?.[0] ;
      if(!file)  return ;
      const url = URL.createObjectURL(file);
      setImageItemsFileWithPreviewUrl(prev => [...prev , {id ,url  , file}])
       e.target.value = "";
    }
    // end of uploads preview 




    const handleSaveVariant = () => {
        if (!variantForm || editingVariantId === null) return;

        setProductData(prev => {
           
            if(!prev) return  prev ;
            if(prev.niche !== "fashion" ) return prev ; 
            return {
            ...prev ,
            fashionVariants: prev?.fashionVariants?.map((v) =>
                Number(v.id) === Number(editingVariantId) ? (variantForm as FashionVariant) : v
            ),
        }
        });
        setEditingVariantId(null);
        setVariantForm(null);
        setHasUnsavedChanges(true);
    };

    const handleCancelVariant = () => {
        setEditingVariantId(null);
        setVariantForm(null);
    };
   
    const fashionOptions = inventoryOptions as FashionOptions;



    return (
        <> 
           

            {/* Modal Backdrop with Blur */}
            <div  
                ref={formRef}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-4 "
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)' }}
                onClick={handleCancelVariant}
            >    

            {isFormLoading  ? <LoadingBlankPage  containerRef={formRef} /> :
                
                <div 
                    className="w-full sm:w-full   min-h-[100vh] overflow-y-auto rounded-2xl shadow-2xl"
                    style={{ backgroundColor: currentTheme.bg }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div 
                        className="sticky top-0 z-10 flex items-center justify-between p-6 border-b"
                        style={{ 
                            backgroundColor: currentTheme.bg,
                            borderColor: currentTheme.border 
                        }}
                    >
                      
                    <SectionHeader title="Edit Variant #number" description="Update variant details and attributes" />
                    </div>


                    {/* Form Content */}
                    <div className="p-6 space-y-6" 
                    
                    >
                        {/* Images Section */}
                        <div>
                            <label className="block text-sm font-semibold mb-3" style={{ color: currentTheme.text }}>
                                Images
                            </label>
                            <div className="flex flex-wrap gap-3">

                               

                                 {/* real imags from backend */}
                                {variantForm?.attributes.covers?.map((img, idx) => (
                                    <div key={idx} className="relative w-24 h-24 group">
                                        <img
                                            src={img.path}
                                            alt={`Variant ${idx + 1}`}
                                            className="w-full h-full object-cover rounded-lg border-2"
                                            style={{ borderColor: currentTheme.border }}
                                        />
                                        <button
                                            onClick={() => onRemoveImage(Number(img.id))}
                                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}

                                 {/* only previews */}
                                {imageItemsFileWithPreviewUrl.length > 0 && imageItemsFileWithPreviewUrl.map(p => 
            
                                    <div  key={p.id} className="relative w-24 h-24 group">
                                        <img src={p.url} className="w-40 h-40 object-cover rounded-lg border-2" />
                                        
                                        <button
                                            onClick={() => onRemovePreviewImage(p.id)}
                                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
            
                                )}

                                <label 
                                    className="w-24 h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-slate-400 transition-colors"
                                    style={{ borderColor: currentTheme.border }}
                                >
                                    <Upload className="w-6 h-6 text-slate-400 mb-1" />
                                    <span className="text-xs text-slate-500">Upload</span>
                                    <input
                                        type="file"
                                        // accept="image/*"
                                        onChange={onImageUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Quantity Section */}
                        <div>
                            <label className="block text-sm font-semibold mb-3" style={{ color: currentTheme.text }}>
                                Quantity in Stock
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={variantForm?.quantity}
                                onChange={(e) => setVariantForm({ ...variantForm, quantity: Number(e.target.value) })}
                                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all"
                                style={{ 
                                    borderColor: currentTheme.border,
                                    color: currentTheme.text
                                }}
                                onFocus={(e) => e.target.style.borderColor = currentTheme.accent}
                                onBlur={(e) => e.target.style.borderColor = currentTheme.border}
                            />
                        </div>

                        {/* Colors Section */}
                        <div>
                            <label className="block text-sm font-semibold mb-3" style={{ color: currentTheme.text }}>
                                Colors
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {fashionOptions?.colors?.map((color) => {
                                    const isSelected = variantForm?.attributes?.color?.some((c) => Number(c.id) === Number(color.id));
                                    return (
                                        <button
                                            key={color.id}
                                            type="button"
                                            onClick={() => toggleFashionVariantAttribute("color", color)}
                                            className="relative group"
                                            title={color.name}
                                        >
                                            <div
                                                className="w-12 h-12 rounded-lg transition-all shadow-sm hover:shadow-md"
                                                style={{
                                                    backgroundColor: color.hex,
                                                    border: isSelected
                                                        ? `3px solid ${currentTheme.accent}`
                                                        : `2px solid ${currentTheme.border}`,
                                                }}
                                            />
                                            {isSelected && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Check className="w-5 h-5 text-white drop-shadow-lg" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Sizes Section */}
                        <div>
                            <label className="block text-sm font-semibold mb-3" style={{ color: currentTheme.text }}>
                                Sizes
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {fashionOptions?.sizes?.map((size) => {
                                    const isSelected = variantForm?.sizes?.some((s) => Number(s.id) === Number(size.id));
                                    return (
                                        <button
                                            key={size.id}
                                            type="button"
                                            onClick={() => toggleFashionVariantAttribute("sizes", size)}
                                            className="px-4 py-2.5 flex items-center gap-2 rounded-lg transition-all duration-150"
                                            style={{
                                                backgroundColor: isSelected ? `${currentTheme.accent}15` : 'transparent',
                                                border: `2px solid ${isSelected ? currentTheme.accent : currentTheme.border}`,
                                                color: currentTheme.text
                                            }}
                                        >
                                            <div 
                                                className="w-4 h-4 rounded flex items-center justify-center transition-all"
                                                style={{
                                                    backgroundColor: isSelected ? currentTheme.accent : 'transparent',
                                                    borderWidth: '2px',
                                                    borderColor: isSelected ? currentTheme.accent : currentTheme.border
                                                }}
                                            >
                                                {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                                            </div>
                                            <span className="font-medium">{size.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Fits Section */}
                        <div>
                            <label className="block text-sm font-semibold mb-3" style={{ color: currentTheme.text }}>
                                Fit Type
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {fashionOptions?.fits?.map((fit) => {
                                    const isSelected = variantForm?.attributes?.fits?.some((f) => Number(f.id) === Number(fit.id));
                                    return (
                                        <button
                                            key={fit.id}
                                            type="button"
                                            onClick={() => toggleFashionVariantAttribute("fits", fit)}
                                            className="px-4 py-2.5 flex items-center gap-2 rounded-lg transition-all duration-150"
                                            style={{
                                                backgroundColor: isSelected ? `${currentTheme.accent}15` : 'transparent',
                                                border: `2px solid ${isSelected ? currentTheme.accent : currentTheme.border}`,
                                                color: currentTheme.text
                                            }}
                                        >
                                            <div 
                                                className="w-4 h-4 rounded flex items-center justify-center transition-all"
                                                style={{
                                                    backgroundColor: isSelected ? currentTheme.accent : 'transparent',
                                                    borderWidth: '2px',
                                                    borderColor: isSelected ? currentTheme.accent : currentTheme.border
                                                }}
                                            >
                                                {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                                            </div>
                                            <span className="font-medium">{fit.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Materials Section */}
                        <div>
                            <label className="block text-sm font-semibold mb-3" style={{ color: currentTheme.text }}>
                                Materials
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {fashionOptions?.materials?.map((material) => {
                                    const isSelected = variantForm?.attributes?.materials?.some((m) => Number(m.id) === Number(material.id));
                                    return (
                                        <button
                                            key={material.id}
                                            type="button"
                                            onClick={() => toggleFashionVariantAttribute("materials", material)}
                                            className="px-4 py-2.5 flex items-center gap-2 rounded-lg transition-all duration-150"
                                            style={{
                                                backgroundColor: isSelected ? `${currentTheme.accent}15` : 'transparent',
                                                border: `2px solid ${isSelected ? currentTheme.accent : currentTheme.border}`,
                                                color: currentTheme.text
                                            }}
                                        >
                                            <div 
                                                className="w-4 h-4 rounded flex items-center justify-center transition-all"
                                                style={{
                                                    backgroundColor: isSelected ? currentTheme.accent : 'transparent',
                                                    borderWidth: '2px',
                                                    borderColor: isSelected ? currentTheme.accent : currentTheme.border
                                                }}
                                            >
                                                {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                                            </div>
                                            <span className="font-medium">{material.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div 
                        className="sticky bottom-0 flex items-center justify-end gap-3 p-6 border-t"
                        style={{ 
                            backgroundColor: currentTheme.bg,
                            borderColor: currentTheme.border 
                        }}
                    >
                        <button
                            onClick={handleCancelVariant}
                            className="px-6 py-2.5 rounded-lg border-2 font-semibold transition-all"
                            style={{
                                borderColor: currentTheme.border,
                                color: currentTheme.text,
                                backgroundColor: currentTheme.bg
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveVariant}
                            className="px-6 py-2.5 rounded-lg font-semibold text-white transition-all shadow-sm hover:shadow-md"
                            style={{ backgroundColor: currentTheme.buttonPrimary }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.buttonHover}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = currentTheme.buttonPrimary}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            }
            </div>
        </>
    );
};

