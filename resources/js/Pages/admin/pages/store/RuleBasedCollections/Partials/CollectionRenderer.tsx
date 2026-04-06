import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, icons } from 'lucide-react';
import { ProductCardMaster } from '../../../../../Home/Partials/ProductCardMaster';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { CollectionSortable } from '@/types/homeEditorType';
import DynamicIcon from '@/components/ui/DynamicIcon';

const DEFAULT_CARDS_VISIBLE = 5;
const CARD_GAP              = 24;
const TRACK_PADDING         = 80;

interface CollectionRendererProps {
  collection: CollectionSortable;
  onViewAll?: (key: string) => void;
  cardsVisible?: number;
  isEditor: boolean;
  isLoading?: boolean;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

const CollectionSkeleton: React.FC<{ titlePosition?: string }> = ({
  titlePosition = 'center',
}) => {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();

  const sk1  = theme.sidebarMuted;
  const sk2  = theme.card;
  const scan = theme.border;
  const fade = theme.bg;

  const titleAlign =
    titlePosition === 'left'  ? 'flex-start' :
    titlePosition === 'right' ? 'flex-end'   : 'center';

  const cards = [
    { delay: '0s',    opacity: 1    },
    { delay: '0.18s', opacity: 1    },
    { delay: '0.36s', opacity: 1    },
    { delay: '0.54s', opacity: 0.45 },
    { delay: '0.72s', opacity: 0.15 },
  ];

  return (
    <>
      <style>{`
        @keyframes col-drift {
          0%   { background-position: -1200px 0; }
          100% { background-position:  1200px 0; }
        }
        @keyframes col-scan {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%);  }
        }
      `}</style>

      {/* title placeholder */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: titleAlign, gap: 8, marginBottom: 28,
      }}>
        <div style={{ width: 190, height: 8, borderRadius: 99, background: sk1, position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `linear-gradient(90deg, transparent, ${scan}, transparent)`,
            animationName: 'col-scan', animationDuration: '2s',
            animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite',
          }} />
        </div>
        <div style={{ width: 110, height: 4, borderRadius: 99, background: theme.bgSecondary, position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `linear-gradient(90deg, transparent, ${sk1}, transparent)`,
            animationName: 'col-scan', animationDuration: '2s',
            animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite',
            animationDelay: '0.4s',
          }} />
        </div>
      </div>

      {/* card row */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 1 }}>
          {cards.map((c, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', opacity: c.opacity }}>

              {/* image block */}
              <div style={{
                width: '100%',
                aspectRatio: '3/4',
                backgroundImage: `linear-gradient(90deg, ${sk1} 0%, ${sk2} 35%, ${scan} 50%, ${sk2} 65%, ${sk1} 100%)`,
                backgroundSize: '1200px 100%',
                animationName: 'col-drift',
                animationDuration: '2.2s',
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                animationDelay: c.delay,
              }} />

              {/* text lines */}
              <div style={{ padding: '10px 0 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { w: '55%', h: '5px', d: '0s'    },
                  { w: '80%', h: '8px', d: '0.15s' },
                  { w: '38%', h: '5px', d: '0.3s'  },
                ].map((line, j) => (
                  <div key={j} style={{ width: line.w, height: line.h, borderRadius: 99, background: sk1, position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                      position: 'absolute', inset: 0,
                      backgroundImage: `linear-gradient(90deg, transparent, ${scan}, transparent)`,
                      animationName: 'col-scan', animationDuration: '2.4s',
                      animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite',
                      animationDelay: line.d,
                    }} />
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* right vignette — communicates undefined card count */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '22%', height: '100%',
          backgroundImage: `linear-gradient(to right, transparent, ${fade})`,
          pointerEvents: 'none',
        }} />
      </div>

      {/* loading bar */}
      <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, height: 1, background: theme.bgSecondary, position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '30%', height: '100%',
            backgroundImage: `linear-gradient(90deg, transparent, ${theme.textMuted}, transparent)`,
            animationName: 'col-scan', animationDuration: '2s',
            animationTimingFunction: 'linear', animationIterationCount: 'infinite',
          }} />
        </div>
        <div style={{
          fontSize: 10, letterSpacing: '0.2em',
          color: theme.textMuted, fontFamily: 'system-ui', fontWeight: 500,
        }}>
          LOADING
        </div>
        <div style={{ flex: 1, height: 1, background: theme.bgSecondary, position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '30%', height: '100%',
            backgroundImage: `linear-gradient(90deg, transparent, ${theme.textMuted}, transparent)`,
            animationName: 'col-scan', animationDuration: '2s',
            animationTimingFunction: 'linear', animationIterationCount: 'infinite',
            animationDelay: '1s',
          }} />
        </div>
      </div>
    </>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

export const CollectionRenderer: React.FC<CollectionRendererProps> = ({
  collection,
  onViewAll,
  isEditor,
  isLoading = false,
  cardsVisible = DEFAULT_CARDS_VISIBLE,
}) => {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  const sliderRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  const [offset,   setOffset]  = useState(0);
  const [cardW,    setCardW]   = useState(0);
  const [visibleN, setVisible] = useState(cardsVisible);

  const total       = collection?.products?.length ?? 0;
  const hasProducts = !isLoading && total > 0;

  useEffect(() => {
    const compute = () => {
      if (!windowRef.current) return;
      const trackW = windowRef.current.offsetWidth;
      const vw     = window.innerWidth;
      const n      = vw <= 600 ? 1 : vw <= 1024 ? 2 : cardsVisible;
      setVisible(n);
      setCardW((trackW - CARD_GAP * (n - 1)) / n);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [cardsVisible]);

  useEffect(() => {
    if (!sliderRef.current || !cardW) return;
    sliderRef.current.style.transform = `translateX(-${offset * (cardW + CARD_GAP)}px)`;
  }, [offset, cardW]);

  const maxOffset = Math.max(0, total - visibleN);
  const scroll    = (dir: 'left' | 'right') =>
    setOffset(prev => Math.max(0, Math.min(maxOffset, prev + (dir === 'left' ? -1 : 1))));

  const imageAreaHeight = cardW ? cardW * (4 / 3) : 300;

  return (
    <div style={{ marginBottom: '3.5rem', position: 'relative', userSelect: 'none' }}>

      {/* ── SKELETON STATE ── */}
      {isLoading && (
        <CollectionSkeleton titlePosition={collection.layout_config.titlePosition} />
      )}

      {/* ── LOADED STATE ── */}
      {!isLoading && (
        <>
          <style>{`
            .sr-card-inner > div {
              border: none !important;
              border-radius: 0 !important;
              box-shadow: none !important;
              background: ${theme.bg} !important;
              padding: 0 !important;
            }
            .sr-card-inner > div img {
              width: 100% !important;
              aspect-ratio: 3 / 4 !important;
              object-fit: cover !important;
              border-radius: 0 !important;
              display: block !important;
              transition: none !important;
              transform: none !important;
            }
            .sr-card-inner > div:hover { transform: none !important; box-shadow: none !important; }
            .sr-card-inner > div:hover img { transform: none !important; }
            .sr-card-inner > div > div[style*="opacity"] { opacity: 0 !important; pointer-events: none !important; }
          `}</style>

          {/* header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: collection.layout_config.headerSpacing ?? 0,
          }}>
            <div style={{
              flex: 1, display: 'flex',
              justifyContent:
                collection.layout_config.titlePosition === 'left'  ? 'flex-start' :
                collection.layout_config.titlePosition === 'right' ? 'flex-end'   : 'center',
            }}>
              <h2 style={{
                fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
                fontSize: '2rem', fontWeight: 500, color: theme.text,
                margin: 0, letterSpacing: '-0.01em',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                {collection.icon && <DynamicIcon name={collection.icon as keyof typeof icons} size={24} />}
                {collection.name}
              </h2>
            </div>

            {onViewAll && (
              <button
                onClick={() => { if (isEditor) return; onViewAll(collection.key); }}
                style={{
                  padding: '11px 28px',
                  borderRadius: theme.borderRadius,
                  border: `1.5px solid ${theme.border}`,
                  background: 'transparent',
                  color: theme.text,
                  fontSize: 12, fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap' as const,
                  pointerEvents: isEditor ? 'none' : 'auto',
                  cursor: isEditor ? 'default' : 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (isEditor) return;
                  e.currentTarget.style.background  = theme.text;
                  e.currentTarget.style.color       = theme.bg;
                  e.currentTarget.style.borderColor = theme.text;
                }}
                onMouseLeave={(e) => {
                  if (isEditor) return;
                  e.currentTarget.style.background  = 'transparent';
                  e.currentTarget.style.color       = theme.text;
                  e.currentTarget.style.borderColor = theme.border;
                }}
              >
                VIEW ALL &nbsp;→
              </button>
            )}
          </div>

          {/* arrow buttons */}
          {!isEditor && hasProducts && (['left', 'right'] as const).map((dir) => (
            <button
              key={dir}
              onClick={() => scroll(dir)}
              style={{
                position: 'absolute',
                top: `calc(${28 + 22}px + ${imageAreaHeight * 0.42}px)`,
                transform: 'translateY(-50%)',
                [dir === 'left' ? 'left' : 'right']: TRACK_PADDING - 18,
                zIndex: 20,
                width: 40, height: 40,
                borderRadius: '50%',
                border: `1px solid ${theme.border}`,
                background: theme.bg,
                color: theme.text,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: dir === 'left' ? (offset === 0 ? 'default' : 'pointer') : (offset >= maxOffset ? 'default' : 'pointer'),
                transition: 'opacity 0.18s, border-color 0.18s',
                opacity: dir === 'left' ? (offset === 0 ? 0.25 : 1) : (offset >= maxOffset ? 0.25 : 1),
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.text; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; }}
            >
              {dir === 'left' ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
            </button>
          ))}

          {/* viewport */}
          <div ref={windowRef} style={{ overflow: 'hidden', pointerEvents: isEditor ? 'none' : 'auto' }}>
            <div
              ref={sliderRef}
              style={{
                display: 'flex',
                justifyContent:
                  collection.layout_config.CollectionPosition === 'center' ? 'center' :
                  collection.layout_config.CollectionPosition === 'right'  ? 'flex-end' : 'flex-start',
                gap: CARD_GAP,
                transition: 'transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)',
                willChange: 'transform',
              }}
            >
              {(collection.products || []).map((product) => (
                <div
                  key={product.id}
                  style={{
                    width:    cardW || `calc((100% - ${CARD_GAP * (cardsVisible - 1)}px) / ${cardsVisible})`,
                    minWidth: cardW || `calc((100% - ${CARD_GAP * (cardsVisible - 1)}px) / ${cardsVisible})`,
                    flexShrink: 0,
                  }}
                >
                  <div className="sr-card-inner">
                    <ProductCardMaster isEditor={isEditor} product={product} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default CollectionRenderer;