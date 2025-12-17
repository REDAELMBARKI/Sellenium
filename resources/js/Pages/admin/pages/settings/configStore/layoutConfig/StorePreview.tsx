import SkeletonLayout, { LayoutStyle } from "@/components/partials/previewSkeletons/SkeletonLayout";
import React from "react";



interface StorePreviewProps {
  previewLayoutId : LayoutStyle  
  config: {
    layoutType: LayoutStyle
    theme: "light" | "dark"
    cardSettings : {
      cardNameId : string ,
      showPrice: boolean;
       showRating: boolean;
    }
  };
}

const  StorePreview: React.FC<StorePreviewProps> = ({ config   , previewLayoutId}) => {

  return (
    <div
      className={`h-[520px] overflow-y-auto rounded-2xl border p-4 transition-all
        ${config.theme === "dark"
          ? "bg-slate-900 text-white border-slate-700"
          : "bg-white text-slate-900 border-slate-200"
        }`}
    >
      
     <SkeletonLayout previewLayoutId={previewLayoutId}  config={config} />
        
    </div>
  );
};

export default StorePreview;
