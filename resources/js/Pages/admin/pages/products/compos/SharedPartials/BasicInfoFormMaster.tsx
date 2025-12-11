import React from 'react';
import { Upload, Plus, Tag  , X, Check, ChevronDown } from "lucide-react";
import SelectedChip from '@/components/ui/SelectedChip';
import { useState, useRef, useEffect } from 'react';
import { Tag as TagType  } from '@/types/tagsTypes';
import { ProductBasicInfoData } from '@/types/productsTypes';
import { TagSuggestion } from '../../../../../../types/tagsTypes';
import { P } from 'node_modules/framer-motion/dist/types.d-BJcRxCew';
import MultiSelectDropdown from '@/components/ui/MultiSelectDropdown';
import { useNicheCtx } from '@/contextHooks/useNicheCtx';
import { NicheItem } from '@/context/NicheContext';
import { useProductDataCtx } from '@/contextHooks/sharedhooks/useProductDataCtx';
import FashionBasicInfoForm from './forms/basicInfoForms/FashionBasicInfoForm';
import PerfumesBasicInfoForm from './forms/basicInfoForms/PerfumesBasicInfoForm';
import { Button } from '@/components/ui/button';
import { useProductUICtx } from '@/contextHooks/sharedhooks/useProductUICtx';







const BasicInfoFormMaster: React.FC = () => {
   


  const {currentNiche} = useNicheCtx()

  const  { productData = {} , basicInfoForm } = useProductDataCtx()
  const  {setShowToast , setHasUnsavedChanges  } = useProductUICtx()
  const handleSaveAllChanges = () => {
      console.log("Saving all changes:", productData);
      alert("Changes saved successfully!");
      setHasUnsavedChanges(false);
      setShowToast(false);
  };

 
 
  const formsMap : Record<NicheItem  , React.FC<any>> =  {
          "fashion" : FashionBasicInfoForm,
          "perfumes" : PerfumesBasicInfoForm ,
          "electronics" : FashionBasicInfoForm ,
  }
  // const PropsMap : Record<NicheItem , any> = {
  //      "fashion" : {} 
  //       "perfumes" : {}
  //       "electronics" : {}
  // }

  const Form = formsMap[currentNiche]
  // const props = PropsMap[currentNiche]


  return ( <>
   <Form />
   {/* save product */}
   <div className="flex justify-center">
      <Button 
          variant="outline"
          onClick={handleSaveAllChanges}
      >
          Save All Changes
      </Button>
    </div>
  </>
  
 );  
};

export default BasicInfoFormMaster;
