import React from "react";

interface Size {
  id: string;
  name: string;
}

interface SizeSelectorProps {
  sizes: Size[];
  selectedSize?: Size;
  onSizeSelect: (size: Size) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSize,
  onSizeSelect
}) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
        Size: {selectedSize?.name}
      </label>
      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => (
          <button
            key={size.id}
            onClick={() => onSizeSelect(size)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
              selectedSize?.id === size.id
                ? "bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg ring-2 ring-slate-900 ring-offset-2"
                : "bg-white text-slate-900 border-2 border-slate-300 hover:border-slate-900"
            }`}
          >
            {size.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;
