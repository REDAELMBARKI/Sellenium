import React, { useState, useCallback, useRef } from 'react';
import {
  Image, Layers, Film, LayoutDashboard, Columns2, LayoutGrid,
  MoreVertical, ChevronUp, ChevronDown, ArrowUpToLine, ArrowDownToLine,
  Eye, EyeOff, Upload, ArrowLeftRight, Loader2, Plus,
} from 'lucide-react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';

// ─── Mock Theme (replace with useStoreConfigCtx in production) ───────────────
const THEME = {
  bg: '#0f1011',
  bgSecondary: '#18191b',
  card: '#1e2022',
  modal: '#1e2022',
  overlay: 'rgba(0,0,0,0.6)',
  sidebarBg: '#0f1011',
  sidebarFg: '#e8e9ea',
  sidebarBorder: '#252729',
  sidebarHover: '#1e2022',
  sidebarMuted: '#3a3d43',
  sidebarMutedFg: '#6b7280',
  sidebarActive: '#25262a',
  sidebarActiveFg: '#a78bfa',
  text: '#e8e9ea',
  textSecondary: '#9a9da6',
  textMuted: '#555a63',
  textInverse: '#0f1011',
  primary: '#7F77DD',
  primaryHover: '#6d65c8',
  secondary: '#2a2c30',
  secondaryHover: '#333640',
  accent: '#a78bfa',
  accentHover: '#9474f5',
  border: '#252729',
  borderHover: '#3a3d43',
  borderRadius: '10px',
  link: '#a78bfa',
  linkHover: '#c4b5fd',
  shadow: '0 1px 3px rgba(0,0,0,0.5)',
  shadowMd: '0 4px 12px rgba(0,0,0,0.4)',
  shadowLg: '0 12px 32px rgba(0,0,0,0.6)',
  badge: '#2a2c30',
  success: '#1D9E75',
  info: '#378ADD',
  error: '#E24B4A',
  warning: '#BA7517',
  priceText: '#e8e9ea',
  priceStrike: '#555a63',
  dealBg: '#1e2022',
  starColor: '#EF9F27',
  promotionBg: {
    percentage: '#D85A30',
    fixed: '#185FA5',
    free_shipping: '#1D9E75',
    text: '#ffffff',
    badge: '#EF9F27',
    badgeText: '#0f1011',
  },
  banner: {
    scrim: 'rgba(0,0,0,0.45)',
    scrimText: '#ffffff',
    scrimSubtext: 'rgba(255,255,255,0.7)',
    scrimBorder: 'rgba(255,255,255,0.8)',
    solidBg: '#0d1117',
    solidText: '#ffffff',
    solidSubtext: 'rgba(255,255,255,0.65)',
    accentBtn: '#7F77DD',
    accentBtnText: '#ffffff',
  },
};

// ─── Section Type Registry ────────────────────────────────────────────────────
const SECTION_TYPES = [
  { type: 'overlay',         label: 'Overlay',        Icon: Image,           description: 'Full-bleed image with text overlay' },
  { type: 'lifestyle-inset', label: 'Lifestyle Inset', Icon: Layers,          description: 'Text panel + photo with floating inset card' },
  { type: 'cinematic-hero',  label: 'Cinematic Hero',  Icon: Film,            description: 'Video-ready hero with bottom gradient' },
  { type: 'editorial-text',  label: 'Editorial',       Icon: LayoutDashboard, description: 'Solid brand background, no media' },
  { type: 'duotone-split',   label: 'Duotone Split',   Icon: Columns2,        description: 'Brand-colored left + photo right' },
  { type: 'double-media',    label: 'Double Media',    Icon: LayoutGrid,      description: 'Side-by-side photos with overlapping text' },
];

// ─── Fake Sections Data ───────────────────────────────────────────────────────
const INITIAL_SECTIONS = [
  {
    id: 's1', type: 'overlay', isActive: true, order: 0, direction: null,
    tag: 'New Season', title: 'MODERN MINIMALISM',
    subtitle: 'Clean lines and timeless silhouettes for the sophisticated wardrobe.',
    ctaLabel: 'EXPLORE',
    images: [
      { slot: 'main', url: 'https://images.unsplash.com/photo-1490481651871-ab68624d5517?q=80&w=2000', label: 'Background image' },
    ],
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
    images: [
      { slot: 'main', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2000', label: 'Background image' },
    ],
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
    images: [
      { slot: 'main', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1400', label: 'Feature photo' },
    ],
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getImg = (section, slot = 'main') =>
  section.images.find(i => i.slot === slot)?.url || '';

const typeLabel = (type) =>
  SECTION_TYPES.find(s => s.type === type)?.label ?? type;

const typeIcon = (type) => {
  const found = SECTION_TYPES.find(s => s.type === type);
  return found ? <found.Icon size={12} /> : <Image size={12} />;
};

// ─── Dots Menu ────────────────────────────────────────────────────────────────
function DotsMenu({ isFirst, isLast, isActive, onAction }) {
  const [open, setOpen] = useState(false);
  const t = THEME;

  const items = [
    { label: 'Move up',         icon: <ChevronUp size={12} />,      action: 'up',     disabled: isFirst },
    { label: 'Move down',       icon: <ChevronDown size={12} />,    action: 'down',   disabled: isLast },
    null,
    { label: 'Move to top',     icon: <ArrowUpToLine size={12} />,  action: 'top',    disabled: isFirst },
    { label: 'Move to bottom',  icon: <ArrowDownToLine size={12} />,action: 'bottom', disabled: isLast },
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
          border: 'none', borderRadius: 5, cursor: 'pointer',
          color: t.textMuted, opacity: 1,
        }}
      >
        <MoreVertical size={13} />
      </button>
      {open && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 40 }}
            onClick={() => setOpen(false)}
          />
          <div style={{
            position: 'absolute', right: 0, top: '110%', zIndex: 50,
            background: t.card, border: `0.5px solid ${t.borderHover}`,
            borderRadius: 10, padding: 4, minWidth: 162,
            boxShadow: t.shadowLg,
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
                      fontSize: 11, textAlign: 'left',
                      opacity: item.disabled ? 0.35 : 1,
                    }}
                    onMouseEnter={e => { if (!item.disabled) e.currentTarget.style.background = t.secondary; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span style={{ color: '#D85A30', width: 14 }}>{item.icon}</span>
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

// ─── Left Sidebar Item ────────────────────────────────────────────────────────
function SidebarItem({ section, index, isActive, onSelect, onAction }) {
  const t = THEME;
  return (
    <div
      onClick={() => onSelect(section.id)}
      style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '8px 10px',
        cursor: 'pointer',
        borderLeft: `2px solid ${isActive ? t.primary : 'transparent'}`,
        background: isActive ? `${t.primary}0f` : 'transparent',
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = t.sidebarHover; }}
      onMouseLeave={e => { e.currentTarget.style.background = isActive ? `${t.primary}0f` : 'transparent'; }}
    >
      {/* order number */}
      <span style={{ fontSize: 10, fontFamily: 'monospace', color: t.textMuted, width: 14, textAlign: 'right', flexShrink: 0 }}>
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* icon */}
      <span style={{ color: isActive ? t.primary : t.textMuted, flexShrink: 0 }}>
        {typeIcon(section.type)}
      </span>

      {/* info */}
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

      {/* live/hidden pill */}
      <span style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '2px 6px', borderRadius: 20,
        fontSize: 9, fontFamily: 'monospace', flexShrink: 0,
        background: section.isActive ? 'rgba(29,158,117,0.14)' : t.secondary,
        color: section.isActive ? '#1D9E75' : t.textMuted,
      }}>
        <span style={{
          width: 4, height: 4, borderRadius: '50%',
          background: section.isActive ? '#1D9E75' : t.textMuted,
        }} />
        {section.isActive ? 'live' : 'hidden'}
      </span>

      {/* dots menu */}
      <DotsMenu
        isFirst={index === 0}
        isLast={false}
        isActive={section.isActive}
        onAction={onAction}
      />
    </div>
  );
}

// ─── Banner Preview ───────────────────────────────────────────────────────────
function BannerPreview({ section }) {
  const t = THEME;
  const b = t.banner;
  const main = getImg(section, 'main');
  const secondary = getImg(section, 'secondary');

  const ImgBox = ({ src, style, children }) => (
    <div style={{ position: 'relative', background: '#1a2235', ...style }}>
      {src
        ? <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
        : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', background: '#1d2535' }}>
            <Upload size={20} style={{ color: '#556', opacity: 0.4 }} />
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

  // ── OVERLAY ──────────────────────────────────────────────────────────────
  if (section.type === 'overlay') return (
    <div style={{ position: 'relative', width: '100%', minHeight: 340, borderRadius: 10, overflow: 'hidden' }}>
      <ImgBox src={main} style={{ position: 'absolute', inset: 0 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 100%)' }} />
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

  // ── LIFESTYLE INSET ───────────────────────────────────────────────────────
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

  // ── CINEMATIC HERO ────────────────────────────────────────────────────────
  if (section.type === 'cinematic-hero') return (
    <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', minHeight: 340 }}>
      <ImgBox src={main} style={{ position: 'absolute', inset: 0 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)' }} />
      <div style={{ position: 'relative', zIndex: 1, minHeight: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: '40px 32px', textAlign: 'center', gap: 8 }}>
        {section.tag && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>{section.tag}</span>}
        <h2 style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 700, color: '#fff', lineHeight: 1, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{section.title}</h2>
        <p style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>{section.subtitle}</p>
        <button style={{ marginTop: 10, padding: '10px 28px', background: b.accentBtn, color: b.accentBtnText, border: 'none', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', cursor: 'pointer', borderRadius: 3 }}>
          {section.ctaLabel}
        </button>
      </div>
    </div>
  );

  // ── EDITORIAL TEXT ────────────────────────────────────────────────────────
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

  // ── DUOTONE SPLIT ─────────────────────────────────────────────────────────
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

  // ── DOUBLE MEDIA ──────────────────────────────────────────────────────────
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
function ImageSlot({ imageObj, label, onChange }) {
  const t = THEME;
  const fileRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    // Simulate upload — replace with real upload in production
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
                ? <Loader2 size={18} style={{ color: t.textMuted, animation: 'spin 1s linear infinite' }} />
                : <Upload size={16} style={{ color: t.textMuted, opacity: 0.6 }} />
              }
              <span style={{ fontSize: 10, color: t.textMuted }}>{loading ? 'Uploading…' : 'Click to upload'}</span>
            </div>
          )
        }
        {imageObj?.url && !loading && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'}
          >
            <Upload size={16} style={{ color: '#fff', opacity: 0 }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
            />
          </div>
        )}
      </div>
      <input type="file" ref={fileRef} accept="image/*,video/*" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  );
}

// ─── Right Content Editor ─────────────────────────────────────────────────────
function ContentEditor({ section, onUpdate }) {
  const t = THEME;
  if (!section) return (
    <div style={{ padding: 16, color: t.textMuted, fontSize: 12 }}>Select a section to edit</div>
  );

  const Field = ({ label, children }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 500, color: t.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 5 }}>{label}</div>
      {children}
    </div>
  );

  const inputStyle = {
    width: '100%', padding: '7px 9px', fontSize: 12,
    border: `0.5px solid ${t.border}`, borderRadius: 8,
    background: t.bgSecondary, color: t.text,
    outline: 'none', fontFamily: 'inherit', resize: 'none',
    transition: 'border-color 0.1s',
  };

  const hasDirection = ['lifestyle-inset', 'duotone-split', 'double-media'].includes(section.type);
  const imageSlotDefs = {
    'overlay':         [{ slot: 'main', label: 'Background image' }],
    'lifestyle-inset': [{ slot: 'main', label: 'Main photo' }, { slot: 'secondary', label: 'Inset photo' }],
    'cinematic-hero':  [{ slot: 'main', label: 'Background image' }],
    'editorial-text':  [],
    'duotone-split':   [{ slot: 'main', label: 'Feature photo' }],
    'double-media':    [{ slot: 'main', label: 'Left photo' }, { slot: 'secondary', label: 'Right photo' }],
  }[section.type] ?? [];

  const updateImage = (slot, newImgObj) => {
    const newImages = section.images.filter(i => i.slot !== slot);
    onUpdate({ images: [...newImages, newImgObj] });
  };

  const Sep = () => <div style={{ height: 0.5, background: t.border, margin: '14px 0' }} />;
  const SectionTitle = ({ children }) => (
    <div style={{ fontSize: 10, fontWeight: 500, color: t.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 10 }}>{children}</div>
  );

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>

      {/* Images */}
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

      {/* Text */}
      <SectionTitle>Text</SectionTitle>

      <Field label="Tag / eyebrow">
        <input
          style={inputStyle} value={section.tag || ''}
          onChange={e => onUpdate({ tag: e.target.value })}
          placeholder="e.g. New Season"
          onFocus={e => e.target.style.borderColor = t.primary}
          onBlur={e => e.target.style.borderColor = t.border}
        />
      </Field>

      <Field label="Headline">
        <textarea
          style={{ ...inputStyle, lineHeight: 1.5 }}
          value={section.title} rows={2}
          onChange={e => onUpdate({ title: e.target.value })}
          placeholder="Main headline"
          onFocus={e => e.target.style.borderColor = t.primary}
          onBlur={e => e.target.style.borderColor = t.border}
        />
      </Field>

      <Field label="Body copy">
        <textarea
          style={{ ...inputStyle, lineHeight: 1.5 }}
          value={section.subtitle} rows={3}
          onChange={e => onUpdate({ subtitle: e.target.value })}
          placeholder="Supporting copy"
          onFocus={e => e.target.style.borderColor = t.primary}
          onBlur={e => e.target.style.borderColor = t.border}
        />
      </Field>

      <Field label="Button label">
        <input
          style={inputStyle} value={section.ctaLabel || ''}
          onChange={e => onUpdate({ ctaLabel: e.target.value })}
          placeholder="e.g. EXPLORE"
          onFocus={e => e.target.style.borderColor = t.primary}
          onBlur={e => e.target.style.borderColor = t.border}
        />
      </Field>

      <Sep />
      <SectionTitle>Settings</SectionTitle>

      {/* Direction toggle */}
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

      {/* Visibility toggle */}
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
            background: '#fff', top: 3,
            left: section.isActive ? 19 : 3,
            transition: 'left 0.2s',
          }} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Editor ──────────────────────────────────────────────────────────────
export default function BannerEditor() {
  const t = THEME;
  const [sections, setSections] = useState(
    [...INITIAL_SECTIONS].sort((a, b) => a.order - b.order)
  );
  const [activeId, setActiveId] = useState(INITIAL_SECTIONS[0].id);

  const activeSection = sections.find(s => s.id === activeId);

  const updateSection = useCallback((id, updates) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const handleAction = useCallback((id, action) => {
    setSections(prev => {
      const sorted = [...prev];
      const idx = sorted.findIndex(s => s.id === id);
      if (idx < 0) return prev;
      let newIdx = idx;
      if (action === 'up')     newIdx = Math.max(0, idx - 1);
      if (action === 'down')   newIdx = Math.min(sorted.length - 1, idx + 1);
      if (action === 'top')    newIdx = 0;
      if (action === 'bottom') newIdx = sorted.length - 1;
      if (action === 'toggle') {
        sorted[idx] = { ...sorted[idx], isActive: !sorted[idx].isActive };
        return sorted.map((s, i) => ({ ...s, order: i }));
      }
      if (newIdx === idx) return prev;
      const [moved] = sorted.splice(idx, 1);
      sorted.splice(newIdx, 0, moved);
      return sorted.map((s, i) => ({ ...s, order: i }));
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: t.bg, color: t.text, fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Top Bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: 52,
        borderBottom: `1px solid ${t.border}`,
        background: t.bg, flexShrink: 0,
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>Visual catalog</div>
          <div style={{ fontSize: 10, color: t.textMuted, fontFamily: 'monospace' }}>storefront banner editor</div>
        </div>
        <button style={{
          background: t.text, color: t.bg,
          border: 'none', padding: '8px 18px',
          fontSize: 11, fontWeight: 600, letterSpacing: '0.07em',
          textTransform: 'uppercase', cursor: 'pointer',
          borderRadius: 6, fontFamily: 'monospace',
        }}>
          Publish changes
        </button>
      </div>

      {/* ── Body ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Left Sidebar ── */}
        <aside style={{
          width: 230, flexShrink: 0,
          borderRight: `1px solid ${t.border}`,
          display: 'flex', flexDirection: 'column',
          background: t.sidebarBg, overflow: 'hidden',
        }}>
          <div style={{ padding: '10px 12px 8px', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.textMuted, borderBottom: `1px solid ${t.border}`, fontFamily: 'monospace', flexShrink: 0 }}>
            Sections
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {sections.map((s, i) => (
              <SidebarItem
                key={s.id}
                section={s}
                index={i}
                isActive={s.id === activeId}
                onSelect={setActiveId}
                onAction={(action) => handleAction(s.id, action)}
              />
            ))}
          </div>
        </aside>

        {/* ── Center Preview ── */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: t.bgSecondary }}>
          <div style={{ padding: '9px 16px', borderBottom: `1px solid ${t.border}`, fontSize: 10, color: t.textMuted, background: t.bg, fontFamily: 'monospace', flexShrink: 0 }}>
            Editing: <strong style={{ color: t.primary, fontWeight: 500 }}>{typeLabel(activeSection?.type ?? '')}</strong>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeSection && <BannerPreview section={activeSection} />}

            {/* Add section placeholder */}
            <button
              style={{
                width: '100%', padding: 12, background: 'transparent',
                border: `0.5px dashed ${t.borderHover}`, borderRadius: 8,
                color: t.textMuted, fontSize: 12, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              }}
              onMouseEnter={e => e.currentTarget.style.background = t.card}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Plus size={14} /> Add {typeLabel(activeSection?.type ?? '')} section
            </button>
          </div>
        </main>

        {/* ── Right Editor Sidebar ── */}
        <aside style={{
          width: 240, flexShrink: 0,
          borderLeft: `1px solid ${t.border}`,
          display: 'flex', flexDirection: 'column',
          background: t.bg, overflow: 'hidden',
        }}>
          <div style={{ padding: '10px 12px 8px', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.textMuted, borderBottom: `1px solid ${t.border}`, fontFamily: 'monospace', flexShrink: 0 }}>
            Content
          </div>
          <ContentEditor
            section={activeSection}
            onUpdate={(updates) => activeSection && updateSection(activeSection.id, updates)}
          />
        </aside>

      </div>
    </div>
  );
}

BannerEditor.layout = (page :any) => <AdminLayout >{page}</AdminLayout>