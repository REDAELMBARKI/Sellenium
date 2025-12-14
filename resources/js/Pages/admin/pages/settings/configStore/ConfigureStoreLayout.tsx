import React, { useState } from "react";
import Tabs from "../../products/A_sharedForAllNiches/components/showProductPage/Tabs";
import { CardSim, Grid, List, Palette } from "lucide-react";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";
import NicheOptions from "./NicheOptions";
import CardOptions from "./CardOptions";
import LayoutOptions from "./LayoutOptions";
import ThemeOptions from "./ThemeOptions";
import StorePreview from "./StorePreview";

// Example fake data for preview
const mockProducts = [
  { id: 1, title: "Perfume A", price: 350, rating: 4.5 },
  { id: 2, title: "T-Shirt B", price: 120, rating: 4.2 },
  { id: 3, title: "Bag C", price: 450, rating: 4.8 },
];

export const ConfigureStoreLayout = () => {
  const [currentConfig, setCurrentConfig] = useState({
    cardType: "GridCard",
    showPrice: true,
    showRating: true,
    layoutType: "grid",
    theme: "light",
    niche: "fashion",
  });

  const configureTabs = [
    {
      id: "niche",
      label: "Niche",
      Icon: Grid,
      content: (
        <div className="flex gap-6">
          {/* Left: Niche Options */}
          <div className="w-2/3 p-4">
            <NicheOptions config={currentConfig} setConfig={setCurrentConfig} />
          </div>
          {/* Right: Live Preview */}
          <div className="w-1/3 p-4 border rounded-lg bg-white">
            <h3 className="text-lg font-bold mb-4">Store Preview</h3>
            <StorePreview products={mockProducts} config={currentConfig} />
          </div>
        </div>
      ),
    },
    {
      id: "cards",
      label: "Cards",
      Icon: CardSim,
      content: (
        <div >
         
            <CardOptions config={currentConfig} setConfig={setCurrentConfig} />
    
        </div>
      ),
    },
    {
      id: "layout",
      label: "Layout",
      Icon: List,
      content: (
        <div className="flex gap-6">
          <div className="w-2/3 p-4">
            <LayoutOptions config={currentConfig} setConfig={setCurrentConfig} />
          </div>
          <div className="w-1/3 p-4 border rounded-lg bg-white">
            <h3 className="text-lg font-bold mb-4">Store Preview</h3>
            <StorePreview products={mockProducts} config={currentConfig} />
          </div>
        </div>
      ),
    },
    {
      id: "theme",
      label: "Theme",
      Icon: Palette,
      content: (
        <div className="flex gap-6">
          <div className="w-2/3 p-4">
            <ThemeOptions config={currentConfig} setConfig={setCurrentConfig} />
          </div>
          <div className="w-1/3 p-4 border rounded-lg bg-white">
            <h3 className="text-lg font-bold mb-4">Store Preview</h3>
            <StorePreview products={mockProducts} config={currentConfig} />
          </div>
        </div>
      ),
    },
  ];

  return <Tabs tabs={configureTabs} defaultTab="niche" />;
};

export default ConfigureStoreLayout;
ConfigureStoreLayout.layout = (page:any) => <AdminLayout children={page} />