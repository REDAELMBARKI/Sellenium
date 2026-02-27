import { Input } from '@/components/ui/input';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface ThemedInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function ThemedInput({ className = '', ...props }: ThemedInputProps) {
  const {
    state: { currentTheme },
  } = useStoreConfigCtx();

  return (
    <Input
      {...props}
         onFocus={(e) => {
        e.currentTarget.style.outline = `2px solid ${currentTheme.border}`;
        e.currentTarget.style.borderColor = currentTheme.accent;
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = 'none';
        e.currentTarget.style.borderColor = currentTheme.border;
      }}
    />
  );
}


type SelectOption = {
  label: string | number;
  value: string | number;
};

type SelectValue = string | number | SelectOption;

interface ThemedSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
  options: SelectOption[];
  placeholder?: string;
  value?: SelectValue;
  onChange?: (value: SelectValue) => void;
}

export function ThemedSelect({
  className = '',
  options,
  placeholder,
  value,
  onChange,
  ...props
}: ThemedSelectProps) {
  const { state: { currentTheme } } = useStoreConfigCtx();

  // Detect if we're in object mode
  const isObjectMode = value !== null && typeof value === 'object';

  const rawValue = isObjectMode ? (value as SelectOption).value : (value ?? '');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = options.find(o => String(o.value) === e.target.value);
    if (!selected) return;
    onChange?.(isObjectMode ? selected : selected.value);
  };

  return (
    <select
      {...props}
      value={String(rawValue)}
      onChange={handleChange}
      className={`w-full px-3 py-2 text-sm transition-colors ${className}`}
      style={{
        backgroundColor: currentTheme.bgSecondary,
        border: `1px solid ${currentTheme.border}`,
        borderRadius: currentTheme.borderRadius,
        color: currentTheme.text,
        outline: 'none',
      }}
      onFocus={(e) => {
        e.currentTarget.style.border = `1px solid ${currentTheme.accent}`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.border = `1px solid ${currentTheme.border}`;
      }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={String(opt.value)}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

interface ThemedTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function ThemedTextarea({ className = '', ...props }: ThemedTextareaProps) {
  const {
    state: { currentTheme },
  } = useStoreConfigCtx();

  return (
    <textarea
      {...props}
      className={`w-full px-3 py-2 text-sm transition-colors resize-none ${className}`}
      style={{
        backgroundColor: currentTheme.bgSecondary,
        border: `1px solid ${currentTheme.border}`,
        borderRadius: currentTheme.borderRadius,
        color: currentTheme.text,
        boxShadow: currentTheme.shadow,
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline = `2px solid ${currentTheme.primary}`;
        e.currentTarget.style.borderColor = currentTheme.primary;
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = 'none';
        e.currentTarget.style.borderColor = currentTheme.border;
      }}
    />
  );
}

interface ThemedLabelProps {
  htmlFor: string;
  children: React.ReactNode;
}

export function ThemedLabel({ htmlFor, children }: ThemedLabelProps) {
  const {
    state: { currentTheme },
  } = useStoreConfigCtx();

  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium mb-1"
      style={{ color: currentTheme.text }}
    >
      {children}
    </label>
  );
}
