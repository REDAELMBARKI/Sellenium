import React, { useState, useRef, useMemo, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { route } from 'ziggy-js';
import { Banner } from '@/types/bannerTypes';
import BannerNav from './Partials/BannerNav';
import BannerCenterPanel from './Partials/BannerPreview';
import BannerInspector from './Partials/BannerInspector';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';

const FALLBACK_BANNERS: Banner[] = [
  {
    id: 101,
    key: "spring_2026",
    name: "Spring Collection 2026",
    slug: "spring-2026",
    is_active: true,
    order: 0,
    direction: 'ltr',
    aspect_ratio: "21:9",
    border_radius: "12px",
    bg_color: "#1a1a1a",
    slots: [
      {
        slot_key: "left",
        is_visible: true,
        width: "50",
        bg_color: "#1a1a1a",
        main_media: { id: null, url: '', media_type: 'image' },
      },
      {
        slot_key: "middle",
        is_visible: false,
        width: "50",
        bg_color: "#222222",
        elements: {
          eyebrow:   { text: "NEW ARRIVALS",  color: "#ffd700", visible: true },
          title:     { text: "Premium Gear",  color: "#ffffff", visible: true },
          paragraph: { text: "Discover the latest 2026 release.", color: "#cccccc", visible: true },
          button:    { text: "Shop Now", bg_color: "#ffffff", text_color: "#000000", visible: true }
        }
      },
      {
        slot_key: "right",
        is_visible: true,
        width: "50",
        bg_color: "#1a1a1a",
        main_media: { id: 1, url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f", media_type: 'image' }
      }
    ]
  }
];

export default function BannerEditor() {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  const { banners = [], app_factory_config = [], selectedBanner, available_banner_templates = [] } = usePage().props as any;

  const initialData = useMemo(() => {
    const data = banners.length > 0 ? banners : FALLBACK_BANNERS;
    return [...data].sort((a: Banner, b: Banner) => a.order - b.order);
  }, [banners]);

  const [localBanners, setLocalBanners]     = useState<Banner[]>(initialData);
  const [activeId, setActiveId]             = useState<number>(selectedBanner?.id ?? initialData[0]?.id);
  const [activeSlotKey, setActiveSlotKey]   = useState<string>(initialData[0]?.slots[0]?.slot_key ?? 'left');
  const [activeElementKey, setActiveElementKey] = useState<string | null>(null);
  const [isSaving, setIsSaving]             = useState(false);
  const [savedSnapshot, setSavedSnapshot]   = useState<string>(JSON.stringify(initialData));
  const [leftOpen, setLeftOpen]             = useState(true);
  const [rightOpen, setRightOpen]           = useState(true);

  const pendingFiles = useRef<Record<string, File>>({});

  // Sync when Inertia refreshes props after a server round-trip
  useEffect(() => {
    const sorted = [...banners].sort((a: Banner, b: Banner) => a.order - b.order);
    setLocalBanners(sorted);
    if (selectedBanner) {
      setActiveId(selectedBanner.id);
      setSavedSnapshot(JSON.stringify(sorted));
      setActiveSlotKey(selectedBanner.slots?.[0]?.slot_key ?? 'left');
      setActiveElementKey(null);
    }
  }, [banners, selectedBanner]);

  const activeBanner = useMemo(
    () => localBanners.find(banner => banner.id === activeId) ?? localBanners[0],
    [localBanners, activeId]
  );

  // ── Navigation ────────────────────────────────────────────────────────────────

  const handleSelectBanner = (id: number) => {
    const banner = localBanners.find(b => b.id === id);
    setActiveId(id);
    setActiveSlotKey(banner?.slots?.[0]?.slot_key ?? 'left');
    setActiveElementKey(null);
  };

  /** Navigate to a slot — clears any element selection */
  const handleSlotSelect = (slotKey: string) => {
    setActiveSlotKey(slotKey);
    setActiveElementKey(null);
  };

  /** Select a specific element inside a slot (from preview click or inspector) */
  const handleElementSelect = (slotKey: string, elementKey: string) => {
    setActiveSlotKey(slotKey);
    setActiveElementKey(elementKey);
  };

  const isDirty = useMemo(
    () => JSON.stringify(localBanners) !== savedSnapshot,
    [localBanners, savedSnapshot]
  );

  // ── Path-based updater ────────────────────────────────────────────────────────
  const updateBanner = (bannerId: number, path: string, value: any) => {
    setLocalBanners(prev => prev.map(banner => {
      if (banner.id !== bannerId) return banner;
      const updated = structuredClone(banner);
      const keys = path.split('.');
      let cursor: any = updated;
      for (let i = 0; i < keys.length - 1; i++) cursor = cursor[keys[i]];
      cursor[keys[keys.length - 1]] = value;
      return updated;
    }));
  };

  // ── Slot visibility toggle with equal width redistribution ────────────────────
  const handleToggleSlotVisibility = (slotKey: string) => {
    if (!activeBanner) return;

    setLocalBanners(prev => prev.map(banner => {
      if (banner.id !== activeId) return banner;
      const cloned = structuredClone(banner);
      const target = cloned.slots.find(s => s.slot_key === slotKey);
      if (!target) return banner;

      // Prevent hiding the last visible slot
      const visibleCount = cloned.slots.filter(s => s.is_visible).length;
      if (target.is_visible && visibleCount === 1) return banner;

      target.is_visible = !target.is_visible;

      // Redistribute 100% equally across all now-visible slots
      const visible = cloned.slots.filter(s => s.is_visible);
      const base    = Math.floor(100 / visible.length);
      const rem     = 100 - base * visible.length;
      visible.forEach((s, i) => {
        s.width = String(base + (i === 0 ? rem : 0));
      });

      return cloned;
    }));
  };

  // ── Media ─────────────────────────────────────────────────────────────────────
  const handleMediaChange = (slotIndex: number, file: File, isSecondary = false) => {
    const previewUrl = URL.createObjectURL(file);
    const slot       = activeBanner.slots[slotIndex];
    const fileKey    = `${activeId}_slot_${slot.slot_key}_${isSecondary ? 'sec' : 'main'}`;
    const mediaPath  = isSecondary
      ? `slots.${slotIndex}.secondary_media.url`
      : `slots.${slotIndex}.main_media.url`;

    pendingFiles.current[fileKey] = file;
    updateBanner(activeId, mediaPath, previewUrl);
  };

  // ── Publish ───────────────────────────────────────────────────────────────────
  const handlePublish = () => {
    if (!isDirty || isSaving || !activeBanner) return;

    const form = new FormData();
    form.append('name',          activeBanner.name);
    form.append('direction',     activeBanner.direction);
    form.append('aspect_ratio',  activeBanner.aspect_ratio);
    form.append('border_radius', activeBanner.border_radius);
    form.append('bg_color',      activeBanner.bg_color);
    form.append('slots',         JSON.stringify(activeBanner.slots));
    form.append('_method',       'PUT');

    Object.entries(pendingFiles.current).forEach(([key, file]) => form.append(key, file));

    router.post(route('banners.update', { banner: activeBanner.slug }), form, {
      onBefore:  () => setIsSaving(true),
      onSuccess: (page) => {
        const freshBanners = (page.props.banners as Banner[]) ?? localBanners;
        const sorted = [...freshBanners].sort((a, b) => a.order - b.order);
        setLocalBanners(sorted);
        setSavedSnapshot(JSON.stringify(sorted));
        pendingFiles.current = {};
      },
      onFinish: () => setIsSaving(false),
    });
  };

  // ── Add Banner ────────────────────────────────────────────────────────────────
  const handleAddBanner = (templateKey: string) => {
    router.post(route('banners.store'), { template_key: templateKey }, {
      onSuccess: (page) => {
        const freshBanners = (page.props.banners as Banner[]) ?? localBanners;
        const sorted = [...freshBanners].sort((a, b) => a.order - b.order);
        setLocalBanners(sorted);
        setSavedSnapshot(JSON.stringify(sorted));
        const newest = sorted[sorted.length - 1];
        if (newest) {
          setActiveId(newest.id);
          setActiveSlotKey(newest.slots?.[0]?.slot_key ?? 'left');
          setActiveElementKey(null);
        }
      },
    });
  };

  // ── Factory Reset ─────────────────────────────────────────────────────────────
  const resetToFactory = () => {
    const factoryRecord = app_factory_config.find(
      (record: any) => record.config_key === `banners.${activeBanner.key}`
    );
    if (!factoryRecord) return;

    const payload = factoryRecord.payload;

    setLocalBanners(prev => prev.map(banner => {
      if (banner.id !== activeId) return banner;
      return {
        ...banner,
        name:          payload.name,
        direction:     payload.direction,
        is_active:     payload.is_active,
        aspect_ratio:  payload.aspect_ratio,
        border_radius: payload.border_radius,
        bg_color:      payload.bg_color,
        slots:         structuredClone(payload.slots),
      };
    }));

    setActiveSlotKey(payload.slots?.[0]?.slot_key ?? 'left');
    setActiveElementKey(null);
    pendingFiles.current = {};
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: theme.bg, color: theme.text }}>
      <BannerNav
        open={leftOpen}
        onToggle={() => setLeftOpen(v => !v)}
        banners={localBanners}
        activeId={activeId}
        onSelect={handleSelectBanner}
      />

      <BannerCenterPanel
        activeBanner={activeBanner}
        activeSlotKey={activeSlotKey}
        activeElementKey={activeElementKey}
        onSlotSelect={handleSlotSelect}
        onElementSelect={handleElementSelect}
        onToggleSlotVisibility={handleToggleSlotVisibility}
        isDirty={isDirty}
        isSaving={isSaving}
        onReset={resetToFactory}
        onPublish={handlePublish}
        onUpdate={(path: string, value: any) => updateBanner(activeBanner.id, path, value)}
        onAddBanner={handleAddBanner}
        availableBannerTemplates={available_banner_templates}
      />

      <BannerInspector
        open={rightOpen}
        onToggle={() => setRightOpen(v => !v)}
        banner={activeBanner}
        activeSlotKey={activeSlotKey}
        activeElementKey={activeElementKey}
        onElementSelect={handleElementSelect}
        onUpdate={(path: string, value: any) => updateBanner(activeBanner.id, path, value)}
        onMediaChange={handleMediaChange}
      />
    </div>
  );
}

BannerEditor.layout = (page: any) => <AdminLayout>{page}</AdminLayout>;