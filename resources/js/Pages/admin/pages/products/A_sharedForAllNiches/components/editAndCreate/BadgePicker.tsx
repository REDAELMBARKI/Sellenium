import { Button } from "@/components/ui/button";
import { useProductDataCtx } from "@/contextHooks/product/useProductDataCtx";
import { Flame, Sparkles, Tag, Zap, Rocket, Ban } from 'lucide-react';

const BADGE_OPTIONS_STATIC = [
  { name: 'None',     color: 'transparent', icon: Ban      },
  { name: 'New',      color: '#22c55e',     icon: Sparkles },
  { name: 'Hot',      color: '#f97316',     icon: Flame    },
  { name: 'Sale',     color: '#ef4444',     icon: Tag      },
  { name: 'Limited',  color: '#a855f7',     icon: Zap      },
  { name: 'Featured', color: '#3b82f6',     icon: Rocket   },
];

const ICON_MAP: Record<string, React.ElementType> = {
  Ban, Sparkles, Flame, Tag, Zap, Rocket
};

export default function BadgePicker({ currentTheme}: { currentTheme: any }) {
  const { watch, setValue , badges = []} = useProductDataCtx();
  const value: string | null = watch('badge_text') ?? null;
  const BADGE_OPTIONS = badges.map(b => {
        return {
                ...b ,
                icon : ICON_MAP[b.icon] ?? Ban

        }
  }) ?? BADGE_OPTIONS_STATIC
  const selected = BADGE_OPTIONS.find((b) =>
    b.name === 'None' ? !value : b.name === value
  ) ?? BADGE_OPTIONS[0];
  console.log(BADGE_OPTIONS)
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
              backgroundColor: selected?.color + '22',
              color: selected?.color,
            }}
          > 
             {
              selected ?
              <selected.icon size={11} />
              :
              null
             }
            {value}
          </span>
        )}
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-2 mt-1">
        {BADGE_OPTIONS.map((badge) => {
          const isNone = badge.name === 'None';
          const isSelected = isNone ? !value : value === badge.name;

          return (
            <Button
              key={badge.name}
              type="button"
              onClick={() =>
                setValue('badge_text', isNone ? null : badge.name, { shouldValidate: true })
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
              {badge.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}