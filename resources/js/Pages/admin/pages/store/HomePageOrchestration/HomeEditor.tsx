import { useState, useRef, useEffect } from 'react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import type { Section } from '@/types/homeEditor';
import { Sidebar } from './Partials/Sidebar';
import { PreviewPanel } from './Partials/PreviewPanel';

// ─── Fallback Data ────────────────────────────────────────────────────────────

const fallbackSections: Section[] = [
  {
    id: 1,
    order: 1,
    sortable_type: 'collection',
    sortable: {
      id: 1,
      name: "Women's Shoes",
      key: 'collections.womens_shoes',
      slug: 'womens-shoes',
      is_active: true,
      layout_config: { displayLimit: 4, gap: 0, paddingInline: 0 },
      card_config: { aspectRatio: '3/4', borderRadius: 0, showPrice: true, showBadge: true, textAlign: 'left', hoverEffect: 'zoom' },
      products: [
        { id: 1, name: 'Air Runner',  price: 129, thumbnail: 'https://placehold.co/180x240/111115/333' },
        { id: 2, name: 'Cloud Step',  price: 99,  thumbnail: 'https://placehold.co/180x240/111115/333' },
        { id: 3, name: 'Trail Blaze', price: 149, thumbnail: 'https://placehold.co/180x240/111115/333' },
        { id: 4, name: 'Soft Stride', price: 89,  thumbnail: 'https://placehold.co/180x240/111115/333' },
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
            eyebrow:   { text: 'New season',                           color: '#d4a853', visible: true },
            title:     { text: 'Summer Sale Hero',                     color: '#efefed', visible: true },
            paragraph: { text: 'Limited time offer on premium gear.',  color: '#6b6b68', visible: true },
            button:    { text: 'Shop now →', bg_color: '#d4a853', text_color: '#0e0e0f', visible: true },
          },
        },
        { slot_key: 'middle', width: '0', is_visible: false },
        {
          slot_key: 'right',
          width: '45',
          is_visible: true,
          main_media: { id: 1,media_type : 'image' , url: 'https://placehold.co/480x220/0a0a10/222', alt: 'Summer Hero' },
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
      slug: 'mens-jackets',
      is_active: true,
      layout_config: { displayLimit: 4, gap: 0, paddingInline: 0 },
      card_config: { aspectRatio: '1/1', borderRadius: 0, showPrice: true, showBadge: false, textAlign: 'left', hoverEffect: 'none' },
      products: [
        { id: 5, name: 'Urban Parka', price: 229, thumbnail: 'https://placehold.co/200x200/111115/333' },
        { id: 6, name: 'Trail Shell', price: 189, thumbnail: 'https://placehold.co/200x200/111115/333' },
        { id: 7, name: 'City Bomber', price: 159, thumbnail: 'https://placehold.co/200x200/111115/333' },
        { id: 8, name: 'Fleece Pro',  price: 139, thumbnail: 'https://placehold.co/200x200/111115/333' },
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
            eyebrow:   { text: 'Limited drop',                                    color: '#c9a227', visible: true },
            title:     { text: 'New Arrivals',                                    color: '#efefed', visible: true },
            paragraph: { text: 'Street-ready essentials for the modern explorer.', color: '#6b6b68', visible: true },
            button:    { text: 'View drop →', bg_color: '#c9a227', text_color: '#0e0e0f', visible: true },
          },
        },
        { slot_key: 'middle', width: '0', is_visible: false },
        {
          slot_key: 'right',
          width: '40',
          is_visible: true,
          main_media: { id: 2,media_type : 'image' , url: 'https://placehold.co/380x180/0a0a0e/222', alt: 'New Arrivals' },
        },
      ],
    },
  },
];

// ─── Mock Routing ─────────────────────────────────────────────────────────────

const mockRouter = { get: (path: string) => { window.location.href = path; } };

const mockRoute = (name: string, params: Record<string, string>) => {
  const routes: Record<string, (p: Record<string, string>) => string> = {
    'banner.edit':     (p) => `/banners/${p.banner}/edit`,
    'collection.edit': (p) => `/collections/${p.collection}/edit`,
  };
  return routes[name]?.(params) || '';
};

// ─── HomeEditor ───────────────────────────────────────────────────────────────

export default function HomeEditor() {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();

  const [sections,      setSections]      = useState<Section[]>(fallbackSections);
  const [sidebarOpen,   setSidebarOpen]   = useState(true);
  const [openMenuId,    setOpenMenuId]    = useState<number | null>(null);
  const [draggedIndex,  setDraggedIndex]  = useState<number | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{ index: number; position: 'top' | 'bottom' } | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        theme={theme}
        isOpen={sidebarOpen}
        openMenuId={openMenuId}
        draggedIndex={draggedIndex}
        dropIndicator={dropIndicator}
        menuRef={menuRef}
        onToggle={() => setSidebarOpen(v => !v)}
        onToggleMenu={setOpenMenuId}
        onMove={handleMove}
        onNavigate={handleNavigate}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
      />
      <PreviewPanel
        sections={sections}
        onPublish={() => console.log('publish')}
        onDiscard={() => setSections(fallbackSections)}
      />
    </div>
  );
}

HomeEditor.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;