import { useTheme } from "@/admin";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SelectedChip from "./SelectedChip";
import { Select } from '@/components/ui/select';
import { Category, Color, Fit, Material, Size } from "@/types/inventoryTypes";
import { Country, Gender } from "@/types/productsTypes";
import { useColorsCtx } from "@/contextHooks/useColorsCtx";
import { isObject } from "lodash";

type AllowedObjectsType = Size | Material  | Fit | Color | Category 
interface MultiSelectDropdownForObjectProps {
  label: string;
  options: AllowedObjectsType[];
  selectedValues: AllowedObjectsType[];
  onChange: (selected: AllowedObjectsType[]) => void;
}



const MultiSelectDropdownForObject: React.FC<MultiSelectDropdownForObjectProps> = ({ label, options, selectedValues, onChange }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
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

  const toggleOption = (option:AllowedObjectsType ) => {
    let newSelected : AllowedObjectsType[];
    if(isObject(option)){
        // here i stringify=ied the objec cause option is an object so i can use includesd method
       const exists : boolean = selectedValues.map(obj => JSON.stringify(obj)).includes(JSON.stringify(option)) ; 
       newSelected = exists
      ? selectedValues.filter((v : AllowedObjectsType ) => v.id !== option.id)
      : [...selectedValues, option];
      onChange(newSelected);
    }else{
     
       throw new Error("Option is not an object");
    }
    
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
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
        <span className={selectedValues.length === 0 ? 'text-gray-400' : ''}>
          {selectedValues.length === 0 
            ? `Select ${label.toLowerCase()}` 
            : `${selectedValues.length} selected`}
        </span>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: currentTheme.text }}
        />
      </button>

      {isOpen && (
        <div 
          className="absolute z-50 w-full mt-2 rounded-xl shadow-lg overflow-hidden"
          style={{ 
            backgroundColor: currentTheme.bg,
            borderWidth: '2px',
            borderColor: currentTheme.border,
            maxHeight: '250px',
            overflowY: 'auto'
          }}
        >
          {options.map((option, idx) => {
            const isSelected = selectedValues.includes(option);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleOption(option)}
                className="w-full px-5 py-3 flex items-center gap-3 transition-all duration-150 hover:bg-opacity-50"
                style={{
                  backgroundColor: isSelected ? `${currentTheme.accent}10` : 'transparent',
                  color: currentTheme.text
                }}
              >
                <div 
                  className="w-5 h-5 rounded flex items-center justify-center transition-all"
                  style={{
                    backgroundColor: isSelected ? currentTheme.accent : 'transparent',
                    borderWidth: '2px',
                    borderColor: isSelected ? currentTheme.accent : currentTheme.border
                  }}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="font-medium capitalize">{option.name}</span>
              </button>
            );
          })}
        </div>
      )}
     
     {/* show selected valeus  */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedValues.map((value, idx) => (
            <SelectedChip
              key={idx}
              label={value.name ?? 'unfigured '}
              onRemove={() => toggleOption(value)}
            />
          ))}
        </div>
      )}
    </div>
  );
};


export default MultiSelectDropdownForObject ; 