import React, { useState } from "react";
import StorePreview from "../layoutConfig/StorePreview";
import { useNicheWarning } from "@/functions/useNicheWarning";
import NicheWarning from "./components/NicheWarning";
import TogglableCard from "@/components/partials/TooglableCard";

interface NicheConfigProps {
  config: any;
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

const niches = [
  {
    id: "fashion",
    label: "Fashion",
    image: "/images/fashionNiche.png",
    info: "Fashion products like clothing & accessories. Backend provides related layouts and options.",
  },
  {
    id: "perfume",
    label: "Perfume",
    image: "/images/perfumesNiche.png",
    info: "Perfume products. Backend ensures only perfume-related options and layouts.",
  },
  {
    id: "electronics",
    label: "Electronics",
    image: "/images/electronicsNiche.png",
    info: "Electronics products. Backend provides electronics-specific options and store structure.",
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

const NicheConfig: React.FC<NicheConfigProps> = ({ config, setConfig }) => {
  const [previewNicheId, setPreviewNicheId] = useState<string>(config.niche);
  const { isVisible, dismiss } = useNicheWarning();

  const previewNiche = niches.find((n) => n.id === previewNicheId);

  const handleNicheToggle = (nicheId: string) => {
    setConfig((prev: any) => ({ ...prev, niche: nicheId }));
    setPreviewNicheId(nicheId);
  };

  return (
    <div>
      <NicheWarning isVisible={isVisible} onDismiss={dismiss} />

      <div className="flex gap-6">
        <div className="w-1/4 p-5 overflow-y-auto   w-[70%]">
          <h2 className="text-xl font-semibold mb-4">Niches</h2>
          <div className="grid grid-cols-2  gap-4">
            {niches.map((niche) => {
              const isCurrent = config.niche === niche.id;
              const isPreview = previewNicheId === niche.id;
              return (
                 
                   <TogglableCard  key={niche.id} 
                     handleOptionToggle={handleNicheToggle} 
                     isCurrent={isCurrent} 
                     isPreview={isPreview}
                    changeToggledId={(id:string) => setPreviewNicheId(id)}  
                     option={niche}
                    />
              );
            })}
          </div>
        </div>

      
        <div className="w-1/4 p-4 border rounded-lg bg-white">
          <h3 className="text-lg font-bold mb-4">Store Preview</h3>
          <StorePreview products={mockProducts[previewNicheId] || []} config={config} />
        </div>
      </div>
    </div>
  );
};

export default NicheConfig;



