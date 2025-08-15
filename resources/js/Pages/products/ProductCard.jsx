import React from 'react';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
// import { motion } from 'framer-motion';
// import { Product } from '../../types';
import { useCart } from '../../context/CartContext';


/**
 * Product card component with hover effects and quick actions
 * Supports multiple variants for different layout contexts
 */
export const ProductCard= ({ 
  product, 
  variant = 'default' 
}) => {
  const { state, dispatch } = useCart();
  // const isInCart = state.cartItems.some(item => item.product.id === product.id);

  // Handle adding/removing from wishlist
  // Handle adding to cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch({
      type: 'ADD_TO_CART',
      payload: { product, quantity: 1 }
    });
  };

  // Calculate discount percentage
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Variant-specific styles
  const cardStyles = {
    default: 'bg-white rounded-xl shadow-lg overflow-hidden',
    compact: 'bg-white rounded-lg shadow-md overflow-hidden',
    featured: 'bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl overflow-hidden'
  };

  return (
      // <motion.div
      //   initial={{ opacity: 0, y: 20 }}
      //   animate={{ opacity: 1, y: 0 }}
      //   whileHover={{ y: -5 }}
      //   transition={{ duration: 0.3 }}
      //   className="group relative"
      // >
      // instale motion and replace this div
      <div className="group relative">
          <Link to={`/products/${product.id}`} className="block">
              <div className={cardStyles[variant]}>
                  {/* Image Container */}
                  <div className="relative overflow-hidden aspect-square">
                      <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Discount Badge */}
                      {discountPercentage > 0 && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-medium">
                              -{discountPercentage}%
                          </div>
                      )}

                      {/* Quick Actions Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                          <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 space-x-2">
                              <button
                                  className={`p-2 rounded-full transition-colors ${
                                      false
                                          ? "bg-red-500 text-white"
                                          : "bg-white text-gray-700 hover:bg-red-500 hover:text-white"
                                  }`}
                              >
                                  <Heart
                                      size={20}
                                      fill={true ? "white" : "none"}
                                  />
                              </button>

                              <button className="p-2 bg-white text-gray-700 hover:bg-blue-500 hover:text-white rounded-full transition-colors">
                                  <Eye size={20} />
                              </button>
                          </div>
                      </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {product.name}
                          </h3>
                          <div className="flex items-center ml-2">
                              <Star
                                  size={16}
                                  className="text-yellow-400 fill-current"
                              />
                              <span className="text-sm text-gray-600 ml-1">
                                  {product.rating}
                              </span>
                          </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg font-bold text-blue-600">
                              ${product.price.toFixed(2)}
                          </span>
                          {product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                  ${product.originalPrice.toFixed(2)}
                              </span>
                          )}
                      </div>

                      {/* Additional Info */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <span>{product.reviews} reviews</span>
                          Sold by{" some one"}
                          Sold by{" some one"}
                          {/* <span>{product.sales} sold</span> */}
                      </div>

                      {/* Seller */}
                      <p className="text-sm text-gray-600 mb-3">
                          Sold by{" some one"}
                          <span className="text-blue-600 font-medium">
                              {/* {product.seller} */}
                          </span>
                      </p>

                      {/* Add to Cart Button */}
                      <button
                          onClick={handleAddToCart}
                          variant={false ? "secondary" : "primary"}
                          size="sm"
                          className="w-full"
                          icon={<ShoppingCart size={16} />}
                      >
                          {false ? "In Cart" : "Add to Cart"}
                      </button>
                  </div>
              </div>
          </Link>
      </div>
      // </motion.div>
  );
};