import React, { useState } from "react";
import StorePreview from "./StorePreview";

import TogglableCard from "@/components/partials/TooglableCard";
import { LayoutConfigProps, LayoutDataType, LayoutStyle } from "@/types/StoreConfigTypes";


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

const LayoutConfig: React.FC<LayoutConfigProps> = ({ config, setConfig }) => {
  const [previewLayoutId, setPreviewLayoutId] = useState<LayoutStyle>(config.Layout);
 
  const previewLayout = Layouts.find((n) => n.id === previewLayoutId);

  const handleLayoutToggle = (LayoutId: LayoutStyle) => {
    setConfig((prev: any) => ({ ...prev, Layout: LayoutId }));
    setPreviewLayoutId(LayoutId);
  };

  return (
    <div>


      <div className="flex gap-6">
        <div className="w-1/4 p-5 overflow-y-auto   w-[70%]">
          <h2 className="text-xl font-semibold mb-4">Layouts</h2>
          <div className="grid grid-cols-2  gap-4">
            {Layouts.map((Layout) => {
              const isCurrent = config.Layout === Layout.id;
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

      
        <div className="w-2/4 p-4 border rounded-lg bg-white">
          <h3 className="text-lg font-bold mb-4">Store Preview</h3>
          <StorePreview previewLayoutId={previewLayoutId}  config={config} />
        </div>
      </div>
    </div>
  );
};

export default LayoutConfig;



