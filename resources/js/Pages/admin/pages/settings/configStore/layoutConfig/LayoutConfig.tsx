import React, { useState } from "react";
import StorePreview from "./StorePreview";

import TogglableCard from "@/components/partials/TooglableCard";
import {  LayoutDataType, LayoutStyle } from "@/types/StoreConfigTypes";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import SkeletonLayout from "@/components/partials/previewSkeletons/SkeletonLayout";


const Layouts : LayoutDataType[] = [
  {
    id:  "grid",
    label: "grid",
    image: "/images/fashionNiche.png",
  },
  {
    id: "list",
    label: "list",
    image: "/images/perfumesNiche.png",
  },
  {
    id: "premium",
    label: "premium",
    image: "/images/electronicsNiche.png",
  },
];

const mockProducts: any = {
  fashion: [
    { id: 1, title: "T-Shirt", price: 25 },
    { id: 2, title: "Dress", price: 60 },
  ],
  perfume: [
    { id: 3, title: "Floral Perfume", price: 40 },
    { id: 4, title: "Citrus Perfume", price: 35 },
  ],
  electronics: [
    { id: 5, title: "Smartphone", price: 400 },
    { id: 6, title: "Headphones", price: 80 },
  ],
};

const LayoutConfig = () => {
  const {state : {currentLayoutId } , dispatch} = useStoreConfigCtx()

  const [previewLayoutId, setPreviewLayoutId] = useState<LayoutStyle>(currentLayoutId);
 
  const handleLayoutToggle = (LayoutId: LayoutStyle) => {
    dispatch({type : "SET_LAYOUT" , payload : LayoutId})
    setPreviewLayoutId(LayoutId);
  };

  return (
    <div>


      <div className="flex gap-6">
        <div className="w-1/4 p-5 overflow-y-auto   w-[70%]">
          <h2 className="text-xl font-semibold mb-4">Layouts</h2>
          <div className="grid grid-cols-2  gap-4">
            {Layouts.map((Layout) => {
              const isCurrent = currentLayoutId === Layout.id;
              const isPreview = previewLayoutId === Layout.id;
              return (
                 
                   <TogglableCard  key={Layout.id} 
                     handleOptionToggle={handleLayoutToggle} 
                     isCurrent={isCurrent} 
                     isPreview={isPreview}
                     changeToggledId={(id:LayoutStyle) => setPreviewLayoutId(id)}  
                     option={Layout}
                    />
              );
            })}
          </div>
        </div>

      
        <div className="w-2/4 p-4  rounded-lg ">
          <h3 className="text-lg font-bold mb-4">Store Preview</h3>
          <StorePreview>
               <SkeletonLayout previewLayoutId={previewLayoutId} />
          </StorePreview>
        </div>
      </div>
    </div>
  );
};

export default LayoutConfig;



