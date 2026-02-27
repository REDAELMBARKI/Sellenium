import { useProductDataCtx } from "@/contextHooks/product/useProductDataCtx";
import { Flame, Sparkles, Tag, Zap, Rocket, Ban } from 'lucide-react';

const BADGE_OPTIONS = [
  { label: 'None',     color: 'transparent', icon: Ban      },
  { label: 'New',      color: '#22c55e',     icon: Sparkles },
  { label: 'Hot',      color: '#f97316',     icon: Flame    },
  { label: 'Sale',     color: '#ef4444',     icon: Tag      },
  { label: 'Limited',  color: '#a855f7',     icon: Zap      },
  { label: 'Featured', color: '#3b82f6',     icon: Rocket   },
];

export default function BadgePicker({ currentTheme }: { currentTheme: any }) {
  const { watch, setValue } = useProductDataCtx();
  
  const value: string | null = watch('badge_text') ?? null;

  const selected = BADGE_OPTIONS.find((b) =>
    b.label === 'None' ? !value : b.label === value
  ) ?? BADGE_OPTIONS[0];

  return (
    <div
      className="rounded-lg p-4"
      style={{
        backgroundColor: currentTheme.bg,
        border: `1px solid ${currentTheme.border}`,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-medium" style={{ color: currentTheme.text }}>
            Product Badge
          </p>
          <p className="text-xs mt-0.5" style={{ color: currentTheme.textMuted }}>
            Label shown on the product card image
          </p>
        </div>

        {/* Live preview */}
        {value && (
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
            style={{
              backgroundColor: selected.color + '22',
              color: selected.color,
            }}
          >
            <selected.icon size={11} />
            {value}
          </span>
        )}
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-2 mt-1">
        {BADGE_OPTIONS.map((badge) => {
          const isNone = badge.label === 'None';
          const isSelected = isNone ? !value : value === badge.label;

          return (
            <button
              key={badge.label}
              type="button"
              onClick={() =>
                setValue('badge_text', isNone ? null : badge.label, { shouldValidate: true })
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-100"
              style={{
                backgroundColor: isSelected
                  ? isNone ? currentTheme.bgSecondary : badge.color + '18'
                  : 'transparent',
                color: isSelected
                  ? isNone ? currentTheme.text : badge.color
                  : currentTheme.textMuted,
                border: `1px solid ${
                  isSelected
                    ? isNone ? currentTheme.border : badge.color
                    : currentTheme.border
                }`,
              }}
            >
              <badge.icon size={12} />
              {badge.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}