import { useProductDataCtx } from '@/contextHooks/product/useProductDataCtx';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { Search, X, Link2, PackageSearch } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// ─── Types ────────────────────────────────────────────────────────────────────
type SearchProduct = {
  id: number;
  name: string;
  slug: string;
  thumbnail: { url: string } | null;
};

// ─── Selected Product Chip ────────────────────────────────────────────────────
function SelectedProduct({
  product,
  onRemove,
  currentTheme,
}: {
  product: SearchProduct;
  onRemove: (id: number) => void;
  currentTheme: any;
}) {
  return (
    <div
      className="flex items-center gap-3 px-3 py-2 rounded-lg group"
      style={{
        backgroundColor: currentTheme.bg,
        border: `1px solid ${currentTheme.border}`,
      }}
    >
      {/* Thumbnail */}
      {product.thumbnail?.url ? (
        <img
          src={product.thumbnail.url}
          alt={product.name}
          className="w-9 h-9 rounded-md object-cover flex-shrink-0"
        />
      ) : (
        <div
          className="w-9 h-9 rounded-md flex-shrink-0 flex items-center justify-center"
          style={{ backgroundColor: currentTheme.bgSecondary }}
        >
          <PackageSearch size={14} style={{ color: currentTheme.textMuted }} />
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium truncate leading-tight"
          style={{ color: currentTheme.text }}
        >
          {product.name}
        </p>
        <div className="flex items-center gap-1 mt-0.5">
          <Link2 size={10} style={{ color: currentTheme.textMuted }} />
          <p
            className="text-xs truncate"
            style={{ color: currentTheme.textMuted }}
          >
            {product.slug}
          </p>
        </div>
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={() => onRemove(product.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md flex-shrink-0"
        style={{ color: currentTheme.error }}
      >
        <X size={13} />
      </button>
    </div>
  );
}

// ─── Search Result Row ────────────────────────────────────────────────────────
function SearchResultRow({
  product,
  onSelect,
  isSelected,
  currentTheme,
}: {
  product: SearchProduct;
  onSelect: (product: SearchProduct) => void;
  isSelected: boolean;
  currentTheme: any;
}) {
  return (
    <button
      type="button"
      disabled={isSelected}
      onClick={() => onSelect(product)}
      className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-100"
      style={{
        backgroundColor: isSelected ? currentTheme.primary + '10' : 'transparent',
        opacity: isSelected ? 0.5 : 1,
        cursor: isSelected ? 'default' : 'pointer',
      }}
      onMouseEnter={(e) => {
        if (!isSelected)
          (e.currentTarget as HTMLElement).style.backgroundColor =
            currentTheme.bgSecondary;
      }}
      onMouseLeave={(e) => {
        if (!isSelected)
          (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
      }}
    >
      {/* Thumbnail */}
      {product.thumbnail?.url ? (
        <img
          src={product.thumbnail.url}
          alt={product.name}
          className="w-9 h-9 rounded-md object-cover flex-shrink-0"
        />
      ) : (
        <div
          className="w-9 h-9 rounded-md flex-shrink-0 flex items-center justify-center"
          style={{ backgroundColor: currentTheme.bgSecondary }}
        >
          <PackageSearch size={14} style={{ color: currentTheme.textMuted }} />
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium truncate leading-tight"
          style={{ color: currentTheme.text }}
        >
          {product.name}
        </p>
        <div className="flex items-center gap-1 mt-0.5">
          <Link2 size={10} style={{ color: currentTheme.textMuted }} />
          <p className="text-xs truncate" style={{ color: currentTheme.textMuted }}>
            {product.slug}
          </p>
        </div>
      </div>

      {isSelected && (
        <span
          className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
          style={{
            backgroundColor: currentTheme.primary + '18',
            color: currentTheme.primary,
          }}
        >
          Added
        </span>
      )}
    </button>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptySelected({ currentTheme }: { currentTheme: any }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-8 rounded-lg"
      style={{
        border: `2px dashed ${currentTheme.border}`,
        backgroundColor: currentTheme.bg,
      }}
    >
      <PackageSearch size={28} className="mb-2 opacity-25" style={{ color: currentTheme.textMuted }} />
      <p className="text-xs" style={{ color: currentTheme.textMuted }}>
        No related products selected
      </p>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function RelatedProductsSection() {
  const { basicInfoForm, setBasicInfoForm } = useProductDataCtx();
  const {
    state: { currentTheme },
  } = useStoreConfigCtx();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected: SearchProduct[] = basicInfoForm.related_products ?? [];
  const selectedIds = selected.map((p) => p.id);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await axios.get('/products/search', {
          params: { q: query, exclude: basicInfoForm.id },
        });
        setResults(res.data);
        setShowDropdown(true);
      } catch (e) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const addProduct = (product: SearchProduct) => {
    if (selectedIds.includes(product.id)) return;
    setBasicInfoForm({
      ...basicInfoForm,
      related_products: [...selected, product],
    });
    setQuery('');
    setShowDropdown(false);
  };

  const removeProduct = (id: number) => {
    setBasicInfoForm({
      ...basicInfoForm,
      related_products: selected.filter((p) => p.id !== id),
    });
  };

  return (
    <div className="p-5 space-y-4">
      {/* Search Input */}
      <div className="relative" ref={dropdownRef}>
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-lg"
          style={{
            backgroundColor: currentTheme.bg,
            border: `1px solid ${currentTheme.border}`,
          }}
        >
          <Search
            size={15}
            className={loading ? 'animate-pulse' : ''}
            style={{ color: currentTheme.textMuted }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setShowDropdown(true)}
            placeholder="Search products by name..."
            className="flex-1 text-sm bg-transparent outline-none"
            style={{ color: currentTheme.text }}
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setShowDropdown(false); }}
            >
              <X size={13} style={{ color: currentTheme.textMuted }} />
            </button>
          )}
        </div>

        {/* Dropdown */}
        {showDropdown && results.length > 0 && (
          <div
            className="absolute top-full left-0 right-0 mt-1 rounded-lg overflow-hidden z-50"
            style={{
              backgroundColor: currentTheme.card,
              border: `1px solid ${currentTheme.border}`,
              boxShadow: currentTheme.shadowMd,
            }}
          >
            <div className="max-h-56 overflow-y-auto">
              {results.map((product) => (
                <SearchResultRow
                  key={product.id}
                  product={product}
                  onSelect={addProduct}
                  isSelected={selectedIds.includes(product.id)}
                  currentTheme={currentTheme}
                />
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {showDropdown && !loading && results.length === 0 && query.length >= 2 && (
          <div
            className="absolute top-full left-0 right-0 mt-1 rounded-lg px-4 py-3 z-50"
            style={{
              backgroundColor: currentTheme.card,
              border: `1px solid ${currentTheme.border}`,
            }}
          >
            <p className="text-sm" style={{ color: currentTheme.textMuted }}>
              No products found for "{query}"
            </p>
          </div>
        )}
      </div>

      {/* Selected count */}
      {selected.length > 0 && (
        <p className="text-xs" style={{ color: currentTheme.textMuted }}>
          {selected.length} product{selected.length !== 1 ? 's' : ''} selected
        </p>
      )}

      {/* Selected list */}
      {selected.length === 0 ? (
        <EmptySelected currentTheme={currentTheme} />
      ) : (
        <div className="space-y-2">
          {selected.map((product) => (
            <SelectedProduct
              key={product.id}
              product={product}
              onRemove={removeProduct}
              currentTheme={currentTheme}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default RelatedProductsSection;