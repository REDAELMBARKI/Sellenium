import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Check, Edit2, X, Package } from "lucide-react";
import ProductInfoDisplay from './ProductInfoDisplay';
import ProductInfoForm from '../SharedPartials/BasicInfoForm';
import { useEditProductDataCtx } from '../../../../../../contextHooks/sharedhooks/useProductDataCtx';
import { useEditProductUICtx } from '@/contextHooks/editProductCtxHooks/useEditProductUICtx';
import { useToasts } from '@/contextHooks/useToasts';
import { ToasterNative } from '@/components/ui/ToasterNative';
import { NicheContext } from '@/context/NicheContext';
import { useNicheCtx } from '@/contextHooks/useNicheCtx';


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
  const {isEditingBasicInfo , setIsEditingBasicInfo , setHasUnsavedChanges  , hasUnsavedChanges} =  useEditProductUICtx() 
  const toastChangedUnsavedMoundRef =  useRef<boolean>(false) ;
  const {addToast} =  useToasts()

    const handleEditBasicInfo = () => {
        setIsEditingBasicInfo(true);

        if(!productData)  return ;
        setBasicInfoForm({
            name: productData.name,
            brand: productData.brand,
            rating_average : productData.rating_average ,
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
              rating_average : productData.rating_average , 
              isFeatured: productData.isFeatured,
              free_shipping: productData.free_shipping,
              thumbnail: productData.thumbnail,
              tags: productData.tags,
          });
      };
 
  const handleCancelWithConfirmation = () => {
    
    if(!hasUnsavedChanges) {
      handleCancelBasicInfo()
      return ;
    };
    const confirmed = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
    if (!confirmed) return;
    handleCancelBasicInfo();
  };

   

  // toest should be fixed when the full data is arived form backend
  // chnages checkker 
  useEffect(() => {
     // destrictor basic info form data from prroduct data 
    const {inventories   , ...basicInfoData} = productData;
     const hasChanges  = JSON.stringify(basicInfoData) !== JSON.stringify(basicInfoForm) 
     setHasUnsavedChanges(hasChanges)

  }, [basicInfoForm]);

  // toast trigger inn the first moount of the form if there are changes 
  useEffect(() => {
     if(toastChangedUnsavedMoundRef.current) return ;
     if(!toastChangedUnsavedMoundRef.current && isEditingBasicInfo && hasUnsavedChanges){
       addToast({
          title : "there are unsaved changes " , 
          description : "the changes should be saved or they would be forgotten " , 
          type : "info" , 
          duration : 100000 

       })
     }  
  
    toastChangedUnsavedMoundRef.current = true ;

  }, [basicInfoForm]);

  



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
