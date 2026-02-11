import { useProductDataCtx } from '@/contextHooks/product/useProductDataCtx';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import React from 'react';

function PricingSection({
  validateField,
  frontEndErrors,
}: {
  validateField: (field: string, value: any) => void;
  frontEndErrors: Record<string, string>;
}) {
  const { basicInfoForm, setBasicInfoForm } = useProductDataCtx();
  const {
    state: { currentTheme },
  } = useStoreConfigCtx();

  const hasPrice = basicInfoForm.price > 0;
  const hasOldPrice =
    basicInfoForm.oldPrice &&
    basicInfoForm.oldPrice > basicInfoForm.price;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Price */}
      <div>
        <label
          className="block text-sm font-bold mb-4 uppercase tracking-wide"
          style={{ color: currentTheme.text }}
        >
          Price <span className="text-red-500">*</span>
        </label>

        <input
          type="number"
          step="0.01"
          value={basicInfoForm.price}
          onChange={(e) => {
            setBasicInfoForm({
              ...basicInfoForm,
              price: Number(e.target.value),
            });
            validateField('price', e.target.value);
          }}
          onBlur={(e) => validateField('price', e.target.value)}
          className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"
          style={{
            backgroundColor: currentTheme.bg,
            color: currentTheme.text,
            borderWidth: '2px',
            borderColor: frontEndErrors.price
              ? '#ef4444'
              : currentTheme.border,
          }}
        />

        {frontEndErrors.price && (
          <p className="text-red-500 text-sm mt-2">
            {frontEndErrors.price}
          </p>
        )}
      </div>

      {/* Old price */}
      <div>
        <label
          className="block text-sm font-bold mb-4 uppercase tracking-wide"
          style={{ color: currentTheme.text }}
        >
          Compare at Price{' '}
          <span className="text-xs font-normal">(optional)</span>
        </label>

        <input
          type="number"
          step="0.01"
          value={basicInfoForm.oldPrice || ''}
          onChange={(e) =>
            setBasicInfoForm({
              ...basicInfoForm,
              oldPrice: Number(e.target.value),
            })
          }
          className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"
          style={{
            backgroundColor: currentTheme.bg,
            color: currentTheme.text,
            borderWidth: '2px',
            borderColor: currentTheme.border,
          }}
        />
      </div>

      {/* Price Preview */}
      <div
        className="rounded-xl p-5 flex flex-col justify-center shadow-sm"
        style={{
          backgroundColor: currentTheme.bg,
          border: `2px dashed ${currentTheme.border}`,
          color: currentTheme.text,
        }}
      >
        <p className="text-xs uppercase tracking-wide opacity-70 mb-2">
          Price preview
        </p>

        {hasOldPrice && (
          <p className="text-sm line-through opacity-60">
            ${basicInfoForm.oldPrice?.toFixed(2)}
          </p>
        )}

        <p className="text-2xl font-bold">
          {hasPrice ? `$${basicInfoForm.price.toFixed(2)}` : '--'}
        </p>

        {!hasPrice && (
          <p className="text-xs opacity-50 mt-1">
            Enter a price to preview
          </p>
        )}
      </div>
    </div>
  );
}

export default PricingSection;
