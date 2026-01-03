

import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Input } from './input';
import { Button } from './button';
import { useCloseDropDownOnScroll } from '@/hooks/createProductHooks/useScrollActions';
import { input } from 'framer-motion/client';

interface CustomSelectProps {
  value: string | number;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  isSearchable : boolean
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options, placeholder = 'Select...' , isSearchable = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');

  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const dropdownRef = useRef<HTMLDivElement>(null);
     const {state :{currentTheme}} = useStoreConfigCtx()
  

   // drop down positioning mesure 
  useEffect(() => {
  if (isOpen && triggerRef.current) {
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: 'fixed',
      top: rect.bottom ,
      left: rect.left,
      width: rect.width,
      zIndex: 99999,
    });
  }
}, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

   useCloseDropDownOnScroll(isOpen , (bool) => setIsOpen(bool) , inputRef , dropdownRef)
 
  return (
    <div className="relative"  ref={dropdownRef}>
          <div 
       ref={triggerRef} >
      {isSearchable ? (
      <div className="relative w-full "  >
        <Input
          ref={inputRef}
          value={search}
          placeholder={placeholder}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          className="w-full h-[56px]  rounded-xl font-medium shadow-sm"
          style={{
            backgroundColor: currentTheme.bg,
            color: currentTheme.text,
            borderWidth: '2px',
            borderColor: currentTheme.border,
          }}
        />

        <ChevronDown
          className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          style={{ color: currentTheme.text }}
        />
      </div>

    ) : (
      <Button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 rounded-xl font-medium transition-all duration-200 focus:outline-none shadow-sm flex items-center justify-between"
        style={{ 
          backgroundColor: currentTheme.bg,
          color: currentTheme.text,
          borderWidth: '2px',
          borderColor: isOpen ? currentTheme.accent : currentTheme.border
        }}
      >
        <span>{value ?? placeholder}</span>
        <ChevronDown className={`w-5 h-5 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>
    )}
    </div>

      {isOpen && (
        
        <div
          className="w-full mt-2 rounded-xl shadow-lg overflow-hidden"
          style={{
            backgroundColor: currentTheme.bg,
            borderWidth: '2px',
            borderColor: currentTheme.border,
            ...dropdownStyle ,
          }}
        >
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setSearch(option.label)
                  setIsOpen(false);
                }}
                className="w-full px-5 py-3 text-left hover:bg-gray-100 transition-colors font-medium"
                style={{
                  color: currentTheme.text,
                  backgroundColor: value === option.value ? currentTheme.secondary : 'transparent',
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
      )}
    </div>
  );
};

export default CustomSelect;
