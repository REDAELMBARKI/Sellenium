import React, { useState } from 'react';
import { Tag   , Sparkles, Droplet, Flower2, Clock, Wind, Star, Heart, Layers, Image} from "lucide-react";
import { useProductDataCtx } from '@/contextHooks/product/useProductDataCtx';
import { Gender, ProductDataGlobal } from '@/types/productsTypes';
import SkuDisplay from '@/components/SkuDisplayBoard';
import SkuDisplayBoard from '@/components/SkuDisplayBoard';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';

const PerfumesReadonlyDisplay: React.FC = () => {
  const { productData } = useProductDataCtx();
      const {state :{currentTheme}} = useStoreConfigCtx()

  if(!productData) {
    return null;
  }
  return (
    <div className="space-y-8">
      {/* Base Information */}
      <div>
        
        <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
          Product Thumbnail
        </label>
        {/* under line */}
        <div 
            className="h-1 w-12 rounded-full mb-6"
            style={{
              background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})`
            }}
          ></div>

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
        <div>
          <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>Product Name</label>
           {/* under line  */}
           <div 
            className="h-1 w-12 rounded-full mb-6"
            style={{
              background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})`
            }}
          ></div>
           <div className="w-full px-5 py-4 rounded-xl font-semibold shadow-sm"
               style={{ backgroundColor: currentTheme.buttonSecondary, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}>
            {productData?.name || 'Not set'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>Brand</label>
          
           {/* under line  */}
           <div 
            className="h-1 w-12 rounded-full mb-6"
            style={{
              background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})`
            }}
          ></div>
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
       
        {/* under line  */}
           <div 
            className="h-1 w-12 rounded-full mb-6"
            style={{
              background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})`
            }}
          ></div>
        <div className="w-full px-5 py-4 rounded-xl font-semibold shadow-sm"
             style={{ backgroundColor: currentTheme.buttonSecondary, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}>
          {productData?.category?.length ? productData.category.join(', ') : 'Not set'}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>Description</label>
      {/* under line  */}
           <div 
            className="h-1 w-12 rounded-full mb-6"
            style={{
              background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})`
            }}
          ></div>
        <div className="w-full px-5 py-4 rounded-xl font-medium leading-relaxed shadow-sm min-h-[150px]"
             style={{ backgroundColor: currentTheme.buttonSecondary, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}>
          {productData?.description || 'Not set'}
        </div>
      </div>

      {/* Media Section */}
      <div>
        <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>Media (Images / Video)</label>
        {/* under line  */}
           <div 
            className="h-1 w-12 rounded-full mb-6"
            style={{
              background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})`
            }}
          ></div>
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

      {/* Perfume Attributes  on this should be relaced by fashion variants  attributes keep everything else the same */}
      <PerfumeDetailsSection productData={productData!} />

      {/* Perfume Metadata: Tags + SKU */}
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

export default PerfumesReadonlyDisplay;


interface PerfumeSectionProps {
  productData: ProductDataGlobal;
}


const PerfumeDetailsSection = ({ productData  }:PerfumeSectionProps) => {
  const { currentTheme } = useColorsCtx();
  
  if(productData?.niche !== 'perfumes') {
    return null;
  }
  const infoCard = (title:string, value : string | Gender[], Icon : React.ElementType) => (
    <div 
      className="group relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
      style={{ 
        backgroundColor: currentTheme.card,
        border: `1px solid ${currentTheme.border}`
      }}
    >
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.accent}08, transparent)`
        }}
      ></div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Icon size={16} style={{ color: currentTheme.accent }} strokeWidth={2.5} />
          <span 
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: currentTheme.textMuted }}
          >
            {title}
          </span>
        </div>
        <div 
          className="text-base font-semibold"
          style={{ color: currentTheme.text }}
        >
          {value || "Not set"}
        </div>
      </div>
      <div 
        className="absolute bottom-0 right-0 w-20 h-20 rounded-tl-full opacity-5"
        style={{
          background: `linear-gradient(to top left, ${currentTheme.accent}, transparent)`
        }}
      ></div>
    </div>
  );

  const badgeList = (notes : string[] ) => (
    <div className="flex flex-wrap gap-2">
      {notes.map((note, idx) => (
        <span
          key={idx}
          className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 cursor-default"
          style={{ 
            backgroundColor: currentTheme.bgSecondary,
            color: currentTheme.textSecondary,
            border: `1px solid ${currentTheme.border}`
          }}
        >
          {note}
        </span>
      ))}
    </div>
  );

  const noteCard = (title:string, notes : string[], Icon :  React.ElementType) => (
    <div 
      className="group relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:scale-[1.02]"
      style={{ 
        backgroundColor: currentTheme.card,
        border: `1px solid ${currentTheme.border}`,
        boxShadow: currentTheme.shadow
      }}
    >
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.accent}06, transparent)`
        }}
      ></div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Icon size={20} style={{ color: currentTheme.accent }} strokeWidth={2} />
          <span 
            className="text-sm font-bold uppercase tracking-wider"
            style={{ color: currentTheme.textSecondary }}
          >
            {title}
          </span>
        </div>
        {badgeList(notes)}
      </div>
    </div>
  );

  return (
    <div className="space-y-10 p-6 max-w-7xl mx-auto">
      {/* Perfume Details */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div 
            className="h-1 w-12 rounded-full"
            style={{
              background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})`
            }}
          ></div>
          <h3 
            className="text-2xl font-bold  pt-4 pb-1"
            style={{ color: currentTheme.text }}
          >
            Perfume Details
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {infoCard("Gender", productData?.gender, Sparkles)}
          {infoCard("Concentration", productData?.concentration ?? '', Droplet)}
          {infoCard("Fragrance Family", productData?.fragranceFamily ?? '', Flower2)}
        </div>
      </div>

      {/* Performance */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div 
            className="h-1 w-12 rounded-full"
            style={{
              background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})`
            }}
          ></div>
          <h3 
            className="text-2xl font-bold   pt-4 pb-1"
            style={{ color: currentTheme.text }}
          >
            Performance
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {infoCard("Longevity", productData?.longevity ?? '', Clock)}
          {infoCard("Sillage", productData?.sillage ?? '', Wind)}
        </div>
      </div>

      {/* Fragrance Notes */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div 
            className="h-1 w-12 rounded-full"
            style={{
              background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})`
            }}
          ></div>
          <h3 
            className="text-2xl font-bold  pt-4 pb-1"
            style={{ color: currentTheme.text }}
          >
            Fragrance Notes
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {noteCard("Top Notes", productData.topNotes || [], Star)}
          {noteCard("Middle Notes", productData.middleNotes || [], Heart)}
          {noteCard("Base Notes", productData.baseNotes || [], Layers)}
        </div>
      </div>

      {/* Volumes & Pricing */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div 
            className="h-1 w-12 rounded-full"
            style={{
              background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})`
            }}
          ></div>
          <h3 
            className="text-2xl font-bold"
            style={{ color: currentTheme.text }}
          >
            Volumes & Pricing
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {productData.volumes?.map((vol, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-xl p-6 transition-all duration-300 cursor-pointer"
              style={{ 
                backgroundColor: currentTheme.card,
              }}
            >
              <div 
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.accent}10, transparent)`,
                }}
              ></div>
              <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-3">
                <div 
                  className="text-6xl font-bold"
                  style={{ color: currentTheme.accent }}
                >
                  {vol.volume}
                </div>
                <div 
                  className="text-sm font-medium uppercase tracking-wider"
                  style={{ color: currentTheme.textMuted }}
                >
                  ml
                </div>
                <div 
                  className="w-16 h-0.5 rounded-full"
                  style={{ backgroundColor: currentTheme.accent }}
                ></div>
                <div 
                  className="text-3xl font-bold"
                  style={{ color: currentTheme.text }}
                >
                  ${vol.price}
                </div>
              </div>
              <div 
                className="absolute bottom-0 right-0 w-32 h-32 rounded-tl-full transition-transform duration-300"
                style={{
                  background: `linear-gradient(to top left, ${currentTheme.accent}15, transparent)`,
                }}
              ></div>
            </div>
          ))}
          {!productData.volumes?.length && (
            <div 
              className="col-span-full text-center py-8"
              style={{ color: currentTheme.textMuted }}
            >
              No volume/pricing information available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
