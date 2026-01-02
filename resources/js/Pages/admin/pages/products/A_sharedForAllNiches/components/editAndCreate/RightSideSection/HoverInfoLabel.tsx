import { Info } from 'lucide-react';
import { useState } from 'react';

interface HoverInfoLabelProps {
  htmlFor?: string;
  label: string;
  tooltip: string;
}

export function HoverInfoLabel({ htmlFor, label, tooltip }: HoverInfoLabelProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex items-center gap-2 mb-2">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
          aria-label={`Info: ${tooltip}`}
        >
          <Info className="w-4 h-4" />
        </button>
        {showTooltip && (
          <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-64 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none">
            {tooltip}
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
          </div>
        )}
      </div>
    </div>
  );
}
