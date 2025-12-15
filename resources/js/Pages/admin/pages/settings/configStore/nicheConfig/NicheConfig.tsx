import React, { useState } from "react";
import StorePreview from "../StorePreview";
import { useNicheWarning } from "@/functions/useNicheWarning";
import NicheWarning from "./components/NicheWarning";

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
                <div
                  key={niche.id}
                  onClick={() => setPreviewNicheId(niche.id)}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all flex flex-col cursor-pointer
                    ${isPreview ? "border-blue-500" : "border-slate-200"}
                  `}
                >
                  <div className="flex items-center justify-between p-3 bg-slate-50 border-b border-slate-200">
                    <h4 className="font-semibold text-slate-900">{niche.label}</h4>
                    <button
                      onClick={() => handleNicheToggle(niche.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isCurrent ? "bg-blue-500" : "bg-slate-300 hover:bg-slate-400"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isCurrent ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <img
                    src={niche.image}
                    alt={niche.label}
                    className="w-full h-32 object-cover cursor-pointer"
                  />

                  {isCurrent && (
                    <div className="absolute inset-0 bg-black/20 flex items-start justify-start p-2 rounded-b-xl">
                      <div className="flex items-center gap-2 bg-white rounded-full px-2 py-1">
                        <span className="w-3 h-3 rounded-full bg-green-500 block"></span>
                        <span className="text-xs font-medium">Active</span>
                      </div>
                    </div>
                  )}
                </div>
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
