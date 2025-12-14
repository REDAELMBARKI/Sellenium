import React, { useState } from 'react';
import { Settings2, CheckCircle2, Circle, X } from "lucide-react";
import Card1 from './cardsPrototypes/Card1';
import Card2 from './cardsPrototypes/Card2';
import Card3 from './cardsPrototypes/Card3';
import Card4 from './cardsPrototypes/Card4';
import { Card5 } from './cardsPrototypes/Card5';
import { Card6 } from './cardsPrototypes/Card6';

export const TEMPLATE_NAMES: Record<string, string> = {
  'card-1': 'Classic Grid',
  'card-2': 'Horizontal List',
  'card-3': 'Premium Gradient',
  'card-4': 'Dark Overlay',
  'card-5': 'Minimalist',
  'card-6': 'Compact',
  'card-7': 'Featured',
  'card-8': 'Gallery',
  'card-9': 'Ecommerce',
};

const componentMap: Record<any, React.FC<any>> = {
  'card-1': Card1,
  'card-2': Card2,
  'card-3': Card3,
  'card-4': Card4,
  'card-5': Card5,
  'card-6': Card6,
  
};

export const ConfigPanel: React.FC<any> = ({ selectedCardId, config, setConfig, product }) => {
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const SelectedComponent = componentMap[selectedCardId];

  const toggleOption = (key: keyof any) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="relative flex flex-col h-full bg-slate-50/50 overflow-hidden">
      
      {/* Header with Customize Button */}
      <div className="flex-none p-4 md:p-6 bg-white border-b border-slate-200 flex justify-between items-center z-20 shadow-sm">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Preview</h2>
          <h3 className="font-bold text-slate-800 text-lg leading-tight">{TEMPLATE_NAMES[selectedCardId]}</h3>
        </div>
        <button 
          onClick={() => setIsCustomizeOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm"
        >
          <Settings2 className="w-4 h-4" />
          Customize
        </button>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 relative flex items-center justify-center p-8 bg-slate-100/80 overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-5 pointer-events-none"></div>
        
        <div className="w-full max-w-[340px] relative shadow-2xl rounded-xl transition-all duration-500 ease-in-out">
            {SelectedComponent ? (
                // Wrapper to simulate average card height for preview consistency
                <div className="bg-transparent h-auto min-h-[400px]">
                   <SelectedComponent product={product} config={config} className="h-full" />
                </div>
            ) : (
                <div className="w-full h-64 flex items-center justify-center bg-slate-200 text-slate-400 rounded-xl">
                    Select a card
                </div>
            )}
        </div>
      </div>

      {/* Customization Modal Overlay (Scoped to Right Section) */}
      {isCustomizeOpen && (
        <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
           {/* Modal Header */}
           <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white/80">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Card Options</h2>
                <p className="text-slate-500 text-sm">Configure visible elements</p>
              </div>
              <button 
                onClick={() => setIsCustomizeOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900"
              >
                <X className="w-6 h-6" />
              </button>
           </div>

           {/* Modal Content */}
           <div className="p-6 space-y-4 overflow-y-auto bg-white/50 flex-1">
              <ToggleItem 
                label="Show Price" 
                description="Display product price"
                active={config.showPrice} 
                onClick={() => toggleOption('showPrice')} 
              />
              <ToggleItem 
                label="Show Rating" 
                description="Include star rating & count"
                active={config.showRating} 
                onClick={() => toggleOption('showRating')} 
              />
              <ToggleItem 
                label="Show Border" 
                description="Add structural outline"
                active={config.showBorder} 
                onClick={() => toggleOption('showBorder')} 
              />

              <div className="mt-8 pt-6 border-t border-slate-200">
                 <button 
                  onClick={() => setIsCustomizeOpen(false)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-200"
                 >
                   Done
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const ToggleItem = ({ label, description, active, onClick }: { label: string, description: string, active: boolean, onClick: () => void }) => (
    <div 
        onClick={onClick}
        className={`group flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
            active 
            ? 'border-blue-500 bg-white shadow-md' 
            : 'border-slate-100 bg-slate-50 hover:border-slate-300'
        }`}
    >
        <div className={`mr-4 transition-colors ${active ? 'text-blue-600' : 'text-slate-300 group-hover:text-slate-400'}`}>
            {active ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
        </div>
        <div>
            <span className={`font-bold block ${active ? 'text-slate-900' : 'text-slate-600'}`}>{label}</span>
            <span className="text-xs text-slate-500">{description}</span>
        </div>
    </div>
);