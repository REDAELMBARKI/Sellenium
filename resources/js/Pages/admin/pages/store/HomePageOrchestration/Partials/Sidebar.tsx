import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Section } from '@/types/homeEditorType';
import { SidebarRow } from './SidebarRow';
import { ThemePalette } from '@/types/ThemeTypes';

type Action = 'move_to_start' | 'move_up' | 'move_down' | 'move_to_end';

type SidebarProps = {
  sections: Section[];
  theme: ThemePalette;
  isOpen: boolean;
  openMenuId: number | null;
  draggedIndex: number | null;
  dropIndicator: { index: number; position: 'top' | 'bottom' } | null;
  menuRef: React.RefObject<HTMLDivElement>;
  onToggleMenu: (id: number | null) => void;
  onMove: (id: number, action: Action) => void;
  onNavigate: (section: Section) => void;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (index: number) => void;
  onDragEnd: () => void;
};

export function Sidebar({
  sections,
  theme,
  isOpen,
  openMenuId,
  draggedIndex,
  dropIndicator,
  menuRef,
  onToggleMenu,
  onMove,
  onNavigate,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: SidebarProps) {
  return (
    <div
      style={{
        width: isOpen ? 268 : 0,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        background: theme.sidebarBg,
        borderRight: `1px solid ${theme.sidebarBorder}`,
        overflow: 'hidden',
        transition: 'width 0.18s ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          height: 53,
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px 0 20px',
          borderBottom: `1px solid ${theme.sidebarBorder}`,
          flexShrink: 0,
        }}
      >
        {isOpen && (
          <span style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: theme.sidebarMuted,
            whiteSpace: 'nowrap',
            flex: 1,
          }}>
            Layout
          </span>
        )}
        
      </div>

      {/* Section list */}
      {isOpen && (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {sections.map((section, index) => (
            <SidebarRow
              key={section.id}
              section={section}
              index={index}
              total={sections.length}
              theme={theme}
              isMenuOpen={openMenuId === section.id}
              isDragging={draggedIndex === index}
              showTopIndicator={dropIndicator?.index === index && dropIndicator.position === 'top'}
              showBottomIndicator={dropIndicator?.index === index && dropIndicator.position === 'bottom'}
              menuRef={menuRef}
              onToggleMenu={onToggleMenu}
              onMove={onMove}
              onNavigate={onNavigate}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onDragEnd={onDragEnd}
            />
          ))}
        </div>
      )}
    </div>
  );
}