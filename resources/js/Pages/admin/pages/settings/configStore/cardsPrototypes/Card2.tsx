import { Heart, Star } from "lucide-react";

// Card 2: Horizontal Card
const Card2 = ({ product, config }) => {
  return (
    <div className={`bg-white rounded-lg flex overflow-hidden ${config.showBorder ? 'border-2 border-gray-200' : 'shadow-lg'}`}>
      <img src={product.image} alt={product.name} className="w-32 h-32 object-cover" />
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-base mb-1">{product.name}</h3>
          {config.showRating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">{product.rating}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          {config.showPrice && (
            <span className="text-lg font-bold">${product.price}</span>
          )}
          <div className="flex gap-2">
            <button className="p-1.5 hover:bg-gray-100 rounded">
              <Heart className="w-5 h-5 text-red-500" />
            </button>
            <button className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 text-sm">
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Card2;   