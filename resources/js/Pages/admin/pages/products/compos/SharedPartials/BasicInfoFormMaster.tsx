import React from 'react';
import { Upload, Plus, Tag  , X, Check, ChevronDown } from "lucide-react";
import SelectedChip from '@/components/ui/SelectedChip';
import { useState, useRef, useEffect } from 'react';
import { Tag as TagType  } from '@/types/tagsTypes';
import { ProductBasicInfoData } from '@/types/productsTypes';
import { TagSuggestion } from '../../../../../../types/tagsTypes';
import { P } from 'node_modules/framer-motion/dist/types.d-BJcRxCew';
import MultiSelectDropdown from '@/components/ui/MultiSelectDropdown';
import FashionBasicInfoForm from './forms/basicInfoForms/PerfumesBasicInfoForm';
import { useNicheCtx } from '@/contextHooks/useNicheCtx';
import { NicheItem } from '@/context/NicheContext';
import { useProductDataCtx } from '@/contextHooks/sharedhooks/useProductDataCtx';
import PerfumesBasicInfoForm from './forms/basicInfoForms/PerfumesBasicInfoForm';





export interface ProductInfoFormProps {
  handleCancelBasicInfo?: () => void; // For edit mode cancel confirmation
}

const BasicInfoFormMaster: React.FC<ProductInfoFormProps> = ({
 
  handleCancelBasicInfo,
}) => {
   


  const {currentNiche} = useNicheCtx()


 
 
  // const formsMap : Record<NicheItem  , React.FC<any>> =  {
  //         // "default" : DefaultForm , 
  //         "fashion" : FashionBasicInfoForm ,
  //         // "parfumes" : ParfumesBasicInfoForm ,
  //         // "electronics" : ElectronicsBasicInfoForm ,
  // }
  // const PropsMap : Record<NicheItem , any> = {
  //     //  "fashion" : {} 
  //       // "parfumes" : {}
  //       // "electronics" : {}
  // }

  // const Form = formsMap[currentNiche]
  const Form = PerfumesBasicInfoForm ;
  // const props = PropsMap[currentNiche]
  return ( <Form />);  
};

export default BasicInfoFormMaster;
