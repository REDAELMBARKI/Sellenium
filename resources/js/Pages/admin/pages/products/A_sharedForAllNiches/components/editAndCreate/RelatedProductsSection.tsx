import { useProductDataCtx } from '@/contextHooks/product/useProductDataCtx';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { Search, X, Link2, PackageSearch } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import EmptyListSection from '@/admin/components/partials/EmptyListSection';

type SearchProduct = {
  id: number;
  name: string;
  slug: string;
  thumbnail: { url: string } | null;
};

// ─── Selected Product Chip ────────────────────────────────────────────────────
function SelectedProduct({ product, onRemove, currentTheme }: {
  product: SearchProduct;
  onRemove: (id: number) => void;
  currentTheme: any;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg group"
      style={{ backgroundColor: currentTheme.bg, border: `1px solid ${currentTheme.border}` }}>
      {product.thumbnail?.url ? (
        <img src={product.thumbnail.url} alt={product.name} className="w-9 h-9 rounded-md object-cover flex-shrink-0" />
      ) : (
        <div className="w-9 h-9 rounded-md flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: currentTheme.bgSecondary }}>
          <PackageSearch size={14} style={{ color: currentTheme.textMuted }} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate leading-tight" style={{ color: currentTheme.text }}>{product.name}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <Link2 size={10} style={{ color: currentTheme.textMuted }} />
          <p className="text-xs truncate" style={{ color: currentTheme.textMuted }}>{product.slug}</p>
        </div>
      </div>
      <button type="button" onClick={() => onRemove(product.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md flex-shrink-0"
        style={{ color: currentTheme.error }}>
        <X size={13} />
      </button>
    </div>
  );
}

// ─── Search Result Row ────────────────────────────────────────────────────────
function SearchResultRow({ product, onSelect, isSelected, currentTheme }: {
  product: SearchProduct;
  onSelect: (product: SearchProduct) => void;
  isSelected: boolean;
  currentTheme: any;
}) {
  return (
    <button type="button" disabled={isSelected} onClick={() => onSelect(product)}
      className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-100"
      style={{ backgroundColor: isSelected ? currentTheme.primary + '10' : 'transparent', opacity: isSelected ? 0.5 : 1, cursor: isSelected ? 'default' : 'pointer' }}
      onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = currentTheme.bgSecondary; }}
      onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
    >
      {product.thumbnail?.url ? (
        <img src={product.thumbnail.url} alt={product.name} className="w-9 h-9 rounded-md object-cover flex-shrink-0" />
      ) : (
        <div className="w-9 h-9 rounded-md flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: currentTheme.bgSecondary }}>
          <PackageSearch size={14} style={{ color: currentTheme.textMuted }} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate leading-tight" style={{ color: currentTheme.text }}>{product.name}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <Link2 size={10} style={{ color: currentTheme.textMuted }} />
          <p className="text-xs truncate" style={{ color: currentTheme.textMuted }}>{product.slug}</p>
        </div>
      </div>
      {isSelected && (
        <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: currentTheme.primary + '18', color: currentTheme.primary }}>
          Added
        </span>
      )}
    </button>
  );
}


// ─── Main ─────────────────────────────────────────────────────────────────────
function RelatedProductsSection() {
  const { watch, setValue } = useProductDataCtx();
  const { state: { currentTheme } } = useStoreConfigCtx();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ← useForm only stores ids
  const relatedIds: number[] = watch('related_products') ?? [];
  const productId = watch('id');

  // ← local state for display
  const [selectedProducts, setSelectedProducts] = useState<SearchProduct[]>([]);

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
          params: { q: query, exclude: productId },
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
    if (relatedIds.includes(product.id)) return;

    // ✅ push only id to useForm
    setValue('related_products', [...relatedIds, product.id], { shouldValidate: true });

    // ✅ push full object to local state for display
    setSelectedProducts(prev => [...prev, product]);

    setQuery('');
    setShowDropdown(false);
  };

  const removeProduct = (id: number) => {
    // ✅ remove id from useForm
    setValue('related_products', relatedIds.filter((relatedId) => relatedId !== id), { shouldValidate: true });

    // ✅ remove from display state
    setSelectedProducts(prev => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="p-5 space-y-4">
      {/* Search Input */}
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center gap-2 px-4 py-3"
          style={{ backgroundColor: currentTheme.bg, border: `1px solid ${currentTheme.border}` }}>
          <Search size={15} className={loading ? 'animate-pulse' : ''} style={{ color: currentTheme.textMuted }} />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setShowDropdown(true)}
            placeholder="Search products by name..."
            style={{ color: currentTheme.text }}
          />
          {query && (
            <button type="button" onClick={() => { setQuery(''); setShowDropdown(false); }}>
              <X size={13} style={{ color: currentTheme.textMuted }} />
            </button>
          )}
        </div>

        {/* Dropdown */}
        {showDropdown && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 rounded-lg overflow-hidden z-50"
            style={{ backgroundColor: currentTheme.card, border: `1px solid ${currentTheme.border}`, boxShadow: currentTheme.shadowMd }}>
            <div className="max-h-56 overflow-y-auto">
              {results.map((product) => (
                <SearchResultRow
                  key={product.id}
                  product={product}
                  onSelect={addProduct}
                  isSelected={relatedIds.includes(product.id)}
                  currentTheme={currentTheme}
                />
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {showDropdown && !loading && results.length === 0 && query.length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-1 rounded-lg px-4 py-3 z-50"
            style={{ backgroundColor: currentTheme.card, border: `1px solid ${currentTheme.border}` }}>
            <p className="text-sm" style={{ color: currentTheme.textMuted }}>No products found for "{query}"</p>
          </div>
        )}
      </div>

      {/* Selected count */}
      {selectedProducts.length > 0 && (
        <p className="text-xs" style={{ color: currentTheme.textMuted }}>
          {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
        </p>
      )}

      {/* Selected list */}
      {selectedProducts.length === 0 ? (
        <EmptyListSection
          Icon={PackageSearch}
          description='No related products selected'
        />
      ) : (
        <div className="space-y-2">
          {selectedProducts.map((product) => (
            <SelectedProduct key={product.id} product={product} onRemove={removeProduct} currentTheme={currentTheme} />
          ))}
        </div>
      )}
    </div>
  );
}

export default RelatedProductsSection;