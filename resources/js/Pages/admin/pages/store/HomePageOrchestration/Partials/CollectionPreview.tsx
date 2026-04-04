import type { CollectionSection } from '@/types/homeEditor';
import { ThemePalette } from '@/types/ThemeTypes';
import { typePill } from './ThemeUtils';
import { ProductCard } from './ProductCard';

type CollectionPreviewProps = {
  section: CollectionSection;
  theme: ThemePalette;
};

export function CollectionPreview({ section, theme }: CollectionPreviewProps) {
  const collection = section.sortable;
  const products = collection.products.slice(0, collection.layout_config.displayLimit);

  return (
    <div style={{
      borderRadius: 8,
      overflow: 'hidden',
      border: `1px solid ${theme.border}`,
    }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          padding: '10px 14px 8px',
          borderBottom: `1px solid ${theme.border}`,
          background: theme.bgSecondary,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 400, color: theme.text }}>
            {collection.name}
          </span>
          <span style={{ fontSize: 10, color: theme.textMuted }}>
            {products.length} products
          </span>
        </div>
        <span style={typePill('collection', theme)}>coll</span>
      </div>

      {/* Bleed-edge product grid */}
      <div style={{ display: 'flex' }}>
        {products.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            cardConfig={collection.card_config}
            isLast={i === products.length - 1}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
}