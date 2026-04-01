import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import { Banner } from "@/types/bannerTypes";
import { RotateCcw, Save, Upload } from "lucide-react";

function BannerPreview({ banner }: { banner: Banner }) {
  const { state: { currentTheme: t } } = useStoreConfigCtx();
  const b = t.banner;
  const mainUrl      = banner.mainMedia?.url      ?? '';
  const secondaryUrl = banner.secondaryMedia?.url ?? '';

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

  return (
    <div style={{
      display: 'flex',
      flexDirection: banner.direction === 'rtl' ? 'row-reverse' : 'row',
      borderRadius: 10, overflow: 'hidden', minHeight: 340, background: t.card,
    }}>
      <div style={{
        width: '45%', padding: '40px 32px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12,
      }}>
        <span style={{
          display: 'inline-block', alignSelf: 'flex-start',
          padding: '3px 10px', borderRadius: 20,
          fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
          background: `${t.primary}18`, color: t.primary,
        }}>
          {banner.key.replace(/_/g, ' ')}
        </span>
        <h2 style={{
          fontSize: 'clamp(1.4rem, 2.5vw, 2.4rem)', fontWeight: 700,
          color: t.text, lineHeight: 1.15, letterSpacing: '-0.02em',
        }}>
          {banner.name}
        </h2>
        <p style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.7 }}>
          {banner.subname}
        </p>
        <button style={{
          alignSelf: 'flex-start', marginTop: 6,
          padding: '9px 22px',
          background: b?.accentBtn ?? t.primary,
          color: b?.accentBtnText ?? t.textInverse,
          border: 'none', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.2em', cursor: 'pointer',
          borderRadius: 3, textTransform: 'uppercase',
        }}>
          Explore
        </button>
      </div>

      {/* Main image side */}
      <div style={{ flex: 1, position: 'relative', minHeight: 340 }}>
        <ImgBox src={mainUrl} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

        {/* Secondary image inset */}
        {secondaryUrl && (
          <div style={{
            position: 'absolute', bottom: 20,
            left:  banner.direction === 'rtl' ? 'auto' : 16,
            right: banner.direction === 'rtl' ? 16    : 'auto',
            width: 110, height: 90,
            border: `3px solid ${t.card}`, borderRadius: 6, overflow: 'hidden',
            boxShadow: t.shadowLg,
          }}>
            <ImgBox src={secondaryUrl} style={{ width: '100%', height: '100%' }} />
          </div>
        )}
      </div>
    </div>
  );
}


export default function BannerCenterPanel({ activeBanner, isDirty, isSaving, onReset, onPublish }: {
  activeBanner: Banner | undefined;
  isDirty: boolean;
  isSaving: boolean;
  onReset: () => void;
  onPublish: () => void;
}) {
  const { state: { currentTheme: t } } = useStoreConfigCtx();

  return (
    <main style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      overflow: 'hidden', background: t.bgSecondary, minWidth: 0,
    }}>
      <header style={{
        flexShrink: 0, height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', borderBottom: `1px solid ${t.border}`, background: t.bg,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: t.text }}>
            {activeBanner?.name ?? 'Banner'} — Preview
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

      {/* Preview body */}
      <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
        {activeBanner && (
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <BannerPreview banner={activeBanner} />

            {/* Meta strip */}
            <div style={{
              marginTop: 12, padding: '8px 14px',
              background: t.bg, borderRadius: 8, border: `0.5px solid ${t.border}`,
              display: 'flex', gap: 24,
            }}>
              {[
                { label: 'Key',   value: activeBanner.key            },
                { label: 'Slug',  value: activeBanner.slug           },
                { label: 'Order', value: String(activeBanner.order)  },
              ].map(({ label, value }) => (
                <div key={label}>
                  <span style={{ fontSize: 9, fontFamily: 'monospace', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {label}
                  </span>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', color: t.text, marginLeft: 8 }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}