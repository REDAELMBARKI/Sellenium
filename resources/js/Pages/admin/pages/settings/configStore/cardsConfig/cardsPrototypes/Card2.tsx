import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import { getMediaSrcOrDefault } from "@/functions/getMediaSrcOrDefault";
import { Eye, Heart, ShoppingCart, Star } from "lucide-react";

// Card 2: Horizontal Card
const Card2 = ({ product }:{product : any}) => {
     const {state :{currentCardConf :{isRounded , showPrice , showRating , showBorder}} } = useStoreConfigCtx()

  if(!product ) return null
  return (
      <div key={product.id} className="group">
                <div className={`relative overflow-hidden rounded-lg bg-gray-100 mb-4 ${showBorder ? 'border-2 border-gray-300' : ''}`} >
                  <img
                    src={product?.image ?? ''}
                    alt={product.name ?? 'image'}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Product Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex space-x-2">
                      <button className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors">
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                      <button className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Wishlist Button */}
                  <button className="absolute top-4 right-4 bg-white bg-opacity-90 text-gray-600 p-2 rounded-full hover:bg-white hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {product?.name ?? ''}
                  </h3>
                  
                  {/* Rating */}
                  {showRating && (

                    <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product?.rating ?? 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">({product?.reviews ?? 'unrated'})</span>
                  </div>
                  )}
                  {showPrice && (
                  <p className="text-xl font-bold text-gray-900">${product?.price ?? '00'}</p>
                  ) 
                  }
                  </div>
              </div>
              
  );
};


export default Card2;   