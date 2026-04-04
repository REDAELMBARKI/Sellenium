import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import { Banner, BannerSlot } from "@/types/bannerTypes";
import { Link, router } from "@inertiajs/react";
import { EyeOff, Upload } from "lucide-react";

export default function BannerRenderer({
  banner,
  activeSlotKey,
  activeElementKey,
  onSlotSelect,
  onElementSelect,
  isEditor,
  onUpdate,
}: {
  isEditor: boolean;
  banner: Banner;
  activeSlotKey?: string;
  activeElementKey?: string | null;
  onSlotSelect?: (key: string) => void;
  onElementSelect?: (slotKey: string, elementKey: string) => void;
  onUpdate?: (path: string, value: any) => void;
}) {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  const visibleSlots = banner.slots.filter(s => s.is_visible);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: banner.direction === 'rtl' ? 'row-reverse' : 'row',
        borderRadius: banner.border_radius,
        overflow: 'hidden',
        minHeight: 320,
        width: '100%',
        position: 'relative',
        // kill all pointer interaction when not in editor
      }}
    >
      {banner.slots.map((slot) => {
        const isActive      = isEditor && slot.slot_key === activeSlotKey;
        const isVisible     = slot.is_visible;
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
            onClick={isEditor ? () => onSlotSelect?.(slot.slot_key) : undefined}
            style={{
              flex: flexStyle,
              overflow: 'hidden',
              position: 'relative',
              background: slot.bg_color ?? 'transparent',
              // only animate flex transition in the editor
              transition: isEditor ? 'flex 0.35s ease, outline 0.15s' : undefined,
              cursor: isEditor ? 'pointer' : 'default',
              // only show active outline in editor
              outline: isEditor && isActive
                ? `2.5px solid ${theme.primary}`
                : '2.5px solid transparent',
              outlineOffset: '-2.5px',
              minWidth: !isVisible ? 0 : undefined,
            }}
          >
            {isVisible && (
              <SlotContent
                slot={slot}
                theme={theme}
                slotKey={slot.slot_key}
                // never pass active element key outside editor
                activeElementKey={isEditor ? (isActive ? activeElementKey ?? null : null) : null}
                onElementSelect={isEditor ? onElementSelect : undefined}
                isEditor={isEditor}
              />
            )}

            {/* Slot label chip — editor only */}
            {isEditor && (
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
                {!isVisible && <EyeOff size={10} />}
              </div>
            )}

            {/* Hidden slot overlay — editor only */}
            {isEditor && !isVisible && (
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

function SlotContent({
  slot,
  theme,
  slotKey,
  activeElementKey,
  onElementSelect,
  isEditor,
}: {
  slot: BannerSlot;
  theme: any;
  slotKey: string;
  activeElementKey: string | null;
  onElementSelect?: (slotKey: string, elementKey: string) => void;
  isEditor: boolean;
}) {
  const select = (key: string) => onElementSelect?.(slotKey, key);

  if (slot.main_media?.url) {
    return (
      <>
        <ElementWrapper
          elementKey="main_media"
          activeElementKey={activeElementKey}
          onSelect={select}
          theme={theme}
          display="block"
          isEditor={isEditor}
        >
          <img
            src={slot.main_media.url}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </ElementWrapper>
        {slot.secondary_media?.url && (
          <ElementWrapper
            elementKey="secondary_media"
            activeElementKey={activeElementKey}
            onSelect={select}
            theme={theme}
            display="block"
            isEditor={isEditor}
          >
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
          <ElementWrapper elementKey="eyebrow" activeElementKey={activeElementKey} onSelect={select} theme={theme} display="inline-block" isEditor={isEditor}>
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: slot.elements.eyebrow.color,
            }}>
              {slot.elements.eyebrow.text}
            </span>
          </ElementWrapper>
        )}
        {slot.elements.title?.visible && (
          <ElementWrapper elementKey="title" activeElementKey={activeElementKey} onSelect={select} theme={theme} display="block" isEditor={isEditor}>
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
          <ElementWrapper elementKey="paragraph" activeElementKey={activeElementKey} onSelect={select} theme={theme} display="block" isEditor={isEditor}>
            <p style={{ fontSize: 13, color: slot.elements.paragraph.color, lineHeight: 1.7, margin: 0 }}>
              {slot.elements.paragraph.text}
            </p>
          </ElementWrapper>
        )}
        {slot.elements.button?.visible && (
          <ElementWrapper elementKey="button" activeElementKey={activeElementKey} onSelect={select} theme={theme} display="inline-block" isEditor={isEditor}>
              <button 
               onClick={isEditor ? undefined : () => {
                const href = slot.elements?.button?.link;
                if (href) router.visit(href);
               }}
              
               style={{
                
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

  // Empty placeholder — editor only, pointless to show on storefront
  if (!isEditor) return null;
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

function ElementWrapper({
  elementKey,
  activeElementKey,
  onSelect,
  children,
  theme,
  display = 'block',
  isEditor,
}: {
  elementKey: string;
  activeElementKey: string | null;
  onSelect: (key: string) => void;
  children: React.ReactNode;
  theme: any;
  display?: string;
  isEditor: boolean;
}) {
  // In non-editor mode, render children directly — zero wrapper overhead
  if (!isEditor) return <>{children}</>;

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