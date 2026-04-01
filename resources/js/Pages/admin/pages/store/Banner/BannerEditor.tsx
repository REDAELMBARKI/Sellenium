import React, { useState, useRef, useMemo, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { route } from 'ziggy-js';
import { Banner } from '@/types/bannerTypes';
import BannerNav from './Partials/BannerNav';
import BannerCenterPanel from './Partials/BannerPreview';
import BannerInspector from './Partials/BannerInspector';
import UnsavedModal from '@/components/ui/UnsavedModal';




export default function BannerEditor() {
  const { state: { currentTheme: t } } = useStoreConfigCtx();

  const {
    banners           = [],
    app_factory_config = [],
    selectedBanner,
  } = usePage().props as any;

  // ── Local state ────────────────────────────────────────────────────────────
  const [localBanners, setLocalBanners] = useState<Banner[]>(
    [...banners].sort((a, b) => a.order - b.order)
  );
  const [activeId, setActiveId] = useState<number>(
    selectedBanner?.id ?? banners[0]?.id
  );
  const [leftOpen,  setLeftOpen]  = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [isSaving,  setIsSaving]  = useState(false);
  const [pendingSwitchId, setPendingSwitchId] = useState<number | null>(null);

  // Snapshot for dirty-checking (never contains File objects)
  const [savedSnapshot, setSavedSnapshot] = useState<Banner[]>(
    JSON.parse(JSON.stringify(banners))
  );

  // Side-ref for pending File uploads — kept outside state so they don't affect isDirty JSON diff
  const pendingFiles = useRef<Record<string, File>>({});

  // ── Sync on Inertia re-hydrate ─────────────────────────────────────────────
  useEffect(() => {
    const sorted = [...banners].sort((a, b) => a.order - b.order);
    setLocalBanners(sorted);
    setSavedSnapshot(JSON.parse(JSON.stringify(sorted)));
    if (selectedBanner) setActiveId(selectedBanner.id);
  }, [banners, selectedBanner]);

  const activeBanner = useMemo(
    () => localBanners.find(b => b.id === activeId) ?? localBanners[0],
    [localBanners, activeId]
  );

  const isDirty = useMemo(
    () => JSON.stringify(localBanners) !== JSON.stringify(savedSnapshot),
    [localBanners, savedSnapshot]
  );

  // ── Unload guard ───────────────────────────────────────────────────────────
  useEffect(() => {
    const handle = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault(); e.returnValue = '';
    };
    window.addEventListener('beforeunload', handle);
    return () => window.removeEventListener('beforeunload', handle);
  }, [isDirty]);

  // ── Inertia navigate-away guard ────────────────────────────────────────────
  useEffect(() => {
    const off = router.on('before', (event) => {
      if (!isDirty) return;
      event.preventDefault();
      setPendingSwitchId(-1); 
    });
    return () => off();
  }, [isDirty]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const updateBanner = (id: number, updates: Partial<Banner>) =>
    setLocalBanners(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));

  const handleMediaChange = (slot: 'main' | 'secondary', file: File) => {
    const previewUrl = URL.createObjectURL(file);
    pendingFiles.current[`${activeId}_${slot}`] = file;

    if (slot === 'main') {
      updateBanner(activeId, {
        mainMedia: {
          ...(activeBanner?.mainMedia ?? { id: 0, media_type: 'image', collection: 'banner' } as any),
          url: previewUrl,
        },
      });
    } else {
      updateBanner(activeId, {
        secondaryMedia: {
          ...(activeBanner?.secondaryMedia ?? { id: 0, media_type: 'image', collection: 'banner' } as any),
          url: previewUrl,
        },
      });
    }
  };

  // ── Dots menu ──────────────────────────────────────────────────────────────
  const handleAction = (id: number, action: string) => {
    setLocalBanners(prev => {
      const list = [...prev];
      const idx  = list.findIndex(b => b.id === id);
      if (idx < 0) return prev;

      if (action === 'toggle') {
        list[idx] = { ...list[idx], is_active: !list[idx].is_active };
        return list.map((b, i) => ({ ...b, order: i }));
      }

      let next = idx;
      if (action === 'up')     next = Math.max(0, idx - 1);
      if (action === 'down')   next = Math.min(list.length - 1, idx + 1);
      if (action === 'top')    next = 0;
      if (action === 'bottom') next = list.length - 1;
      if (next === idx) return prev;

      const [moved] = list.splice(idx, 1);
      list.splice(next, 0, moved);
      return list.map((b, i) => ({ ...b, order: i }));
    });
  };

  // ── Select banner ──────────────────────────────────────────────────────────
  const handleSelect = (id: number) => {
    if (id === activeId) return;
    if (isDirty) {
      setPendingSwitchId(id);
    } else {
      const target = localBanners.find(b => b.id === id);
      router.visit(route('banners.edit', { banner: target?.slug }));
    }
  };

  // ── Discard ────────────────────────────────────────────────────────────────
  const handleDiscard = () => {
    if (pendingSwitchId === null) return;
    setLocalBanners(JSON.parse(JSON.stringify(savedSnapshot)));
    pendingFiles.current = {};
    if (pendingSwitchId > 0) {
      const target = localBanners.find(b => b.id === pendingSwitchId);
      router.visit(route('banners.edit', { banner: target?.slug }));
    }
    setPendingSwitchId(null);
  };

  const handlePublish = () => {
    if (!isDirty || isSaving || !activeBanner) return;

    const form = new FormData();
    form.append('name',           activeBanner.name);
    form.append('subname',        activeBanner.subname);
    form.append('direction',      activeBanner.direction);
    form.append('is_active',      activeBanner.is_active ? '1' : '0');
    form.append('order_manifest', JSON.stringify(
      localBanners.map((b, i) => ({ id: b.id, order: i }))
    ));

    const mainFile      = pendingFiles.current[`${activeId}_main`];
    const secondaryFile = pendingFiles.current[`${activeId}_secondary`];
    if (mainFile)      form.append('main_media',      mainFile);
    if (secondaryFile) form.append('secondary_media', secondaryFile);

    form.append('_method', 'PUT');

    router.post(
      route('banners.update', { banner: activeBanner.slug }),
      form,
      {
        onBefore:  () => setIsSaving(true),
        onSuccess: (page) => {
          const fresh = ([...(page.props as any).banners as Banner[]]).sort((a, b) => a.order - b.order);
          setSavedSnapshot(JSON.parse(JSON.stringify(fresh)));
          setLocalBanners(fresh);
          pendingFiles.current = {};
        },
        onFinish:  () => setIsSaving(false),
        preserveScroll: true,
      }
    );
  };

  // ── Factory reset ──────────────────────────────────────────────────────────
  const handleFactoryReset = () => {
    const factory = app_factory_config.find((f: any) => f.id === activeId);
    if (!factory) return;
    setLocalBanners(prev =>
      prev.map(b => b.id === activeId ? { ...b, ...JSON.parse(JSON.stringify(factory)) } : b)
    );
  };

  // ──────────────────────────────────────────────────────────────────────────

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      background: t.bg, color: t.text, fontFamily: 'system-ui, sans-serif',
    }}>

      <BannerNav
        open={leftOpen}
        onToggle={() => setLeftOpen(v => !v)}
        banners={localBanners}
        activeId={activeId}
        dirtyId={isDirty ? activeId : null}
        onSelect={handleSelect}
        onAction={handleAction}
      />

      <BannerCenterPanel
        activeBanner={activeBanner}
        isDirty={isDirty}
        isSaving={isSaving}
        onReset={handleFactoryReset}
        onPublish={handlePublish}
      />

      <BannerInspector
        open={rightOpen}
        onToggle={() => setRightOpen(v => !v)}
        banner={activeBanner}
        onUpdate={(updates) => activeBanner && updateBanner(activeBanner.id, updates)}
        onMediaChange={handleMediaChange}
      />

      {pendingSwitchId !== null && (
        <UnsavedModal
          bannerName={activeBanner?.name ?? 'this banner'}
          onDiscard={handleDiscard}
          onKeep={() => setPendingSwitchId(null)}
        />
      )}
    </div>
  );
}

BannerEditor.layout = (page: any) => <AdminLayout>{page}</AdminLayout>;