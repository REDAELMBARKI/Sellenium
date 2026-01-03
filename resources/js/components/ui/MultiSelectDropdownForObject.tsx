import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SelectedChip from "./SelectedChip";
import { isObject } from "lodash";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";

type AllowedObjectsType = { id: string; name: string }; // simplified

interface MultiSelectDropdownForObjectProps {
  label: string;
  options: AllowedObjectsType[];
  selectedValues: AllowedObjectsType[];
  onChange: (selected: AllowedObjectsType[]) => void;
}

const MultiSelectDropdownForObject: React.FC<MultiSelectDropdownForObjectProps> = ({
  label,
  options,
  selectedValues,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const { state: { currentTheme } } = useStoreConfigCtx();

  // Click outside closes dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
  const handleScroll = (e: Event) => {
    if (!dropdownRef.current) return;

    const target = e.target as HTMLElement;

    // If scrolling inside the dropdown itself
    if (dropdownRef.current.contains(target)) {
    
       return; // ignore scroll inside dropdown if it can scroll
    }

    // Otherwise, close dropdown
    setIsOpen(false);
  };

  window.addEventListener('scroll', handleScroll, true); // capture phase
  return () => window.removeEventListener('scroll', handleScroll, true);
}, []);


  // Update dropdown position
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: rect.bottom,
        left: rect.left,
        width: rect.width,
        zIndex: 99999
      });
    }
  }, [isOpen]);

  const toggleOption = (option: AllowedObjectsType) => {
    if (!isObject(option)) return;
    const exists = selectedValues.map(v => v.id).includes(option.id);
    const newSelected = exists
      ? selectedValues.filter(v => v.id !== option.id)
      : [...selectedValues, option];
    onChange(newSelected);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-between focus:outline-none shadow-sm"
        style={{
          backgroundColor: currentTheme.bg,
          color: currentTheme.text,
          borderWidth: "2px",
          borderColor: isOpen ? currentTheme.accent : currentTheme.border
        }}
      >
        <span className={selectedValues.length === 0 ? "text-gray-400" : ""}>
          {selectedValues.length === 0
            ? `Select ${label.toLowerCase()}`
            : `${selectedValues.length} selected`}
        </span>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          style={{ color: currentTheme.text }}
        />
      </button>

      {isOpen && (
        <div
          className="rounded-xl shadow-lg overflow-y-auto"
          style={{
            ...dropdownStyle,
            maxHeight: "250px",
            backgroundColor: currentTheme.bg,
            borderWidth: "2px",
            borderColor: currentTheme.border,
          }}
        >
          {options.map(option => {
            const isSelected = selectedValues.map(v => v.id).includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => toggleOption(option)}
                className="w-full px-5 py-3 flex items-center gap-3 hover:bg-opacity-50 transition-all duration-150"
                style={{
                  backgroundColor: isSelected ? `${currentTheme.accent}10` : "transparent",
                  color: currentTheme.text
                }}
              >
                <div
                  className="w-5 h-5 rounded flex items-center justify-center transition-all"
                  style={{
                    backgroundColor: isSelected ? currentTheme.accent : "transparent",
                    borderWidth: "2px",
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

      {/* Selected chips */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedValues.map(value => (
            <SelectedChip key={value.id} label={value.name} onRemove={() => toggleOption(value)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdownForObject;
