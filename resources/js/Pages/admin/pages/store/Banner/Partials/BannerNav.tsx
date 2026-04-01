import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import { Banner } from "@/types/bannerTypes";
import { ArrowDownToLine, ArrowUpToLine, ChevronDown, ChevronRight, ChevronUp, Eye, EyeOff, MoreVertical, PanelLeft, Upload } from "lucide-react";
import { useState } from "react";

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
      icon:  isActive ? <EyeOff size={12} /> : <Eye size={12} />,
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

export default function BannerNav({ open, onToggle, banners, activeId, dirtyId, onSelect, onAction }: {
  open: boolean;
  onToggle: () => void;
  banners: Banner[];
  activeId: number;
  dirtyId: number | null;
  onSelect: (id: number) => void;
  onAction: (id: number, action: string) => void;
}) {
  const { state: { currentTheme: t } } = useStoreConfigCtx();

  return (
    <aside style={{
      width: open ? 230 : 40, flexShrink: 0,
      borderRight: `1px solid ${t.border}`,
      display: 'flex', flexDirection: 'column',
      background: t.sidebarBg, overflow: 'hidden',
      transition: 'width 0.3s ease',
    }}>
      <div style={{
        flexShrink: 0, height: 56,
        display: 'flex', alignItems: 'center', padding: '0 12px',
        borderBottom: `1px solid ${t.border}`,
        justifyContent: open ? 'space-between' : 'center',
        background: t.sidebarBg,
      }}>
        {open && (
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: t.text }}>
            Banners
          </span>
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

      {open && (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {banners.map((banner, i) => (
            <div
              key={banner.id}
              onClick={() => onSelect(banner.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 10px', cursor: 'pointer',
                borderLeft: `2px solid ${banner.id === activeId ? t.primary : 'transparent'}`,
                background: banner.id === activeId ? `${t.primary}0f` : 'transparent',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => { if (banner.id !== activeId) (e.currentTarget as HTMLElement).style.background = t.sidebarHover; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = banner.id === activeId ? `${t.primary}0f` : 'transparent'; }}
            >
              {/* Thumbnail */}
              <div style={{
                width: 36, height: 28, borderRadius: 4, overflow: 'hidden',
                flexShrink: 0, background: t.card, border: `0.5px solid ${t.border}`,
              }}>
                {banner.mainMedia?.url
                  ? <img src={banner.mainMedia.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                  : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
                      <Upload size={10} style={{ color: t.textMuted, opacity: 0.4 }} />
                    </div>
                }
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 12, fontWeight: 500,
                  color: banner.id === activeId ? t.primary : t.text,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {banner.name}
                </div>
                <div style={{ fontSize: 9, color: t.textMuted, fontFamily: 'monospace' }}>
                  {banner.key}
                </div>
              </div>

              {/* Dirty dot */}
              {dirtyId === banner.id && (
                <span style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, backgroundColor: t.primary }} />
              )}

              {/* Live badge */}
              <span style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '2px 6px', borderRadius: 20,
                fontSize: 9, fontFamily: 'monospace', flexShrink: 0,
                background: banner.is_active ? 'rgba(29,158,117,0.14)' : t.secondary,
                color: banner.is_active ? t.success : t.textMuted,
              }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: banner.is_active ? t.success : t.textMuted }} />
                {banner.is_active ? 'live' : 'hidden'}
              </span>

              <DotsMenu
                isFirst={i === 0}
                isLast={i === banners.length - 1}
                isActive={banner.is_active}
                onAction={(action) => onAction(banner.id, action)}
              />
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
