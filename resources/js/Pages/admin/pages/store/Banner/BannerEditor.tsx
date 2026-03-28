import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import {
  Image, Layers, Film, LayoutDashboard, Columns2, LayoutGrid,
  MoreVertical, ChevronUp, ChevronDown, ArrowUpToLine, ArrowDownToLine,
  Eye, EyeOff, Upload, ArrowLeftRight, Loader2, Plus,
  PanelRight, ChevronLeft, RotateCcw, Save, AlertTriangle,
} from 'lucide-react';
import { router } from '@inertiajs/react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BannerImage {
  slot: string;
  url: string;
  label: string;
}

interface BannerSection {
  id: string;
  type: string;
  isActive: boolean;
  order: number;
  direction: 'ltr' | 'rtl' | null;
  tag: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  images: BannerImage[];
}

// ─── Section Type Registry ────────────────────────────────────────────────────

const SECTION_TYPES = [
  { type: 'overlay',         label: 'Overlay',        Icon: Image,           description: 'Full-bleed image with text overlay' },
  { type: 'lifestyle-inset', label: 'Lifestyle Inset', Icon: Layers,          description: 'Text panel + photo with floating inset card' },
  { type: 'cinematic-hero',  label: 'Cinematic Hero',  Icon: Film,            description: 'Video-ready hero with bottom gradient' },
  { type: 'editorial-text',  label: 'Editorial',       Icon: LayoutDashboard, description: 'Solid brand background, no media' },
  { type: 'duotone-split',   label: 'Duotone Split',   Icon: Columns2,        description: 'Brand-colored left + photo right' },
  { type: 'double-media',    label: 'Double Media',    Icon: LayoutGrid,      description: 'Side-by-side photos with overlapping text' },
];

// ─── Factory & Initial Payloads ───────────────────────────────────────────────

const FACTORY_SECTIONS: BannerSection[] = [
  {
    id: 's1', type: 'overlay', isActive: true, order: 0, direction: null,
    tag: 'New Season', title: 'MODERN MINIMALISM',
    subtitle: 'Clean lines and timeless silhouettes for the sophisticated wardrobe.',
    ctaLabel: 'EXPLORE',
    images: [{ slot: 'main', url: 'https://images.unsplash.com/photo-1490481651871-ab68624d5517?q=80&w=2000', label: 'Background image' }],
  },
  {
    id: 's2', type: 'lifestyle-inset', isActive: true, order: 1, direction: 'ltr',
    tag: 'Craftsmanship', title: 'LUXURY IN DETAIL',
    subtitle: 'Our artisans spend hundreds of hours perfecting every stitch.',
    ctaLabel: 'COLLECTION',
    images: [
      { slot: 'main',      url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200', label: 'Main photo' },
      { slot: 'secondary', url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600',  label: 'Inset photo' },
    ],
  },
  {
    id: 's3', type: 'cinematic-hero', isActive: true, order: 2, direction: null,
    tag: 'FW 2025', title: 'THE NEW COLLECTION',
    subtitle: 'Where craft meets quiet luxury',
    ctaLabel: 'DISCOVER',
    images: [{ slot: 'main', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2000', label: 'Background image' }],
  },
  {
    id: 's4', type: 'editorial-text', isActive: false, order: 3, direction: null,
    tag: 'Editorial', title: 'QUIET LUXURY\nREDEFINED.',
    subtitle: "A study in restraint. A devotion to material. The season's most anticipated edit.",
    ctaLabel: 'READ MORE',
    images: [],
  },
  {
    id: 's5', type: 'duotone-split', isActive: true, order: 4, direction: 'ltr',
    tag: 'Archive', title: 'THE ARCHIVE EDIT',
    subtitle: 'Revisiting the codes that defined a generation.',
    ctaLabel: 'SHOP NOW',
    images: [{ slot: 'main', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1400', label: 'Feature photo' }],
  },
  {
    id: 's6', type: 'double-media', isActive: true, order: 5, direction: 'ltr',
    tag: 'Duo', title: 'TWO WORLDS, ONE VISION',
    subtitle: 'The contrast that defines the season.',
    ctaLabel: 'VIEW ALL',
    images: [
      { slot: 'main',      url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200', label: 'Left photo' },
      { slot: 'secondary', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200', label: 'Right photo' },
    ],
  },
];

const INITIAL_SECTIONS: BannerSection[] = JSON.parse(JSON.stringify(FACTORY_SECTIONS));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getImg = (section: BannerSection, slot = 'main') =>
  section.images.find(i => i.slot === slot)?.url || '';

const typeLabel = (type: string) =>
  SECTION_TYPES.find(s => s.type === type)?.label ?? type;

const typeIcon = (type: string) => {
  const found = SECTION_TYPES.find(s => s.type === type);
  return found ? <found.Icon size={12} /> : <Image size={12} />;
};

// ─── Unsaved Changes Modal ────────────────────────────────────────────────────

type ModalReason = 'switch' | 'publish' | 'navigate';

interface UnsavedModalProps {
  sectionName: string;
  reason: ModalReason;
  onDiscard: () => void;
  onKeep: () => void;
}

const MODAL_COPY: Record<ModalReason, { title: string; body: (name: string) => React.ReactNode; keep: string; discard: string }> = {
  switch: {
    title: 'You have unsaved changes',
    body: (name) => <>Changes to <strong>{name}</strong> will be lost if you switch without publishing first.</>,
    keep: 'Keep Editing',
    discard: 'Discard & Switch',
  },
  publish: {
    title: 'Publish these changes?',
    body: (name) => <>You're about to publish changes to <strong>{name}</strong> and make them live on your storefront.</>,
    keep: 'Publish Now',
    discard: 'Cancel',
  },
  navigate: {
    title: 'Leave without publishing?',
    body: () => <>You have unpublished changes that will be lost if you leave this page.</>,
    keep: 'Stay Here',
    discard: 'Leave Anyway',
  },
};

function UnsavedModal({ sectionName, reason, onDiscard, onKeep }: UnsavedModalProps) {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  const copy = MODAL_COPY[reason];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{ position: 'absolute', inset: 0, background: theme.overlay, backdropFilter: 'blur(4px)' }}
        onClick={onKeep}
      />
      <div style={{
        position: 'relative', zIndex: 10, width: 380,
        borderRadius: 16, border: `1px solid ${theme.border}`,
        padding: 24, boxShadow: theme.shadowLg,
        backgroundColor: theme.bgSecondary,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
          <div style={{
            flexShrink: 0, width: 36, height: 36, borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: `${theme.primary}20`,
          }}>
            <AlertTriangle size={16} style={{ color: theme.primary }} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 800, marginBottom: 6, color: theme.text }}>
              {copy.title}
            </p>
            <p style={{ fontSize: 11, lineHeight: 1.6, color: theme.textSecondary }}>
              {copy.body(sectionName)}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onKeep}
            style={{
              flex: 1, padding: '10px 0', fontSize: 10, fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '0.08em',
              borderRadius: 10, border: 'none', cursor: 'pointer',
              backgroundColor: theme.primary, color: theme.textInverse,
            }}
          >
            {copy.keep}
          </button>
          <button
            onClick={onDiscard}
            style={{
              flex: 1, padding: '10px 0', fontSize: 10, fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '0.08em',
              borderRadius: 10, border: `1px solid ${theme.border}`,
              background: 'transparent', cursor: 'pointer', color: theme.text,
            }}
          >
            {copy.discard}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Dots Menu ────────────────────────────────────────────────────────────────

function DotsMenu({ isFirst, isLast, isActive, onAction }: {
  isFirst: boolean; isLast: boolean; isActive: boolean;
  onAction: (action: string) => void;
}) {
  const { state: { currentTheme: t } } = useStoreConfigCtx();
  const [open, setOpen] = useState(false);

  const items = [
    { label: 'Move up',        icon: <ChevronUp size={12} />,       action: 'up',     disabled: isFirst },
    { label: 'Move down',      icon: <ChevronDown size={12} />,     action: 'down',   disabled: isLast  },
    null,
    { label: 'Move to top',    icon: <ArrowUpToLine size={12} />,   action: 'top',    disabled: isFirst },
    { label: 'Move to bottom', icon: <ArrowDownToLine size={12} />, action: 'bottom', disabled: isLast  },
    null,
    {
      label: isActive ? 'Set hidden' : 'Set live',
      icon: isActive ? <EyeOff size={12} /> : <Eye size={12} />,
      action: 'toggle', disabled: false,
    },
  ];

  return (
    <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: 22, height: 22, display: 'grid', placeItems: 'center',
          background: open ? t.secondary : 'transparent',
          border: 'none', borderRadius: 5, cursor: 'pointer', color: t.textMuted,
        }}
      >
        <MoreVertical size={13} />
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', right: 0, top: '110%', zIndex: 50,
            background: t.card, border: `0.5px solid ${t.borderHover}`,
            borderRadius: 10, padding: 4, minWidth: 162, boxShadow: t.shadowLg,
          }}>
            {items.map((item, i) =>
              item === null
                ? <div key={i} style={{ height: 0.5, background: t.border, margin: '3px 6px' }} />
                : (
                  <button
                    key={item.action}
                    disabled={item.disabled}
                    onClick={() => { onAction(item.action); setOpen(false); }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                      padding: '7px 10px', background: 'transparent', border: 'none',
                      borderRadius: 6, cursor: item.disabled ? 'not-allowed' : 'pointer',
                      color: item.disabled ? t.textMuted : t.text,
                      fontSize: 11, textAlign: 'left', opacity: item.disabled ? 0.35 : 1,
                    }}
                    onMouseEnter={e => { if (!item.disabled) (e.currentTarget as HTMLElement).style.background = t.secondary; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <span style={{ color: t.primary, width: 14 }}>{item.icon}</span>
                    {item.label}
                  </button>
                )
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Sidebar Item ─────────────────────────────────────────────────────────────

function SidebarItem({ section, index, isActive, isDirty, onSelect, onAction }: {
  section: BannerSection; index: number; isActive: boolean; isDirty: boolean;
  onSelect: (id: string) => void; onAction: (action: string) => void;
}) {
  const { state: { currentTheme: t } } = useStoreConfigCtx();

  return (
    <div
      onClick={() => onSelect(section.id)}
      style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '8px 10px', cursor: 'pointer',
        borderLeft: `2px solid ${isActive ? t.primary : 'transparent'}`,
        background: isActive ? `${t.primary}0f` : 'transparent',
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = t.sidebarHover; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isActive ? `${t.primary}0f` : 'transparent'; }}
    >
      <span style={{ fontSize: 10, fontFamily: 'monospace', color: t.textMuted, width: 14, textAlign: 'right', flexShrink: 0 }}>
        {String(index + 1).padStart(2, '0')}
      </span>
      <span style={{ color: isActive ? t.primary : t.textMuted, flexShrink: 0 }}>
        {typeIcon(section.type)}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12, fontWeight: 500,
          color: isActive ? t.primary : t.text,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {section.title.replace(/\n/g, ' ')}
        </div>
        <div style={{ fontSize: 9, color: t.textMuted, fontFamily: 'monospace' }}>
          {typeLabel(section.type)}
        </div>
      </div>

      {/* dirty dot */}
      {isDirty && (
        <span style={{
          width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
          backgroundColor: t.primary,
        }} />
      )}

      {/* live/hidden pill */}
      <span style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '2px 6px', borderRadius: 20,
        fontSize: 9, fontFamily: 'monospace', flexShrink: 0,
        background: section.isActive ? 'rgba(29,158,117,0.14)' : t.secondary,
        color: section.isActive ? t.success : t.textMuted,
      }}>
        <span style={{
          width: 4, height: 4, borderRadius: '50%',
          background: section.isActive ? t.success : t.textMuted,
        }} />
        {section.isActive ? 'live' : 'hidden'}
      </span>

      <DotsMenu isFirst={index === 0} isLast={index === -1} isActive={section.isActive} onAction={onAction} />
    </div>
  );
}

// ─── Banner Preview ───────────────────────────────────────────────────────────

function BannerPreview({ section }: { section: BannerSection }) {
  const { state: { currentTheme: t } } = useStoreConfigCtx();
  const b = t.banner;
  const main = getImg(section, 'main');
  const secondary = getImg(section, 'secondary');

  const ImgBox = ({ src, style, children }: { src: string; style?: React.CSSProperties; children?: React.ReactNode }) => (
    <div style={{ position: 'relative', background: t.card, ...style }}>
      {src
        ? <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
        : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', background: t.bgSecondary }}>
            <Upload size={20} style={{ color: t.textMuted, opacity: 0.4 }} />
          </div>
      }
      {children}
    </div>
  );

  const Tag = () => section.tag ? (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 20,
      fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
      marginBottom: 10, background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)',
    }}>{section.tag}</span>
  ) : null;

  if (section.type === 'overlay') return (
    <div style={{ position: 'relative', width: '100%', minHeight: 340, borderRadius: 10, overflow: 'hidden' }}>
      <ImgBox src={main} style={{ position: 'absolute', inset: 0 }} />
      <div style={{ position: 'absolute', inset: 0, background: b.scrim }} />
      <div style={{ position: 'relative', zIndex: 1, padding: '48px 40px', minHeight: 340, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
        <Tag />
        <h2 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.8rem)', fontWeight: 700, color: b.scrimText, lineHeight: 1.1, letterSpacing: '-0.02em' }}>{section.title}</h2>
        <p style={{ fontSize: 13, color: b.scrimSubtext, lineHeight: 1.6, maxWidth: 320 }}>{section.subtitle}</p>
        <button style={{ alignSelf: 'flex-start', marginTop: 8, padding: '10px 24px', border: `2px solid ${b.scrimBorder}`, color: b.scrimText, background: 'transparent', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', cursor: 'pointer', borderRadius: 3 }}>
          {section.ctaLabel}
        </button>
      </div>
    </div>
  );

  if (section.type === 'lifestyle-inset') return (
    <div style={{ display: 'flex', flexDirection: section.direction === 'rtl' ? 'row-reverse' : 'row', borderRadius: 10, overflow: 'hidden', minHeight: 340, background: t.card }}>
      <div style={{ width: '48%', padding: '36px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
        <Tag />
        <h2 style={{ fontSize: 'clamp(1.4rem,2.5vw,2.2rem)', fontWeight: 700, color: t.text, lineHeight: 1.15 }}>{section.title}</h2>
        <p style={{ fontSize: 12, color: t.textSecondary, lineHeight: 1.7 }}>{section.subtitle}</p>
        <button style={{ alignSelf: 'flex-start', marginTop: 6, padding: '9px 22px', background: b.accentBtn, color: b.accentBtnText, border: 'none', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', cursor: 'pointer', borderRadius: 3 }}>
          {section.ctaLabel}
        </button>
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <ImgBox src={main} style={{ width: '100%', height: '100%' }} />
        <div style={{
          position: 'absolute', bottom: 20, left: section.direction === 'rtl' ? 'auto' : 16, right: section.direction === 'rtl' ? 16 : 'auto',
          width: 100, height: 100, border: `3px solid ${t.card}`, borderRadius: 4, overflow: 'hidden',
        }}>
          <ImgBox src={secondary} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </div>
  );

  if (section.type === 'cinematic-hero') return (
    <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', minHeight: 340 }}>
      <ImgBox src={main} style={{ position: 'absolute', inset: 0 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)' }} />
      <div style={{ position: 'relative', zIndex: 1, minHeight: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: '40px 32px', textAlign: 'center', gap: 8 }}>
        {section.tag && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: b.scrimSubtext }}>{section.tag}</span>}
        <h2 style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 700, color: b.scrimText, lineHeight: 1, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{section.title}</h2>
        <p style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: b.scrimSubtext }}>{section.subtitle}</p>
        <button style={{ marginTop: 10, padding: '10px 28px', background: b.accentBtn, color: b.accentBtnText, border: 'none', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', cursor: 'pointer', borderRadius: 3 }}>
          {section.ctaLabel}
        </button>
      </div>
    </div>
  );

  if (section.type === 'editorial-text') return (
    <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', minHeight: 340, background: b.solidBg, display: 'flex', alignItems: 'center' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: b.accentBtn }} />
      <div style={{ padding: '40px 48px', maxWidth: 620 }}>
        {section.tag && <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: b.accentBtn, marginBottom: 16 }}>{section.tag}</p>}
        <h2 style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 700, color: b.solidText, lineHeight: 1.1, whiteSpace: 'pre-line', marginBottom: 16 }}>{section.title}</h2>
        <p style={{ fontSize: 13, color: b.solidSubtext, lineHeight: 1.8, marginBottom: 24 }}>{section.subtitle}</p>
        <button style={{ padding: '10px 28px', border: `2px solid ${b.accentBtn}`, color: b.accentBtn, background: 'transparent', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', cursor: 'pointer', borderRadius: 3 }}>
          {section.ctaLabel}
        </button>
      </div>
    </div>
  );

  if (section.type === 'duotone-split') return (
    <div style={{ display: 'flex', flexDirection: section.direction === 'rtl' ? 'row-reverse' : 'row', borderRadius: 10, overflow: 'hidden', minHeight: 340 }}>
      <div style={{ width: '42%', background: b.accentBtn, padding: '36px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        {section.tag && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>{section.tag}</span>}
        <h2 style={{ fontSize: 'clamp(1.4rem,2.5vw,2.2rem)', fontWeight: 700, color: b.accentBtnText, lineHeight: 1.15 }}>{section.title}</h2>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>{section.subtitle}</p>
        <button style={{ alignSelf: 'flex-start', marginTop: 8, padding: '9px 22px', border: `2px solid rgba(255,255,255,0.8)`, color: b.accentBtnText, background: 'transparent', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', cursor: 'pointer', borderRadius: 3 }}>
          {section.ctaLabel}
        </button>
      </div>
      <div style={{ flex: 1 }}>
        <ImgBox src={main} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );

  if (section.type === 'double-media') return (
    <div style={{ position: 'relative', display: 'flex', borderRadius: 10, overflow: 'hidden', minHeight: 340 }}>
      <div style={{ width: '50%', position: 'relative' }}>
        <ImgBox src={main} style={{ width: '100%', height: '100%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }} />
      </div>
      <div style={{ width: '50%', position: 'relative' }}>
        <ImgBox src={secondary} style={{ width: '100%', height: '100%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }} />
      </div>
      <div style={{
        position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        width: 240, background: t.card, padding: '20px 20px', borderRadius: 8, zIndex: 2,
      }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 6 }}>{section.title}</h3>
        <p style={{ fontSize: 11, color: t.textSecondary, lineHeight: 1.6, marginBottom: 12 }}>{section.subtitle}</p>
        <button style={{ width: '100%', padding: '9px', background: b.accentBtn, color: b.accentBtnText, border: 'none', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', cursor: 'pointer', borderRadius: 3 }}>
          {section.ctaLabel}
        </button>
      </div>
    </div>
  );

  return null;
}

// ─── Image Slot ───────────────────────────────────────────────────────────────

function ImageSlot({ imageObj, label, onChange }: {
  imageObj: BannerImage; label: string; onChange: (img: BannerImage) => void;
}) {
  const { state: { currentTheme: t } } = useStoreConfigCtx();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const url = URL.createObjectURL(file);
    onChange({ ...imageObj, url });
    setLoading(false);
    e.target.value = '';
  };

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 500, color: t.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 5 }}>
        {label}
      </div>
      <div
        onClick={() => !loading && fileRef.current?.click()}
        style={{
          width: '100%', height: 80, borderRadius: 8,
          border: `0.5px dashed ${t.borderHover}`,
          background: t.bgSecondary, overflow: 'hidden',
          cursor: loading ? 'wait' : 'pointer', position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {imageObj?.url && !loading
          ? <img src={imageObj.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
          : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              {loading
                ? <Loader2 size={18} style={{ color: t.textMuted }} />
                : <Upload size={16} style={{ color: t.textMuted, opacity: 0.6 }} />
              }
              <span style={{ fontSize: 10, color: t.textMuted }}>{loading ? 'Uploading…' : 'Click to upload'}</span>
            </div>
          )
        }
      </div>
      <input type="file" ref={fileRef} accept="image/*,video/*" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  );
}

// ─── Right Content Editor (inner scroll body) ─────────────────────────────────

function ContentEditor({ section, onUpdate }: {
  section: BannerSection | undefined;
  onUpdate: (updates: Partial<BannerSection>) => void;
}) {
  const { state: { currentTheme: t } } = useStoreConfigCtx();

  if (!section) return (
    <div style={{ padding: 16, color: t.textMuted, fontSize: 12 }}>Select a section to edit</div>
  );

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '7px 9px', fontSize: 12,
    border: `0.5px solid ${t.border}`, borderRadius: 8,
    background: t.bgSecondary, color: t.text,
    outline: 'none', fontFamily: 'inherit', resize: 'none' as const,
    transition: 'border-color 0.1s', boxSizing: 'border-box',
  };

  const hasDirection = ['lifestyle-inset', 'duotone-split', 'double-media'].includes(section.type);
  const imageSlotDefs: { slot: string; label: string }[] = ({
    'overlay':         [{ slot: 'main', label: 'Background image' }],
    'lifestyle-inset': [{ slot: 'main', label: 'Main photo' }, { slot: 'secondary', label: 'Inset photo' }],
    'cinematic-hero':  [{ slot: 'main', label: 'Background image' }],
    'editorial-text':  [],
    'duotone-split':   [{ slot: 'main', label: 'Feature photo' }],
    'double-media':    [{ slot: 'main', label: 'Left photo' }, { slot: 'secondary', label: 'Right photo' }],
  } as Record<string, { slot: string; label: string }[]>)[section.type] ?? [];

  const updateImage = (slot: string, newImgObj: BannerImage) => {
    const newImages = section.images.filter(i => i.slot !== slot);
    onUpdate({ images: [...newImages, newImgObj] });
  };

  const Sep = () => <div style={{ height: 0.5, background: t.border, margin: '14px 0' }} />;
  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <div style={{ fontSize: 10, fontWeight: 600, color: t.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 10 }}>{children}</div>
  );
  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 500, color: t.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 5 }}>{label}</div>
      {children}
    </div>
  );

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
      {imageSlotDefs.length > 0 && (
        <>
          <SectionTitle>Images</SectionTitle>
          {imageSlotDefs.map(def => (
            <ImageSlot
              key={def.slot}
              label={def.label}
              imageObj={section.images.find(i => i.slot === def.slot) ?? { slot: def.slot, url: '', label: def.label }}
              onChange={img => updateImage(def.slot, img)}
            />
          ))}
          <Sep />
        </>
      )}

      <SectionTitle>Text</SectionTitle>

      <Field label="Tag / eyebrow">
        <input style={inputStyle} value={section.tag || ''} onChange={e => onUpdate({ tag: e.target.value })} placeholder="e.g. New Season"
          onFocus={e => (e.target as HTMLElement).style.borderColor = t.primary}
          onBlur={e => (e.target as HTMLElement).style.borderColor = t.border}
        />
      </Field>
      <Field label="Headline">
        <textarea style={{ ...inputStyle, lineHeight: 1.5 }} value={section.title} rows={2} onChange={e => onUpdate({ title: e.target.value })} placeholder="Main headline"
          onFocus={e => (e.target as HTMLElement).style.borderColor = t.primary}
          onBlur={e => (e.target as HTMLElement).style.borderColor = t.border}
        />
      </Field>
      <Field label="Body copy">
        <textarea style={{ ...inputStyle, lineHeight: 1.5 }} value={section.subtitle} rows={3} onChange={e => onUpdate({ subtitle: e.target.value })} placeholder="Supporting copy"
          onFocus={e => (e.target as HTMLElement).style.borderColor = t.primary}
          onBlur={e => (e.target as HTMLElement).style.borderColor = t.border}
        />
      </Field>
      <Field label="Button label">
        <input style={inputStyle} value={section.ctaLabel || ''} onChange={e => onUpdate({ ctaLabel: e.target.value })} placeholder="e.g. EXPLORE"
          onFocus={e => (e.target as HTMLElement).style.borderColor = t.primary}
          onBlur={e => (e.target as HTMLElement).style.borderColor = t.border}
        />
      </Field>

      <Sep />
      <SectionTitle>Settings</SectionTitle>

      {hasDirection && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: t.text }}>Layout direction</span>
          <button
            onClick={() => onUpdate({ direction: section.direction === 'ltr' ? 'rtl' : 'ltr' })}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 10px', borderRadius: 6, border: `0.5px solid ${t.border}`,
              background: t.secondary, color: t.text, fontSize: 11, cursor: 'pointer',
            }}
          >
            <ArrowLeftRight size={11} />
            {section.direction?.toUpperCase() ?? 'LTR'}
          </button>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: t.text }}>Live on storefront</span>
        <button
          onClick={() => onUpdate({ isActive: !section.isActive })}
          style={{
            width: 36, height: 20, borderRadius: 10, border: 'none',
            background: section.isActive ? t.success : t.secondary,
            cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
          }}
        >
          <span style={{
            position: 'absolute', width: 14, height: 14, borderRadius: '50%',
            background: '#fff', top: 3, left: section.isActive ? 19 : 3, transition: 'left 0.2s',
          }} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Editor ──────────────────────────────────────────────────────────────

export default function BannerEditor() {
  const { state: { currentTheme: t } } = useStoreConfigCtx();

  const [sections, setSections]           = useState<BannerSection[]>([...INITIAL_SECTIONS].sort((a, b) => a.order - b.order));
  const [activeId, setActiveId]           = useState<string>(INITIAL_SECTIONS[0].id);
  const [rightOpen, setRightOpen]         = useState(true);
  const [savedSnapshot, setSavedSnapshot] = useState<BannerSection[]>(JSON.parse(JSON.stringify(INITIAL_SECTIONS)));

  // modal state: tracks which trigger opened it + pending action target
  const [modal, setModal] = useState<{ reason: ModalReason; pendingId?: string } | null>(null);

  const activeSection = sections.find(s => s.id === activeId);

  // ── Dirty check ────────────────────────────────────────────────────────────
  const isDirty = useMemo(
    () => JSON.stringify(sections) !== JSON.stringify(savedSnapshot),
    [sections, savedSnapshot]
  );

  // ── browser beforeunload guard (navigate away) ─────────────────────────────
  // Note: modern browsers show their own native dialog for beforeunload.
  // We additionally intercept Inertia navigation via router.on('before').
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = '';     // required for Chrome to show the native prompt
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // ── Inertia navigate-away guard ────────────────────────────────────────────
  useEffect(() => {
    const removeHandler = router.on('before', (event) => {
      if (!isDirty) return;
      // Show our custom modal instead of following the navigation.
      // We store the href so we can replay it after the user confirms.
      event.preventDefault();
      setModal({ reason: 'navigate', pendingId: (event.detail.visit as any).url?.href ?? '' });
    });
    return () => removeHandler();
  }, [isDirty]);

  // ── Section update ─────────────────────────────────────────────────────────
  const updateSection = useCallback((id: string, updates: Partial<BannerSection>) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  // ── Sidebar reorder / toggle ───────────────────────────────────────────────
  const handleAction = useCallback((id: string, action: string) => {
    setSections(prev => {
      const sorted = [...prev];
      const idx = sorted.findIndex(s => s.id === id);
      if (idx < 0) return prev;
      if (action === 'toggle') {
        sorted[idx] = { ...sorted[idx], isActive: !sorted[idx].isActive };
        return sorted.map((s, i) => ({ ...s, order: i }));
      }
      let newIdx = idx;
      if (action === 'up')     newIdx = Math.max(0, idx - 1);
      if (action === 'down')   newIdx = Math.min(sorted.length - 1, idx + 1);
      if (action === 'top')    newIdx = 0;
      if (action === 'bottom') newIdx = sorted.length - 1;
      if (newIdx === idx) return prev;
      const [moved] = sorted.splice(idx, 1);
      sorted.splice(newIdx, 0, moved);
      return sorted.map((s, i) => ({ ...s, order: i }));
    });
  }, []);

  // ── Section selection (dirty guard → switch modal) ─────────────────────────
  const handleSelectSection = (id: string) => {
    if (id === activeId) return;
    isDirty ? setModal({ reason: 'switch', pendingId: id }) : setActiveId(id);
  };

  // ── Unified modal discard handler ──────────────────────────────────────────
  const handleModalDiscard = () => {
    if (!modal) return;
    if (modal.reason === 'switch' && modal.pendingId) {
      setSections(JSON.parse(JSON.stringify(savedSnapshot)));
      setActiveId(modal.pendingId);
    }
    if (modal.reason === 'navigate' && modal.pendingId) {
      // Re-fire navigation after discarding — bypass the Inertia guard
      // by visiting directly (the guard only fires when isDirty is true,
      // and we've just reset to snapshot so it will be clean).
      setSections(JSON.parse(JSON.stringify(savedSnapshot)));
      // Allow state to flush before navigating
      setTimeout(() => router.visit(modal.pendingId!), 0);
    }
    if (modal.reason === 'publish') {
      // "Discard" on publish modal = cancel, do nothing
    }
    setModal(null);
  };

  const handleModalKeep = () => setModal(null);

  // ── Publish (with confirmation modal) ─────────────────────────────────────
  const handlePublish = () => {
    if (!isDirty) return;
    // Show a publish-confirm modal before firing the request
    setModal({ reason: 'publish' });
  };

  const confirmPublish = () => {
    setModal(null);
    router.put(
      '/admin/banners/sections/update',
      { sections },
      {
        onSuccess: () => setSavedSnapshot(JSON.parse(JSON.stringify(sections))),
        preserveScroll: true,
      }
    );
  };

  // ── Factory reset (active section only) ───────────────────────────────────
  const handleFactoryReset = () => {
    const factory = FACTORY_SECTIONS.find(f => f.id === activeId);
    if (!factory) return;
    setSections(prev => prev.map(s => s.id === activeId ? JSON.parse(JSON.stringify(factory)) : s));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: t.bg, color: t.text, fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Top Bar ────────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: 52, flexShrink: 0,
        borderBottom: `1px solid ${t.border}`, background: t.bg,
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em', color: t.text }}>Visual catalog</div>
          <div style={{ fontSize: 10, color: t.textMuted, fontFamily: 'monospace' }}>storefront banner editor</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Reset to factory */}
          <button
            onClick={handleFactoryReset}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: t.textMuted, opacity: 0.6,
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0.6'}
          >
            <RotateCcw size={12} /> Reset to Factory
          </button>

          {/* Unsaved badge */}
          {isDirty && (
            <span style={{
              padding: '2px 8px', fontSize: 9, fontWeight: 800, textTransform: 'uppercase',
              borderRadius: 20, backgroundColor: `${t.primary}20`, color: t.primary,
            }}>
              Unsaved
            </span>
          )}

          {/* Publish */}
          <button
            onClick={handlePublish}
            disabled={!isDirty}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: t.text, color: t.bg, border: 'none',
              padding: '8px 18px', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.07em', textTransform: 'uppercase',
              cursor: isDirty ? 'pointer' : 'not-allowed', borderRadius: 6,
              fontFamily: 'monospace', opacity: isDirty ? 1 : 0.3,
              transition: 'opacity 0.2s',
              boxShadow: isDirty ? `0 0 0 3px ${t.primary}30, 0 4px 14px ${t.primary}30` : 'none',
            }}
          >
            <Save size={12} /> Publish Changes
          </button>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Left Sidebar ────────────────────────────────────────────────── */}
        <aside style={{
          width: 230, flexShrink: 0,
          borderRight: `1px solid ${t.border}`,
          display: 'flex', flexDirection: 'column',
          background: t.sidebarBg, overflow: 'hidden',
        }}>
          <div style={{
            padding: '10px 12px 8px', fontSize: 10, fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase', color: t.textMuted,
            borderBottom: `1px solid ${t.border}`, fontFamily: 'monospace', flexShrink: 0,
          }}>
            Sections
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {sections.map((s, i) => (
              <SidebarItem
                key={s.id}
                section={s}
                index={i}
                isActive={s.id === activeId}
                isDirty={isDirty && s.id === activeId}
                onSelect={handleSelectSection}
                onAction={(action) => handleAction(s.id, action)}
              />
            ))}
          </div>
        </aside>

        {/* ── Center Preview ───────────────────────────────────────────────── */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: t.bgSecondary }}>
          <div style={{
            padding: '9px 16px', borderBottom: `1px solid ${t.border}`,
            fontSize: 10, color: t.textMuted, background: t.bg, fontFamily: 'monospace', flexShrink: 0,
          }}>
            Editing: <strong style={{ color: t.primary, fontWeight: 500 }}>{typeLabel(activeSection?.type ?? '')}</strong>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeSection && <BannerPreview section={activeSection} />}
            <button
              style={{
                width: '100%', padding: 12, background: 'transparent',
                border: `0.5px dashed ${t.borderHover}`, borderRadius: 8,
                color: t.textMuted, fontSize: 12, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = t.card}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
            >
              <Plus size={14} /> Add {typeLabel(activeSection?.type ?? '')} section
            </button>
          </div>
        </main>

        {/* ── Right Panel (collapsible) ────────────────────────────────────── */}
        <aside style={{
          width: rightOpen ? 240 : 40, flexShrink: 0,
          borderLeft: `1px solid ${t.border}`,
          display: 'flex', flexDirection: 'column',
          background: t.bg, overflow: 'hidden',
          transition: 'width 0.3s ease',
        }}>
          {/* Toggle row */}
          <div style={{
            padding: '0 10px', height: 40, flexShrink: 0,
            display: 'flex', alignItems: 'center',
            borderBottom: `1px solid ${t.border}`,
            background: t.bg,
            justifyContent: rightOpen ? 'space-between' : 'center',
          }}>
            <button
              onClick={() => setRightOpen(v => !v)}
              style={{
                width: 22, height: 22, display: 'grid', placeItems: 'center',
                background: 'none', border: 'none', cursor: 'pointer',
                color: t.textMuted, borderRadius: 5,
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = t.secondary}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
            >
              {rightOpen ? <PanelRight size={16} /> : <ChevronLeft size={16} />}
            </button>
            {rightOpen && (
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.textMuted, fontFamily: 'monospace' }}>
                Content
              </span>
            )}
          </div>

          {/* Editor body */}
          {rightOpen && (
            <ContentEditor
              section={activeSection}
              onUpdate={(updates) => activeSection && updateSection(activeSection.id, updates)}
            />
          )}
        </aside>
      </div>

      {/* ── Unsaved Changes / Publish Confirm / Navigate Away Modal ─────── */}
      {modal !== null && (
        <UnsavedModal
          sectionName={activeSection?.title.replace(/\n/g, ' ') ?? 'this section'}
          reason={modal.reason}
          // For 'publish': primary button = confirm publish, secondary = cancel
          // For 'switch' / 'navigate': primary button = keep/stay, secondary = discard/leave
          onKeep={modal.reason === 'publish' ? confirmPublish : handleModalKeep}
          onDiscard={modal.reason === 'publish' ? handleModalKeep : handleModalDiscard}
        />
      )}
    </div>
  );
}

BannerEditor.layout = (page: any) => <AdminLayout>{page}</AdminLayout>;