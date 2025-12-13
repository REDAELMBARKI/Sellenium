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
import FashionBasicInfoForm from '../../fashionNiche/forms/FashionBasicInfoForm';
import PerfumesBasicInfoForm from '../../perfumesNiche/forms/PerfumesBasicInfoForm';
import FashionReadonlyDisplay from '../../fashionNiche/displays/FashionReadonlyDisplay';
import PerfumesReadonlyDisplay from '../../perfumesNiche/displays/PerfumesReadonlyDisplay';






const ProductInfoDisplayMaster: React.FC = () => {
   


  const {currentNiche} = useNicheCtx()
  const {productData} = useProductDataCtx()

 
 
  const displaysMap : Record<NicheItem  , React.FC<any>> =  {
          "fashion" : FashionReadonlyDisplay,
          "perfumes" : PerfumesReadonlyDisplay ,
          "electronics" : FashionReadonlyDisplay ,
  }
  const PropsMap : Record<NicheItem , any> = {
       "fashion" : productData ,
        "perfumes" : productData,
        "electronics" : productData
  }

  const DisplayInfo = displaysMap[currentNiche]
  const props = PropsMap[currentNiche]
  return ( <DisplayInfo {...props} />);  
};

export default ProductInfoDisplayMaster;
