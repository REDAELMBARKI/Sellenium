import { useProductDataCtx } from '@/contextHooks/product/useProductDataCtx';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import React, { useState } from 'react';
import SwitchToggler from '@/components/ui/SwitchToggler';
import SingleProductPricingSection from './SingleProductPricingSection';
import VariantBuilder from '../../variantBuilder/VariantBuilder';

function PricingOrVariants({
  frontEndErrors,
}: {
  frontEndErrors: Record<string, string>;
}) {
  const { basicInfoForm, setBasicInfoForm } = useProductDataCtx();
  const {
    state: { currentTheme },
  } = useStoreConfigCtx();

  const [variantsEnabled, setVariantsEnabled] = useState(
    () => basicInfoForm.variants.length > 0
  );

    const toggle = (val: boolean) => {
      if (!val && basicInfoForm.variants.length > 0) {
          // turning OFF with existing variants → confirm first
          const confirmed = window.confirm(
              `You have ${basicInfoForm.variants.length} variant${basicInfoForm.variants.length !== 1 ? 's' : ''} that will be permanently deleted. Are you sure?`
          );
          if (!confirmed) return; // user cancelled → do nothing
      }

      setVariantsEnabled(val);
      if (!val) {
          setBasicInfoForm({ ...basicInfoForm, variants: [] });
      }
      // turning ON → VariantBuilder handles creation
  };

  return (
    <div className="p-0">

      {/* ── Toggle row ── */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          backgroundColor: currentTheme.bg,
          border: `1px solid ${currentTheme.border}`,
        }}
      >
        <div>
          <p className="text-sm font-medium" style={{ color: currentTheme.text }}>
            This product has variants
          </p>
          <p className="text-xs mt-0.5" style={{ color: currentTheme.textMuted }}>
            {variantsEnabled
              ? 'Price & stock managed per variant'
              : 'Single price, stock and SKU'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full border"
            style={{
              backgroundColor: variantsEnabled ? currentTheme.primary + '12' : currentTheme.bgSecondary,
              color: variantsEnabled ? currentTheme.primary : currentTheme.textMuted,
              borderColor: variantsEnabled ? currentTheme.primary : currentTheme.border,
            }}
          >
            {variantsEnabled ? '✦ Has Variants' : 'Single Product'}
          </span>

          <SwitchToggler
            checked={variantsEnabled}
            onChange={toggle}
            id="switch-has-variants"
          />
        </div>
      </div>

      {/* ── Content swap ── */}
      {!variantsEnabled
        ? <SingleProductPricingSection frontEndErrors={frontEndErrors} />
        : <VariantBuilder />
      }

    </div>
  );
}

export default PricingOrVariants;