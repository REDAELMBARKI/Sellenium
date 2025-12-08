import React from 'react';
import { Tag } from "lucide-react";
import { ProductDataGlobal } from '@/types/productsTypes';
import { currentTheme } from '@/data/currentTheme';

export interface ProductInfoDisplayProps {
  productData: ProductDataGlobal;
}

const ProductInfoDisplay: React.FC<ProductInfoDisplayProps> = ({ productData }) => {
  return (
    <div className="space-y-8">
      {/* Thumbnail Section */}
      <div>
        <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
          Product Thumbnail
        </label>
        <div className="flex items-center gap-6">
          {productData.thumbnail ? (
            <div className="relative group">
              <img
                src={productData.thumbnail}
                alt="Product thumbnail"
                className="w-40 h-40 object-cover rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                style={{ borderWidth: '3px', borderColor: currentTheme.border }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-2xl transition-all duration-300"></div>
            </div>
          ) : (
            <div className="w-40 h-40 flex items-center justify-center rounded-2xl shadow-lg" style={{ backgroundColor: currentTheme.buttonSecondary }}>
              <Tag className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Name & Brand */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>Product Name</label>
          <div className="w-full px-5 py-4 rounded-xl font-semibold shadow-sm"
               style={{ backgroundColor: currentTheme.buttonSecondary, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}>
            {productData.name || 'Not set'}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>Brand</label>
          <div className="w-full px-5 py-4 rounded-xl font-semibold shadow-sm"
               style={{ backgroundColor: currentTheme.buttonSecondary, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}>
            {productData.brand || 'Not set'}
          </div>
        </div>
      </div>

      {/* Prices & SKU */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>Price</label>
          <div className="w-full px-5 py-4 rounded-xl font-bold text-lg shadow-sm"
               style={{ backgroundColor: currentTheme.buttonSecondary, color: currentTheme.accent, borderWidth: '2px', borderColor: currentTheme.border }}>
            ${productData.price || 'Not set'}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>Compare At Price</label>
          <div className="w-full px-5 py-4 rounded-xl font-semibold shadow-sm"
               style={{ backgroundColor: currentTheme.buttonSecondary, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}>
            {productData.compareAtPrice ? `$${productData.compareAtPrice}` : 'Not set'}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>Cost Price</label>
          <div className="w-full px-5 py-4 rounded-xl font-semibold shadow-sm"
               style={{ backgroundColor: currentTheme.buttonSecondary, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}>
            {productData.costPrice ? `$${productData.costPrice}` : 'Not set'}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>SKU</label>
          <div className="w-full px-5 py-4 rounded-xl font-semibold shadow-sm"
               style={{ backgroundColor: currentTheme.buttonSecondary, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}>
            {productData.sku || 'Not set'}
          </div>
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>Product Type</label>
        <div className="w-full px-5 py-4 rounded-xl font-semibold shadow-sm"
             style={{ backgroundColor: currentTheme.buttonSecondary, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}>
          {productData.category?.length ? productData.category.join(', ') : 'Not set'}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>Description</label>
        <div className="w-full px-5 py-4 rounded-xl font-medium leading-relaxed shadow-sm min-h-[150px]"
             style={{ backgroundColor: currentTheme.buttonSecondary, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}>
          {productData.description || 'Not set'}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>Tags</label>
        <div className="border border-dashed rounded-lg p-6 min-h-[120px]" style={{ backgroundColor: '#f9fafb', borderColor: '#d1d5db' }}>
          {productData.tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {productData.tags.map(tag => (
                <span key={tag.id} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200"
                      style={{ backgroundColor: '#e5e7eb', color: '#374151', border: '1px solid #d1d5db' }}>
                  {tag.name}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <Tag className="w-12 h-12 text-gray-400 mb-3" />
              <div className="text-gray-500 font-medium text-lg">No tags</div>
              <div className="text-gray-400 text-sm mt-1">Add tags to organize your product</div>
            </div>
          )}
        </div>
      </div>

      {/* Other Info: Stock, Release Date, Visibility */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>Stock Quantity</label>
          <div className="w-full px-5 py-4 rounded-xl font-semibold shadow-sm"
               style={{ backgroundColor: currentTheme.buttonSecondary, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}>
            {productData.stockQuantity ?? 'Not set'}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>Release Date</label>
          <div className="w-full px-5 py-4 rounded-xl font-semibold shadow-sm"
               style={{ backgroundColor: currentTheme.buttonSecondary, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}>
            {productData.releaseDate || 'Not set'}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>Visible</label>
          <div className="w-full px-5 py-4 rounded-xl font-semibold shadow-sm"
               style={{ backgroundColor: currentTheme.buttonSecondary, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}>
            {productData.visible ? 'Yes' : 'No'}
          </div>
        </div>
      </div>

      {/* Gender - rendered only for fashion */}
      {(productData.niche === 'fashion' || productData.niche === 'perfumes' ) && (
        <div>
          <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>Gender</label>
          <div className="w-full px-5 py-4 rounded-xl font-semibold shadow-sm"
               style={{ backgroundColor: currentTheme.buttonSecondary, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}>
            {productData.gender || 'Not set'}
          </div>
        </div>
      )}

      {/* Featured Checkbox */}
      <div className="flex flex-wrap gap-8 pt-4">
        <label className="flex items-center group cursor-pointer">
          <div className="relative">
            <input type="checkbox" checked={productData.isFeatured} disabled
                   className="w-6 h-6 rounded-lg cursor-not-allowed transition-all duration-200"
                   style={{ accentColor: currentTheme.accent }} />
          </div>
          <span className="ml-3 text-sm font-bold uppercase tracking-wide" style={{ color: currentTheme.text }}>Featured Product</span>
        </label>
      </div>
    </div>
  );
};

export default ProductInfoDisplay;
