import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, Edit2, X, Package } from "lucide-react";
import { Tag } from '@/types/tagsTypes';
import ProductInfoDisplay from './ProductInfoDisplay';
import ProductInfoForm from '../SharedPartials/BasicInfoForm';
import { useEditProductDataCtx } from './../../../../../../contextHooks/editProductCtxHooks/useEditProductDataCtx';
import { useEditProductUICtx } from '@/contextHooks/editProductCtxHooks/useEditProductUICtx';
import { useToasts } from '@/contextHooks/useToasts';
import { ToasterNative } from '@/components/ui/ToasterNative';


const currentTheme = {
  bg: '#ffffff',
  text: '#0f172a',
  buttonPrimary: '#8b5cf6',
  buttonSecondary: '#f1f5f9',
  accent: '#8b5cf6',
  border: '#e2e8f0',
};



const ProductBasicInfo: React.FC = () => {


  const {basicInfoForm ,  productData ,  setProductData ,  setBasicInfoForm} =  useEditProductDataCtx()
  const {isEditingBasicInfo , setIsEditingBasicInfo , setHasUnsavedChanges } =  useEditProductUICtx()
  const {addToast} =  useToasts()
  
    const handleEditBasicInfo = () => {
        setIsEditingBasicInfo(true);

        if(!productData)  return ;
        setBasicInfoForm({
            name: productData.name,
            brand: productData.brand,
            price: productData.price,
            description: productData.description,
            category: productData.category,
            gender: productData.gender,
            isFeatured: productData.isFeatured,
            free_shipping: productData.free_shipping,
            thumbnail: productData.thumbnail,
            tags: productData.tags,
        });
    };


   const handleSaveBasicInfo = () => {
          setProductData({
              ...productData,
              ...basicInfoForm,
          });
          setIsEditingBasicInfo(false);
          setHasUnsavedChanges(true);
      };
  
      const handleCancelBasicInfo = () => {
          setIsEditingBasicInfo(false);
          if(!productData) return ;
          setBasicInfoForm({
              name: productData.name,
              brand: productData.brand,
              price: productData.price,
              description: productData.description,
              category: productData.category,
              gender: productData.gender,
              isFeatured: productData.isFeatured,
              free_shipping: productData.free_shipping,
              thumbnail: productData.thumbnail,
              tags: productData.tags,
          });
      };
  
  const handleCancelWithConfirmation = () => {
    const hasChanges = JSON.stringify(basicInfoForm) !== JSON.stringify(productData);
    
    if (hasChanges) {
      addToast({
         title : 'unsaved changes' , 
         description : "your new  changes will be forgotten " ,
         duration : 6000 , 
         type :"success"
      })
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirmed) return;
    }
    
    handleCancelBasicInfo();
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
      <ToasterNative />
      {/* Conditional rendering based on editing state */}
      {isEditingBasicInfo ? (
        <ProductInfoForm
          handleCancelBasicInfo={handleCancelBasicInfo}
        />
      ) : (
        <ProductInfoDisplay productData={productData} />
      )}
    </div>
  );
};

export default ProductBasicInfo;
