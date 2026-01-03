
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Input } from './input';
import { useCloseDropDownOnScroll } from '@/hooks/createProductHooks/useScrollActions';
import { Button } from './button';

interface OptionObject {
  label: string;
  value: string;
}

interface CustomSelectProps {
  value: OptionObject | null;
  onChange: (option: OptionObject) => void;
  options: OptionObject[]; 
  label?: string;
  isSearchable : boolean 
}

const CustomSelectForObject: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  label = 'Select ...',
  isSearchable = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');
 
  const triggerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null)
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const {state :{currentTheme}} = useStoreConfigCtx()

  // handle click outside the dropdown 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  

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
 
 
 
 useCloseDropDownOnScroll(isOpen , (bool) => setIsOpen(bool) , inputRef , dropdownRef )


  // filtered options when we type in the input we filter 
  const filteredOptions = isSearchable
  ? options.filter(opt =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    )
  : options;


  return (
    <div className="relative" ref={dropdownRef}>

      <div 
       ref={triggerRef} >
      {isSearchable ? (
      <div className="relative w-full "  >
        <Input
          ref={inputRef}
          value={search}
          placeholder={label}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
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
        <span>{value?.label ?? label}</span>
        <ChevronDown className={`w-5 h-5 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>
    )}
    </div>

      {isOpen && (
       
        <div
          className=" w-full mt-2 rounded-xl shadow-lg overflow-hidden"
          style={{
            backgroundColor: currentTheme.bg,
            borderWidth: '2px',
            borderColor: currentTheme.border,
            ...dropdownStyle
          }}
        >
          <div className="max-h-60 overflow-y-auto" >
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option);
                  setSearch(option.label)
                  setIsOpen(false);
                }}
                className="w-full px-5 py-3 text-left hover:bg-gray-100 transition-colors font-medium"
                style={{
                  color: currentTheme.text,
                  backgroundColor:
                    value?.value === option.value
                      ? currentTheme.secondary
                      : 'transparent',
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

export default CustomSelectForObject;
