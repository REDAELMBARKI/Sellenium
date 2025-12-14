import React from "react";

interface Product {
  id: number;
  title: string;
  price?: number;
  rating?: number;
}

interface StorePreviewProps {
  products: Product[];
  config: {
    layoutType: "grid" | "stack";
    showPrice: boolean;
    showRating: boolean;
    theme: "light" | "dark";
    cardType: "grid" | "list" | "full";
  };
}

const StorePreview: React.FC<StorePreviewProps> = ({ products, config }) => {
  const isGrid = config.layoutType === "grid";

  return (
    <div
      className={`h-[520px] overflow-y-auto rounded-2xl border p-4 transition-all
        ${config.theme === "dark"
          ? "bg-slate-900 text-white border-slate-700"
          : "bg-white text-slate-900 border-slate-200"
        }`}
    >
      <div
        className={
          isGrid
            ? "grid grid-cols-2 gap-4"
            : "flex flex-col gap-4"
        }
      >
        {products.map((product) => (
          <div
            key={product.id}
            className={`rounded-xl border p-4 transition-all
              ${config.theme === "dark"
                ? "bg-slate-800 border-slate-700"
                : "bg-slate-50 border-slate-200"
              }`}
          >
            <h4 className="font-semibold truncate mb-1">
              {product.title}
            </h4>

            {config.showPrice && product.price && (
              <div className="text-sm font-medium">
                {product.price} MAD
              </div>
            )}

            {config.showRating && product.rating && (
              <div className="text-xs opacity-70">
                ⭐ {product.rating}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StorePreview;
