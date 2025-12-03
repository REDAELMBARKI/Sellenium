import React from 'react';
import { Upload, Plus, Tag  , X, Check, ChevronDown } from "lucide-react";
import SelectedChip from '@/components/ui/SelectedChip';
import { useState, useRef, useEffect } from 'react';
import { useEditProductActions } from '../../Productshooks/editActionsHook';
import { Tag as TagType  } from '@/types/tagsTypes';
import { ProductBasicInfoData } from '@/types/productsTypes';
import { useEditProductDataCtx } from '@/contextHooks/editProductCtxHooks/useEditProductDataCtx';
import { TagSuggestion } from './../../../../../../types/tagsTypes';
import { P } from 'node_modules/framer-motion/dist/types.d-BJcRxCew';
import MultiSelectDropdown from '@/components/ui/MultiSelectDropdown';
import FashionBasicInfoForm from './forms/FashionBasicInfoForm';
import { useNicheCtx } from '@/contextHooks/useNicheCtx';
import { NicheItem } from '@/context/NicheContext';





export interface ProductInfoFormProps {
  handleCancelBasicInfo?: () => void; // For edit mode cancel confirmation
}

const ProductInfoForm: React.FC<ProductInfoFormProps> = ({
 
  handleCancelBasicInfo,
}) => {
   

  const [thumbnailPreview , setThumbnailPreview] = useState<string |null>(null)
  const {basicInfoForm , setBasicInfoForm , tagSuggestionsState : tagSuggestions , productData , } = useEditProductDataCtx()
  const {currentNiche} = useNicheCtx()
   const removeTag = (tagId: string) => {
          setBasicInfoForm({
              ...basicInfoForm,
              tags: basicInfoForm?.tags?.filter((t) => Number(t.id) !== Number(tagId)),
          });
      };
  
      const addTag = (tag : TagType) => {
          if (!basicInfoForm?.tags?.some((t) => Number(t.id) === Number(tag.id))) {
              setBasicInfoForm({
                  ...basicInfoForm,
                  tags: [...basicInfoForm.tags, tag],
              });
          }
      };
  
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
  
 
  const formsMap : Record<NicheItem  , React.FC<any>> =  {
          "default" : DefaultForm , 
          "fashion" : FashionBasicInfoForm ,
          "parfumes" : ParfumesBasicInfoForm ,
          "electronics" : ElectronicsBasicInfoForm ,
  }
  const Form = formsMap[currentNiche]

  return ( <Form />);  
};

export default ProductInfoForm;
