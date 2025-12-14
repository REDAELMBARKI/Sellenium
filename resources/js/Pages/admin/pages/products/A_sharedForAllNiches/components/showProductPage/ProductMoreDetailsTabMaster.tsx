import React from "react";
import { Package, Truck, Shield, Award } from "lucide-react";

interface ProductDetailsProps {
  description: string;
  brand?: string;
  category?: Array<{ id: string; name: string }>;
  tags?: Array<{ id: string; name: string }>;
  sku?: string;
  releaseDate?: string;
}

export const ProductMoreDetailsTabMaster: React.FC<ProductDetailsProps> = ({
  description,
  brand,
  category,
  tags,
  sku,
  releaseDate
}) => {
  const features = [
    {
      icon: <Package className="w-5 h-5" />,
      title: "Premium Quality",
      description: "Crafted with the finest materials for lasting durability"
    },
    {
      icon: <Truck className="w-5 h-5" />,
      title: "Fast Shipping",
      description: "Free shipping on orders over $50"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Secure Payment",
      description: "Your payment information is always protected"
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "Warranty",
      description: "1-year warranty on all products"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Description Section */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-2xl border border-slate-200 shadow-lg">
        <h3 className="text-2xl font-bold text-slate-900 mb-4">Product Description</h3>
        <p className="text-slate-700 leading-relaxed text-lg">{description}</p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-3 rounded-lg text-white">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">{feature.title}</h4>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Product Information</h3>

        {brand && (
          <div className="flex justify-between py-3 border-b border-slate-200">
            <span className="text-slate-600 font-medium">Brand</span>
            <span className="text-slate-900 font-semibold">{brand}</span>
          </div>
        )}

        {category && category.length > 0 && (
          <div className="flex justify-between py-3 border-b border-slate-200">
            <span className="text-slate-600 font-medium">Category</span>
            <span className="text-slate-900 font-semibold">
              {category.map(c => c.name).join(", ")}
            </span>
          </div>
        )}

        {sku && (
          <div className="flex justify-between py-3 border-b border-slate-200">
            <span className="text-slate-600 font-medium">SKU</span>
            <span className="text-slate-900 font-mono text-sm">{sku}</span>
          </div>
        )}

        {releaseDate && (
          <div className="flex justify-between py-3 border-b border-slate-200">
            <span className="text-slate-600 font-medium">Release Date</span>
            <span className="text-slate-900">{releaseDate}</span>
          </div>
        )}

        {tags && tags.length > 0 && (
          <div className="pt-3">
            <span className="text-slate-600 font-medium mb-3 block">Tags</span>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 rounded-full text-sm font-medium border border-slate-300 hover:shadow-md transition-all"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductMoreDetailsTabMaster;
