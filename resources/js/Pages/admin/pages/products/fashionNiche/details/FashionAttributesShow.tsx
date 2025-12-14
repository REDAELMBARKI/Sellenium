import React, { useState } from "react";

interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

interface SizeOption {
  id: string;
  name: string;
}

interface MaterialOption {
  id: string;
  name: string;
}

interface FitOption {
  id: string;
  name: string;
}

interface FashionAttributesShowProps {
  colors?: ColorOption[];
  sizes?: SizeOption[];
  materials?: MaterialOption[];
  fits?: FitOption[];
  onSelectionChange?: (selection: {
    color?: string;
    size?: string;
    material?: string;
    fit?: string;
  }) => void;
}

const FashionAttributesShow: React.FC<FashionAttributesShowProps> = ({
  colors = [],
  sizes = [],
  materials = [],
  fits = [],
  onSelectionChange,
}) => {
  const [selection, setSelection] = useState({
    color: colors[0]?.id || "",
    size: sizes[0]?.id || "",
    material: materials[0]?.id || "",
    fit: fits[0]?.id || "",
  });

  const handleChange = (type: string, value: string) => {
    const newSelection = { ...selection, [type]: value };
    setSelection(newSelection);
    onSelectionChange?.(newSelection);
  };

  return (
    <div className="space-y-6 py-4 border-t border-gray-200">
      {colors.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Color
          </label>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color.id}
                onClick={() => handleChange("color", color.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  selection.color === color.id
                    ? "border-gray-900 ring-2 ring-offset-2 ring-gray-400"
                    : "border-gray-300 hover:border-gray-500"
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full border border-gray-400"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-sm font-medium">{color.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Size
          </label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => handleChange("size", size.id)}
                className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all ${
                  selection.size === size.id
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 text-gray-900 hover:border-gray-900"
                }`}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {materials.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Material
          </label>
          <div className="flex flex-wrap gap-2">
            {materials.map((material) => (
              <button
                key={material.id}
                onClick={() => handleChange("material", material.id)}
                className={`px-4 py-2 border-2 rounded-lg text-sm transition-all ${
                  selection.material === material.id
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 text-gray-900 hover:border-gray-900"
                }`}
              >
                {material.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {fits.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Fit
          </label>
          <div className="flex flex-wrap gap-2">
            {fits.map((fit) => (
              <button
                key={fit.id}
                onClick={() => handleChange("fit", fit.id)}
                className={`px-4 py-2 border-2 rounded-lg text-sm transition-all ${
                  selection.fit === fit.id
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 text-gray-900 hover:border-gray-900"
                }`}
              >
                {fit.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FashionAttributesShow;
