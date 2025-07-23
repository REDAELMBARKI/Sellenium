import React, { useState } from 'react';
import { Star, Heart, Facebook, Twitter, Plus, Minus, ChevronRight } from 'lucide-react';
import Layout from '../Layouts/Layout';

const ProductDetailPage = () => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [currentImage, setCurrentImage] = useState(0);

  const product = {
    name: 'Lightweight Jacket',
    price: 58.79,
    description: 'Nulla eget sem vitae eros pharetra viverra. Nam vitae luctus ligula. Mauris consequat ornare feugiat.',
    images: [
      'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Red', 'Blue', 'White', 'Grey'],
    rating: 4.5,
    reviews: 24,
    sku: 'JAK-01',
    categories: ['Jacket', 'Men']
  };

  const relatedProducts = [
    {
      id: 1,
      name: 'Esprit Ruffle Shirt',
      price: 16.64,
      image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 2,
      name: 'Herschel Supply',
      price: 35.31,
      image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 3,
      name: 'Only Check Trouser',
      price: 25.50,
      image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 4,
      name: 'Classic Trench Coat',
      price: 75.00,
      image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

  const breadcrumbs = [
    { name: 'Home', href: '#' },
    { name: 'Men', href: '#' },
    { name: 'Lightweight Jacket', current: true }
  ];

  const tabs = [
    { id: 'description', name: 'Description' },
    { id: 'information', name: 'Additional information' },
    { id: 'reviews', name: 'Reviews (1)' }
  ];

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((item, index) => (
            <div key={item.name} className="flex items-center">
              {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />}
              <a
                href={item.href}
                className={`${
                  item.current
                    ? 'text-gray-900 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {item.name}
              </a>
            </div>
          ))}
        </nav>
      </div>

      {/* Product Detail */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <div className="mb-4">
                <img
                  src={product.images[currentImage]}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              <div className="flex space-x-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      currentImage === index ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-2xl font-bold text-gray-900 mb-6">${product.price}</p>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">({product.reviews} reviews)</span>
              </div>

              <p className="text-gray-600 mb-8">{product.description}</p>

              {/* Size Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-3">Size</label>
                <div className="flex space-x-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md ${
                        selectedSize === size
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-3">Color</label>
                <div className="flex space-x-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-md ${
                        selectedColor === color
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center space-x-4 mb-8">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors">
                  Add to Cart
                </button>
              </div>

              {/* Social & Wishlist */}
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span>Add to Wishlist</span>
                </button>
                <div className="flex items-center space-x-3">
                  <Facebook className="w-5 h-5 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors" />
                  <Twitter className="w-5 h-5 text-gray-600 hover:text-blue-400 cursor-pointer transition-colors" />
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="mt-16">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="py-8">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    Aenean sit amet gravida nisi. Nam fermentum est felis, quis feugiat nunc fringilla sit amet. 
                    Ut in blandit ipsum. Quisque luctus dui at ante aliquet, in hendrerit lectus interdum. 
                    Morbi elementum sapien rhoncus pretium maximus. Nulla lectus enim, cursus et elementum sed, 
                    sodales vitae eros. Ut ex quam, porta consequat interdum in, faucibus eu velit.
                  </p>
                </div>
              )}

              {activeTab === 'information' && (
                <div className="max-w-md">
                  <dl className="space-y-4">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Weight</dt>
                      <dd className="text-gray-900">0.79 kg</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Dimensions</dt>
                      <dd className="text-gray-900">110 x 33 x 100 cm</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Materials</dt>
                      <dd className="text-gray-900">60% cotton</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Color</dt>
                      <dd className="text-gray-900">Black, Blue, Grey, Green, Red, White</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Size</dt>
                      <dd className="text-gray-900">XL, L, M, S</dd>
                    </div>
                  </dl>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="max-w-2xl">
                  <div className="mb-8">
                    <div className="flex items-start space-x-4">
                      <img
                        src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
                        alt="Reviewer"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">Ariana Grande</h4>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600">
                          Quod autem in homine praestantissimum atque optimum est, id deseruit. 
                          Apud ceteros autem philosophos.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Add Review Form */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Add a review</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Your email address will not be published. Required fields are marked *
                    </p>
                    <form className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Your Rating
                        </label>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-gray-300 hover:text-yellow-400 cursor-pointer" />
                          ))}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="review" className="block text-sm font-medium text-gray-900 mb-2">
                          Your review
                        </label>
                        <textarea
                          id="review"
                          rows={4}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Meta */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <div className="flex flex-wrap justify-center items-center space-x-8 text-sm text-gray-600">
              <span>SKU: {product.sku}</span>
              <span>Categories: {product.categories.join(', ')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((product) => (
              <div key={product.id} className="group">
                <div className="relative overflow-hidden rounded-lg bg-gray-100 mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 px-6 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-100">
                    Quick View
                  </button>
                  <button className="absolute top-4 right-4 bg-white bg-opacity-90 text-gray-600 p-2 rounded-full hover:bg-white hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    {product.name}
                  </h3>
                  <p className="text-xl font-bold text-gray-900">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetailPage;