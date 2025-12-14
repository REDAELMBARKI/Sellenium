import React from 'react';
import Card1 from './cardsPrototypes/Card1';
import Card2 from './cardsPrototypes/Card2';
import Card3 from './cardsPrototypes/Card3';
import Card4 from './cardsPrototypes/Card4';
import { Card5 } from './cardsPrototypes/Card5';
import { Card6 } from './cardsPrototypes/Card6';

interface CardGridProps extends Omit<any, 'className'> {
  selectedId: any;
  onSelect: (id: any) => void;
}

const templates: { id: any; Component: React.FC<any> }[] = [
  { id: 'card-1', Component: Card1 },
  { id: 'card-2', Component: Card2 },
  { id: 'card-3', Component: Card3 },
  { id: 'card-4', Component: Card4 },
  { id: 'card-5', Component: Card5 },
  { id: 'card-6', Component: Card6 },

];

export const CardGrid: React.FC<CardGridProps> = ({ selectedId, onSelect, product, config }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
      {templates.map(({ id, Component }) => (
        <div 
          key={id} 
          onClick={() => onSelect(id)}
          className={`
            relative cursor-pointer transition-all duration-300 rounded-xl group
            ${selectedId === id 
              ? 'ring-4 ring-blue-500 ring-offset-4 ring-offset-slate-50 scale-[1.02] z-10 shadow-2xl' 
              : 'hover:ring-2 hover:ring-slate-300 hover:scale-[1.01] hover:shadow-lg opacity-90 hover:opacity-100'
            }
          `}
        >
          {/* Label Badge */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm transition-colors z-20 ${
              selectedId === id ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500 group-hover:bg-slate-800 group-hover:text-white'
          }`}>
            {id.replace('-', ' ')}
          </div>

          <div className="h-full w-full overflow-hidden rounded-xl bg-white isolate">
             <Component product={product} config={config} />
          </div>
        </div>
      ))}
    </div>
  );
};