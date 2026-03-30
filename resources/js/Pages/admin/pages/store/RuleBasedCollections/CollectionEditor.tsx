import React, { useState, useMemo, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import {
  Trash2, Sliders, GripVertical,
  PanelLeft, PanelRight, Maximize2, ChevronRight, ChevronLeft,
  RotateCcw, Save, AlertTriangle
} from 'lucide-react';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import CollectionEditorNav from './Partials/CollectionEditorNav';
import CollectionEditorInspector from './Partials/CollectionEditorInspector';
import { route } from 'ziggy-js';

// ─────────────────────────────────────────────
// UNSAVED CHANGES MODAL
// ─────────────────────────────────────────────

interface UnsavedModalProps {
  sectionName: string;
  onDiscard: () => void;
  onKeep: () => void;
}

function UnsavedModal({ sectionName, onDiscard, onKeep}: UnsavedModalProps) {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onKeep} />
      <div
        className="relative z-10 w-[380px] rounded-2xl border p-6 shadow-2xl"
        style={{ backgroundColor: theme.bgSecondary, borderColor: theme.border }}
      >
        <div className="flex items-start gap-4 mb-6">
          <div
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${theme.primary}20` }}
          >
            <AlertTriangle size={16} style={{ color: theme.primary }} />
          </div>
          <div>
            <p className="text-sm font-black mb-1.5" style={{ color: theme.text }}>
              You have unsaved changes
            </p>
            <p className="text-[11px] leading-relaxed" style={{ color: theme.text, opacity: 0.55 }}>
              Changes to{' '}
              <span className="font-bold" style={{ opacity: 1, color: theme.text }}>
                {sectionName}
              </span>{' '}
              will be lost if you switch without publishing first.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onKeep}
            className="flex-1 py-2.5 text-[10px] font-black uppercase rounded-xl transition-all hover:opacity-80"
            style={{ backgroundColor: theme.primary, color: theme.textInverse }}
          >
            Keep Editing
          </button>
          <button
            onClick={onDiscard}
            className="flex-1 py-2.5 text-[10px] font-black uppercase rounded-xl border transition-all hover:opacity-60"
            style={{ borderColor: theme.border, color: theme.text }}
          >
            Discard Changes
          </button>
        </div>
      </div>
    </div>
  );
}


interface CenterPanelProps {
  activeSection: CollectionPayload;
  globalCardConfig: CardConfig;
  isDirty: boolean;
  isSaving: boolean;
  onReset: () => void;
  onPublish: () => void;
}

function CenterPanel({ activeSection, globalCardConfig, isDirty , isSaving, onReset, onPublish }: CenterPanelProps) {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();

  return (
    <main
      className="flex-1 overflow-y-auto scrollbar-hide min-w-0"
      style={{ backgroundColor: theme.bg }}
    >
      <header
        className="sticky top-0 z-10 h-14 border-b flex items-center justify-between px-6"
        style={{ borderColor: theme.border, backgroundColor: theme.bg }}
      >
        <div className="flex items-center gap-3">
          <h1
            className="text-xs font-black uppercase tracking-widest"
            style={{ color: theme.textSecondary }}
          >
            {activeSection.name} Editor
          </h1>
          {isDirty && (
            <span
              className="px-2 py-0.5 text-[8px] font-black uppercase rounded-full"
              style={{ backgroundColor: `${theme.primary}20`, color: theme.primary }}
            >
              Unsaved
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-[10px] font-black uppercase opacity-40 hover:opacity-100 transition-opacity"
          >
            <RotateCcw size={12} /> Reset to Factory
          </button>

          <button
            onClick={onPublish}
            disabled={!isDirty || isSaving}
            className={`
              flex items-center gap-2 px-6 py-1.5 text-[10px] font-black uppercase rounded
              transition-all duration-300
              ${isDirty ? 'opacity-100 active:scale-95' : 'opacity-25 cursor-not-allowed'}
            `}
            style={{
              backgroundColor: theme.primary,
              color: theme.textInverse,
              boxShadow: isDirty
                ? `0 0 0 3px ${theme.primary}30, 0 4px 14px ${theme.primary}40`
                : 'none',
            }}
          >
            <Save size={12} /> {isSaving ? 'Publishing...' : isDirty ? 'Publish Changes' : 'Saved'}
          </button>
        </div>
      </header>

      <div className="p-12">
        <div className="max-w-[1000px] mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-black italic">{activeSection.name}</h2>
            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">
              Live Storefront Preview
            </p>
          </div>

          <div
            className="flex flex-nowrap w-full"
            style={{
              gap: `${activeSection.layout_config.gap}px`,
              paddingInline: `${activeSection.layout_config.paddingInline}px`,
            }}
          >
            {[...Array(activeSection.layout_config.displayLimit)].map((_, i) => (
              <div key={i} className="flex-1 flex flex-col min-w-0">
                <div
                  className="w-full relative overflow-hidden group border transition-all"
                  style={{
                    aspectRatio: globalCardConfig.aspectRatio,
                    borderRadius: `${globalCardConfig.borderRadius}px`,
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    boxShadow: theme.shadow,
                  }}
                >
                  <img
                    src={`https://picsum.photos/seed/p${activeSection.id}${i}/800/1000`}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      globalCardConfig.hoverEffect === 'zoom' ? 'group-hover:scale-110' : ''
                    }`}
                    alt=""
                  />
                  {globalCardConfig.hoverEffect === 'scrim' && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                  {globalCardConfig.showBadge && (
                    <div
                      className="absolute top-3 left-3 px-2 py-1 text-[8px] font-black uppercase rounded shadow-sm"
                      style={{ backgroundColor: theme.primary, color: theme.textInverse }}
                    >
                      Hot
                    </div>
                  )}
                </div>
                <div className="mt-4" style={{ textAlign: globalCardConfig.textAlign }}>
                  <p className="text-xs font-bold uppercase tracking-tighter mb-1" style={{ color: theme.text }}>
                    Sample Product Name
                  </p>
                  {globalCardConfig.showPrice && (
                    <p className="text-sm font-black" style={{ color: theme.textSecondary }}>$149.00</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CollectionEditor() {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  const { 
    collections = COLLECTIONS_PAYLOAD, 
    app_factory_config = FACTORY_PAYLOAD,
    selectedCollection 
  } = usePage().props as any;
  const [isSaving, setIsSaving] = useState(false);
  const [sections, setSections] = useState<CollectionPayload[]>(collections);
  const [activeId, setActiveId] = useState<number>(selectedCollection?.id || collections[0].id);
  const [globalCardConfig, setGlobalCardConfig] = useState<CardConfig>(
    selectedCollection?.card_config || collections[0].card_config
  );
  
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [pendingSwitchId, setPendingSwitchId] = useState<number | null>(null);

  useEffect(() => {
    setSections(collections);
    if (selectedCollection) {
      setActiveId(selectedCollection.id);
      setGlobalCardConfig(selectedCollection.card_config);
    }
  }, [collections, selectedCollection]);

  const [savedSnapshot, setSavedSnapshot] = useState({
    sections: collections,
    globalCardConfig: selectedCollection?.card_config || collections[0].card_config,
  });

  const activeSection = sections.find((s) => s.id === activeId) ?? sections[0];

  let isDirty = useMemo(
    () => JSON.stringify({ sections, globalCardConfig }) !== JSON.stringify(savedSnapshot),
    [sections, globalCardConfig, savedSnapshot]
  );

  const updateSection = (updates: Partial<CollectionPayload>) =>
    setSections((prev) => prev.map((s) => (s.id === activeId ? { ...s, ...updates } : s)));

  const updateLayout = (updates: Partial<CollectionPayload['layout_config']>) =>
    updateSection({ layout_config: { ...activeSection.layout_config, ...updates } });

  const updateGlobalCard = (updates: Partial<CardConfig>) =>
    setGlobalCardConfig((prev) => ({ ...prev, ...updates }));

  const handleSelectSection = (id: number) => {
    if (id === activeId) return;

    if (isDirty) {
      setPendingSwitchId(id);
    } else {
      const section = sections.find(s => s.id === id);
      
      router.visit(route('collections.edit', { collection: section?.slug }));
    }
  };

  const handleDiscard = () => {
    if (pendingSwitchId !== null) {
      setSections(savedSnapshot.sections);
      setGlobalCardConfig(savedSnapshot.globalCardConfig);
      router.visit(route('collections.edit', pendingSwitchId));
    }
    setPendingSwitchId(null);
  };

  const handlePublish = () => {
    if (!isDirty) return;
    
    const payload = {
       ...activeSection,
       card_config: globalCardConfig,
       order_manifest: sections.map((s, idx) => ({ id: s.id, order: idx }))
    };

    const collection = sections.find((s) => s.id === activeId);
    router.put(
      route('collections.update', { collection: collection?.slug }),
      payload,
      { 
        onBefore: () => setIsSaving(true),
        onSuccess: (page) => {
          const serverCollections = page.props.collections as CollectionPayload[]; // Ensure this matches what your controller returns
          const serverFactoryConfig = page.props.app_factory_config as CollectionPayload[]; 
          setSavedSnapshot({ 
              sections: serverCollections, 
              globalCardConfig: serverFactoryConfig 
          });
          
          setSections(serverCollections);
          setGlobalCardConfig(serverFactoryConfig);
      },
    onFinish: () => setIsSaving(false),
        preserveScroll: true,
      }
    );
  };

  const resetToFactory = () => {
    const factory = app_factory_config.find((f: any) => f.id === activeId);
    if (factory) {
      updateSection({
        layout_config: { ...factory.layout_config },
        rules: [...factory.rules],
        active: factory.active,
        name: factory.name,
      });
      setGlobalCardConfig({ ...factory.card_config });
    }
  };

  const handleReorderCollections = (slug : string, action: 'increment' | 'decrement' | 'start' | 'end') => {
      router.patch(route('collections.reorder', { collection: slug }), { action });
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      <CollectionEditorNav
        open={leftOpen}
        onToggle={() => setLeftOpen((v) => !v)}
        sections={sections}
        activeId={activeId}
        onSelect={handleSelectSection}
        dirtyId={isDirty ? activeId : null}
        onReorder={(slug: string, action: 'increment' | 'decrement' | 'start' | 'end') => handleReorderCollections(slug , action)}
      />

      <CenterPanel
        activeSection={activeSection}
        globalCardConfig={globalCardConfig}
        isDirty={isDirty}
        onReset={resetToFactory}
        onPublish={handlePublish}
        isSaving={isSaving}
      />

      <CollectionEditorInspector
        open={rightOpen}
        onToggle={() => setRightOpen((v) => !v)}
        activeSection={activeSection}
        globalCardConfig={globalCardConfig}
        onUpdateSection={updateSection}
        onUpdateLayout={updateLayout}
        onUpdateGlobalCard={updateGlobalCard}
      />

      {pendingSwitchId !== null && (
        <UnsavedModal
          sectionName={activeSection.name}
          onDiscard={handleDiscard}
          onKeep={() => setPendingSwitchId(null)}
        />
      )}
    </div>
  );
}

CollectionEditor.layout = (page: any) => <AdminLayout>{page}</AdminLayout>;

const FACTORY_PAYLOAD: CollectionPayload[] = [
  {
    id: 1,
    key: 'deals',
    slug: 'top-deals',
    name: 'Top Deals',
    active: true,
    layout_config: { displayLimit: 4, gap: 16, paddingInline: 0 },
    card_config: { aspectRatio: '3/4', borderRadius: 12, showPrice: true, showBadge: true, textAlign: 'left', hoverEffect: 'zoom' },
    rules: [{ id: 'f1', field: 'discount', operator: '>=', value: '25' }],
  },
  {
    id: 2,
    key: 'category',
    name: 'Featured Footwear',
    slug: 'featured-footwear',
    active: true,
    layout_config: { displayLimit: 3, gap: 24, paddingInline: 0 },
    card_config: { aspectRatio: '3/4', borderRadius: 12, showPrice: true, showBadge: true, textAlign: 'left', hoverEffect: 'zoom' },
    rules: [{ id: 'f2', field: 'category_id', operator: '=', value: 'Menswear' }],
  },
];

const COLLECTIONS_PAYLOAD: CollectionPayload[] = [
  {
    id: 1,
    key: 'deals',
    name: 'Top Deals',
    slug: 'top-deals',
    active: true,
    layout_config: { displayLimit: 2, gap: 32, paddingInline: 12 },
    card_config: { aspectRatio: '1/1', borderRadius: 40, showPrice: false, showBadge: true, textAlign: 'center', hoverEffect: 'none' },
    rules: [{ id: '1', field: 'discount', operator: '>=', value: '25' }],
  },
  {
    id: 2,
    key: 'category',
    name: 'Featured Footwear',
    slug: 'featured-footwear',
    active: true,
    layout_config: { displayLimit: 3, gap: 24, paddingInline: 0 },
    card_config: { aspectRatio: '3/4', borderRadius: 12, showPrice: true, showBadge: true, textAlign: 'left', hoverEffect: 'zoom' },
    rules: [{ id: '2', field: 'category_id', operator: '=', value: 'Menswear' }],
  },
];