import React from 'react';
import SwitchToggler from './ui/SwitchToggler';
import { useColorsCtx } from '@/contextHooks/useColorsCtx';


const CollapsibleSection = ({
  title,
  icon: Icon,
  isOpen,
  onToggle,
  children,
  ref
}: {
  title: string;
  icon: any;
  isOpen: boolean;
  onToggle: (newState: boolean) => void;
  children: React.ReactNode;
  ref?: React.RefObject<HTMLDivElement | null>;
}) => {
        const { currentTheme } = useColorsCtx();
    
  return(
  <div className="space-y-4" ref={ref}>
    <div
      className="w-full flex items-center justify-between px-6 py-4 rounded-xl font-bold uppercase tracking-wide transition-all duration-200"
      style={{
        backgroundColor: isOpen ? currentTheme.buttonSecondary : currentTheme.bg,
        borderWidth: '2px',
        borderColor: currentTheme.border
      }}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-6 h-6 transition-transform" style={{ color: currentTheme.text }} />
        <span style={{ color: currentTheme.text }}>{title}</span>
      </div>
      <SwitchToggler
        checked={isOpen} 
        onChange={onToggle}
        id={`switch-${title.toLowerCase().replace(/\s+/g, '-')}`}
      />
    </div>
    {isOpen && (
      <div className="space-y-6 p-6 rounded-xl border-2 animate-slideDown" style={{ borderColor: currentTheme.border, backgroundColor: currentTheme.bg + '20' }}>
        {children}
      </div>
    )}
  </div>)
}

export default CollapsibleSection;