import React from "react";

const RelatedProducts = ({ products }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
                Related Products
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                    >
                        <div className="aspect-square bg-gray-100 overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="p-3">
                            <h3 className="font-medium text-gray-900 text-sm md:text-base line-clamp-2 mb-1">
                                {product.name}
                            </h3>
                            <p className="text-lg font-semibold text-gray-900">
                                ${product.price.toFixed(2)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;
