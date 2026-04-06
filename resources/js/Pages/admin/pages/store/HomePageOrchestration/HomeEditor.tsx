import { useState, useRef, useEffect } from 'react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import type { CollectionSection, CollectionSortable, Section } from '@/types/homeEditorType';
import { Sidebar } from './Partials/Sidebar';
import { PreviewPanel } from './Partials/PreviewPanel';
import axios from 'axios';
import { route } from 'ziggy-js';
import { section } from 'framer-motion/client';

// ─── Fallback Data ────────────────────────────────────────────────────────────

const fallbackSections: Section[] = [
  {
    id: 1,
    order: 1,
    sortable_type: 'collection',
    sortable: {
      id: 1,
      name: "Women's Shoes",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>`,
      key: 'collections.womens_shoes',
      slug: 'womens-shoes',
      is_active: true,
      layout_config: {headerSpacing: 16 , titlePosition : "center" , CollectionPosition : "left" , displayLimit: 4, gap: 0,   paddingInline: 0 },
      card_config: { aspectRatio: '3/4', borderRadius: 0, showPrice: true, showBadge: true, textAlign: 'left', hoverEffect: 'zoom' },
      products: [
        { id: 1, name: 'Air Runner',  brand: 'Nike',     price: 129, compare_price: 160, thumbnail: {  url: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Air Runner'  }, category: { id: 5, name: 'Shoes' }, rating_average: 4.6, reviews: 88,  badge: 'new' },
        { id: 2, name: 'Cloud Step',  brand: 'Adidas',   price: 99,  compare_price: 130, thumbnail: {  url: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Cloud Step'  }, category: { id: 5, name: 'Shoes' }, rating_average: 4.4, reviews: 54 },
        { id: 3, name: 'Trail Blaze', brand: 'Salomon',  price: 149, compare_price: 190, thumbnail: {  url: 'https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Trail Blaze' }, category: { id: 5, name: 'Shoes' }, rating_average: 4.7, reviews: 120, badge: 'hot' },
        { id: 4, name: 'Soft Stride', brand: 'Skechers', price: 89,  compare_price: 110, thumbnail: {  url: 'https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=400',   alt: 'Soft Stride' }, category: { id: 5, name: 'Shoes' }, rating_average: 4.3, reviews: 31 },
        { id: 4, name: 'Soft Stride', brand: 'Skechers', price: 89,  compare_price: 110, thumbnail: {  url: 'https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=400',   alt: 'Soft Stride' }, category: { id: 5, name: 'Shoes' }, rating_average: 4.3, reviews: 31 },
      ],
    },
  },
  {
    id: 2,
    order: 2,
    sortable_type: 'banner',
    sortable: {
      id: 1,
      name: 'Summer Sale Hero',
      key: 'spring_2026',
      slug: 'spring-2026',
      direction: 'ltr',
      aspect_ratio: '21:9',
      border_radius: '0px',
      bg_color: '#111114',
      is_active: true,
      slots: [
        {
          slot_key: 'left',
          width: '55',
          is_visible: true,
          bg_color: '#111114',
          elements: {
            eyebrow:   { text: 'New season',                          color: '#d4a853', visible: true },
            title:     { text: 'Summer Sale Hero',                    color: '#efefed', visible: true },
            paragraph: { text: 'Limited time offer on premium gear.', color: '#6b6b68', visible: true },
            button:    { text: 'Shop now →', bg_color: '#d4a853', text_color: '#0e0e0f', visible: true },
          },
        },
        { slot_key: 'middle', width: '0', is_visible: false },
        {
          slot_key: 'right',
          width: '45',
          is_visible: true,
          main_media: { id: 1, media_type: 'image', url: 'https://placehold.co/480x220/0a0a10/222', alt: 'Summer Hero' },
        },
      ],
    },
  },
  {
    id: 3,
    order: 3,
    sortable_type: 'collection',
    sortable: {
      id: 2,
      name: "Men's Jackets",
      key: 'collections.mens_jackets',
      icon: 'Star',
      slug: 'mens-jackets',
      is_active: true,
      layout_config: {titlePosition : "left" , CollectionPosition : "left"  , displayLimit: 4, gap: 0,headerSpacing: 6 , paddingInline: 0 },
      card_config: { aspectRatio: '1/1', borderRadius: 0, showPrice: true, showBadge: false, textAlign: 'left', hoverEffect: 'none' },
      products: [
        { id: 5, name: 'Urban Parka', brand: 'The North Face', price: 229, compare_price: 299, thumbnail: {  url: 'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Urban Parka' }, category: { id: 6, name: 'Jackets' }, rating_average: 4.8, reviews: 210, badge: 'hot' },
        { id: 6, name: 'Trail Shell', brand: 'Patagonia',      price: 189, compare_price: 249, thumbnail: {  url: 'https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg?auto=compress&cs=tinysrgb&w=400',   alt: 'Trail Shell' }, category: { id: 6, name: 'Jackets' }, rating_average: 4.7, reviews: 145 },
        { id: 7, name: 'City Bomber', brand: 'Zara',           price: 159, compare_price: 199, thumbnail: {  url: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'City Bomber' }, category: { id: 6, name: 'Jackets' }, rating_average: 4.5, reviews: 78,  badge: 'new' },
        { id: 8, name: 'Fleece Pro',  brand: 'Columbia',       price: 139, compare_price: 179, thumbnail: {  url: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Fleece Pro'  }, category: { id: 6, name: 'Jackets' }, rating_average: 4.6, reviews: 93 },
        { id: 8, name: 'Fleece Pro',  brand: 'Columbia',       price: 139, compare_price: 179, thumbnail: {  url: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Fleece Pro'  }, category: { id: 6, name: 'Jackets' }, rating_average: 4.6, reviews: 93 },
      ],
    },
  },
  {
    id: 4,
    order: 4,
    sortable_type: 'banner',
    sortable: {
      id: 2,
      name: 'New Arrivals Banner',
      key: 'urban_2026',
      slug: 'urban-vibes',
      direction: 'rtl',
      aspect_ratio: '21:9',
      border_radius: '0px',
      bg_color: '#0d0d11',
      is_active: true,
      slots: [
        {
          slot_key: 'left',
          width: '60',
          is_visible: true,
          bg_color: '#0d0d11',
          elements: {
            eyebrow:   { text: 'Limited drop',                                     color: '#c9a227', visible: true },
            title:     { text: 'New Arrivals',                                     color: '#efefed', visible: true },
            paragraph: { text: 'Street-ready essentials for the modern explorer.', color: '#6b6b68', visible: true },
            button:    { text: 'View drop →', bg_color: '#c9a227', text_color: '#0e0e0f', visible: true },
          },
        },
        { slot_key: 'middle', width: '0', is_visible: false },
        {
          slot_key: 'right',
          width: '40',
          is_visible: true,
          main_media: { id: 2, media_type: 'image', url: 'https://placehold.co/380x180/0a0a0e/222', alt: 'New Arrivals' },
        },
      ],
    },
  },
];


const mockRouter = { get: (path: string) => { window.location.href = path; } };
const mockRoute = (name: string, params: Record<string, string>) => {
  const routes: Record<string, (p: Record<string, string>) => string> = {
    'banner.edit':     (p) => `/banners/${p.banner}/edit`,
    'collection.edit': (p) => `/collections/${p.collection}/edit`,
  };
  return routes[name]?.(params) || '';
};

export default function HomeEditor({sectionss = []}: { sectionss: Section[] }) {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  const [sections,      setSections]      = useState<Section[]>(sectionss);
  const [sidebarOpen,   setSidebarOpen]   = useState(true);
  const [openMenuId,    setOpenMenuId]    = useState<number | null>(null);
  const [draggedIndex,  setDraggedIndex]  = useState<number | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{ index: number; position: 'top' | 'bottom' } | null>(null);
  const [collectionCardsLimit , setCollectionCardsLimit] = useState<{collection_id :number , limit : number}[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
     const getProducts = async () => {
          const res = await axios.get(route('collections.limited-products'), {
              params: {
                  collections: sections.map(section => ({
                      collection_id: section.sortable.id,
                      limit: collectionCardsLimit.find(el => el.collection_id == section.sortable.id)?.limit || 5,
                  })),
              },
           });
          setSections(prev => {
              return prev.map(sec => {
                   if(sec.sortable_type !== 'collection') return sec ;
                   const col = res.data.find(col => col.collection_id === sec.sortable.id) ;
                   if(!col)  return sec ;
                   return {
                             ...sec , 
                              sortable : {
                                  ...sec.sortable ,
                                  products : col.products ?? []
                              }
                         };
               })
          })
     }
     getProducts()

  }, [sectionss , collectionCardsLimit]);
  
  // to be continued 
  useEffect(() => {
  const containerRef = document.getElementById('sections-container') // or use a ref

  const handleResize = () => {
    const containerWidth = containerRef?.offsetWidth ?? window.innerWidth
    
    const limits = sections
      .filter(sec => sec.sortable_type === 'App\\Models\\RuleBasedCollection')
      .map((sec: CollectionSection) => {
        const cardConfig  = sec.sortable.card_config
        const layoutConfig = sec.sortable.layout_config

        // aspect ratio tells you h/w ratio — e.g. "3/4" means card is taller than wide
        // but you need a base card width — use minCardWidth from config or a sensible default
        const minCardWidth = cardConfig.minCardWidth ?? 160  // px — minimum before cards become too small
        const gap          = layoutConfig.gap ?? 16

        // how many cards fit at minimum width
        const fitting = Math.floor((containerWidth + gap) / (minCardWidth + gap))

        return {
          collection_id: sec.sortable.id,
          limit: Math.max(1, Math.min(fitting, layoutConfig.displayLimit ?? 6)),
        }
      })

    setCollectionCardsLimit(limits)
  }

  handleResize() // fire once on mount too
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [sections])

  const reorder = (arr: Section[]): Section[] =>
    arr.map((s, i) => ({ ...s, order: i + 1 }));

  const handleMove = (id: number, action: 'move_to_start' | 'move_up' | 'move_down' | 'move_to_end') => {
    const ci = sections.findIndex(s => s.id === id);
    if (ci === -1) return;
    let ni = ci;
    if      (action === 'move_to_start') ni = 0;
    else if (action === 'move_up')       ni = Math.max(0, ci - 1);
    else if (action === 'move_down')     ni = Math.min(sections.length - 1, ci + 1);
    else if (action === 'move_to_end')   ni = sections.length - 1;
    if (ni === ci) return;
    const arr = [...sections];
    const [moved] = arr.splice(ci, 1);
    arr.splice(ni, 0, moved);
    setSections(reorder(arr));
    setOpenMenuId(null);
  };

  const handleDragStart = (index: number) => setDraggedIndex(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDropIndicator({
      index,
      position: e.clientY < rect.top + rect.height / 2 ? 'top' : 'bottom',
    });
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null) return;
    let ti = index;
    if (dropIndicator?.position === 'bottom') ti += 1;
    if (draggedIndex < ti) ti -= 1;
    const arr = [...sections];
    const [moved] = arr.splice(draggedIndex, 1);
    arr.splice(ti, 0, moved);
    setSections(reorder(arr));
    setDraggedIndex(null);
    setDropIndicator(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDropIndicator(null);
  };

  const handleNavigate = (section: Section) => {
    if (section.sortable_type === 'banner') {
      mockRouter.get(mockRoute('banner.edit', { banner: section.sortable.slug }));
    } else {
      mockRouter.get(mockRoute('collection.edit', { collection: section.sortable.slug }));
    }
    setOpenMenuId(null);
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      background: theme.bg,
    }}>
      <Sidebar
        sections={sections}
        isOpen={sidebarOpen}
        theme={theme}
        openMenuId={openMenuId}
        draggedIndex={draggedIndex}
        dropIndicator={dropIndicator}
        menuRef={menuRef}
        onToggleMenu={setOpenMenuId}
        onMove={handleMove}
        onNavigate={handleNavigate}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
      />
      <PreviewPanel
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(v => !v)}
        sections={sections}
        onPublish={() => console.log('publish')}
        onDiscard={() => setSections(fallbackSections)}
      />
    </div>
  );
}

HomeEditor.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;