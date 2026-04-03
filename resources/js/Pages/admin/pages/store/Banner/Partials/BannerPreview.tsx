import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import { Banner, BannerSlot } from "@/types/bannerTypes";
import { RotateCcw, Save, Upload, Eye, EyeOff, Plus, X } from "lucide-react";
import React, { useState } from "react";

// ─── Add Banner Modal ─────────────────────────────────────────────────────────

function AddBannerModal({
  availableBanners,
  onSelect,
  onClose,
}: {
  availableBanners: { key: string; name: string }[];
  onSelect: (key: string) => void;
  onClose: () => void;
}) {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
        }}
      />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', zIndex: 101,
        transform: 'translate(-50%, -50%)',
        width: 420, maxHeight: '70vh',
        background: theme.bg, borderRadius: 14,
        border: `1px solid ${theme.border}`,
        boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: `1px solid ${theme.border}`,
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.04em' }}>Add Banner</div>
            <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 2 }}>Choose a banner template to add</div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', color: theme.textMuted,
              cursor: 'pointer', padding: 4, borderRadius: 6,
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {availableBanners.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 32, color: theme.textMuted, fontSize: 12 }}>
              No banner templates available
            </div>
          ) : (
            availableBanners.map(b => (
              <button
                key={b.key}
                onClick={() => { onSelect(b.key); onClose(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 14px', borderRadius: 10,
                  border: `0.5px solid ${theme.border}`,
                  background: theme.bgSecondary,
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = theme.primary;
                  (e.currentTarget as HTMLElement).style.background = `${theme.primary}10`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = theme.border;
                  (e.currentTarget as HTMLElement).style.background = theme.bgSecondary;
                }}
              >
                <div style={{
                  width: 36, height: 28, borderRadius: 6,
                  background: `${theme.primary}20`,
                  display: 'grid', placeItems: 'center', flexShrink: 0,
                }}>
                  <Plus size={14} style={{ color: theme.primary }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.text }}>{b.name}</div>
                  <div style={{ fontSize: 10, color: theme.textMuted, fontFamily: 'monospace', marginTop: 2 }}>{b.key}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}

// ─── Element Wrapper (selectable/clickable element in preview) ────────────────

function ElementWrapper({
  elementKey,
  activeElementKey,
  onSelect,
  children,
  theme,
  display = 'block',
}: {
  elementKey: string;
  activeElementKey: string | null;
  onSelect: (key: string) => void;
  children: React.ReactNode;
  theme: any;
  display?: string;
}) {
  const isSelected = activeElementKey === elementKey;
  return (
    <div
      onClick={(e) => { e.stopPropagation(); onSelect(elementKey); }}
      onMouseEnter={(e) => {
        if (!isSelected)
          (e.currentTarget as HTMLElement).style.outlineColor = `${theme.primary}55`;
      }}
      onMouseLeave={(e) => {
        if (!isSelected)
          (e.currentTarget as HTMLElement).style.outlineColor = 'transparent';
      }}
      style={{
        display,
        cursor: 'pointer',
        borderRadius: 4,
        outline: isSelected ? `2px solid ${theme.primary}` : '2px solid transparent',
        outlineOffset: 4,
        transition: 'outline-color 0.15s',
      }}
    >
      {children}
    </div>
  );
}

// ─── Slot Content ─────────────────────────────────────────────────────────────

function SlotContent({
  slot,
  theme,
  slotKey,
  activeElementKey,
  onElementSelect,
}: {
  slot: BannerSlot;
  theme: any;
  slotKey: string;
  activeElementKey: string | null;
  onElementSelect: (slotKey: string, elementKey: string) => void;
}) {
  const select = (key: string) => onElementSelect(slotKey, key);

  if (slot.main_media?.url) {
    return (
      <>
        <ElementWrapper elementKey="main_media" activeElementKey={activeElementKey} onSelect={select} theme={theme} display="block">
          <img
            src={slot.main_media.url}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </ElementWrapper>
        {slot.secondary_media?.url && (
          <ElementWrapper elementKey="secondary_media" activeElementKey={activeElementKey} onSelect={select} theme={theme} display="block">
            <div style={{
              position: 'absolute', bottom: 16, right: 16,
              width: 110, height: 88, borderRadius: 6, overflow: 'hidden',
              border: `3px solid ${theme.card ?? '#fff'}`,
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            }}>
              <img
                src={slot.secondary_media.url}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </ElementWrapper>
        )}
      </>
    );
  }

  if (slot.elements) {
    return (
      <div style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '40px 36px', gap: 12,
      }}>
        {slot.elements.eyebrow?.visible && (
          <ElementWrapper elementKey="eyebrow" activeElementKey={activeElementKey} onSelect={select} theme={theme} display="inline-block">
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: slot.elements.eyebrow.color,
            }}>
              {slot.elements.eyebrow.text}
            </span>
          </ElementWrapper>
        )}
        {slot.elements.title?.visible && (
          <ElementWrapper elementKey="title" activeElementKey={activeElementKey} onSelect={select} theme={theme} display="block">
            <h2 style={{
              fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)', fontWeight: 700,
              color: slot.elements.title.color, lineHeight: 1.15,
              letterSpacing: '-0.02em', margin: 0,
            }}>
              {slot.elements.title.text}
            </h2>
          </ElementWrapper>
        )}
        {slot.elements.paragraph?.visible && (
          <ElementWrapper elementKey="paragraph" activeElementKey={activeElementKey} onSelect={select} theme={theme} display="block">
            <p style={{ fontSize: 13, color: slot.elements.paragraph.color, lineHeight: 1.7, margin: 0 }}>
              {slot.elements.paragraph.text}
            </p>
          </ElementWrapper>
        )}
        {slot.elements.button?.visible && (
          <ElementWrapper elementKey="button" activeElementKey={activeElementKey} onSelect={select} theme={theme} display="inline-block">
            <button style={{
              padding: '9px 22px',
              background: slot.elements.button.bg_color,
              color: slot.elements.button.text_color,
              border: 'none', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.12em', cursor: 'pointer',
              borderRadius: 3, textTransform: 'uppercase',
            }}>
              {slot.elements.button.text}
            </button>
          </ElementWrapper>
        )}
      </div>
    );
  }

  // Empty placeholder
  return (
    <div style={{
      width: '100%', height: '100%', minHeight: 200,
      display: 'grid', placeItems: 'center',
      background: theme.bgSecondary ?? '#f3f4f6',
    }}>
      <Upload size={24} style={{ opacity: 0.25 }} />
    </div>
  );
}

// ─── Banner Renderer ──────────────────────────────────────────────────────────

function BannerRenderer({
  banner,
  activeSlotKey,
  activeElementKey,
  onSlotSelect,
  onElementSelect,
  onUpdate,
}: {
  banner: Banner;
  activeSlotKey: string;
  activeElementKey: string | null;
  onSlotSelect: (key: string) => void;
  onElementSelect: (slotKey: string, elementKey: string) => void;
  onUpdate: (path: string, value: any) => void;
}) {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  const visibleSlots = banner.slots.filter(s => s.is_visible);

  return (
    <div style={{
      display: 'flex',
      flexDirection: banner.direction === 'rtl' ? 'row-reverse' : 'row',
      borderRadius: banner.border_radius,
      overflow: 'hidden',
      minHeight: 320,
      width: '100%',
      position: 'relative',
    }}>
      {banner.slots.map((slot, idx) => {
        const isActive  = slot.slot_key === activeSlotKey;
        const isVisible = slot.is_visible;

        const visibleIdx    = visibleSlots.findIndex(s => s.slot_key === slot.slot_key);
        const isLastVisible = isVisible && visibleIdx === visibleSlots.length - 1;
        const flexStyle     = !isVisible
          ? '0 0 0%'
          : isLastVisible
            ? '1 0 0%'
            : `0 0 ${slot.width}%`;

        return (
          <div
            key={slot.slot_key}
            onClick={() => onSlotSelect(slot.slot_key)}
            style={{
              flex: flexStyle,
              overflow: 'hidden',
              position: 'relative',
              background: slot.bg_color ?? 'transparent',
              transition: 'flex 0.35s ease, outline 0.15s',
              cursor: 'pointer',
              outline: isActive ? `2.5px solid ${theme.primary}` : '2.5px solid transparent',
              outlineOffset: '-2.5px',
              minWidth: !isVisible ? 0 : undefined,
            }}
          >
            {isVisible && (
              <SlotContent
                slot={slot}
                theme={theme}
                slotKey={slot.slot_key}
                activeElementKey={isActive ? activeElementKey : null}
                onElementSelect={onElementSelect}
              />
            )}

            {/* Slot label chip */}
            <div style={{
              position: 'absolute', top: 8, left: 8,
              display: 'flex', alignItems: 'center', gap: 5,
              background: isActive ? theme.primary : 'rgba(0,0,0,0.4)',
              color: '#fff',
              fontSize: 9, fontWeight: 800, letterSpacing: '0.1em',
              padding: '3px 8px', borderRadius: 20,
              textTransform: 'uppercase',
              pointerEvents: 'none',
            }}>
              {slot.slot_key}
              {!isVisible && <EyeOff size={10} />}
            </div>

            {/* Hidden slot overlay */}
            {!isVisible && (
              <div style={{
                position: 'absolute', inset: 0,
                background: `${theme.bgSecondary}cc`,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Compound Slot Tab (navigate + visibility toggle) ─────────────────────────

function SlotTab({
  slot,
  isActive,
  isLastVisible,
  onSelect,
  onToggleVisibility,
  theme,
}: {
  slot: BannerSlot;
  isActive: boolean;
  isLastVisible: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  theme: any;
}) {
  return (
    <div style={{
      display: 'flex',
      borderRadius: 20,
      overflow: 'hidden',
      border: `0.5px solid ${isActive ? theme.primary : theme.border}`,
      transition: 'border-color 0.15s',
    }}>
      {/* Navigate button — primary action */}
      <button
        onClick={onSelect}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 12px', border: 'none',
          background: isActive ? theme.primary : theme.bg,
          color: isActive ? '#fff' : slot.is_visible ? theme.text : theme.textMuted,
          fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.08em', cursor: 'pointer',
          transition: 'background 0.15s, color 0.15s',
        }}
      >
        {slot.slot_key}
      </button>

      {/* Divider */}
      <div style={{
        width: 1,
        background: isActive ? `${theme.primary}50` : theme.border,
        flexShrink: 0,
      }} />

      {/* Visibility toggle — secondary action */}
      <button
        onClick={(e) => { e.stopPropagation(); if (!isLastVisible) onToggleVisibility(); }}
        disabled={isLastVisible}
        title={
          isLastVisible
            ? 'At least one slot must be visible'
            : slot.is_visible ? 'Hide slot' : 'Show slot'
        }
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '5px 9px', border: 'none',
          background: isActive ? `${theme.primary}cc` : theme.bgSecondary,
          color: isActive ? '#ffffffcc' : theme.textMuted,
          cursor: isLastVisible ? 'not-allowed' : 'pointer',
          opacity: isLastVisible ? 0.35 : 1,
          transition: 'background 0.15s, color 0.15s',
        }}
        onMouseEnter={(e) => {
          if (!isLastVisible)
            (e.currentTarget as HTMLElement).style.color = isActive ? '#fff' : theme.text;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.color = isActive ? '#ffffffcc' : theme.textMuted;
        }}
      >
        {slot.is_visible ? <Eye size={10} /> : <EyeOff size={10} />}
      </button>
    </div>
  );
}

// ─── Center Panel ─────────────────────────────────────────────────────────────

export default function BannerCenterPanel({
  activeBanner,
  activeSlotKey,
  activeElementKey,
  onSlotSelect,
  onElementSelect,
  onToggleSlotVisibility,
  isDirty,
  isSaving,
  onReset,
  onPublish,
  onUpdate,
  onAddBanner,
  availableBannerTemplates = [],
}: {
  activeBanner: Banner | undefined;
  activeSlotKey: string;
  activeElementKey: string | null;
  onSlotSelect: (key: string) => void;
  onElementSelect: (slotKey: string, elementKey: string) => void;
  onToggleSlotVisibility: (slotKey: string) => void;
  isDirty: boolean;
  isSaving: boolean;
  onReset: () => void;
  onPublish: () => void;
  onUpdate: (path: string, value: any) => void;
  onAddBanner?: (key: string) => void;
  availableBannerTemplates?: { key: string; name: string }[];
}) {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <main style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      overflow: 'hidden', background: theme.bgSecondary, minWidth: 0,
    }}>
      {/* Toolbar */}
      <header style={{
        flexShrink: 0, height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', borderBottom: `1px solid ${theme.border}`, background: theme.bg,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontSize: 11, fontWeight: 800, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: theme.text,
          }}>
            {activeBanner?.name ?? 'Banner'} — Preview
          </span>
          {isDirty && (
            <span style={{
              padding: '2px 8px', fontSize: 9, fontWeight: 800,
              textTransform: 'uppercase', borderRadius: 20,
              backgroundColor: `${theme.primary}20`, color: theme.primary,
            }}>
              Unsaved
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Add Banner */}
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: theme.bgSecondary,
              border: `0.5px solid ${theme.border}`,
              borderRadius: 6, padding: '7px 14px',
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: theme.text, cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = theme.primary;
              (e.currentTarget as HTMLElement).style.color = theme.primary;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = theme.border;
              (e.currentTarget as HTMLElement).style.color = theme.text;
            }}
          >
            <Plus size={12} /> Add Banner
          </button>

          <button
            onClick={onReset}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: theme.textMuted, opacity: 0.6,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0.6'}
          >
            <RotateCcw size={12} /> Reset to Factory
          </button>

          <button
            onClick={onPublish}
            disabled={!isDirty || isSaving}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: theme.text, color: theme.bg, border: 'none',
              padding: '8px 18px', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.07em', textTransform: 'uppercase',
              cursor: isDirty && !isSaving ? 'pointer' : 'not-allowed',
              borderRadius: 6,
              opacity: isDirty ? 1 : 0.3, transition: 'opacity 0.2s',
              boxShadow: isDirty ? `0 0 0 3px ${theme.primary}30, 0 4px 14px ${theme.primary}30` : 'none',
            }}
          >
            <Save size={12} />
            {isSaving ? 'Publishing…' : 'Publish Changes'}
          </button>
        </div>
      </header>

      {/* Preview body */}
      <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
        {activeBanner && (
          <div style={{ maxWidth: 960, margin: '0 auto' }}>

            <BannerRenderer
              banner={activeBanner}
              activeSlotKey={activeSlotKey}
              activeElementKey={activeElementKey}
              onSlotSelect={onSlotSelect}
              onElementSelect={onElementSelect}
              onUpdate={onUpdate}
            />

            {/* Compound slot tabs — navigate + visibility toggle */}
            <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
              {activeBanner.slots.map(slot => {
                const visibleCount   = activeBanner.slots.filter(s => s.is_visible).length;
                const isLastVisible  = slot.is_visible && visibleCount === 1;

                return (
                  <SlotTab
                    key={slot.slot_key}
                    slot={slot}
                    isActive={slot.slot_key === activeSlotKey}
                    isLastVisible={isLastVisible}
                    onSelect={() => onSlotSelect(slot.slot_key)}
                    onToggleVisibility={() => onToggleSlotVisibility(slot.slot_key)}
                    theme={theme}
                  />
                );
              })}

              {/* Hint */}
              <span style={{
                fontSize: 9, color: theme.textMuted, marginLeft: 4,
                fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                opacity: 0.5,
              }}>
                Click tab to select · Eye to toggle visibility
              </span>
            </div>

            {/* Meta strip */}
            <div style={{
              marginTop: 8, padding: '8px 14px',
              background: theme.bg, borderRadius: 8, border: `0.5px solid ${theme.border}`,
              display: 'flex', gap: 24,
            }}>
              {[
                { label: 'Key',       value: activeBanner.key },
                { label: 'Direction', value: activeBanner.direction.toUpperCase() },
                { label: 'Slots',     value: `${activeBanner.slots.filter(s => s.is_visible).length} visible` },
                { label: 'Ratio',     value: activeBanner.aspect_ratio },
              ].map(({ label, value }) => (
                <div key={label}>
                  <span style={{ fontSize: 9, fontFamily: 'monospace', color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {label}
                  </span>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', color: theme.text, marginLeft: 8 }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Banner Modal */}
      {showAddModal && (
        <AddBannerModal
          availableBanners={availableBannerTemplates}
          onSelect={(key) => onAddBanner?.(key)}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </main>
  );
}