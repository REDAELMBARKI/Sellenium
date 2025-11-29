import React from 'react';
import { Upload, Plus, Tag  , X, Check, ChevronDown } from "lucide-react";
import SelectedChip from '@/components/ui/SelectedChip';
import { useState, useRef, useEffect } from 'react';
import { useEditProductActions } from '../../Productshooks/editActionsHook';
import { Tag as TagType  } from '@/types/tagsTypes';
import { ProductBasicInfoData } from '@/types/productsTypes';

const currentTheme = {
  bg: '#ffffff',
  text: '#0f172a',
  buttonPrimary: '#8b5cf6',
  buttonSecondary: '#f1f5f9',
  buttonHover: '#7c3aed',
  accent: '#8b5cf6',
  border: '#e2e8f0',
  borderHover: '#cbd5e1',
  primary: '#8b5cf6',
};

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ label, options, selectedValues, onChange }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    const newSelected = selectedValues.includes(option)
      ? selectedValues.filter(v => v !== option)
      : [...selectedValues, option];
    onChange(newSelected);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 rounded-xl font-medium transition-all duration-200 focus:outline-none shadow-sm flex items-center justify-between"
        style={{ 
          backgroundColor: currentTheme.bg,
          color: currentTheme.text,
          borderWidth: '2px',
          borderColor: isOpen ? currentTheme.accent : currentTheme.border
        }}
      >
        <span className={selectedValues.length === 0 ? 'text-gray-400' : ''}>
          {selectedValues.length === 0 
            ? `Select ${label.toLowerCase()}` 
            : `${selectedValues.length} selected`}
        </span>
        <ChevronDown 
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: currentTheme.text }}
        />
      </button>

      {isOpen && (
        <div 
          className="absolute z-50 w-full mt-2 rounded-xl shadow-lg overflow-hidden"
          style={{ 
            backgroundColor: currentTheme.bg,
            borderWidth: '2px',
            borderColor: currentTheme.border,
            maxHeight: '250px',
            overflowY: 'auto'
          }}
        >
          {options.map((option, idx) => {
            const isSelected = selectedValues.includes(option);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleOption(option)}
                className="w-full px-5 py-3 flex items-center gap-3 transition-all duration-150 hover:bg-opacity-50"
                style={{
                  backgroundColor: isSelected ? `${currentTheme.accent}10` : 'transparent',
                  color: currentTheme.text
                }}
              >
                <div 
                  className="w-5 h-5 rounded flex items-center justify-center transition-all"
                  style={{
                    backgroundColor: isSelected ? currentTheme.accent : 'transparent',
                    borderWidth: '2px',
                    borderColor: isSelected ? currentTheme.accent : currentTheme.border
                  }}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="font-medium capitalize">{option}</span>
              </button>
            );
          })}
        </div>
      )}

      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedValues.map((value, idx) => (
            <SelectedChip
              key={idx}
              label={value}
              onRemove={() => toggleOption(value)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export interface ProductInfoFormProps {
  basicInfoForm: ProductBasicInfoData;
  setBasicInfoForm: React.Dispatch<React.SetStateAction<ProductBasicInfoData>>;
  handleThumbnailUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeTag: (tagId: string) => void;
  addTag: (tag: TagType) => void;
  tagSuggestions: TagType[];
  productData?: ProductBasicInfoData; // For edit mode cancel confirmation
  handleCancelBasicInfo?: () => void; // For edit mode cancel confirmation
}

const ProductInfoForm: React.FC<ProductInfoFormProps> = ({
  basicInfoForm,
  setBasicInfoForm,
  handleThumbnailUpload,
  removeTag,
  addTag,
  tagSuggestions,
  productData,
  handleCancelBasicInfo,
}) => {
  const {
    tagInput,
    setTagInput,
    filteredSuggestions,
    showSuggestions,
    setShowSuggestions,
    selectedSuggestionIndex,
    setSelectedSuggestionIndex,
    selectedCategory,
    setSelectedCategory,
    tagInputRef,
    handleTagInputKeyDown,
    handleAddTagFromInput,
  } = useEditProductActions({
    basicInfoForm,
    productData: productData || basicInfoForm,
    tagSuggestions,
    addTag,
    handleCancelBasicInfo: handleCancelBasicInfo || (() => {}),
  });

  const categories = ["t-shirts", "pants", "shoes", "hoodies", "jeans"];
  const genderOptions = ["Men", "Women", "Unisex"];

  return (
    <div className="space-y-8">
      {/* Thumbnail Section */}
      <div>
        <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
          Product Thumbnail
        </label>
        <div className="flex items-center gap-6">
          {basicInfoForm.thumbnail && (
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
          <label 
            className="flex items-center gap-3 px-6 py-3 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 shadow-md font-semibold"
            style={{ 
              backgroundColor: currentTheme.buttonSecondary,
              color: currentTheme.text,
              borderWidth: '2px',
              borderColor: currentTheme.border
            }}
          >
            <Upload className="w-5 h-5" />
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
            options={categories}
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
            options={genderOptions}
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
                  backgroundColor: selectedCategory === 'All' ? currentTheme.primary : currentTheme.bg,
                  color: selectedCategory === 'All' ? '#fff' : currentTheme.text,
                  borderWidth: '2px',
                  borderColor: selectedCategory === 'All' ? currentTheme.primary : currentTheme.border
                }}
              >
                All
              </button>
              {categories.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedCategory(type)}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-sm whitespace-nowrap flex-shrink-0 capitalize"
                  style={{ 
                    backgroundColor: selectedCategory === type ? currentTheme.primary : currentTheme.bg,
                    color: selectedCategory === type ? '#fff' : currentTheme.text,
                    borderWidth: '2px',
                    borderColor: selectedCategory === type ? currentTheme.primary : currentTheme.border
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

        <label className="flex items-center group cursor-pointer">
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
        </label>
      </div>
    </div>
  );
};

export default ProductInfoForm;
