import React from 'react';
import { Tag, Layers, Star, Heart, Image , Ruler, Users, Sparkles, Sun, Globe } from "lucide-react";
import { useProductDataCtx } from '@/contextHooks/sharedhooks/useProductDataCtx';
import { useColorsCtx } from '@/contextHooks/useColorsCtx';
import SkuDisplayBoard from '@/components/SkuDisplayBoard';
import { FashionProduct, ProductDataGlobal } from '@/types/productsTypes';

const FashionReadonlyDisplay: React.FC = () => {
  const { productData } = useProductDataCtx();
  const { currentTheme } = useColorsCtx();

  if (!productData) return null;

  return (
    <div className="space-y-8">

      {/* Base Information */}
      <div>
        <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
          Product Thumbnail
        </label>
        <div className="h-1 w-12 rounded-full mb-6" style={{ background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})` }}></div>

        <div className="flex items-center gap-6">
          {productData?.thumbnail ? (
            <div className="relative group">
              <img
                src={productData.thumbnail}
                alt="Product thumbnail"
                className="w-40 h-40 object-cover rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                style={{ borderWidth: '3px', borderColor: currentTheme.border }}
              />
            </div>
          ) : (
            <div className="w-40 h-40 flex items-center justify-center rounded-2xl shadow-lg" style={{ backgroundColor: currentTheme.buttonSecondary }}>
              <Image className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>Product Name</label>
          <div className="h-1 w-12 rounded-full mb-6" style={{ background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})` }}></div>
          <div className="w-full px-5 py-4 rounded-xl font-semibold shadow-sm"
               style={{ backgroundColor: currentTheme.buttonSecondary, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}>
            {productData?.name || 'Not set'}
          </div>
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>Brand</label>
          <div className="h-1 w-12 rounded-full mb-6" style={{ background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})` }}></div>
          <div className="w-full px-5 py-4 rounded-xl font-semibold shadow-sm"
               style={{ backgroundColor: currentTheme.buttonSecondary, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}>
            {productData?.brand || 'Not set'}
          </div>
        </div>
      </div>

      {/* Prices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {['price', 'compareAtPrice', 'costPrice'].map((field, idx) => {
          const typedField = field as 'price' | 'compareAtPrice' | 'costPrice';
          return(<div key={idx}>
            <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
              {field === 'price' ? 'Price' : field === 'compareAtPrice' ? 'Compare At Price' : 'Cost Price'}
            </label>
            <div className="h-1 w-12 rounded-full mb-6" style={{ background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})` }}></div>
            <div className={`w-full px-5 py-4 rounded-xl font-semibold shadow-sm ${field === 'price' ? 'text-lg font-bold text-accent' : ''}`}
                 style={{ backgroundColor: currentTheme.buttonSecondary, color: field === 'price' ? currentTheme.accent : currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}>
              {productData?.[typedField] ? `$${productData[typedField]}` : 'Not set'}
            </div>
          </div>
        )})}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>Category</label>
        <div className="h-1 w-12 rounded-full mb-6" style={{ background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})` }}></div>
        <div className="w-full px-5 py-4 rounded-xl font-semibold shadow-sm"
             style={{ backgroundColor: currentTheme.buttonSecondary, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}>
          {productData?.category?.length ? productData.category.join(', ') : 'Not set'}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>Description</label>
        <div className="h-1 w-12 rounded-full mb-6" style={{ background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})` }}></div>
        <div className="w-full px-5 py-4 rounded-xl font-medium leading-relaxed shadow-sm min-h-[150px]"
             style={{ backgroundColor: currentTheme.buttonSecondary, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}>
          {productData?.description || 'Not set'}
        </div>
      </div>

      {/* Media */}
      <div>
        <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>Media (Images / Video)</label>
        <div className="h-1 w-12 rounded-full mb-6" style={{ background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})` }}></div>
        <div className="flex gap-4">
          {productData?.covers?.length ? productData.covers.map((img, idx) => (
            <img key={idx} src={img.path} alt={`media-${idx}`} className="w-32 h-32 object-cover rounded-lg shadow" />
          )) : <span className="text-gray-500">No images</span>}
        </div>
        {productData?.video && (
          <video controls className="w-full mt-4 rounded-lg">
            <source src={productData.video} />
          </video>
        )}
      </div>

      {/* attribues display */}
       <div>
        <ProductAttributesDisplay productData={productData!} />
       </div>
      {/* Fashion Variants / Attributes */}
      <ProductvariantsDisplay productData={productData!} />

      {/* Tags + SKU */}
      <div>
        <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>Tags</label>
        <div className="border border-dashed rounded-lg p-6 min-h-[120px]" style={{ backgroundColor: '#f9fafb', borderColor: '#d1d5db' }}>
          {productData?.tags?.length ? (
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
            </div>
          )}
        </div>
      </div>
  
      <div>
        <SkuDisplayBoard sku={productData.sku} /> 
      </div>

    </div>
  );
};

export default FashionReadonlyDisplay;


interface FashionSectionProps {
  productData: ProductDataGlobal;
}
const ProductvariantsDisplay = ({ productData }: FashionSectionProps) => {
  const { currentTheme } = useColorsCtx();
  if(!productData || productData.niche !== 'fashion') return null;
  const data = productData as FashionProduct ;
 
  return (
    <div className="space-y-10 p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="h-1 w-12 rounded-full" style={{ background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})` }}></div>
        <h3 className="text-2xl font-bold pt-4 pb-1" style={{ color: currentTheme.text }}>Fashion Variants</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productData.variants.map((variant, idx) => (
          <div key={idx} className="group relative overflow-hidden rounded-xl p-6 shadow-lg border transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
               style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
            
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                 style={{ background: `linear-gradient(135deg, ${currentTheme.accent}08, transparent)` }}></div>
            
            <div className="relative z-10 space-y-4">
              {/* Color */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Heart size={16} style={{ color: currentTheme.accent }} strokeWidth={2.5} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.textMuted }}>Color</span>
                </div>
                <div className="text-base font-semibold" style={{ color: currentTheme.text }}>
                  {variant?.attributes?.color?.name || "Not set"}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Star size={16} style={{ color: currentTheme.accent }} strokeWidth={2.5} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.textMuted }}>Sizes</span>
                </div>
                <div className="text-base font-semibold" style={{ color: currentTheme.text }}>
                  {variant.attributes.sizes?.length ? 
                  variant.attributes.sizes.map(size => size.name).join(', ')
                  
                  
                  : "Not set"}
                </div>
              </div>

             

              {/* Covers */}
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: currentTheme.textMuted }}>Covers</span>
                <div className="flex gap-2 flex-wrap">
                  {variant.attributes.covers?.length ? variant.attributes.covers.map((cover, i) => (
                    <img key={i} src={"url" in cover ? cover.url : cover.path} alt={`cover-${i}`} className="w-20 h-20 object-cover rounded-lg shadow" />
                  )) : (
                    <div className="w-20 h-20 flex items-center justify-center rounded-lg shadow" style={{ backgroundColor: currentTheme.buttonSecondary }}>
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute bottom-0 right-0 w-20 h-20 rounded-tl-full opacity-5" 
                 style={{ background: `linear-gradient(to top left, ${currentTheme.accent}, transparent)` }}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductAttributesDisplay = ({ productData }: FashionSectionProps) => {
  const { currentTheme } = useColorsCtx();
  if(!productData || productData.niche !== 'fashion') return null;

  const attributeCard = (title: string, value: string | string[], Icon: React.ElementType) => (
    <div className="group relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
         style={{ backgroundColor: currentTheme.card, border: `1px solid ${currentTheme.border}` }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
           style={{ background: `linear-gradient(135deg, ${currentTheme.accent}08, transparent)` }}></div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Icon size={18} style={{ color: currentTheme.accent }} strokeWidth={2.5} />
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.textMuted }}>{title}</span>
        </div>
        <div className="text-base font-semibold" style={{ color: currentTheme.text }}>
          {Array.isArray(value) ? (value.length ? value.join(', ') : "Not set") : (value || "Not set")}
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-20 h-20 rounded-tl-full opacity-5" 
           style={{ background: `linear-gradient(to top left, ${currentTheme.accent}, transparent)` }}></div>
    </div>
  );

  return (
    <div className="space-y-10 p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="h-1 w-12 rounded-full" 
             style={{ background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})` }}></div>
        <h3 className="text-2xl font-bold pt-4 pb-1" style={{ color: currentTheme.text }}>Product Attributes</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {attributeCard("Materials", productData.materials.map(m => m.name) || [], Layers)}
        {attributeCard("Fit Types", productData.fits.map(m => m.name) || [], Ruler)}
        {attributeCard("Gender", productData.gender || [], Users)}
        {attributeCard("Styles", productData.styles || [], Sparkles)}
        {attributeCard("Season", productData.season || [], Sun)}
        {/* {attributeCard("Country of Origin", productData.madeCountry.name || "Not set", Globe)} */}
      </div>
    </div>
  );
};