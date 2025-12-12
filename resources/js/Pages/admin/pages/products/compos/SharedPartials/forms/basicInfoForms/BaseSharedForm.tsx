import TagSection from "@/components/TagInput";
import CustomSelect from "@/components/ui/CustomSelect";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import MultiSelectDropdownForObject from "@/components/ui/MultiSelectDropdownForObject";
import { useProductDataCtx } from "@/contextHooks/sharedhooks/useProductDataCtx";
import { useColorsCtx } from "@/contextHooks/useColorsCtx";
import { Category } from "@/types/inventoryTypes";
import { Description } from "@radix-ui/react-dialog";
import { Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { v4 } from "uuid";




const BaseSharedForm = () => {
    
      const { basicInfoForm, setBasicInfoForm } = useProductDataCtx();
      const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
      const [errors, setErrors] = useState<Record<string, string>>({});
      const {currentTheme} = useColorsCtx()
      
    
      
      
      useEffect(() => {
          return () => {
            if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
          };
        }, [thumbnailPreview]);
    
    const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setThumbnailPreview(url);
    validateField('thumbnail', url);
  };


    const validateField = (field: string, value: any) => {
    const newErrors = { ...errors };

    if (field === 'name' && !value?.trim()) {
      newErrors.name = 'Product name is required';
    } else if (field === 'name') {
      delete newErrors.name;
    }

    if (field === 'brand' && !value?.trim()) {
      newErrors.brand = 'Brand is required';
    } else if (field === 'brand') {
      delete newErrors.brand;
    }

    if (field === 'price' && (!value || parseFloat(value) <= 0)) {
      newErrors.price = 'Valid price is required';
    } else if (field === 'price') {
      delete newErrors.price;
    }

    if (field === 'description' && !value?.trim()) {
      newErrors.description = 'Description is required';
    } else if (field === 'description') {
      delete newErrors.description;
    }

    if (field === 'thumbnail' && !value && !thumbnailPreview) {
      newErrors.thumbnail = 'Product thumbnail is required';
    } else if (field === 'thumbnail') {
      delete newErrors.thumbnail;
    }

    setErrors(newErrors);
    };


    return <>
    <div className="space-y-6 pb-6 border-b" style={{ borderColor: currentTheme.border }}>
          <h2 className="text-2xl font-bold uppercase tracking-wide" style={{ color: currentTheme.text }}>
            Base Information
          </h2>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
              Thumbnail <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-6">
              {(Object.keys(basicInfoForm.thumbnail).length > 0 || thumbnailPreview) && (
                <div className="relative w-40 h-40 group overflow-hidden rounded-2xl shadow-lg border-2"
                     style={{ borderColor: errors.thumbnail ? '#ef4444' : currentTheme.border }}>
                  <img
                    src={"path" in basicInfoForm.thumbnail ? basicInfoForm.thumbnail.path : thumbnailPreview!}
                    alt="Product thumbnail"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:blur-sm"
                  />
                  <button
                    onClick={() => {
                      setThumbnailPreview(null);
                      validateField('thumbnail', null);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-white/70 hover:bg-white shadow-lg transition-all"
                  >
                    <X className="w-5 h-5 text-black" />
                  </button>
                </div>
              )}
              <label className="flex items-center gap-3 px-6 py-3 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 shadow-md font-semibold"
                     style={{ backgroundColor: currentTheme.buttonSecondary, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}>
                <Upload className="w-6 h-6" />
                Upload Image
                <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
              </label>
            </div>
            {errors.thumbnail && <p className="text-red-500 text-sm mt-2">{errors.thumbnail}</p>}
          </div>

          {/* Name, Brand */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={basicInfoForm.name}
                onChange={(e) => {
                  setBasicInfoForm({ ...basicInfoForm, name: e.target.value });
                  validateField('name', e.target.value);
                }}
                onBlur={(e) => validateField('name', e.target.value)}
                className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"
                style={{
                  backgroundColor: currentTheme.bg,
                  color: currentTheme.text,
                  borderWidth: '2px',
                  borderColor: errors.name ? '#ef4444' : currentTheme.border
                }}
              />
              {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
                Brand <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={basicInfoForm.brand}
                onChange={(e) => {
                  setBasicInfoForm({ ...basicInfoForm, brand: e.target.value });
                  validateField('brand', e.target.value);
                }}
                onBlur={(e) => validateField('brand', e.target.value)}
                className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"
                style={{
                  backgroundColor: currentTheme.bg,
                  color: currentTheme.text,
                  borderWidth: '2px',
                  borderColor: errors.brand ? '#ef4444' : currentTheme.border
                }}
              />
              {errors.brand && <p className="text-red-500 text-sm mt-2">{errors.brand}</p>}
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={basicInfoForm.price}
                onChange={(e) => {
                  setBasicInfoForm({ ...basicInfoForm, price: e.target.value });
                  validateField('price', e.target.value);
                }}
                onBlur={(e) => validateField('price', e.target.value)}
                className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"
                style={{
                  backgroundColor: currentTheme.bg,
                  color: currentTheme.text,
                  borderWidth: '2px',
                  borderColor: errors.price ? '#ef4444' : currentTheme.border
                }}
              />
              {errors.price && <p className="text-red-500 text-sm mt-2">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
                Compare at Price <span className="text-xs font-normal">(optional)</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={basicInfoForm.compareAtPrice || ''}
                onChange={(e) => setBasicInfoForm({ ...basicInfoForm, compareAtPrice: e.target.value })}
                className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"
                style={{ backgroundColor: currentTheme.bg, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
                Cost Price <span className="text-xs font-normal">(optional)</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={basicInfoForm.costPrice || ''}
                onChange={(e) => setBasicInfoForm({ ...basicInfoForm, costPrice: e.target.value })}
                className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"
                style={{ backgroundColor: currentTheme.bg, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
              Category
            </label>
            <MultiSelectDropdownForObject
              label="Product Type"
              options={Array.isArray(basicInfoForm.category) ? basicInfoForm.category : []}
              selectedValues={Array.isArray(basicInfoForm.category) ? basicInfoForm.category : []}
              onChange={(selected) => setBasicInfoForm({ ...basicInfoForm, category: selected as Category[] })}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
              Description <span className="text-red-500">*</span>
            </label>
            <ReactQuill
              theme="snow"
               onBlur={(previousRange, source, editor) => {
                const content = editor.getText(); // plain text version
                validateField('description', content);
              }}
              value={basicInfoForm.description}
              onChange={(value) => {
                setBasicInfoForm({ ...basicInfoForm, description: value });
                validateField('description',value);
              }}
              className="rounded-xl overflow-hidden shadow-sm border border-gray-300"

              placeholder="Write your description here..."
              modules={{
                toolbar: [
                  ["bold", "italic", "underline", "strike"],
                  [{ header: [1, 2, 3, false] }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  [{ color: [] }, { background: [] }], // <-- color and highlight
                  ["clean"],
                ],
              }}
            />
            {errors.description && <p className="text-red-500 text-sm mt-2">{errors.description}</p>}
          </div>
          


          {/* stock  */}

        <div>
          <label
            className="block text-sm font-bold mb-4 uppercase tracking-wide"
            style={{ color: currentTheme.text }}
          >
            Stock Quantity
          </label>

          <div className="grid grid-col-3 gap-3">
 

                 {/* Quick Select */}

            <div className="relative ">
              <CustomSelect 
             
             value={basicInfoForm.stockQuantity ?? 5} options={[{value : "5" , label : "5" } , {value : "10" , label : "10"} , {value : "20" , label : "20"}]}  
             placeholder="select a stock "
             onChange={(value)=> {
              setBasicInfoForm({
                  ...basicInfoForm,
                  stockQuantity: value ,
                })
            } } />
            </div>


            {/* Manual Input */}
            <input
              type="number"
              value={basicInfoForm.stockQuantity || ""}
              onChange={(e) =>
                setBasicInfoForm({
                  ...basicInfoForm,
                  stockQuantity: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
              className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"
              style={{
                backgroundColor: currentTheme.bg,
                color: currentTheme.text,
                borderWidth: "2px",
                borderColor: currentTheme.border,
              }}
            />

      

          </div>
        </div>

        </div>
    
    </>
}


export default BaseSharedForm ; 



