import { Heart, Star } from "lucide-react";

// Card 4: Overlay Card
const Card4 = ({ product, config }) => {
  return (
    <div className={`relative rounded-xl overflow-hidden ${config.showBorder ? 'border-2 border-gray-300' : ''}`}>
      <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
        <h3 className="font-bold text-white text-lg mb-1">{product.name}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {config.showPrice && (
              <span className="text-white font-semibold text-lg">${product.price}</span>
            )}
            {config.showRating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-white text-sm">{product.rating}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30">
              <Heart className="w-5 h-5 text-white" />
            </button>
            <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100">
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card4;