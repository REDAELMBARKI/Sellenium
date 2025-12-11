
import { useColorsCtx } from '@/contextHooks/useColorsCtx';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface CustomSelectProps {
  value: string | number;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options, placeholder = 'Select...' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
    const { currentTheme } = useColorsCtx();
  
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative"  ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 rounded-xl font-medium shadow-sm flex items-center justify-between transition-all"
        style={{
          backgroundColor: currentTheme.bg,
          color: value ? currentTheme.text : '#94a3b8',
          borderWidth: '2px',
          borderColor: currentTheme.border,
        }}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute z-[99999] w-full mt-2 rounded-xl shadow-lg overflow-hidden"
          style={{
            backgroundColor: currentTheme.bg,
            borderWidth: '2px',
            borderColor: currentTheme.border,
          }}
        >
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="w-full px-5 py-3 text-left hover:bg-gray-100 transition-colors font-medium"
                style={{
                  color: currentTheme.text,
                  backgroundColor: value === option.value ? currentTheme.buttonSecondary : 'transparent',
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
