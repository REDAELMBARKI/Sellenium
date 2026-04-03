import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import { Banner } from "@/types/bannerTypes";
import { PanelLeft, MoreVertical, ArrowUp, ArrowDown, ArrowUpToLine, ArrowDownToLine } from "lucide-react";
import { useState } from "react";

interface BannerNavProps {
  open: boolean;
  onToggle: () => void;
  banners: Banner[];
  activeId: number;
  onSelect: (id: number) => void;
}

type ReorderAction = 'increment' | 'decrement' | 'start' | 'end';

interface ReorderItem {
  label: string;
  action: ReorderAction;
  Icon: React.ElementType;
  disabledAt: 'first' | 'last';
}



export default function BannerNav({ open, onToggle, banners, activeId, onSelect }: BannerNavProps) {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  const getThumbnailUrl = (banner: Banner): string | null => {
    const imageSlot = banner.slots.find(slot => slot.main_media?.url);
    return imageSlot?.main_media?.url ?? null;
  };

  const closeMenu = () => setMenuOpenId(null);

  return (
    <aside style={{
      width: open ? 240 : 40,
      flexShrink: 0,
      borderRight: `1px solid ${theme.border}`,
      background: theme.bg,
      transition: 'width 0.3s',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        height: 56,
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        borderBottom: `1px solid ${theme.border}`,
      }}>
        {open && (
          <span style={{
            fontSize: 10, fontWeight: 800,
            letterSpacing: '0.14em', textTransform: 'uppercase',
          }}>
            My Banners
          </span>
        )}
        <button
          onClick={onToggle}
          style={{
            marginLeft: 'auto', background: 'none', border: 'none',
            color: theme.textMuted, cursor: 'pointer', padding: 4,
          }}
        >
          <PanelLeft size={16} />
        </button>
      </div>

      {/* Banner list */}
      {open && (
        <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {banners.map((banner, index) => {
            const isActive   = banner.id === activeId;
            const isFirst    = index === 0;
            const isLast     = index === banners.length - 1;
            const thumb      = getThumbnailUrl(banner);
            const slotCount  = banner.slots.length;
            const isMenuOpen = menuOpenId === banner.id;

            return (
              <div key={banner.id} style={{ position: 'relative' }}>

                {/* Row */}
                <div
                  onClick={() => onSelect(banner.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    background: isActive ? `${theme.primary}15` : 'transparent',
                    borderLeft: `3px solid ${isActive ? theme.primary : 'transparent'}`,
                    transition: 'background 0.15s',
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{
                    width: 40, height: 30, flexShrink: 0,
                    borderRadius: 4, overflow: 'hidden',
                    background: banner.bg_color ?? theme.bgSecondary,
                  }}>
                    {thumb && (
                      <img
                        src={thumb}
                        alt={banner.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                  </div>

                  {/* Name + status */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 12, fontWeight: 600,
                      color: isActive ? theme.primary : theme.text,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {banner.name}
                    </div>
                    <div style={{ fontSize: 9, color: theme.textMuted, marginTop: 2 }}>
                      {banner.is_active ? 'Live' : 'Hidden'} · {slotCount} slot{slotCount !== 1 ? 's' : ''}
                    </div>
                  </div>

                  {/* Three dots — always visible, hoverable */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenId(isMenuOpen ? null : banner.id);
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = `${theme.primary}18`;
                      el.style.color = theme.primary;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = isMenuOpen ? `${theme.primary}18` : 'transparent';
                      el.style.color = isMenuOpen ? theme.primary : theme.textMuted;
                    }}
                    style={{
                      flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 24, height: 24,
                      background: isMenuOpen ? `${theme.primary}18` : 'transparent',
                      border: 'none', borderRadius: 4,
                      color: isMenuOpen ? theme.primary : theme.textMuted,
                      cursor: 'pointer',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                  >
                    <MoreVertical size={14} />
                  </button>
                </div>
                {/* Reorder popup */}
                {isMenuOpen && (
                  <>
                    <div
                      style={{ position: 'fixed', inset: 0, zIndex: 20 }}
                      onClick={closeMenu}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '100%', right: 8,
                      zIndex: 30,
                      width: 164,
                      background: theme.bgSecondary,
                      border: `0.5px solid ${theme.border}`,
                      borderRadius: 10,
                      padding: 4,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    }}>
                      
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}