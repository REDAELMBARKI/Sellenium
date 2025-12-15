import { Heart, Star } from "lucide-react";

// Card 1: Classic Grid Card
const Card1 = ({ product, config }) => {
  return (
    <div className={`bg-white rounded-lg overflow-hidden ${config.showBorder ? 'border-2 border-gray-200' : 'shadow-md'}`}>
      <div className="relative">
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
        <button className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50">
          <Heart className="w-5 h-5 text-red-500" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        {config.showRating && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">{product.rating}</span>
          </div>
        )}
        {config.showPrice && (
          <p className="text-xl font-bold text-gray-900 mb-3">${product.price}</p>
        )}
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Add to Cart
        </button>
      </div>
    </div>
  );

};
export default Card1;