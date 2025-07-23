import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

// Reusable product card component with hover effects
const ProductCard = ({ product, compact = false }) => {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product)
  }

  const handleWishlistToggle = (e) => {
    e.preventDefault()
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const cardSize = compact ? 'h-64' : 'h-80'
  const imageSize = compact ? 'h-32' : 'h-48'

  return (
    <Link
      to={`/product/${product.id}`}
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden ${cardSize} border border-gray-100 dark:border-gray-700`}
    >
      {/* Product Image */}
      <div className={`relative ${imageSize} overflow-hidden`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            -{product.discount}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 shadow-lg ${
            isInWishlist(product.id)
              ? 'bg-red-500 text-white'
              : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-red-500 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
        </button>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-500 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 flex space-x-3">
            <button
              onClick={handleAddToCart}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg transform hover:scale-110"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
            <div className="bg-white/90 backdrop-blur-sm text-gray-600 p-3 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300">
              <Eye className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-800/50">
        <div>
          <h3 className={`font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 ${
            compact ? 'text-sm' : 'text-base'
          } line-clamp-2 mb-2`}>
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-2">
              ({product.reviews})
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${
              compact ? 'text-sm' : 'text-lg'
            }`}>
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className={`text-gray-500 line-through ${
                compact ? 'text-xs' : 'text-sm'
              }`}>
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          {!compact && (
            <div className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              {product.sold} sold
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard