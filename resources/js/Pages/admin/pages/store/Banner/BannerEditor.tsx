import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import {
  Image, Layers, Film, LayoutDashboard, Columns2, LayoutGrid,
  MoreVertical, ChevronUp, ChevronDown, ArrowUpToLine, ArrowDownToLine,
  Eye, EyeOff, Upload, ArrowLeftRight, Loader2, Plus,
  PanelRight, PanelLeft, ChevronLeft, ChevronRight,
  RotateCcw, Save, AlertTriangle, X,
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

interface AvailableType {
  type: string;
  label: string;
}

interface BannerEditorProps {
  initialSections: BannerSection[];
  factorySections: BannerSection[];
  availableTypes: AvailableType[];
}

// ─── Section Type Registry ────────────────────────────────────────────────────

const SECTION_TYPES = [
  { type: 'overlay',         label: 'Overlay',         Icon: Image           },
  { type: 'lifestyle-inset', label: 'Lifestyle Inset',  Icon: Layers          },
  { type: 'cinematic-hero',  label: 'Cinematic Hero',   Icon: Film            },
  { type: 'editorial-text',  label: 'Editorial',        Icon: LayoutDashboard },
  { type: 'duotone-split',   label: 'Duotone Split',    Icon: Columns2        },
  { type: 'double-media',    label: 'Double Media',     Icon: LayoutGrid      },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getImg = (section: BannerSection, slot = 'main') =>
  section.images.find(i => i.slot === slot)?.url || '';

const typeLabel = (type: string) =>
  SECTION_TYPES.find(s => s.type === type)?.label ?? type;

const typeIcon = (type: string) => {
  const found = SECTION_TYPES.find(s => s.type === type);
  return found ? <found.Icon size={12} /> : <Image size={12} />;
};

// ─── Unsaved Modal ────────────────────────────────────────────────────────────

function UnsavedModal({ sectionName, onDiscard, onKeep }: {
  sectionName: string;
  onDiscard: () => void;
  onKeep: () => void;
}) {
  const { state: { currentTheme: t } } = useStoreConfigCtx();

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onKeep} />
      <div style={{
        position: 'relative', zIndex: 10, width: 380,
        borderRadius: 16, border: `1px solid ${t.border}`,
        padding: 24, boxShadow: t.shadowLg, backgroundColor: t.bgSecondary,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
          <div style={{
            flexShrink: 0, width: 36, height: 36, borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: `${t.primary}20`,
          }}>
            <AlertTriangle size={16} style={{ color: t.primary }} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 800, marginBottom: 6, color: t.text }}>
              You have unsaved changes
            </p>
            <p style={{ fontSize: 11, lineHeight: 1.6, color: t.textSecondary }}>
              Changes to <strong>{sectionName}</strong> will be lost if you switch without publishing first.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onKeep} style={{
            flex: 1, padding: '10px 0', fontSize: 10, fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: '0.08em',
            borderRadius: 10, border: 'none', cursor: 'pointer',
            backgroundColor: t.primary, color: t.textInverse,
          }}>Keep Editing</button>
          <button onClick={onDiscard} style={{
            flex: 1, padding: '10px 0', fontSize: 10, fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: '0.08em',
            borderRadius: 10, border: `1px solid ${t.border}`,
            background: 'transparent', cursor: 'pointer', color: t.text,
          }}>Discard Changes</button>
        </div>
      </div>
    </div>
  );
}

// ─── Type Picker Modal ────────────────────────────────────────────────────────

function TypePickerModal({ availableTypes, onPick, onClose }: {
  availableTypes: AvailableType[];
  onPick: (type: string) => void;
  onClose: () => void;
}) {
  const { state: { currentTheme: t } } = useStoreConfigCtx();

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div style={{
        position: 'relative', zIndex: 10, width: 460,
        borderRadius: 16, border: `1px solid ${t.border}`,
        padding: 24, boxShadow: t.shadowLg, backgroundColor: t.bgSecondary,
      }}>
        {/* Modal header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 800, color: t.text }}>Add a section</p>
            <p style={{ fontSize: 11, color: t.textMuted, marginTop: 3 }}>Choose a layout type to get started</p>
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, display: 'grid', placeItems: 'center',
            background: t.secondary, border: 'none', borderRadius: 7,
            cursor: 'pointer', color: t.textMuted, flexShrink: 0,
          }}>
            <X size={14} />
          </button>
        </div>

        {/* Type grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {availableTypes.map(({ type, label }) => {
            const found = SECTION_TYPES.find(s => s.type === type);
            const Icon = found?.Icon ?? Image;
            return (
              <button
                key={type}
                onClick={() => onPick(type)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '13px 14px', borderRadius: 10,
                  border: `1px solid ${t.border}`,
                  background: t.bg, cursor: 'pointer', textAlign: 'left',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = t.primary;
                  (e.currentTarget as HTMLElement).style.background = `${t.primary}0d`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = t.border;
                  (e.currentTarget as HTMLElement).style.background = t.bg;
                }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                  display: 'grid', placeItems: 'center',
                  background: `${t.primary}18`, color: t.primary,
                }}>
                  <Icon size={15} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{label}</div>
                  <div style={{ fontSize: 9, color: t.textMuted, fontFamily: 'monospace', marginTop: 2 }}>{type}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Dots Menu ────────────────────────────────────────────────────────────────

function DotsMenu({ isFirst, isLast, isActive, onAction }: {
  isFirst: boolean;
  isLast: boolean;
  isActive: boolean;
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

// ─── Banner Preview ───────────────────────────────────────────────────────────

function BannerPreview({ section }: { section: BannerSection }) {
  const { state: { currentTheme: t } } = useStoreConfigCtx();
  const b = t.banner;
  const main = getImg(section, 'main');
  const secondary = getImg(section, 'secondary');

  const ImgBox = ({ src, style }: { src: string; style?: React.CSSProperties }) => (
    <div style={{ position: 'relative', background: t.card, ...style }}>
      {src
        ? <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
        : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', background: t.bgSecondary }}>
            <Upload size={20} style={{ color: t.textMuted, opacity: 0.4 }} />
          </div>
      }
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
          position: 'absolute', bottom: 20,
          left: section.direction === 'rtl' ? 'auto' : 16,
          right: section.direction === 'rtl' ? 16 : 'auto',
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
  imageObj: BannerImage;
  label: string;
  onChange: (img: BannerImage) => void;
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
          border: `0.5px dashed ${t.borderHover}`, background: t.bgSecondary,
          overflow: 'hidden', cursor: loading ? 'wait' : 'pointer', position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {imageObj?.url && !loading
          ? <img src={imageObj.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
          : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              {loading ? <Loader2 size={18} style={{ color: t.textMuted }} /> : <Upload size={16} style={{ color: t.textMuted, opacity: 0.6 }} />}
              <span style={{ fontSize: 10, color: t.textMuted }}>{loading ? 'Uploading…' : 'Click to upload'}</span>
            </div>
          )
        }
      </div>
      <input type="file" ref={fileRef} accept="image/*,video/*" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  );
}

// ─── Content Editor ───────────────────────────────────────────────────────────

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
    outline: 'none', fontFamily: 'inherit', resize: 'none',
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
  const Label = ({ children }: { children: React.ReactNode }) => (
    <div style={{ fontSize: 10, fontWeight: 600, color: t.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 10 }}>{children}</div>
  );
  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 500, color: t.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 5 }}>{label}</div>
      {children}
    </div>
  );

  return (
    <>
      {imageSlotDefs.length > 0 && (
        <>
          <Label>Images</Label>
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

      <Label>Text</Label>
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
      <Label>Settings</Label>

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
    </>
  );
}

// ─── BannerEditorNav ──────────────────────────────────────────────────────────

function BannerEditorNav({ open, onToggle, sections, activeId, dirtyId, onSelect, onAction }: {
  open: boolean;
  onToggle: () => void;
  sections: BannerSection[];
  activeId: string;
  dirtyId: string | null;
  onSelect: (id: string) => void;
  onAction: (id: string, action: string) => void;
}) {
  const { state: { currentTheme: t } } = useStoreConfigCtx();

  return (
    <aside style={{
      width: open ? 230 : 40,
      flexShrink: 0,
      borderRight: `1px solid ${t.border}`,
      display: 'flex',
      flexDirection: 'column',
      background: t.sidebarBg,
      overflow: 'hidden',
      transition: 'width 0.3s ease',
      // No height set here — it's bounded by the parent flex row
    }}>
      {/* Fixed column header */}
      <div style={{
        flexShrink: 0,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        borderBottom: `1px solid ${t.border}`,
        justifyContent: open ? 'space-between' : 'center',
        background: t.sidebarBg,
      }}>
        {open && (
          <span style={{
            fontSize: 11, fontWeight: 800, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: t.text,
          }}>Sections</span>
        )}
        <button
          onClick={onToggle}
          style={{
            width: 26, height: 26, display: 'grid', placeItems: 'center',
            background: 'none', border: 'none', cursor: 'pointer',
            color: t.textMuted, borderRadius: 5, flexShrink: 0,
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = t.secondary}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
        >
          {open ? <PanelLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Independent inner scroll */}
      {open && (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {sections.map((s, i) => (
            <div
              key={s.id}
              onClick={() => onSelect(s.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '8px 10px', cursor: 'pointer',
                borderLeft: `2px solid ${s.id === activeId ? t.primary : 'transparent'}`,
                background: s.id === activeId ? `${t.primary}0f` : 'transparent',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => { if (s.id !== activeId) (e.currentTarget as HTMLElement).style.background = t.sidebarHover; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = s.id === activeId ? `${t.primary}0f` : 'transparent'; }}
            >
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: t.textMuted, width: 14, textAlign: 'right', flexShrink: 0 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ color: s.id === activeId ? t.primary : t.textMuted, flexShrink: 0 }}>
                {typeIcon(s.type)}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 12, fontWeight: 500,
                  color: s.id === activeId ? t.primary : t.text,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {s.title.replace(/\n/g, ' ')}
                </div>
                <div style={{ fontSize: 9, color: t.textMuted, fontFamily: 'monospace' }}>
                  {typeLabel(s.type)}
                </div>
              </div>

              {dirtyId === s.id && (
                <span style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, backgroundColor: t.primary }} />
              )}

              <span style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '2px 6px', borderRadius: 20,
                fontSize: 9, fontFamily: 'monospace', flexShrink: 0,
                background: s.isActive ? 'rgba(29,158,117,0.14)' : t.secondary,
                color: s.isActive ? t.success : t.textMuted,
              }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: s.isActive ? t.success : t.textMuted }} />
                {s.isActive ? 'live' : 'hidden'}
              </span>

              <DotsMenu
                isFirst={i === 0}
                isLast={i === sections.length - 1}
                isActive={s.isActive}
                onAction={(action) => onAction(s.id, action)}
              />
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}

// ─── Banner Center Panel ──────────────────────────────────────────────────────

function BannerCenterPanel({ activeSection, isDirty, isSaving, onAddSection, onReset, onPublish }: {
  activeSection: BannerSection | undefined;
  isDirty: boolean;
  isSaving: boolean;
  onAddSection: () => void;
  onReset: () => void;
  onPublish: () => void;
}) {
  const { state: { currentTheme: t } } = useStoreConfigCtx();

  return (
    <main style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',       // ← no outer scroll
      background: t.bgSecondary,
      minWidth: 0,
    }}>
      {/* Fixed column header — holds all global actions */}
      <header style={{
        flexShrink: 0,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        borderBottom: `1px solid ${t.border}`,
        background: t.bg,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontSize: 11, fontWeight: 800, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: t.text,
          }}>
            {activeSection?.title.replace(/\n/g, ' ') ?? 'Banner'} Editor
          </span>
          {isDirty && (
            <span style={{
              padding: '2px 8px', fontSize: 9, fontWeight: 800,
              textTransform: 'uppercase', borderRadius: 20,
              backgroundColor: `${t.primary}20`, color: t.primary,
            }}>Unsaved</span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Add Section */}
          <button
            onClick={onAddSection}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 8,
              border: `1px solid ${t.border}`,
              background: t.secondary, color: t.text,
              fontSize: 10, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.08em',
              cursor: 'pointer', transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = t.primary}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = t.border}
          >
            <Plus size={12} /> Add Section
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: t.textMuted, opacity: 0.6,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0.6'}
          >
            <RotateCcw size={12} /> Reset
          </button>

          {/* Publish */}
          <button
            onClick={onPublish}
            disabled={!isDirty || isSaving}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: t.text, color: t.bg, border: 'none',
              padding: '8px 18px', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.07em', textTransform: 'uppercase',
              cursor: isDirty && !isSaving ? 'pointer' : 'not-allowed',
              borderRadius: 6, fontFamily: 'monospace',
              opacity: isDirty ? 1 : 0.3, transition: 'opacity 0.2s',
              boxShadow: isDirty ? `0 0 0 3px ${t.primary}30, 0 4px 14px ${t.primary}30` : 'none',
            }}
          >
            <Save size={12} />
            {isSaving ? 'Publishing…' : 'Publish Changes'}
          </button>
        </div>
      </header>

      {/* Preview body — fixed height, NO scroll */}
      <div style={{ flex: 1, overflow: 'hidden', padding: 16 }}>
        {activeSection && <BannerPreview section={activeSection} />}
      </div>
    </main>
  );
}

// ─── Banner Inspector ─────────────────────────────────────────────────────────

function BannerInspector({ open, onToggle, activeSection, onUpdate }: {
  open: boolean;
  onToggle: () => void;
  activeSection: BannerSection | undefined;
  onUpdate: (updates: Partial<BannerSection>) => void;
}) {
  const { state: { currentTheme: t } } = useStoreConfigCtx();

  return (
    <aside style={{
      width: open ? 240 : 40,
      flexShrink: 0,
      borderLeft: `1px solid ${t.border}`,
      display: 'flex',
      flexDirection: 'column',
      background: t.bg,
      overflow: 'hidden',
      transition: 'width 0.3s ease',
    }}>
      {/* Fixed column header */}
      <div style={{
        flexShrink: 0,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        borderBottom: `1px solid ${t.border}`,
        background: t.bg,
        justifyContent: open ? 'space-between' : 'center',
      }}>
        {open && (
          <span style={{
            fontSize: 11, fontWeight: 800, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: t.text,
          }}>Content</span>
        )}
        <button
          onClick={onToggle}
          style={{
            width: 26, height: 26, display: 'grid', placeItems: 'center',
            background: 'none', border: 'none', cursor: 'pointer',
            color: t.textMuted, borderRadius: 5, flexShrink: 0,
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = t.secondary}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
        >
          {open ? <PanelRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Independent inner scroll */}
      {open && (
        <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
          <ContentEditor section={activeSection} onUpdate={onUpdate} />
        </div>
      )}
    </aside>
  );
}

// ─── Main Editor ──────────────────────────────────────────────────────────────

export default function BannerEditor({ initialSections, factorySections, availableTypes }: BannerEditorProps) {
  const { state: { currentTheme: t } } = useStoreConfigCtx();

  // ── Live editing state — seeded from DB ────────────────────────────────────
  const [sections, setSections] = useState<BannerSection[]>(
    [...initialSections].sort((a, b) => a.order - b.order)
  );

  // ── Snapshot — advances only on successful publish ─────────────────────────
  const [savedSnapshot, setSavedSnapshot] = useState<BannerSection[]>(
    JSON.parse(JSON.stringify(initialSections))
  );

  const [activeId, setActiveId]         = useState<string>(initialSections[0]?.id ?? '');
  const [leftOpen, setLeftOpen]         = useState(true);
  const [rightOpen, setRightOpen]       = useState(true);
  const [isSaving, setIsSaving]         = useState(false);
  const [pendingSwitchId, setPendingSwitchId] = useState<string | null>(null);
  const [showTypePicker, setShowTypePicker]   = useState(false);

  // ── Sync when Inertia re-hydrates ─────────────────────────────────────────
  useEffect(() => {
    const sorted = [...initialSections].sort((a, b) => a.order - b.order);
    setSections(sorted);
    setSavedSnapshot(JSON.parse(JSON.stringify(sorted)));
    setActiveId(sorted[0]?.id ?? '');
  }, [initialSections]);

  const activeSection = useMemo(
    () => sections.find(s => s.id === activeId) ?? sections[0],
    [sections, activeId]
  );

  const isDirty = useMemo(
    () => JSON.stringify(sections) !== JSON.stringify(savedSnapshot),
    [sections, savedSnapshot]
  );

  // ── Browser unload guard ──────────────────────────────────────────────────
  useEffect(() => {
    const handle = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handle);
    return () => window.removeEventListener('beforeunload', handle);
  }, [isDirty]);

  // ── Inertia navigate-away guard ───────────────────────────────────────────
  useEffect(() => {
    const off = router.on('before', (event) => {
      if (!isDirty) return;
      event.preventDefault();
      // '__navigate__' is a sentinel that means "leave the page entirely"
      setPendingSwitchId('__navigate__');
    });
    return () => off();
  }, [isDirty]);

  // ── Section field updater ─────────────────────────────────────────────────
  const updateSection = useCallback((id: string, updates: Partial<BannerSection>) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  // ── Dots menu: reorder + toggle ───────────────────────────────────────────
  const handleAction = useCallback((id: string, action: string) => {
    setSections(prev => {
      const list = [...prev];
      const idx  = list.findIndex(s => s.id === id);
      if (idx < 0) return prev;

      if (action === 'toggle') {
        list[idx] = { ...list[idx], isActive: !list[idx].isActive };
        return list.map((s, i) => ({ ...s, order: i }));
      }

      let next = idx;
      if (action === 'up')     next = Math.max(0, idx - 1);
      if (action === 'down')   next = Math.min(list.length - 1, idx + 1);
      if (action === 'top')    next = 0;
      if (action === 'bottom') next = list.length - 1;
      if (next === idx) return prev;

      const [moved] = list.splice(idx, 1);
      list.splice(next, 0, moved);
      return list.map((s, i) => ({ ...s, order: i }));
    });
  }, []);

  // ── Section selection — guard dirty state ─────────────────────────────────
  const handleSelectSection = (id: string) => {
    if (id === activeId) return;
    isDirty ? setPendingSwitchId(id) : setActiveId(id);
  };

  // ── Discard: reset to snapshot then proceed ───────────────────────────────
  const handleDiscard = () => {
    if (!pendingSwitchId) return;
    setSections(JSON.parse(JSON.stringify(savedSnapshot)));
    if (pendingSwitchId !== '__navigate__') {
      setActiveId(pendingSwitchId);
    }
    setPendingSwitchId(null);
  };

  // ── Publish ───────────────────────────────────────────────────────────────
  const handlePublish = () => {
    if (!isDirty || isSaving) return;
    router.put(
      '/admin/banners/sections/update',
      { sections },
      {
        onBefore: () => setIsSaving(true),
        onSuccess: () => setSavedSnapshot(JSON.parse(JSON.stringify(sections))),
        onFinish: () => setIsSaving(false),
        preserveScroll: true,
      }
    );
  };

  // ── Factory reset (active section only) ───────────────────────────────────
  const handleFactoryReset = () => {
    const factory = factorySections.find(f => f.id === activeId);
    if (!factory) return;
    setSections(prev =>
      prev.map(s => s.id === activeId ? JSON.parse(JSON.stringify(factory)) : s)
    );
  };

  // ── Add new section (optimistic, saved on next publish) ───────────────────
  const handleAddSection = (type: string) => {
    const newSection: BannerSection = {
      id:        `temp_${Date.now()}`,
      type,
      isActive:  false,
      order:     sections.length,
      direction: 'ltr',
      tag:       '',
      title:     'Untitled Section',
      subtitle:  '',
      ctaLabel:  'Explore',
      images:    [],
    };
    setSections(prev => [...prev, newSection]);
    setActiveId(newSection.id);
    setShowTypePicker(false);
    // Auto-open right inspector so user can immediately rename
    setRightOpen(true);
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',                // ← outermost lock
      background: t.bg,
      color: t.text,
      fontFamily: 'system-ui, sans-serif',
    }}>

      {/* LEFT — sections nav */}
      <BannerEditorNav
        open={leftOpen}
        onToggle={() => setLeftOpen(v => !v)}
        sections={sections}
        activeId={activeId}
        dirtyId={isDirty ? activeId : null}
        onSelect={handleSelectSection}
        onAction={handleAction}
      />

      {/* CENTER — preview (no scroll) */}
      <BannerCenterPanel
        activeSection={activeSection}
        isDirty={isDirty}
        isSaving={isSaving}
        onAddSection={() => setShowTypePicker(true)}
        onReset={handleFactoryReset}
        onPublish={handlePublish}
      />

      {/* RIGHT — inspector */}
      <BannerInspector
        open={rightOpen}
        onToggle={() => setRightOpen(v => !v)}
        activeSection={activeSection}
        onUpdate={(updates) => activeSection && updateSection(activeSection.id, updates)}
      />

      {/* Unsaved changes modal */}
      {pendingSwitchId !== null && (
        <UnsavedModal
          sectionName={activeSection?.title.replace(/\n/g, ' ') ?? 'this section'}
          onDiscard={handleDiscard}
          onKeep={() => setPendingSwitchId(null)}
        />
      )}

      {/* Type picker modal */}
      {showTypePicker && (
        <TypePickerModal
          availableTypes={availableTypes}
          onPick={handleAddSection}
          onClose={() => setShowTypePicker(false)}
        />
      )}
    </div>
  );
}

BannerEditor.layout = (page: any) => <AdminLayout>{page}</AdminLayout>;