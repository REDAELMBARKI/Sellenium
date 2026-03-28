import React, { useState } from 'react';
import { 
  MoreVertical, Trash2, Settings, Sliders, GripVertical, 
  PanelLeft, PanelRight, Maximize2, ChevronRight, ChevronLeft
} from 'lucide-react';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';

// --- THE EXPECTED BACKEND PAYLOAD STRUCTURE ---
interface CatalogSectionPayload {
  id: number;
  section_type: 'deals' | 'curated' | 'category' | 'new_arrivals';
  name: string;
  active: boolean;
  layout_config: {
    displayLimit: number;
    gap: number;
    paddingInline: number;
  };
  card_config: {
    aspectRatio: string;
    borderRadius: number;
    showPrice: boolean;
    showBadge: boolean;
    textAlign: 'left' | 'center';
    hoverEffect: 'zoom' | 'scrim' | 'none';
  };
  rules: {
    id: string;
    field: string;
    operator: string;
    value: string;
    label?: string;
  }[];
}

const CATEGORIES = ["Menswear", "Electronics", "Home & Living", "Beauty", "Accessories"];
const BRANDS = ["Nike", "Apple", "Samsung", "Zara", "Adidas"];

export default function ProductSectionEditor() {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  
  const [sections, setSections] = useState<CatalogSectionPayload[]>(INITIAL_PAYLOAD);
  const [activeId, setActiveId] = useState<number>(1);
  
  // Panel States: Now using 40px for "closed" to keep the button visible
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  const activeSection = sections.find(s => s.id === activeId) || sections[0];

  const updateSection = (updates: any) => {
    setSections(prev => prev.map(s => s.id === activeId ? { ...s, ...updates } : s));
  };

  const updateCard = (updates: any) => {
    updateSection({ card_config: { ...activeSection.card_config, ...updates } });
  };

  const updateLayout = (updates: any) => {
    updateSection({ layout_config: { ...activeSection.layout_config, ...updates } });
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: theme.bg, color: theme.text }}>
      
      {/* --- LEFT: NAVIGATION (Collapses to 40px) --- */}
      <aside 
        className="border-r flex flex-col transition-all duration-300 relative" 
        style={{ 
          width: leftOpen ? '260px' : '40px',
          backgroundColor: theme.sidebarBg, 
          borderColor: theme.sidebarBorder 
        }}
      >
        <div className="p-3 border-b flex justify-between items-center overflow-hidden whitespace-nowrap" style={{ borderColor: theme.sidebarBorder }}>
          {leftOpen && <span className="text-[10px] font-black uppercase opacity-50">Site Structure</span>}
          <button 
            onClick={() => setLeftOpen(!leftOpen)} 
            className={`p-1 hover:bg-black/10 rounded transition-all ${!leftOpen ? 'mx-auto' : ''}`}
          >
            {leftOpen ? <PanelLeft size={16}/> : <ChevronRight size={16}/>}
          </button>
        </div>

        {leftOpen && (
          <div className="p-2 space-y-1 overflow-y-auto">
            {sections.map(s => (
              <div key={s.id} onClick={() => setActiveId(s.id)} 
                   className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-xs font-bold transition-colors"
                   style={{ 
                     backgroundColor: activeId === s.id ? theme.sidebarActive : 'transparent', 
                     color: activeId === s.id ? theme.sidebarActiveFg : theme.sidebarFg 
                   }}>
                <GripVertical size={14} className="opacity-30" />
                <span className="truncate">{s.name}</span>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* --- CENTER: STAGE --- */}
      <main className="flex-1 flex flex-col relative overflow-hidden" style={{ backgroundColor: theme.bg }}>
        <header className="h-14 border-b flex items-center justify-between px-6" style={{ borderColor: theme.border, backgroundColor: theme.bg }}>
           <h1 className="text-xs font-black uppercase tracking-widest" style={{ color: theme.textSecondary }}>
             {activeSection.name} Editor
           </h1>
           <div className="flex gap-2">
              <button className="px-6 py-1.5 text-[10px] font-black uppercase rounded shadow-lg transition-transform active:scale-95" 
                      style={{ backgroundColor: theme.primary, color: theme.textInverse }}>
                Publish Changes
              </button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 scrollbar-hide">
          <div className="max-w-[1000px] mx-auto">
             <div className="mb-10">
                <h2 className="text-3xl font-black italic">{activeSection.name}</h2>
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">Live Storefront Preview</p>
             </div>

             <div className="flex flex-nowrap w-full" 
                  style={{ gap: `${activeSection.layout_config.gap}px`, paddingInline: `${activeSection.layout_config.paddingInline}px` }}>
                {[...Array(activeSection.layout_config.displayLimit)].map((_, i) => (
                  <div key={i} className="flex-1 flex flex-col min-w-0">
                    <div 
                      className="w-full relative overflow-hidden group border transition-all"
                      style={{ 
                        aspectRatio: activeSection.card_config.aspectRatio, 
                        borderRadius: `${activeSection.card_config.borderRadius}px`,
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                        boxShadow: theme.shadow
                      }}
                    >
                      <img src={`https://picsum.photos/seed/p${activeId}${i}/800/1000`} className={`w-full h-full object-cover transition-transform duration-700 ${activeSection.card_config.hoverEffect === 'zoom' ? 'group-hover:scale-110' : ''}`} />
                      {activeSection.card_config.hoverEffect === 'scrim' && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                      {activeSection.card_config.showBadge && (
                         <div className="absolute top-3 left-3 px-2 py-1 text-[8px] font-black uppercase rounded shadow-sm" style={{ backgroundColor: theme.primary, color: theme.textInverse }}>Hot</div>
                      )}
                    </div>
                    <div className="mt-4" style={{ textAlign: activeSection.card_config.textAlign }}>
                       <p className="text-xs font-bold uppercase tracking-tighter mb-1" style={{ color: theme.text }}>Sample Product Name</p>
                       {activeSection.card_config.showPrice && <p className="text-sm font-black" style={{ color: theme.textSecondary }}>$149.00</p>}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </main>

      {/* --- RIGHT: INSPECTOR (Collapses to 40px) --- */}
      <aside 
        className="border-l flex flex-col transition-all duration-300 relative" 
        style={{ 
          width: rightOpen ? '320px' : '40px',
          backgroundColor: theme.bgSecondary, 
          borderColor: theme.border 
        }}
      >
        <div className="p-3 border-b flex items-center overflow-hidden" style={{ borderColor: theme.border }}>
          <button 
            onClick={() => setRightOpen(!rightOpen)} 
            className={`p-1 hover:bg-black/10 rounded transition-all ${!rightOpen ? 'mx-auto' : 'mr-3'}`}
          >
            {rightOpen ? <PanelRight size={16}/> : <ChevronLeft size={16}/>}
          </button>
          {rightOpen && <span className="text-[10px] font-black uppercase opacity-40">Inspector</span>}
        </div>

        {rightOpen && (
          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
            {/* Layout Section - Restored Range Inputs */}
            <section className="space-y-4">
               <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-40 mb-4"><Maximize2 size={12}/> Layout & Spacing</div>
               <div className="space-y-4">
                  <div>
                     <label className="text-[10px] font-bold block mb-1">Card Count ({activeSection.layout_config.displayLimit})</label>
                     <input type="range" min="1" max="5" value={activeSection.layout_config.displayLimit} onChange={e => updateLayout({ displayLimit: Number(e.target.value) })} className="w-full cursor-pointer" style={{ accentColor: theme.primary }}/>
                  </div>
                  <div>
                     <label className="text-[10px] font-bold block mb-1">Gap Size ({activeSection.layout_config.gap}px)</label>
                     <input type="range" min="0" max="40" value={activeSection.layout_config.gap} onChange={e => updateLayout({ gap: Number(e.target.value) })} className="w-full cursor-pointer" style={{ accentColor: theme.primary }}/>
                  </div>
                  <div>
                     <label className="text-[10px] font-bold block mb-1">Border Radius ({activeSection.card_config.borderRadius}px)</label>
                     <input type="range" min="0" max="40" value={activeSection.card_config.borderRadius} onChange={e => updateCard({ borderRadius: Number(e.target.value) })} className="w-full cursor-pointer" style={{ accentColor: theme.primary }}/>
                  </div>
               </div>
            </section>

            <hr className="opacity-10" />

            {/* Rules Section */}
            <section className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-40"><Sliders size={12}/> Selection Rules</div>
                 <button className="text-[10px] font-bold" style={{ color: theme.primary }} onClick={() => {
                    const newRule = { id: Date.now().toString(), field: 'category_id', operator: '=', value: '' };
                    updateSection({ rules: [...activeSection.rules, newRule] });
                 }}>+ Add Rule</button>
              </div>

              <div className="space-y-3">
                {activeSection.rules.map((rule) => (
                  <div key={rule.id} className="p-3 border rounded-xl relative group shadow-sm" style={{ backgroundColor: theme.bg, borderColor: theme.border }}>
                     <select 
                        className="w-full text-[10px] font-black mb-2 border-b bg-transparent outline-none pb-1"
                        style={{ borderColor: theme.border, color: theme.text }}
                        value={rule.field}
                        onChange={(e) => {
                           const updated = activeSection.rules.map(r => r.id === rule.id ? { ...r, field: e.target.value, value: '' } : r);
                           updateSection({ rules: updated });
                        }}
                      >
                        <option value="discount">Discount Percentage</option>
                        <option value="price">Price Range</option>
                        <option value="category_id">Filter by Category</option>
                        <option value="brand_id">Filter by Brand</option>
                     </select>

                     {(rule.field === 'category_id' || rule.field === 'brand_id') ? (
                        <select 
                          className="w-full p-2 text-[10px] border rounded bg-transparent"
                          style={{ borderColor: theme.border, color: theme.text }}
                          value={rule.value}
                          onChange={(e) => {
                             const updated = activeSection.rules.map(r => r.id === rule.id ? { ...r, value: e.target.value } : r);
                             updateSection({ rules: updated });
                          }}
                        >
                           <option value="">Select {rule.field === 'category_id' ? 'Category' : 'Brand'}...</option>
                           {(rule.field === 'category_id' ? CATEGORIES : BRANDS).map(name => (
                              <option key={name} value={name}>{name}</option>
                           ))}
                        </select>
                     ) : (
                        <div className="flex gap-2">
                          <select className="p-1 text-[10px] border rounded bg-transparent" style={{ borderColor: theme.border, color: theme.text }} value={rule.operator}>
                             <option value=">=">{'>='}</option>
                             <option value="<=">{'<='}</option>
                             <option value="=">{'='}</option>
                          </select>
                          <input className="flex-1 p-1 text-[10px] border rounded outline-none bg-transparent" 
                                 style={{ borderColor: theme.border, color: theme.text }}
                                 placeholder="Value" value={rule.value} />
                        </div>
                     )}

                     <button onClick={() => updateSection({ rules: activeSection.rules.filter(r => r.id !== rule.id) })}
                             className="absolute -top-2 -right-2 p-1.5 border rounded-full text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                             style={{ backgroundColor: theme.bg, borderColor: theme.border }}>
                        <Trash2 size={10} />
                     </button>
                  </div>
                ))}
              </div>
            </section>

            <hr className="opacity-10" />

            {/* Visibility Toggle Section */}
            <section className="space-y-3">
               {[
                 { label: 'Show Price', key: 'showPrice', target: 'card' },
                 { label: 'Show Promo Badges', key: 'showBadge', target: 'card' },
                 { label: 'Visible to Public', key: 'active', target: 'section' }
               ].map((item) => (
                 <div key={item.key} className="flex items-center justify-between p-3 border rounded-xl" style={{ borderColor: theme.border }}>
                    <span className="text-[10px] font-bold uppercase opacity-60">{item.label}</span>
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded"
                      style={{ accentColor: theme.primary }}
                      checked={item.target === 'card' ? (activeSection.card_config as any)[item.key] : (activeSection as any)[item.key]} 
                      onChange={e => item.target === 'card' ? updateCard({ [item.key]: e.target.checked }) : updateSection({ [item.key]: e.target.checked })} 
                    />
                 </div>
               ))}
            </section>
          </div>
        )}
      </aside>
    </div>
  );
}

ProductSectionEditor.layout = (page: any) => <AdminLayout>{page}</AdminLayout>

const INITIAL_PAYLOAD: CatalogSectionPayload[] = [
  { 
    id: 1, 
    section_type: 'deals',
    name: 'Top Deals', 
    active: true,
    layout_config: { displayLimit: 4, gap: 16, paddingInline: 0 },
    card_config: { aspectRatio: '3/4', borderRadius: 12, showPrice: true, showBadge: true, textAlign: 'left', hoverEffect: 'zoom' },
    rules: [{ id: '1', field: 'discount', operator: '>=', value: '25' }]
  },
  { 
    id: 2, 
    section_type: 'category',
    name: 'Featured Footwear', 
    active: true,
    layout_config: { displayLimit: 3, gap: 24, paddingInline: 0 },
    card_config: { aspectRatio: '1/1', borderRadius: 24, showPrice: true, showBadge: false, textAlign: 'center', hoverEffect: 'scrim' },
    rules: [{ id: '2', field: 'category_id', operator: '=', value: 'Menswear' }]
  }
];