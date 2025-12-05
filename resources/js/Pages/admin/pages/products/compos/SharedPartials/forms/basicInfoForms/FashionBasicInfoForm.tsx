import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import { useProductDataCtx } from "@/contextHooks/sharedhooks/useProductDataCtx";
import { currentTheme } from "@/data/currentTheme";
import { useBasicinfoActions } from "@/functions/useBasicinfoActions";
import { Plus, Tag, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";



const FashionBasicInfoForm = () => {
    const [thumbnailPreview , setThumbnailPreview] = useState<string |null>(null)
    const {basicInfoForm , setBasicInfoForm , tagSuggestionsState : tagSuggestions} = useProductDataCtx()
    const {addTag ,  removeTag ,  tagInputRef , showSuggestions , tagInput , 
            handleTagInputKeyDown  , setShowSuggestions  ,filteredSuggestions , handleAddTagFromInput , handleCancelWithConfirmation , 
            setTagInput , selectedCategory , selectedSuggestionIndex , setSelectedSuggestionIndex , setSelectedCategory
          } =  useBasicinfoActions()

     const handleThumbnailUpload = (e : React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if(!file) return ; 
              const url  = URL.createObjectURL(file)
              setThumbnailPreview(url)
        }


        
  useEffect(() => {
    return () =>  {
      if(thumbnailPreview){
        URL.revokeObjectURL(thumbnailPreview)
      }
    }
  }, [thumbnailPreview]);
  
    
    return (<div className="space-y-8">
      {/* Thumbnail Section */}
      <div>
        <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
          Product Thumbnail
        </label>
        <div className="flex items-center gap-6">
          {basicInfoForm.thumbnail && !thumbnailPreview && (
            <div className="relative group">
              <img
                src={basicInfoForm.thumbnail}
                alt="Product thumbnail"
                className="w-40 h-40 object-cover rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                style={{ borderWidth: '3px', borderColor: currentTheme.border }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-2xl transition-all duration-300"></div>
            </div>
          )}

          {thumbnailPreview && (
            <div className="relative group">
              <img
                src={thumbnailPreview}
                alt="Product thumbnail"
                className="w-40 h-40 object-cover rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                style={{ borderWidth: '3px', borderColor: currentTheme.border }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-2xl transition-all duration-300"></div>
            </div>
          )}
          
          <label 
            className="flex items-center gap-3 px-6 py-3 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 shadow-md font-semibold"
            style={{ 
              backgroundColor: currentTheme.buttonSecondary,
              color: currentTheme.text,
              borderWidth: '2px',
              borderColor: currentTheme.border
            }}
          >
            <Upload className="w-30 h-30" />
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Product Name, Brand, and Price */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
            Product Name
          </label>
          <input
            type="text"
            value={basicInfoForm.name}
            onChange={(e) => setBasicInfoForm({ ...basicInfoForm, name: e.target.value })}
            className="w-full px-5 py-4 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-4 shadow-sm"
            style={{ 
              backgroundColor: currentTheme.bg,
              color: currentTheme.text,
              borderWidth: '2px',
              borderColor: currentTheme.border,
              boxShadow: `0 0 0 0 ${currentTheme.accent}40`
            }}
            onFocus={(e) => {
              e.target.style.borderColor = currentTheme.accent;
              e.target.style.boxShadow = `0 0 0 4px ${currentTheme.accent}20`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = currentTheme.border;
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
            Brand
          </label>
          <input
            type="text"
            value={basicInfoForm.brand}
            onChange={(e) => setBasicInfoForm({ ...basicInfoForm, brand: e.target.value })}
            className="w-full px-5 py-4 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-4 shadow-sm"
            style={{ 
              backgroundColor: currentTheme.bg,
              color: currentTheme.text,
              borderWidth: '2px',
              borderColor: currentTheme.border
            }}
            onFocus={(e) => {
              e.target.style.borderColor = currentTheme.accent;
              e.target.style.boxShadow = `0 0 0 4px ${currentTheme.accent}20`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = currentTheme.border;
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
            Price
          </label>
          <input
            type="number"
            step="0.01"
            value={basicInfoForm.price}
            onChange={(e) => setBasicInfoForm({ ...basicInfoForm, price: e.target.value })}
            className="w-full px-5 py-4 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-4 shadow-sm"
            style={{ 
              backgroundColor: currentTheme.bg,
              color: currentTheme.text,
              borderWidth: '2px',
              borderColor: currentTheme.border
            }}
            onFocus={(e) => {
              e.target.style.borderColor = currentTheme.accent;
              e.target.style.boxShadow = `0 0 0 4px ${currentTheme.accent}20`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = currentTheme.border;
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* Product Type and Gender */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
            Product Type
          </label>
          <MultiSelectDropdown
            label="Product Type"
            options={Array.isArray(basicInfoForm.category) ? basicInfoForm.category : [basicInfoForm.category]}
            selectedValues={Array.isArray(basicInfoForm.category) ? basicInfoForm.category : (basicInfoForm.category ? [basicInfoForm.category] : [])}
            onChange={(selected) => setBasicInfoForm({ ...basicInfoForm, category: selected })}
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
            Gender
          </label>
          <MultiSelectDropdown
            label="Gender"
            options={basicInfoForm.gender || ["all genders"]}
            selectedValues={Array.isArray(basicInfoForm.gender) ? basicInfoForm.gender : (basicInfoForm.gender ? [basicInfoForm.gender] : [])}
            onChange={(selected) => setBasicInfoForm({ ...basicInfoForm, gender: selected })}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
          Description
        </label>
        <textarea
          rows={6}
          value={basicInfoForm.description}
          onChange={(e) => setBasicInfoForm({ ...basicInfoForm, description: e.target.value })}
          className="w-full px-5 py-4 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-4 resize-none shadow-sm"
          style={{ 
            backgroundColor: currentTheme.bg,
            color: currentTheme.text,
            borderWidth: '2px',
            borderColor: currentTheme.border
          }}
          onFocus={(e) => {
            e.target.style.borderColor = currentTheme.accent;
            e.target.style.boxShadow = `0 0 0 4px ${currentTheme.accent}20`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = currentTheme.border;
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Tags Section */}
      <div>
        <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
          Tags
        </label>

        {/* Tag Input */}
        <div className="mb-4 relative">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                ref={tagInputRef}
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Type to add tags and press Enter..."
                className="w-full px-5 py-4 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-4 shadow-sm"
                style={{ 
                  backgroundColor: currentTheme.bg,
                  color: currentTheme.text,
                  borderWidth: '2px',
                  borderColor: currentTheme.border
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = currentTheme.accent;
                  e.target.style.boxShadow = `0 0 0 4px ${currentTheme.accent}20`;
                }}
                onBlur={(e) => {
                  setTimeout(() => setShowSuggestions(false), 200);
                  e.target.style.borderColor = currentTheme.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
              
              {/* Suggestions Dropdown */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div 
                  className="absolute z-10 w-full mt-2 rounded-xl shadow-lg overflow-hidden"
                  style={{ 
                    backgroundColor: currentTheme.bg,
                    borderWidth: '2px',
                    borderColor: currentTheme.border
                  }}
                >
                  {filteredSuggestions.map((tag, index) => (
                    <div
                      key={tag.id}
                      onClick={() => {
                        addTag(tag);
                        setTagInput('');
                        setShowSuggestions(false);
                      }}
                      className="px-5 py-3 cursor-pointer transition-all duration-150 font-medium"
                      style={{
                        backgroundColor: index === selectedSuggestionIndex ? `${currentTheme.accent}20` : 'transparent',
                        color: currentTheme.text
                      }}
                      onMouseEnter={() => setSelectedSuggestionIndex(index)}
                    >
                      {tag.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Plus Button */}
            {tagInput.trim() && (
              <button
                type="button"
                onClick={handleAddTagFromInput}
                className="px-5 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-md flex items-center gap-2"
                style={{ 
                  backgroundColor: currentTheme.buttonPrimary,
                  color: '#ffffff'
                }}
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Selected Tags Container */}
        <div 
          className="border border-dashed rounded-lg p-6"
          style={{ 
            backgroundColor: '#f9fafb',
            borderColor: '#d1d5db',
            minHeight: '120px'
          }}
        >
          {basicInfoForm?.tags?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {basicInfoForm.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200"
                  style={{ 
                    backgroundColor: '#e5e7eb',
                    color: '#374151',
                    border: '1px solid #d1d5db'
                  }}
                >
                  {tag.name}
                  <button
                    onClick={() => removeTag(tag.id)}
                    className="hover:bg-gray-300 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <Tag className="w-12 h-12 text-gray-400 mb-3" />
              <div className="text-gray-500 font-medium text-lg">No tags added yet</div>
              <div className="text-gray-400 text-sm mt-1">Type above to add tags</div>
            </div>
          )}
        </div>

        {/* Available Tags Section */}
        {tagSuggestions.length > 0 && (
          <div className="mt-5 p-4 rounded-xl" style={{ backgroundColor: currentTheme.buttonSecondary }}>
            <p className="text-xs font-bold mb-3 uppercase tracking-wide" style={{ color: currentTheme.text }}>
              Available Tags:
            </p>
            
            {/* Product Type Filter */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory('All')}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-sm whitespace-nowrap flex-shrink-0"
                style={{ 
                  backgroundColor: selectedCategory === 'All' ? currentTheme.buttonPrimary : currentTheme.bg,
                  color: selectedCategory === 'All' ? '#fff' : currentTheme.text,
                  borderWidth: '2px',
                  borderColor: selectedCategory === 'All' ? currentTheme.buttonPrimary : currentTheme.border
                }}
              >
                All
              </button>
              {basicInfoForm.category.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedCategory(type)}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-sm whitespace-nowrap flex-shrink-0 capitalize"
                  style={{ 
                    backgroundColor: selectedCategory === type ? currentTheme.buttonPrimary : currentTheme.bg,
                    color: selectedCategory === type ? '#fff' : currentTheme.text,
                    borderWidth: '2px',
                    borderColor: selectedCategory === type ? currentTheme.buttonPrimary : currentTheme.border
                  }}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Filtered Tags */}
            <div className="flex flex-wrap gap-2">
              {tagSuggestions
                .filter((ts) => !basicInfoForm?.tags?.some((t) => t.id === ts.id))
                .filter((tag) => selectedCategory === 'All' || tag.category === selectedCategory)
                .map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => {
                      addTag(tag);
                      setTagInput('');
                    }}
                    className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-sm"
                    style={{ 
                      backgroundColor: currentTheme.bg,
                      color: currentTheme.text,
                      borderWidth: '2px',
                      borderColor: currentTheme.border
                    }}
                  >
                    + {tag.name}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Checkboxes */}
      <div className="flex flex-wrap gap-8 pt-4">
        <label className="flex items-center group cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={basicInfoForm.isFeatured}
              onChange={(e) => setBasicInfoForm({ ...basicInfoForm, isFeatured: e.target.checked })}
              className="w-6 h-6 rounded-lg cursor-pointer transition-all duration-200"
              style={{ accentColor: currentTheme.accent }}
            />
          </div>
          <span className="ml-3 text-sm font-bold uppercase tracking-wide" style={{ color: currentTheme.text }}>
            Featured Product
          </span>
        </label>

        {/* <label className="flex items-center group cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={basicInfoForm.free_shipping}
              onChange={(e) => setBasicInfoForm({ ...basicInfoForm, free_shipping: e.target.checked })}
              className="w-6 h-6 rounded-lg cursor-pointer transition-all duration-200"
              style={{ accentColor: currentTheme.accent }}
            />
          </div>
          <span className="ml-3 text-sm font-bold uppercase tracking-wide" style={{ color: currentTheme.text }}>
            Free Shipping
          </span>
        </label> */}
      </div>
    </div>)
}


export default FashionBasicInfoForm ;