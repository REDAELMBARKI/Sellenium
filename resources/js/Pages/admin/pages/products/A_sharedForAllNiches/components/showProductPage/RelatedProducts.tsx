import React from "react";

interface RelatedProduct {
  id: string;
  name: string;
  price: string;
  image: string;
  rating?: number;
}

interface RelatedProductsProps {
  products?: RelatedProduct[];
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  products = [
    {
      id: "1",
      name: "Classic Oxford Shirt",
      price: "$79.99",
      image: "https://via.placeholder.com/200x250",
      rating: 4.3,
    },
    {
      id: "2",
      name: "Slim Fit Chinos",
      price: "$69.99",
      image: "https://via.placeholder.com/200x250",
      rating: 4.6,
    },
    {
      id: "3",
      name: "Casual Canvas Sneakers",
      price: "$89.99",
      image: "https://via.placeholder.com/200x250",
      rating: 4.5,
    },
    {
      id: "4",
      name: "Leather Belt",
      price: "$49.99",
      image: "https://via.placeholder.com/200x250",
      rating: 4.4,
    },
  ],
}) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-xs ${
              star <= Math.round(rating) ? "text-amber-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Complete Your Look
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="group cursor-pointer transition-transform duration-300 hover:scale-105"
            >
              <div className="relative overflow-hidden rounded-lg bg-gray-100 h-60 mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-sm font-bold text-gray-900 mb-2">
                {product.price}
              </p>
              {product.rating && renderStars(product.rating)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
