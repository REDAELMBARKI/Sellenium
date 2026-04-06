import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import type { Section, BannerSection, CollectionSection, CollectionSortable } from '@/types/homeEditorType';
import { BannerPreview } from './BannerPreview';
import CollectionRenderer from '../../RuleBasedCollections/Partials/CollectionRenderer';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PreviewPanelProps = {
  sections: Section[];
  onPublish: () => void;
  onDiscard: () => void;
  onToggle: () => void;
  isOpen: boolean;
};

export function PreviewPanel({ sections, onPublish, onDiscard , onToggle , isOpen }: PreviewPanelProps) {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: theme.bg,
    }}>
      {/* Header */}
      <div
        style={{
          height: 53,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'relative',
          borderBottom: `1px solid ${theme.border}`,
          flexShrink: 0,
        }}
      > 
      <button
                onClick={onToggle}
                title={isOpen ? 'Collapse' : 'Expand'}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.sidebarMutedFg,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 4,
                  borderRadius: 4,
                  marginLeft: isOpen ? 0 : 'auto',
                  transition: 'color 0.1s',
                  position: 'absolute',
                  left: 0,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = theme.sidebarMuted;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = theme.sidebarMutedFg;
                }}
              >
                {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
        <span style={{
          fontSize: 11,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          color: theme.textMuted,
        }}>
          Preview
        </span>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={onDiscard}
            style={{
              fontSize: 12.5,
              fontWeight: 400,
              color: theme.textMuted,
              background: 'none',
              border: `1px solid ${theme.borderHover}`,
              padding: '5px 14px',
              borderRadius: 5,
              cursor: 'pointer',
              transition: 'color 0.12s, border-color 0.12s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = theme.text;
              el.style.borderColor = theme.border;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = theme.textMuted;
              el.style.borderColor = theme.borderHover;
            }}
          >
            Discard
          </button>

          <button
            onClick={onPublish}
            style={{
              fontSize: 12.5,
              fontWeight: 500,
              color: theme.textInverse,
              background: theme.primary,
              border: 'none',
              padding: '5px 16px',
              borderRadius: 5,
              cursor: 'pointer',
              transition: 'background 0.12s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = theme.primaryHover;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = theme.primary;
            }}
          >
            Publish
          </button>
        </div>
      </div>

      {/* Sections */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        {sections.map(section => (
          <div key={section.id}>
            {section.sortable_type === 'banner'
              ? <BannerPreview banner={section.sortable} />
              : <CollectionRenderer  isLoading={section.sortable.products.length == 0} isEditor={true} collection={section.sortable as CollectionSortable} />
            }
          </div>
        ))}
      </div>
    </div>
  );
}