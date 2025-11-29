import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, Edit2, X, Package } from "lucide-react";
import { Tag } from '@/types/tagsTypes';
import ProductInfoDisplay from './ProductInfoDisplay';
import ProductInfoForm from '../SharedPartials/BasicInfoForm';
import { ProductBasicInfoData } from '@/types/productsTypes';

const currentTheme = {
  bg: '#ffffff',
  text: '#0f172a',
  buttonPrimary: '#8b5cf6',
  buttonSecondary: '#f1f5f9',
  accent: '#8b5cf6',
  border: '#e2e8f0',
};

interface ProductInfoReadOnlyProps {
  basicInfoForm: ProductBasicInfoData;
  isEditingBasicInfo: boolean;
  productData: ProductBasicInfoData;
  setBasicInfoForm: React.Dispatch<React.SetStateAction<ProductBasicInfoData>>;
  handleThumbnailUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditBasicInfo: () => void;
  handleSaveBasicInfo?: () => void;
  handleCancelBasicInfo?: () => void;
  removeTag: (tagId: string) => void;
  addTag: (tag: Tag) => void;
  tagSuggestions: Tag[];
}

const ProductBasicInfo: React.FC<ProductInfoReadOnlyProps> = ({
  basicInfoForm,
  isEditingBasicInfo,
  productData,
  setBasicInfoForm,
  handleThumbnailUpload,
  handleEditBasicInfo,
  handleSaveBasicInfo,
  handleCancelBasicInfo,
  removeTag,
  addTag,
  tagSuggestions
}) => {


  const handleCancelWithConfirmation = () => {
    const hasChanges = JSON.stringify(basicInfoForm) !== JSON.stringify(productData);
    
    if (hasChanges) {
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-orange-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-slide-in';
      toast.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <div class="font-bold">Unsaved Changes</div>
            <div class="text-sm">Your changes will be lost</div>
          </div>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
      
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirmed) return;
    }
    
    // handleCancelBasicInfo();
  };

  return (
    <div 
      className="rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl"
      style={{ 
        backgroundColor: currentTheme.bg,
        borderColor: currentTheme.border,
        padding: '2.5rem'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b" style={{ borderColor: currentTheme.border }}>
        <div className="flex items-center space-x-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md transition-transform hover:scale-105"
            style={{ backgroundColor: currentTheme.accent }}
          >
            <Package className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold" style={{ color: currentTheme.text }}>
            Basic Information
          </h2>
        </div>

        {!isEditingBasicInfo ? (
          <Button
            onClick={handleEditBasicInfo}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-md"
            style={{ 
              backgroundColor: currentTheme.buttonPrimary,
              color: '#ffffff'
            }}
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button
              onClick={handleSaveBasicInfo}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-md"
              style={{ 
                backgroundColor: currentTheme.buttonPrimary,
                color: '#ffffff'
              }}
            >
              <Check className="w-4 h-4" />
              Save
            </Button>
            <Button
              onClick={handleCancelWithConfirmation}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
              style={{ 
                backgroundColor: currentTheme.buttonSecondary,
                color: currentTheme.text
              }}
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Conditional rendering based on editing state */}
      {isEditingBasicInfo ? (
        <ProductInfoForm
          basicInfoForm={basicInfoForm}
          setBasicInfoForm={setBasicInfoForm}
          handleThumbnailUpload={handleThumbnailUpload}
          removeTag={removeTag}
          addTag={addTag}
          tagSuggestions={tagSuggestions}
          productData={productData}
          handleCancelBasicInfo={handleCancelBasicInfo}
        />
      ) : (
        <ProductInfoDisplay productData={productData} />
      )}
    </div>
  );
};

export default ProductBasicInfo;
