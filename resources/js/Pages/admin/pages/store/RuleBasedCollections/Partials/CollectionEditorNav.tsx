import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import { 
  ChevronRight, 
  PanelLeft, 
  MoreVertical, 
  ArrowUp, 
  ArrowDown, 
  ArrowUpToLine, 
  ArrowDownToLine 
} from "lucide-react";
import React, { useState } from "react";

interface CollectionEditorNavProps {
  open: boolean;
  onToggle: () => void;
  sections: CollectionPayload[];
  activeId: number;
  onSelect: (id: number) => void;
  dirtyId: number | null;
  onReorder: (slug: string, action: 'increment' | 'decrement' | 'start' | 'end') => void;
}

export default function CollectionEditorNav({
  open,
  onToggle,
  sections,
  activeId,
  onSelect,
  dirtyId,
  onReorder,
}: CollectionEditorNavProps) {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  const reorderActions = [
    { label: "Move Top", action: "start", icon: ArrowUpToLine },
    { label: "Move Up", action: "decrement", icon: ArrowUp },
    { label: "Move Down", action: "increment", icon: ArrowDown },
    { label: "Move Bottom", action: "end", icon: ArrowDownToLine },
  ] as const;

  return (
    <aside
      className="border-r flex-shrink-0 overflow-y-auto scrollbar-hide transition-all duration-300"
      style={{
        width: open ? "260px" : "40px",
        backgroundColor: theme.sidebarBg,
        borderColor: theme.sidebarBorder,
      }}
    >
      {/* Toggle row */}
      <div
        className="sticky top-0 z-10 p-3 border-b flex justify-between items-center whitespace-nowrap"
        style={{ backgroundColor: theme.sidebarBg, borderColor: theme.sidebarBorder }}
      >
        {open && (
          <span className="text-[10px] font-black uppercase opacity-50">Site Structure</span>
        )}
        <button
          onClick={onToggle}
          className={`p-1 hover:bg-black/10 rounded transition-all ${!open ? "mx-auto" : ""}`}
        >
          {open ? <PanelLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Section list */}
      {open && (
        <div className="p-2 space-y-1">
          {sections.map((s) => (
            <div
              key={s.id}
              onClick={() => onSelect(s.id)}
              className="group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer text-xs font-bold transition-all"
              style={{
                backgroundColor: activeId === s.id ? theme.sidebarActive : "transparent",
                color: activeId === s.id ? theme.sidebarActiveFg : theme.sidebarFg,
              }}
            >
              <span className="truncate flex-1">{s.name}</span>

              <div className="flex items-center gap-2">
                {dirtyId === s.id && (
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: theme.primary }}
                  />
                )}

                {/* Menu Trigger */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenId(menuOpenId === s.id ? null : s.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-black/10 rounded transition-opacity"
                >
                  <MoreVertical size={14} />
                </button>
              </div>

              {/* Action Popover */}
              {menuOpenId === s.id && (
                <>
                  {/* Backdrop to close menu */}
                  <div 
                    className="fixed inset-0 z-20" 
                    onClick={(e) => { e.stopPropagation(); setMenuOpenId(null); }} 
                  />
                  <div
                    className="absolute right-2 top-10 z-30 w-36 rounded-xl border p-1 shadow-2xl animate-in fade-in zoom-in duration-150"
                    style={{ backgroundColor: theme.bgSecondary, borderColor: theme.border }}
                  >
                    {reorderActions.map((item) => (
                      <button
                        key={item.action}
                        onClick={(e) => {
                          e.stopPropagation();
                          onReorder(s.slug, item.action);
                          setMenuOpenId(null);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-black/5 rounded-lg text-[10px] uppercase font-black transition-colors"
                        style={{ color: theme.text }}
                      >
                        <item.icon size={12} style={{ color: theme.primary }} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}