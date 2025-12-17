import SkeletonLayout  from "@/components/partials/previewSkeletons/SkeletonLayout";
import { StorePreviewProps } from "@/types/StoreConfigTypes";
import React from "react";




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
