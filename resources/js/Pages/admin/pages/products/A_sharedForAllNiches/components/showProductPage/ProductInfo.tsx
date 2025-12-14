import React, { useState } from "react";
import { ChevronDown, Truck, Package, Clock, CreditCard } from "lucide-react";
import { Color, Size } from "@/types/inventoryTypes";
import SizeSelector from "./SizeSelector";
import ColorSelector from "./ColorSection";

interface Material {
  id: string;
  name: string;
}

interface Fit {
  id: string;
  name: string;
}

interface Country {
  code: string;
  name: string;
}

interface ProductInfoProps {
  name: string;
  brand: string;
  price: string;
  compareAtPrice?: string;
  sku?: string;
  stock?: number | string;
  description?: string;
  rating_average?: number;
  materials?: Material[];
  fits?: Fit[];
  gender?: string[];
  styles?: string[];
  season?: string[];
  madeCountry?: Country;
  colors : Color[]
  sizes : Size[]
  isCOD?: boolean;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  name,
  brand,
  price,
  compareAtPrice,
  sku,
  stock,
  description,
  rating_average,
  materials,
  fits,
  gender,
  styles,
  season,
  madeCountry,
  colors,
  sizes,
  isCOD = true,
}) => {
  const [showDescription, setShowDescription] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
    const [selectedColor, setSelectedColor] = useState<Color | undefined>();
    const [selectedSize, setSelectedSize] = useState<Size | undefined>();

      React.useEffect(() => {
    if (colors.length > 0) {
      setSelectedColor(colors[0]);
    }
    if (sizes.length > 0) {
      setSelectedSize(sizes[2]);
    }
  }, []);


  const handleColorSelect = (color: Color) => {
    setSelectedColor(color);
  };

  const handleSizeSelect = (size: Size) => {
    setSelectedSize(size);
  };


  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
          {brand}
        </p>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{name}</h1>
      </div>

      {rating_average && (
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-lg ${
                  star <= Math.round(rating_average)
                    ? "text-amber-400"
                    : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-600">({rating_average}/5)</span>
        </div>
      )}

      <div className="space-y-2 pt-2 pb-4">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-gray-900">{price}</span>
          {compareAtPrice && (
            <span className="text-lg line-through text-gray-500">
              {compareAtPrice}
            </span>
          )}
        </div>

        {stock !== undefined && stock !== 0 && stock !== "0" && (
          <p className="text-sm text-green-600 font-medium">{stock} in stock</p>
        )}

        {(stock === 0 || stock === "0") && (
          <p className="text-sm text-red-600 font-medium">Out of stock</p>
        )}
      </div>

      {/* colors and seizes  */}
         <div className="pt-4 border-t border-gray-100">
                  {colors && colors.length > 0 && (
                    <div className="mb-6">
                      <ColorSelector
                        colors={colors}
                        selectedColor={selectedColor}
                        onColorSelect={handleColorSelect}
                      />
                    </div>
                  )}

                  {sizes && sizes.length > 0 && (
                    <div>
                      <SizeSelector
                        sizes={sizes}
                        selectedSize={selectedSize}
                        onSizeSelect={handleSizeSelect}
                      />
                    </div>
                  )}
       </div>


      {/* description */}

      <div className="space-y-2">
        {description && (
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => setShowDescription((prev) => !prev)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900 text-sm">Description</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                  showDescription ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {showDescription && (
              <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                <p className="pt-3">{description}</p>
              </div>
            )}
          </div>
        )}

        {(materials || fits || season || styles || gender || madeCountry) && (
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => setShowProductDetails((prev) => !prev)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900 text-sm">Product Details</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                  showProductDetails ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {showProductDetails && (
              <div className="px-4 pb-4 text-sm border-t border-gray-100">
                <div className="pt-3 space-y-2">
                  {materials && materials.length > 0 && (
                    <div className="flex">
                      <span className="text-gray-500 w-24 flex-shrink-0">Material:</span>
                      <span className="text-gray-900 font-medium">{materials.map(m => m.name).join(", ")}</span>
                    </div>
                  )}
                  {fits && fits.length > 0 && (
                    <div className="flex">
                      <span className="text-gray-500 w-24 flex-shrink-0">Fit:</span>
                      <span className="text-gray-900 font-medium">{fits.map(f => f.name).join(", ")}</span>
                    </div>
                  )}
                  {season && season.length > 0 && (
                    <div className="flex">
                      <span className="text-gray-500 w-24 flex-shrink-0">Season:</span>
                      <span className="text-gray-900 font-medium capitalize">{season.join(", ")}</span>
                    </div>
                  )}
                  {styles && styles.length > 0 && (
                    <div className="flex">
                      <span className="text-gray-500 w-24 flex-shrink-0">Style:</span>
                      <span className="text-gray-900 font-medium capitalize">{styles.join(", ")}</span>
                    </div>
                  )}
                  {gender && gender.length > 0 && (
                    <div className="flex">
                      <span className="text-gray-500 w-24 flex-shrink-0">Gender:</span>
                      <span className="text-gray-900 font-medium capitalize">{gender.join(", ")}</span>
                    </div>
                  )}
                  {madeCountry && (
                    <div className="flex">
                      <span className="text-gray-500 w-24 flex-shrink-0">Made in:</span>
                      <span className="text-gray-900 font-medium">{madeCountry.name}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {isCOD && (
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => setShowShipping((prev) => !prev)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900 text-sm">Shipping Information</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                  showShipping ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {showShipping && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="pt-3 space-y-3">
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Cash on Delivery</p>
                      <p className="text-xs text-gray-600">Pay when you receive your order</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Free Delivery</p>
                      <p className="text-xs text-gray-600">Standard shipping at no extra cost</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Estimated Delivery</p>
                      <p className="text-xs text-gray-600">3-5 business days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Secure Packaging</p>
                      <p className="text-xs text-gray-600">Protected and sealed for safety</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};