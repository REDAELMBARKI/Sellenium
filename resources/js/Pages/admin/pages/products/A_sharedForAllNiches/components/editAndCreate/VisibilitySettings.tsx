import { useProductDataCtx } from '@/contextHooks/product/useProductDataCtx';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import {
  PackageX,
  Timer,
  Star,
  Layers,
  Share2,

} from 'lucide-react';
import React from 'react';
import SwitchToggler from '@/components/ui/SwitchToggler'; // adjust path to yours
import { ProductBase } from '@/types/products/baseProductTypes';



// ─── Toggle Row ───────────────────────────────────────────────────────────────
function ToggleSetting({
  label,
  description,
  icon: Icon,
  settingKey,
  currentTheme,
}: {
  label: string;
  description: string;
  icon: React.ElementType;
  settingKey: keyof ProductBase;
  currentTheme: any;
}) {
  const { basicInfoForm, setBasicInfoForm } = useProductDataCtx();
  const value: boolean = basicInfoForm[settingKey] ;

  return (
    <div
      className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg"
      style={{
        backgroundColor: currentTheme.bg,
        border: `1px solid ${currentTheme.border}`,
      }}
    >
      <div className="flex items-center gap-3">
        <Icon size={15} style={{ color: value ? currentTheme.primary : currentTheme.textMuted }} />
        <div>
          <p className="text-sm font-medium leading-tight" style={{ color: currentTheme.text }}>
            {label}
          </p>
          <p className="text-xs mt-0.5" style={{ color: currentTheme.textMuted }}>
            {description}
          </p>
        </div>
      </div>

      <SwitchToggler
        checked={value}
        onChange={(val: boolean) =>
          setBasicInfoForm({ ...basicInfoForm, [settingKey]: val })
        }
        id={`switch-${settingKey}`}
      />
    </div>
  );
}


// ─── Settings config ──────────────────────────────────────────────────────────
const TOGGLE_SETTINGS = [
  {
    key: 'allow_backorder',
    label: 'Allow Backorder',
    description: 'Sell even when out of stock',
    icon: PackageX,
  },
  {
    key: 'show_countdown',
    label: 'Countdown Timer',
    description: 'Show promotion timer on product page',
    icon: Timer,
  },
  {
    key: 'show_reviews',
    label: 'Customer Reviews',
    description: 'Display reviews section below product',
    icon: Star,
  },
  {
    key: 'show_related_products',
    label: 'Related Products',
    description: 'Suggest similar products at the bottom',
    icon: Layers,
  },
  {
    key: 'show_social_share',
    label: 'Social Share Buttons',
    description: 'Let customers share on Facebook, X, WhatsApp',
    icon: Share2,
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
function VisibilitySettings() {
  const {
    state: { currentTheme },
  } = useStoreConfigCtx();

  return (
    <div className="p-5 space-y-3">
      
      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px" style={{ backgroundColor: currentTheme.border }} />
        <span className="text-xs uppercase tracking-widest" style={{ color: currentTheme.textMuted }}>
          Visibility
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: currentTheme.border }} />
      </div>

      {TOGGLE_SETTINGS.map((s) => (
        <ToggleSetting
          key={s.key}
          settingKey={s.key as keyof ProductBase}
          label={s.label}
          description={s.description}
          icon={s.icon}
          currentTheme={currentTheme}
        />
      ))}
    </div>
  );
}

export default VisibilitySettings;