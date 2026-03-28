import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import { ChevronRight, GripVertical, PanelLeft } from "lucide-react";

interface CollectionEditorNavProps {
  open: boolean;
  onToggle: () => void;
  sections: CollectionPayload[];
  activeId: number;
  onSelect: (id: number) => void;
  dirtyId: number | null;
}

export default  function CollectionEditorNav({ open, onToggle, sections, activeId, onSelect, dirtyId }: CollectionEditorNavProps) {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();

  return (
    <aside
      className="border-r flex-shrink-0 overflow-y-auto scrollbar-hide transition-all duration-300"
      style={{
        width: open ? '260px' : '40px',
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
          className={`p-1 hover:bg-black/10 rounded transition-all ${!open ? 'mx-auto' : ''}`}
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
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-xs font-bold transition-colors"
              style={{
                backgroundColor: activeId === s.id ? theme.sidebarActive : 'transparent',
                color: activeId === s.id ? theme.sidebarActiveFg : theme.sidebarFg,
              }}
            >
              <GripVertical size={14} className="opacity-30 flex-shrink-0" />
              <span className="truncate flex-1">{s.name}</span>
              {dirtyId === s.id && (
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: theme.primary }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
