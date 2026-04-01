import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import { Banner, BannerMedia } from "@/types/bannerTypes";
import { ArrowLeftRight, ChevronLeft, Loader2, PanelRight, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function MediaSlot({ label, media, onChange }: {
  label: string;
  media: BannerMedia | null;
  onChange: (file: File) => void;
}) {
  const { state: { currentTheme: t } } = useStoreConfigCtx();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading]   = useState(false);
  const [preview, setPreview]   = useState<string | null>(media?.url ?? null);

  useEffect(() => { setPreview(media?.url ?? null); }, [media?.url]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setPreview(URL.createObjectURL(file));
    onChange(file);
    setLoading(false);
    e.target.value = '';
  };

  return (
    <div style={{ marginBottom: 12 }}>
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
        {preview && !loading
          ? <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
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


export default function BannerInspector({ open, onToggle, banner, onUpdate, onMediaChange }: {
  open: boolean;
  onToggle: () => void;
  banner: Banner | undefined;
  onUpdate: (updates: Partial<Banner>) => void;
  onMediaChange: (slot: 'main' | 'secondary', file: File) => void;
}) {
  const { state: { currentTheme: t } } = useStoreConfigCtx();

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '7px 9px', fontSize: 12,
    border: `0.5px solid ${t.border}`, borderRadius: 8,
    background: t.bgSecondary, color: t.text,
    outline: 'none', fontFamily: 'inherit', resize: 'none',
    transition: 'border-color 0.1s', boxSizing: 'border-box',
  };

  const Sep = () => <div style={{ height: 0.5, background: t.border, margin: '14px 0' }} />;

  const Label = ({ children }: { children: React.ReactNode }) => (
    <div style={{ fontSize: 10, fontWeight: 600, color: t.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 10 }}>
      {children}
    </div>
  );

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 500, color: t.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 5 }}>
        {label}
      </div>
      {children}
    </div>
  );

  return (
    <aside style={{
      width: open ? 248 : 40, flexShrink: 0,
      borderLeft: `1px solid ${t.border}`,
      display: 'flex', flexDirection: 'column',
      background: t.bg, overflow: 'hidden',
      transition: 'width 0.3s ease',
    }}>
      <div style={{
        flexShrink: 0, height: 56,
        display: 'flex', alignItems: 'center', padding: '0 12px',
        borderBottom: `1px solid ${t.border}`, background: t.bg,
        justifyContent: open ? 'space-between' : 'center',
      }}>
        {open && (
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: t.text }}>
            Edit Banner
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
          {open ? <PanelRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {open && banner && (
        <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>

          <Label>Media</Label>
          <MediaSlot
            label="Main image"
            media={banner.mainMedia}
            onChange={(file) => onMediaChange('main', file)}
          />
          <MediaSlot
            label="Secondary image"
            media={banner.secondaryMedia}
            onChange={(file) => onMediaChange('secondary', file)}
          />

          <Sep />

          <Label>Text</Label>
          <Field label="Name / headline">
            <textarea
              style={{ ...inputStyle, lineHeight: 1.5 }}
              value={banner.name}
              rows={2}
              onChange={e => onUpdate({ name: e.target.value })}
              placeholder="Banner headline"
              onFocus={e => (e.target as HTMLElement).style.borderColor = t.primary}
              onBlur={e => (e.target as HTMLElement).style.borderColor = t.border}
            />
          </Field>
          <Field label="Subname / body copy">
            <textarea
              style={{ ...inputStyle, lineHeight: 1.5 }}
              value={banner.subname}
              rows={3}
              onChange={e => onUpdate({ subname: e.target.value })}
              placeholder="Supporting copy"
              onFocus={e => (e.target as HTMLElement).style.borderColor = t.primary}
              onBlur={e => (e.target as HTMLElement).style.borderColor = t.border}
            />
          </Field>

          <Sep />

          <Label>Settings</Label>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 12, color: t.text }}>Layout direction</span>
            <button
              onClick={() => onUpdate({ direction: banner.direction === 'ltr' ? 'rtl' : 'ltr' })}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '5px 10px', borderRadius: 6, border: `0.5px solid ${t.border}`,
                background: t.secondary, color: t.text, fontSize: 11, cursor: 'pointer',
              }}
            >
              <ArrowLeftRight size={11} />
              {banner.direction.toUpperCase()}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: t.text }}>Live on storefront</span>
            <button
              onClick={() => onUpdate({ is_active: !banner.is_active })}
              style={{
                width: 36, height: 20, borderRadius: 10, border: 'none',
                background: banner.is_active ? t.success : t.secondary,
                cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
              }}
            >
              <span style={{
                position: 'absolute', width: 14, height: 14, borderRadius: '50%',
                background: '#fff', top: 3,
                left: banner.is_active ? 19 : 3, transition: 'left 0.2s',
              }} />
            </button>
          </div>

        </div>
      )}
    </aside>
  );
}
