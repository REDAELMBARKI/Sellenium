import SkeletonLayout  from "@/components/partials/previewSkeletons/SkeletonLayout";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import React from "react";




const  StorePreview = ({children} :{children : React.ReactNode}) => {
  const {state : {currentTheme}} = useStoreConfigCtx()
  
  return (
    <div
      className={`h-[520px] overflow-y-auto rounded-2xl border p-4 transition-all`}

        style={{color : currentTheme.text , background : currentTheme.bg , borderColor : currentTheme.border}}
    >
      
     {children}
        
    </div>
  );
};

export default StorePreview;
