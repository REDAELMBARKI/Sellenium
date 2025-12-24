import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import { ProductClient } from "@/types/clientSideTypes";
import { Heart, Star } from "lucide-react";

// Card 3: Premium Card
const Card3 = ({ product }:{product : ProductClient}) => {
  const {state :{currentCardConf :{isRounded , showPrice , showRating , showBorder}} } = useStoreConfigCtx()

  return (
    <div className={`bg-white rounded-xl overflow-hidden ${showBorder ? 'border-4 border-purple-200' : 'shadow-xl'}`}>
      <div className="relative">
        <img src={product.image} alt={product.name} className="w-full h-52 object-cover" />
        <button className="absolute top-3 left-3 bg-purple-600 rounded-full p-2 hover:bg-purple-700">
          <Heart className="w-5 h-5 text-white" />
        </button>
      </div>
      <div className="p-5 bg-gradient-to-b from-purple-50 to-white">
        <h3 className="font-bold text-lg mb-2 text-purple-900">{product.name}</h3>
        {showRating && (
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
            ))}
            <span className="ml-1 text-sm text-gray-600">({product.rating})</span>
          </div>
        )}
        {showPrice && (
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-purple-600">${product.price}</span>
            <span className="text-sm text-gray-500 line-through">${(product.price * 1.3).toFixed(2)}</span>
          </div>
        )}
        <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Card3;