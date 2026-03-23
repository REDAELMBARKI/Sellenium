import React, { useState } from 'react';
import { ProductCardMaster } from './ProductCardMaster';
import { ProductClient } from '@/types/clientSideTypes';

const FILTERS = [
  { key: '*', label: 'All Products' },
  { key: 'women', label: 'Women' },
  { key: 'men', label: 'Men' },
  { key: 'bag', label: 'Bags' },
  { key: 'shoes', label: 'Shoes' },
  { key: 'watches', label: 'Watches' },
  { key: 'beauty', label: 'Beauty' },
];

// Fake data — swap with backend props later
const FAKE_PRODUCTS: ProductClient[] = [
  {
    id: 1,
    name: 'Esprit Ruffle Shirt',
    price: 16.64,
    originalPrice: 23,
    image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'women',
    rating: 4.5,
    reviews: 12,
    brand: 'Esprit',
  },
  {
    id: 2,
    name: 'Herschel Supply Co.',
    originalPrice: 40,
    price: 35.31,
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'bag',
    rating: 4.2,
    reviews: 8,
    brand: 'Herschel',
  },
  {
    id: 3,
    name: 'Only Check Trouser',
    originalPrice: 34,
    price: 25.5,
    image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'men',
    rating: 4.8,
    reviews: 15,
    brand: 'Only',
    badge: 'hot',
  },
  // Featured card (spans 2 cols)
  {
    id: 4,
    name: 'Diamond Pavé Choker Necklace',
    price: 1290,
    originalPrice: 1800,
    image: 'https://images.pexels.com/photos/2422276/pexels-photo-2422276.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'women',
    rating: 4.9,
    reviews: 22,
    brand: 'Maison Noir',
    description:
      'Handcrafted with ethically sourced diamonds. A statement piece for the modern romantic.',
    badge: 'new',
  },
  {
    id: 5,
    name: 'Front Pocket Jumper',
    originalPrice: 234,
    price: 34.75,
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'women',
    rating: 4.3,
    reviews: 9,
    brand: 'Zara',
  },
  {
    id: 6,
    name: 'Vintage Inspired Classic',
    originalPrice: 111,
    price: 93.2,
    image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'watches',
    rating: 4.7,
    reviews: 18,
    brand: 'Timeless',
    badge: 'hot',
  },
  {
    id: 7,
    name: 'Stretch Cotton Shirt',
    originalPrice: 111,
    price: 52.66,
    image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'women',
    rating: 4.4,
    reviews: 11,
    brand: 'COS',
  },
  {
    id: 8,
    name: 'Metallic Printed Blouse',
    originalPrice: 23,
    price: 18.96,
    image: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'beauty',
    rating: 4.1,
    reviews: 7,
    brand: 'Rituel',
  },
];

// ID 4 is the featured card — always placed at position index 3
const FEATURED_ID = 4;

interface ProductsSectionProps {
  /** Optional: pass products from backend. Falls back to fake data. */
  products?: ProductClient[];
}

const ProductsSection: React.FC<ProductsSectionProps> = ({
  products = FAKE_PRODUCTS,
}) => {
  const [activeFilter, setActiveFilter] = useState('*');

  const filtered =
    activeFilter === '*'
      ? products
      : products.filter((p) => p.category === activeFilter);

  const featured = filtered.find((p) => p.id === FEATURED_ID);
  const regular = filtered.filter((p) => p.id !== FEATURED_ID);

  return (
    <section style={{ padding: '4rem 5vw' }}>
      {/* Header + filters */}
      <div style={{ textAlign: 'center', marginBottom: '2.4rem' }}>
        <p
          style={{
            fontSize: 10,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--currenththeme-accent)',
            marginBottom: 4,
          }}
        >
          Curated for you
        </p>
        <h2
          style={{
            fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
            fontSize: '2.2rem',
            fontWeight: 600,
            color: 'var(--currenththeme-text)',
            marginBottom: '1.8rem',
          }}
        >
          Trending Now
        </h2>

        {/* Filter pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
          {FILTERS.map((f) => {
            const isActive = activeFilter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                style={{
                  padding: '7px 18px',
                  borderRadius: 999,
                  border: isActive
                    ? '1px solid var(--currenththeme-accent)'
                    : '1px solid var(--currenththeme-border)',
                  background: isActive ? 'var(--currenththeme-accent)' : 'transparent',
                  color: isActive
                    ? '#fff'
                    : 'var(--currenththeme-textMuted)',
                  fontSize: 12,
                  fontWeight: 400,
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mixed grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 14,
        }}
      >
        {regular.slice(0, 3).map((p) => (
          <ProductCardMaster key={p.id} product={p} />
        ))}

        {/* Featured card spans 2 columns */}
        {featured && (
          <div style={{ gridColumn: 'span 2' }}>
            <ProductCardMaster product={featured} variant="featured" />
          </div>
        )}

        {regular.slice(3).map((p) => (
          <ProductCardMaster key={p.id} product={p} />
        ))}
      </div>

      {/* Load More */}
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <button
          style={{
            background: 'transparent',
            border: '1px solid var(--currenththeme-border)',
            color: 'var(--currenththeme-text)',
            padding: '11px 36px',
            borderRadius: 'var(--currenththeme-border-radius, 8px)',
            fontSize: 12,
            fontWeight: 400,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'border-color 0.2s, background 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              'var(--currenththeme-accent)';
            (e.currentTarget as HTMLButtonElement).style.color =
              'var(--currenththeme-accent)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              'var(--currenththeme-border)';
            (e.currentTarget as HTMLButtonElement).style.color =
              'var(--currenththeme-text)';
          }}
        >
          Load More
        </button>
      </div>
    </section>
  );
};

export default ProductsSection;