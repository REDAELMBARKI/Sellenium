import React, { useState } from "react";


import TogglableCard from "@/components/partials/TooglableCard";
import {   LayoutCardsDataType, LayoutStyle, ThemeCardsDataType } from "@/types/StoreConfigTypes";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import SkeletonLayout from "@/components/partials/previewSkeletons/SkeletonLayout";
import StorePreview from "../layoutConfig/StorePreview";
import { ThemeStyle } from "@/types/ThemeTypes";


const themes : ThemeCardsDataType[] = [
  {
    style:  "luxuryNoir", 
    label : "luxuryNoir" ,
    image: "/images/fashionNiche.png",
  },
  {
    style: 'softPastel',
    label: 'softPastel',
    image: "/images/perfumesNiche.png",
  },
 
];


const ThemeConfig = () => {
  const {state : {currentThemeStyle , 
    currentLayoutStyle // this is current Layout that can be used as a preview in the skelepton
  } , dispatch} = useStoreConfigCtx()

  const [previewThemeStyle, setPreviewThemeStyle] = useState<ThemeStyle>(currentThemeStyle);
 
  const handleThemeToggle = (ThemeId: ThemeStyle) => {
    dispatch({type : "SET_THEME_PALETTE" , payload : ThemeId})
    setPreviewThemeStyle(ThemeId);
  };

  return (
    <div>


      <div className="flex gap-6">
        <div className="w-1/4 p-5 overflow-y-auto   w-[70%]">
          <h2 className="text-xl font-semibold mb-4">Themes</h2>
          <div className="grid grid-cols-2  gap-4">
            {themes.map((Theme) => {
              const isCurrent = currentThemeStyle === Theme.style;
              const isPreview = previewThemeStyle === Theme.style;
              return (
                 
                   <TogglableCard  key={Theme.style} 
                     handleOptionToggle={handleThemeToggle} 
                     isCurrent={isCurrent} 
                     isPreview={isPreview}
                     changeToggledStyle={(style:ThemeStyle) => setPreviewThemeStyle(style)}  
                     option={Theme}
                    />
              );
            })}
          </div>
        </div>

      
        <div className="w-2/4 p-4  rounded-lg ">
          <h3 className="text-lg font-bold mb-4">Store Preview</h3>
          <StorePreview>
               <SkeletonLayout previewLayoutStyle={currentLayoutStyle} previewThemeStyle={previewThemeStyle} />
          </StorePreview>
        </div>
      </div>
    </div>
  );
};

export default ThemeConfig;



