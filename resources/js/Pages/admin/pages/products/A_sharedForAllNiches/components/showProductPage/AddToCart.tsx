import React, { useState } from "react";
import { ShoppingCart, Plus, Minus, Banknote } from "lucide-react";

interface AddToCartProps {
  stock: number | string;
  onBuyNow : () => void,
  onAddToCart: () => void
}

const CheckoutButtons : React.FC<AddToCartProps> = ({ stock , onBuyNow , onAddToCart}) => {
  const [quantity, setQuantity] = useState(1);
  const stockNumber = typeof stock === "string" ? parseInt(stock) : stock;
  const isOutOfStock = stockNumber === 0;

  const incrementQuantity = () => {
    if (quantity < stockNumber) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={decrementQuantity}
            disabled={quantity <= 1 || isOutOfStock}
            className="px-4 py-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-6 py-3 font-semibold text-gray-900 border-x-2 border-gray-300 min-w-[60px] text-center">
            {quantity}
          </span>
          <button
            onClick={incrementQuantity}
            disabled={quantity >= stockNumber || isOutOfStock}
            className="px-4 py-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button 
          onClick={onAddToCart}
          disabled={isOutOfStock}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold text-white transition-all ${
            isOutOfStock
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
        </button>

        {/* // buy now */}
        <button 
          onClick={onBuyNow}
          disabled={isOutOfStock}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold text-white transition-all ${
            isOutOfStock
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          }`}
        >
          <Banknote  className="w-5 h-5" />
          <span>{isOutOfStock ? "Out of Stock" : "Buy Now"}</span>
        </button>

      </div>
    </div>
  );
};

export default CheckoutButtons;
