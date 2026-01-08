import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import * as React from 'react';

interface OptionObject {
  value: string | number;
  label: string | number;
}

interface CustomSelectNativeProps {
  value: string | '';
  onChange: (value: string | number) => void;
  options: OptionObject[];
  placeholder?: string;
  isSearchable?: boolean;
}

const CustomSelectNative: React.FC<CustomSelectNativeProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  isSearchable = false,
}) => {
  const { state: { currentTheme } } = useStoreConfigCtx();
  const [search, setSearch] = React.useState('');

  // SEARCHABLE INPUT MODE
  if (isSearchable) {
    return (
      <div className="relative w-full">
        {/* Input with datalist */}
        <input
          list="select-options"
          value={search || (typeof value === 'string' ? value : '')}
          onChange={(e) => {
            setSearch(e.target.value);
            const matched = options.find(
              (opt) => opt.label === e.target.value || opt.value === e.target.value
            );
            if (matched) onChange(matched.value);
          }}
          placeholder={placeholder}
          className="w-full h-[56px] rounded-xl px-4 font-medium shadow-sm appearance-none transition-colors outline-none"
          style={{
            backgroundColor: currentTheme.bg,
            color: value ? currentTheme.text : '#94a3b8',
            borderWidth: '2px',
            borderColor: currentTheme.border,
          }}
        />

        <datalist id="select-options">
          {options.map((opt) => (
            <option key={opt.value} value={opt.label} />
          ))}
        </datalist>

        {/* Chevron icon */}
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  }

  // NATIVE SELECT MODE
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[56px] rounded-xl px-4 font-medium appearance-none shadow-sm transition-colors outline-none"
        style={{
          backgroundColor: currentTheme.bg,
          color: value ? currentTheme.text : '#94a3b8',
          borderWidth: '2px',
          borderColor: currentTheme.border,
        }}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

    
    </div>
  );
};

export default CustomSelectNative;
