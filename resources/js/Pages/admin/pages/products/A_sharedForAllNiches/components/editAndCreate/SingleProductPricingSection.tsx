import { useProductDataCtx } from '@/contextHooks/product/useProductDataCtx';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { Wand2 } from 'lucide-react';
import React from 'react';
import PricePreview from './PricePreview';
import { Input } from '@/components/ui/input';



// ─── Main ─────────────────────────────────────────────────────────────────────
function SingleProductPricingSection({
  frontEndErrors,
}: {
  frontEndErrors: Record<string, string>;
}) {
  const { basicInfoForm, setBasicInfoForm } = useProductDataCtx();
  const {
    state: { currentTheme },
  } = useStoreConfigCtx();

  const inputStyle = (errorKey?: string) => ({
    backgroundColor: currentTheme.bg,
    color: currentTheme.text,
    borderWidth: '2px',
    borderColor:
      errorKey && frontEndErrors[errorKey] ? '#ef4444' : currentTheme.border,
  });

  return (
    <div className="flex flex-col gap-6 p-3">

      {/* ── Row 1: Price | Compare Price | Preview ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Price */}
        <div>
          <label
            className="block text-sm font-bold mb-4 uppercase tracking-wide"
            style={{ color: currentTheme.text }}
          >
            Price <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            step="0.01"
            placeholder='Price'

            value={basicInfoForm.price ?? ''}
            onChange={(e) =>
              setBasicInfoForm({
                ...basicInfoForm,
                price: e.target.value === '' ? null : Number(e.target.value),
              })
            }
            className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"
            style={inputStyle('price')}
          />
          {frontEndErrors.price && (
            <p className="text-red-500 text-sm mt-2">{frontEndErrors.price}</p>
          )}
        </div>

        {/* Compare Price */}
        <div>
          <label
            className="block text-sm font-bold mb-4 uppercase tracking-wide"
            style={{ color: currentTheme.text }}
          >
            Compare at Price{' '}
            <span className="text-xs font-normal opacity-60">(optional)</span>
          </label>
          <Input
            type="number"
            step="0.01"
            placeholder='Compare price'
            value={basicInfoForm.compare_price ?? ''}
            onChange={(e) =>
              setBasicInfoForm({
                ...basicInfoForm,
                compare_price: e.target.value === '' ? null : Number(e.target.value),
              })
            }
            className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"
            style={inputStyle()}
          />
        </div>

        {/* Price Preview */}
        <PricePreview
          price={basicInfoForm.price}
          comparePrice={basicInfoForm.compare_price ?? null}
          currentTheme={currentTheme}
        />
      </div>

      {/* ── Divider ── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ backgroundColor: currentTheme.border }} />
        <span
          className="text-xs uppercase tracking-widest"
          style={{ color: currentTheme.textMuted }}
        >
          Inventory
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: currentTheme.border }} />
      </div>

      {/* ── Row 2: Stock | SKU ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Stock */}
        <div>
          <label
            className="block text-sm font-bold mb-4 uppercase tracking-wide"
            style={{ color: currentTheme.text }}
          >
            Stock <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            placeholder='Stock'
            value={basicInfoForm.stock ?? ''}
            onChange={(e) =>
              setBasicInfoForm({
                ...basicInfoForm,
                stock: e.target.value === '' ? null : Number(e.target.value),
              })
            }
            className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"
            style={inputStyle('stock')}
          />
          {frontEndErrors.stock && (
            <p className="text-red-500 text-sm mt-2">{frontEndErrors.stock}</p>
          )}
        </div>

        {/* SKU */}
        <div>
          <label
            className="block text-sm font-bold mb-4 uppercase tracking-wide flex items-center gap-2"
            style={{ color: currentTheme.text }}
          >
            SKU
            {!basicInfoForm.sku && (
              <span
                className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full normal-case tracking-normal"
                style={{
                  backgroundColor: currentTheme.primary + '18',
                  color: currentTheme.primary,
                  border: `1px solid ${currentTheme.primary}40`,
                }}
              >
                <Wand2 size={10} />
                Auto
              </span>
            )}
          </label>
          <Input
            type="text"
            value={basicInfoForm.sku ?? ''}
            onChange={(e) =>
              setBasicInfoForm({ ...basicInfoForm, sku: e.target.value })
            }
            placeholder="Leave empty to auto-generate"
            className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"
            style={inputStyle('sku')}
          />
          {frontEndErrors.sku && (
            <p className="text-red-500 text-sm mt-2">{frontEndErrors.sku}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SingleProductPricingSection;