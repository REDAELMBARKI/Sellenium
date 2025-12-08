import TagSection from "@/components/TagInput";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import { useProductDataCtx } from "@/contextHooks/sharedhooks/useProductDataCtx";
import { currentTheme } from "@/data/currentTheme";
import { Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { v4 } from "uuid";




const BaseSharedForm = () => {
    
      const { basicInfoForm, setBasicInfoForm } = useProductDataCtx();
      const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
      const [errors, setErrors] = useState<Record<string, string>>({});
    
      const recentTags = ["Luxury", "Summer", "Floral", "Woody", "Fresh", "Evening", "Citrus", "Spicy", "Oriental", "Casual"];
      
      
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
              {(basicInfoForm.thumbnail || thumbnailPreview) && (
                <div className="relative w-40 h-40 group overflow-hidden rounded-2xl shadow-lg border-2"
                     style={{ borderColor: errors.thumbnail ? '#ef4444' : currentTheme.border }}>
                  <img
                    src={thumbnailPreview ?? basicInfoForm.thumbnail}
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
            <MultiSelectDropdown
              label="Product Type"
              options={Array.isArray(basicInfoForm.category) ? basicInfoForm.category : []}
              selectedValues={Array.isArray(basicInfoForm.category) ? basicInfoForm.category : []}
              onChange={(selected) => setBasicInfoForm({ ...basicInfoForm, category: selected })}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={6}
              value={basicInfoForm.description}
              onChange={(e) => {
                setBasicInfoForm({ ...basicInfoForm, description: e.target.value });
                validateField('description', e.target.value);
              }}
              onBlur={(e) => validateField('description', e.target.value)}
              className="w-full px-5 py-4 rounded-xl font-medium shadow-sm resize-none"
              style={{
                backgroundColor: currentTheme.bg,
                color: currentTheme.text,
                borderWidth: '2px',
                borderColor: errors.description ? '#ef4444' : currentTheme.border
              }}
            />
            {errors.description && <p className="text-red-500 text-sm mt-2">{errors.description}</p>}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
              Tags <span className="text-xs font-normal">(optional)</span>
            </label>
            <TagSection
              tags={(basicInfoForm.tags || []).map(t => t.name)}
              onTagsChange={(tags) => setBasicInfoForm({ ...basicInfoForm, tags: tags.map(name => ({ id: v4(), name })) })}
              suggestions={recentTags}
            />
          </div>
        </div>
    
    </>
}


export default BaseSharedForm ; 