import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import Layout from '../Layouts/Layout';
import { ProductCard } from './products/ProductCard';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeFilter, setActiveFilter] = useState('*');

  const slides = [
    {
      image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1200',
      subtitle: 'Women Collection 2024',
      title: 'NEW SEASON',
      buttonText: 'Shop Now'
    },
    {
      image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1200',
      subtitle: 'Men New-Season',
      title: 'Jackets & Coats',
      buttonText: 'Shop Now'
    },
    {
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1200',
      subtitle: 'Men Collection 2024',
      title: 'New arrivals',
      buttonText: 'Shop Now'
    }
  ];

  const categories = [
    {
      image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Women',
      subtitle: 'Spring 2024'
    },
    {
      image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Men',
      subtitle: 'Spring 2024'
    },
    {
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Accessories',
      subtitle: 'New Trend'
    }
  ];

  const products = [
      {
          id: 1,
          name: "Esprit Ruffle Shirt",
          price: 16.64,
          originalPrice: 23,
          image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=300",
          category: "women",
          rating: 4.5,
          reviews: 12,
      },
      {
          id: 2,
          name: "Herschel Supply",
          originalPrice: 40,

          price: 35.31,
          image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300",
          category: "women",
          rating: 4.2,
          reviews: 8,
      },
      {
          id: 3,
          name: "Only Check Trouser",
          originalPrice: 34,
          price: 25.5,
          image: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=300",
          category: "men",
          rating: 4.8,
          reviews: 15,
      },
      {
          id: 4,
          name: "Classic Trench Coat",
          price: 75.0,
          originalPrice: 200,

          image: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=300",
          category: "women",
          rating: 4.6,
          reviews: 22,
      },
      {
          id: 5,
          name: "Front Pocket Jumper",
          originalPrice: 234,

          price: 34.75,
          image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300",
          category: "women",
          rating: 4.3,
          reviews: 9,
      },
      {
          id: 6,
          name: "Vintage Inspired Classic",
          originalPrice: 111,

          price: 93.2,
          image: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=300",
          category: "watches",
          rating: 4.7,
          reviews: 18,
      },
      {
          id: 7,
          name: "Shirt in Stretch Cotton",
          originalPrice: 111,

          price: 52.66,
          image: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=300",
          category: "women",
          rating: 4.4,
          reviews: 11,
      },
      {
          id: 8,
          name: "Pieces Metallic Printed",
          originalPrice: 23,

          price: 18.96,
          image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=300",
          category: "women",
          rating: 4.1,
          reviews: 7,
      },
  ];

  const filters = [
    { key: '*', label: 'All Products' },
    { key: 'women', label: 'Women' },
    { key: 'men', label: 'Men' },
    { key: 'bag', label: 'Bag' },
    { key: 'shoes', label: 'Shoes' },
    { key: 'watches', label: 'Watches' }
  ];

  const filteredProducts = activeFilter === '*' 
    ? products 
    : products.filter(product => product.category === activeFilter);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <Layout currentPage="home">
      {/* Hero Slider */}
      <section className="relative h-screen overflow-hidden">
        <div className="relative h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className="h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-30" />
                <div className="relative h-full flex items-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-lg">
                      <p className="text-white text-lg mb-4 animate-fade-in-up">
                        {slide.subtitle}
                      </p>
                      <h1 className="text-white text-5xl md:text-6xl font-bold mb-8 animate-fade-in-up animation-delay-200">
                        {slide.title}
                      </h1>
                      <button className="bg-white text-gray-900 px-8 py-4 rounded-md font-semibold hover:bg-gray-100 transition-colors animate-fade-in-up animation-delay-400">
                        {slide.buttonText}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slider Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Category Banners */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div key={index} className="group relative overflow-hidden rounded-2xl">
                <div className="aspect-w-4 aspect-h-5">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                  <p className="text-gray-200 mb-4">{category.subtitle}</p>
                  <button className="text-white border-b border-white hover:border-gray-300 transition-colors">
                    Shop Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Product Overview</h2>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-6 py-2 rounded-full transition-colors ${
                    activeFilter === filter.key
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product , index) => (
            //   <div key={product.id} className="group">
            //     <div className="relative overflow-hidden rounded-lg bg-gray-100 mb-4">
            //       <img
            //         src={product.image}
            //         alt={product.name}
            //         className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
            //       />
                  
            //       {/* Product Actions */}
            //       <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            //         <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex space-x-2">
            //           <button className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors">
            //             <ShoppingCart className="w-5 h-5" />
            //           </button>
            //           <button className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors">
            //             <Eye className="w-5 h-5" />
            //           </button>
            //         </div>
            //       </div>

            //       {/* Wishlist Button */}
            //       <button className="absolute top-4 right-4 bg-white bg-opacity-90 text-gray-600 p-2 rounded-full hover:bg-white hover:text-red-500 transition-colors">
            //         <Heart className="w-4 h-4" />
            //       </button>
            //     </div>

            //     <div className="space-y-2">
            //       <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
            //         {product.name}
            //       </h3>
                  
            //       {/* Rating */}
            //       <div className="flex items-center space-x-2">
            //         <div className="flex items-center">
            //           {[...Array(5)].map((_, i) => (
            //             <Star
            //               key={i}
            //               className={`w-4 h-4 ${
            //                 i < Math.floor(product.rating)
            //                   ? 'text-yellow-400 fill-current'
            //                   : 'text-gray-300'
            //               }`}
            //             />
            //           ))}
            //         </div>
            //         <span className="text-sm text-gray-500">({product.reviews})</span>
            //       </div>

            //       <p className="text-xl font-bold text-gray-900">${product.price}</p>
            //     </div>
            //   </div>
              // 
              
              <ProductCard
              key={index}
              product={product}
              />
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-gray-100 text-gray-900 px-8 py-3 rounded-md hover:bg-gray-200 transition-colors">
              Load More
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;