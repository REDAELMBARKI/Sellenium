import React, { useState } from 'react';
import { CardGrid } from './CardGrid';
import { ConfigPanel } from './ConfigPanel';

export const DEFAULT_PRODUCT: any = {
  id: 'p1',
  name: 'Ergonomic Chair',
  price: 299.99,
  rating: 4.8,
  image: 'https://picsum.photos/600/600',
  description: 'Premium mesh ergonomic chair with lumbar support and adjustable headrest.',
};


const CardsConfig: React.FC = () => {
  const [selectedCardId, setSelectedCardId] = useState<any>('card-1');
  const [config, setConfig] = useState<any>({
    showPrice: true,
    showRating: true,
    showBorder: false,
  });

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Left Section: Card Templates Grid - 70% width on desktop */}
      <main className="w-full md:w-[70%] h-full relative flex flex-col">
        <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto no-scrollbar">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            <header className="mb-6 flex-shrink-0">
              <h1 className="text-2xl font-bold text-slate-800">Select a Template</h1>
              <p className="text-slate-500">Choose a card style to customize.</p>
            </header>
            
            <div className="flex-grow min-h-0 ">
               <CardGrid
                 selectedId={selectedCardId} 
                 onSelect={setSelectedCardId} 
                 product={DEFAULT_PRODUCT}
                 config={config} // Pass config to grid so they reflect changes too? Usually grid shows defaults or current config. Let's show current config.
               />
            </div>
          </div>
        </div>
      </main>

      {/* Right Section: Preview & Options - 30% width on desktop */}
      <aside className="w-full md:w-[30%] h-auto md:h-full bg-white border-t md:border-t-0 md:border-l border-slate-200 shadow-xl z-10 flex flex-col shrink-0">
        <ConfigPanel 
          selectedCardId={selectedCardId}
          config={config}
          setConfig={setConfig}
          product={DEFAULT_PRODUCT}
        />
      </aside>
    </div>
  );
};

export default CardsConfig;